<template>
  <div class="temperatureMain height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false" @updateForm="updateForm"></left-bar>
      </template>
      <template #content>
        <el-card class="height100" style="padding:0 20px;">
          <el-tabs class="height100" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="单人录入" name="first">
              <temperatureLeft v-if="activeName=='first'"></temperatureLeft>
            </el-tab-pane>
            <el-tab-pane label="批量录入" name="second">
              <temperatureRight v-if="activeName=='second'" :form="form"></temperatureRight>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import temperatureLeft from "./component/temperatureLeft";
  import temperatureRight from "@/views/ipnw/nursing/temperatureList/component/temperatureRight";
  import leftBar from "@/views/ipnw/components/nursingLeftBar.vue";

  export default {
    components: {
      temperatureLeft,
      temperatureRight,
      leftBar
    },
    data() {
      return {
        toolBoxs: ["AuxiliaryDiagnosis"],
        activeName: "first",
        form: {}
      };
    },
    mounted() {
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      messageHandler() {
      },
      updateForm(form) {
        this.form = {...form};
      }
    }
  };
</script>

<style scoped lang="scss">
  .temperatureMain {
    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
    }
  }
</style>
