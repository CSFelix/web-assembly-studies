const fetchWasmFile = async (path) => {
  try {
    return fetch(path);
  }
  catch (exception) {
    console.log("fetchWasmFile exception:", exception);
    return null;
  }
};

const loadWasm = async () => {
  const wasmFile = await fetchWasmFile("./wasm/memory.wasm");

  if (!wasmFile) {
    console.log("WASM File not found.");
    return null;
  }

  if (!wasmFile.ok) {
    console.log("WASM File Fetch Exception:", wasmFile.status);
    return null;
  }

  const wasmMemory = new WebAssembly.Memory({
    initial: 256    // 256 pages * 64 KiB = 16 MiB
    , maximum: 512  // 512 pages * 64 KiB = 32 MiB
  });

  const instanceObject = {
    js: { mem: wasmMemory }
  };

  try {
    const results = await WebAssembly.instantiateStreaming(wasmFile.clone(), instanceObject);
    return results?.instance.exports ?? null;
  }
  catch (exception) {
    console.log("WASM instantiateStreaming exception:", exception);
    const wasmBytes = await wasmFile.arrayBuffer();
    const results = await WebAssembly.instantiate(wasmBytes, instanceObject);
    return results?.instance.exports ?? null;
  }
};

const wasmExports = await loadWasm();
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

export { wasmExports, wasmMemory, isWasmUsable };
