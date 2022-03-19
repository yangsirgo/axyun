import {
  mapGetters
} from "vuex";
import stock from "@/api/hmm/stock";

export default {
  data() {
    return {
      Params_storageCode: ''
    }
  },
  compoted: {
    ...mapGetters("user", ["role"])
  },
  watch: {
    role: {
      immediate: true,
      deep: true,
      handler(val) {
        this.Params_storageCode = "";
        this.$_drugGetStarageCode();
      }
    }
  },
  methods: {
    async $_drugGetStarageCode() {
      if (this.Params_storageCode !== '') {
        return;
      }
      let res = await stock.isOpenDialog();
      if (res.code === 1) {
        this.Params_storageCode = res.data.storageCode;
        this.search();
      }
    }
  }
}
