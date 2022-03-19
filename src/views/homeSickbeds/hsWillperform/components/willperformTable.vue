<template>
  <div class="willperformTable">

    <div style="margin-top: 10px;">
      
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {
    mapActions,
    mapGetters
  } from "vuex";

  export default {
    props:["tableData"],
    data() {
      return {

      };
    },
    mounted() {

    },
    methods: {
      ...mapActions({
        changeRecPatientData: "homeSickbeds/changeRecPatientData"
      }),
      handleSelectionChange(val){
        console.log("组件选择",val);
      },
      // 截取时间
      interception(data) {
        let str = "";
        if (data) {
          str = data.substring(-1, 11);
        } else {
          str = '--:--'
        }
        return str;
      },
    },
    components: {},
    watch: {
      tableData: {
        deep: true,
        handler(val) {

        }
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
