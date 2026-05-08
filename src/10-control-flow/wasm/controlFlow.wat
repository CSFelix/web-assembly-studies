(module
  ;; *************
  ;; ** Imports **
  ;; *************
  (import "console" "logNumber" (func $logNumber (param i32)))

  ;; **************
  ;; ** Memories **
  ;; **************
  (memory $memory 1)

  ;; ***************
  ;; ** Functions **
  ;; ***************
  (func $sumNumbers
    (param $offset i32)  ;; (0) array offset
    (param $length i32)  ;; (1) number of integers into array
    (result i32)         ;; (2) the sum of integers

    i32.const 256
    local.set 2
  )

  ;; *************
  ;; ** Exports **
  ;; *************
  (export "memory" (memory $memory))
  (export "sumNumbers" (func $sumNumbers))
)
