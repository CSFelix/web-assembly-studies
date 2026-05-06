import {
  isWasmUsable
  , wasmExports
} from "./loadWasm.js";

if (isWasmUsable) {
  const sumNumberAInput = document.getElementById("sumNumberA");
  const sumNumberBInput = document.getElementById("sumNumberB");
  const sumButton = document.getElementById("sumButton");
  const sumSpan = document.getElementById("sumSpan");

  sumButton.addEventListener("click", () => {
    const numberA = sumNumberAInput.value ?? 0;
    const numberB = sumNumberBInput.value ?? 0;
    const result = wasmExports.add(numberA, numberB);

    sumSpan.innerHTML = `Result Add: ${result}`;
    sumNumberAInput.focus();
  });
}
