import { wasmExports, wasmMemory, isWasmUsable } from "./loadWasm.js";

if (isWasmUsable) {
  const sumArrayBtn = document.getElementById("sumArrayBtn");
  const sumArraySpan = document.getElementById("sumArraySpan");

  sumArrayBtn.addEventListener("click", () => {
    const array = new Uint32Array(wasmMemory.buffer);
    for (let index = 0; index < 10; index++) array[index] = index * 2;

    const result = wasmExports.sumArray(array, 10);
    sumArraySpan.innerText = `Sum Array Result: ${result}`;
  });
}
