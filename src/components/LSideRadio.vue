<template>
  <div class="l-radio-button">
    <el-radio-group v-model="radioLabel"
                    @change="radioChange"
    >
      <el-radio-button
        v-for="item in selectDatas"
        :key="item.code"
        :label="item.name"
      ></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: "LRadioButton",
    data() {
      return {
        radioLabel: ''
      }
    },
    props: {
      radioCode: {
        type: [String,Number],
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
      this.radioLabel = this.codeToLabel();
    },
    methods: {
      codeToLabel () {
        let Obj = null;
        Obj = this.selectDatas.find((item)=>{
          return Number(this.radioCode) === item.code;
        });
        return Obj ? Obj.name : '';
      },
      radioChange(label) {
        let Obj = null;
        Obj = this.selectDatas.find((item)=>{
          return item.name === label;
        });
        this.$emit("update:radioCode", Obj.code);
        //this.radioLabel = this.codeToLabel();
        this.$emit('radioChange', Obj);
      }
    },
    watch : {
      radioCode (n) {
        this.radioLabel = this.codeToLabel();
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
      // font-family: SourceHanSansSC-Regular;
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
      // font-family: SourceHanSansSC-Bold;
      font-weight: $l-font-weight;
    }

  }
</style>
