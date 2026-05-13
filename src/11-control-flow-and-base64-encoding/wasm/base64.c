#include <emscripten.h>

// array with 64 letters + terminator char
char base64Table[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void base64EncodeValues(unsigned char* data, int length, unsigned int* output) {
  for (int offsetInput = 0, offsetOutput = 0; offsetInput < length;) {
    // iterating through three octets
    unsigned int octetA = offsetInput < length ? *(data + offsetInput++) : 0; // 8 bits
    unsigned int octetB = offsetInput < length ? *(data + offsetInput++) : 0; // 8 bits
    unsigned int octetC = offsetInput < length ? *(data + offsetInput++) : 0; // 8 bits
    unsigned int octetConcat = (octetA << 16) | (octetB << 8) | (octetC << 0); // 24 bits

    // extracting the 6 bits groups and then converting into four base 64 characters
    output[offsetOutput++] = *(base64Table + ((octetConcat >> 18) & 0x3f));
    output[offsetOutput++] = *(base64Table + ((octetConcat >> 12) & 0x3f));
    output[offsetOutput++] = *(base64Table + ((octetConcat >> 6) & 0x3f));
    output[offsetOutput++] = *(base64Table + ((octetConcat >> 0) & 0x3f));
  }
}

void base64AddPaddingBits(unsigned int* output, int lengthOutput, int padding) {
  for (int paddingOffset = 0; paddingOffset < padding; paddingOffset++) {
    *(output + lengthOutput - 1 - paddingOffset) = '=';
  }
}

EMSCRIPTEN_KEEPALIVE
int base64Encode(unsigned char* data, int length, unsigned int* output) {
  /*
    Base 64 Step-by-Step:

    - "Hello"  >> string
    - { 'H', 'e', 'l', 'l', 'o' }  >> array of chars
    - { 72, 101, 108, 108, 111 }  >> array of chars in ascii code
    - { 01001000, 01100101, 01101100, 01101100, 01101111 }  >> array of chars in binary
    - { 010010, 000110, 010101, 101100, 011011, 000110, 111100 }  >> array of chars in groups of 6 bits (the last bit is complemented with zeros to the right in order to have 6 bits)
    - { 18, 6, 21, 44, 27, 6, 60 }  >> previous array converted back to decimal
    - { 'S', 'G', 'V', 's', 'b', 'G', '8' }  >> previous array converted into chars
    - "SGVsbG8="  >> string (since we added zeros to the last group, we should add an '=' sign at the end)

    Base64 strings contains 4 characters (4 bytes) for each 3 bytes, resulting in a increase
  of 33.33% from the original data.
  */
  int lengthOutput = 4 * ((length + 2) / 3);
  int padding = length % 3;

  base64EncodeValues(data, length, output);
  base64AddPaddingBits(output, lengthOutput, padding);

  return lengthOutput;
}

int main() {
  return 0;
}
