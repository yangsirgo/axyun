/* eslint-disable no-unused-expressions */
<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom:1px solid #E4E4E4">
        <el-col
          :span="24"
          class="cardTitleStyle"
        >
          <l-card-title>
            <span slot="left">工作时间信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form
          ref="drugForm"
          :rules="rules"
          :model="drugFormDeail"
        >
          <el-row
            style="margin-top:4px"
            :gutter="10"
          >
            <el-col :span="14">
              <el-form-item prop="pharCode">
                <l-formt-title
                  label="药房"
                  labelWidth="36"
                >
                  <el-select
                    v-model="drugFormDeail.pharCode"
                    placeholder="请选择药房"
                  >
                    <el-option
                      v-for="item in drugStorageList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="weekDay">
                <l-formt-title label="日期">
                  <el-select
                    v-model="drugFormDeail.weekDay"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in days"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            style="margin-top:4px"
            :gutter="5"
            v-for="(item,index) in timeLits"
            :key="index"
          >
            <el-col
              :span="24"
              style="line-height:34px;"
            >
              时间段
              <span>{{index + 1 }}</span>
              <!-- <span>{{item.endTime | formatTime('hh:mm')}}</span> -->
            </el-col>
            <el-col :span="13">
              <el-time-select
                style="width:47%"
                v-model="item.startTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00'
                  }"
              ></el-time-select>~
              <el-time-select
                style="width:47%"
                v-model="item.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  minTime: item.startTime
                }"
              ></el-time-select>
            </el-col>
            <el-col :span="7">
              <l-formt-title
                label="系数"
                labelWidth="20"
                :required="true"
              >
                <el-input
                  v-model="item.workCoefficient"
                  style="line-height: 34px;"
                ></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="4">
              <span
                class="remove-button"
                @click="deleteAnoName(index)"
              >
                <svg
                  t="1568190829279"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13492"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z"
                    fill="#FFE3E2"
                    p-id="13493"
                  />
                  <path
                    d="M284.444444 455.111111h455.111112v113.777778H284.444444z"
                    fill="#E1140A"
                    p-id="13494"
                  />
                </svg>
              </span>
              <span
                class="add-button"
                @click="addAnoName(item)"
                v-if="index==timeLits.length-1"
              >
                <svg
                  t="1568190873204"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13604"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                    fill="#E4E4E4"
                    p-id="13605"
                  />
                  <path
                    d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                    fill="#2E323A"
                    p-id="13606"
                  />
                  <path
                    d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                    fill="#2E323A"
                    p-id="13607"
                  />
                </svg>
              </span>
            </el-col>
          </el-row>
          <el-row
            style="margin-top:4px"
            :gutter="10"
          >
            <el-col :span="24">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="chackdays"
              >把当前所有时间段同步其他日期</el-checkbox>
            </el-col>
          </el-row>

          <el-row
            :gutter="10"
            style="margin-top:4px"
          >
            <el-checkbox-group
              v-model="syncWeekDayList"
              @change="handleChecked"
            >
              <el-checkbox
                v-for="item in days"
                :label="item.id"
                :key="item.id"
                :disabled="item.id === drugFormDeail.weekDay"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-row>

          <el-row
            style="margin-top:4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="12">
              <l-formt-title
                label="创建人"
                labelWidth="62"
                style="width:100%"
                :disabled="true"
              >
                <el-form-item
                  label
                  label-width
                  prop="createdByName"
                >
                  <el-input
                    v-model="drugFormDeail.createdByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title
                label="创建时间"
                labelWidth="76"
                style="width:100%"
                :disabled="true"
              >
                <el-form-item
                  label
                  label-width
                  prop="createdAt"
                >
                  <el-input
                    v-model="drugFormDeail.createdAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row
            style="margin-top:4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="12">
              <l-formt-title
                label="修改人"
                labelWidth="62"
                style="width:100%"
                :disabled="true"
              >
                <el-form-item
                  label
                  label-width
                  prop="updatedByName"
                >
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>

            <el-col :span="12">
              <l-formt-title
                label="修改时间"
                labelWidth="76"
                style="width:100%"
                :disabled="true"
              >
                <el-form-item
                  label
                  label-width
                  prop="updatedAt"
                >
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="button-cont">
        <el-button
          class="confirm-button"
          @click="confirm"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import stock from "@/api/hmm/stock";
