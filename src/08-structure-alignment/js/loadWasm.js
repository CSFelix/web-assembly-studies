import { wasmImports } from "./wasmUtils.js";

//  *************
//  ** Loaders **
//  *************
const fetchWasmFile = async (path) => {
  try {
    return fetch(path);
  }
  catch (exception) {
    console.log("fetchWasmFile exception:", exception);
    return null;
  }
};

const wasmExportsPromise = (async () => {
  const wasmFile = await fetchWasmFile("./wasm/structure-alignment.wasm");

  if (!wasmFile) {
    console.log("WASM File not found.");
    return null;
  }

  if (!wasmFile.ok) {
    console.log("WASM File Fetch Exception:", wasmFile.status);
    return null;
  }

  const INITIAL_MEMORY_PAGES = 256; // 256 pages * 64 KiB = 16 MiB
  const MAXIMUM_MEMORY_PAGES = 512; // 512 pages * 64 KiB = 32 MiB

  const wasmMemory = new WebAssembly.Memory({
    initial: INITIAL_MEMORY_PAGES
    , maximum: MAXIMUM_MEMORY_PAGES
  });

  const resizeHeapWasm = (delta) => {
    try {
      wasmMemory.grow(delta);
      return true;
    }
    catch (exception) {
      console.log("resizeHeapWasm exception:", exception);
      return false;
    }
  };

  const instanceObject = {
    js: {
      mem: wasmMemory
    }
    , wasi_snapshot_preview1: {
      ...wasmImports
      , emscripten_resize_heap: (delta) => resizeHeapWasm(delta)
    }
  };

  try {
    const results = await WebAssembly.instantiateStreaming(wasmFile.clone(), instanceObject);
    return results?.instance.exports ?? null;
  }
  catch (exception) {
    console.log("WASM.instantiateStreaming exception:", exception);

    try {
      const wasmBytes = await wasmFile.arrayBuffer();
      const results = await WebAssembly.instantiate(wasmBytes, instanceObject);
      return results?.instance.exports ?? null;
    }
    catch (exception) {
      console.log("WASM.instantiate exception:", exception);
      return null;
    }
  }
})();

//  ************
//  ** States **
//  ************
const wasmExports = await wasmExportsPromise;
let wasmMemory = null;
let isWasmUsable = true;

if (!wasmExports) {
  console.log("WASM Exports was not loaded.");
  isWasmUsable = false;
}
else if (Object.keys(wasmExports).length === 0) {
  console.log("WASM contains no exports.");
  isWasmUsable = false;
}
else {
  wasmMemory = wasmExports.memory;
}

//  *********************
//  ** Maps and Arrays **
//  *********************
const primitiveDataTypes = [
  "char", "int", "float"
];

const typesMap = {
  // Data Types Sizes in Bytes
  "char"           :  4
  , "int"          :  4
  , "float"        :  4
};

const structsMap = {

};

//  *************
//  ** Methods **
//  *************
const encodeArray = (array, length, sizeof = 1) => {
   // 'sizeof' bytes for each element ('length' elements will be stored)
  const pointer = wasmExports.wasmMalloc(sizeof * length);

  if (!pointer) {
    console.log("encodeArray null pointer.");
    return pointer;
  }

  let encodedArray = null;
  if (sizeof === 8) encodedArray = new BigUint64Array(wasmMemory.buffer, pointer, length);
  else if (sizeof === 4) encodedArray = new Uint32Array(wasmMemory.buffer, pointer, length);
  else if (sizeof === 2) encodedArray = new Uint16Array(wasmMemory.buffer, pointer, length);
  else encodedArray = new Uint8Array(wasmMemory.buffer, pointer, length);

  for (let offset = 0; offset < length; offset++) encodedArray[offset] = array[offset];
  
  return pointer;
};

const decodeString = (pointer) => {
  const bytes = new Uint8Array(wasmMemory.buffer, pointer);
  const stringLength = bytes.findIndex(value => value === 0);
  const stringBytes = bytes.slice(0, stringLength);
  return new TextDecoder("utf8").decode(stringBytes);
};

const getTypeSize = (dataType) => {
  return dataType.endsWith("*") ? 4 : typesMap[dataType];
};

const computeStructSize = (format) => {
  return Object
    .values(format)
    .reduce((accumulator, propertyType) => accumulator + getTypeSize(propertyType), 0);
};

const registerStruct = (name, format) => {
  typesMap[name] = computeStructSize(format);
  structsMap[name] = format;
};

