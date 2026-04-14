import { wasmExports, wasmMemory, isWasmUsable } from "./loadWasm.js";

if (isWasmUsable) {
  const getHelloWorldBtn = document.getElementById("getHelloWorldBtn");
  const getHelloWorldSpan = document.getElementById("getHelloWorldSpan");

  getHelloWorldBtn.addEventListener("click", () => {
    const pointer = wasmExports.getHelloWorld();

    // get the bytes block from the position of the first character of the string
    // where the pointer points. Besides, each character is represented by
    // 8 bits (1 byte)
    const bytes = new Uint8Array(wasmMemory.buffer, pointer);

    // strings are terminated with \0 character (0 -> int)
    const stringLength = bytes.findIndex(value => value === 0);
    const stringBytes = bytes.slice(0, stringLength);
    const stringMessage = new TextDecoder("utf8").decode(stringBytes);

    getHelloWorldSpan.innerHTML= `Message: ${stringMessage}`;
  });
}
