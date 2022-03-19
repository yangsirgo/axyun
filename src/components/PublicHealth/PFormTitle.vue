<template>
  <div class="PFormTitle">
    <div class="name">{{name}}</div>
    <div class="val">{{val}}</div>
  </div>
</template>

<script>
export default {
  name: "PFormTitle",
  components: {},
  props: {
    name: {
      type: String
    },
    val: {
      type: String
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.PFormTitle {
  background: #fff;
  display: flex;
  .name {
    font-size: 14px;
    color: rgba(148, 157, 163, 1);
  }
  .val {
    padding-left: 10px;
    font-size: 14px;
    color: rgba(50, 53, 59, 1);
  }
}
</style>