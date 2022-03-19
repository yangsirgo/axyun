<template>
  <div class="page height100">
    <div class="table-utils">
      <l-formt-title
        label="机构"
        style="width:250px"
        class="margin-wrap"
      >
        <l-value-domain
          type="select"
          clearable
          filterable
          :value.sync="tableUtils.hosId"
          remoteUrl="/admin/org/hos-tree"
          remoteShowKey="label"
          remoteValueKey="id"
          placeholder="请选择"
          @change="searchHandle"
          @clear="searchHandle"
        ></l-value-domain>
      </l-formt-title>
      <l-formt-title
        label="开单日期"
        style="width:300px"
        class="margin-wrap"
      >
        <el-date-picker
          v-model="tableUtils.timeList"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="searchHandle"
          @clear="searchHandle"
          :clearable="false"
        ></el-date-picker>
      </l-formt-title>
      <l-formt-title
        label="科室"
        style="width:200px"
        class="margin-wrap"
      >
        <l-value-domain
          clearable
          remoteUrl="/wadmin/hos/dept"
          type="select"
          :value.sync="tableUtils.ouptDeptId"
          remoteShowKey="orgNm"
          remoteValueKey="id"
          placeholder="请选择科室"
          @change="searchHandle"
          @clear="searchHandle"
        ></l-value-domain>
      </l-formt-title>
      <l-formt-title
        label="医生"
        style="width:200px"
        class="margin-wrap"
      >
        <el-select
          v-model="tableUtils.doctorId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="姓名/拼音/五笔"
          :remote-method="selectAllUser"
          :loading="selLoading"
          @focus="selectAllUser('')"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </l-formt-title>
      <l-formt-title
        label="患者姓名"
        style="width:200px"
        class="margin-wrap"
      >
        <el-input
          v-model="tableUtils.patientName"
          @clear="searchHandle"
        ></el-input>
      </l-formt-title>
      <l-formt-title
        label="处方分类"
        style="width:200px"
        class="margin-wrap"
      >
        <el-select
          clearable
          @clear="searchHandle"
          @change="searchHandle"
          v-model="tableUtils.recipeTypes"
          placeholder="请选择处方分类"
        >
          <el-option
            v-for="item in rpOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </l-formt-title>
      <l-formt-title
        label="特殊处方"
        style="width:416px"
        class="margin-wrap"
      >
        <div
          class="height100"
          style="display:flex;align-items: center;height: 32px;"
        >
          <el-checkbox
            v-model="tableUtils.diseaseRecipe"
            true-label="1"
            false-label="0"
          >慢性病药品</el-checkbox>
          <el-checkbox
            v-model="tableUtils.recipeCat"
            true-label="1"
            false-label="0"
          >精神类处方</el-checkbox>
          <el-checkbox
            v-model="tableUtils.freeRecipe"
            true-label="1"
            false-label="0"
          >免费处方</el-checkbox>
        </div>
      </l-formt-title>
      <l-formt-title
        label="收费状态"
        style="width:200px"
        class="margin-wrap"
      >
        <l-value-domain
          clearable
          code="chargeStatus"
          type="select"
          :value.sync="tableUtils.chargeStatus"
          placeholder="收费状态"
          @change="searchHandle"
          @clear="searchHandle"
        ></l-value-domain>
      </l-formt-title>
      <div>
        <el-button
          class="margin-wrap sBtn"
          type="primary"
          @click="searchHandle"
        >查 询</el-button>
        <el-button
          @click="exportRecodHandler"
          class="myBtn el-button--primary"
          >导出</el-button>
      </div>
    </div>
    <div
      class="table-main"
      v-loading="tMainLoading"
    >
      <div class="table-main-top">
        <mainTable
          :tableData="tableList"
          :totalObj="totalObj"
        ></mainTable>
      </div>
      <div class="table-main-bottom">

        <el-pagination
          style="text-align: end;"
          @size-change="searchHandle"
          @current-change="searchHandle"
          :current-page.sync="pageData.pageNo"
          :page-sizes="[20, 30, 50, 100]"
          :page-size.sync="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import mainTable from "./demo";
import service1 from "@/api/systemManagement/receipt/receipt";
import { getOrdersByStatistic, exportHistoryAndPrescriptionExcel } from "@/api/cis/order/order";

