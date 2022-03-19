<template>
  <div class="height100 position-relative">
    <!--<div style="padding: 0 20px">-->
    <!--<l-card-title v-if="title_position == 'top' && isHave">-->
    <!--<span slot="left">患者列表</span>-->
    <!--</l-card-title>-->
    <!--<el-input placeholder="搜索" v-model="keyWord">-->
    <!--<i-->
    <!--slot="suffix"-->
    <!--class="el-icon-search cursor-pointer"-->
    <!--@click="search"-->
    <!--style="margin-top: 10px;"-->
    <!--&gt;</i>-->
    <!--</el-input>-->
    <!--<l-card-title v-if="title_position != 'top' && isHave">-->
    <!--<span slot="left">患者列表</span>-->
    <!--</l-card-title>-->
    <!--</div>-->
    <div class="height100">
      <el-table
        ref="multipleTable"
        class="patients-list"
        :data="patientsList"
        border
        @row-click="handleSelectPatient"
        @select="handleSelect"
        @select-all="handleSelectAll"
        highlight-current-row
        v-loading="tl_isLoading"
        stripe
        height="100%"
        width="100%"
      >
        <el-table-column v-if="isMultiple" type="selection" width="45"></el-table-column>
        <el-table-column
          v-for="(item, index) in table_column"
          :key="index"
          :prop="item.prop"
          :align="item.align"
          :min-width="item.width"
          :label="item.label"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="item.prop == 'bedNum'">
              <span>{{ scope.row.bedNum }}</span> 床
            </div>
            <div
              v-else-if="item.prop === 'hosCode'"
              style="color: #3D7DFB;"
            >{{ scope.row[item.prop] }}</div>
            <div v-else-if="item.prop === 'patientGender'">{{ scope.row[item.prop] == 1 ? "男":"女" }}</div>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { getPatients, getCardReading } from "@/api/cis/resident/resident";

