(module
  ;; *************
  ;; ** Imports **
  ;; *************
  (import "console" "logNumber" (func $logNumber (param i32)))

  ;; **************
  ;; ** Memories **
  ;; **************
  (memory $memory 10 100)

  ;; ***************
  ;; ** Variables **
  ;; ***************
  (data (i32.const 0) "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")

  ;; ***************
  ;; ** Functions **
  ;; ***************
  (func $base64Encode
    (param $data i32)
    (param $length i32)
    (param $output i32)
    (result i32)

    (local $outputLength i32)    ;; base64 string length
    (local $value i32)           ;; temporary value
    (local $shiftAmount i32)     ;; amount to shift by
    (local $minShiftAmount i32)  ;; minimum amount to shift by

    i32.const 0
    local.set $outputLength

    (block $encodeBlock
      local.get $data
      local.get $length
      i32.add
      local.set $length

      ;; iterating through three octets
      ;; and extracting the 6 bits groups and then converting into four base 64 characters
      (loop $encodeLoop
        local.get $data
        local.get $length
        i32.ge_s
        br_if $encodeBlock


      )
    )

    local.get $outputLength
  )

  ;; *************
  ;; ** Exports **
  ;; *************
  (export "memory" (memory $memory))
  (export "base64Encode" (func $base64Encode))
)
