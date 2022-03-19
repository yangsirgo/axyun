<template>
  <div class="width100 height100">
    <div class="lEditorHeight" style="background-color: #fff">
      <emr-record ref="emrRecord" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { requestFullScreen, exitFullscreen } from "@/utils/util.js";
import {
  getPamars,
  getToken,
  getRoles,
  getRole,
  getUserName,
  getUserId,
} from "@/utils/auth";
import { getServerConfig } from "@/utils/config";

import emrRecord from "@/views/emrRecord/iframePage/record.vue";

export default {
  name: "record",
  components: {
    emrRecord,
  },
  props: ["visitCode"],
  data() {
    return {
      dialogVisibleBK: false, // 报卡dialog
      baokaData: {},
      tableLoading: false,
      diagnosticData: {},
    };

    this.$nextTick(() => {
      this.$refs.lEditor.send(pData);
    });
  },
  computed: {
    ...mapGetters("ehr", ["eHrleftData"]),
    ...mapGetters("base", ["receivePatientData"]),
  },
  mounted() {
    this.changeCallBack();
  },
  beforeRouteLeave(to, from, next) {
    this.changeRecPatientData({});
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    changeCallBack() {
      console.log(this.eHrleftData, "ehr左侧的传值的");
      if (!this.receivePatientData.patientId) {
        console.log(this.visitCode, "this.visitCode");
        let data = {
          nm: this.eHrleftData.patientArchiveInfoVO.patientName,
          visitingNumber: this.visitCode,
        };

        this.$refs.emrRecord.queryPatient(data);
      }
    },
  },
  watch: {
    eHrleftData: {
      handler(n) {
        this.changeCallBack();
      },
    },
    visitCode: {
      handler(n) {
        this.changeCallBack();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.lEditorHeight {
  height: calc(100% - 42px);
}

.slideBar {
  top: 42px;
}
</style>
