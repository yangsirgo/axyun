<template>
  <div class="roleMaintain clearfix height100">
    <div class="left float-left height100">
      <div class="nav-bars">
        <el-row :gutter="20">
          <el-col :span="14">
            <LFormtTitle label="角色名称">
              <el-input
                v-model="roleSearchData.roleName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="searchRole">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="roleTable"
          :data="roleInfoData"
          width="100%"
          height="100%"
          :stripe="true"
          border
          @row-click="rowClick"
          highlight-current-row
          v-loadmore="{
            noMoreVar: 'totalPage0',
            loadingVar: 'tlm_isLoading0',
            value: load0,
          }"
          v-loading="tlm_isLoading0"
        >
          <el-table-column
            v-for="(item, index) in roleParams"
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
    </div>
    <div class="right float-right height100">
      <div class="nav-bars">
        <el-row :gutter="20">
          <el-col :span="6">
            <LFormtTitle label="文书名称">
              <el-input
                v-model="searchData.docName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="拼音码">
              <el-input
                v-model="searchData.docInputcodePinyin"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="五笔码">
              <el-input
                v-model="searchData.docInputcodeFive"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" class="float-right" @click="save"
              >保存</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="docTable"
          :data="docInfoData"
          width="100%"
          height="100%"
          :stripe="true"
          border
          v-loadmore="{
            noMoreVar: 'totalPage',
            loadingVar: 'tlm_isLoading',
            value: load,
          }"
          v-loading="tlm_isLoading"
          :element-loading-text="$t('retreat.loadInfo')"
          @select="select"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in docInfoParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'docBrowse'">
                <span @click="click(scope.row, scope.$index)">
                  <el-checkbox
                    v-model="scope.row[item.prop]"
                    @change="change"
                  ></el-checkbox>
                </span>
              </template>
              <template v-else-if="item.prop == 'docAdd'">
                <span @click="click(scope.row, scope.$index)">
                  <el-checkbox
                    v-model="scope.row[item.prop]"
                    @change="change"
                  ></el-checkbox>
                </span>
              </template>
              <template v-else-if="item.prop == 'docModify'">
                <span @click="click(scope.row, scope.$index)">
                  <el-checkbox
                    v-model="scope.row[item.prop]"
                    @change="change"
                  ></el-checkbox>
                </span>
              </template>
              <template v-else-if="item.prop == 'docDelete'">
                <span @click="click(scope.row, scope.$index)">
                  <el-checkbox
                    v-model="scope.row[item.prop]"
                    @change="change"
                  ></el-checkbox>
                </span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getDocInfo} from '@/api/emrRecord/nursingRecord/docInfoMaintain';
  import {
    getRoleList,
    getDocRoleRightByDocRoleCode,
    saveDocRoleRight
  } from '@/api/emrRecord/nursingRecord/authorityMaintain';

  export default {
    name: "roleMaintain",
    data() {
      return {
        //角色
        roleSearchData: {},
        pageSize0: 20,
        pageNo0: 1,
        total0: 0,
        tlm_isLoading0: false,
        roleParams: [
          {
            prop: "name",
            label: "角色名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "100"
          }
        ],
        roleInfoData: [],
        roleInfoDataUnit: [],
        currentRole: {},
        //文书
        searchData: {},
        pageSize: 20,
        pageNo: 1,
        total: 0,
        tlm_isLoading: false,
        docInfoParams: [
          {
            prop: "docName",
            label: "文书名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }, {
            prop: "docBrowse",
            label: "查看权限",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "docAdd",
            label: "新建权限",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "docModify",
            label: "修改权限",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "docDelete",
            label: "删除权限",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }
        ],
        docInfoData: [],
        docInfoDataUnit: [],
        //当前勾选权限操作的文书
        docInfoIndex: 0,
        //角色文书权限数据
        docRoleData: [],
        /*需要更新的文书权限列表*/
        newSelection: []
      }
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageSize) <= this.pageNo;
      },
      totalPage0() {
        return Math.ceil(this.total0 / this.pageSize0) <= this.pageNo0;
      }
    },
    async created() {
      await this.search();
      await this.searchRole();
    },
    methods: {
      /*查询角色*/
      async getRoleData() {
        this.tlm_isLoading0 = true;
        try {
          let params = {
            pageSize: this.pageSize0,
            pageNo: this.pageNo0,
            name:this.roleSearchData.roleName
          };
          let res = await getRoleList(params);
          if (res.code == '1') {
            this.roleInfoDataUnit = [...res.data];
            this.total0 = res.total;
          } else {
            this.$message.error(res.msg || "获取角色数据失败");
          }
          this.tlm_isLoading0 = false;
        } catch (err) {
          this.tlm_isLoading0 = false;
          this.$message.error(err.msg || "获取角色数据失败");
        }
      },
      load0() {
        const _this = this;
        this.pageNo0++;
        setTimeout(async () => {
          let roleInfoData = [..._this.roleInfoData];
          if (!_this.totalPage0) {
            _this.pageNo0--;
          } else {
            await this.getRoleData();
            _this.roleInfoData = [...roleInfoData.concat(_this.roleInfoData)];
          }
          _this.tlm_isLoading0 = false;
        }, 2000)
      },
      async searchRole() {
        this.pageNo0 = 1;
        await this.getRoleData();
        this.roleInfoData = this.roleInfoDataUnit;
        this.$refs.roleTable.setCurrentRow(this.roleInfoData[0]);
        this.currentRole = this.roleInfoData[0];
        this.getDocRole();
      },
      //通过角色获取文书权限
      rowClick(row) {
        this.currentRole = row;
        this.getDocRole();
      },
      /*获取角色权限信息*/
      async getDocRole() {
        //清空之前权限的选项与数据
        this.docRoleData = [];
        this.newSelection = [];
        this.$refs.docTable.clearSelection();
        for (let k in this.docInfoData) {
          this.$set(this.docInfoData, k, {
            ...this.docInfoData[k],
            docBrowse: false,
            docAdd: false,
            docModify: false,
            docDelete: false
          });
        }
        this.tlm_isLoading = true;
        try {
          let params = {roleCode: this.currentRole.code};
          let res = await getDocRoleRightByDocRoleCode(params);
          /*let res = {
            code: 1,
            data: [
              {
                "dataVersion": 0,
                "deletedStatus": "0",
                "docBrowse": "1",
                "docAdd": "0",
                "docModify": "0",
                "docDelete": "0",
                "docCode": "dC19111300005",
                "hosCode": "",
                "hosId": "91",
                "id": "402846dc6e46229e016e46229ef90000",
                "orgCode": "",
                "orgId": "66",
                "roleCode": "ZY0002"
              },
              {
                "dataVersion": 0,
                "deletedStatus": "0",
                "docCode": "dC19110800002",
                "docBrowse": "1",
                "docAdd": "1",
                "docModify": "1",
                "docDelete": "0",
                "hosCode": "",
                "hosId": "91",
                "id": "402846dc6e46229e016e46246b320001",
                "orgCode": "",
                "orgId": "66",
                "roleCode": "ZY0002"
              },
              {
                "dataVersion": 0,
                "deletedStatus": "0",
                "docCode": "dC19110600010",
                "docBrowse": "1",
                "docAdd": "1",
                "docModify": "1",
                "docDelete": "1",
                "hosCode": "",
                "hosId": "91",
                "id": "402846dc6e46229e016e46246b320001",
                "orgCode": "",
                "orgId": "66",
                "roleCode": "ZY0002"
              }
            ]
          };*/
          if (res.code == '1') {
            let data = [...res.data];
            for (let i in data) {
              data[i]['docBrowse'] = data[i]['docBrowse'] == '1' ? true : false;
              data[i]['docAdd'] = data[i]['docAdd'] == '1' ? true : false;
              data[i]['docModify'] = data[i]['docModify'] == '1' ? true : false;
              data[i]['docDelete'] = data[i]['docDelete'] == '1' ? true : false;
              /*if (data[i]['docBrowse']) {
                data[i]['docBrowse'] = data[i]['docBrowse'] == '1' ? true : false;
              }
              if (data[i]['docAdd']) {
                data[i]['docAdd'] = data[i]['docAdd'] == '1' ? true : false;
              }
              if (data[i]['docModify']) {
                data[i]['docModify'] = data[i]['docModify'] == '1' ? true : false;
              }
              if (data[i]['docDelete']) {
                data[i]['docDelete'] = data[i]['docDelete'] == '1' ? true : false;
              }*/
              this.$set(this.docRoleData, i, {
                docCode: data[i]['docCode'],
                roleCode: data[i]['roleCode'],
                docBrowse: data[i]['docBrowse'],
                docAdd: data[i]['docAdd'],
                docModify: data[i]['docModify'],
                docDelete: data[i]['docDelete']
              });
              this.$set(this.newSelection, i, {
                docCode: data[i]['docCode'],
                roleCode: data[i]['roleCode'],
                docBrowse: data[i]['docBrowse'],
                docAdd: data[i]['docAdd'],
                docModify: data[i]['docModify'],
                docDelete: data[i]['docDelete']
              });
            }
            this.comparison();
          } else {
            this.$message.error(res.msg || "获取角色文书权限失败");
          }
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "获取角色文书权限失败");
        }
      },
      //已选角色权限与右侧文书列表做匹配并切换选中状态
      comparison() {
        for (let i in this.docRoleData) {
          for (let j in this.docInfoData) {
            if (this.docInfoData[j]['docCode'] == this.docRoleData[i]['docCode']) {
              this.$nextTick(() => {
                this.$refs.docTable.toggleRowSelection(this.docInfoData[j], true);
              });
              this.$set(this.docInfoData, j, {
                ...this.docInfoData[j],
                docBrowse: this.docRoleData[i].docBrowse,
                docAdd: this.docRoleData[i].docAdd,
                docModify: this.docRoleData[i].docModify,
                docDelete: this.docRoleData[i].docDelete
              });
            }
          }
        }
      },
      comparison1() {
        let docInfoDataUnit = this.docInfoData.slice((this.pageNo - 1) * this.pageSize);
        // console.log(docInfoDataUnit);
        for (let i in this.docRoleData) {
          for (let j in docInfoDataUnit) {
            if (docInfoDataUnit[j]['docCode'] == this.docRoleData[i]['docCode']) {
              this.$nextTick(() => {
                this.$refs.docTable.toggleRowSelection(this.docInfoData[Number((this.pageNo - 1) * this.pageSize) + Number(j)], true);
              });
              this.$set(this.docInfoData, Number((this.pageNo - 1) * this.pageSize) + Number(j), {
                ...docInfoDataUnit[j],
                docBrowse: this.docRoleData[i].docBrowse,
                docAdd: this.docRoleData[i].docAdd,
                docModify: this.docRoleData[i].docModify,
                docDelete: this.docRoleData[i].docDelete
              });
              /*与newSelecyion比对*/
              let arr = [];
              for (let v in this.newSelection) {
                if (docInfoDataUnit[j]['docCode'] == this.newSelection[v]['docCode']) {
                  arr.push(this.newSelection[v]['docCode']);
                }
              }
              if (arr.length <= 0) {
                this.$set(this.newSelection, this.newSelection.length, {
                  ...docInfoDataUnit[j],
                  docBrowse: this.docRoleData[i].docBrowse,
                  docAdd: this.docRoleData[i].docAdd,
                  docModify: this.docRoleData[i].docModify,
                  docDelete: this.docRoleData[i].docDelete
                });
              }
            }
          }
        }
      },
      /*获取文书信息数据*/
      async getdocInfoData() {
        this.tlm_isLoading = true;
        try {
          let params = {
            ...this.searchData,
            pageSize: this.pageSize,
            pageNo: this.pageNo
          };
          let res = await getDocInfo(params);
          if (res.code == '1') {
            /*let data = [
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111300005",
                "docName": "文书1",
                "hosId": "91",
                "id": "111",
                "orgId": "66",
                docBrowse: '1',
                docAdd: '0',
                docModify: '1',
                docDelete: '0'
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19110800001",
                "docName": "文书2",
                "hosId": "91",
                "id": "2c9180856e499eea016e49d5d2340011",
                "orgId": "66",
                docBrowse: '1',
                docAdd: '1',
                docModify: '1',
                docDelete: '0'
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19110800002",
                "docName": "文书3",
                "hosId": "91",
                "id": "2c9180856e499eea016e49d600e10012",
                "orgId": "66",
                docBrowse: '1',
                docAdd: '0',
                docModify: '0',
                docDelete: '0'
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111200001",
                "docName": "文书4",
                "hosId": "91",
                "id": "2c9180856e5e336f016e5e336f0d0000",
                "orgId": "66"
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111200002",
                "docName": "文书5",
                "hosId": "91",
                "id": "2c9180856e5e336f016e5e6bcd280001",
                "orgId": "66"
              },
              {
                "dataVersion": 2,
                "deletedStatus": "0",
                "docCode": "dC19110600005",
                "docName": "文书6",
                "docNote": "2",
                "hosId": "91",
                "id": "2c9180866e406c7c016e40f0dc56000b",
                "orgId": "66"
              },
              {
                "dataVersion": 2,
                "deletedStatus": "0",
                "docCode": "dC19110600006",
                "docName": "文书7",
                "docNote": "1",
                "hosId": "91",
                "id": "2c9180866e406c7c016e4102bbac002d",
                "orgId": "66"
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111300009",
                "docName": "文书8",
                "hosId": "91",
                "id": "2c9180866e62a8e5016e637be4cc0005",
                "orgId": "66"
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111300010",
                "docName": "文书9",
                "hosId": "91",
                "id": "2c9180866e62a8e5016e638410ef0006",
                "orgId": "66"
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111300011",
                "docName": "文书10",
                "hosId": "91",
                "id": "2c9180866e62a8e5016e6397b2a80007",
                "orgId": "66"
              },
              {
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19111300012",
                "docName": "文书11",
                "hosId": "91",
                "id": "2c9180866e62a8e5016e6397c6740008",
                "orgId": "66"
              },
              {
                "classCode": "DC19110400001",
                "dataVersion": 2,
                "deletedStatus": "0",
                "docCode": "dC19110600007",
                "docName": "文书12",
                "docNote": "3",
                "docType": "1",
                "docUser": "2",
                "hosId": "91",
                "id": "402846dc6e3f7219016e3f8e0e0a0007",
                "orgId": "66"
              },
              {
                "classCode": "DC19110400001",
                "dataVersion": 1,
                "deletedStatus": "0",
                "docCode": "dC19110600009",
                "docName": "文书13",
                "docNote": "444",
                "hosId": "91",
                "id": "402846dc6e3f7219016e3fe3804e000a",
                "orgId": "66"
              },
              {
                "classCode": "DC19110500003",
                "dataVersion": 3,
                "deletedStatus": "0",
                "docCode": "dC19110600010",
                "docName": "文书14",
                "docNote": "555",
                "docType": "1",
                "docUser": "2",
                "hosId": "91",
                "id": "402846dc6e3f7219016e3fefdf7d000b",
                "orgId": "66"
              }
            ];*/
            let data = [...res.data];
            this.total = res.total;
            for (let i in data) {
              /*if (data[i]['docBrowse']) {
                data[i]['docBrowse'] = data[i]['docBrowse'] === '1' ? true : false;
              }
              if (data[i]['docAdd']) {
                data[i]['docAdd'] = data[i]['docAdd'] === '1' ? true : false;
              }
              if (data[i]['docModify']) {
                data[i]['docModify'] = data[i]['docModify'] === '1' ? true : false;
              }
              if (data[i]['docDelete']) {
                data[i]['docDelete'] = data[i]['docDelete'] === '1' ? true : false;
              }*/
              data[i]['docBrowse'] = false;
              data[i]['docAdd'] = false;
              data[i]['docModify'] = false;
              data[i]['docDelete'] = false;
            }
            this.docInfoDataUnit = [...data];
          } else {
            this.$message.error(res.msg || "获取文书信息数据失败");
          }
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "获取文书信息数据失败");
        }
      },
      load() {
        const _this = this;
        this.pageNo++;
        setTimeout(async () => {
          if (!_this.totalPage) {
            _this.pageNo--;
          } else {
            await _this.getdocInfoData();
            for (let i in _this.docInfoDataUnit) {
              _this.$set(_this.docInfoData, _this.docInfoData.length, _this.docInfoDataUnit[i]);
            }
            //比对渲染
            _this.comparison1();
          }
          _this.tlm_isLoading = false;
        }, 2000)
      },
      async search() {
        this.pageNo = 1;
        await this.getdocInfoData();
        this.docInfoData = this.docInfoDataUnit;
      },
      click(row, index) {
        this.docInfoIndex = index;
      },
      change(value) {
        let docInfoRow = this.docInfoData[this.docInfoIndex];
        if (docInfoRow['docBrowse'] == false && docInfoRow['docAdd'] == false && docInfoRow['docModify'] == false && docInfoRow['docDelete'] == false) {
          this.$refs.docTable.toggleRowSelection(docInfoRow, false);
          for (let k in this.newSelection) {
            if (this.newSelection[k].docCode == docInfoRow.docCode) {
              this.$delete(this.newSelection, k);
            }
          }
        } else {
          this.$refs.docTable.toggleRowSelection(docInfoRow, true);
          for (let k in this.newSelection) {
            if (this.newSelection[k].docCode == docInfoRow.docCode) {
              this.$set(this.newSelection, k, {...docInfoRow});
            }
          }
        }
        if (value == true) {
          this.$refs.docTable.toggleRowSelection(docInfoRow, true);
          let arr = [];
          for (let i in this.newSelection) {
            if (this.newSelection[i].docCode == docInfoRow.docCode) {
              this.$set(this.newSelection, i, {...docInfoRow});
              arr.push(this.newSelection[i]);
            }
          }
          if (arr.length <= 0) {
            this.$set(this.newSelection, this.newSelection.length, {...docInfoRow});
          }
        }
        // console.log(this.newSelection);
      },
      select(selection, row) {
        this.newSelection = [...selection];
        let arr = [];
        for (let i in selection) {
          if (selection[i].docCode == row.docCode) {
            arr.push(selection[i]);
          }
        }
        if (arr.length <= 0) {
          //这条数据中的权限全不选
          for (let i in this.docInfoData) {
            if (this.docInfoData[i].docCode == row.docCode) {
              this.$set(this.docInfoData, i, {
                ...this.docInfoData[i],
                docBrowse: false,
                docAdd: false,
                docModify: false,
                docDelete: false
              });
              break;
            }
          }
        } else {
          //新增
          //这条数据中的权限全选
          for (let i in this.docInfoData) {
            if (this.docInfoData[i].docCode == row.docCode) {
              /*this.$set(this.docInfoData, i, {
                ...this.docInfoData[i],
                docBrowse: true,
                docAdd: true,
                docModify: true,
                docDelete: true
              });*/
              this.docInfoData[i]['docBrowse'] = true;
              this.docInfoData[i]['docAdd'] = true;
              this.docInfoData[i]['docModify'] = true;
              this.docInfoData[i]['docDelete'] = true;
              break;
            }
          }
        }
        // console.log(this.newSelection);
      },
      selectAll(selection) {
        if (selection.length <= 0) {
          for (let i in this.docInfoData) {
            this.$set(this.docInfoData, i, {
              ...this.docInfoData[i],
              docBrowse: false,
              docAdd: false,
              docModify: false,
              docDelete: false
            });
            this.$refs.docTable.toggleRowSelection(this.docInfoData[i], false);
          }
          this.newSelection = [];
        } else {
          for (let i in this.docInfoData) {
            this.$set(this.docInfoData, i, {
              ...this.docInfoData[i],
              docBrowse: true,
              docAdd: true,
              docModify: true,
              docDelete: true
            });
            this.$refs.docTable.toggleRowSelection(this.docInfoData[i], true);
          }
          this.newSelection = [...this.docInfoData];
        }
        // console.log(this.newSelection);
      },
      /*更新权限数据*/
      async save() {
        // console.log(this.newSelection);
        let params = [];
        for (let i in this.newSelection) {
          this.$set(params, i, {
            roleCode: this.currentRole.code,
            docCode: this.newSelection[i]['docCode'],
            docBrowse: this.newSelection[i]['docBrowse'] ? '1' : '0',
            docAdd: this.newSelection[i]['docAdd'] ? '1' : '0',
            docModify: this.newSelection[i]['docModify'] ? '1' : '0',
            docDelete: this.newSelection[i]['docDelete'] ? '1' : '0'
          });
        }
        console.log(params);
        // if (params.length > 0) {
          this.$showLoading();
          try {
            let data = await saveDocRoleRight(params);
            if (data.code == '1') {
              this.$message("更新成功");
              this.getDocRole();
            } else {
              this.$message.error(data.msg || "更新失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "更新失败");
          }
        // }
      }
    }
  }
</script>

<style scoped lang="scss">
.roleMaintain {
  .left {
    width: 410px;
    margin-right: 20px;
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;

    .table-cont {
      height: calc(100% - 58px);
      margin-top: 20px;
    }
  }

  .right {
    width: calc(100% - 430px);
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;

    .table-cont {
      height: calc(100% - 58px);
      margin-top: 20px;
    }
  }
}
</style>
