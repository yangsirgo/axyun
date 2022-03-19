## 表格构建

### 复选框和input联动
> 使用组件 

``` html
<PCheckbox
    :readonly="readonly"
    :formKey="'EatingHabitsForm'"
    :checkboxForm="TableForm.eating_habits"
    :checkboxOptions="EatingHabitsOptions"
    @childValInput="childVal"
/>
```
### Attributes
| 参数            |      说明       |    类型 |
|-----------------|:---------------:|--------:|
| readonly        |    是否只读     | Boolean |
| formKey         | 表单数据的Key值 |  String |
| otherKey        |   其他的Key值   |  String |
| checkboxForm    |  输入框数据源   |   Array |
| checkboxOptions |  复选框数据源   |   Array |

### Events
| 参数          |           说明            | 回调参数 |
|---------------|:-------------------------:|---------:|
| childValInput |     input输入时的回调     |       —— |
| otherValInput | 有其他时input输入时的回调 |       —— |