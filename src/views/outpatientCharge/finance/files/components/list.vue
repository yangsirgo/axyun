<template>
  <div class="height100">
    <el-card class="list-cont">
      <div class="navBar">
        <el-input size="medium" class="inputFind" v-model="searchData"
                  placeholder="患者姓名、身份证号"
                  @keyup.enter.native="enterSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <el-button type="primary" class="duka-button"><i class="iconfont iconduka"></i>读卡</el-button>
        <el-button @click="createNewFiles" class="search-button">新建档案</el-button>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          width="100%"
          height="250px"
          stripe
          border
          @row-click="listRowClick"
          highlight-current-row
          v-loadmore="load"
          v-loading="tlm_isLoading"
          :element-loading-text="$t('retreat.loadInfo')"
          >
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            class="overflow-point"
            header-align="left"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="fileScope">
              <template v-if="item.prop == 'patientName'">
                <!-- getAge(strSplit(fileScope.row['birthDate'],' '))-->
                <span style="color:#3D7DFB;cursor: pointer" @click="fileDetail(fileScope.row['patientNum'])">{{ fileScope.row['patientName']}} {{ fileScope.row['patientGender']==1?'男':'女'}} {{fileScope.row['patientAge']}}</span>
              </template>
              <template v-else>
                <span>{{ fileScope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="layout"
          :total="total"
          :prev-text="prevText"
          :next-text="nextText"
          :hide-on-single-page="hideOnSinglePage"
        ></el-pagination>
      </div>-->
    </el-card>

    <!--<new-file :fileDisable="fileDisable"
              @changeFileDisable="changeFileDisable"
              @fileSave="fileSave"
    ></new-file>-->
  </div>
</template>
<script>
  // import newFile from '../components/newFile.vue';
  import {getArchList} from '@/api/arch/arch.js';

  export default {
    components: {
      // newFile
    },
    name: "Files",
    data() {
      return {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        // layout: 'sizes,prev,pager,next,jumper,total',
        // prevText: '',
        // nextText: '',
        // hideOnSinglePage: false,
        searchData: '',
        data:[],//每次请求的分页data
        tableParams: [
          {
            prop: "patientName",
            label: "患者",
            align: "left",
            width: "166",
            fixed: 'left'
          }, {
            prop: "mobileNum",
            label: "联系方式",
            align: "left",
            width: "120",
            fixed: false

          }, {
            prop: "identificationNum",
            label: "身份证",
            align: "left",
            width: "170",
            fixed: false
          },
          {
            prop: "contactAddress",
            label: "联系地址",
            align: "left",
            width: "262",
            fixed: false
          },
          {
            prop: "careerCode",
            label: "职业",
            align: "left",
            width: "78",
            fixed: false
          },
          {
            prop: "maritalStatus",
            label: "婚姻",
            align: "left",
            width: "58",
            fixed: false
          }, {
            prop: "nationCode",
            label: "民族",
            align: "left",
            width: "58",
            fixed: false
          },
          {
            prop: "professionalBack",
            label: "职退情况",
            align: "left",
            width: "126",
            fixed: false
          },
          {
            prop: "townInsurancePlan",
            label: "镇保计划",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "healthProgram",
            label: "医疗项目",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "nonlocalPatient",
            label: "外地病人",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "isForeign",
            label: "是否外籍",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "disabilitySituation",
            label: "伤残情况",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "illnessFlag",
            label: "大病标识",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "patientClassification",
            label: "病人分类",
            align: "left",
            width: "96",
            fixed: false
          },
          {
            prop: "healthCare",
            label: "保健情况",
            align: "left",
            width: "153",
            fixed: false
          }
        ],
        tableData: [
          /*{
            name: '刘海明（男，22岁）',
            phone: '16689754236',
            cardNo: '1234567890',
            job: '学生',
            address: '上海市',
            marriage: '未婚',
            postBack: '在职',
            insurancePlan: '参加'
          }*/
        ],
        fileDisable: false,
        tlm_noMore: false, // 没有更多数据， 禁用加载
        tlm_isLoading: false// 请求数据中
      }
    },
    created() {
      this.getList(this.currentPage, this.pageSize, this.searchData);
    },
    methods: {
      /*请求列表*/
      async getList(page, limit, searchData) {
        let data = await getArchList({
          page: page,
          limit: limit,
          searchData: searchData
        });
        this.tableData = data.data;
        this.total = data.total;
        console.log(this.tableData);
        this.$emit('changeAccountDisable', {
          accountDisable: true,
          patientInfo: JSON.stringify(this.tableData[0])
        });
      },
      /*enter键查询列表*/
      enterSearch() {
        this.getList(this.currentPage, this.pageSize, this.searchData);
      },
      /*点击查询列表*/
      search() {
        this.getList(this.currentPage, this.pageSize, this.searchData);
      },
      /*新建档案*/
      createNewFiles() {
        let searchData = this.searchData.replace(/(^\s*)|(\s*$)/g, "")
        if (searchData) {
          // this.$router.push('/createFiles?' + searchData);
          this.$router.push({
            path: '/createFiles',
            query: {
              cardCode: searchData
            }
          });
        }
      },
      /*编辑档案*/
      fileDetail(patientNum) {


        // 后面加患者id
        this.$router.push({path: '/editFile', query: {id: patientNum}});
      },
      /*年龄计算*/
      getAge(str) {
        if (str) {
          var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
          if (r == null) {
            return false;
          }
          var d = new Date(r[1], r[3] - 1, r[4]);
          if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            var M = new Date().getMonth();
            var D = new Date().getDate();
            var T = new Date().getTime();
            // debugger
            if (Math.ceil((T - d.getTime()) / 86400000) <= 28) {
              return Math.ceil((T - d.getTime()) / 86400000) + '天';
            }
            if (M + 1 < r[3]) {
              if (Y - r[1] - 1 > 3) {
                return Y - r[1] - 1 + '岁';
              }
              return Y - r[1] - 1 + '岁' + (M + 13 - r[3]) + '个月';

            }
            if (Y - r[1] - 1 > 3) {
              return Y - r[1] + '岁';
            }
            return Y - r[1] + '岁' + (M + 1 - r[3]) + '个月';

          }
          return '';
        }
        return '';
      },
      /*切割字符串*/
      strSplit(data, sym) {
        if (data) {
          let str = data.split(sym)[0];
          return str;
        }
        return "";
      },
      /*点击列表某一行*/
      listRowClick(row, column, event) {
        console.log(row);
        this.$emit('changeAccountDisable', {
          accountDisable: true,
          patientInfo: JSON.stringify(row)
        });
      },
      //滑动加载更多信息
      load() {
        const _this = this;
        this.currentPage++;
        setTimeout(function () {
          let tableData = [..._this.tableData];
          //获取分页列表
          this.getList(this.currentPage, this.pageSize, this.searchData);
          if (_this.currentPage >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.tableData = [...tableData.concat(this.data)];
          _this.tlm_isLoading = false;
        }, 2000)
      }
      /*//点击每页显示数量时触发
    handleSizeChange(val) {
       this.pageSize = val;
       this.getList(this.currentPage, this.pageSize, this.searchData);
     },
     //翻页的时候触发
     handleCurrentChange(val) {
       this.currentPage = val;
       this.getList(this.currentPage, this.pageSize, this.searchData);
     },
     //点击上一页按钮改变当前页后触发
     prevClick(currentPage) {
       this.currentPage = currentPage;
       this.getList(this.currentPage, this.pageSize, this.searchData);
     },
     //点击下一页按钮改变当前页后触发
     nextClick(currentPage) {
       this.currentPage = currentPage;
       this.getList(this.currentPage, this.pageSize, this.searchData);
     },*/
    }
  }
</script>
<style scoped lang="scss">
  .list-cont {
    width: 100%;
    height: 100%;
    padding: 20px;
    position: relative;
    overflow: auto;

    .navBar {
      margin-bottom: 20px;

      .inputFind {
        width: 240px;
        height: 36px;
      }

      .search-button {
        width: 90px;
        height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;
        
        font-weight: 500;
        color: $l-color-white;
        float: right;
      }
      .duka-button {
        width: 200px;
        height: 38px;
        margin-left: 10px;
        border: none;
        border-radius: 2px;

        i {
          display: inline-block;
          margin-right: 10px;
        }
      }
    }
  }
</style>
