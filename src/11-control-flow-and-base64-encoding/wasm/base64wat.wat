(module
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

        i32.const 18
        local.set $minShiftAmount

        ;; iterating through three octets
        (block $readOctetsBlock
          i32.const 0
          local.set $value

          i32.const 16
          local.set $shiftAmount

          (loop $readOctetsLoop
            local.get $data
            local.get $length
            i32.ge_s
            br_if $readOctetsBlock

            local.get $data
            i32.load8_u      ;; loads 8 bits (1 byte) as unsigned
            local.get $shiftAmount
            i32.shl          ;; shl: shiftLeft (<<)
            local.get $value
            i32.or           ;; combine octet with existing value
            local.set $value

            ;; incrementing step
            local.get $shiftAmount
            i32.const 6
            i32.sub
            local.set $shiftAmount

            ;; decreasing 'shiftAmount'
            local.get $shiftAmount
            i32.const 8
            i32.sub
            local.set $shiftAmount

            ;; decreasing 'minShiftAmount'
            local.get $minShiftAmount
            i32.const 6
            i32.sub
            local.set $minShiftAmount

            ;; advancing cursor
            local.get $data
            i32.const 1
            i32.add
            local.set $data

            ;; loop condition: if 'shiftAmount' is != -8
            local.get $shiftAmount
            i32.const -8
            i32.ne                  ;; ne: not equals
            br_if $readOctetsLoop
          )
        )

        ;; writing four base64 characters
        (block $ouputBlock
          i32.const 18
          local.set $shiftAmount

          (loop $outputLoop
            local.get $output
            local.get $value
            local.get $shiftAmount
            i32.shr_u               ;; shr_u: shiftRight unsigned (>>>); shr: shiftRight (>>)
            i32.const 63            ;; bit mask for AND operator
            i32.and                 ;; extracting the 6 bits groups
            i32.load8_u             ;; converting into four base 64 characters
            i32.store8              ;; storing character

            ;; incrementing step
            local.get $shiftAmount
            i32.const 6
            i32.sub
            local.set $shiftAmount

            ;; incrementing length
            local.get $outputLength
            i32.const 1
            i32.add
            local.set $outputLength

            ;; incrementing cursor
            local.get $output
            i32.const 1
            i32.add
            local.set $output

            ;; looping if 'shiftAmount' is greater than 'minShiftAmount'
            local.get $shiftAmount
            local.get $minShiftAmount
            i32.ge_s
            br_if $outputLoop
          )
        )

        br $encodeLoop
      )
    )

    ;; padding bits
    (block $paddingBlock
      (loop $paddingLoop
        ;; break if there are no more characters to pad
        local.get $outputLength
        i32.const 3              ;; bit mask
        i32.and
        i32.const 0
        i32.eq                   ;; eq: equals
        br_if $paddingBlock

        ;; storing padding character
        local.get $output
        i32.const 61        ;; padding character '='
        i32.store8

        ;; incrementing step
        local.get $outputLength
        i32.const 1
        i32.add
        local.set $outputLength

        local.get $output
        i32.const 1
        i32.add
        local.set $output

        br $paddingLoop
      )
    )

    ;; terminator character
    local.get $output
    i32.const 0
    i32.store8

    local.get $outputLength
  )

  ;; *************
  ;; ** Exports **
  ;; *************
  (export "memory" (memory $memory))
  (export "base64Encode" (func $base64Encode))
)
