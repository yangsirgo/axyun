<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content">
        <div class="main">
          <div class="search">
            <el-row :gutter="10">
              <el-col :span="3">
                <LFormtTitle label="机构列表">
                  <el-input :value="hosName" disabled></el-input>
                  <!-- <el-select v-model="searchData.hosId" clearable placeholder="请选择">
                    <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select> -->
                </LFormtTitle>
              </el-col>
              <!-- <el-col :span="3">
                <LFormtTitle label="药品类型">
                  <el-select v-model="searchData.manageType" clearable placeholder="请选择" @change="manageTypeFun">
                    <el-option v-for="item in storageTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="3">
                <LFormtTitle label="药房名称" labelWidth="76">
                  <el-select v-model="searchData.storageCode" clearable placeholder="请选择" @change="storageChange">
                    <el-option v-for="item in drugStorageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col> -->
              <el-col
                :span="6"
                style="display: flex;justify-content: space-around;align-items: center;"
              >
                <LFormtTitle label="操作日期" labelWidth="76">
                  <el-date-picker
                    v-model="dateObj"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="dateObjFun"
                  ></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col :span="9" class="align-right">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset" plain>重置</el-button>
                <!-- <el-button type="primary" plain @click="print" v-hotKey="{ func: 'func_print' }">打印</el-button>
                <el-button type="primary" plain @click="exportExcel">导出</el-button> -->
              </el-col>
            </el-row>
          </div>
          <div class="table">
            <el-col>
              <h2 style="text-align: center;margin: 0px;">{{ listName }}</h2>
              <el-col>
                <el-col :span="6">
                  <el-col
                    >机构：<span>{{ hosName }}</span></el-col
                  >
                </el-col>
                <el-col
                  :span="18"
                  style="display: flex;align-items: center;justify-content: flex-end;"
                >
                  <!-- <el-col>药房名称：<span>{{curStorage}}</span></el-col> -->
                  <el-col :span="4">开始时间：{{ dateObj[0] }}</el-col>
                  <el-col :span="4">结束时间：{{ dateObj[1] }}</el-col>
                </el-col>
              </el-col>
              <!-- <el-col>
                <el-col :span="6">
                  <el-col>药品类型：<span>{{manageTypeName}}</span></el-col>
                </el-col>
                <el-col :span="4">
                  <el-col :span="12">开始时间：{{dateObj[0]}}</el-col>
                  <el-col :span="12">结束时间：{{dateObj[1]}}</el-col>
                </el-col>
              </el-col> -->
            </el-col>
            <el-table
              ref="singleTable"
              :data="drugData"
              border
              width="100%"
              height="100%"
              highlight-current-row
              v-loading="tlm_isLoading"
              element-loading-text="加载中..."
              @header-dragend="headerDragend"
            >
              <el-table-column
                type="index"
                width="70"
                label="序号"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in tableParams"
                :key="index"
                sortable
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                header-align="center"
                :fixed="item.fixed"
                :type="item.type"
                show-overflow-tooltip
              >
                <!-- span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span> -->
                <template slot-scope="scope">
                  <template v-if="item.prop == 'patientGender'">
                    <span
                      :val="scope.row.patientGender || '--'"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'packQuantity'">
                    <span class="overflow-point">{{
                      scope.row[item.prop]
                    }}</span>
                    <span
                      :val="scope.row.drugUnit || '--'"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'drugUnit'">
                    <span
                      :val="scope.row.drugUnit || '--'"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'originCode'">
                    <span
                      :val="scope.row.originCode"
                      code="Manufacturer"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else>
                    <span class="overflow-point">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-col>
              <el-col :span="12">
                <el-col
                  >制表人：<span>{{ operationOfName }}</span></el-col
                >
              </el-col>
              <el-col :span="12">
                <el-col
                  >制表时间：<span>{{ myDate }}</span></el-col
                >
              </el-col>
            </el-col>
            <el-col>
              <el-pagination
                style="float: right;"
                background
                @size-change="changeSize"
                @current-change="changePage"
                :current-page="searchData.pageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total"
              ></el-pagination>
            </el-col>
          </div>
        </div>
      </slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import stock from "@/api/hmm/stock";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { print, preview, onPreview } from "@/utils/print";
