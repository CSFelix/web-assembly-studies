(module
  ;; *************
  ;; ** Imports **
  ;; *************

  ;; **************
  ;; ** Memories **
  ;; **************
  (memory $memory 1)

  ;; ***************
  ;; ** Functions **
  ;; ***************
  (func $sumNumbers
    (param $offset i32)  ;; (index: 0) offset of the array
    (param $length i32)  ;; (index: 1) amount of integers stored into the array
    (result i32)

    (local $sum i32)     ;; (index: 2) the sum of all integer into the array
    i32.const 0
    local.set $sum       ;; initializing '$sum' with zero

    (block
      (loop $sumLoop
        ;; since block-statements uses a local stack, we need to insert the values into that one

        ;; ---- getting the value ----
        local.get $offset  ;; stack: [$offset]
        i32.load           ;; stack: [element]
        
        ;; ---- adding the value ----
        local.get $sum     ;; stack: [element, $sum]
        i32.add            ;; stack: [element + $sum]
        local.set $sum     ;; stack: []

        ;; ---- incrementing offset ----
        local.get $offset  ;; stack: [$offset]
        i32.const 4        ;; stack: [$offset, 4]
        i32.add            ;; stack: [$offset + 4]
        local.set $offset  ;; stack: []

        ;; ---- decrementing counter ----
        local.get $length  ;; stack: [$length]
        i32.const 1        ;; stack: [$length, 1]
        i32.sub            ;; stack: [$length - 1]
        local.set $length  ;; stack: []

        ;; ---- break condition ----
        ;;
        ;;  - 'i32.gt_s': compares the the last but one element from the stack is
        ;; greater than the last element. The '_s' tells that the values are signed,
        ;; assuming that there are differences between negative and positive numbers;
        ;;  - 'br_if': break the loop if the next element from the stack is 'true'.
        ;;
        local.get $length  ;; stack: [$length]
        i32.const 0        ;; stack: [$length, 0]
        i32.gt_s           ;; stack: [true|false: $length > 0]
        br_if $sumLoop     ;; stack: []
      )
    )

    local.get $sum
  )

  (func $avgNumbers
    (param $offset i32)
    (param $length i32)
    (result i32)

    local.get $offset  ;; stack: [$offset]
    local.get $length  ;; stack: [$offset, $length]
    call $sumNumbers   ;; stack: [sumValue]

    local.get $length  ;; stack: [sumValue, $length]
    i32.div_s          ;; stack: [divisionValue]
  )

  ;; *************
  ;; ** Exports **
  ;; *************
  (export "memory" (memory $memory))
  (export "sumNumbers" (func $sumNumbers))
  (export "avgNumbers" (func $avgNumbers))
)
