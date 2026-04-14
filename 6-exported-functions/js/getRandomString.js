import { isWasmUsable, wasmExports, decodeString } from "./loadWasm.js";

if (isWasmUsable) {
  const generateRandomStringBtn = document.getElementById("generateRandomStringBtn");
  const generateRandomStringSpan = document.getElementById("generateRandomStringSpan");
  const generateRandomStringInput = document.getElementById("generateRandomStringInput");

  generateRandomStringBtn.addEventListener("click", () => {
    console.clear();
    const stringLength = generateRandomStringInput.value || 7;

    let pointer = wasmExports.randomString(stringLength);
    const decodedString = decodeString(pointer);
    pointer = wasmExports.wasmFree(pointer);

    generateRandomStringSpan.innerHTML = `Random String: ${decodedString}`;
    generateRandomStringInput.focus();
  });
}
