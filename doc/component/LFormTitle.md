作用：表单
使用样例：
```javascript
 // slot 是input
<LFormtTitle label="卡号">
    <el-input v-model="form.inputValue" style="line-height: 34px;">
        <template slot="append">cm</template>
    </el-input>
</LFormtTitle>

// slot 是select
<LFormtTitle label="状态">
    <el-select v-model="value" placeholder="请选择">
        <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</LFormtTitle>

// slot 是datepicker
<LFormtTitle label="有效期至" labelWidth="64">
    <el-date-picker
        v-model="value2"
        prefix-icon="icon iconfont iconriqi"
        type="datetime"
        placeholder="选择日期时间">
    </el-date-picker>
</LFormtTitle>
```
###备注
目前标题宽度默认两个字宽度，如果超过两个字需要设置label的宽度

###属性：
label 是 title 字段

###slot：
默认slot 是 内容部分