export default {
  data() {
    return {
      tMainLoading: false,
      tableUtils: {
        recipeTypes: "",
        timeList: [],
        hosId: "",
        doctorId: "",
        ouptDeptId: "",
        chargeStatus: "",
        diseaseRecipe: "",
        recipeCat: "",
        freeRecipe: "",
        patientName: ""
      },
      rpOptions: [
        {
          label: "西药",
          value: 10
        },
        {
          label: "中成药",
          value: 12
        },
        {
          label: "中草药",
          value: 11
        },
        {
          label: "检查",
          value: 5
        },
        {
          label: "检验",
          value: 6
        },
        {
          label: "处置治疗",
          value: 2
        }
      ],
      pageData: {
        pageNo: 1,
        total: 1,
        pageSize: 20
      },
      tableList: [],
      totalObj: {
        patientNum: 0,
        amt: 0,
        billNum: 0
      },
      selLoading: false,
      options: []
    };
  },
  components: {
    mainTable
  },
  mounted() {
    //时间默认当日
    let startTime = this.dayjs(new Date()).format(
      "YYYY-MM-DD"
    );

    this.tableUtils.timeList = [startTime, startTime];
    console.log("this.tableUtils", this.tableUtils);
    // 默认登录机构
    let { hosIdNum, hosId } = this.getLoginPamars();
    this.tableUtils.hosId = hosIdNum || hosId;

    this.searchHandle();
  },
  methods: {
    // 导出
    async exportRecodHandler() {
      let params = this.getParams();
      params = {
        ...params, 
        ...{
          exportType: 2
        }
      }

      // try {
        let res = await exportHistoryAndPrescriptionExcel(params);
        let blob = res;
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          let parent = document.getElementsByTagName('body')[0]
          let a = document.createElement('a');
          a.download = '处方记录.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          a.click();
          parent.removeChild(a);
        }
      // } catch (error) {
      //   this.$message.error("导出错误！");
      // }

    },
    getLoginPamars() {
      const Pamars = "pamars";
      return JSON.parse(localStorage.getItem(Pamars));
    },
    getParams() {
      // startDate
      // stopDate
      // ouptDeptId
      // doctorId
      // patientName
      // recipeTypes
      // recipeCat
      // freeRecipe
      // diseaseRecipe
      // chargeStatus
      this.tableUtils.timeList = this.tableUtils.timeList ? this.tableUtils.timeList : [];
      
      let {
        diseaseRecipe,
        recipeCat,
        freeRecipe
      } = this.tableUtils;

      let params = {
        startDate: this.tableUtils.timeList[0] || "",
        stopDate: this.tableUtils.timeList[1] || "",
        ...this.tableUtils,
        ...this.pageData,
        ...{
          diseaseRecipe: diseaseRecipe === "0" ? "" : diseaseRecipe,
          recipeCat: recipeCat === "0" ? "" : recipeCat,
          freeRecipe: freeRecipe === "0" ? "" : freeRecipe
        }
      };

      console.log("params:::", params);
      return params;
    },
    async searchHandle() {
      console.log("搜索！");
      if (this.tMainLoading) return;
      this.tMainLoading = true;
      try {
        let {
          data,
          code,
          msg,
          pageNo,
          pageSize,
          total
        } = await getOrdersByStatistic(this.getParams());
        if (code == 1) {
          let { mainPart, patientNum, amt, billNum } = data[0] || {
            mainPart: [],
            patientNum: 0,
            amt: 0,
            billNum: 0
          };
          this.tableList = mainPart;
          this.pageData = { pageNo, pageSize, total };
          this.totalObj = { patientNum, amt, billNum };
        } else {
          this.$message.error(msg || "获取处方列表失败！");
        }
      } catch (error) {
        this.$message.error("获取处方列表失败！");
      } finally {
        this.tMainLoading = false;
      }
    },
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  background-color: #fff;
  padding: 8px;
  flex-direction: column;
  .table-utils {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    .margin-wrap {
      margin: 5px;
    }
  }
  .table-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 0;
    .table-main-top {
      padding: 8px;
      flex: 1;
      min-height:0;
      // overflow: auto;
    }
    // .table-main-bottom {

    // }
  }
}
</style>
