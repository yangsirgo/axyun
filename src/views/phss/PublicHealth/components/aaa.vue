<template>
  <div class="className">
    <el-form ref="form"
             size="small"
             :model="form"
             label-width="80px">
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex1"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item tabindex="2"
                    label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex2"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery"></el-switch>
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex3"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动"
                       name="type"></el-checkbox>
          <el-checkbox label="地推活动"
                       name="type"></el-checkbox>
          <el-checkbox label="线下主题活动"
                       name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光"
                       name="type"></el-checkbox>
        </el-checkbox-group>
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex4"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex5"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex6"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex7"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex8"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex9"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex10"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex11"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex12"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex13"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input @focus=focus
                  :readonly='readonly'
                  id="elinput"
                  ref="tabindex14"
                  v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "className",
  components: {},
  props: {
    status: {
      type: String
    }
  },
  data() {
    return {
      // 表单数据
      form: {},
      // 表单规则

      // 是否只读
      readonly: false,
      // 当前聚焦元素的索引
      currentIndex: 1,
      // input最大个数
      maxLength: 0
    };
  },
  created() {},
  mounted() {
    this.init();
    this.initInput();
    this.addEnterListener();
  },
  destroy() {
    this.removeEnterListener();
  },

  methods: {
    init() {
      // 判断查看、编辑 状态
      console.log("this.status", this.status);
    },
    initInput() {
      // this.$refs.tabindex1.focus();
      var dom = document.getElementsByTagName("input");
      let temp = [];
      for (let i = 0; i < dom.length; i++) {
        const el = dom[i];
        if (el.id == "elinput") {
          temp.push(el);
        }
      }
      for (let i = 0; i < temp.length; i++) {
        const el = temp[i];
        el.intpuIndex = i + 1;
      }
      this.maxLength = temp.length;
    },
    // 获取焦点触发事件
    focus(e) {
      // console.log("focus获取焦点触发事件", e.target);
      console.log("e.target.intpuIndex", e.target.intpuIndex);
      if (e.target.intpuIndex) {
        this.currentIndex = e.target.intpuIndex;
      }
    },
    // 监听回车事件具体方法
    listenEnterEvent(e) {
      // console.log("e", e);
      if (e.keyCode === 13) {
        if (event.ctrlKey && event.keyCode == 13) {
          if (this.currentIndex == 1) {
            return;
          }
          this.currentIndex--;
        } else {
          if (this.maxLength == this.currentIndex) {
            return;
          }
          this.currentIndex++;
        }
        let temp = "tabindex" + JSON.stringify(this.currentIndex);
        // console.log("temp", temp);
        setTimeout(() => {
          this.$refs[temp].focus();
        }, 1);
      }
    },
    // 开启键盘监听事件
    addEnterListener() {
      console.log('开启键盘监听事件')
      if (window.__completeEnterBind__) {
        return;
      }
      window.addEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = true;
    },
    // 移除键盘监听事件
    removeEnterListener() {
      window.removeEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = false;
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.className {
  background: #fff;
}
</style>