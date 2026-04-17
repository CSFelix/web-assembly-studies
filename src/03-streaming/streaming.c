#include <emscripten.h>

int add(int a, int b);
int subtract(int a, int b);
int multiply(int a, int b);
int divide(int a, int b);

EMSCRIPTEN_KEEPALIVE
int sumOfNIntegers(int n) {
  // return n * (n + 1) / 2;
  return divide(multiply(n, add(n, 1)), 2);
}