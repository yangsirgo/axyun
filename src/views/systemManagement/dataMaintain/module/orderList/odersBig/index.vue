<template>
  <div class="width100 height100">
    <l-layout
      :boxExpanded="false"
      :isToolBox="false"
      :patientListShow="false">
      <template #content>
        <main-views ref="mainViews"></main-views>
      </template>
    </l-layout>
  </div>
</template>
<script>
  import mainViews from "@/views/systemManagement/dataMaintain/router.vue"

  export default {
    name: "index",
    components: { mainViews },
    data() {
      return {};
    },
    created() {

    },
    mounted() {
      this.$refs.mainViews.loadData(3);
    },
    methods: {},
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">

</style>
