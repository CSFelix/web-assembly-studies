import { wasmMemory, wasmExports, isWasmUsable } from "./loadWasm.js";

if (isWasmUsable) {
  const numberBtn = document.getElementById("numberBtn");
  const numberSpan = document.getElementById("numberSpan");
  const numberAInput = document.getElementById("numberAInput");
  const numberBInput = document.getElementById("numberBInput");
  const numberCInput = document.getElementById("numberCInput");

  numberBtn.addEventListener("click", () => {
    const numberAValue = numberAInput.value ?? 0;
    const numberBValue = numberBInput.value ?? 0;
    const numberCValue = numberCInput.value ?? 0;

    let pointer = wasmExports.wasmMalloc(3, 4);
    if (!pointer) {
      console.log("sum null pointer.");
      return;
    }

    let buffer = new Int32Array(wasmMemory.buffer, pointer, 2);
    buffer[0] = numberAValue;
    buffer[1] = numberBValue;

    buffer = new Float32Array(wasmMemory.buffer, pointer + 8, 1); // offset two integers (8 bytes)
    buffer[0] = numberCValue;

    const sum = wasmExports.sumNumbers(pointer);
    numberSpan.innerHTML = `Sum Result: ${sum}`;
    pointer = wasmExports.wasmFree(pointer);
    numberAInput.focus();
  });
}
