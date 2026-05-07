import {
  isWasmUsable
  , wasmExports
} from "./loadWasm2.js";

if (isWasmUsable) {
  const printStringButton = document.getElementById("printStringButton");
  const printStringSpan = document.getElementById("printStringSpan");

  printStringButton.addEventListener("click", () => {
    const result = wasmExports.printString();
    printStringSpan.innerHTML = "<u>See the console!</u>";
  });
}
