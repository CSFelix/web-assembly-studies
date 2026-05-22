(module
  ;;  **************
  ;;  ** Memories **
  ;;  **************
  (memory $memory 256 512)

  ;;  ***************
  ;;  ** Functions **
  ;;  ***************
  (func $sumSimd
    (param $pointerArrayA i32)
    (param $pointerArrayB i32)
    (param $pointerArrayResult i32)

    (local $sumResult v128)

    local.get $pointerArrayA
    v128.load

    local.get $pointerArrayB
    v128.load

    i32x4.add
    local.set $sumResult

    local.get $pointerArrayResult
    local.get $sumResult
    v128.store
  )

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "memory" (memory $memory))
  (export "sumSimd" (func $sumSimd))
)
