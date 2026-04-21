import {
  isWasmUsable
  , wasmExports
  , wasmMemory
  , startDecodeStruct
  , startEncodeStruct
} from "./loadWasm.js";

if (isWasmUsable) {
  const structureAlignmentBtn = document.getElementById("structureAlignmentBtn");
  const structureAlignmentSumSpan = document.getElementById("structureAlignmentSumSpan");
  const structureAlignmentObjectSpan = document.getElementById("structureAlignmentObjectSpan");
  const structureAlignmentInputA = document.getElementById("structureAlignmentInputA");
  const structureAlignmentInputB = document.getElementById("structureAlignmentInputB");
  const structureAlignmentInputC = document.getElementById("structureAlignmentInputC");
  const structureAlignmentInputD = document.getElementById("structureAlignmentInputD");

  structureAlignmentBtn.addEventListener("click", () => {
    const valueA = structureAlignmentInputA.value ?? 0;
    const valueB = structureAlignmentInputB.value ?? 0;
    const valueC = structureAlignmentInputC.value ?? 0;
    const valueD = (structureAlignmentInputD.value || "a").charCodeAt();

    let pointer = wasmExports.createMainStruct(valueA, valueB, valueC, valueD);
    const mainstruct = startDecodeStruct("mainstruct", pointer, wasmMemory);
    pointer = wasmExports.wasmFree(pointer);

    pointer = startEncodeStruct("mainstruct", mainstruct, wasmMemory, true);
    const sum = wasmExports.sumMainStruct(pointer);
    pointer = wasmExports.wasmFree(pointer);

    structureAlignmentSumSpan.innerHTML = `Sum: ${sum}`;
    structureAlignmentObjectSpan.innerHTML = `Struct: ${JSON.stringify(mainstruct)}`;
    structureAlignmentInputA.focus();
  });
}
