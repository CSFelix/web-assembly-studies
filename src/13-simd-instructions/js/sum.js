import { isWasmUsable, wasmExports, wasmMemory } from "./loadWasm.js";

if (isWasmUsable) {
  const sumButton = document.getElementById("sumButton");
  const simdSumResultSpan = document.getElementById("simdSumResultSpan");

  sumButton.addEventListener("click", () => {   
    const buffer = new Int32Array(wasmMemory.buffer);
    buffer.set([1, 2, 3, 4], 0); // store array at offset 0
    buffer.set([5, 6, 7, 8], 4); // store array at offset 4

    // - pointerArrayA: offset 0
    // - pointerArrayB: offset 16 (4 offset in store * 4 bytes size of int = 16 bytes)
    // - pointerArrayResult: offset 32 (8 offset in store * 4 bytes size of int = 32 bytes)
    wasmExports.sumSimd(0, 16, 32);

    // slice from offset 8 to 12, because:
    // - from offset 8: 8 offset in store (start of array) * 4 bytes size of int = 32 bytes
    // - to offset 12: 12 offset in store (end of array) * 4 bytes of int = 48 bytes
    const result = Array.from(buffer.slice(8, 12));
    simdSumResultSpan.innerHTML = `SIMD Result: <code>${JSON.stringify(result)}</code>`;
  });
}
