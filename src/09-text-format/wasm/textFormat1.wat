(module
  ;;  *************
  ;;  ** Imports **
  ;;  *************
  (import "console" "log" (func $log (param i32))) ;; imports function 'log' from 'console' module and name it as '$log' in wasm

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

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "add" (func $add))
  (export "addDefaultValues" (func $addDefaultValues))
  (export "logNumber" (func $logNumber))
)
