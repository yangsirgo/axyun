<template>
  <l-table
    :pageSize="pageParams.pageSize"
    :page="pageParams.pageNo"
    :total="pageParams.total"
    :background="false"
    :paginationSmall="true"
    layout="prev,pager,next"
    :showTotal="true"
    paginationAlign="center"
    @changeSize="sizeChangePatientList"
  >
    <div class="patient-penetrate-container">
      <div class="patient-penetrate-box">
        <el-table
          ref="multipleTable"
          @row-click="clickRow"
          :data="data"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="32"> </el-table-column>
          <el-table-column label="家床号码" width="60">
            <template slot-scope="scope">{{ scope.row.bedCode }}</template>
          </el-table-column>
          <el-table-column prop="patientName" label="姓名" width="60">
          </el-table-column>
          <el-table-column label="性别" width="60">
            <template slot-scope="scope"
              ><span
                :val="scope.row.patientGender"
                code="GENDER_CODE"
                v-codeTransform
                v-if="scope.row.patientGender"
              ></span
            ></template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </l-table>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      //   patientList: [],
      currentRowIndex: ""
    };
  },
  mounted() {
    console.log("你好左侧显示数据打印", this.data);
    this.resetPageParams();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData"
    }),
    handleSelectionChange(val) {
      console.log("选择的左侧数数据");
      this.changeRecPatientData(val);
    },
    clickRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      /* this.changeRecPatientData(row); */
    },
    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.$emit("sizeChangePatientList", a);
    },
    // 点击获取
    patientListFun(item, a) {
      this.currentRowIndex = a;
      console.log("item", item);
      // 判断是否有基本信息
      this.$emit("patientListFun", item);

      this.changeRecPatientData({
        ...item,
        ...{
          patientAge: String(item.age),
          patientGender: item.gender
        }
      });
    },
    resetPageParams() {
      this.pageParams = {
        pageNo: 1,
        pageSize: 10000,
        total: 0
      };
    },
    setpageParams(pageParams) {
      this.pageParams = pageParams;
    }
  },
  components: {},
  watch: {
    data: {
      deep: true,
      handler(val) {
        //   if (val.length > 0){
        //       this.
        //   }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.is-active .nameStyle {
  color: #ffffff;
}
/deep/ .el-table-column--selection .cell {
  padding-right: 3px;
  padding-left: 3px;
}
/deep/ .l-table-page {
  display: none;
}
.listItem-top-style .fontSizeStyle {
  color: #ffffff;
}

.fontSizeStyle {
  overflow: hidden;
  /*设置超出的部分进行影藏*/
  text-overflow: ellipsis;
  /*设置超出部分使用省略号*/
  white-space: nowrap;
  text-align: left;
  color: #666c70;
  font-size: 12px;
}

.fontSize {
  text-align: left;
  color: #949da3;
  font-size: 10px;
}

.show-patient-detail {
  font-size: 12px;
  color: #949da3;
}

.name-text {
  max-width: 42px;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #2e323a;
  line-height: 20px;
}

.code-text {
  max-width: 24px;
}

.emptyList {
  width: calc(100% - 24px);
  margin-top: 30vh;
  font-size: 12px;
  font-weight: 400;
  color: #b9c4cc;
  text-align: center;
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maxWidth42 {
  max-width: 42px;
}

.maxWidth32 {
  max-width: 42px;
}

.patient-top-wrapper {
  font-size: 0px;
  display: flex;
  align-items: center;

  .patient-top {
    display: inline-block;
    flex: 1;
    display: flex;
    align-items: center;

    > span {
      display: inline-block;
    }

    > span + span {
      margin-left: 4px;
    }
  }

  .bedNo {
    display: inline-block;
    font-weight: 700;
    text-align: center;
    color: #f05a23;
    font-size: 14px;
  }
}
</style>
