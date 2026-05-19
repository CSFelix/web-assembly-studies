(module
  ;;  ***********
  ;;  ** Types **
  ;;  ***********
  (type $OPERATION 
    (func
      ;; (param i32 i32)
      (param i32)
      (param i32)
      (result i32)
    )
  )

  ;;  ***************
  ;;  ** Functions **
  ;;  ***************
  (func $set (type $OPERATION)
    local.get 1
  )

  (func $add (type $OPERATION)
    local.get 0
    local.get 1
    i32.add
  )

  (func $sub (type $OPERATION)
    local.get 0
    local.get 1
    i32.sub
  )

  (func $mul (type $OPERATION)
    local.get 0
    local.get 1
    i32.mul
  )

  (func $div (type $OPERATION)
    local.get 0
    local.get 1
    i32.div_s
  )

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "set" (func $set))
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
)
