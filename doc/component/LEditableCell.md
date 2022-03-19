## l-editable-cell

可编辑的table单元格，编辑状态、展示状态动态切换。

参考代码： 'src/pages/base/DepartmentManagement'

使用样例：
```
// 以前table单元格用法
<template slot-scope="scope">
  <span>{{formatData(scope.row, item)}}</span>
</template>

// 可编辑table单元格
// 通常有两类编辑方式，一种就是输入框，这种情况不需要指定editable-component值
// 另一种是其他输入类型，比如下拉、日期选择、值域选择等，这种需要指定editable-component
// 如果想要对编辑组件进行定制，可以直接在l-editable-cell 上使用原组件所有可用的属性或者事件
<template slot-scope="scope">
  <l-editable-cell 
    v-if="item.prop == 'type'"
    v-model="form[item.prop]"
    :editable="!!scope.row.editable"
    :stopTab="item.prop == 'linkTel'"
    @stopTab="confirmHandler"
    @blur="blurHandler(scope, item.prop == 'linkTel')"
    editable-component="l-value-domain"
    code="CV01.00.000"
  >
    <span slot="content" class="overflow-point display-inherit">{{formatData(scope.row, item)}}</span>
  </l-editable-cell>
  <l-editable-cell 
    v-else
    v-model="form[item.prop]"
    :editable="!!scope.row.editable"
    :stopTab="item.prop == 'linkTel'"
    @stopTab="confirmHandler"
    @blur="blurHandler(scope, item.prop == 'linkTel')"
  >
    <span slot="content" class="overflow-point display-inherit">{{formatData(scope.row, item)}}</span>
  </l-editable-cell>
</template>
```