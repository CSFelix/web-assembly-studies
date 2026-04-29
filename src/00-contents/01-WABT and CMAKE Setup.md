# WABT and CMAKE Setup

- Installing WABT in Machine (Windows & Linux):

```bash
git clone --recursive https://github.com/WebAssembly/wabt
cd wabt
git submodule update --init
```

---

- Installing CMAKE in Machine (Windows):

Access the following URL [https://cmake.org/download/](https://cmake.org/download/) and download the latest version.

- Installing CMAKE in Machine (Linux):

```bash
sudo apt update
sudo apt install cmake -y
```

**OBS.:** do not forget to check `Add CMake to the PATH environment variable` during installation.

---

- Building WABT with CMAKE (Windows & Linux):

```bash
cd <wabt_directory>/wabt
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=DEBUG -DCMAKE_INSTALL_PREFIX=..\ -G "Visual Studio 18 2026"
cmake --build . --config DEBUG --target install
```

**OBS.:** do not forget to add WABT directory `<wabt_directory>/wabt/bin` into the PATH environment variable.

---

- Compiling Wat to Wasm:

```bash
wat2wasm <fileName>.wat -o <newFileName>.wasm
```

- Compiling Wasm to Wat:

```bash
wasm2wat <fileName>.wasm -o <newFileName>.wat
```
