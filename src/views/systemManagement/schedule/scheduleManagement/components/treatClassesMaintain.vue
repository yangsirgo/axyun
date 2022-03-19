<template>
  <div class="treatClassesMaintain height100">
    <el-row class="height100">
      <el-col class="areas height100" :span="10">
        <div class="title">
          <l-card-title>
            <span slot="left">1.班次维护</span>
            <span slot="right">
              <el-button type="text" :disabled="isSave1!='1'" @click="addClasses"><i class="iconfont iconxinzeng"></i> 新增班次</el-button>
            </span>
          </l-card-title>
        </div>
        <div class="table-cont">
          <el-table
            ref="table0"
            :data="classesData"
            width="100%"
            stripe
            border
            highlight-current-row
            @row-click="classesRowClick"
          >
            <el-table-column
              v-for="(item, index) in classesParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope0">
                <template v-if="scope0.row['isEdit'] == '1'">
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" @click.stop="completeClasses(scope0.row,scope0.$index)">完成</el-button>
                    <el-button type="text" @click.stop="cancelClasses">取消</el-button>
                  </template>
                  <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                    <el-time-picker
                      v-model="scope0.row[item.prop]"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="请选择"
                      style="width:100%;"
                    >
                    </el-time-picker>
                  </template>
                  <template v-else-if="item.prop=='recordStatus'">
                    <el-radio-group v-model="scope0.row[item.prop]">
                      <el-radio label="1">开放使用</el-radio>
                      <el-radio label="2">暂停使用</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else>
                    <el-input type="text" placeholder="请输入" v-model="scope0.row[item.prop]"></el-input>
                  </template>
                </template>
                <template v-else>
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" :disabled="isSave1!='1'" @click.stop="editClasses(scope0.row,scope0.$index)">
                      编辑
                    </el-button>
                    <el-button type="text" :disabled="isSave1!='1'"
                               @click.stop="deleteClasses(scope0.row,scope0.$index)">删除
                    </el-button>
                  </template>
                  <template v-else-if="item.prop=='recordStatus'">
                    <span v-if="scope0.row[item.prop] == '1'">开放使用</span>
                    <span v-else-if="scope0.row[item.prop] == '2'">暂停使用</span>
                  </template>
                  <template v-else>
                    {{scope0.row[item.prop]}}
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--<div class="button-cont">
          <el-button type="primary" class="float-right" style="margin-left: 10px" plain @click="cancelClasses">取消
          </el-button>
          <el-button type="primary" class="float-right" plain @click="deleteClasses">删除</el-button>
          &lt;!&ndash;<el-button type="primary" class="float-right" plain @click="changeTypeClasses">{{buttonName.changeTypeName}}
          </el-button>&ndash;&gt;
          <el-button type="primary" class="float-right" plain @click="editClasses">编辑</el-button>
          <el-button type="primary" class="float-right" @click="saveClasses">保存</el-button>
        </div>-->
      </el-col>
      <!-- <el-col class="areas height100" :span="5">
         <div class="title">
           <l-card-title>
             <span slot="left">2.诊疗类型选择</span>
           </l-card-title>
         </div>
         <div class="table-cont">
           <el-table
             :data="treatTypeData"
             width="100%"
             height="auto"
             stripe
             border
             @selection-change="selectChange"
           >
             <el-table-column
               type="selection"
               align="center"
               header-align="center"
               :selectable='selectInit'
               width="55">
             </el-table-column>
             <el-table-column
               v-for="(item, index) in treatTypeParams"
               :key="index"
               :prop="item.prop"
               :label="item.label"
               :min-width="item.width"
               :align="item.align || 'left'"
               :header-align="item.headerAlign || 'left'"
               :fixed="item.fixed"
             ></el-table-column>
           </el-table>
         </div>
       </el-col>-->
      <el-col class="areas height100" :span="14">
        <div class="title">
          <l-card-title>
            <span slot="left">2.号源维护</span>
            <span slot="right">
              <el-button type="text" :disabled="isSave!='1'" @click="addClassNum"><i class="iconfont iconxinzeng"></i> 新增号源维护</el-button>
            </span>
          </l-card-title>
        </div>
        <div class="table-cont">
          <el-table
            ref="table1"
            :data="classesNumData"
            width="100%"
            stripe
            border
          >
            <el-table-column
              v-for="(item, index) in classesNumParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope1">
                <template v-if="scope1.row['isEdit'] == '1'">
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" @click.stop="completeClassesNum(scope1.row,scope1.$index)">完成</el-button>
                    <el-button type="text" @click.stop="cancelClassesNum">取消</el-button>
                  </template>
                  <template v-else-if="item.prop == 'diagTreatTypeCode'">
                    <l-value-domain
                      clearable
                      style="width: 100%"
                      :value.sync="scope1.row[item.prop]"
                      remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO"
                      type="select"
                      :remoteParams="remoteParams"
                      remoteShowKey="diagTreatTypeName"
                      remoteValueKey="diagTreatTypeCode"
                      placeholder="请选择"
                    ></l-value-domain>
                  </template>
                  <template v-else-if="item.prop == 'classNum'||item.prop == 'appendNumLimit' ||item.prop == 'apptNum'">
                    <el-input-number v-model="scope1.row[item.prop]" controls-position="right" :min="0"
                                     style="width: 100%"></el-input-number>
                  </template>
                  <template v-else>
                    {{scope1.row[item.prop]}}
                  </template>
                </template>
                <template v-else>
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" :disabled="isSave!='1'" @click.stop="editClassesNum(scope1.row,scope1.$index)">
                      编辑
                    </el-button>
                    <el-button type="text" :disabled="isSave!='1'" @click.stop="deletedClassesNum(scope1.row,scope1.$index)">
                      删除
                    </el-button>
                  </template>
                  <template v-else-if="item.prop == 'diagTreatTypeCode'">
                    <span
                      tableName="appt_diag_treat_type"
                      :conditionMap="{DIAG_TREAT_TYPE_CODE: scope1.row[item.prop]}"
                      columns="DIAG_TREAT_TYPE_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else>
                    {{scope1.row[item.prop]}}
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import scheManagement from "@/api/schedule/scheduleManagement.js";

  export default {
    name: "treatClassesMaintain",
    data() {
      return {
        //班次数据
        classesParams: [
          {
            prop: "className",
            label: "班次名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "dutyStartTime",
            label: "开诊时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "dutyStopTime",
            label: "结束时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "recordStatus",
            label: "状态",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "operate",
            label: "操作",
            align: "center",
            headerAlign: "left",
            fixed: false,
            width: "100"
          }
        ],
        remoteParams: {
          recordStatus: 1
        },
        classesData: [],
        currrentClass: {},
        isNew: '0',
        isSave: '1',
        //诊疗类型数据
        treatTypeParams: [{
          prop: "diagTreatTypeName",
          label: "诊疗类型名称",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }],
        treatTypeData: [],
        //号源维护
        classesNumParams: [
          {
            prop: "className",
            label: "班次名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "diagTreatTypeCode",
            label: "诊疗类型名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          },
          {
            prop: "classNum",
            label: "默认挂号号源数",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "100"
          },{
            prop: "apptNum",
            label: "默认预约号源数",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "100"
          },
          /* {
            prop: "appendNumLimit",
            label: "默认加号数",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, */
          {
            prop: "updatedByName",
            label: "操作人",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "70"
          }, {
            prop: "updatedAt",
            label: "操作时间",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "operate",
            label: "操作",
            align: "center",
            headerAlign: "center",
            fixed: false,
            width: "100"
          }
        ],
        classesNumData: [],
        isNew1: '0',
        isSave1: '1'
      }
    },
    computed: {
      buttonName() {
        return {
          // editName: this.currrentClass.isEdit == '0' ? '编辑' : '完成',
          editName: '编辑',
          changeTypeName: this.currrentClass.recordStatus == '1' ? '暂停' : '启用'
        }
      }
    },
    created() {
      this.getClassData();
    },
    methods: {
      /*班次*/
      //获取班次
      async getClassData() {
        this.$showLoading();
        try {
          let data = await scheManagement.getCalss();
          /*let data = {
            code: '1',
            data: [
              {
                className: '上午',
                dutyStartTime: '09:00',
                dutyStopTime: '12:00',
                recordStatus: '1'
              }]
          };*/
          if (data.code == "1") {
            let classesData = [...data.data];
            for (let i in classesData) {
              classesData[i].isEdit = '0';
            }
            this.classesData = [...classesData];
            this.currrentClass = this.classesData[0];
            this.getClassNum();
            this.$nextTick(() => {
              this.$refs.table0.setCurrentRow(this.currrentClass);
            });
          } else {
            this.$message.error(data.msg || "获取班次列表失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取班次列表失败");
        }
      },
      //点击某一行
      classesRowClick(row, column, event) {
        this.currrentClass = row;
        if (this.isSave == '1') {
          this.getClassNum();
        }

        //重置 isSave1
        // this.isSave1 = '1'
      },
      //新增班次
      addClasses() {
        if (this.isSave != '1') {
          this.$message.error("请先保存数据");
        } else {
          this.$set(this.classesData, this.classesData.length, {
            className: '',
            dutyStartTime: '',
            dutyStopTime: '',
            recordStatus: '1',
            isEdit: '1',
            index: this.classesData.length
          });
          this.currrentClass = this.classesData[this.classesData.length - 1];
          this.$nextTick(() => {
            this.$refs.table0.setCurrentRow(this.currrentClass);
          });
          this.isNew = '1';
          this.isSave = '0';
        }
      },
      //编辑班次
      editClasses(row, index) {
        if (this.isSave != '1') {
          this.$message.warning("请先保存数据");
        } else {
          row.isEdit = '1';
          this.isSave = '0';
        }
      },
      //完成本次编辑
      async completeClasses(row, index) {
        // 校验
        if(!row.className||!row.dutyStartTime||!row.dutyStopTime){
          this.$message.error("请完整填写班次信息");
          return
        }
        row.isEdit = '0';
        this.$showLoading();
        try {
          let data, params;
          if (this.isNew == '1') {
            params = {...row};
            this.$delete(params,'isEdit');
            this.$delete(params,'index');
            data = await scheManagement.addCalss(params);
          } else {
            params = {...row};
            this.$delete(params,'isEdit');
            data = await scheManagement.updateCalss(params);
          }
          if (data.code == "1") {
            this.$message.success("更新成功");
            this.isSave = '1';
            this.getClassData();
          } else {
            row.isEdit = '1';
            this.$message.error(data.msg || "更新失败");
          }
          this.isNew = '0';
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          row.isEdit = '1';
          this.$message.error(e.msg || "更新失败");
        }
      },
      //取消
      cancelClasses() {
        this.getClassData();
        this.isSave = '1';
      },
      //删除班次
      deleteClasses(row, index) {
        if (this.isSave != '1') {
          this.$message.warning("请先保存数据");
        } else {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$showLoading();
            try {
              let params = row.classId;
              let data = await scheManagement.delCalss(params);
              if (data.code == "1") {
                this.$message.success("删除成功");
                this.getClassData();
              } else {
                this.$message.error(data.msg || "删除失败");
              }
              this.$hideLoading();
            } catch (e) {
              this.$hideLoading();
              this.$message.error(e.msg || "删除失败");
            }
          });
        }
      },
      //暂停班次
      changeTypeClasses() {

      },
      //保存班次
      saveClasses() {
        this.isSave = '1';
      },
      /*诊疗类型*/
      //获取诊疗类型
      async getTreatTypeData() {
        this.$showLoading();
        try {
          // let data = await scheManagement.selectRoomStation(params);
          let data = {
            code: '1',
            data: [{diagTreatTypeName: '普通门诊'}, {diagTreatTypeName: '专家门诊'}]
          };
          if (data.code == "1") {
            this.treatTypeData = [...data.data];
          } else {
            this.$message.error(data.msg || "获取诊疗类型列表失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取诊疗类型列表失败");
        }
      },
      selectInit() {
        return this.isSave == '1';
      },
      selectChange(selections) {
        if (selections.length > 0) {


        }
      },
      /*号源维护*/
      async getClassNum() {
        this.$showLoading();
        try {
          let params = {
            classId: this.currrentClass.classId
          };
          let data = await scheManagement.getCalssNum(params);
          /*let data = {
            code: '1',
            data: [
              {
                className: '上午',
                diagTreatTypeName: '普通门诊',
                classNum: 30,
                appendNumLimit: 10,
                createdByName: '李想',
                createdAt: '2019-12-10 11:20:58'
              }, {
                className: '上午',
                diagTreatTypeName: '普通门诊',
                classNum: 30,
                appendNumLimit: 10,
                createdByName: '李想',
                createdAt: '2019-12-10 11:20:58'
              }
            ]
          };*/
          if (data.code == "1") {
            let classesNumData = [...data.data];
            for (let i in classesNumData) {
              classesNumData[i].isEdit = '0';
            }
            this.classesNumData = [...classesNumData];

            //重置 isSave1
            this.isSave1 = '1'

          } else {
            this.$message.error(data.msg || "获取号源列表失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          // this.$message.error(error.msg || "获取号源列表失败");
        }
      },
      //新增号源维护
      addClassNum() {
        if (this.isSave1 != '1') {
          this.$message.error("请先保存数据");
        } else {
          this.$set(this.classesNumData, this.classesNumData.length, {
            className: this.currrentClass.className,
            classId: this.currrentClass.classId,
            diagTreatTypeCode: '',
            classNum: 0,
            apptNum: 0,
            appendNumLimit: 0,
            isEdit: '1'
          });
          this.isNew1 = '1';
          this.isSave1 = '0';
        }
      },
      //编辑
      editClassesNum(row, index) {
        if (this.isSave1 != '1') {
          this.$message.error("请先保存数据");
        } else {
          row.isEdit = '1';
          this.isNew1 = '0';
          this.isSave1 = '0';
        }
      },
      //本条编辑完成
      async completeClassesNum(row, index) {
        // console.log(row, "diagTreatTypeCode", row.diagTreatTypeCode, row.classNum, row.apptNum);
        if(row.diagTreatTypeCode == "" || row.classNum <= 0 || row.apptNum <= 0) {
          this.$message.warning("请准确填写内容！");
          return;
        }
        row.isEdit = '0';
        this.$showLoading();
        try {
          let data, params;
          if (this.isNew1 == '1') {
            params = {...row};
            this.$delete(params,'isEdit');
            data = await scheManagement.addCalssNum(params);
          } else {
            params = {...row};
            this.$delete(params,'isEdit');
            data = await scheManagement.updateNum(params);
          }
          if (data.code == "1") {
            this.$message.success("更新成功");
            this.isSave1 = '1';
            this.getClassNum();
          } else {
            row.isEdit = '1';
            this.$message.error(data.msg || "更新失败");
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          row.isEdit = '1';
          this.$message.error(e.msg || "更新失败");
        }
      },
      //本条编辑取消
      cancelClassesNum() {
        this.getClassNum();
        this.isSave1 = '1';
      },
      //删除
      deletedClassesNum(row, index) {
        if (this.isSave1 != '1') {
          this.$message.error("请先保存数据");
        } else {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.$showLoading();
            try {
              let params = row.id;
              let data = await scheManagement.delNum(params);
              if (data.code == "1") {
                this.$message.success("删除成功");
                this.getClassNum();
              } else {
                this.$message.error(data.msg || "删除失败");
              }
              this.$hideLoading();
            } catch (e) {
              this.$hideLoading();
              this.$message.error(e.msg || "删除失败");
            }
          });
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .treatClassesMaintain {
    padding: 0 20px 0 20px;

    .areas {
      padding: 0 20px 20px 20px;

      .table-cont {
        height: calc(100% - 100px);
      }

      .title {
        i {
          font-size: 14px;
        }
      }
    }

    .areas:nth-child(1),
    .areas:nth-child(2) {
      border-right: 1px solid $l-color-bgcolor-11;
    }
  }
</style>
