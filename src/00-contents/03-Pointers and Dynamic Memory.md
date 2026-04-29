# Pointers and Dynamic Memory

- Video to understand program's memories: https://www.youtube.com/watch?v=_8-ht2AKyH4

Application's Memory:

- heap: stores objects, and variables that has been moved into heap

- stack: stores function calls and local variables

- static/global: stores global and static variables

- code (text): stores the instructions to be executed

Only the `heap` is dynamic, that is, only it increases/decreases when the program is running. The other memories are static and their sizes are determined by the OS and the compiler.

C contains four main functions to manipulate the heap:

- malloc: allocs memory on heap

- calloc: allocates memory for an array of elements

- realloc: resizes a previously allocated memory block

- free: frees the allocated memory that a pointer is pointing