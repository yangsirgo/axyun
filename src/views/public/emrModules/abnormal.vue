<template>
  <div class="height100 width100">
    <!-- 搜索条件 -->
    <div id="searchBox" class="search-box">
      <!-- 日期-->
      <div>
        <el-date-picker
          style="width:100% !important"
          v-model="search.Date"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        ></el-date-picker>
      </div>

      <!-- 类别 -->
      <el-checkbox-group
        class="scopeLevel"
        v-model="scopeLevel"
        @change="getSectionTempl"
      >
        <el-checkbox label="1">
          <span style="width: 55px; display: inline-block">体温单</span>
        </el-checkbox>
        <el-checkbox label="2">
          <span style="width: 55px; display: inline-block">护理文书</span>
        </el-checkbox>
        <el-checkbox label="3">
          <span style="width: 55px; display: inline-block">评估结果</span>
        </el-checkbox>
        <el-checkbox label="4">
          <span style="width: 55px; display: inline-block">其他</span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="out_box height100" style="height: calc(100% - 100px)">
      <el-table
        :data="listData"
        border
        width="100%"
        height="100%"
        ref="singleTable"
        highlight-current-row
      >
        <el-table-column
          v-for="(item, index) in tableParamsZ"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          header-align="center"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <!--<template slot-scope="scope">
            <span
              v-if="item.prop === 'clinicType'"
              v-codeTransform
              :val="scope.row[item.prop]"
              code="VisitingCategoryCode"
            ></span>
            <span
              v-else-if="item.prop === 'diagType'"
              v-codeTransform
              :val="scope.row[item.prop]"
              code="DiseaseDiagnosisCategoryCode"
            ></span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>-->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getList } from "@/api/emrRecord/tools/nursingAssistant";
import { addDiag } from "@/api/emrRecord/common/diagnosis";
import { deepClone } from "@/utils/index.js";
export default {
  name: "timeLine",
  data() {
    return {
      //搜索数据
      search: {
        Date: "",
        page: 1,
        limit: 10
      },
      beginDate: "",
      endDate: "",
      load: false,
      scopeLevel: [],
      listData: [],
      tableParamsZ: [
        {
          prop: "sourceName",
          label: "来源",
          align: "center",
          fixed: false
        },
        {
          prop: "note",
          label: "异常项",
          align: "center",
          fixed: false
        },
        {
          prop: "abnormalValue",
          label: "异常值",
          align: "center",
          fixed: false
        },
        {
          prop: "dateTime",
          label: "发生时间",
          align: "center",
          fixed: false
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.loadData();
  },
  watch: {
    receivePatientData: {}
  },
  methods: {
    changeDate() {
      this.beginDate = "";
      this.endDate = "";
      if (this.search.Date != null) {
        if (this.search.Date) {
          this.beginDate = this.dateFormat(
            "YYYYmmdd",
            this.stringToDate(this.search.Date[0])
          );
          this.endDate = this.dateFormat(
            "YYYYmmdd",
            this.stringToDate(this.search.Date[1])
          );
        }
      }
      this.loadData();
    },
    getSectionTempl() {
      this.loadData();
    },
    /*'yyyy-MM-dd HH:mm:ss'格式的字符串转日期*/
    stringToDate(str) {
      let tempStrs = str.split(" ");
      let dateStrs = tempStrs[0].split("-");
      let year = parseInt(dateStrs[0], 10);
      let month = parseInt(dateStrs[1], 10) - 1;
      let day = parseInt(dateStrs[2], 10);
      let timeStrs = tempStrs[1].split(":");
      let hour = parseInt(timeStrs[0], 10);
      let minute = parseInt(timeStrs[1], 10);
      let second = parseInt(timeStrs[2], 10);
      let date = new Date(year, month, day, hour, minute, second);
      return date;
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },

    loadData() {
      this.load = true;
      getList({
        beginDate: this.beginDate,
        endDate: this.endDate,
        sourceType: this.scopeLevel
      })
        .then(res => {
          if (res.code === 1) {
            this.listData = res.data;
          }
          this.load = false;
        })
        .catch(err => {
          this.load = false;
        });
    }

    /*quoteFunc(row) {
        this.$confirm("您确定要引用此诊断吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const data = deepClone(row);
            data.diagMain = "0";
            if (this.receivePatientData.visitCode) {
              data.visitCode = this.receivePatientData.visitCode;
              this.$delete(data, "inpCode");
            } else if (this.receivePatientData.inpCode) {
              data.inpCode = this.receivePatientData.inpCode;
              this.$delete(data, "visitCode");
            }
            this.$delete(data, "id");
            addDiag(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("引用成功");
                  this.$emit("load-diag-table");
                } else {
                  this.$message.error(res.msg || "引用失败");
                }
              })
              .catch(err => {
                this.$message.error(err || "引用失败");
              });
          })
          .catch(() => {
            this.$message.info("已取消引用");
          });
      }*/
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  width: 45px;
  text-align: left;
  color: #3d7dfb;
}
.scopeLevel {
  margin: 10px 10px 10px 0;
}

.curr-record {
  margin: 10px;
}
</style>
