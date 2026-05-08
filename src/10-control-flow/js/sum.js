import {
  isWasmUsable
  , wasmExports
} from "./loadWasm.js"

if (isWasmUsable) {
  const sumButton = document.getElementById("sumButton");

  sumButton.addEventListener("click", () => {
    const result = wasmExports.sumNumbers();
    console.log("- result:", result);
  });
}
