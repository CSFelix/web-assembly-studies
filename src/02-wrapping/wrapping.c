#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int addIntegers(int numberA, int numberB) {
  return numberA + numberB;
}

int main() {
  printf("Web Assembly has been loaded!\n");
  return 0;
}
