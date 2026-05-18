import {
  isWasmUsable
  , wasmExports
  , wasmMemory
} from "./loadWasm.js";

if (isWasmUsable) {
  const base64WatInput = document.getElementById("base64WatInput");
  const base64WatButton = document.getElementById("base64WatButton");
  const base64WatSpan = document.getElementById("base64WatSpan");

  base64WatButton.addEventListener("click", () => {
    // ---- Generating Value ----
    const inputValue = base64WatInput.value ?? "";
    const inputLength = inputValue.length;
    
    const pointerInput = 256;
    const pointerOutput = pointerInput + inputLength + 2;

    const bufferInput = new Uint8Array(wasmMemory.buffer, pointerInput, inputLength);
    for (let offset = 0; offset < inputLength; offset++) bufferInput[offset] = inputValue.charCodeAt(offset);

    const outputLength = wasmExports.base64Encode(pointerInput, inputLength, pointerOutput);
    
    // ---- Getting Value ----
    let base64String = "";

    const bufferOutput = new Uint8Array(wasmMemory.buffer, pointerOutput, outputLength);
    for (let offset = 0; offset < outputLength && bufferOutput[offset] !== 0; offset++) {
      base64String += String.fromCharCode(bufferOutput[offset]);
    }

    base64WatSpan.innerHTML = `Result: ${base64String}`;
    base64WatInput.focus();
  });
}
