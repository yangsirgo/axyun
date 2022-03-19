<template>
  <div class="residency clearfix">
    <div class="left">
      <left></left>
    </div>
    <div class="middle">
      <list @getPatientId="getPatientId"></list>
    </div>
    <div class="right">
      <right :patientId="patientId"></right>
    </div>
  </div>
</template>

<script>
  import list from './components/list.vue';
  import left from './components/left.vue';
  import right from './components/right.vue';

  export default {
    name: "residency",
    components: {
      list,
      left,
      right
    },
    data() {
      return {
        patientId: ''
      }
    },
    methods: {
      getPatientId(data) {
        this.patientId = data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .residency {
    height: 100%;
    .left {
      width: 305px;
      height: 100%;
      float: left;
    }

    .middle {
      width: calc(100% - 630px);
      height: 100%;
      margin-left: 20px;
      float: left;
    }

    .right {
      width: 305px;
      height:100%;
      float: right;
    }

  }

</style>
