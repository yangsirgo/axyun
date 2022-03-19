<template>
  <div class="wrapper position-relative height100">
    <div style="text-align: center">
      <el-button
        @click="addDepartment"
        type="primary"
        icon="el-icon-circle-plus-outline"
        style="margin: 10px"
        >执行科室</el-button
      >
    </div>
    <div style="text-align: center; height: calc(100% - 118px)">
      <el-table :data="execDeptTableList" border height="100%">
        <!-- 业务列 -->
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!--病人科室-->
            <template v-if="item.prop === 'visitDeptId'">
              <!--科室-->
              <l-value-domain
                clearable
                remoteUrl="/wadmin/hos/dept"
                :value.sync="scope.row.visitDeptId"
                remoteShowKey="orgNm"
                remoteValueKey="id"
                :placeholder="'请选择' + item.label"
              ></l-value-domain>
            </template>
            <!--执行科室-->
            <template v-else-if="item.prop === 'execDeptId'">
              <l-value-domain
                clearable
                remoteUrl="/wadmin/hos/dept"
                :value.sync="scope.row.execDeptId"
                remoteShowKey="orgNm"
                remoteValueKey="id"
                :placeholder="'请选择' + item.label"
              ></l-value-domain>
              <!--<el-select v-model="scope.row.eDepartment" placeholder="请选择">-->
              <!--<el-option-->
              <!--:key="0"-->
              <!--label="执行科室"-->
              <!--:value="0">-->
              <!--</el-option>-->
              <!--</el-select>-->
            </template>
            <!--医嘱类别-->
            <!-- <template v-else-if="item.prop === 'type'">
              <el-select v-model="scope.row.type" placeholder="请选择">
                <el-option
                  :key="0"
                  label="医嘱类别"
                  :value="0">
                </el-option>
              </el-select>
            </template>-->
            <!--时间起-->
            <template v-else-if="item.prop === 'startTime'">
              <el-date-picker
                :picker-options="startTime(scope.row.endTime)"
                v-model="scope.row.startTime"
                type="datetime"
                placeholder="开始时间"
                default-time="12:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </template>
            <!--时间止-->
            <template v-else-if="item.prop === 'endTime'">
              <el-date-picker
                :picker-options="endTime(scope.row.startTime)"
                v-model="scope.row.endTime"
                type="datetime"
                placeholder="结束时间"
                default-time="12:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </template>
            <!--默认-->
            <template v-else-if="item.prop === 'isDefault'">
              <el-checkbox
                v-model="scope.row.isDefault"
                true-label="1"
                false-label="0"
              ></el-checkbox>
            </template>
            <!--操作-->
            <template v-else-if="item.prop === 'action'">
              <el-button
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="del(scope.row)"
              ></el-button>
            </template>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="position: absolute; right: 10px; bottom: 10px">
        <!--<el-button @click="reset">取消</el-button>-->
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveDoctorsAdvice,
  getDoctorsAdviceInfo
} from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import { removeAdviceExecRelate } from "@/api/systemManagement/dataMaintain/doctorsAdviceRelation";

export default {
  name: "executiveDepartments",
  props: {
    execDeptTable: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    execDeptTable: {
      handler(val) {
        this.execDeptTableList = val || [];
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      execDeptTableList: [],
      /* start 开始时间小于今天,结束时间不能大于开始时间 */
      startTime: {},
      endTime: {},
      tableParams: [
        {
          prop: "visitDeptId",
          label: "病人科室",
          width: 130,
          fixed: true
        },
        {
          prop: "execDeptId",
          label: "执行科室",
          width: 130,
          fixed: true
        },
        {
          prop: "isDefault",
          label: "默认",
          width: 50,
          fixed: true
        },
        /*{
          prop:'type',
          label:'医嘱类别'
        },*/ {
          prop: "startTime",
          label: "时间起",
          width: 200
        },
        {
          prop: "endTime",
          label: "时间止",
          width: 200
        },
        {
          prop: "action",
          label: "操作",
          width: 60
        }
      ]
    };
  },
  created() {
    this.startTime = function(eDate) {
      return {
        disabledDate(time) {
          return time.getTime() > new Date(eDate).getTime();
        }
      };
    };

    this.endTime = function(sDate) {
      return {
        disabledDate(time) {
          return time.getTime() < new Date(sDate).getTime();
        }
      };
    };
  },
  methods: {
    addDepartment() {
      for (var i = 0; i < this.execDeptTableList.length; i++) {
        if (
          !this.execDeptTableList[i].execDeptId ||
          !this.execDeptTableList[i].visitDeptId
        ) {
          this.$message("请把数据填写完整！");
          return false;
        }
      }

      let propList = this.tableParams.map(item => {
        return item.prop;
      });
      let obj = {
        __targetId__: +new Date()
      };
      propList.forEach(item => {
        obj[item] = "";
      });
      console.info("execDeptTableList", this.execDeptTableList);
      this.execDeptTableList.push(obj);
    },
    deleteConfirm(text) {
      return new Promise((resolve, reject) => {
        this.$confirm(text, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            //继续选中操作
            resolve(true);
          })
          .catch(() => {
            //取消操作
            reject(false);
          });
      });
    },
    async del(row) {
      if (row.__targetId__) {
        this.execDeptTableList = this.execDeptTableList.filter(item => {
          return item.__targetId__ !== row.__targetId__;
        });
        let data = this.execDeptTableList;
        this.$emit("handleDel", data);
        return;
      }

      try {
        await this.deleteConfirm("确认删除本条数据吗？");
        removeAdviceExecRelate(row).then(res => {
          console.log(res);
          if (res.code === 1) {
            this.execDeptTableList = this.execDeptTableList.filter(item => {
              return item.id !== row.id;
            });
            let data = this.execDeptTableList;
            this.$emit("handleDel", data);
            this.$message.success(res.msg || "删除成功！");
          } else {
            this.$message.error(res.msg || "删除失败！");
          }
        });
      } catch (e) {}
    },
    save() {
      let data = this.execDeptTableList;
      this.$emit("handleSave", data);
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.utils-cls {
  padding: 0 10px;
}

.margin5 {
  margin: 5px 0;
}

.mr3 {
  margin-right: 3px;
}

/deep/ .cell {
  padding: 0 !important;
}
</style>
