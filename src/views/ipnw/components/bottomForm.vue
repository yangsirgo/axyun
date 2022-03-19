<template>
  <div class="Rp-bottom-card">
    <div class="wrapper">
    <LInputTable
      id="bottomFormInputTable"
      :popoverWidth="800"
      v-model="autoComIpt"
      suffix-icon="el-icon-search"
      style="width:200px;"
      :tableData="selectDrop.selectOptions"
      @query="search"
      @select="select"
      :tableParams="selectDrop.dropColumn"
      placeholder="请输入项目名称关键字"></LInputTable>
    <div class="display-list">
      <div v-for="item in selectDrop.displayList" tableLoading="true" class="display-list-item" :key="item.title">
        <span class="title">{{item.title}}</span>
        <template v-if="item.prop == 'price' || item.prop == 'amt'">
          <span>{{item.value | rounding}}元</span>
        </template>
        <template v-else>
          <span class="value" >{{item.value != "" ? item.value : '--'}}</span>
        </template>
      </div>
    </div>
    <div class="RpCls">
      <!--<div class="RpClsTitle">-->
        <!--处方设置-->
      <!--</div>-->
      <div style="margin-top: 20px">
        <el-form :model="selectDrop.ruleForm" :rules="selectDrop.rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="" prop="onceDosage">
            <l-formt-title label="单次剂量"  labelWidth="64">
              <el-input
                v-model.number="selectDrop.ruleForm.onceDosage">
                <template slot="append">{{selectDrop.drugItem.dosageUnit ? selectDrop.drugItem.dosageUnit : ""}}</template>
              </el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item label="" prop="quantity">
            <l-formt-title label="数量"  style="width: 60%;">
              <el-input-number size="medium" v-model.number="selectDrop.ruleForm.qty" @change="computeAmt" step-strictly :controls="false"></el-input-number>
            </l-formt-title>
            <el-select v-model="selectDrop.ruleForm.unitKey" placeholder="单位"  style="width: 66px; vertical-align: top" @change="unitChange">
              <el-option
                v-for="item in selectDrop.unitOptions"
                :label="item.label"
                :key="item.value"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="useWay">
            <l-formt-title label="用法">
              <l-value-domain
                :code="111"
                :value.sync="selectDrop.ruleForm.useWay"
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>

          <el-form-item label="" prop="frequency">
            <l-formt-title label="频次">
              <!--<el-select v-model="selectDrop.ruleForm.frequencyKey" placeholder="请选择频率"  @change="frequencyChange">-->
              <l-value-domain
                code="menzhen_zhuyuan"
                :remoteShowKey="code"
                :value.sync="selectDrop.ruleForm.frequency"
                placeholder="请选择频次"
              ></l-value-domain>
            </l-formt-title>
          </el-form-item>
          <el-form-item label="" prop="skinText" class="skinTest">
            <el-checkbox v-model="selectDrop.ruleForm.skinText">皮试</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="flowRate" class="flowRate">
            <l-formt-title label="滴速">
              <el-input-number size="medium" v-model="selectDrop.ruleForm.dropRate" step-strictly :controls="false"></el-input-number>
            </l-formt-title>
          </el-form-item>
          <el-form-item label="" prop="setDrugsTime">
            <l-formt-title label="嘱托" labelWidth="64">
              <el-input v-model="selectDrop.ruleForm.administrationTimeCode">
              </el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item label="" prop="remarks">
            <l-formt-title label="备注">
              <el-input v-model="selectDrop.ruleForm.remarks">
              </el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="button">保存</el-button>
            <el-button @click="cancel" class="button">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span style="display: none">{{RptableData}}</span>
    </div>
  </div>
</template>

