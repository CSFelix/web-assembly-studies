import { wasmMemory, wasmExports, isWasmUsable, startEncodeStruct } from "./loadWasm.js";

if (isWasmUsable) {
  const pointBtn = document.getElementById("pointBtn");
  const pointSpan = document.getElementById("pointSpan");
  const pointXInput = document.getElementById("pointXInput");
  const pointYInput = document.getElementById("pointYInput");

  pointBtn.addEventListener("click", () => {
    const pointXValue = pointXInput.value ?? 0;
    const pointYValue = pointYInput.value ?? 0;

    console.log("Encoding Structure");
    let pointer = startEncodeStruct(
      "point"
      , { x: pointXValue, y: pointYValue }
      , wasmMemory
      , true
    );
    
    if (!pointer) {
      console.log("sumPointDecode null pointer.");
      return;
    }

    const sum = wasmExports.sumPoint(pointer);
    pointSpan.innerHTML = `Sum Point Result: ${sum}`;
    pointer = wasmExports.wasmFree(pointer);
    pointXInput.focus();

    console.log("Decoding Structure");

    pointer = wasmExports.createPoint(pointXValue, pointYValue);
    if (!pointer) {
      console.log("sumPointEncode null pointer.");
      return;
    }

    console.log(pointer);
    pointer = wasmExports.wasmFree(pointer);
    console.log(pointer);
  });
}
