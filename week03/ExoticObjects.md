### JS标准中那些无法实现的对象

* JS对象可分为ordinary和exotic两种

* Exotic Objects
  * Bound Function Exotic Objects
    * internal slots
      * [[BoundTargetFunction]]
      * [[BoundThis]]
      * [[BoundArguments]]
    * internal methods
      * [[Call]]
      * [[Construct]]
      * BoundFunctionCreate
  * Array Exotic Objects
    * internal methods
      * [[DefineOwnProperty]]
      * ArrayCreate
      * ArraySpeciesCreate
  * String Exotic Objects
    * internal methods
      * [[GetOwnProperty]]
      * [[DefineOwnProperty]]
      * [[OwnPropertyKeys]]
      * StringCreate
      * StringGetOwnProperty
  * Arguments Exotic Objects
    * internal methods
      * [[GetOwnProperty]]
      * [[DefineOwnProperty]]
      * [[Get]]
      * [[Set]]
      * [[Delete]]
      * CreateUnmappedArgumentsObject
      * CreateMappedArgumentsObject
        * MakeArgGetter
        * MakeArgSetter
  * Integer-Indexed Exotic Objects
    * internal methods
      * [[GetOwnProperty]]
      * [[HasProperty]]
      * [[DefineOwnProperty]]
      * [[Get]]
      * [[Set]]
      * [[OwnPropertyKeys]]
      * IntegerIndexedObjectCreate
      * IntegerIndexedElementGet
      * IntegerIndexedElementSet
  * Module Namespace Exotic Objects
    * internal methods
      * [[SetPrototypeOf]]
      * [[IsExtensible]]
      * [[PreventExtensions]]
      * [[GetOwnProperty]]
      * [[DefineOwnProperty]]
      * [[HasProperty]]
      * [[Get]]
      * [[Set]]
      * [[Delete]]
      * [[OwnPropertyKeys]]
      * ModuleNamespaceCreate
  * Immutable Prototype Exotic Objects
    * internal methods
      * [[SetPrototypeOf]]
      * SetImmutablePrototype
