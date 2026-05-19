import {
  isWasmUsable
  , wasmExports
} from "./loadWasm.js";

if (isWasmUsable) {
  const numberAInput = document.getElementById("numberAInput");
  const numberBInput = document.getElementById("numberBInput");

  const addButton = document.getElementById("addButton");
  const subButton = document.getElementById("subButton");
  const mulButton = document.getElementById("mulButton");
  const divButton = document.getElementById("divButton");

  const resultAddSpan = document.getElementById("resultAddSpan");
  const resultSubSpan = document.getElementById("resultSubSpan");
  const resultMulSpan = document.getElementById("resultMulSpan");
  const resultDivSpan = document.getElementById("resultDivSpan");

  const operation = (numberA, numberB, operation) => {
    let result = 0;

    if (operation === "ADD") {
      result = wasmExports.add(numberA, numberB);
      resultAddSpan.innerHTML = `Result Add: <b>${result}</b>`;
    }
    else if (operation === "SUB") {
      result = wasmExports.sub(numberA, numberB);
      resultSubSpan.innerHTML = `Result Sub: <b>${result}</b>`;
    }
    else if (operation === "MUL") {
      result = wasmExports.mul(numberA, numberB);
      resultMulSpan.innerHTML = `Result Mul: <b>${result}</b>`;
    }
    else {
      result = wasmExports.div(numberA, numberB);
      resultDivSpan.innerHTML = `Result Div (integer): <b>${result}</b>`;
    }

    numberAInput.focus();
  };

  addButton.addEventListener("click", () => operation(numberAInput.value ?? 0, numberBInput.value ?? 0, "ADD"));
  subButton.addEventListener("click", () => operation(numberAInput.value ?? 0, numberBInput.value ?? 0, "SUB"));
  mulButton.addEventListener("click", () => operation(numberAInput.value ?? 0, numberBInput.value ?? 0, "MUL"));
  divButton.addEventListener("click", () => operation(numberAInput.value ?? 0, numberBInput.value ?? 0, "DIV"));
}
