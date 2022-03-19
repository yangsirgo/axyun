作用：表单内容分隔线
使用样例：
```javascript
      <LInputWithTitle
              title="我是title"
              append-unit="cm"
              v-model="value"
              style="width: 100%"></LInputWithTitle>
```

###属性：

**title**
介绍：input的 title
type: String
require: true

**append-unit**
介绍：input的 后缀单位 cm mm 等
type: String

**value**
介绍：input的实时value
type: String


###属性：
参考 elementUi的 input 部分 

###事件：
参考 elementUi的 input 部分 

###slot：
参考 elementUi的 input 部分 

###方法：
参考 elementUi的 input 部分 

备注： 内部的el-input的尺寸是经过计算的，可能在调样式时 后缀单位 样式会乱 刷新页面 或者 resize 页面会调整。