import { jsonToExcel } from "@/utils/excel/excel";
import { getRoles, getRole, setRole, getUserName } from "@/utils/auth";
import Base64 from "@/utils/base64";
export default {
  name: "inStorageList",
  components: {
    FlowMenu
  },
  data() {
    return {
      // 配置代码  开始
      // 列表名字
      listName: "4+7药品使用情况统计",

      // 配置代码结束
      searchData: {
        hosId: "", //机构列表
        // manageType: '', //药品类型
        // storageCode: "", //药品名称
        eDeliveryTime: "", //结束时间
        sDeliveryTime: "", //开始时间
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      dateObj: [],
      manageTypeName: "",
      curStorage: "",
      myDate: this.getNowFormatDate(),
      drugStorageList: [],
      storageTypeList: [
        {
          wubi: "FUYSA",
          GBCode: "no has",
          code: "W",
          pinyin: "WTMZY",
          name: "无痛麻醉药",
          _id: "084975549e2f4cbda6f550ba9f5fbda9"
        },

        {
          wubi: "GOOA",
          GBCode: "no has",
          code: "1",
          pinyin: "YLJY",
          name: "一类精药",
          _id: "282f91eaa7cd42b5a1876d3b25a4508d"
        },
        {
          wubi: "GNAK",
          GBCode: "no has",
          code: "D",
          pinyin: "DXYP",
          name: "毒性药品",
          _id: "367a22cc869840daa0c06836dd8b58e1"
        },
        {
          wubi: "FOOA",
          GBCode: "no has",
          code: "2",
          pinyin: "ELJY",
          name: "二类精药",
          _id: "568eea3045944192b29943b06a17fadf"
        },
        {
          wubi: "KTAK",
          GBCode: "no has",
          code: "Z",
          pinyin: "GZYP",
          name: "贵重药品",
          _id: "908d0488860244cb8ef07145eba3426f"
        },
        {
          wubi: "YSAK",
          GBCode: "no has",
          code: "M",
          pinyin: "MZYP",
          name: "麻醉药品",
          _id: "e9c69de0390146cc88316265758e129c"
        }
      ],
      tlm_isLoading: false,
      drugData: [],
      tableParams: [
        {
          prop: "drugName",
          label: "药品名称",
          align: "center"
          // width: 160
        },
        {
          prop: "spec",
          label: "规格",
          align: "center"
          // width: 160
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "center"
          // width: 160
        },
        {
          prop: "recipeCount",
          label: "处方数",
          align: "center"
        },
        {
          prop: "drugQuantityDisplay",
          label: "药品数量",
          align: "center"
          // width: 160
        },
        {
          prop: "amt",
          label: "总金额",
          align: "center"
          // width: 160
        },
        {
          prop: "freeDrugQuantityDisplay",
          label: "免费发放数量"
          // width: 160
        }
      ],
      operationOfName: "",
      hosName: "" //机构名称
    };
  },
  created() {
    this.changeTime();
    this.listForPhaList();
    this.getDrugStorageList("0,1,2");
    this.operationOfName = Base64.decode(getUserName());
    this.hosName = JSON.parse(this.getPamars()).hosName;
    const end = new Date(
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    );
    const start = new Date(
      new Date(new Date().toLocaleDateString()).setMonth(
        new Date().getMonth() - 1
      )
    );

    this.dateObj = [
      this.dayjs(start).format("YYYY-MM-DD HH:mm:ss"),
      this.dayjs(end).format("YYYY-MM-DD HH:mm:ss")
    ];
    console.log(`this.dateObj`, this.dateObj);
  },
  methods: {
    changeTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到当前年份
      var month = now.getMonth(); //默认得到月份是上一个月，如果当前是3月，这个值为2月
      if (month == 12)
        //如果当前是1月，则获取到的数据为12月，年份减一
        year = year - 1;
      var nextMonth = month + 1; //其实就是当前月份
      month = month.toString().padStart(2, "0"); //当小于10时，显示为01.02.03
      nextMonth = nextMonth.toString().padStart(2, "0");
      this.searchData.sDeliveryTime = year + "-" + month + "-" + "01"; //拼接日期
      this.searchData.eDeliveryTime = year + "-" + nextMonth + "-" + "01";
      console.log(
        this.searchData.sDeliveryTime + "  " + this.searchData.eDeliveryTime
      );
      this.dateObj[0] = this.searchData.sDeliveryTime + "00:00:00";
      this.dateObj[1] = this.searchData.eDeliveryTime + "23:59:59";
    },
    getPamars() {
      const Pamars = "pamars";
      return localStorage.getItem(Pamars);
    },
    search() {
      this.listForPhaList();
    },
    reset() {
      this.searchData = {
        hosId: "", //机构列表
        manageType: "", //药品类型
        storageCode: "", //药品名称
        eDeliveryTime: "", //结束时间
        sDeliveryTime: "", //开始时间
        pageNo: 1,
        pageSize: 20
      };
      this.dateObj = [];
      this.dateObj[0] = this.searchData.sDeliveryTime + "00:00:00";
      this.dateObj[1] = this.searchData.eDeliveryTime + "23:59:59";
    },
    print() {},
    exportExcel() {},
    // 分页
    changeSize(val) {
      this.searchData.pageSize = val;
      this.listForPhaList();
    },
    changePage(val) {
      this.searchData.pageNo = val;
      this.listForPhaList();
    },
    // 分页

    headerDragend() {
      this.$refs.singleTable.doLayout();
    },
    dateObjFun() {
      if (!this.dateObj) {
        this.dateObj = [];
      }
      console.log(this.dateObj);
    },
    manageTypeFun(val) {
      console.log(val);
      for (let i = 0; i < this.storageTypeList.length; i++) {
        if (val == this.storageTypeList[i].code) {
          this.manageTypeName = this.storageTypeList[i].name;
          break;
        }
      }
    },
    storageChange(val) {
      let item = this.drugStorageList.find(item => item.code === val);
      this.curStorage = item.name;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate;
      // +" " + date.getHours() + seperator2 + date.getMinutes() +seperator2 + date.getSeconds();
      return currentdate;
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = this.drugStorageList.concat(res.data);
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    //获取列表数据
    async listForPhaList() {
      this.searchData.sDeliveryTime = this.dateObj[0] ? this.dateObj[0] : "";
      this.searchData.eDeliveryTime = this.dateObj[1] ? this.dateObj[1] : "";
      hmmBaseApi
        .listForCentralizedPurchasing(this.searchData)
        .then(res => {
          if (res.code == 1) {
            console.log(res.data, "打印报表的数据");
            this.drugData = res.data;
            this.total = res.total;
          } else {
            this.$message.error(res.msg || "统计数据失败");
          }
          if (res.data.length === 0) {
            this.$message.error("暂无统计数据");
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error(res.msg || "统计数据失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}

.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: $l-color-white;
}

.align-right {
  text-align: right;
}

.near-input {
  line-height: 32px;
}

.table {
  height: calc(100% - 200px);
  margin: 20px 0;
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}

.page {
  .el-pagination {
    padding: 0;

    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}
</style>
