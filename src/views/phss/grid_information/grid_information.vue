<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <!-- 左侧目录 -->
      <el-col :span="9" style="padding-right:30px;padding-left:30px!important;height: 100%; ">
        <el-date-picker v-model="params.year" type="date" :value-format="year" :format="year1" placeholder="选择日期" :type="year2">
        </el-date-picker>
        <el-button @click="findList" type="primary" size="mini">查询</el-button>
        <el-button @click="handleReset" type="primary" size="mini">重置</el-button>
        <div class="tree_box" style="height: 90%;padding-bottom:20px;overflow-x:auto;width:100%">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-scrollbar style="height:98%">
            <el-tree :expand-on-click-node="false" :data="data" default-expand-all node-key="id" ref="tree" highlight-current :filter-node-method="filterNode" :props="defaultProps" class="el-tree">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                 <span> <i v-show="data.status=='1'" class="el-icon-close"></i>{{ node.label }}</span>
                <span>
                  <!--<div class="orgType">{{data.exts.orgTypeName}}</div>-->
                  <!--<el-button type="text" size="mini" @click="() => handledisable(data)">查看</el-button>-->
                  <el-button type="text" size="mini" v-show="data.regionCode==''||data.regionCode==null||typeof(data.regionCode)=='undefined'?true:false" @click="() => add(data)">添加下一级</el-button>
                  <el-button type="text" size="mini" v-show="data.regionCode==''||data.regionCode==null||typeof(data.regionCode)=='undefined'?false:true" @click="() => modify(data)">编辑</el-button>
                  <el-button type="text" size="mini" v-show="data.regionCode==''||data.regionCode==null||typeof(data.regionCode)=='undefined'?false:true" @click="() => remove(node,data)">删除</el-button>
                  <el-button type="text" size="mini" v-show="data.regionCode==''||data.regionCode==null||typeof(data.regionCode)=='undefined'?false:true" @click="() => disable(data)">{{data.status == '1' ? '已停用':'停用'}}</el-button>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="15" style="padding-left:30px;height: 100%;">
        <div class="table_box" style="height:600px!important;overflow-y:auto">
          <div v-show="countyFlag">

            <!--<div>-->
            <!--<div class="left">-->

            <!--<label>行政类别</label>-->
            <!--</div>-->
            <!--<div class="right">-->

            <!--<el-select v-model="SysRegionCodeVO.regionType"  >-->
            <!--<el-option-->
            <!--v-for="item in options"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div style="margin-top: 20px">-->
            <!--<div class="left">-->
            <!--<label>时间</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-date-picker-->
            <!--v-model="params.year"-->
            <!--type="date"-->
            <!--:value-format="year"-->
            <!--:format="year1"-->
            <!--placeholder="选择日期"-->
            <!--:type="year2"-->
            <!--@change="changeRegion"-->
            <!--&gt;-->
            <!--</el-date-picker>-->

            <!--</div>-->
            <!--</div>-->

            <!--<div style="margin-top: 20px">-->
            <!--<div class="left">-->

            <!--<label>行政区划</label>-->
            <!--</div>-->
            <!--<div class="right">-->

            <!--<el-select v-model="SysHosRegionVO.regionCode" placeholder="请选择">-->
            <!--<el-option-->
            <!--v-for="item in this.regions"-->
            <!--:key="item.id"-->
            <!--:label="item.label"-->
            <!--:value="item.id">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div style="margin-top: 20px">-->
            <!--<div class="left">-->
            <!--<label>维护时间</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-date-picker-->
            <!--v-model="SysHosRegionVO.createdAt"-->
            <!--type="date"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--format="yyyy-MM-dd"-->
            <!--placeholder="选择日期"-->
            <!--&gt;-->
            <!--</el-date-picker>-->

            <!--</div>-->
            <!--</div>-->
            <div style="margin-top: 20px">
              <div class="left">
                <label>编码</label>
              </div>
              <div class="right">
                <el-input placeholder="请输入内容" v-model="SysGridMaintenanceVO.code" v-bind:disabled="SysGridMaintenanceVO.code!=''&&this.status=='modify'?true:false">
                </el-input>

              </div>
            </div>
            <div style="margin-top: 20px">
              <div class="left">
                <label>网络名称</label>
              </div>
              <div class="right">
                <el-input placeholder="请输入内容" v-model="SysGridMaintenanceVO.name">
                </el-input>

              </div>
            </div>

            <div style="margin-top: 20px">
              <div class="left">
                <label>维护人</label>
              </div>
              <div class="right">
                <el-input placeholder="请输入内容" v-model="SysGridMaintenanceVO.createdByName">
                </el-input>

              </div>
            </div>


            <!--<div style="margin-top: 20px" v-if="SysRegionCodeVO.regionType !=''&& SysRegionCodeVO.regionType!=null">-->
            <!--<div class="left">-->
            <!--<label>常住人口数</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-input-->
            <!--placeholder="请输入内容"-->
            <!--v-model="SysRegionCodeVO.permanentPopulation"-->
            <!--&gt;-->
            <!--</el-input>-->

            <!--</div>-->
            <!--</div>-->
            <!--<div style="margin-top: 20px" v-if="SysRegionCodeVO.regionType !=''&& SysRegionCodeVO.regionType!=null">-->
            <!--<div class="left">-->
            <!--<label>65岁以上老年常住人口数-->
            <!--</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-input-->
            <!--placeholder="请输入内容"-->
            <!--v-model="SysRegionCodeVO.elderPopulation"-->
            <!--&gt;-->
            <!--</el-input>-->

            <!--</div>-->
            <!--</div>-->
            <!--<div style="margin-top: 20px" v-if="SysRegionCodeVO.regionType !=''&& SysRegionCodeVO.regionType!=null">-->
            <!--<div class="left">-->
            <!--<label>高血压人口数-->
            <!--</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-input-->
            <!--placeholder="请输入内容"-->
            <!--v-model="SysRegionCodeVO.hypertensionPopulation"-->
            <!--&gt;-->
            <!--</el-input>-->

            <!--</div>-->
            <!--</div>-->
            <!--<div style="margin-top: 20px" v-if="SysRegionCodeVO.regionType !=''&& SysRegionCodeVO.regionType!=null">-->
            <!--<div class="left">-->
            <!--<label>糖尿病人口数-->
            <!--</label>-->
            <!--</div>-->
            <!--<div class="right">-->
            <!--<el-input-->
            <!--placeholder="请输入内容"-->
            <!--v-model="SysRegionCodeVO.diabetesPopulation"-->
            <!--&gt;-->
            <!--</el-input>-->

            <!--</div>-->
            <!--</div>-->
            <div style="margin-top: 20px;">
              <div class="left">
                <el-button type="primary">取消</el-button>
              </div>
              <div class="right1">
                <el-button type="primary" @click="save()">确定</el-button>


              </div>
              <!--<div class="right2" v-if="SysRegionCodeVO.regionType =='01'|| SysRegionCodeVO.regionType=='02'">-->
              <!--<el-button type="primary" @click="cal()">汇总人口</el-button>-->


              <!--</div>-->
              <!--<el-button type="primary">取消</el-button>-->
              <!--<el-button type="primary">确定</el-button>-->
            </div>

          </div>

        </div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  import {
    getRegionGridList,
    saveRegionGridList,
    getNodeById,
    deleteHospitalGridNode,
    disableHospitalGridNode
  } from "@/api/phss/region/grid_information";

  export default {
    data() {
      return {

        params: {
          year: '',
          regionType: "03"
        },
        defaultProps: {
          children: "children",
          label: "label"
        },
        filterText: "",
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        year: 'yyyy',
        year1: 'yyyy 年',

        year2: 'year',
        input: '',
        data: [{
          id: 1,
          label: '河北省',
          level: 1,
          children: [{
            id: 4,
            label: '石家庄市',
            level: 2,
            children: [{
              id: 9,
              label: '黑狼口镇',
              level: 3,
              children: [{
                  id: 11,
                  label: '独流村居委会',
                  level: 4

                },
                {
                  id: 12,
                  label: '水流村居委会',
                  level: 4
                }
              ]
            }, {
              id: 10,
              label: '水流镇',
              level: 3
            }]
          }]
        }, {
          id: 2,
          label: '海南省',
          level: 1,
          children: [{
            id: 5,
            label: '海口市',
            level: 2
          }, {
            id: 6,
            label: '海口市A',
            level: 2
          }]
        }, {
          id: 3,
          label: '山东省',
          level: 1,
          children: [{
            id: 7,
            label: '青岛市',
            level: 2
          }, {
            id: 8,
            label: '日照市',
            level: 2
          }]
        }],
        regions: [],
        options: [
          // {
          //   value: '01',
          //   label: '县及县以上行政机构'
          // },
          // {
          //   value: '02',
          //   label: '乡镇(街道)级行政级别'
          // },
          {
            value: '03',
            label: '村(居)民委员会'
          }
        ],
        countyFlag: false,
        townFlag: false,
        villageFlag: false,
        SysGridMaintenanceVO: {
          code: '',
          name: '',
          responsibleDoctor: '',
          status: '',
          createdBy: '',
          createdByName: '',
          createdAt: '',
          updatedBy: '',
          updatedByName: '',
          updatedAt: '',
          deletedStatus: '',
          regionCode: '',
          hosId: ''
        },
        status: '',
        // 所有子节点id
        ids: []

      };
    },
    mounted() {
      this.list({ "params": "231" });
    },
    methods: {
      //根据时间获取居委会的的列表
      changeRegion() {
        // getRegionNode
        getRegionNode(this.params)
          .then(res => {
            console.info("根据时间获取居委会", res.data)
            this.regions = res.data;
            console.info("regions", this.regions)


          }).catch(error => {
            console.log(error);
          });

      },

      findList() {
        this.list(this.params);
      },

      handleReset() {
        // this.getOrgTree();
        // this.handleOrgClear();
      },

      filterNode(value, data) {
        if (!value) {
          return true;
        }
        return data.label.indexOf(value) !== -1;
      },
      nodeClick(data) {
        // let aa = this.$refs.tree.getCheckedNodes(true);
        console.log(data)
      },

      list(data) {
        this.data = [];
        getRegionGridList(data)
          .then(res => {
            this.data = res.data;
            console.info("节点", JSON.stringify(res.data))

          }).catch(error => {
            console.log(error);
          });

      },
      cal() {
        this.SysRegionCodeVO.permanentPopulation = '';
        this.SysRegionCodeVO.elderPopulation = '';
        this.SysRegionCodeVO.hypertensionPopulation = '';
        this.SysRegionCodeVO.diabetesPopulation = '';
        getCollectPopulation(this.ids).then(res => {

          console.info('222', res.data.elderPopulation);

          if (res.data.permanentPopulation != '' && res.data.permanentPopulation != null && typeof res.data.permanentPopulation != 'undefined') {
            this.$set(this.SysRegionCodeVO, "permanentPopulation", res.data.permanentPopulation);
          }

          if (res.data.elderPopulation != '' && res.data.elderPopulation != null && typeof res.data.elderPopulation != 'undefined') {
            this.$set(this.SysRegionCodeVO, "elderPopulation", res.data.elderPopulation);
          }

          if (res.data.hypertensionPopulation != '' && res.data.hypertensionPopulation != null && typeof res.data.hypertensionPopulation != 'undefined') {
            this.$set(this.SysRegionCodeVO, "hypertensionPopulation", res.data.hypertensionPopulation);
          }

          if (res.data.diabetesPopulation != '' && res.data.diabetesPopulation != null && typeof res.data.diabetesPopulation != 'undefined') {
            this.$set(this.SysRegionCodeVO, "diabetesPopulation", res.data.diabetesPopulation);
          }


          // this.$set(this.SysRegionCodeVO, "permanentPopulation", res.data.permanentPopulation);
          // this.$set(this.SysRegionCodeVO, "elderPopulation", res.data.elderPopulation);
          // this.$set(this.SysRegionCodeVO, "hypertensionPopulation", res.data.hypertensionPopulation);
          // this.$set(this.SysRegionCodeVO, "diabetesPopulation", res.data.diabetesPopulation);

          this.$forceUpdate()
        }).catch(error => {
          console.log(error);
        })
      },

      save() {
        console.info("save", JSON.stringify(this.SysGridMaintenanceVO));
        saveRegionGridList(this.SysGridMaintenanceVO).then(res => {
          if (res.code == "1") {
            this.$message.success("保存成功");
            this.list({ "params": "231" });
          }
          if (res.code == "0") {
            this.$message.error(res.msg);
          }



        }).catch(error => {
          console.log(error);
          this.$message.error(res.data);
        })
      },

      modify(data) {

        this.SysGridMaintenanceVO = {}

        this.status = "modify";
        this.ids = [];
        let arr = new Array();
        // arr.push(data.id)
        if (data.children != '' && data.children != null && typeof data.children != 'undefined') {
          this.getChildIds(data.children, arr);
        }

        this.ids = arr;
        console.info("当前节点", JSON.stringify(data));
        this.countyFlag = true


        getNodeById(data).then(res => {
          console.info("info", res.data);
          this.SysGridMaintenanceVO = res.data;

        }).catch(error => {
          console.log(error);
        })

      },


      add(data) {
        this.status = "add";

        this.SysGridMaintenanceVO = {};
        console.info("当前节点", JSON.stringify(data));
        this.SysGridMaintenanceVO.regionCode = data.id;
        this.countyFlag = true;


      },

      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      disable(data) {
        //disableHospitalDistrictNode
        console.info("zjq禁用", data);
        if(data.status || data.status == '1'){
          this.$message.success("已停用");
        }else{
          disableHospitalGridNode(data).then(res => {
            if (res.code == "1") {
              this.$message.success("停用成功");
              this.list({ "params": "231" });
            }
          }).catch(error => {
            console.log(error);
          })
        }
      },

      remove(node, data) {
        console.info("shanchu", data);
        console.info("node", node);
        let dataNew = [
            data.id
        ]
        if(data.status || data.status == '1'){
                deleteHospitalGridNode(dataNew).then(res => {
                  if (res.code == "1") {
                    this.$message.success("删除成功");
                    this.list({ "params": "231" })
                  }else{
              this.$message.error(res.msg);
            }
                }).catch(error => {
                  console.log(error);
                })
        }else{
          this.$message.error("停用后才可以删除");
        }
      },
      // 递归获取所有id
      getIds(child, arr) {
        // for (let i = 0; i < child.length; i++) {
        //   arr.push(child[i].id);
        //
        //   console.log('1111',child[i].id)
        //   if (child[i].children != '' && child[i].children != null&&typeof (child[i].children)!='undefined') {
        //     this.getIds(child[i].children, arr);
        //   }
        // }
        for (let ch of child) {
          console.log('1111', ch.id)
          arr.push(ch.id);
          if (ch.children != '' && ch.children != null && typeof ch.children != 'undefined') {
            this.getIds(ch.children, arr);
          }
        }
      },
      getChildIds(child, arr) {
        // for (let i = 0; i < child.length; i++) {
        //   arr.push(child[i].id);
        //
        //   console.log('1111',child[i].id)
        //   if (child[i].children != '' && child[i].children != null&&typeof (child[i].children)!='undefined') {
        //     this.getIds(child[i].children, arr);
        //   }
        // }
        for (let ch of child) {
          console.log('1111', ch.id)
          arr.push(ch.id);
          // if (ch.children != '' && ch.children != null && typeof (ch.children) != 'undefined') {
          //   this.getIds(ch.children, arr);
          // }
        }
      }

    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .left {
    display: inline-block;
    width: 200px;
    text-align: right
  }

  .right {
    display: inline-block;
    margin-left: 20px;
    width: 200px;
    text-align: left
  }

  .right1 {
    display: inline-block;
    margin-left: 20px;
    width: 100px;
    text-align: left
  }

  .right2 {
    display: inline-block;
    margin-left: 0px;
    width: 100px;
    text-align: left
  }

  .body {
    width: 100%;
    /*height:200px*/
  }

  .header {
    text-align: center;
    margin: 0 auto;
    width: 100%;

  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 8px;
    width: 100%;
  }


  //// 修改
  .app-container {
    // background-color: #ffffff;
    overflow: hidden;
    height: 100%;
    padding-top: 0px;
  }

  // 左侧
  .el-col-9 {
    background-color: #fff;
    padding: 20px 30px;
    height: 100%;
    min-height: 845px;
    width: 37.5%;
  }

  // 右侧
  .el-col-15 {
    background-color: #fff;
    padding: 20px 30px;
    //   width: 65.26667%;
    width: 61%;
    margin-left: 1.5%;
    // height: 100%;
    min-height: 845px;
  }

  //设置按钮
  .el-button--mini {
    border-radius: 0;
  }

  //       .el-input {
  //     margin-bottom: 7px;
  // }
  .tree_box {
    padding: 0px;
    margin-top: 20px;
  }

  .table_box {
    padding: 60px 30px 30px 0;
  }

  /deep/ .tree_box {
    border: 1px solid #dcdfe6;
  }

  .btn_group {
    text-align: right;
    margin-bottom: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .el-form-item--medium .el-form-item__content {
    overflow: hidden;
  }

  .isNone {
    display: none;
  }

  .orgType {
    padding: 3px 5px;
    border: 1px solid $l-color-primary;
    display: inline-block;
    margin-left: 10px;
    border-radius: 4px;
    color: $l-color-primary;
    font-size: 10px;
    line-height: 10px;
    margin-right: 10px;
  }

  .el-form-item--medium {
    margin-bottom: 7px;
  }

  /deep/ .table_box {
    .el-input__inner {
      width: 300px;
    }
  }

  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
    display: block;
  }

  /deep/ .el-tree>.el-tree-node {
    //   height: 350px; //这里的高根据实际情况
    min-width: 100%;
    display: inline-block;
  }
</style>