<script>

  import { getAdviceItem, getRecipeNo, saveOrders} from "@/api/cis/order/order";

  export default {
    name: "bottomForm",
    data() {
      return {
        autoComIpt:'',
        // 分页数据
        currentPage: 1,
        pageSize: 5,
        total: 1,
        queryName: "",
        selectDrop: {
          drugItem: {},   // 选中医嘱信息
          displayList: [
            // {
            //   title: '处方',
            //   prop: 'recipeNo',
            //   value: ''
            // },
            {
              title: '药品名称',
              prop: 'orderItemName',
              value: ''
            },
            {
              title: '规格',
              prop: 'spec',
              value: ''
            },
            {
              prop: 'price',
              title: '单价',
              value: 0
            },
            {
               prop: 'drugDosage',
               title: '剂量',
               value: ''
            },
            {
              prop: 'amt',
              title: '金额',
              value: 0
            },
            {
              prop: 'execDeptName',
              title: '执行科室',
              value: ''
            },
            {
              prop: 'drugStock',
              title: '库存',
              value: ''
            },
            {
              prop: 'stockNum',
              title: '预减库存',
              value: ''
            }
          ],
          unitOptions: [],
          ruleForm: {
            useWay: '',//用法
            qty: '',//数量
            frequency: '',//频率
            unitKey: '',//单位
            onceDosage : '',//单次计量
            remarks: '',//备注
            skinText : 1,//皮试
            dropRate : '',//滴速
            administrationTimeCode : ''// 给药时间
          },
          rules: {
            useWay: [
              {required: true, message: '请选择用法', trigger: 'blur'}
            ],
            frequency: [
              {required: true, message: '请选择频次', trigger: 'blur'}
            ],
            qty: [
              {required: true, message: '请填写数量', trigger: 'blur'},
              {
                pattern: /^[0-9]{1,8}$/,
                message: "数量必须为整数且小于8位！"
              }
            ],
            onceDosage: [
              {required: true, message: '请填写单次剂量', trigger: 'blur'},
              {
                pattern: /^[0-9]{1,8}$/,
                message: "单次剂量必须为整数且小于8位！"
              }
            ],
            remarks: [
              // {required: false, message: '请选择数量', trigger: 'blur'}
            ]
          },
          dropColumn: [ // 下拉 table 配置表头
            {
              prop: 'reimburseName',
              label: '报销',
              width: 60
            },
            {
              prop: 'orderItemName',
              label: '名称',
              width: 100
            },
            {
              prop: 'spec',
              label: '规格',
              width: 100
            },
            {
              prop: 'price',
              label: '单价',
              width: 100
            },
            {
              prop: 'execDeptName',
              label: '药房',
              width: 100
            },
            {
              prop: 'itemTypeName',
              label: '项目类别',
              width: 100
            },
            {
              prop: 'stockNum',
              label: '库存',
              width: 100
            },
            {
              prop: 'basicType',
              label: '基药',
              width: 100
            }
          ],
          selectOptions: []
        }
      }
    },
    components : {

    },
    methods: {
      search (){ // 输入检索

      },
      select (){ // 选择检索结果

      },
      computeAmt (){
        
      },
      submitForm (formName){ // 提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {

            }
            this.$emit('save', '保存成功')
          } else {
            this.$emit('save', '保存失败')
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancel (){
        this.$emit("cancel")
      }
    },
    computed : {

    },
    watch: {

    },
    mounted() {
      //页面跳转 保存提示
      window.onbeforeunload = function (e) {
        // if(_this.$route.fullPath =="/layout/add"){

        // }else{
        //   window.onbeforeunload =null
        // }
      }
    },

    filters: {
      rounding (value) {
        return new Number(value).toFixed(4)
      }
    },
    destroyed() {
      window.onbeforeunload = null
    }
  }
</script>

<style lang="scss" scoped>
  .Rp-bottom-card {
    width: 100%;
    /*height: 233px;*/
    /*background: rgba(255, 255, 255, 1);*/
    /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
    border-radius: 4px;
    padding: 20px;
    overflow: unset !important;
    /*/deep/ .el-card__body {*/
      /*overflow-x: auto;*/
    /*}*/
    .wrapper {
      overflow: auto;
      width: 100%;
      height: 108%;
    }
    .demo-ruleForm {
      /*white-space: nowrap;*/
    }
    .display-list {
      border-bottom: 1px solid rgba(228, 228, 228, 1);
      white-space: nowrap;
      .display-list-item {
        line-height: 60px;
        display: inline-block;

        .title {
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
        }

        .value {
          padding-left: 10px;
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(46, 50, 58, 1);
          line-height: 20px;
        }
      }

      .display-list-item + .display-list-item {
        margin-left: 60px;
      }
    }

    .RpCls {
      .RpClsTitle {
        font-size: 14px;
        
        font-weight: bold;
        color: rgba(148, 157, 163, 1);
        line-height: 60px;
      }

      /deep/ .el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
        display: inline-block;
      }

      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        width: 200px;
      }
    }
  }

  .button {
    vertical-align: 12px;
  }
  .skinTest {
    /deep/.el-form-item__content {
      width: 50px !important;
      /deep/.el-checkbox {
        vertical-align: 12px;
      }
    }
  }
</style>
