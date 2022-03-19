<template>
  <div class="drug-varieties">
    <div class="search-input">
      <LFormtTitle label="搜索药品(拼音/五笔)" labelWidth="161">
        <el-input v-model="searchValue" style="line-height: 34px;" placeholder="请输入内容"
                  @keyup.enter.native="search"></el-input>
      </LFormtTitle>
    </div>
    <div class="drug-varieties-cont">
      <el-table
        :data="drugData"
        border
        style="width: 100%"
        max-height="300"
        :span-method="merge"
      >
        <el-table-column
          v-for="(item,index) in drugParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :fixed="item.fixed"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import LFormtTitle from "@/components/LFormtTitle.vue";

  export default {
    name: "drugVarieties",
    components: {
      LFormtTitle
    },
    data() {
      return {
        searchValue: '',//搜索框
        //表格
        drugParams: [
          {
            prop: "classify",
            label: "药品分类",
            align: "left",
            width: "203",
            fixed: 'left'
          }, {
            prop: "drugName",
            label: "药品名称",
            align: "left",
            width: "377",
            fixed: false
          }, {
            prop: "formulation",
            label: "剂型",
            align: "left",
            width: "160",
            fixed: false
          }, {
            prop: "specification",
            label: "规格",
            align: "left",
            width: "244",
            fixed: false
          }, {
            prop: "managementType",
            label: "管理类型",
            align: "left",
            width: "357",
            fixed: false
          }, {
            prop: "controlHierarchy",
            label: "控制级别",
            align: "left",
            width: "202",
            fixed: false
          }, {
            prop: "purchasingPrice",
            label: "进价",
            align: "left",
            width: "158",
            fixed: false
          }, {
            prop: "sellingPrice",
            label: "售价",
            align: "left",
            width: "144",
            fixed: false
          }
        ],
        drugData: [],//表格数据
        OrderIndexArr: [],//合并表格数据
        currentIndex: 0,//当前行数
        //分页数据
        page: 1,
        limit: 10,
        total: 0
      }
    },
    created() {

    },
    methods: {
      //获取药品表格数据
      async getDrugList() {
        this.$showLoading();
        try {
          //获取药品数据接口
          // let res = await getDrugList(params);
          //假数据填充
          let res = [
            {
              id: 111,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 111,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 111,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 222,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 222,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 222,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 222,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 333,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }, {
              id: 333,
              classify: '青霉素类',
              drugName: '阿莫西林胶囊',
              formulation: '',
              specification: '',
              managementType: '',
              controlHierarchy: '',
              purchasingPrice: '',
              sellingPrice: ''
            }];
          this.drugData = res;
          this.total = 50;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      //重新整理表格数据
      getOrderNumber() {
        this.OrderIndexArr = [];
        let OrderObj = {};
        this.drugData.forEach((element, index) => {
          element.rowIndex = index;
          if (OrderObj[element.id]) {
            OrderObj[element.id].push(index);
          } else {
            OrderObj[element.id] = [];
            OrderObj[element.id].push(index);
          }
        });
        // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
        for (let k in OrderObj) {
          if (OrderObj[k].length > 1) {
            this.OrderIndexArr.push(OrderObj[k]);
          }
        }
        console.log(this.OrderIndexArr);
      },
      //合并表格方法
      merge({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          for (let i = 0; i < this.OrderIndexArr.length; i++) {
            let element = this.OrderIndexArr[i];
            for (let j = 0; j < element.length; j++) {
              let item = element[j];
              if (rowIndex == item) {
                if (j == 0) {
                  return {
                    rowspan: element.length,
                    colspan: 1
                  };
                } else if (j != 0) {
                  return {
                    rowspan: 0,
                    colspan: 0
                  };
                }
              }
            }
          }
        } else {
          // return {
          //   rowspan: 0,
          //   colspan: 0
          // };
        }

      },
      //enter搜索
      search() {
        this.page = 1;
        this.total = 0;
        this.getDrugList();
        this.getOrderNumber();
      }
    }
  }
</script>

<style scoped lang="scss">
  .drug-varieties {
    width: 100%;
    height: 100%;

    .search-input {
      width: 360px;
      margin-top: 5px;
    }

    .drug-varieties-cont {
      margin-top: 20px;
    }
  }
</style>
