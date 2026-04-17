#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int sumNumbers(int number) {
  int sum = 0;

  while (number) {
    sum += number--;
  }

  return sum;
}

EMSCRIPTEN_KEEPALIVE
int sumArray(int* array, int offset) {
  int sum = 0;

  while (offset) {
    // sum += array[--offset];
    sum += *(array + (--offset));
  }

  return sum;
}

EMSCRIPTEN_KEEPALIVE
const char* getHelloWorld() {
  return "Hello world wasm!"; // Hello world wasm!\0
}

int main() {
  return 0;
}
