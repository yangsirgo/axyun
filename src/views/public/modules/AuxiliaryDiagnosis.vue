<!--
<template>
  <div class="width100 height100" v-loading="loading">
    <div
      class="width100 height100 overflow-scroll-vertical"
      v-infinite-scroll="loadNextPage"
      infinite-scroll-disabled="listDisabled"
    >
      <el-collapse v-model="activeNames">
        <l-collapse-item
          sty="4"
          v-for="(item, index) in listData"
          :key="'list' + index"
          :name="index"
        >
          <template slot="title">
            <div class="width100">
              <span>{{item.title}}</span>
              <span
                :class="['float-right', item.prob >= 80 ? 'prob-1' : (item.prob >= 60 ? 'prob-2' : 'prob-3')]"
              >{{item.prob}}%</span>
            </div>
          </template>
          <template slot="content">
            <div class="detail-container">
              <div class="content-block" v-show="item.clinical && item.clinical.length > 0">
                <p class="content-title">{{"临床表现"}}</p>
                <div class="labels">
                  <span
                    v-for="(l1, l1Idx) in item.clinical"
                    :key="'clinical' + l1Idx"
                    class="label-clinical"
                  >{{l1}}</span>
                </div>
              </div>
              <div class="content-block" v-show="item.inspect && item.inspect.length > 0">
                <p class="content-title">{{"检查"}}</p>
                <div class="labels">
                  <span
                    v-for="(i1, i1Idx) in item.inspect"
                    :key="'inspect' + i1Idx"
                    class="label-inspect"
                  >{{i1 + (i1Idx == item.inspect.length - 1 ? "" : ", ")}}</span>
                </div>
              </div>
            </div>
          </template>
        </l-collapse-item>
        <p v-if="loading" class="load-list-bottom">{{$t('base.loading')}}</p>
        <p v-if="noMore" class="load-list-bottom">{{$t('base.noMore')}}</p>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

// 辅助诊断
export default {
  data() {
    return {
      activeNames: [],

      // 列表数据
      listData: [
        {
          title: "肾结石",
          clinical: ["高血压病史", "左肾积水", "积水扩张"],
          inspect: ["尿蛋白++", "隐血++"],
          prob: 80.8
        },
        {
          title: "泌尿道感染",
          clinical: ["左肾积水", "下单便阻"],
          prob: 40
        }
      ],
      // 分页控制参数
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // 列表状态控制
      loading: false
    };
  },
  computed: {
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载列表数据
    loadTable() {
      try {
        this.loading = true;
        // TODO await request
        let listData = [];
        for (let i = 0; i < 0; i++) {
          listData.push({
            title: "肾结石",
            clinical: ["高血压病史", "高血压病史", "高血压病史"],
            inspect: ["尿蛋白++", "隐血++"],
            prob: 89.5
          });
        }
        this.listData = listData.concat(this.listData);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 10px 0px 10px 10px;
}
.content-block {
  padding-top: 10px;
}
.content-title {
  color: $l-color-fontcolor-4;
}
.labels {
  margin: 10px 0px;
}
.label-clinical {
  display: inline-block;
  padding: 1px 5px;
  background: $l-color-fontcolor-4;
  border-radius: 2px;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 1;
  color: white;
}
.prob-1 {
  color: #e55d5d;
}
.prob-2 {
  color: #f7a820;
}
.prob-3 {
  color: #6bc649;
}
.el-collapse {
  border: 0;
}
</style>
-->
<template>
  <div class="container height100">
    <div v-if="show">
      <div class="patientInfo width100">{{patientInfoList[0].diagName}} 患者</div>
      <div class="infoList" v-for="(value,key) in patientInfoList" :key="key">
        <div class="infoTitle">{{value.infName}}</div>
        <div class="infoContent">
          <div v-if="value.orderNum=='1'">
            <div
              class="medicine"
              v-for="(item,index) in value.relationInfs"
              :key="index"
            >{{item.infContent}}
            </div>
          </div>
          <div v-else>
            <el-row>{{value.infContent}}</el-row>
            <div
              v-for="(item,index) in value.relationInfs"
              :key="index"
            >
              <el-row>{{item.infTitle}}</el-row>
              <el-row>{{item.infContent}}</el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="height100" v-else style="font-size:16px;color:#909399;text-align:center">暂无患者诊疗信息</div>
  </div>
</template>
<script>
  import {patDiagAuxiliaryInf} from '@/api/arch/arch.js';
  import {getPatDiagByIcd10} from '@/api/common/diagnosis';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        patientInfoList: [],
        loading: false,
        show: false
      };
    },
    computed: {
      ...mapGetters("cis", ["diaName"]),
    },
    watch: {
      "diaName": {
        async handler(n) {
          this.patientInfoList = [];
          if (JSON.stringify(n) != '{}') {
            if (n.diagCode) {
              await this.getInfo();
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.getInfo();
    },
    methods: {
      //搜索
      async getInfo() {
        this.loading = true;
        try {
          let params = {
            diagCode: this.diaName.diagCode
          };
          let res = await getPatDiagByIcd10(params);
          if (res.code == '1') {
            this.patientInfoList = [...res.data];
          } else {
            this.$message.error(res.msg || "获取诊疗信息失败");
          }
          if (!this.patientInfoList || this.patientInfoList.length <= 0) {
            this.show = false;
          } else {
            this.show = true;
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取诊疗信息失败");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .container {
    overflow-y: auto;

    .patientInfo {
      height: 40px;
      background: rgba(255, 241, 241, 1);
      border-radius: 2px;
      text-align: center;
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(239, 15, 15, 1);
      line-height: 40px;
      margin-bottom: 20px;
    }

    .infoList {
      border-bottom: 1px solid #e4e4e4;
      margin-bottom: 20px;

      .infoTitle {
        font-size: 14px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        margin-bottom: 15px;
      }

      .infoContent {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(148, 157, 163, 1);
        margin-bottom: 10px;

        .pathogenyDescribe {
          margin-bottom: 10px;
        }

        .el-row {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .medicine {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>

