import {
  isWasmUsable
  , wasmExports
} from "./loadWasm2.js";

if (isWasmUsable) {
  const printStringButton = document.getElementById("printStringButton");
  const printStringSpan = document.getElementById("printStringSpan");

  printStringButton.addEventListener("click", () => {
    wasmExports.printStringLength();
    wasmExports.printString();
    printStringSpan.innerHTML = "<u>See the console!</u>";
  });
}
