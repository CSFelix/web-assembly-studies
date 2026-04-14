import { wasmExports, wasmMemory, isWasmUsable, encodeArray } from "./loadWasm.js";

if (isWasmUsable) {
  const sumArrayBtn = document.getElementById("sumArrayBtn");
  const sumArraySpan = document.getElementById("sumArraySpan");

  sumArrayBtn.addEventListener("click", () => {
    const array = [];
    for (let offset = 0; offset < 10; offset++) array[offset] = offset * 2;

    let pointer = encodeArray(array, array.length, 4);
    const result = wasmExports.sumArray(pointer, array.length);
    pointer = wasmExports.wasmFree(pointer);

    sumArraySpan.innerText = `Sum Array Result: ${result}`;
  });
}
