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
  const wasmFile = await fetchWasmFile("./wasm/structure-aligment.wasm");

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
  "char", "short", "int", "long", "long long"
  , "float", "double", "long double"
  , "bool", "size_t", "wchar_t", "void*"
];

const typesMap = {
  // Data Types Sizes in Bytes
  "char"           :  1
  , "short"        :  2
  , "int"          :  4
  , "long"         :  8
  , "long long"    :  8

  , "float"        :  4
  , "double"       :  8
  , "long double"  :  16

  , "bool"         :  1
  , "size_t"       :  8
  , "wchar_t"      :  4  // for characters that are encoded with more than one byte (accents, japanese, chinese and other chars)
  , "void*"        :  8  // pointer
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

const computeStructSize = (format) => {
  return Object
    .values(format)
    .reduce((accumulator, propertyType) => accumulator + typesMap[propertyType], 0);
};

const registerStruct = (name, format) => {
  typesMap[name] = computeStructSize(format);
  structsMap[name] = format;
};

const encodeNumber = (value, numberBytes, buffer, offset = 0) => {
  // Small Endian
  for (let currentByte = 0; currentByte < numberBytes; currentByte++) {
    buffer[currentByte + offset] = value & 0xff;
    value >>>= 8;
  }
};

const encodeStruct = (name, data, buffer, offset = 0) => {
  let cursor = offset;

  const structFormat = structsMap[name];

  if (!structFormat) {
    console.log(`encodeStruct no format found for ${name}`);
    return null;
  }

  for (const [property, type] of Object.entries(structFormat)) {
    const numberBytes = typesMap[type];
    const isTypePrimitive = primitiveDataTypes.includes(type);

    if (isTypePrimitive) encodeNumber(data[property] ?? 0, numberBytes, buffer, cursor);
    else encodeStruct(type, data[property] ?? {}, buffer, cursor);

    cursor += numberBytes;
  }
};

const startEncodeStruct = (name, data, memory, shouldUseMalloc = true) => {
  const structSize = typesMap[name];

  if (!structSize) {
    console.log(`startEncodeStruct non existent data type: ${name}`);
    return null;
  }

  const pointer = shouldUseMalloc
    ? wasmExports.wasmMalloc(1, structSize)
    : wasmExports.wasmCalloc(1, structSize);

  if (!pointer) {
    console.log("startEncodeStruct null pointer.");
    return null;
  }

  // - we will write the data as bytes, so we create a TypedArray with 8 bits each block
  // - the length (third parameter) is the structSize (in bytes)
  const buffer = new Uint8Array(memory.buffer, pointer, structSize);
  encodeStruct(name, data, buffer, 0);
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
  , { "value": "long long", "c": "char" }
);

registerStruct(
  "mainstruct"
  , { "a": "int", "b": "int", "substructure": "substruct" }
);

export {
  wasmExports
  , wasmMemory
  , isWasmUsable
  , encodeArray
  , decodeString
  , startEncodeStruct
  , startDecodeStruct
};
