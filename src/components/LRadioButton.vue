<template>
  <div class="l-radio-button">
    <el-radio-group v-model="radioInit"
                    @change="radioChange"
    >
      <el-radio-button
        v-for="item in selectDatas"
        :key="item"
        :label="item"
      ></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: "LRadioButton",
    data() {
      return {
        radioInit: ''
      }
    },
    props: {
      radio: {
        type: String,
        default: ''
      },
      selectDatas: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    created() {
      this.radioInit = this.radio;
    },
    methods: {
      radioChange() {
        this.$emit('radioChange', this.radioInit)
      }
    },
    watch: {
      radio (n) {
        this.radioInit = n;
      }
    }
  }
</script>

<style lang="scss">
  .l-radio-button {
    .el-radio-button:first-child .el-radio-button__inner {
      border-left: none;
    }

    .el-radio-button__inner {
      border: none;
      border-radius: 0;
      background: transparent;
      font-size: $l-font-size;
      font-family: $l-font-familySC-regular;
      font-weight: 400;
      color: $l-color-fontcolor-4;
    }

    .el-radio-button--medium .el-radio-button__inner {
      padding: 11.2px 15px;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: $l-color-primary;
      background-color: $l-color-white;
      border: none;
      box-shadow: 0px 2px 4px 0px transparent;
      border-radius: 2px;
      font-size: $l-font-size;
      font-family: $l-font-familySC-bold;
      font-weight: $l-font-weight;
    }

  }
</style>
