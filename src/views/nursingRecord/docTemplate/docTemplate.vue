<template>
  <el-card class="docRecord width100 height100">
    <div class="left-bar width100 height100 float-left">
      <l-card-title>
        <template slot="left">文书模板</template>
      </l-card-title>
      <el-input
        v-model="searchValue"
        placeholder="请输入内容"
        @keyup.native="search"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search"
        ></i>
      </el-input>
      <div class="tree-cont width100">
        <el-tree
          :data="leftTreeData"
          :props="defaultProps"
          :highlight-current="highlightFlag"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="treeClick"
        ></el-tree>
      </div>
    </div>
    <div class="right-content height100 float-right">
      <div class="nav-bar clearfix">
        <el-date-picker
          class="float-left"
          v-if="isLook && docStyleData[0].documentModel != '2'"
          v-model="recordDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyyMMdd HHmm"
          placeholder="选择记录"
        >
        </el-date-picker>
        <el-button
          class="float-left"
          style="margin-left: 20px"
          type="primary"
          @click="addConclusion"
          v-if="isLook && docStyleData[0].documentModel == '2'"
          >添加小结
        </el-button>
        <el-button
          class="float-right"
          style="margin-left: 20px"
          type="primary"
          plain
          @click="updateRecord(1)"
          >删除
        </el-button>
        <el-button class="float-right" type="primary" @click="updateRecord(0)"
          >保存</el-button
        >
      </div>
      <div class="doc-content width100" v-if="isLook">
        <!--混合类型文书-->
        <tableCol
          class="width100"
          style="padding-right: 20px"
          v-if="docStyleData[0].documentModel != '2'"
          :treeData="docStyleData[0]"
        ></tableCol>
        <tableType
          ref="tableType"
          class="width100"
          style="padding-right: 20px"
          v-if="docStyleData[0].documentModel == '2'"
          :treeData="docStyleData[0]"
          :conclusionDialogProp="conclusionDialogProp"
          :isQuote="isQuote"
          @updateSuccess="search"
        ></tableType>
      </div>
    </div>
  </el-card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';

import tableCol from "../maintenanceDocument/components/tableCol";
import tableType from "../maintenanceDocument/components/tableType";
import {getDocInfoNoPage, getDocVersionInfo} from "@/api/emrRecord/nursingRecord/docInfoMaintain";
import {saveOrUpdateDocClass, getDocTemplate, getDocRecordByDateTime} from "@/api/emrRecord/nursingRecord/docRecord";
import {initDocEle} from "@/api/emrRecord/nursingRecord/docToolInteraction";

