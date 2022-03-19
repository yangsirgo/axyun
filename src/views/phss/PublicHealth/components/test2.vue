<template>
  <div class="test2">
    <el-input :readonly="readonly" v-model="temp">
      <template slot="append">℃</template>
    </el-input>
    <el-input :readonly="readonly" v-model="temp">
      <template slot="append">℃</template>
    </el-input>
    <el-input :readonly="readonly" v-model="temp">
      <template slot="append">℃</template>
    </el-input>
    <el-input :readonly="readonly" v-model="temp">
      <template slot="append">℃</template>
    </el-input>
    <el-input :readonly="readonly" v-model="temp">
      <template slot="append">℃</template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "test",
  components: {},
  props: {},
  data() {
    return {
      temp: "",
      currentIndex: 1,
      readonly: false
    };
  },
  created() {},
  mounted() {
    console.log("111111111111", this.currentIndex);
    setTimeout(() => {
      this.initInput();
      // this.initInput1();
    }, 10);
    this.addEnterListener();
  },
  destroy() {
    console.log("卸载");
    this.removeEnterListener();
  },
  methods: {
    initInput() {
      let val = document.getElementsByClassName("el-input--medium");
      for (var i = 0; i < val.length; i++) {
        val[i].children[0].setAttribute("id", "elinput" + (i + 1));
        val[i].children[0].intpuIndex = i + 1;
        // console.log("val[i]", val[i].children[0].intpuIndex);
      }
      this.maxLength = val.length;
      console.log("val.length", val.length);
      let temp = document.getElementById("elinput1");
      temp.focus();
      // console.log("temp", temp);
      const obj = {};
      for (const prop in temp) {
        obj[prop] = temp[prop];
      }
      // console.log(obj);
    }, // 获取焦点触发事件
    focus(e) {},
    // 监听回车事件具体方法
    listenEnterEvent(e) {
      console.log("listenEnterEvent", e);
      let tempIndex = e.target.intpuIndex;
      if (e.keyCode === 13) {
        // if ((e.ctrlKey && e.keyCode == 13) || (e.shiftKey && e.keyCode == 13)) {
        if (e.shiftKey && e.keyCode == 13) {
          if (tempIndex == 1) {
            return;
          }
          tempIndex--;
        } else {
          if (this.maxLength == tempIndex) {
            return;
          }
          tempIndex++;
        }
        let temp = document.getElementById("elinput" + tempIndex);
        temp.focus();
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
      console.log("卸载");
      window.removeEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = false;
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.test2 {
}
</style>