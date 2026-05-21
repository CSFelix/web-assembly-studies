(module
  ;;  ***********
  ;;  ** Types **
  ;;  ***********
  (type $OPERATION 
    (func (param i32) (param i32) (result i32))
  )

  ;;  ***************
  ;;  ** Functions **
  ;;  ***************
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

  ;;  ************
  ;;  ** Tables **
  ;;  ************
  (table $functionTable 4 funcref) ;; will store 4 function references
  (elem (i32.const 0) $add)
  (elem (i32.const 1) $sub)
  (elem (i32.const 2) $mul)
  (elem (i32.const 3) $div)

  ;;  *************
  ;;  ** Exports **
  ;;  *************
  (export "functionTable" (table $functionTable))
)
