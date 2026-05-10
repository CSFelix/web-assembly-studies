#include <emscripten.h>
char base64Table[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

int base64Encode(char* data, int offset, int* output) {
  /*
    - "Hello"
    - { 'H', 'e', 'l', 'l', 'o' }
    - { 72, 101, 108, 108, 111 }
    - { 01001000, 01100101, 01101100, 01101100, 01101111 }
  */
}