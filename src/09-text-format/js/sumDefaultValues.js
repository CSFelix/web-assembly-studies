import {
  isWasmUsable
  , wasmExports
} from "./loadWasm1.js";

if (isWasmUsable) {
  const defaultValueButton = document.getElementById("defaultValueButton");
  const defaultValueSpan = document.getElementById("defaultValueSpan");
  const defaultValueSeeConsoleSpan = document.getElementById("defaultValueSeeConsoleSpan");

  defaultValueButton.addEventListener("click", () => {
    const result = wasmExports.addDefaultValues();
    defaultValueSpan.innerHTML = `Result Add Default Values: <b>${result}</b>`;

    wasmExports.logNumber(result);
    defaultValueSeeConsoleSpan.innerHTML = "<u>See console to check the result!</u>";
  });
}
