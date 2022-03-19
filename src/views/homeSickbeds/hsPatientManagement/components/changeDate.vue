<template>
  <div class="dialog">
    <div class="width100 height100">
      <el-form ref="form" :model="submitData" label-width="80px">
        <el-col class="elColStyle">
          <LFormtTitle label="家床号">
            <el-form-item prop="bedId">
              <!-- <el-select v-model="submitData.manageDoctorId" filterable remote reserve-keyword placeholder="请输入医生名称"
                :remote-method="selectAllUser" :loading="selLoading" clearable>
                <el-option v-for="item in optionsDoctor" :key="item.uid" :label="item.uname" :value="item.uid"></el-option>
              </el-select> -->
              <el-select v-model="submitData.bedId" filterable placeholder="请选择空床位"
                :remote-method="getList" :loading="selLoading" clearable @change="newbedCode">
                <el-option v-for="item in emptBedsList" :key="item.bedId" :label="item.bedCode" :value="item.bedId" ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="责任医生">
            <el-form-item prop="manageDoctorId">
              <el-select v-model="submitData.manageDoctorId" filterable  placeholder="请输入医生名称"
                :remote-method="selectAllUser" :loading="selLoading" clearable>
                <el-option v-for="item in optionsDoctor" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col class="elColStyle">
          <LFormtTitle label="责任护士">
            <el-form-item prop="manageNurseId">
              <el-select v-model="submitData.manageNurseId" filterable  placeholder="请输入护士名称"
                :remote-method="nurseList" :loading="selLoading" clearable>
                <el-option v-for="item in optionsNurse" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>

       <!-- <el-col class="elColStyle">
          <el-button type="primary" @click="undoFun"> 撤 销 </el-button>
        </el-col> -->
      </el-form>
    </div>



  </div>

</template>

<script>
  import {
    updatePatient,
    getList
  } from '@/api/homeSickbeds/hsPatientManagement/hsPatientManagement';
  import {nurseList, doctorList} from "@/api/ipnw/etHospital";
  import { getIsTenant, getPamars } from "@/utils/auth";
  import { canBeUseDoctorAndNurseList } from "@/api/ipnw/etHospital.js";
import store from "@/store";
  export default {
    props: ["changeDate"],
    data() {
      return {
        optionsDoctor:[],
        optionsNurse:[],
        emptBedsList:[],
        selLoading:false,
        submitData: {
          finAdId: this.changeDate.changeDate.finAdId,
          bedId:this.changeDate.changeDate.bedId,
          bedCode:'',
          manageDoctorId:this.changeDate.changeDate.manageDoctorId,
          manageNurseId:this.changeDate.changeDate.manageNurseId,
        },
        rules:{
          bedId:[{ required: true, message: '请输入  ', trigger: 'blur'}],
          manageDoctorId:[{ required: true, message: '请输入  ', trigger: 'blur'}],
          manageNurseId:[{ required: true, message: '请输入  ', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.hosId = JSON.parse(getPamars()).hosId;
    },
    mounted() {
      console.log(this.changeDate, "改变的数值");
      this.selectAllUser();
      this.nurseList();
      this.getList();
    },
    methods: {
      // 撤销校验
      undoFun() {

      },
      newbedCode(value){
        this.submitData.bedId = value;
         for(let i=0; i<this.emptBedsList.length;i++){
           if(value == this.emptBedsList[i].bedId){
             this.submitData.bedCode = this.emptBedsList[i].bedCode;
             break;
           }
         }
          console.log(this.submitData.bedCode);
      },
      // 查询的空床位的的列表
      async getList() {
        this.emptBedsList = [];
        try {
          let res = await getList({type:'2'});
          console.log(res, "床位列表")
          if (res.code == '1') {
            this.emptBedsList = res.data;
            this.emptBedsList.push({
              bedCode: this.changeDate.changeDate.bedCode,
              bedId: this.changeDate.changeDate.bedId
            });

          }
        } catch (error) {}


      },
      emptyFun(){
         this.submitData = {
           finAdId: "",
           manageDoctorId:'',
           manageNurseId:'',
         };
         this.changeDate = {};
      },
      async selectAllUser(val) {
        this.optionsDoctor = [];
        try {
          this.selLoading = true;
		  // store.user.state.role.deptId
          let res = await canBeUseDoctorAndNurseList({hosId:this.hosId,utype:'1'});
          this.optionsDoctor = res.data;
          this.selLoading = false;
          let optionsDoctorList = this.optionsDoctor.map(item=>item.id)
          if(optionsDoctorList.indexOf(this.submitData.manageDoctorId) == -1){
            this.submitData.manageDoctorId = '--'
          }
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "搜索用户失败");
        }
      },
      async nurseList(val) {
        this.optionsNurse = [];
        try {
          this.selLoading = true;
          // store.user.state.role.deptId
          let res = await canBeUseDoctorAndNurseList({hosId:this.hosId,utype:'7'});
          this.optionsNurse = res.data;
          this.selLoading = false;
          let optionsNurseList = this.optionsNurse.map(item=>item.id)
          if(optionsNurseList.indexOf(this.submitData.manageNurseId) == -1){
            this.submitData.manageNurseId = '--'
          }
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "搜索用户失败");
        }
      },

    },
    components: {},
    watch: {

      changeDate: {
        deep: true,
        handler(val) {
          console.log(this.changeDate, "改变的数值");
          // this.emptBedsList = this.changeDate.emptBedsList;
        }
      },

    }
  };
</script>

<style lang="scss" scoped>
  .dialog {
    padding: 10px;
    min-height: 300px;
    .elColStyle {
      padding: 5px;
    }

    /deep/ .el-form-item__content {
      margin-left: 0px !important;
    }
    /deep/ .el-select--medium{
      width: 100%;
    }
  }
</style>
