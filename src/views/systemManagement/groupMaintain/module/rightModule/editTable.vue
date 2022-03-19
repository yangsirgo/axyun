<template>
  <el-form :model="fromData" ref="tableFrom" class="tableWrapperForm height100" :rules="fromData.rules">
    <el-button style="margin-bottom:15px" class="fr" :disabled="readonly"  icon="el-icon-circle-plus-outline" size="mini" plain @click="addDepartment">新增明细</el-button>
    <div  style="height: calc(100% - 51px)">
      <el-table
        class="mainTable"
        highlight-current-row
        :data="fromData.tableData"
        border
        @cell-click="cellClick"
        height="100%">
        <!-- 业务列 -->
        <el-table-column
          v-for="(item,index) in tableParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <template v-if="item.prop === 'action'">
              <el-button size="small" type="text" style="width: 100%" icon="el-icon-delete"
                         @click="del(scope.row)"></el-button>
            </template>
            <template v-else-if="item.prop === 'itemName'">
              <el-form-item
                v-if="!scope.row.id"
                :prop="'tableData.'+scope.$index+'.itemName'"
                :rules="fromData.fromDataRules.itemName"
                :show-message="false">
                <!--药品的下拉-->
                <LInputTable
                  v-if="scope.row.classify == 1"
                  ref="lInputTable"
                  id="bottomFormInputTable"
                  :popoverWidth="800"
                  suffix-icon="el-icon-search"
                  :tableData="selectOptions"
                  @query="search($event, scope.row, scope.$index)"
                  v-model="scope.row.itemName"
                  valueKey="drugName"
                  @select="select"
                  :tableLoading="inputTableLoading"
                  :tableParams="dropColumn"
                  placeholder="请输入药品关键字"
                ></LInputTable>
              </el-form-item>
              <span v-else>{{scope.row.itemName}}</span>
            </template>
            <template v-else-if="item.prop === 'price'">
              <span>{{ scope.row[item.prop] | rounding}}</span>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop]}}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>

<script>
  import {removeAdviceChargeRelate} from '@/api/systemManagement/dataMaintain/adviceChargeRelation'
  import {
    addAdviceItem,
    saveAdviceItem,
    saveAdviceChargeRelation,
    getAdviceItemInfo,
    postAdviceItemInfo,
    getAdviceItemTable
  } from '@/api/systemManagement/dataMaintain/adviceItem'

  export default {
    name: "editTable",
    props:['readonly'],
    components: {},
    data() {
      return {
        fromData: {
          tableData: [],
          fromDataRules: {
            itemName: [{required: true, message: '请选择项目名称', trigger: 'blur'}],
            no: [
              {
                required: true,
                message: "请填写数量",
                trigger: ["blur", "change"]
              },
              {
                pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                message: "请输入正确的数量！"
              }
            ],
          },
        },
        inputTableLoading: false, //下拉table组件 loading
        selectOptions: [],
        currentRow: {},
        selectDropOptions: [],
        // 分页数据
        currentPage: 1,
        pageSize: 5,
        total: 1,
        queryName: "",
        dropColumn: [
          // 收费下拉 table 配置表头
          {
            prop: "classCode",
            label: "项目代码",
            width: 60
          },
          {
            prop: "drugName",
            label: "项目名称",
            width: 100
          },
          {
            prop: "spec",
            label: "规格",
            width: 100
          },
          {
            prop: "drugUnit",
            label: "单位",
            width: 100
          },
          {
            prop: "price",
            label: "单价",
            width: 100
          },
          {
            prop: "originManufacturerCode",
            label: "生产厂家",
            width: 100
          }
        ],
        tableParams: [{
          prop: 'classify',
          label: '类别',
          width: 80
        }, {
          prop: 'itemName',
          width: 150,
          label: '收费项目名称'
        }, {
          prop: 'price',
          label: '金额'
        },{
          prop: '适用范围',
          label: '单位'
        }, {
          prop: 'factory',
          label: '适用属性'
        }, {
          prop: 'execDep',
          label: '所属科室'
        },{
          prop: 'execWard',
          label: '所属病区'
        },{
          prop: 'action',
          label: '操作',
          width: 50
        }]
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      // 选中 药品 或者 项目
      select(row) {

        // for (let key in row) {
        //   this.currentRow[key] = row[key];
        // }
        console.log("row", row);

        this.currentRow.itemName = row.drugName;
        this.currentRow.spec = row.spec;
        this.currentRow.no = row.availableQuantity;
        this.currentRow.unit = row.packUnit;
        this.currentRow.price = row.price;
        this.currentRow.factory = row.originManufacturerCode;


        // 数量 框 获取焦点
        document.getElementById(this.currentRow.__targetId__).focus()
      },
      del(row) {
        console.log('发送删除接口', row);

        removeAdviceChargeRelate(row)
          .then(res => {
            console.log(res)
            if (res.code === 1) {
              this.fromData.tableData = this.fromData.tableData.filter((item) => {
                return item.__targetId__ !== row.__targetId__;
              });
            } else {
              this.$message(res.msg);
            }
          })
      },
      cellClick(a, b, c) {
        if (b.property !== "itemName") return;
        this.currentRow = a;
      },
      // 查询 药品
      search(query, row, index) {
        let self = this;
        let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
        let data = {...{pageNo: pageNo, pageSize: this.pageSize, keyword: query, cwFlag: row.classify}};

        console.log(data);
        getAdviceItemTable(data).then((res) => {
          if (res.code === 1) {
            let tableData = this.currentPage !== 0 ? this.selectOptions : [];
            const {data} = res;
            // 数据返回传递给selectOptions
            self.selectOptions = res.data;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push(item);
            }
            this.selectOptions = tableData;
            // this.currentPage = res.pageNo;
            // this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
        }).catch(res => {
          this.$message.error(res.msg || "获取数据失败");
        });
      },
      addDepartment() {
        let propList = this.tableParams.map((item) => {
          return item.prop;
        });
        let obj = {
          __targetId__: +new Date()
        };
        propList.forEach((item) => {
          obj[item] = '';
        });
        obj['classify'] = '1';
        console.info("tableData", this.fromData.tableData);
        this.fromData.tableData.push(obj);
        // this.classifyArr.push('0');
        //分类获取焦点
        setTimeout(() => {
          let nodeList = this.getDataIdDom('div', 'data-id', String(obj.__targetId__));
          if (nodeList.length > 0) {
            nodeList[0].getElementsByClassName("el-input__inner")[0].focus();
          }
        }, 10);

        this.currentRow = obj;
      },
      reset (){
        this.fromData.tableData = [];
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">

</style>
