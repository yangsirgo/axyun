<template>
  <div class="sick">
    <el-table
      ref="tableElem"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;"
      height="100%"
      v-loading="loading"
      v-loadmore="loadNextPage"
      element-loading-text="加载中..."
    >
      <el-table-column
        :prop="item.prop"
        v-for="(item,index) in tableParams"
        :key="index"
        :label="item.label"
        :min-width="item.minWidth"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <tempalte  v-if="item.prop === 'startDate'">
            {{ scope.row| formatStartDate }}
          </tempalte>
          <tempalte  v-else-if="item.prop === 'endDate'">
            {{ scope.row | formatEndDate }}
          </tempalte>
          <template v-else-if="item.prop == 'operate'">
            <el-button
            @click.native.prevent="handleEdit(scope.row)"
            type="mini"
            size="small"
            >
            删除
            </el-button>
          </template>
          <template v-else>{{ scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { getSickLeave } from "@/api/cis/order/order";
export default {
  name: "historicalSickLeave",
  data() {
    return {
      // 列表数据
      // tableData: [
      //   {
      //     start: "2019-09-01",
      //     days: "2",
      //     diagnosis: "病毒性流感",
      //     suggest: "输液治疗"
      //   },
      //   {
      //     start: "2019-09-03",
      //     days: "1",
      //     diagnosis: "胃炎",
      //     suggest: "住院治疗"
      //   }
      // ],
      tableData: [],
      tableParams: [
        // {
        //   prop: "operate",
        //   label: "操作",
        //   width: "70"
        // },
        {
          label: "开始时间",
          prop: "startDate",
          minWidth :"130"
        },
        {
          label: "结束时间",
          prop: "endDate",
          minWidth :"140"
        },
        {
          label: "建议天数",
          prop: "days",
          minWidth :"50"
        },
        {
          label: "临床诊断",
          prop: "diagName",
          minWidth :"130"
        },
        {
          label: "临床建议",
          prop: "content",
          minWidth :"130"
        }
      ],
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false,
      loading: false
    };
  },
  filters : {
    formatStartDate (value) {
      console.log(value,'过滤器过滤数据');
      let dateText = format(new Date(value.startDate),'yyyy-MM-dd');
      let timeText = value.startTime === '0' ? '上午':'下午';
      return dateText + ' ' + timeText;
    },
    formatEndDate (value) {
      console.log(value,'过滤器过滤数据');
      let dateText = format(new Date(value.endDate),'yyyy-MM-dd');
      let timeText = value.endDate === '0' ? '上午':'下午';
      return dateText + ' ' + timeText;
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["leaveAppLoadKey"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        // alert(val.visitCode);
        this.getDiaByClinicType();
        this.loadTable();
        console.log(val); // 监听 患者 ID 变化 触发事件 reload table 数据
      },
      immediate: true,
      deep: true
    },
    // 刷新当前的 请假单列表
    leaveAppLoadKey (n) {
      this.loadTable();
    }
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    handleEdit(){
      console.log('删除')
    },
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载table数据
    async loadTable() {
      try {
        this.loading = true;
        console.log("testttt");
        let params = {
          patientId: this.receivePatientData.patientId,
          pageNum: 1,
          pageSize: 100
        };
        let res = await getSickLeave(params);
        console.log("jlfdsjlfjdl");
        console.log(res);
        this.tableData = res.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    },
    getDiaByClinicType() {
      getDiaByClinicType()
        .then(res => {
          console.log(res);
          console.log("-----------:" + JSON.stringify(res));
        })
        .catch(() => {});
    }
  }
};

function format (formatDate, format) {
  let date = {
    "M+": formatDate.getMonth() + 1,
    "d+": formatDate.getDate(),
    "h+": formatDate.getHours(),
    "m+": formatDate.getMinutes(),
    "s+": formatDate.getSeconds(),
    "q+": Math.floor((formatDate.getMonth() + 3) / 3),
    "S+": formatDate.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (formatDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

</script>
<style lang='scss' scoped>
.sick {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #fff;
}
</style>
