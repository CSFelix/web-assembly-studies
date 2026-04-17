import {
  wasmMemory
  , wasmExports
  , isWasmUsable
  , startEncodeStruct
  , startDecodeStruct
} from "./loadWasm.js";

if (isWasmUsable) {
  const pointBtn = document.getElementById("pointBtn");
  const pointSpan = document.getElementById("pointSpan");
  const pointSpan2 = document.getElementById("pointSpan2");
  const pointXInput = document.getElementById("pointXInput");
  const pointYInput = document.getElementById("pointYInput");

  pointBtn.addEventListener("click", () => {
    const pointXValue = pointXInput.value ?? 0;
    const pointYValue = pointYInput.value ?? 0;

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

    pointer = wasmExports.createPoint(pointXValue, pointYValue);

    if (!pointer) {
      console.log("sumPointEncode null pointer.");
      return;
    }

    const struct = startDecodeStruct("point", pointer, wasmMemory);
    pointSpan2.innerHTML = `Point Struct: ${JSON.stringify(struct)}`;

    pointer = wasmExports.wasmFree(pointer);
    pointXInput.focus();
  });
}
