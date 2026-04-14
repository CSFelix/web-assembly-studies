#include <emscripten.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h> // only to 'bool' data type be imported
#include <stddef.h>  // only to 'wchar_t' data type be imported

typedef struct {
  int numberA;
  int numberB;
  float numberC;
} numbers;

typedef struct {
  int x;
  int y;
} point;

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
float sumNumbers(numbers* pointer) {
  return (float)(pointer->numberA + pointer->numberB) + pointer->numberC;
}

EMSCRIPTEN_KEEPALIVE
int sumPoint(point* pointer) {
  return pointer->x + pointer->y;
}

EMSCRIPTEN_KEEPALIVE
point* createPoint(int x, int y) {
  point* p = wasmMalloc(1, sizeof(point));
  if (p == NULL) return NULL;

  p->x = x;
  p->y = y; 
  return p;
}