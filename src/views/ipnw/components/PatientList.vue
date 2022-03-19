<template>
  <div class="height100 position-relative">
    <div class="height100" v-loading="tl_isLoading">
      <template v-if="currentColumn == 2">
        <l-table
          :total="total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          layout="pager"
          :pagerCount="5"
          paginationAlign="center"
          :singlePageShow="true"
          @changeSize="changeSize"
        >
          <el-table
            class="patients-list"
            ref="singleTable"
            :data="patientsList"
            @row-click="handleSelectPatient"
            @select="handleSelect"
            @select-all="handleSelectAll"
            highlight-current-row
            border
            stripe
            height="100%"
            width="100%"
          >
            <el-table-column
              v-if="isMultiple"
              type="selection"
              width="45"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in table_column"
              :key="index"
              :prop="item.prop"
              :min-width="item.width"
              :label="item.label"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'bedNum'">
                  <div v-if="scope.row[item.prop]">
                    <span>{{ scope.row.bedNum }}</span> 床
                  </div>
                  <div v-else>-</div>
                </div>
                <div v-else-if="item.prop === 'patientGender'">
                  <!-- <span :val="scope.row[item.prop]" code="GENDER_CODE" v-codeTransform></span> -->
                  {{ scope.row[item.prop] == 1 ? "男" : "女" }}
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </l-table>
      </template>
      <template v-else>
        <l-table
          :paginationSmall="true"
          :total="apply_total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          layout="pager"
          :pagerCount="5"
          paginationAlign="center"
          :singlePageShow="true"
          @changeSize="changeSize"
        >
          <el-table
            class="patients-list"
            ref="singleTable"
            :data="patientsList"
            @row-click="handleSelectPatient"
            @select="handleSelect"
            @select-all="handleSelectAll"
            border
            highlight-current-row
            stripe
            width="100%"
            height="100%"
          >
            <el-table-column
              v-if="isMultiple"
              type="selection"
              width="45"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in apply_column"
              :key="index"
              :prop="item.prop"
              :min-width="item.width"
              :label="item.label"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'bedNum'">
                  <div v-if="scope.row[item.prop]">
                    <span>{{ scope.row.bedNum }}</span> 床
                  </div>
                  <div v-else>-</div>
                </div>
                <div v-else-if="item.prop === 'patientGender'">
                  <span
                    :val="scope.row[item.prop]"
                    code="GENDER_CODE"
                    v-codeTransform
                  ></span>
                </div>
                <div v-else-if="item.prop === 'operation'">
                  <!-- <el-button
                v-if="scope.row.billStatus === 1"
                type="text"
                @click="handleSave(scope.row.applyId)"
                    >登记</el-button>-->
                  <el-button type="text" @click="handleSave(scope.row.applyId)">
                    {{ scope.row.billStatus === 1 ? "登记" : "查看" }}
                  </el-button>
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </l-table>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import {
  fetchPatientsList,
  fetchApplyPatientsList,
  getCardReading
} from "@/api/ipnw/etHospital";

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
    type: {
      default: 1
    },
    labelType: {}
  },
  data() {
    return {
      keyWord: "", // 搜索用户关键词
      tl_isLoading: false, // 患者列表请求状态
      patientsList: [],
      pageParams: {
        pageNo: 0, // 当前页数
        pageSize: 20 // 每页数据条数
      },
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
              fixed: false,
              width: "80"
            },
            {
              prop: "patientGender",
              label: "性别",
              fixed: false,
              width: "60"
            },
            // {
            //   prop: "level",
            //   label: "危重",
            //   fixed: false,
            //   width: "120"
            // },
            {
              prop: "patientName",
              label: "姓名",
              fixed: "right",
              width: "80"
            }
          ],
      apply_column: [
        {
          prop: "patientName",
          label: "姓名",
          fixed: false,
          width: "100"
        },
        {
          prop: "patientGender",
          label: "性别",
          fixed: false,
          width: "120"
        },
        {
          prop: "operation",
          label: "操作",
          fixed: false,
          width: "60"
        }
      ],
      currentColumn: 1,
      apply_total: 0,
      total: 0,
      searchParams: {}
    };
  },
  computed: {
    ...mapGetters(["receivePatientData", "receivePatientDatas", "entryHosId"])
    // tl_noMore_apply() {
    //   return (
    //     this.apply_total / this.pageParams.pageSize <= this.pageParams.pageNo
    //   );
    // },
    // tl_noMore() {
    //   return this.total / this.pageParams.pageSize <= this.pageParams.pageNo;
    // }
  },
  created() {},
  mounted() {
    // this.search({});
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      changeRecPatientDatas: "base/changeRecPatientDatas",
      changeEntryHosId: "ipnw/changeEntryHosId"
    }),
    handleSelectPatient(row, index) {
      // 患者列表选择
      this.changeRecPatientData(row); // 选择患者存储到 vuex 目前vuex 仅存储单个患者需完善
      this.$refs.singleTable.toggleRowSelection(row);
    },
    handleSelect(selection, row) {
      // 单选患者
      this.changeRecPatientDatas(selection);
      this.$refs.singleTable.setCurrentRow(row);
      this.changeRecPatientData(row);
    },
    handleSelectAll(selection) {
      // 全选患者
      this.changeRecPatientDatas(selection);
    },
    handleSave(id) {
      // 点击某一患者 登记
      this.changeEntryHosId(id);
    },
    search(searchParams) {
      // 点击搜索按钮触发事件
      this.tl_isLoading = true;
      // this.pageParams.pageNo = 0;
      this.searchParams = searchParams;
      this.fetchPatientsList(searchParams);
    },
    async getCardReading(form = { search: "", isNurse: "" }) {
      this.tl_isLoading = true;

      let ajaxData = {
        isNurse: "1",
        keyword: form.search
      };
      if (this.labelType == 1) {
        ajaxData = {
          ...ajaxData,
          recordStatus: 1
        };
      } else {
        ajaxData = {
          ...ajaxData,
          recordStatus: 2
        };
      }
      try {
        let result = {};
        if (this.labelType == 0) {
          /*入院申请*/
          let parameData = ajaxData;
          parameData["readCard"] = 1;
          result = await fetchApplyPatientsList(parameData);
        } else {
          result = await getCardReading(ajaxData);
        }
        this.patientsList = result.data;
        if (result.code == 1 && result.data.length != 0) {
          this.$message.success("读卡成功！");
          if (this.receivePatientData.bedCode === undefined) {
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
          this.tl_isLoading = false;
        } else if (result.data.length == 0) {
          this.tl_isLoading = false;
          this.$message.warning("未找到对应患者！");
        } else {
          this.tl_isLoading = false;
          this.$message.error("读卡失败！");
        }
      } catch (e) {
        this.tl_isLoading = false;
      }
    },
    // eslint-disable-next-line complexity
    async fetchPatientsList(searchParams = {}) {
      // 请求 患者列表

      // this.pageParams.pageNo++;
      // debugger;
      try {
        if (this.searchParams.code == 4) {
          // 入院申请患者列表
          this.currentColumn = 1;
          let params = {
            queryString: this.searchParams.search,
            applyDeptId: this.searchParams.technicalOffices,
            ...this.pageParams,
            keyword: searchParams.search,
            billStatus: this.searchParams.isRegister
          };
          let { data, total } = await fetchApplyPatientsList(params);

          this.apply_total = total;
          this.patientsList = data;
          // if (this.pageParams.pageNo == 1) {
          //   this.patientsList = data;
          // } else {
          //   data.forEach(val => {
          //     this.patientsList.push(val);
          //   });
          // }
          // if (data.length == 0) {
          //   this.pageParams.pageNo--;
          // }

          if (this.patientsList.length === 0) {
            this.changeRecPatientData({});
            this.changeRecPatientDatas([]);
            this.changeEntryHosId("");
          } else {
            let arr = true;
            this.patientsList.forEach(val => {
              if (val.patientId == this.receivePatientData.patientId) {
                this.$refs.singleTable.setCurrentRow(val);
                arr = false;
                this.changeRecPatientData(val);
                this.changeEntryHosId(val.applyId);
              }
            });
            if (arr) {
              this.$refs.singleTable.setCurrentRow(this.patientsList[0]);
              this.changeRecPatientData(this.patientsList[0]);
            }
          }

          this.tl_isLoading = false;
        } else {
          // 其他患者列表
          this.currentColumn = 2;
          // debugger;
          let params = {
            isNurse: 1,
            ...this.pageParams,
            ...searchParams,
            keyword: searchParams.search
            //              admissionStatus:'1,2'
          };
          if (this.labelType == "1" || this.labelType == "2") {
            params.admissionStatus = "1,2,7";
          }
          let { data, total } = await fetchPatientsList(params);
          this.total = total;
          this.patientsList = data;
          // if (this.pageParams.pageNo == 1) {
          //   this.patientsList = [];
          // }
          // if (data.length == 0) {
          //   this.pageParams.pageNo--;
          // }
          // data.map(val => {
          //   this.patientsList.push(val);
          // });
          if (this.patientsList.length === 0) {
            this.changeRecPatientData({});
            this.changeRecPatientDatas([]);
            this.changeEntryHosId("");
          } else {
            let arr = true;
            this.patientsList.forEach(val => {
              if (val.patientId == this.receivePatientData.patientId) {
                arr = false;
                this.$refs.singleTable.setCurrentRow(val);
                this.changeRecPatientData(val);
              }
            });
            if (arr) {
              this.$refs.singleTable.setCurrentRow(this.patientsList[0]);
              this.changeRecPatientData(this.patientsList[0]);
            }
          }
          // let _this.tl_isLoading
          this.tl_isLoading = false;
          setTimeout(() => {
            // 增加定时器 防止更改选中状态失败
            this.tl_isLoading = false;
            this.patientsList.forEach(val => {
              this.receivePatientDatas.forEach(item => {
                if (val.patientId === item.patientId) {
                  this.$refs.singleTable.toggleRowSelection(val);
                }
              });
            });
          }, 20);
        }
      } catch (e) {
        this.tl_isLoading = false;
      }
    },
    loadPatientsNext() {
      this.tl_isLoading = true;
      this.fetchPatientsList(this.searchParams);
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.search(this.searchParams);
    }
  }
};
</script>
<style lang="scss" scoped></style>
