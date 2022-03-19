<template>
  <div class="scheTemps" v-loading="loading">
    <div class="title">
      <!--{{deptName}}-->
      <span
        tableName="sys_org"
        :conditionMap="{
                org_type: '_DEPT_',
                id: deptName
              }"
        columns="org_nm"
        v-tableTransform
      ></span>
    </div>
    <div class="title-temp">周排班模版</div>
    <div class="table-cont">
      <el-table
        :data="scheTempsData"
        width="100%"
        stripe
        border
      >
        <el-table-column
          v-for="(item, index) in scheTempsParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope0">
            <!--<template v-if="item.prop == 'operate'">
              <el-button type="text" @click="quoteItem(scope0.row,scope0.$index)"><i class="iconfont iconmobanyinyong"></i> 引用模板</el-button>
              <el-button type="text" @click="editItem(scope0.row,scope0.$index)"><i class="iconfont iconbianji"></i>修改模版</el-button>
              <el-button type="text" @click="deleteItem(scope0.row,scope0.$index)"><i class="iconfont iconshanchu"></i>删除模版</el-button>
            </template>-->
            <template>
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ scope0.row[item.prop] }}
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="quoteItem(scope0.row,scope0.$index)"><i
                    class="iconfont iconmobanyinyong"></i> 引用模板</span></el-dropdown-item>
                  <el-dropdown-item><span @click="editItem(scope0.row,scope0.$index)"><i
                    class="iconfont iconbianji"></i> 修改模版</span></el-dropdown-item>
                  <el-dropdown-item><span @click="deleteItem(scope0.row,scope0.$index)"><i
                    class="iconfont iconshanchu"></i> 删除模版</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import scheManagement from "@/api/schedule/scheduleManagement.js";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "scheTemps",
    data() {
      return {
        //科室名称
        deptName: '',
        loading: false,
        //模板表头数据
        scheTempsParams: [
          {
            prop: "scheduleTemplateName",
            label: "模版名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "90"
          },
          {
            prop: "createdByName",
            label: "创建人",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "recordRemark",
            label: "备注",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "120"
          }
        ],
        //模板数据
        scheTempsData: []
      }
    },
    watch: {
      "sDept": {
        async handler(n) {
          this.deptName = '';
          this.scheTempsData = [];
          if (n) {
            this.deptName = n.deptId;
            this.getScheTemps();
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters("base", ["sDept"])
    },
    created() {
    },
    methods: {
      ...mapActions({
        changeScheTemlate: 'base/changeScheTemlate'
      }),
      //获取本周排班模板
      async getScheTemps() {
        this.loading = true;
        try {
          let params = {
            sDeptId: this.sDept.deptId
          };
          let data = await scheManagement.getScheduleTemplate(params);
          if (data.code == "1") {
            this.scheTempsData = [...data.data];
          } else {
            this.$message.error(data.msg || "获取排班模板列表失败");
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取排班模板列表失败");
        }
      },
      //引用
      async quoteItem(row, index) {
        this.changeScheTemlate({
          operate: '1',
          templateId: row.templateId
        });
      },
      //修改
      async editItem(row, index) {
        this.changeScheTemlate({
          operate: '2',
          templateId: row.templateId,
          dataVersion: row.dataVersion
        });
      },
      //删除
      deleteItem(row, index) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true;
          try {
            let params = {
              templateId: row.templateId
            };
            let res = await scheManagement.deleteSche(params);
            if (res.code == '1') {
              this.$message("刪除排班模板成功");
              this.getScheTemps();
            } else {
              this.$message.error(res.msg || "刪除排班模板失败");
            }
            this.loading = false;
          } catch (e) {
            this.loading = false;
            this.$message.error(e.msg || "刪除排班模板失败");
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .scheTemps {
    .title {
      margin: 20px 0 20px 10px;
      font-size: 18px;
      
      font-weight: bold;
      color: $l-color-fontcolor-3;
    }

    .title-temp {
      margin: 0 0 20px 10px;
      font-size: 14px;
      
      font-weight: 400;
      color: $l-color-fontcolor-4;
    }

    .table-cont {
      .el-button {
        margin-left: 0;
      }
    }
  }
</style>
