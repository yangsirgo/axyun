<template>
  <div class="dialog">
      <div class="width100 height100">
        <el-form ref="form" :model="addData" label-width="80px">
          <el-col class="elColStyle">
            <LFormtTitle label="床位编号" required>
              <el-form-item >
                <el-input
                  v-model="addData.bedCode"
                  style="width:100%"
                  placeholder="请输入床号"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
          </el-col>
        <!-- <el-col class="elColStyle">
          <LFormtTitle label="建床日期">
            <el-form-item >
                 <el-radio v-model="addData.nature" label="0">编制</el-radio>
                 <el-radio v-model="addData.nature" label="1">临时</el-radio>
               </el-form-item >
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="房间类型">
            <el-form-item >
                 <el-radio v-model="addData.roomType" label="0">一人间</el-radio>
                 <el-radio v-model="addData.roomType" label="1">二人间</el-radio>
                 <el-radio v-model="addData.roomType" label="2">三人间</el-radio>
               </el-form-item >
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="清洁状态">
            <el-form-item >
                 <el-radio v-model="addData.bedStatus" label="0">待清洁</el-radio>
                 <el-radio v-model="addData.bedStatus" label="1">清洁中</el-radio>
                 <el-radio v-model="addData.bedStatus" label="2">已清洁</el-radio>
                 <el-radio v-model="addData.bedStatus" label="3">不可用</el-radio>
               </el-form-item >
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="状态">
            <el-form-item >
                 <el-radio v-model="addData.status" label="1">在用</el-radio>
                 <el-radio v-model="addData.status" label="2">停用</el-radio>
            </el-form-item >
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="床位排序">
            <el-form-item >
              <el-input
                v-model="addData.sort"
                style="width:100%"
                placeholder="请输入数字"
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="科室">
            <el-form-item >
                <el-select v-model="deptId" placeholder="请选择" @change="deptIdFun">
                  <el-option
                    v-for="item in departmentInfo"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
                </el-form-item >
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="病区">
            <el-form-item >
                <el-select v-model="addData.wardCode" placeholder="请选择病区" >
                  <el-option
                    v-for="item in wardData"
                    :key="item.wardCode"
                    :label="item.wardName"
                    :value="item.wardCode"
                  ></el-option>
                </el-select>
            </el-form-item >
          </LFormtTitle>
        </el-col>

        <el-col class="elColStyle">
          <LFormtTitle label="备注">
            <el-form-item >
              <el-input
                v-model="addData.remark"
                style="width:100%"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col> -->
         </el-form>
      </div>



  </div>

</template>

<script>
  import { queryDept,ward } from '@/api/homeSickbeds/hsPatientManagement/hsPatientManagement';

export default {
  props: ["getListDataItem"],
  data() {
    return {
      query:'',
      hosId:'91',
      departmentInfo:[],
      deptLoading:false,
      deptId:'',
      // 病区
      wardData:[],
      addData:{
        nature:"0",//是否编制
        roomType:"0",//房间类型
        wardCode:'',//病区
        deptCode:'',//科室
        bedCode:"",//床位好
        bedStatus:"0",//0：待清洁 1：清洁中 2：已清洁 3：不可用Ps.有些医院会要求在床人出院后，处于在未清洁，等护士自己手动处理|
        status:"1",//1：在用2：停用
        sort:'',//床位排序
        remark:'',// 备注
        bedId: "",
        chargeMode: "",
        dataVersion: '',
        deletedStatus: "",
        hosId: "",
        hosName: "",
        orgId: "",
        roomCode: "",
        roomId: "",
        useStatus: "",
      }
    };
  },
  created() {
    this.queryDept();
    this.wardFun();
    console.log(this.getListDataItem,"返回数据你还是getListDataItem");
    this.addData = Object.assign({},this.addData,this.getListDataItem);
    this.deptId =  this.addData.deptCode.length == 0 ? '':parseInt(this.addData.deptCode);
  },
  mounted() {
    console.log(this.addData,"返回数据你还是");
  },
  methods: {
    // deptIdFun
    deptIdFun(){
      this.addData.deptCode = this.deptId;
      console.log(this.deptId);
    },
    empty(){
     this.addData ={
        nature:"0",//是否编制
        roomType:"0",//房间类型
        wardCode:'',//病区
        deptCode:'',//科室
        bedCode:'',//床位好
        bedStatus:"0",//0：待清洁 1：清洁中 2：已清洁 3：不可用Ps.有些医院会要求在床人出院后，处于在未清洁，等护士自己手动处理|
        status:"1",//1：在用2：停用
        sort:'',//床位排序
        remark:'',// 备注
        bedId: "",
        chargeMode: "",
        dataVersion: '',
        deletedStatus: "",
        hosId: "",
        hosName: "",
        orgId: "",
        roomCode: "",
        roomId: "",
        useStatus: "",
      }
      this.deptId = '';
    },
    // 查询科室 ward
    async queryDept() {
      try {
        this.deptLoading = true;
        let res = await queryDept({
          deptName: this.query
        });
        this.departmentInfo = [
          {
            deptId: "",
            deptName: "全部"
          }
        ];
        this.departmentInfo = this.departmentInfo.concat(res.data);
        this.deptLoading = false;
      } catch (error) {
        console.info(error);
        this.deptLoading = false;
        this.$message.error(error.msg || "查询科室报错");
      }
    },

    // 查询病区
    async wardFun() {
      try {
        this.deptLoading = true;
        let res = await ward({
          hosId: this.hosId
        });
        console.log("病区",res.data)
        this.wardData =  res.data;
        this.deptLoading = false;
      } catch (error) {
        console.info(error);
        this.deptLoading = false;
        this.$message.error(error.msg || "查询科室报错");
      }
    },
  },
  components: {},
  watch: {
    getListDataItem: {
      deep: true,
      handler(val) {

       this.addData = Object.assign({},this.addData,this.getListDataItem);
       this.deptId = this.addData.deptCode.length == 0 ? '':parseInt(this.addData.deptCode);
        console.log(this.addData,"返回数据你还是");
        //   if (val.length > 0){
        //       this.
        //   }
      }
    }
  }
};

</script>

<style lang="scss" scoped>
  .dialog{
    padding: 10px;
    height: auto;
    min-height:60px;
    .elColStyle{
      padding: 5px;
    }
    /deep/ .el-form-item__content{
      margin-left: 0px !important;
    }
  }
</style>
