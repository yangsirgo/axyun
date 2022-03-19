<template>
  <div class="height100 saveTemplate">
    <el-form :model="form" :inline="true" :rules="rules" ref="form">
      <el-form-item
        label=""
        :label-width="formLabelWidth"
        prop="shareLevelValue"
      >
        <l-formt-title class="form-item" label="共享等级">
          <!--          <el-select v-model="form.shareLevelValue" placeholder="请选择" @change="setOffice()">-->
          <!--            <el-option-->
          <!--              v-for="item in form.shareLevel"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value">-->
          <!--            <zheng/el-option>-->
          <!--          </el-select>-->
          <l-value-domain
            style="line-height: 34px; width: 100%;"
            code="LevelType"
            :value.sync="form.shareLevelValue"
            remoteValueKey="code"
            placeholder=""
            @change="setOffice()"
          ></l-value-domain>
        </l-formt-title>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        <l-formt-title class="form-item" label="模板所属科室" :disabled="true">
          <el-select
            v-model="form.officeValue"
            placeholder="请选择"
            :disabled="true"
          >
            <el-option
              v-for="item in form.office"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth" prop="firstCategoryCode">
        <l-formt-title class="form-item" label="模板分类">
          <el-select v-model="form.firstCategoryCode" placeholder="请选择模板分类" clearable>
              <el-option
                v-for="(item,index) in firstCategoryCodeOptions"
                :key="index"
                :label="item.dictionaryName"
                :value="item.dictionaryValue">
              </el-option>
            </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth" prop="name">
        <l-formt-title class="form-item" label="模板名称">
          <el-input
            v-model="form.name"
            auto-complete="off"
            maxlength="30"
            placeholder="请填写模板名称"
          ></el-input>
        </l-formt-title>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <!--<el-button type="primary" @click="submitForm('form')" icon="el-icon-plus">保 存</el-button>-->
      <el-button
        type="primary"
        @click="submitForm('form')"
        v-hotKey="{ func: 'func_save' }"
        >保 存</el-button
      >
      <!--<el-button @click="resetForm('form')" icon="el-icon-refresh">清 空</el-button>-->
    </div>
  </div>
</template>

