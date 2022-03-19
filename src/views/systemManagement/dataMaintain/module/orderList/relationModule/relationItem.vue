<template>
  <el-form :model="fromData" ref="tableFrom" class="tableWrapperForm height100" :rules="fromData.rules">
    <div class="buttonUtils">
      <el-button type="primary" style="margin-bottom:15px" size="mini" @click="addDepartment">新增明细</el-button>
      <el-button style="margin-bottom:15px" size="mini" plain @click="save">保存</el-button>
      <el-button style="margin-bottom:15px" size="mini" plain @click="reset">取消</el-button>
    </div>
    <div style="height: calc(100% - 51px)">
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
            <template v-else-if="item.prop === 'adviceItemName'">
              <el-form-item
                v-show="!scope.row.id"
                :prop="'tableData.'+scope.$index+'.adviceItemName'"
                :rules="fromData.fromDataRules.adviceItemName"
                :show-message="false">
                <!--药品的下拉-->
                <LInputTable
                  ref="lInputTable"
                  id="bottomFormInputTable"
                  :inputName="scope.row.adviceItemName"
                  :data-id="scope.row.__targetId__"
                  :popoverWidth="800"
                  suffix-icon="el-icon-search"
                  :tableData="selectOptions"
                  @query="search($event, scope.row, scope.$index)"
                  v-model="scope.row.adviceItemName"
                  valueKey="drugName"
                  @select="select"
                  :tableLoading="inputTableLoading"
                  :tableParams="dropColumn"
                  placeholder="请输入药品关键字"
                ></LInputTable>
              </el-form-item>
              <span v-show="scope.row.id">{{scope.row.adviceItemName}}</span>
            </template>
            <!--收取规则-->
            <template v-else-if="item.prop === 'collectionRules'">
              <el-form-item
                :prop="'tableData.'+scope.$index+'.collectionRules'"
                :rules="fromData.fromDataRules.collectionRules"
                :show-message="false">
                <l-value-domain
                  code="CollectionRules"
                  :value.sync="scope.row.collectionRules"
                  placeholder="请选择"
                />
              </el-form-item>
            </template>
            <!--组范围-->
            <template v-else-if="item.prop === 'groupScope'">
              <el-form-item
                :prop="'tableData.'+scope.$index+'.groupScope'"
                :rules="fromData.fromDataRules.groupScope"
                :show-message="false">
                <l-value-domain
                  code="GroupScope"
                  :value.sync="scope.row.groupScope"
                  placeholder="请选择"
                />
              </el-form-item>
            </template>
            <!--数量-->
            <template v-else-if="item.prop === 'nums'">
              <el-form-item
                :prop="'tableData.'+scope.$index+'.nums'"
                :rules="fromData.fromDataRules.nums"
                :show-message="false">
                <el-input-number
                  style="width: 100%"
                  v-model="scope.row.nums"
                  :id="scope.row.__targetId__"
                  :min="1"
                  :max="100"
                  @keyup.enter.native="addDepartment"
                  controls-position="right"></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="item.prop === 'ranges'">
              <span :val="scope.row.ranges" code="AntimicrobialRanges" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop === 'adviceCategory'">
                <div v-if="scope.row.adviceCategory.length !== 0" v-for="(item, index) in scope.row.adviceCategory">
                  <span :val="item" code="category_Code" v-codeTransform></span>
                  <span v-show="(index + 1) !==  scope.row.adviceCategory.length">,</span>
                </div>
                <div v-if="scope.row.adviceCategory.length === 0">--</div>
            </template>
            <template v-else-if="item.prop === 'unit' && scope.row[item.prop]">
              <span code="DrugDoseUnit" v-codeTransform :val="scope.row[item.prop]"></span>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] || '--'}}</span>
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
    OwSaveAdviceMedicationRelation,
    oWFindAdviceMedicationRelationPOList,
    deleteAdviceMedicationRelationById,
    getAdviceItemList
  } from '@/api/systemManagement/dataMaintain/adviceItem'

  export default {
    name: "editTable",
    components: {},
    data() {
      return {
        fromData: {
          tableData: [],
          fromDataRules: {
            adviceItemName: [{required: true, message: '请选择项目名称', trigger: 'change'}],
            groupScope: [{required: true, message: '请选择组范围', trigger: 'blur'}],
            collectionRules: [{required: true, message: '请选择收取规则', trigger: 'blur'}],
            nums: [
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
        centerRow:{},
        // 分页数据
        currentPage: 1,
        pageSize: 5,
        total: 1,
        queryName: "",
        dropColumn: [
          // 收费下拉 table 配置表头

          {
            prop: "drugName",
            label: "医嘱名称",
            align: "center",
            width: 100
          },
          {
            prop: "subclassOrders",
            label: "医嘱子类",
            align: "center",
            tableTransform: true,
            width: 60
          },
          {
            prop: "spec",
            label: "规格",
            align: "center",
            width: 100
          },
          {
            prop: "unit",
            label: "单位",
            align: "center",
            tableTransform: true,
            width: 100
          }
        ],
        tableParams: [{
          prop: 'ranges',
          label: '范围',
          width: 80
        }, {
          prop: 'adviceCategory',
          label: '医嘱类别',
          width: 80
        },
        //   {
        //   prop: 'deptId',
        //   label: '科室'
        // },
          {
          prop: 'adviceItemName',
          width: 150,
          label: '医嘱项目'
        }, {
          prop: "spec",
          label: "规格",
          width: 70
        }, {
          prop: 'nums',
          label: '数量',
          width: 120
        }, {
          prop: "unit",
          label: "单位",
          width: 70
        }, {
          prop: 'collectionRules',
          label: '收取规则',
          width: 180
        }, {
          prop: 'groupScope',
          label: '组范围',
          width: 180
        }, {
          prop: 'action',
          label: '操作',
          width: 50
        }]
      };
    },
    created() {
      this.loadData();
    },
    mounted() {

    },
    methods: {
     async loadData(row) {
        console.log('获取数据' + JSON.stringify(row));
        if(row){
          this.centerRow = row;
        } else {
          // this.centerRow = row || {};
        }
        let data = {
          medicationCode:this.centerRow.code
        };

       if (!this.centerRow.code) {
         return;
       }
        let result = await oWFindAdviceMedicationRelationPOList(data);
        if (result.code === 1) {

          this.fromData.tableData = result.data || [];

          this.fromData.tableData.forEach((item,index)=>{
            let list = [];
            if (item.adviceCategory) {
              list = JSON.parse(item.adviceCategory);
            }
            item.adviceCategory = list;
            item.__targetId__ = String(+ new Date()) + index;
          });
        } else {
          this.$message.error(result.msg || '获取数据失败');
        }
      },
      // 选中 药品 或者 项目
      select(row) {

        let adviceCategoryList = [];
        if (row.adviceType) {
          try {
            adviceCategoryList = JSON.parse(row.adviceType);
          } catch (error) {

          }
        }
        console.log(row);
        this.currentRow.ranges = row.userange || '';
        this.currentRow.adviceCategory = adviceCategoryList  || '';
        this.currentRow.deptId = row.orgId || '';
        this.currentRow.adviceItemId = row.itemId || '';
        this.currentRow.adviceItemName = row.drugName || '';
        this.currentRow.spec = row.spec || '';
        // this.currentRow.nums = row.availableQuantity;
        this.currentRow.unit = row.unit || '';

        setTimeout(()=>{
          let dom = document.getElementById(this.currentRow.__targetId__).querySelector('.el-input__inner');
          // 数量 框 获取焦点
          dom && dom.focus();
        },50);

      },
      del(row) {

        let id = row.id;
        console.log(row);
        if (id) {
          deleteAdviceMedicationRelationById({id})
            .then(res => {
              if (res.code === 1) {
                this.fromData.tableData = this.fromData.tableData.filter((item) => {
                  return item.__targetId__ !== row.__targetId__;
                });
                this.$message.success('删除成功');
              } else {
                this.$message.error(res.msg);
              }
            })
        } else {
          this.fromData.tableData = this.fromData.tableData.filter((item) => {
            return item.__targetId__ !== row.__targetId__;
          });
        }
      },
      cellClick(a, b, c) {
        if (b.property !== "adviceItemName") return;
        this.currentRow = a;
      },
      // 查询 药品
      search(query, row, index) {
        let self = this;
        let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
        let data = {
          ...{
            pageNo: pageNo,
            pageSize: this.pageSize,
            name: query,
            cwFlag: row.classify,
            adviceItemName: ''
          }
        };
        if (this.queryName !== query) {
          this.selectOptions = [];
        }
        this.inputTableLoading = true; //增加loading
        console.log("::::::::::::::::::::::::::::::::::::", data);
        getAdviceItemList(data).then((res) => {
          if (res.code === 1) {
            // let tableData = this.currentPage !== 0 ? this.selectOptions : [];
            let tableData = [];
            const {data} = res;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push(item);
            }
            this.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = query;
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.inputTableLoading = false; //增加loading
        }).catch(res => {
          this.$message.error(res.msg || "获取数据失败");
          this.inputTableLoading = false; //增加loading
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
        obj['nums'] = '1';
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
      // 获取 data-id 的dom 元素
      getDataIdDom(tagName, name, value) {
        var selectDom = [];
        var dom = document.getElementsByTagName(tagName);
        for (var i = 0; i < dom.length; i++) {
          if (value === dom[i].getAttribute(name)) {
            selectDom.push(dom[i]);
          }
        }
        return selectDom;
      },
      save() {
        if (Object.keys(this.centerRow).length === 0) {
          this.$message.info('请选择用法');return;
        }
        if (this.fromData.tableData.length === 0) {
          return;
        }
        this.$refs["tableFrom"].validate(async (valid, error) => {
          if (valid) {
            let data = {
              status:1,
              medicationCode:this.centerRow._id,
              data:this.fromData.tableData
            };

            let cloneData = Object.assign(this.fromData.tableData);
            cloneData.forEach((item) => {
              item.medicationCode = this.centerRow.code;
              item.status = 1;
            });

            let result = await OwSaveAdviceMedicationRelation(cloneData);
            if (result.code === 1) {
              this.$message.success(result.msg || '存储数据成功');
              this.loadData();
              // this.$emit('save');
            } else {
              this.$message.error(result.msg || '存储数据失败');
            }
          } else {
            this.showErrorMsg(error)
            return false;
          }
        });
      },
      //表单的error 信息
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function () {
            if (document.getElementsByClassName('el-message').length === 0) {//message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0)
        }
      },
      reset() {
        console.log(this.fromData.tableData)
        // this.fromData.tableData = [];
        this.fromData.tableData = this.fromData.tableData.filter(function(item) {
          if(item.id){
            return item
          }
        });
        console.log(this.fromData.tableData)
      }
    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .buttonUtils {
    text-align: right;
    padding: 0 10px;
  }
</style>