export default {
    name: "docTemplate",
    components: {
      tableCol,
      tableType
    },
    data() {
      return {
        searchValue: '',
        highlightFlag: true,
        defaultProps: {
          label: "label",
          children: "children"
        },
        //树数据
        leftTreeData: [],
        //解析结构数据
        docStyleData: [],
        //当前选中的某一个文书
        currentDoc: {},
        //当前选中的某一个记录数据
        currentDocRecord: {},
        isLook: false,
        nursingTreeDataSave: [],
        //记录保存时间
        recordDate: '',
        //添加小结弹框
        conclusionDialogProp: false,
        //数值引用数据映射
        quoteMatch: {
          baseInfo: '1',
          docEle: '2',
          tempPro: '3',
          tableData: '4'
        },
        //单表格文书数据引用
        isQuote: {
          flag: false,
          quoteValue: []
        }
      }
    },
    computed: {
      ...mapGetters('nurseDocument', ['nursingTreeData']),
      ...mapGetters("homeSickbeds", ["receivePatientData"]),
      ...mapGetters("user", ["role"]),
    },
    watch: {
      receivePatientData: {
        async handler(val) {
          this.isLook = false;
          this.leftTreeData = [];
          if (JSON.stringify(val) != '{}') {
            await this.search();
          }
        },
        immediate: true,
        deep: true
      },
      nursingTreeData: {
        handler(val) {
          if (val && val.length > 0) {
            this.nursingTreeDataSave = [...val];
          }
        },
        immediate: true,
        deep: true
      }
    },
    async created() {
      await this.search();
    },
    methods: {
      ...mapActions({
        changeNursingTreeData: "nurseDocument/changeNursingTreeData"
      }),
      //1.获取文书列表
      async search() {
        this.$showLoading();
        try {
          let params = {
            // searchValue: this.searchValue
            //deptCode: this.role.deptCode,
            // deptCode: '92',
            //inpCode: this.receivePatientData.treatNo,
            // inpCode: 'INP191113001'
          };
          let data = await getDocTemplate(params);
          if (data.code == '1') {
            let list = JSON.parse(JSON.stringify(data.data));
            await this.handleLeftTreeData1(list);
            // console.log('左侧树数据', list);
            this.leftTreeData = list;
            this.isLook = false;
          } else {
            this.$message.error(data.msg || "获取文书模板数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书模板数据失败");
        }
      },
      handleLeftTreeData1(list) {
        //文书分类
        for (let i in list) {
          list[i].label = list[i].className;
          list[i].children = list[i].docInfoTemplateVO;
          if (list[i].docInfoTemplateVO && list[i].docInfoTemplateVO.length > 0) {
            this.handleLeftTreeData2(list[i].children);
          }
        }
      },
      handleLeftTreeData2(list) {
        //文书名称
        for (let i in list) {
          list[i].label = list[i].docName;
          list[i].children = [];

          if (list[i].tempListMap) {
            let typeList = [{"tempName":"全院","tempType":"1","tempList":list[i].tempListMap["1"]},{"tempName":"科室","tempType":"2","tempList":list[i].tempListMap["2"]},{"tempName":"个人","tempType":"3","tempList":list[i].tempListMap["3"]}];
            list[i].children=typeList;
            this.handleLeftTreeData3(list[i].children);
          }
        }
      },
      handleLeftTreeData3(list) {
        for (let i in list) {
          list[i].label = list[i].tempName;
          list[i].children = list[i].tempList;
          if(list[i].tempList&&list[i].tempList.length>0){
            this.handleLeftTreeData4(list[i].children);
          }
        }
      },
      handleLeftTreeData4(list) {
        for (let i in list) {
          list[i].label = list[i].templateName;
        }
      },
      //2.获取文书所有元素数据
      //混合类型文书
      async getDocVersionInfoMulti() {
        this.$showLoading();
        try {
          //docState == 0: "草稿",1: "启用",2: "历史"
          let params = {
            docCode: this.currentDoc.docCode || '',
            docState: '1'
          };
          let data = await getDocVersionInfo(params);
          if (data.code == "1") {
            if (data.data && data.data.length) {
              let res = data.data[0].docContent ? JSON.parse(data.data[0].docContent) : {eleList: []};
              let docStyleData = [{}];
              this.$set(docStyleData, 0, {
                ...res,
                docCode: data.data[0].docCode,
                elementName: this.currentDoc.docName,
                documentModel: this.currentDoc.docType,
                deletedStatus: data.data[0].deletedStatus,
                docVersion: data.data[0].docVersion,
                dataVersion: data.data[0].dataVersion,
                /*id: data.data[0].id,
                state: data.data[0].state,*/
                level: 1
              });
              await this.digui(docStyleData[0], 1);
              //获取引用元素值
              await this.getQuoteEveList(docStyleData[0], '0');
              this.docStyleData = docStyleData;
              console.log('文书数据:', this.docStyleData[0]);
            } else {
              this.$message(data.msg || "文书结构为空");
            }
          } else {
            this.$message.error(data.msg || "获取文书结构失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书结构失败");
        }
      },
      //单表格文书（记录接口）
      async getDocVersionInfoSing() {
        this.$showLoading();
        try {
          let params = {
            docCode: this.currentDoc.docCode || '',
            inpCode: this.receivePatientData.treatNo,
            // inpCode: 'INP191113001',
            docType: '2',
            recordDate: '',
            recordTime: ''
          };
          let data = await getDocRecordByDateTime(params);
          if (data.code == "1") {
            let docStyleData = [{}];
            if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
              let res = data.data.lstDocRecords[0].recordContent ? JSON.parse(data.data.lstDocRecords[0].recordContent) : {eleList: []};
              //处理单表格数据
              let arr = data.data.lstDocRecords;
              let recordId = [];
              let recordValueJson = [];
              let dataVersion = [];
              let deletedStatus = [];
              for (let i in arr) {
                let value = JSON.parse(arr[i].recordValueJson);
                for (let j in value) {
                  value[j].recordId = arr[i].recordId;
                }
                recordId = recordId.concat(arr[i].recordId);
                dataVersion = dataVersion.concat(arr[i].dataVersion);
                deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
                recordValueJson = recordValueJson.concat(JSON.parse(arr[i].recordValueJson));
              }
              this.$set(docStyleData, 0, {
                ...res,
                elementName: this.currentDoc.docName,
                recordDate: '',
                recordTime: '',
                documentModel: '2',
                level: 1,
                recordId: recordId,
                dataVersion: dataVersion,
                deletedStatus: deletedStatus,
                recordValueJson: recordValueJson
              });
              await this.digui(docStyleData[0], 1);
            } else {
              let res = JSON.parse(data.data.docContent);
              this.$set(docStyleData, 0, {
                ...res,
                elementName: this.currentDoc.label,
                recordDate: '',
                recordTime: '',
                documentModel: '2',
                level: 1,
                recordId: '',
                dataVersion: '',
                deletedStatus: '',
                recordValueJson: [{}]
              });
              await this.digui(docStyleData[0], 1);
              await this.getQuoteEveList(docStyleData[0], '1');
            }
            this.docStyleData = docStyleData;
            console.log('文书数据111:', this.docStyleData[0]);
          } else {
            this.$message.error(data.msg || "获取文书结构失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书结构失败");
        }
      },
      //2.获取记录所有的元素数据以及值
      async getDocRecord() {
        this.$showLoading();
        try {
          let params;
          if (this.currentDocRecord.docType != '2') {
            params = {
              docCode: this.currentDocRecord.docCode,
              inpCode: this.currentDocRecord.treatNo,
              docType: this.currentDocRecord.docType,
              recordDate: this.currentDocRecord.recordDate,
              recordTime: this.currentDocRecord.recordTime
            };
          } else if (this.currentDocRecord.docType == '2') {
            params = {
              docCode: this.currentDocRecord.docCode,
              inpCode: this.currentDocRecord.treatNo,
              docType: this.currentDocRecord.docType,
              recordDate: '',
              recordTime: ''
            };
          }
          let data = await getDocRecordByDateTime(params);
          if (data.code == "1") {
            if (data.data.lstDocRecords && data.data.lstDocRecords.length) {
              let res = data.data.lstDocRecords[0].recordContent ? JSON.parse(data.data.lstDocRecords[0].recordContent) : {eleList: []};
              if (this.currentDocRecord.docType != '2') {
                //处理混合类型数据
                this.$set(this.docStyleData, 0, {
                  ...res,
                  docCode: data.data.lstDocRecords[0].docCode,
                  elementName: this.currentDocRecord.label,
                  documentModel: this.currentDocRecord.docType || '',
                  deletedStatus: data.data.lstDocRecords[0].deletedStatus,
                  docVersion: data.data.lstDocRecords[0].docVersion,
                  dataVersion: data.data.lstDocRecords[0].dataVersion,
                  /*id: data.data.lstDocRecords[0].id,
                  state: data.data.lstDocRecords[0].state,*/
                  level: 1
                });
                await this.digui(this.docStyleData[0], 1);
                console.log('记录数据-混合:', this.docStyleData[0]);
              } else if (this.currentDocRecord.docType == '2') {
                //处理单表格数据
                let arr = data.data.lstDocRecords;
                let recordId = [];
                let recordValueJson = [];
                let dataVersion = [];
                let deletedStatus = [];
                for (let i in arr) {
                  let value = JSON.parse(arr[i].recordValueJson);
                  for (let j in value) {
                    value[j].recordId = arr[i].recordId;
                  }
                  recordId = recordId.concat(arr[i].recordId);
                  dataVersion = dataVersion.concat(arr[i].dataVersion);
                  deletedStatus = deletedStatus.concat(arr[i].deletedStatus);
                  recordValueJson = recordValueJson.concat(JSON.parse(arr[i].recordValueJson));
                }
                this.$set(this.docStyleData, 0, {
                  ...res,
                  elementName: this.currentDocRecord.recordShowName,
                  recordDate: '',
                  recordTime: '',
                  documentModel: '2',
                  level: 1,
                  recordId: recordId,
                  dataVersion: dataVersion,
                  deletedStatus: deletedStatus,
                  recordValueJson: recordValueJson
                });
                await this.digui(this.docStyleData[0], 1);
                console.log('记录数据-单表格:', this.docStyleData[0]);
              }
            } else {
              this.$message(data.msg || "记录为空");
            }
          } else {
            this.$message.error(data.msg || "获取记录失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取记录失败");
        }
      },
      //递归循环docStyleData，更改数据
      digui(item, level) {
        let list = item.eleList;
        for (let i in list) {
          list[i].level = Number(level) + 1;
          list[i].eleId = list[i].eleId || list[i].elementCode + Math.random().toString().substr(3, 7);
          list[i].resizable = false;
          list[i].enable = true;
          list[i].visible = true;
          if (list[i].elementControl == '8') {
            if (list[i].eleValue && list[i].eleValue.length) {
              list[i].eleValue = list[i].eleValue || [];
            } else {
              list[i].eleValue = [];
              let elementAttribute = list[i].proprietaryAttributeVoLst;
              let num = 1;
              for (let j in elementAttribute) {
                if (elementAttribute[j].proprietaryCode == '1401') {
                  num = elementAttribute[j].proprietaryContent;
                }
              }
              for (let k = 0; k < num; k++) {
                list[i].eleValue.push({});
              }
            }
            list[i].tableDataItem = {};
          } else if (list[i].elementControl == '5') {
            list[i].eleValue = list[i].eleValue != undefined ? list[i].eleValue : [];
          } else if (list[i].elementControl == '6') {
            list[i].eleValue = list[i].eleValue != undefined ? list[i].eleValue : '';
          } else {
            list[i].eleValue = list[i].eleValue != undefined ? list[i].eleValue : '';
          }
          if (list[i].eleList && list[i].eleList.length) {
            this.digui(list[i], list[i].level, [], 1);
          }
        }
      },
      //3.点击树
      async treeClick(data, node) {
        this.conclusionDialogProp = {
          flag: false,
          date: new Date()
        };
        // console.log('点击左侧树数据data:', data);
        // console.log('点击左侧树数据node:', node);
        this.isLook = false;
        this.docStyleData = [];
        this.recordDate = '';
        if (node.level == 2) {
          this.currentDocRecord = {};
          //点击为文书，渲染录入样式
          this.currentDoc = {...data};
          if (data.docType != '2') {
            await this.getDocVersionInfoMulti();
          } else if (data.docType == '2') {
            await this.getDocVersionInfoSing();
          }
          await this.changeNursingTreeData(this.docStyleData);
          this.isLook = true;
        } else if (node.level == 3) {
          this.currentDoc = {};
          this.currentDocRecord = {
            ...data,
            recordShowName: node.parent.label,
            docType: node.parent.data.docType
          };
          //点击为记录，渲染数据
          await this.getDocRecord();
          await this.changeNursingTreeData(this.docStyleData);
          this.recordDate = this.docStyleData[0].elementName;
          this.isLook = true;
        }
      },
      /*4.处理更新数据*/
      forCircle(list, tableValue, flag) {
        for (let i in list) {
          if (!list[i].eleId) {
            this.$delete(list, i);
            this.forCircle(list, tableValue, flag);
          } else {
            this.$delete(list[i], 'idNew');
            this.$delete(list[i], 'level');
            this.$delete(list[i], 'width');
            this.$delete(list[i], 'colNum');
            this.$delete(list[i], 'col');
            this.$delete(list[i], 'resizable');
            this.$delete(list[i], 'index');
            this.$delete(list[i], 'enable');
            this.$delete(list[i], 'visible');
            this.$delete(list[i], 'basicEleValue');
            if (list[i].elementControl == '8') {
              this.$delete(list[i], 'tableDataItem');
              let arr = list[i].eleValue;
              if (list[i].eleList && list[i].eleList.length > 0) {
                let flag = '1';
                this.forCircle(list[i].eleList, arr, flag);
              }
            } else if (flag == '1') {
              if (tableValue.length > 0) {
                list[i].eleValue = [];
                for (let j in tableValue) {
                  for (let k in tableValue[j]) {
                    if (list[i].eleId == k) {
                      list[i].eleValue.push(tableValue[j][k].eleValue);
                    }
                  }
                }
              }
              if (list[i].eleList && list[i].eleList.length > 0) {
                let flag = '1';
                this.forCircle(list[i].eleList, tableValue, flag);
              }
            } else {
              if (list[i].eleList && list[i].eleList.length > 0) {
                let flag = '0';
                let arr = [];
                this.forCircle(list[i].eleList, arr, flag);
              }
            }
          }
        }
      },
      handleData(data, isSave) {
        let params = [{
          dataVersion: data[0].dataVersion,
          recordId: this.currentDocRecord.recordId || '',
          docCode: data[0].docCode || '',
          docVersion: data[0].docVersion || '',
          docType: this.currentDocRecord.docType || '',
          deptCode: this.role.deptCode,
          // deptCode: '92',
          inpCode: this.receivePatientData.treatNo,
          // inpCode: 'INP191113001',
          recordDate: this.recordDate.split(' ')[0],
          recordTime: this.recordDate.split(' ')[1],
          deletedStatus: isSave === 0 ? data[0].deletedStatus : '1',
          recordContent: {
            docCode: data[0].docCode || '',
            docVersion: data[0].docVersion || '',
            eleList: data[0].eleList,
            eleEventList: data[0].eleEventList
          }
        }];
        return params;
      },
      //更新接口
      async updateRecord(isSave) {
        if (isSave === 1) {
          if (this.docStyleData[0].documentModel != '2') {
            //混合类型删除
            if (this.currentDocRecord && this.currentDocRecord.recordId) {
              this.$confirm('是否删除本条记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                this.saveRecord(isSave);
              });
            } else {
              this.$message('请选中一条记录再进行操作!');
            }
          } else if (this.docStyleData[0].documentModel == '2') {
            //单表格删除
            await this.$refs.tableType.updateRecord(isSave);
          }
        } else {
          if (this.docStyleData[0].documentModel != '2') {
            //混合类型保存
            if (this.recordDate) {
              this.saveRecord(isSave);
            } else {
              this.$message('请填写记录日期在进行保存!');
            }
          } else if (this.docStyleData[0].documentModel == '2') {
            //单表格保存
            await this.$refs.tableType.updateRecord(isSave);
          }
        }
      },
      async saveRecord(isSave) {
        /*//测试
        let docStyleData = JSON.parse(JSON.stringify(this.docStyleData));
        let flag = '0';
        let arr = [];
        console.log(docStyleData);
        await this.forCircle(docStyleData[0].eleList, arr, flag);
        let params = await this.handleData(docStyleData, isSave);
        console.log(params);*/
        this.$showLoading();
        try {
          let docStyleData = JSON.parse(JSON.stringify(this.docStyleData));
          let flag = '0';
          let arr = [];
          await this.forCircle(docStyleData[0].eleList, arr, flag);
          let params = await this.handleData(docStyleData, isSave);
          console.log('保存的数据', params);
          let data = await saveOrUpdateDocClass(params);
          if (data.code == "1") {
            this.$message("更新成功");
            await this.search();
            this.isLook = false;
          } else {
            this.$message.error(data.msg || "更新失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "更新失败");
        }
      },
      //添加小结
      addConclusion() {
        this.conclusionDialogProp = {
          flag: true,
          date: new Date()
        };
      },
      //获取数据引用
      async getQuoteEveList(data, flag) {
        let eleEventList = data.eleEventList ? data.eleEventList : [];
        let QuoteList = {};
        eleEventList.forEach(item => {
          if (item.EveCode == 'CDEE_QUOTE') {
            QuoteList = item.QuoteList;
          }
        });
        let eleTypeNodes = [];
        for (let i in QuoteList) {
          let nodes = [];
          if (QuoteList[i].length) {
            for (let j in QuoteList[i]) {
              nodes.push({
                eleId: QuoteList[i][j].eleId,
                eleColumn: QuoteList[i][j].value
              });
            }
            eleTypeNodes.push({
              type: this.quoteMatch[i],
              nodes: nodes
            });
          }
        }
        if (eleTypeNodes.length) {
          await this.getInitDocEle(eleTypeNodes, data.eleList, flag);
        }
      },
      //获取数据引用的值
      async getInitDocEle(eleTypeNodes, data, flag) {
        try {
          let params = {
            inpCode: this.receivePatientData.treatNo || '',
            // visitCode: this.receivePatientData.visitCode || '',
            // patientId: this.receivePatientData.patientId || '',
            // inpCode: 'INP191113001',
            eleTypeNodes: eleTypeNodes
          };
          let res = await initDocEle(params);
          if (res.code == "1") {
            // console.log(res);
            if (flag == '0') {
              await this.setQuoteValue(res.data, data);
            } else if (flag == '1') {
              this.isQuote = {
                flag: true,
                quoteValue: res.data
              };
            }
          }
        } catch (error) {
          this.$message.error(error.msg);
        }
      },
      //将值赋给文书中
      async setQuoteValue(data, docData) {
        for (let i in data) {
          for (let j in data[i].nodes) {
            await this.findCircle(docData, data[i].nodes[j].eleId, function (item) {
              item.eleValue = data[i].nodes[j].eleValue;
            });
          }
        }
      },
      //寻找要计算的元素的值
      findCircle(eleList, eleId, fn) {
        for (let i in eleList) {
          if (eleList[i].eleId == eleId) {
            fn(eleList[i]);
          } else if (eleList[i].eleList && eleList[i].eleList.length) {
            this.findCircle(eleList[i].eleList, eleId, fn);
          }
        }
      }
    }
}
</script>

<style scoped lang="scss">
.docRecord {
  .left-bar {
    width: 250px;
    padding: 20px;
    padding-top: 0;
    border-right: 1px solid $l-color-bgcolor-11;

    .tree-cont {
      height: calc(100% - 63px);
      margin-top: 15px;
      overflow: scroll;
    }
  }

  .right-content {
    width: calc(100% - 250px);
    padding: 20px 0 20px 20px;

    .nav-bar {
      margin-right: 20px;
      margin-bottom: 20px;
    }

    .doc-content {
      /*width: calc(100% - 20px);*/
      height: calc(100% - 56px);
      /*margin-right: 20px;*/
    }
  }
}
</style>

