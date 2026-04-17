#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>  // only to 'SIZE_MAX' be available
#include <stdbool.h> // only to 'bool' data type be imported
#include <stddef.h>  // only to 'wchar_t' data type be imported

typedef struct {
  long long value;
  char c;
} substruct;

typedef struct {
  int a;
  int b;
  substruct substructure;
} mainstruct;

int main() {
  return 0;
}

int isInvalidAllocation(size_t count, size_t size) {
  if (size == 0 || count == 0) return 1;
  return count > SIZE_MAX / size;
}

EMSCRIPTEN_KEEPALIVE
void* wasmFree(void* pointer) {
  free(pointer);
  return NULL;
}

EMSCRIPTEN_KEEPALIVE
void* wasmMalloc(size_t count, size_t size) {
  if (isInvalidAllocation(size, count)) return NULL;
  return malloc(size * count);
}

EMSCRIPTEN_KEEPALIVE
void* wasmCalloc(size_t count, size_t size) {
  if (isInvalidAllocation(size, count)) return NULL;
  return calloc(count, size);
}

EMSCRIPTEN_KEEPALIVE
void* wasmRealloc(void* pointer, size_t count, size_t size) {
  if (isInvalidAllocation(size, count)) return NULL;

  void* tempPointer = realloc(pointer, size * count);
  return tempPointer == NULL ? NULL : tempPointer;
}

/////

EMSCRIPTEN_KEEPALIVE
mainstruct* createMainStruct(int numberA, int numberB, long long value, char character) {
  mainstruct* pointer = wasmMalloc(1, sizeof(mainstruct));
  if (pointer == NULL) return NULL;

  pointer->a = numberA;
  pointer->b = numberB;
  pointer->substructure.value = value;
  pointer->substructure.c = character;
  return pointer;
}

EMSCRIPTEN_KEEPALIVE
int sumMainStruct(mainstruct* pointer) {
  return pointer->a
    + pointer->b
    + pointer->substructure.value
    + pointer->substructure.c;
}
