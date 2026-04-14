# Web Assembly Flow

> Steps:

- `emcc` compiles C/C++ codes into Web Assembly (wasm) and generates the `glue code` (JS)

- the `glue code` is imported into HTML file and is responsible to load and instantiate the Web Assembly Module; to map C/C++ and JS types and objects via Web Assembly heap memory; to manage memory between C/C++ and JS; and to manage the app interaction with Web Assembly via exported functions through `ccall` and `cwrap` helpers

> Exported Functions:

- `ccall` looks up the C/C++ function into the Web Assembly file, converts the JS call into C/C++, executes the function using C/C++, gets the result, converts the result data type from C/C++ to JS and returns the result in JS. The function is looked up wasm file every time we call the function;

- `cwrap` looks up the C/C++ function into the Web Assembly file and wraps it in a JS file. When we call this JS wrapper function, the glue code converts the JS call into a C/C++ call, executes the function using C/C++, gets the result, converts the result data type from C/C++ to JS and returns the result in JS. The function is looked up once and we call the wrapper function instead of the C/C++ function directly, turning out to be faster and performant.

- `streaming`: you must control the file loading and instantiation and then extract the exported functions by accessing  `results.instance.exports`. This process is done once. After that, when we call the function, the JS call is converted into a C/C++ call, executes the function using C/C++, gets the result, converts the result data type from C/C++ to JS and returns the result ins JS.

With streaming, we do not need to compile the C/C++ file with `NO_EXIT_RUNTIME` and `EXPORTED_RUNTIME_METHODS`, but we need to assign the `EMSCRIPTEN_KEEPALIVE` decorator in the functions we will use.

---

> Streaming Miscellaneous

- no streaming: downloads full wasm file and then compile
- streaming: downloads the wasm file in chunks and compile them (parallelism)

- using WebAssembly in streaming mode without the glue code can trigger 'wasi_snapshot_preview1' error if you are using any C functions that interacts directly with the OS functions, such as I/O (printf, scanf...) and you did not provided the 'wasi' interface.

- in order to solve it, we can: 1) do not use these kind of functions; 2) inform the 'wasi' interface manually like this:

```js
import { WASI } from "wasi";

const wasi = new WASI();

let exports = null;

WebAssembly.instantiateStreaming(
	fetch(
		"./myFile.wasm", { wasi_snapshot_preview1: wasi.wasiImports }
	).then(results => {
		exports = results.instance.exports;
	})
);
```