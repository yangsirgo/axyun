<template>
  <div>
    <el-select
      style="width: 100%;"
      ref="select"
      @visible-change="visibleChange"
      filterable
      remote
      reserve-keyword
      clearable
      v-model="diagnosisValue"
      placeholder="请输入诊断名称"
      :remote-method="remoteMethod"
      :allow-create="allowCreate"
      :value-key="propertyCode"
      @clear="clear()"
    >
      <el-option
        v-for="item in options"
        :key="item[propertyCode]"
        :label="item[propertyName]"
        :value="item"
      >
        <span>{{ item[propertyName] }}</span>
        <span style="padding-left:10px;color: #8492a6; font-size: 13px">{{
          item[propertyCode]
        }}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { debounce } from "lodash/function";
import { objectMap } from "xe-utils/methods";
import { mapGetters } from "vuex";
export default {
  props: {
    shrinkText: {
      type: String,
      default: ""
    },
    diagName: {
      type: Object,
      default: ""
    }
    // WesternMedicineDiagnosis: {
    //   type: Array,
    //   default: []
    // },
    // ChineseMedicineDiagnosis: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      allowCreate: false,
      WesternMedicineDiagnosis: [],
      ChineseMedicineDiagnosis: [],
      options: [],
      queryInput: "",
      diagnosisValue: "",
      restaurants: [],
      diagnosisObj: {},
      propertyName: "dictionaryName",
      propertyCode: "icd10Encoding"
    };
  },
  computed: {
    ...mapGetters("cdss", ["diagnosisList"]),
    ...mapGetters("diagnosis", ["diagnosisData"])
  },
  watch: {
    diagnosisList(newValue, oldValue) {
      console.log(`诊断数据diagnosisList----`, newValue);
      this.diagnosisValue = "";
      this.queryInput = "";
      this.$emit("diagSelectorChange", {});
      this.options = [];
      for (let i = 0; i < 19; i++) {
        this.options.push(this.restaurants[i]);
      }
    },
    shrinkText(newValue) {
      // console.log(`newValue11112222222-----!!!!`, newValue);
      if (newValue === "收回") {
        this.diagnosisObj = {};
        this.diagnosisValue = "";
        this.options = [];
        this.restaurants = [];
        this.restaurants = this.WesternMedicineDiagnosis;
        for (let i = 0; i < 19; i++) {
          this.options.push(this.restaurants[i]);
        }
      }
    },
    diagnosisValue(newValue) {
      console.log(`newValue`, typeof newValue);
      if (typeof newValue === "string") {
        this.$emit("diagSelectorChange", { diagCode: "", diagName: newValue });
      } else {
        this.diagnosisObj = {
          diagCode: newValue[this.propertyCode],
          diagName: newValue[this.propertyName]
        };
        this.$emit("diagSelectorChange", this.diagnosisObj);
      }
    },
    WesternMedicineDiagnosis(newValue) {
      this.restaurants = newValue;
    },
    "diagName.cwFlag"(newValue) {
      // console.log(`diagName.cwFlag`, newValue);
      if (newValue === "1") {
        this.propertyName = "dictionaryName";
        this.propertyCode = "icd10Encoding";
        this.restaurants = this.WesternMedicineDiagnosis;
      } else {
        this.propertyName = "tcdName";
        this.propertyCode = "tcdCode";
        this.restaurants = this.ChineseMedicineDiagnosis;
      }
      this.options = [];
      for (let i = 0; i < 19; i++) {
        this.options.push(this.restaurants[i]);
      }
    },
    diagName(newValue) {
      this.options = [];
      if (newValue.cwFlag === "1") {
        this.propertyName = "dictionaryName";
        this.propertyCode = "icd10Encoding";
        this.restaurants = this.WesternMedicineDiagnosis;
      } else {
        this.propertyName = "tcdName";
        this.propertyCode = "tcdCode";
        this.restaurants = this.ChineseMedicineDiagnosis;
      }
      this.options.push({
        [this.propertyCode]: newValue.diagCode,
        [this.propertyName]: newValue.diagName
      });
      this.diagnosisValue = {
        [this.propertyCode]: newValue.diagCode,
        [this.propertyName]: newValue.diagName,
        ...newValue
      };
    }
  },
  async mounted() {
    this.ChineseWesternMedicineName = this.ChineseWesternMedicine;
    await this.getLocalWesternMedicine();
    await this.getLocalChineseMedicine();
    this.diagnosisValue = this.diagName;
    this.restaurants = this.WesternMedicineDiagnosis;
    console.log(`this.restaurants`, this.restaurants)
    for (let i = 0; i < 19; i++) {
      this.options.push(this.restaurants[i]);
    }
  },
  methods: {
    async getLocalWesternMedicine() {
      try {
        this.WesternMedicineDiagnosis = await this.diagnosisData
          .WesternMedicine;
      } catch (err) {
        console.log(err);
      }
    },
    async getLocalChineseMedicine() {
      try {
        this.ChineseMedicineDiagnosis = await this.diagnosisData
          .ChineseMedicine;
      } catch (err) {
        console.log(err);
      }
    },
    remoteMethod(query) {
      let beginTime = +new Date();
      this.queryInput = query;
      if (query !== "") {
        this.options = [];
        this.allowCreate = false;
        try {
          this.options = [];
          this.restaurants.forEach((item, i) => {
            if (
              item.namePy.toLowerCase().indexOf(query.toLowerCase()) != -1 ||
              item[this.propertyCode]
                .toLowerCase()
                .indexOf(query.toLowerCase()) != -1 ||
              item[this.propertyName]
                .toLowerCase()
                .indexOf(query.toLowerCase()) != -1
            ) {
              if (this.options.length > 20) {
                throw Error();
              }
              this.options.push(item);
            }
          });
          this.$nextTick(() => {
            this.$refs.select.hoverIndex = 0;
            console.log(
              `this.$refs.select.hoverOption.$el`,
              this.$refs.select.hoverOption.$el
            );
          });
        } catch (e) {}
        if (this.options.length === 0) {
          this.allowCreate = true;
          this.diagnosisValue = query;
          this.$emit("diagSelectorChange", { diagCode: "", diagName: query });
        }
      } else {
        this.allowCreate = true;
        this.options = [];
      }
      this.$nextTick(() => {
        this.$refs.select.hoverIndex = 0;
        console.log(
          `this.$refs.select.hoverOption.$el`,
          this.$refs.select.hoverOption.$el
        );
      });
      // console.log(`this.options`, this.options);

      let endTime = +new Date();
      // console.log("获取诊断用时" + (endTime - beginTime) / 1000 + "s");
    },
    remoteMethod1: debounce(function(query) {
      if (query !== "") {
        this.options = [];
        this.allowCreate = false;
        try {
          this.options = [];
          this.restaurants.forEach((item, i) => {
            if (
              item.namePy.toLowerCase().indexOf(query.toLowerCase()) != -1 ||
              item[this.propertyCode]
                .toLowerCase()
                .indexOf(query.toLowerCase()) != -1 ||
              item[this.propertyName]
                .toLowerCase()
                .indexOf(query.toLowerCase()) != -1
            ) {
              if (this.options.length > 20) {
                throw Error();
              }
              this.options.push(item);
            }
          });
          this.$nextTick(() => {
            this.$refs.select.hoverIndex = 0;
            console.log(
              `this.$refs.select.hoverOption.$el`,
              this.$refs.select.hoverOption.$el
            );
          });
        } catch (e) {}
        if (this.options.length === 0) {
          this.allowCreate = true;
          this.diagnosisValue = query;
          this.$emit("diagSelectorChange", { diagCode: "", diagName: query });
        }
      } else {
        this.allowCreate = true;
        this.options = [];
      }
      this.$nextTick(() => {
        this.$refs.select.hoverIndex = 0;
        console.log(
          `this.$refs.select.hoverOption.$el`,
          this.$refs.select.hoverOption.$el
        );
      });
    }, 50),
    clear() {
      this.diagnosisValue = "";
      this.queryInput = "";
      this.options = [];
      for (let i = 0; i < 19; i++) {
        this.options.push(this.restaurants[i]);
      }
      this.$emit("diagSelectorChange", {});
    },
    visibleChange(visible) {
      console.log(`visible`, visible);
      if (!visible) {
        console.log(`this.diagnosisObj`, this.diagnosisObj);
        if (
          Object.keys(this.diagnosisObj).length === 0 ||
          (this.diagnosisObj.diagCode === "" &&
            this.diagnosisObj.diagName === "") ||
          (this.diagnosisObj.diagCode === undefined &&
            this.diagnosisObj.diagName === undefined &&
            this.queryInput !== "")
        ) {
          console.log(`2222222`);
          console.log("this.queryInput", this.queryInput);
          this.$emit("diagSelectorChange", {
            diagCode: "",
            diagName: this.queryInput
          });
          this.diagnosisValue = this.queryInput;
        }
      }
      if (visible && this.$refs.select.hoverIndex < 0) {
        this.$refs.select.hoverIndex = 0;
      }
    }
  },
  beforeDestroy() {
    this.options = [];
    this.restaurants = [];
    this.diagnosisObj = [];
  }
};
</script>