<script>
  import {
    getOrder,
    getPageItemList,
    submitOrders,
    bunching,
    unbunching,
    batchRemoveOrders,
    saveOrdersMould,
    getAdviceItem,
    getRecipeCode
  } from "@/api/cis/order/order";
  import { mapActions, mapGetters } from "vuex";
  // import { localGet } from "@/utils/auth.js"
  import { getRole } from "@/utils/auth";
  import getFirstCategoryCodeOptionsMinxin from "@/views/cis/prescriptionRecor/newPatientsManage/order/templateMaintenance/getFirstCategoryCodeOptions.js";

  export default {
    name: "saveTemplate",
    mixins: [getFirstCategoryCodeOptionsMinxin],
    props: {
      currentChuFangRow: {
        type: Object,
        default() {
          return {}
        }
      },
      hosType: {
        type: String,
        default() {
          return ""
        }
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        rules: {
          shareLevelValue: [
            {required: true, message: "请选择共享等级", trigger: ['blur', 'change']}
          ],
          name: [{required: true, message: "请填写模板名称", trigger: "blur"}]
        },
        form: {
          // shareLevel: [{
          //   value: '1',
          //   label: '全院'
          // }, {
          //   value: '2',
          //   label: '科室'
          // }, {
          //   value: '3',
          //   label: '个人'
          // }],
          firstCategoryCode: "",
          office: [],
          name: '',
          id: 0,
          businessValue: '',
          shareLevelValue: '2',
          medicalStandardValue: '',
          officeValue: ''
        }
        // multipleSelection: []
      }
    },
    created() {
      let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum;
      this.getFirstCategoryCodeOptions({
        catalogCode: "CIS_OUTAPTIENT_MB",
        hosId
      })
    },
    methods: {
      ...mapActions({
        setLeaveAppLoadKey: "cis/setLeaveAppLoadKey"
      }),
      // eslint-disable-next-line consistent-return
      submitForm(formName) {

        console.log(this.multipleSelections);
        //zhengyawen
        if(this.currentChuFangRow.row_id && !this.currentChuFangRow.orderStatus){
          this.$message.error("未保存的医嘱不能存为模板！");
          return;
        }
        // debugger
        if (this.multipleSelections.length < 1) {
          this.$message.warning("请选择至少一条处方信息！");
          return;
        }
        let outpatientCisTempDetails = [];
        let recipeId = this.multipleSelections[0].recipeId;
        console.info(recipeId);
        console.info(this.multipleSelections);

        // 暂存后的医嘱才可以保存模板
        let everyIsSubmit = this.multipleSelections.every(item=>{
          return item.orderStatus !== "" && item.orderStatus !== null && item.orderStatus !== undefined;//只有暂存和提交状态能提交
        });

        if (!everyIsSubmit) {
          this.$message.warning("未保存的医嘱不能存为模板！");
          return;
        }

        for (let i = 0; i < this.multipleSelections.length; i++) {
          let item = {
            itemId: this.multipleSelections[i].orderItemId,
            itemCat: this.multipleSelections[i].orderCat,
            classCode: this.multipleSelections[i].classCode,
            spec: this.multipleSelections[i].spec,
            dosage: this.multipleSelections[i].dosage,
            dosageUnit: this.multipleSelections[i].dosageUnit,
            frequencyCode: this.multipleSelections[i].frequencyCode,
            unit: this.multipleSelections[i].unit,
            skinTest: this.multipleSelections[i].skinTest,
            stSolutionType: this.multipleSelections[i].stSolutionType,
            remark: this.multipleSelections[i].remark,
            itemName: this.multipleSelections[i].orderItemName,
            useWay: this.multipleSelections[i].useWay,
            price: this.multipleSelections[i].price,
            amt: this.multipleSelections[i].amt,
            unitFlag: this.multipleSelections[i].unitFlag,
            quantity: this.multipleSelections[i].quantity,
            manageType: this.multipleSelections[i].manageType,
            oneDosage: this.multipleSelections[i].onceDosage,
            formCode: this.multipleSelections[i].formCode,
            dropRate: this.multipleSelections[i].dropRate,
            administrationTimeCode: this.multipleSelections[i].administrationTimeCode,
            excessReason: this.multipleSelections[i].excessReason,
            isMajor: this.multipleSelections[i].isMajor,
            groupNo: this.multipleSelections[i].groupNo,
            // executeDepartmentId: this.multipleSelections[i].execDeptId,
            executeDepartmentName: this.multipleSelections[i].execDeptName,
            frequencyTimes: this.multipleSelections[i].frequencyTimes,
            frequencyUnit: this.multipleSelections[i].frequencyUnit,
            packageUnit: this.multipleSelections[i].packUnit,
            packQuantity: this.multipleSelections[i].packQuantity,
            day: this.multipleSelections[i].day,
            useDay: this.multipleSelections[i].useDay,
            execDeptCode: this.multipleSelections[i].receiveDept,
            executeDepartmentId: this.multipleSelections[i].receiveDept
          };
          if(this.multipleSelections[i].recipeId === recipeId){
            outpatientCisTempDetails.push(item);
          }else{
            this.$message.warning("请选择同一处方保存模板！");
            return;
          }

        }
        // console.log(JSON.stringify(this.multipleSelections))
        // console.log(JSON.stringify(outpatientCisTempDetails))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              firstCategoryCode: this.form.firstCategoryCode,
              templetName: this.form.name,
              shareLevel: this.form.shareLevelValue,
              templetType: this.form.shareLevelValue,
              deptId: '',
              outpatientCisTempDetails: outpatientCisTempDetails,
              templetRange: this.hosType === "1" ? "1" : this.hosType === "3" ? "3" : null
            };
            switch (this.psRegorActiveTabName) {
              case "adviceTable":
                data.templetType = 10;
                break;
              case "chmMedicine":
                // data.execDeptCode =
                data.templetType = 11;
                break;
              case "treatMedicine":
                data.templetType = 2;
                break;
            }
            console.log("模板保存入参templetType::", data, "psRegorActiveTabName", this.psRegorActiveTabName);
            // console.log("&&&&&&&&&&&&&&&:" + JSON.stringify(data));
            saveOrdersMould(data).then((res) => {
              if (res.code === 1) {
                this.$message.success("保存模板成功！");
                /*this.$notify({
                  title: '成功',
                  message: '保存模板成功',
                  type: 'success'
                });*/
                this.form.name = "";
                let reloadKey = + new Date() + '' + 'CHANGEFORM?radio=' + this.form.shareLevelValue;
                this.setLeaveAppLoadKey (reloadKey);
              } else {
                this.$message.error(res.msg || '保存模板失败');
                /*this.$notify.error({
                  title: '错误',
                  message: '保存模板失败'
                });*/
              }
            })

          } else {
            console.log('error submit!!');
            return;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      setOffice() {
        if (this.form.shareLevelValue == '1') {
          let role = typeof getRole() !== "undefined" ? JSON.parse(getRole()) : false;
          //console.log("role::::", role);         
         let officeObj = {
            value: role.deptId,
            label: role.deptName
          }
          this.form.officeValue = role.deptId;
          this.form.office.push(officeObj);
          // console.log(JSON.stringify(this.form.office))
          // this.form.officeValue = role.deptId;
          // this.form.office[0] = role.deptName;
        } else {
          this.form.office = [];
          this.form.officeValue = '';
        }
      }
    },
    computed: {
      ...mapGetters("cis", ["multipleSelections"]),
      ...mapGetters("cis", ["psRegorActiveTabName"])
    },
    watch: {
      // multipleSelections: {
      //   handler(n) {
      //     this.multipleSelection = n;
      //   },
      //   //immediate: true, 不需要这个
      //   deep: true //深度监听
      // }
    }
  }
</script>

<style scoped lang="scss">
.saveTemplate {
  position: relative;
  padding: 16px;
  font-size: 0;
  .dialog-footer {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
