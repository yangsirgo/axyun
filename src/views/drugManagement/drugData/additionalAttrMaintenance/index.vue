<template>
  <div class="wrapper height100">
    <div class="float-left main">
      <div class="main_wrap">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <div class="drugInfoMaintain width100 height100">
              <div class="left height100">
                <left-list
                  :refreshList="refreshList"
                  @getIsDrug="getIsDrug"
                  @newadd="newadd"
                ></left-list>
              </div>
              <div class="right height100">
                <editor-form
                  ref="form"
                  :editorForm="editorForm"
                  @getRefreshList="getRefreshList"
                ></editor-form>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import leftList from "./components/leftList";
import editorForm from "./components/editorForm";
export default {
  components: { FlowMenu, leftList, editorForm },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    }
  },
  data() {
    return {
      //全局属性
      editorForm: {},
      //刷新药品列表
      refreshList: {}
    };
  },
  methods: {
    //获取子组件传来的数据
    getIsDrug(data) {
      if (data) {
        this.editorForm = data;
      }
    },
    //接收子组件返回来的刷新列表的信息
    getRefreshList(data) {
      if (data) {
        this.refreshList = data;
      }
    },
    // 取消左侧表格高亮
    newadd() {
      this.$refs.form.newadd();
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 0;
  overflow: hidden;
  .main {
    width: 100%;
    height: 100%;
    .main_wrap {
      height: 100%;
      .drugInfoMaintain {
        .left {
          width: calc(100% - 450px);
          float: left;
        }

        .right {
          width: 440px;
          margin-left: 10px;
          float: right;
        }
      }
    }
  }
}
</style>
