import {
  isWasmUsable
  , wasmExports
  , wasmMemory
  , startDecodeStruct
  , encodePointer
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
    console.clear();
    
    const valueA = structureAlignmentInputA.value ?? 0;
    const valueB = structureAlignmentInputB.value ?? 0;
    const valueC = structureAlignmentInputC.value ?? 0;
    const valueD = (structureAlignmentInputD.value || "a").charCodeAt();

    const mainstruct = {
      a: valueA
      , b: valueB
      , substructure: {
        value: valueC
        , c: valueD
      }
      , pointer: 15
      , pointerOfPointer: 30
      , intArray: [1, 2, 3, -4, 5, 6, -7]
      , lengthArray: 7
    };

    let pointer = encodePointer("mainstruct", mainstruct, wasmMemory, true);
    const sum = wasmExports.sumMainStruct(pointer);
    
    console.log("- integer from pointer:", wasmExports.getIntegerFromPointer(pointer));
    console.log("- integer from pointer of pointer:", wasmExports.getIntegerFromPointerOfPointer(pointer));
    console.log("- intArray terminator sum:", wasmExports.sumArrayTerminator(pointer));
    console.log("- intArray sum:", wasmExports.sumArray(pointer));

    pointer = wasmExports.wasmFree(pointer);
    
    structureAlignmentSumSpan.innerHTML = `Sum: ${sum}`;
    structureAlignmentObjectSpan.innerHTML = `Struct: ${JSON.stringify(mainstruct)}`;
    structureAlignmentInputA.focus();
  });
}
