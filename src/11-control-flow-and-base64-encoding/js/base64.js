import {
  isWasmUsable
  , wasmExports
  , wasmMemory
} from "./loadWasm.js";

if (isWasmUsable) {
  const base64CInput = document.getElementById("base64CInput");
  const base64CButton = document.getElementById("base64CButton");
  const base64CSpan = document.getElementById("base64CSpan");

  base64CButton.addEventListener("click", () => {
    // ---- Generating Value ----
    const inputValue = base64CInput.value ?? "";
    const inputLength = inputValue.length;
    
    const pointerInput = 256;
    const pointerOutput = pointerInput + inputLength + 2;

    const bufferInput = new Uint8Array(wasmMemory.buffer, pointerInput);
    for (let offset = 0; offset < inputLength; offset++) {
      bufferInput[offset] = inputValue.charCodeAt(offset);
    }

    const outputLength = wasmExports.base64Encode(pointerInput, inputLength, pointerOutput);
    
    // ---- Getting Value ----
    let base64String = "";

    const bufferOutput = new Uint8Array(wasmMemory.buffer, pointerOutput);
    for (let offset = 0; offset < outputLength; offset++) {
      base64String += String.fromCharCode(bufferOutput[offset]);
    }

    base64CSpan.innerHTML = `Result: ${base64String}`;
  });
}
