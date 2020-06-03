# 每周总结可以写在这里

box model

float

bfc

margin merge

block container: A block container box either contains only block-level boxes or establishes an inline formatting context and thus contains only inline-level boxes.

block level box: Block-level boxes are boxes that participate in a block formatting context.

block box:


block-level 表示可以被放入bfc
block-container 表示可以容纳bfc
block-box = block-level + block-container
block-box 如果 overflow 是 visible， 那么就跟父bfc合并