const encodeInteger = (value, numberBytes, buffer, offset = 0) => {
  for (let currentByte = 0; currentByte < numberBytes; currentByte++) {
    buffer[currentByte + offset] = value & 0xff;
    value >>>= 8;
  }
};

const encodeFloat = (value, memory, offset = 0, pointer = 0) => {
  const floatBuffer = new Float32Array(memory.buffer, pointer + offset);
  flaotBuffer[0] = value;
};

const encodeStruct = (dataType, objectData, buffer, memory, offset = 0, pointer = 0) => {
  const structFormat = structsMap[dataType];
  
  if (!structFormat) {
    console.log(`encodeStruct null struct format for ${dataType}`);
    return 0;
  }

  for (const [propertyName, propertyType] of Object.entries(structFormat)) {
    encodeValue(propertyType, objectData[propertyName], buffer, memory, offset, pointer);
    offset += propertyType.endsWith("*") ? 4 : typesMap[propertyType]; // TO-DO: use correct padding instead of 4 bytes
  }
};

const encodeValue = (dataType, objectData, buffer, memory, offset = 0, pointer = 0) => {
  if (dataType.endsWith("*")) {
    const pointer = encodePointer(dataType.substring(0, dataType.length - 1), objectData, memory, true);
    console.log('setting', pointer, 'at', offset);
    encodeInteger(pointer, 4, buffer, offset);
  }
  else if (primitiveDataTypes.includes(dataType)) {
    if (dataType !== "float") encodeInteger(objectData ?? 0, typesMap[dataType], buffer, offset);
    else encodeFloat(objectData ?? 0.00, memory, offset, pointer);
  }
  else {
    encodeStruct(dataType, objectData, buffer, memory, offset, pointer);
  }
};

const encodePointer = (dataType, objectData, memory, shouldUseMalloc) => {
  if (!objectData) {
    console.log("encodePointer null objectData.");
    return 0; // like NULL in C
  }

  const dataTypeSize = getTypeSize(dataType);

  if (!dataTypeSize) {
    console.log(`encodePointer invalid size (${dataTypeSize}) for data type ${dataType}`);
    return 0;
  }

  const pointer = shouldUseMalloc
    ? wasmExports.wasmMalloc(1, dataTypeSize)
    : wasmExports.wasmCalloc(1, dataTypeSize);

  if (!pointer) {
    console.log("encodePointer null pointer.");
    return pointer;
  }

  // - we will write the data as bytes, so we create a TypedArray with 8 bits each block
  // - the length (third parameter) is the structSize (in bytes)
  const buffer = new Uint8Array(memory.buffer, pointer, dataTypeSize);
  encodeValue(dataType, objectData, buffer, memory, 0, pointer);

  return pointer;
};

const decodeNumber = (numberBytes, buffer, offset = 0) => {
  let value = 0;

  // adding value <<= 8 after the or-bitwise-operator, the most significant byte
  // willbe lost in the last iteration
  for (let currentByte = numberBytes - 1; currentByte >= 0; currentByte--) {
    value <<= 8;
    value |= buffer[currentByte + offset];
  }

  return value;
};

const decodeStruct = (name, buffer, offset = 0) => {
  const structFormat = structsMap[name];

  if (!structFormat) {
    console.log(`encodeStruct no format found for ${name}`);
    return null;
  }

  let decodedStruct = {};
  let cursor = offset;

  for (const [property, type] of Object.entries(structFormat)) {
    const typeSize = typesMap[type];
    const isTypePrimitive = primitiveDataTypes.includes(type);

    if (isTypePrimitive) decodedStruct[property] = decodeNumber(typeSize, buffer, cursor);
    else decodedStruct[property] = decodeStruct(type, buffer, cursor);

    cursor += typeSize;
  }

  return decodedStruct;
};

const startDecodeStruct = (name, pointer, memory) => {
  const structSize = typesMap[name];

  if (!structSize) {
    console.log(`startDecodeStruct non existent data type: ${name}`);
    return null;
  }

  const buffer = new Uint8Array(memory.buffer, pointer, structSize);
  return decodeStruct(name, buffer, 0);
};

//  *************************
//  ** Registering Structs **
//  *************************
registerStruct(
  "substruct"
  , { "value": "int", "c": "char" }
);

registerStruct(
  "mainstruct"
  , {
    "a": "int"
    , "b": "int"
    , "substructure": "substruct"
    , "pointer": "int*"
    , "pointerOfPointer": "int**"
  }
);

export {
  wasmExports
  , wasmMemory
  , isWasmUsable
  , encodeArray
  , encodePointer
  , decodeString
  , startDecodeStruct
};
