import {
  isWasmUsable
  , wasmExports
  , wasmMemory
} from "./loadWasm.js"

if (isWasmUsable) {
  const sumButton = document.getElementById("sumButton");

  const array = new Uint32Array(wasmMemory.buffer);
  array[0] = 1;
  array[1] = 2;
  array[2] = 3;
  array[3] = 4;
  array[4] = 5;
  array[5] = 6;
  array[6] = 7;

  sumButton.addEventListener("click", () => {
    const resultSum = wasmExports.sumNumbers(0, 7);
    const resultAvg = wasmExports.avgNumbers(0, 7);

    console.clear();
    console.log("- expected SUM result:", 1 + 2 + 3 + 4 + 5 + 6 + 7);
    console.log("- wasm SUM result:", resultSum);
    console.log("---");
    console.log("- expected AVG result:", (1 + 2 + 3 + 4 + 5 + 6 + 7) / 7);
    console.log("- wasm AVG result:", resultAvg);
  });
}
