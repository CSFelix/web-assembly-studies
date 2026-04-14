import { wasmExports, wasmMemory, isWasmUsable, decodeString } from "./loadWasm.js";

if (isWasmUsable) {
  const getHelloWorldBtn = document.getElementById("getHelloWorldBtn");
  const getHelloWorldSpan = document.getElementById("getHelloWorldSpan");

  getHelloWorldBtn.addEventListener("click", () => {
    const pointer = wasmExports.getHelloWorld();
    const stringMessage = decodeString(pointer);
    getHelloWorldSpan.innerHTML= `Message: ${stringMessage}`;
  });
}
