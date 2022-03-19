<template>
  <el-form :model="fromData" ref="tableFrom" class="tableWrapperForm height100" :rules="fromData.rules">
    <div class="buttonUtilsTitle">
      <div style="font-size: 18px; font-weight: 600">绑定医嘱项目</div>
      <el-button type="primary" style="margin-bottom: 15px" size="mini" @click="addDepartment"
        v-if="fromDataSubmit.children && fromDataSubmit.children.length == 0">新增医嘱项</el-button>
      <!-- <el-button style="margin-bottom:15px" size="mini" plain @click="save">保存</el-button>
      <el-button style="margin-bottom:15px" size="mini" plain @click="reset">取消</el-button> -->
    </div>
    <div style="height: calc(100% - 51px); padding: 0 10px" v-loading="tableLoding">
      <el-table class="mainTable" highlight-current-row :data="fromData.tableData" border @cell-click="cellClick"
        height="100%">
        <!-- 业务列 -->
        <el-table-column v-for="(item, index) in tableParams" :key="index" :prop="item.prop" :label="item.label"
          :min-width="item.width" header-align="center" :align="item.align || 'center'" :fixed="item.fixed">
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <template v-if="item.prop === 'action'">
              <el-button size="small" type="text" style="width: 100%" icon="el-icon-delete"
                @click="del(scope.row, scope.$index)"></el-button>
            </template>
            <template v-else-if="item.prop === 'unit'">
              <span :val="scope.row.unit" code="DrugUnit" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop === 'itemName'">
              <el-form-item v-show="!scope.row.id" :prop="'tableData.' + scope.$index + '.itemName'"
                :rules="fromData.fromDataRules.itemName" :show-message="false">
                <!--药品的下拉-->
                <LInputTable ref="lInputTable" id="bottomFormInputTable" :inputName="scope.row.itemName"
                  :data-id="scope.row.__targetId__" :popoverWidth="800" suffix-icon="el-icon-search"
                  :tableData="selectOptions" @query="search($event, scope.row, scope.$index)"
                  v-model="scope.row.itemName" valueKey="drugName" @select="select" :tableLoading="inputTableLoading"
                  :tableParams="dropColumn" placeholder="请输入药品关键字"></LInputTable>
              </el-form-item>
              <span v-show="scope.row.id">{{ scope.row.itemName }}</span>
            </template>
            <template v-else-if="item.prop === 'itemType'">
              <!-- <span>
                <l-value-domain
                  :disabled="true"
                  clearable
                  remoteUrl="/doctorsAdvice/list"
                  type="select"
                  :remoteParams="remoteParams"
                  :value.sync="scope.row.itemType"
                  remoteShowKey="doctorsAdviceName"
                  remoteValueKey="doctorsAdviceId"
                ></l-value-domain>
              </span> -->
              <!-- <el-select
                v-model="scope.row.itemType"
                clearable
                disabled
              >
                <el-option
                  v-for="item in itemTypeOptions"
                  :key="item.value"
                  :label="item.doctorsAdviceName"
                  :value="item.doctorsAdviceId">
                </el-option>
              </el-select> -->
              <span>{{ itemTypeOptionsObj[scope.row.itemType] }}</span>
            </template>
            <template v-else-if="item.prop === 'price'">
              <span>{{ scope.row[item.prop] | rounding }}</span>
            </template>
            <template v-else-if="item.prop === 'position'">
              <el-form-item v-if="!scope.row.id" :prop="'tableData.' + scope.$index + '.position'"
                :rules="fromData.fromDataRules.position" :show-message="false">
                <!-- <l-value-domain
                  code="BodyPosition"
                  :value.sync="scope.row.position"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select v-model="scope.row.position" clearable>
                  <el-option v-for="item in positionOptions" :key="item.value" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <span v-else>
                <el-form-item :prop="'tableData.' + scope.$index + '.position'" :rules="fromData.fromDataRules.position"
                  :show-message="false">
                  <!-- <l-value-domain
                    :disabled="true"
                    code="BodyPosition"
                    :value.sync="scope.row.position"
                    placeholder="请选择"
                  ></l-value-domain> -->
                  <el-select v-model="scope.row.position" clearable>
                    <el-option v-for="item in positionOptions" :key="item.value" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </span>
            </template>
            <template v-else-if="item.prop === 'specimen'">
              <el-form-item v-if="!scope.row.id" :prop="'tableData.' + scope.$index + '.specimen'"
                :rules="fromData.fromDataRules.specimen" :show-message="false">
                <!-- <l-value-domain
                  code="InspectSpecimen"
                  :value.sync="scope.row.specimen"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select v-model="scope.row.specimen" clearable>
                  <el-option v-for="item in specimenOptions" :key="item.value" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <span v-else>
                <el-form-item :prop="'tableData.' + scope.$index + '.specimen'" :rules="fromData.fromDataRules.specimen"
                  :show-message="false">
                  <!-- <l-value-domain
                    :disabled="true"
                    code="InspectSpecimen"
                    :value.sync="scope.row.specimen"
                    placeholder="请选择"
                  ></l-value-domain> -->
                  <el-select v-model="scope.row.specimen" clearable>
                    <el-option v-for="item in specimenOptions" :key="item.value" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </span>
            </template>
            <template v-else-if="item.prop === 'checkMethod'">
              <el-form-item v-if="!scope.row.id" :prop="'tableData.' + scope.$index + '.checkMethod'"
                :rules="fromData.fromDataRules.checkMethod" :show-message="false">
                <!-- <l-value-domain
                  code="InspectMethod"
                  :value.sync="scope.row.checkMethod"
                  placeholder="请选择检查方法"
                ></l-value-domain> -->
                <el-select v-model="scope.row.checkMethod" clearable>
                  <el-option v-for="item in checkMethodOptions" :key="item.value" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <span v-else>
                <el-form-item :prop="'tableData.' + scope.$index + '.checkMethod'"
                  :rules="fromData.fromDataRules.checkMethod" :show-message="false">
                  <!-- <l-value-domain
                    :disabled="true"
                    code="InspectMethod"
                    :value.sync="scope.row.checkMethod"
                    placeholder="请选择检查方法"
                  ></l-value-domain> -->
                  <el-select v-model="scope.row.checkMethod" clearable>
                    <el-option v-for="item in checkMethodOptions" :key="item.value" :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </span>
            </template>

            <template v-else-if="item.prop === 'quantity'">
              <el-form-item label :prop="'tableData.' + scope.$index + '.quantity'"
                :rules="fromData.fromDataRules.quantity" class="skinTest">
                <el-input-number style="width: 100%" v-model="scope.row.quantity" :min="1" :max="10"></el-input-number>
                <!-- <el-input
                  size="medium"
                  style="width: 100%"
                  v-model.number="scope.row.quantity"
                ></el-input> -->
              </el-form-item>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] || "--" }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="buttonUtils">
      <el-button type="primary" style="margin-bottom: 15px" size="mini" @click="save">保存</el-button>
      <!-- <el-button style="margin-bottom:15px" size="mini" plain @click="save">保存</el-button>
      <el-button style="margin-bottom:15px" size="mini" plain @click="reset">取消</el-button> -->
    </div>
  </el-form>
