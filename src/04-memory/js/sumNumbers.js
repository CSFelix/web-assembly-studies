import { wasmExports, isWasmUsable } from "./loadWasm.js";

if (isWasmUsable) {
  const sumNumbersBtn = document.getElementById("sumNumbersBtn");
  const sumNumbersInput = document.getElementById("sumNumbersInput");
  const sumNumbersSpan = document.getElementById("sumNumbersSpan");

  sumNumbersBtn.addEventListener("click", () => {
    const sumNumbersInputValue = sumNumbersInput.value ?? 0;
    const result = wasmExports.sumNumbers(sumNumbersInputValue);
    
    sumNumbersSpan.innerText = `Sum Numbers Result: ${result}`;
    sumNumbersInput.focus();
  });
}
