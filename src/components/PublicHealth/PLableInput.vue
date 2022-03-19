<template>
  <div class="PLableInput">
    <div :style="{ width: width + 'px'}">{{name}}：</div>
    <div>{{val}}</div>
  </div>
</template>

<script>
export default {
  name: "PLableInput",
  components: {},
  props: {
    name: {
      type: String,
      required: true
    },
    val: {
      required: true
    },
    width: {
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
.PLableInput {
  display: flex;
  div:nth-child(1) {
    width: 70px;
    font-size: 14px;
    color: rgba(149, 158, 162, 1);
  }
  div:nth-child(2) {
    font-size: 14px;
    color: rgba(46, 52, 57, 1);
  }
}
</style>