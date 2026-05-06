(module
  ;;  *************
  ;;  ** Imports **
  ;;  *************
  (import "console" "log" (func $log (param i32))) ;; imports function 'log' from 'console' module and name it as '$log' in wasm
  (import "console" "logString" (func $logString (param i32 i32)))

  ;;  **************
  ;;  ** Memories **
  ;;  **************
  (memory $exportedMemory 256 512) ;; initial: 256 pages (16MB); maximum: 512 pages (32MB)

  ;;  ***********
  ;;  ** Datas **
  ;;  ***********
  (data 0              ;; accessing the memory with index 0 ('exportedMemory')
    (i32.const 0)      ;; starting at address 0
    "goku"             ;; writing "goku" from offset 0 to 3
    "vegeta"           ;; writing "vegeta" from offset 4 to 9
    "broly"            ;; writing "broly" from offset 10 to 14
    "\00"              ;; writing the terminator character in hex (\00) at offset 15
  )

  ;;  ***************
  ;;  ** Functions **
  ;;  ***************
  (func $add (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p1  ;; stack: [$p1]
    local.get $p2  ;; stack: [$p1, $p2]
    i32.add        ;; stack: [$p1 + $p2]
  )

  (func $addDefaultValues (result i32)
    i32.const 42        ;; stack: [42]
    i32.const 50        ;; stack: [42, 50]
    call $add           ;; stack: [92]
  )

  (func $logNumber (param $p1 i32)
    local.get $p1       ;; stack [$p1]
    call $log           ;; stack []
  )
  
  (func $printString (result i32)
    i32.const 0         ;; (offset) - stack: [0]
    i32.const 15        ;; (length) - stack: [0, 15]
    call $logString     ;; stack: []

    i32.const 0         ;; stack: [0]
  )

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "add" (func $add))
  (export "addDefaultValues" (func $addDefaultValues))
  (export "logNumber" (func $logNumber))
  (export "printString" (func $printString))
  (export "exportedMemory" (memory $exportedMemory))
)
