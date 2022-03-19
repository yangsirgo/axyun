<template>
  <div class="code-transform">{{ codeTransform }}</div>
</template>

<script>
import { transformCode } from "@/api/directive/directiveRequest";

export default {
  name: "LCodeTransform",
  props: {
    field: {
      type: [String, Number],
      default: "name"
    },
    code: {
      type: [String, Number],
      required: true
    },
    val: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      codeTransform: ""
    };
  },
  methods: {
    codeTrans() {
      let data = [
        {
          field: this.field,
          code: this.code,
          val: this.val
        }
      ];
      // 单个code 反显
      transformCode(data).then(data => {
        if (data.code == 1) {
          this.codeTransform = data.data[0];
        }
      });
    }
  },
  computed: {},
  mounted() {
    this.codeTrans();
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.code-transform {
  display: inline-block;
}
</style>
