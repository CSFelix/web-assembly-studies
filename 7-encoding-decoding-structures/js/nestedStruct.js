import {
  isWasmUsable
  , wasmExports
  , wasmMemory
  , startDecodeStruct
  , startEncodeStruct
} from "./loadWasm.js";

if (isWasmUsable) {
  const nestedStructBtn = document.getElementById("nestedStructBtn");
  const nestedStructSumSpan = document.getElementById("nestedStructSumSpan");
  const nestedStructObjectSpan = document.getElementById("nestedStructObjectSpan");
  const nestedStructInputA = document.getElementById("nestedStructInputA");
  const nestedStructInputB = document.getElementById("nestedStructInputB");
  const nestedStructInputC = document.getElementById("nestedStructInputC");
  const nestedStructInputD = document.getElementById("nestedStructInputD");

  nestedStructBtn.addEventListener("click", () => {
    const valueA = nestedStructInputA.value ?? 0;
    const valueB = nestedStructInputB.value ?? 0;
    const valueC = nestedStructInputC.value ?? 0;
    const valueD = (nestedStructInputD.value || "a").charCodeAt();

    let pointer = wasmExports.createMainStruct(valueA, valueB, valueC, valueD);
    const mainstruct = startDecodeStruct("mainstruct", pointer, wasmMemory);
    pointer = wasmExports.wasmFree(pointer);

    pointer = startEncodeStruct("mainstruct", mainstruct, wasmMemory, true);
    const sum = wasmExports.sumMainStruct(pointer);
    pointer = wasmExports.wasmFree(pointer);

    nestedStructSumSpan.innerHTML = `Sum: ${sum}`;
    nestedStructObjectSpan.innerHTML = `Struct: ${JSON.stringify(mainstruct)}`;
    nestedStructInputA.focus();
  });
}
