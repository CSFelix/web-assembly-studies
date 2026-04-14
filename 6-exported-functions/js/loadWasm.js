import { wasmImports } from "./wasmUtils.js";

const fetchWasmFile = async (path) => {
  try {
    return fetch(path);
  }
  catch (exception) {
    console.log("fetchWasmFile exception:", exception);
    return null;
  }
};

const currentTime = () => {
  return Date.now();
};

const logProgress = (proportion) => {
  const progress = (proportion * 100).toFixed(2);
  console.log(`- Progress: ${progress}%`);
};

const wasmExportsPromise = (async () => {
  const wasmFile = await fetchWasmFile("./wasm/exported-functions.wasm");

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
      , currentTime
      , logProgress
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

const encodeArray = (array, length, sizeof = 1) => {
   // 'sizeof' bytes for each element ('length' elements will be stored)
  const pointer = wasmExports.wasmMalloc(sizeof * length);

  if (!pointer) {
    console.log("encodeArray null pointer.");
    return pointer;
  }

  let encodedArray = null;
  if (sizeof === 8) encodedArray = new BigUint64Array(wasmMemory.buffer, pointer);
  else if (sizeof === 4) encodedArray = new Uint32Array(wasmMemory.buffer, pointer);
  else if (sizeof === 2) encodedArray = new Uint16Array(wasmMemory.buffer, pointer);
  else encodedArray = new Uint8Array(wasmMemory.buffer, pointer);

  for (let offset = 0; offset < length; offset++) encodedArray[offset] = array[offset];
  
  return pointer;
};

const decodeString = (pointer) => {
  const bytes = new Uint8Array(wasmMemory.buffer, pointer);
  const stringLength = bytes.findIndex(value => value === 0);
  const stringBytes = bytes.slice(0, stringLength);
  return new TextDecoder("utf8").decode(stringBytes);
};

export { wasmExports, wasmMemory, isWasmUsable, encodeArray, decodeString };