</template>

<script>
  import {
    removeAdviceChargeRelate,
    oWdeleteElectronicApplicationCatalogRelationById
  } from "@/api/systemManagement/dataMaintain/adviceChargeRelation";
  import {
    addAdviceItem,
    saveAdviceItem,
    saveAdviceChargeRelation,
    getAdviceItemInfo,
    postAdviceItemInfo,
    getAdviceItemTable,
    getAdviceItemList,
    saveOrUpdateElectronicApplicationCatalog
  } from "@/api/systemManagement/dataMaintain/adviceItem";
  import {
    getDoctorsAdviceList
  } from "@/api/systemManagement/dataMaintain/doctorsAdvice.js"
  import hmm from "@/api/hmm/base.js"
  export default {
    name: "editTable",
    components: {},
    props: {
      fromDataSubmit: {
        type: Object
      }
    },
    data() {
      return {
        tableLoding: false,
        remoteParams: {
          pageSize: 10,
          parentCode: "0"
        }, // 分页参数
        fromData: {
          tableData: [],
          fromDataRules: {
            itemName: [{
              required: true,
              message: "请选择项目名称",
              trigger: "change"
            }],
            no: [{
                required: true,
                message: "请填写数量",
                trigger: ["blur", "change"]
              },
              {
                pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                message: "请输入正确的数量！"
              }
            ],
            quantity: [{
              required: true,
              message: "请填写数量",
              trigger: "blur"
            }],
            specimen: [{
              required: false,
              message: "请选择",
              trigger: "blur"
            }],
            position: [{
              required: true,
              message: "请选择部位",
              trigger: "blur"
            }],
            checkMethod: [{
              required: true,
              message: "请选择标本",
              trigger: "blur"
            }]
          }
        },
        inputTableLoading: true, //下拉table组件 loading
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
            prop: "drugName",
            label: "医嘱名称",
            width: 150
          },
          {
            prop: "subclassOrders",
            label: "医嘱子类",
            tableTransform: true,
            tableTransformType: "subclassOrders",
            width: 100
          },
          {
            prop: "spec",
            label: "规格",
            width: 60
          },
          {
            prop: "unit",
            label: "单位",
            width: 60,
            codeTransform: true,
            codeTransformCode: "DrugUnit"
          }
        ],
        tableParams: [],
        itemTypeOptions: [], //医嘱类别option
        itemTypeOptionsObj: {}, //医嘱类别option
        positionOptions: [], //部位option
        checkMethodOptions: [], //检查方法option
        specimenOptions: [] //标本option
      };
    },
    created() {
      // this.loadData();
      this.getItemTypeOptions();
      this.getPositionOptions();
      this.getCheckMethodOptions();
      this.getSpecimenOptions();
    },
    mounted() {},
    methods: {
      /* start-获取下拉列表options */
      //1.医嘱类别
      async getItemTypeOptions() {
        this.itemTypeOptions = [];
        let itemTypeOptionsObj = {};
        try {
          let res = await getDoctorsAdviceList({
            pageSize: 999,
            parentId: "0"
          });
          if (res.code === 1) {
            this.itemTypeOptions = res.data;
            for (let i in res.data) {
              itemTypeOptionsObj[res.data[i].doctorsAdviceCode] = res.data[i].doctorsAdviceName
            }
            this.itemTypeOptionsObj = itemTypeOptionsObj;
          }
        } catch (error) {}
      },
      //2.部位
      async getPositionOptions() {
        this.positionOptions = [];
        try {
          let res = await hmm.getDictListForCode('BodyPosition');
          if (res.code === 1) {
            this.positionOptions = res.data;
          }
        } catch (error) {}
      },
      //3.检查方法
      async getCheckMethodOptions() {
        this.checkMethodOptions = [];
        try {
          let res = await hmm.getDictListForCode('InspectMethod');
          if (res.code === 1) {
            this.checkMethodOptions = res.data;
          }
        } catch (error) {}
      },
      //4.标本
      async getSpecimenOptions() {
        this.specimenOptions = [];
        try {
          let res = await hmm.getDictListForCode('InspectSpecimen');
          if (res.code === 1) {
            this.specimenOptions = res.data;
          }
        } catch (error) {}
      },
      /* end-获取下拉列表options */
      clickappend(msg) {
        console.log("clickappend", this.fromDataSubmit);
        if (msg == "save") {
          console.log("save----------------");
          this.fromData.tableData = [];
          this.fromDataSubmit.adviceitem = [];
        } else {
          this.reset();
        }
        if (this.fromDataSubmit.adviceCategory == "0") {
          // 检查
          this.tableParams = [
            // {
            //   prop: 'classify',
            //   label: '范围',
            //   width: 80
            // },
            {
              prop: "itemType",
              label: "医嘱类别",
              width: 80
            },
            {
              prop: "deptName",
              label: "科室"
            },
            {
              prop: "itemName",
              width: 150,
              label: "医嘱项目"
            },
            {
              //   prop: "price",
              //   label: "价格",
              //   width: 100
              // },{
              prop: "specs",
              label: "规格",
              width: 100
            },
            {
              prop: "position",
              label: "部位",
              width: 100
            },
            {
              prop: "checkMethod",
              label: "检查方法",
              width: 100
            },
            {
              prop: "quantity",
              label: "数量",
              width: 100
            },
            {
              prop: "unit",
              label: "单位",
              width: 100
            },
            // {
            //   prop: 'factory',
            //   label: '收取规则'
            // },{
            //   prop: 'execWard',
            //   label: '组范围'
            // },
            {
              prop: "action",
              label: "操作",
              width: 50
            }
          ];
        } else if (this.fromDataSubmit.adviceCategory == "1") {
          // 检验
          this.tableParams = [{
              prop: "itemType",
              label: "医嘱类别",
              width: 80
            },
            {
              prop: "deptName",
              label: "科室"
            },
            {
              prop: "itemName",
              width: 150,
              label: "医嘱项目"
            },
            {
              prop: "specs",
              label: "规格",
              width: 100
            },
            {
              prop: "specimen",
              label: "标本",
              width: 100
            },
            {
              prop: "quantity",
              label: "数量",
              width: 100
            },
            {
              prop: "unit",
              label: "单位",
              width: 100
            },
            {
              prop: "action",
              label: "操作",
              width: 50
            }
          ];
        }
      },
      loadData(row) {
        console.log("获取数据" + JSON.stringify(row));
        console.log("this.fromDataSubmit", this.fromDataSubmit);
      },
      // 选中 药品 或者 项目
      select(row) {
        // for (let key in row) {
        //   this.currentRow[key] = row[key];
        // }
        console.log("row", row);

        // this.currentRow.categoryName = row.
        this.currentRow.catalogId = this.fromDataSubmit.id;
        this.currentRow.itemType = row.itemType;
        this.currentRow.deptName = row.execDeptName;
        this.currentRow.deptId = row.execDeptCode;
        this.currentRow.unit = row.unit;
        this.currentRow.specs = row.spec;
        this.currentRow.price = row.price;
        this.currentRow.quantity = "1";
        this.currentRow.itemName = row.drugName;
        this.currentRow.itemId = row.itemId;

        // this.currentRow.itemName = row.drugName;
        // this.currentRow.spec = row.spec;
        // this.currentRow.no = row.availableQuantity;
        // this.currentRow.unit = row.packUnit;
        // this.currentRow.price = row.price;
        // this.currentRow.factory = row.originManufacturerCode;

        // 数量 框 获取焦点
        // document.getElementById(this.currentRow.__targetId__).focus()
      },
      del(row, index) {
        console.log("发送删除接口", row);
        console.log("删除index", index);
        console.log("this.fromData.tableData", this.fromData.tableData);
        if (row.id) {
          oWdeleteElectronicApplicationCatalogRelationById(row).then(res => {
            console.log(res);
            if (res.code === 1) {
              // console.log('this.fromData.tableData', this.fromData.tableData);
              this.fromData.tableData = this.fromData.tableData.filter(item => {
                return item.id !== row.id;
              });
              console.log("this.fromData.tableData2", this.fromData.tableData);
            } else {
              this.$message(res.msg);
            }
          });
        } else {
          // this.fromData.tableData.forEach((value,index,array)=>{

          //   if(value.__targetId__ == row.__targetId__){
          //     array.splice(value,1)
          //   }
          // })
          this.fromData.tableData.splice(index, 1);
          // let arrcopy = JSON.parse(JSON.stringify(this.fromData.tableData))
          // arrcopy.splice(index,1)
          // let that = this
          // console.log('this.fromData.tableData.splice(index,1)', this.fromData.tableData);
          // setTimeout(function(){

          //   that.fromData.tableData = arrcopy
          //   // this.$forceUpdate()
          // },2000);
          // // this.$forceUpdate()
        }
      },
      cellClick(a, b, c) {
        if (b.property !== "itemName") return;
        this.currentRow = a;
      },
      // 查询 药品
      search(query, row, index) {
        console.log("row.itemName-search", row.itemName);
        console.log("query-search", query);
        console.log("index-search", index);
        let self = this;
        let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
        let data = {
          ...{
            pageNo: pageNo,
            pageSize: this.pageSize,
            name: query
          }
        };

        this.inputTableLoading = true;
        console.log(data);
        getAdviceItemList(data)
          .then(res => {
            this.inputTableLoading = false;
            if (res.code === 1) {
              // let tableData = this.currentPage !== 0 ? this.selectOptions : [];
              let tableData;
              if (res.pageNo == 0){
                tableData = []
              }else{
                tableData = this.selectOptions
              }
              const {
                data
              } = res;
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
          })
          .catch(res => {
            this.inputTableLoading = false;
            this.$message.error(res.msg || "获取数据失败");
          });
      },
      addDepartment() {
        let propList = this.tableParams.map(item => {
          return item.prop;
        });
        let obj = {
          __targetId__: +new Date()
        };
        propList.forEach(item => {
          obj[item] = "";
        });
        obj["categoryId"] = "1";
        obj["quantity"] = "1";
        // obj['categoryName'] = this.fromDataSubmit.adviceCategory;
        // obj['categoryId'] = this.fromDataSubmit.adviceCategory;

        console.info("tableData", this.fromData.tableData);
        this.fromData.tableData.push(obj);
        // this.classifyArr.push('0');
        //分类获取焦点
        setTimeout(() => {
          let nodeList = this.getDataIdDom(
            "div",
            "data-id",
            String(obj.__targetId__)
          );
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
        console.log("this.fromDataSubmit", this.fromDataSubmit);
        console.log("this.fromData.tableData", this.fromData.tableData);

        if (this.fromDataSubmit.useRange == "") {
          this.$message("请选择使用范围");
          return false;
        }
        if (this.fromDataSubmit.catalogName == "") {
          this.$message("请填写目录名称");
          return false;
        }
        // if(this.fromDataSubmit.rank < 1){
        //   this.$message('请填写排序')
        //   return false;
        // }
        var reg = /^[1-9]\d*$/;
        // console.log(reg.test(this.fromDataSubmit.rank))
        if (!reg.test(this.fromDataSubmit.rank)) {
          this.$message("排序项只能是正整数");
          return false;
        }

        this.$refs["tableFrom"].validate((valid, error) => {
          if (valid) {
            let requestParams = this.fromDataSubmit;
            requestParams.electronicApplicationCatalogRelationDTO = this.fromData.tableData;
            // requestParams.electronicApplicationCatalogRelationDTO.push(this.fromData.tableData)
            // alert("校验成功！")
            console.log(this.fromData.tableData);
            console.log(
              "saveOrUpdateElectronicApplicationCatalog++",
              requestParams
            );
            saveOrUpdateElectronicApplicationCatalog(requestParams).then(res => {
              console.log("saveOrUpdateElectronicApplicationCatalog---", res);
              if (res.code === 1) {
                let tableData = this.currentPage !== 0 ? this.selectOptions : [];
                const {
                  data
                } = res;
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
                // this.queryName = query;

                this.$message.success("保存成功");
                this.$emit("saveItemAction");
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            });
          } else {
            this.showErrorMsg(error);
            return false;
          }
        });
      },
      //表单的error 信息
      showErrorMsg(errorObj) {
        let self = this;
        for (let key in errorObj) {
          setTimeout(function() {
            if (document.getElementsByClassName("el-message").length === 0) {
              //message 弹窗一次错误
              self.$message.error(errorObj[key][0]);
            }
          }, 0);
        }
      },
      reset() {
        this.fromData.tableData = this.fromDataSubmit.adviceitem || [];
      }
    },
    watch: {},
    computed: {}
  };
</script>

<style scoped lang="scss">
  .buttonUtils {
    text-align: right;
    padding: 0 10px;
    // margin-top: 20px;
    margin: 20px;
  }

  .buttonUtilsTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-right: 20px;
    height: 48px;
  }
</style>
