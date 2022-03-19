<template>
  <div class="doctorAdvice">
    <public-tabs>
      <template #person>
        <doctor-advice-detail />
      </template>
      <template #department>
        <d-doc-detail />
      </template>
      <template #hospital></template>
    </public-tabs>
  </div>
</template>

<script>
import publicTabs from "@/views/systemManagement/templateSystem/components/PublicTabs";
import doctorAdviceDetail from "./components/DoctorAdviceDetail";
import dDocDetail from "./components/DDocDetail";
export default {
  name: "doctorAdvice",
  components: {
    publicTabs,
    doctorAdviceDetail,
    dDocDetail
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.doctorAdvice{
    height: 100%;
  }
</style>
