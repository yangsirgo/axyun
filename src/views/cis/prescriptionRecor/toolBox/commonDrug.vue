<template>
  <commonDrugShow 
  v-loading="loading" 
  ref="reference" 
  :drugList="drugList" 
  @typeChange="typeChange" 
  @itemClick="setRpDrug"></commonDrugShow>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex';
  import {selectCommonMedica, getViewItemDetail} from "@/api/tools/commonDrug.js";
  import {deepClone, Throttle} from "@/utils/index.js";
  import commonDrugShow from "@/components/adviceCommon/modules/commonDrugShow.vue";

  export default {
    data() {
      return {
        category: 'doctor',
        classification: [{
          name: '医生常用药',
          code: 'doctor'
        }, {
          name: '科室常用药',
          code: 'dept'
        }],
        drugDemo: {
          orderItemName: "5%葡萄糖注射液（100ml）",
          spec: "100ml*1袋/袋",
          price: 0,
          basicType: "", // 基药
          orderItemCat: ""
        },
        drugList: [],
        loading: false,
        // 列表数据
        listData: [],
        // 分页控制参数
        pageParams: {
          pageNo: 0, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        itemLoad: false,
        isOnWayFlag:false//引用药品 时间较长，期间只能引用一次
      };
    },
    components: {
      commonDrugShow
    },
    computed: {
      ...mapGetters("cis", ["leaveAppLoadKey","psRegorActiveTabName"]),
      ...mapGetters("base", ["receivePatientData"]),
      // 获取登录用户信息
      ...mapGetters("user", ["name", "role"]),
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
    // created() {
    //   this.loadData();
    // },

    methods: {
      ...mapActions({
        changeWestCommonDrug: "cis/changeWestCommonDrug",
        changeChnCommonDrug: "cis/changeChnCommonDrug",
        changeNonCommonDrug: "cis/changeNonCommonDrug"
      }),
      typeChange(category) {
        this.loadData(category);
      },
      setRpDrug : Throttle(function (item){
        switch (this.psRegorActiveTabName) {
          case "adviceTable":
            this.setWestDrug(item);
            break;
          case "chmMedicine":
            this.setChnDrug(item);
            break;
          case "treatMedicine":
            this.setNonDrug(item);
            break;
        };
      },1000),
      setWestDrug (item){ //西药
        if (this.isOnWayFlag) return;
        let data = {
          itemId: item.orderItemId
        };
        this.isOnWayFlag = true;
        getViewItemDetail(data)
          .then(res => {
            if (res.code === 1) {
              if (res.data) {
                let item = res.data;
                // item.__time__ = +new Date();

                let tableRow = {
                  ...item,
                  __time__:+new Date(),
                  itemId: item.itemId || "",
                  itemCode: item.itemCode || "",
                  orderItemName: item.drugName || "",
                  production: item.production || "",
                  itemType: item.itemType || "",
                  classCode: item.classCode || "",
                  itemTypeName: item.itemTypeName || "",
                  execDeptCode: item.execDeptCode || "",
                  execDeptName: item.execDeptName || "",
                  spec: item.spec || "",
                  price: new Number(item.price).toFixed(4) || "",
                  unit: item.unit || "",
                  limitUnit: item.limitUnit || "",
                  packQuantity: item.packQty || "",
                  defaultDosageUnit: item.defaultDosageUnit || "",
                  defaultUsage: item.defaultUsage || "",
                  dosage: item.dosage || "",
                  stockNum: item.stockNum || "",
                  manageType: item.manageType || "",
                  formCode: item.formCode || "",
                  basicType: item.basicType || "",
                  unitSaleFlg: item.unitSaleFlg || "",
                  reimburseMark: item.reimburseMark || "",
                  reimburseName: item.reimburseName || "",
                  clinicMark: item.clinicMark || "", //成组样式
                  medicareItemCode: item.medicareItemCode || "",
                  medicareItemName: item.medicareItemName || "",
                  stClassCode: item.stClassCode || "",
                  stType: item.stType || "",
                  relateItemId: item.relateItemId || "",
                  stSolutionType: item.stSolutionType || "",
                  stRemindTime: item.stRemindTime || "",
                  validTime: item.validTime || "",
                  positiveDispense: item.positiveDispense || "",
                  applicationRange: item.applicationRange || "",
                  frequencyCode: item.frequencyCode,
                  frequencyUnit: item.frequencyUnit,
                  frequencyTimes: item.frequencyTimes
                };
                this.changeWestCommonDrug(tableRow);
              }
            } else {
              this.$message.error("该医嘱项无效！");
            }
            this.isOnWayFlag = false;
          })
          .catch(err => {
            this.$message.error( err.msg || "获取不到该医嘱项");
            this.isOnWayFlag = false;
          });
      },
      setNonDrug (item){ // 治疗医嘱
        item = {
          ...item,
          ...{
            reloadKey: + new Date()
          }
        };
        this.changeNonCommonDrug(item);
      },
      async setChnDrug (item){ //中草药
        //判断中草药库存
        item = deepClone(item);
        await this.changeChnCommonDrug(item);
      },
      loadData(category) {
        this.loading = true;
        let data = {
          selectType: category || ""
        };

        switch (this.psRegorActiveTabName) {
          case "adviceTable":
            data.orderType = 10;
            break;
          case "chmMedicine":
            data.orderType = 11;
            break;
          case "treatMedicine":
            data.orderType = 2;
            break;
        };

        selectCommonMedica(data)
          .then(res => {
            if (res.code === 1) {
              this.drugList = res.data;
              //this.drugDemo = this.drugList[0];
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      }
      // 引用
      /* quote(row) {
        if (!this.receivePatientData.patientId) {
          this.$message.warning("请选择患者");
          return;
        }
        this.$confirm("您确定要引用此诊断吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            const data = deepClone(row);
            data.diagMain = "0";
            data.patientId = this.receivePatientData.patientId;
            data.isFirst = "1";
            data.diagDoctorId = this.role.userId;
            data.diagDoctorName = this.name;
            if (this.receivePatientData.visitCode) {
              data.visitCode = this.receivePatientData.visitCode;
              this.$delete(data, "inpCode");
            } else if (this.receivePatientData.inpCode) {
              data.inpCode = this.receivePatientData.inpCode;
              this.$delete(data, "visitCode");
            }
            this.$delete(data, "id");
            addDiag(data)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("引用成功");
                  this.$emit("load-diag-table");
                } else {
                  this.$message.error(res.msg || "引用失败");
                }
              })
              .catch(err => {
                this.$message.error(err || "引用失败");
              });
          })
          .catch(err => {
            this.$message.info("已取消引用");
          });
      } */
    },
    watch: {
      psRegorActiveTabName() {
        this.pageParams.pageNo = 1;
        this.loadData();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .common {
    .utils {
      padding: 10px 0;
    }
  }

  .commonItem {
    position: relative;
    .itemMask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0);
      transition: 0.3s;
      z-index:10;
      margin: auto;
      line-height: 96px;
      text-align: center;
      .itemMaskText {
        color: #2b4583;
        font-weight: bold;
        font-size: 20px;
        opacity: 0;
        transition: 0.5s;
      }
    }
  }

  .commonItem:hover > .itemMask {
    background: rgba(0,0,0,.3);
    cursor: pointer;
    .itemMaskText {
      opacity: 1;
    }
  }

  .commonItem:hover > .itemMask > .itemMaskText{
    opacity: 1;
  }

  .drugItem {
    background-color: #f1f4f6;
    padding: 5px;
    margin-bottom: 10px;
    box-shadow: unset;

    .drugName {
      font-size: 14px;
      
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      margin-bottom: 5px;
    }

    .spec {
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
      margin-bottom: 5px;
    }
  }
</style>
