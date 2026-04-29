# EMSDK Setup

- Installing in Machine (Windows):

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
emsdk install latest
emsdk activate latest
emsdk_env.bat
```

- Installing in Machine (Linux):

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```
**OBS.:** do not forget to add `emsdk directory ($LibraryDirectory\emsdk)` into the `variables path` of your OS.

---

- Activating Project Folder:

```bash
cd <project_folder>
emsdk activate
emcc -v
```

---

- Compiling:

```bash
emcc <fileName.extension> -o <newFileName.extension> -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=[ccall]

emcc <fileName.extension> -o <newFileName.extension> -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS=[cwrap]

emcc <fileName.extension> -o <newFileName.extension> -s NO_EXIT_RUNTIME=1 -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'

emcc <fileName.extension> --js-library <jsLibraryName.extension> -o <newFileName.extension>

emcc <fileName.extension> -s STANDALONE_WASM=1 -o <newFileName.extension>
```

\ emcc <fileName.extension>: invokes emcc to compile the specified file

\ -o <newFileName.extension>: assigns the output file name

\ -s NO_EXIT_RUNTIME=1: keeps the runtime alive even when `main()` function finishes. The default value is 0 and the runtime is finished together with `main()` function

\ -s EXPORTED_RUNTIME_METHODS=[ccall]: turns the `ccall` and `cwrap` method available in JavaScript. `ccall` and `cwrap` are helpers that allow JavaScript calls C exported functions. In order to it to work, we need to keep the runtime alive

\ --js-library <jsLibraryName.extension>: imports JavaScript code to be using into C by WebAssembly

\ -s STANDALONE_WASM=1: compiles the C code into wasm directly without needing the glue code. It's recommended when you import the wasm file manually into HTML-JS. Besides, in this mode we don't need to use --js-library;
