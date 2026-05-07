(module
  ;;  *************
  ;;  ** Imports **
  ;;  *************
  (import "console" "logString" (func $logString (param i32 i32)))

  ;;  **************
  ;;  ** Memories **
  ;;  **************
  (memory $memory 10 100) ;; initial: 10pages; maximum: 100 pages

  ;;  ***********
  ;;  ** Datas **
  ;;  ***********
  (data $memory        ;; accessing the memory 'memory' (memory with index 0)
    (i32.const 0)      ;; starting at address 0
    "goku\n"           ;; writing "goku\n" from offset 0 to 4
    "vegeta\n"         ;; writing "vegeta\n" from offset 5 to 11
    "broly\n"          ;; writing "broly\n" from offset 12 to 17
    "\00"              ;; writing the terminator characters in hex (\00) at offset 18
  )

  ;;  ***************
  ;;  ** Functions **
  ;;  *************** 
  (func $printString (result i32)
    i32.const 0         ;; (offset) - stack: [0]
    i32.const 18        ;; (length) - stack: [0, 18]
    call $logString     ;; stack: []

    i32.const 0         ;; stack: [0]
  )

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "printString" (func $printString))
  (export "memory" (memory $memory))
)