export default {
  props: ["drugForm", "drugStorageList"],
  data() {
    return {
      days: [
        { id: 1, name: "星期一" },
        { id: 2, name: "星期二" },
        { id: 3, name: "星期三" },
        { id: 4, name: "星期四" },
        { id: 5, name: "星期五" },
        { id: 6, name: "星期六" },
        { id: 7, name: "星期日" }
      ], //日期 '
      timeLits: [], //时间段接口
      checkAll: false,
      isIndeterminate: false,
      syncWeekDayList: [],
      drugFormDeail: {},
      rules: {
        pharCode: [
          { required: true, message: "请选择药房", trigger: "change" }
        ],
        weekDay: [{ required: true, message: "请选择日期", trigger: "change" }]
      }
    };
  },

  filters: {
    formatTime(date, fmt) {
      var date = new Date(date);
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          var str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      return fmt;
    }
  },
  created() {},
  watch: {
    drugForm() {
      this.drugFormDeail = { ...this.drugForm };
      this.gettimeList();
    },
    syncWeekDayList: {
      handler: function(val, oldVal) {
        if (this.syncWeekDayList.length === this.days.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    validateDrugForm() {
      return new Promise((resolve, reject) => {
        this.$refs["drugForm"].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    //获取时间段list
    gettimeList() {
      this.$showLoading();
      let workTimeQueryVO = {};
      workTimeQueryVO.pharCode = this.drugFormDeail.pharCode;
      workTimeQueryVO.weekDay = this.drugFormDeail.weekDay;
      workTimeQueryVO.pageNo = 1;
      workTimeQueryVO.pageSize = 1000;
      stock.getWorkTimeList(workTimeQueryVO).then(res => {
        if (res.code == 1) {
          this.$hideLoading();
          this.timeLits = res.data;
          this.timeLits.forEach(item => {
            item.startTime = this.$options.filters["formatTime"](
              item.startTime,
              "hh:mm"
            );
            item.endTime = this.$options.filters["formatTime"](
              item.endTime,
              "hh:mm"
            );
          });
        }
      });
    },
    condition(value) {
      return value === "" || value === null || typeof value === "undefined";
    },
    // 系数 必填
    wCValidate(list) {
      return list.some(item => {
        return this.condition(item.workCoefficient);
      });
    },
    // 时间 必填
    timeValidate(list) {
      return list.some(item => {
        return this.condition(item.endTime) || this.condition(item.startTime);
      });
    },
    //修改某一条药品数据
    async confirm() {
      let workTimeVO = {};
      let weekDaysList = [];
      this.timeLits.forEach(item => {
        let endTime = item.endTime.replace(":", "");
        let startTime = item.startTime.replace(":", "");
        // 多组时间需要校验时间段： startTime vs 上次的 endTime
        let workCoefficient = item.workCoefficient;
        weekDaysList.push({ startTime, endTime, workCoefficient });
        workTimeVO = { weekDaysList };
      });
      workTimeVO.pharCode = this.drugFormDeail.pharCode;
      workTimeVO.weekDay = this.drugFormDeail.weekDay;
      workTimeVO.syncWeekDayList = this.syncWeekDayList;

      try {
        await this.validateDrugForm();
      } catch (error) {
        return;
      }

      if (this.timeValidate(workTimeVO.weekDaysList)) {
        this.$message.error("请填写时间！");
        return;
      }
      if (this.wCValidate(workTimeVO.weekDaysList)) {
        this.$message.error("请填写系数！");
        return;
      }

      this.$showLoading();
      stock
        .addWorkTime(workTimeVO)
        .then(res => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$message.success(res.msg || "保存成功");
            this.$emit("getRefreshList", workTimeVO);

            setTimeout(() => {
              this.$refs["drugForm"].resetFields();
              this.newadd();
            }, 10);
            
          } else {
            this.$message.error(res.msg || "保存失败");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "保存失败");
        });
    },

    //删除位置
    deleteAnoName(index) {
      if (this.timeLits.length <= 1) {
        this.$delete(this.timeLits, index);
        this.timeLits.push({
          startTime: "",
          endTime: "",
          workCoefficient: ""
        });
      } else {
        this.$delete(this.timeLits, index);
      }
    },
    //新增位置
    addAnoName(item) {
      if (
        item.startTime == "" ||
        item.endTime == "" ||
        item.workCoefficient == ""
      ) {
        this.$message.error("不能为空");
      } else {
        this.timeLits.push({
          startTime: "",
          endTime: "",
          workCoefficient: ""
        });
      }
    },

    chackdays(val) {
      if (!this.checkAll) {
        //实现反选
        this.syncWeekDayList = [];
        this.isIndeterminate = false;
      } else {
        //实现全选
        this.syncWeekDayList = [];
        this.days.forEach(item => {
          this.syncWeekDayList.push(item.id);
        });
      }
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.days.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.days.length;
    },

    //新增
    newadd() {
      this.timeLits = [
        {
          startTime: "",
          endTime: "",
          workCoefficient: ""
        }
      ];
      this.syncWeekDayList = [];
      this.drugFormDeail = {
        isnew: true,
        pharCode: "",
        weekDay: "",
        createdByName: "",
        createdAt: "",
        updatedByName: "",
        updatedAt: ""
      };
    }
  }
};
</script>


<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;
    .cardTitleStyle {
      padding: 8px 0px;
    }
    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);
      overflow-y: auto;
      .remove-button,
      .add-button {
        width: 18px;
        height: 18px;
        margin-top: 8px;
        display: inline-block;
      }
      .add-button {
        margin-left: 10px;
      }
      .el-input__inner {
        padding-left: 15px;
      }
      .el-input__prefix {
        display: none;
      }
    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;

      .confirm-button {
        width: 80px;
        height: 36px;
        padding: 0;
        text-align: center;
        line-height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-white;
        float: right;
      }
    }
  }
}
</style>