export default {
  components: {
    // LLoadMoreTable
  },
  props: {
    isMultiple: {
      default: false
    },
    title_position: {
      default: "top"
    },
    isHave: {
      default: true
    },
    newColumn: {
      default: false
    },
    form: {
      //查询的表单数据

      type: Object
    }
  },
  data() {
    return {
      keyWord: "", // 搜索用户关键词
      tl_noMore: false, // 患者列表没有更多状态
      tl_isLoading: false, // 患者列表请求状态
      patientsList: [],
      table_column: this.newColumn
        ? [
            {
              prop: "bedCode",
              label: "床号",
              align: "center",
              fixed: false,
              width: "21%"
            },
            {
              prop: "patientName",
              label: "姓名",
              align: "center",
              fixed: false,
              width: "20%"
            },
            {
              prop: "patientGender",
              label: "性别",
              align: "center",
              fixed: false,
              width: "19%"
            },
            {
              prop: "inpCode",
              label: "住院号",
              align: "center",
              fixed: false,
              width: "40%"
            }
          ]
        : [
            {
              prop: "bedCode",
              label: "床号",
              align: "center",
              fixed: false,
              width: "25%"
            },
            {
              prop: "inpCode",
              label: "住院号",
              align: "center",
              fixed: false,
              width: "45%"
            },
            {
              prop: "patientName",
              label: "姓名",
              align: "center",
              fixed: false,
              width: "30%"
            }
          ]
    };
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("base", ["receivePatientData", "receivePatientDatas"])
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      setReloadKey: "base/changeSearchAgainKey",
      changeRecPatientDatas: "base/changeRecPatientDatas"
    }),
    search(form) {
      // 搜索方法
      this.getPatientList(form);
    },
    //一进入页面 默认选中第一行
    setCurrent(row) {
      this.$refs.multipleTable && this.$refs.multipleTable.setCurrentRow(row);
    },
    async getCardReading(form = { search: "", isNurse: "" }) {
      this.tl_isLoading = true;
      let ajaxData = {
        isNurse: "",
        keyword: form.search
      };

      try {
        let result = await getCardReading(ajaxData);
        this.patientsList = result.data;
        console.log("---patientsList---", patientsList);
        if (result.code == 1 && result.data.length != 0) {
          this.tl_isLoading = false;
          if (
            this.receivePatientData === undefined ||
            this.receivePatientData.bedCode === undefined
          ) {
            //默认选中第一个
            this.changeRecPatientData(result.data[0]);
            this.setCurrent(result.data[0]);
          } else {
            //选中 vuex 中的数据
            let targetRow = result.data.find(item => {
              return item.finAdId === this.receivePatientData.finAdId;
            });
            if (targetRow) {
              this.setCurrent(targetRow);
              this.changeRecPatientData(targetRow);
            } else {
              this.changeRecPatientData(result.data[0]);
              this.setCurrent(result.data[0]);
            }
          }
          setTimeout(() => {
            // 增加定时器 防止更改选中状态失败
            this.tl_isLoading = false;
            this.patientsList.forEach(val => {
              this.receivePatientDatas.forEach(item => {
                if (val.patientId === item.patientId) {
                  this.$refs.multipleTable.toggleRowSelection(val);
                }
              });
            });
          }, 20);
        } else {
          this.tl_isLoading = false;
        }
      } catch (e) {
        this.tl_isLoading = false;
      }
    },
    async getPatientList(form = {}) {
      // let data = { ...this.form, ...{ admissionStatus: 2 }, ...form};

      let data = { ...this.form, ...form };
      //data.admissionStatus = data.hospState;
      data.keyword = data.search;
      this.tl_isLoading = true;
      let result = await getPatients(data);
      this.patientsList = result.data;
      if (result.code == 1 && result.data.length != 0) {
        this.tl_isLoading = false;
        if (
          this.receivePatientData === undefined ||
          this.receivePatientData.bedCode === undefined
        ) {
          //默认选中第一个
          this.changeRecPatientData(result.data[0]);
          this.setCurrent(result.data[0]);
        } else {
          //选中 vuex 中的数据
          let targetRow = result.data.find(item => {
            return item.finAdId === this.receivePatientData.finAdId;
          });
          if (targetRow) {
            this.setCurrent(targetRow);
            this.changeRecPatientData(targetRow);
          } else {
            this.changeRecPatientData(result.data[0]);
            this.setCurrent(result.data[0]);
          }
        }
        setTimeout(() => {
          // 增加定时器 防止更改选中状态失败
          this.tl_isLoading = false;
          this.patientsList.forEach(val => {
            this.receivePatientDatas.forEach(item => {
              if (val.patientId === item.patientId) {
                this.$refs.multipleTable.toggleRowSelection(val);
              }
            });
          });
        }, 20);
      } else {
        this.tl_isLoading = false;
      }
    },
    handleSelectPatient(row, index) {
      // 患者列表选择
      this.changeRecPatientData(row); // 选择患者存储到 vuex 目前vuex 仅存储单个患者需完善
    },
    handleSelect(selection, row) {
      // 单选患者
      this.changeRecPatientDatas(selection);
    },
    handleSelectAll() {
      // 全选患者
      this.changeRecPatientDatas(selection);
    }
    // ,async fetchPatientsList() {
    //   // 请求 患者列表
    //   try {
    //     const _this = this;
    //     setTimeout(function() {
    //       _this.patientsList.push({
    //         bedNum: "01",
    //         patientName: "张三",
    //         patientGender: "男",
    //         patientAge: "22"
    //       });
    //       _this.tl_isLoading = false;
    //     }, 2000);
    //   } catch (e) {
    //     console.log(e.msg || '');
    //   }
    // },
    // loadPatientsNext() {
    //   console.log("加载下一页");
    //   this.fetchPatientsList();
    // }
  },
  watch: {
    role: {
      handler(val) {
        let reloadKeys = +new Date() + "" + "RESETFORM";
        this.setReloadKey(reloadKeys);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
