#include <emscripten.h>
#include <stdlib.h>

__attribute__((import_module("wasi_snapshot_preview1")))
__attribute__((import_name("currentTime")))
double currentTime();

__attribute__((import_module("wasi_snapshot_preview1")))
__attribute__((import_name("logProgress")))
void logProgress(double proportion);

int main() {
  return 0;
}

void* wasmMalloc(size_t memoryBlockSize) {
  return malloc(memoryBlockSize);
}

EMSCRIPTEN_KEEPALIVE
void* wasmFree(void* pointer) {
  free(pointer);
  return NULL;
}

EMSCRIPTEN_KEEPALIVE
unsigned char* randomString(int length) {
  unsigned char* pointerString = wasmMalloc(length + 1); // +1 in order to add the \0 char (EOS: End Of String)

  if (pointerString == NULL) return NULL;

  srand(currentTime());

  for (int offset = 0; offset < length; offset++) {
    // generate a printable character in ascci code
    *(pointerString + offset) = rand() % (127 - 33) + 33;
    logProgress((double)(offset + 1) / (double)length);
  }

  *(pointerString + length) = 0; // the \0 character (EOS: End Of String)
  return pointerString;
}
