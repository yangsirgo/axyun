<template>
  <div style="text-align: center;">
    <!-- <div style="font-size: 20px ">新增药品</div> -->
    <table border="1" cellspacing="0" style=" margin:auto; width:50%; ">
                    <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
      <tr style="height: 40px">
        <td style="width: 100px">药品编码*</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugCode" :readonly="this.status == 'view' ? true:false" placeholder="请输入内容" />
        </td>
        <td style="width: 100px">药品名称*</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugName" :readonly="this.status == 'view' ? true:false" placeholder="请输入内容" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品拼音码</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugPinyin" :readonly="this.status == 'view' ? true:false" placeholder="请输入内容" />
        </td>
        <td style="width: 100px">药品简码</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugJianxie" :readonly="this.status == 'view' ? true:false" placeholder="请输入内容" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品用法</td>
        <td style="width: 100px">
          <el-select placeholder="请选择药品用法" v-model="SysDrugManagerVO.drugFreqPropose" :disabled="this.status == 'view' ? true:false">
            <el-option v-for="item in this.drugFreqProposes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
            <!--<el-option value="">每日1次</el-option>-->
            <!--<el-option value="">每日2次</el-option>-->
            <!--<el-option value="">每日3次</el-option>-->
            <!--<el-option value="">每日4次</el-option>-->
          </el-select>
        </td>
        <td style="width: 100px">药品用量</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugMedQtyPropose" onkeyup="value=value.replace(/[^\d]/g,'')" :readonly="this.status == 'view' ? true:false"  placeholder="请输入数字" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品用量单位</td>
        <td style="width: 100px">
          <el-select placeholder="请选择药品单位" v-model="SysDrugManagerVO.drugUnitPropose" :disabled="this.status == 'view' ? true:false">
            <el-option v-for="item in this.drugUnitProposes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>

            <!--<el-option value="">片</el-option>-->
            <!--<el-option value="">mg</el-option>-->
            <!--<el-option value="">粒</el-option>-->
            <!--<el-option value="">瓶</el-option>-->
          </el-select>
        </td>
        <td style="width: 100px">药品类型</td>
        <td style="width: 100px">
          <el-select placeholder="请选择药品类型" v-model="SysDrugManagerVO.drugType" :disabled="this.status == 'view' ? true:false">
            <el-option v-for="item in this.drugTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
            <!--<el-option value="">中药</el-option>-->
            <!--<el-option value="">中成药</el-option>-->
            <!--<el-option value="">西药</el-option>-->
          </el-select>
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">公卫类型</td>
        <td style="width: 100px">
          <el-select placeholder="请选择公卫类型" v-model="SysDrugManagerVO.publicType" :disabled="this.status == 'view' ? true:false">
            <el-option v-for="item in this.publicTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
            <!--<el-option value="">高血压</el-option>-->
            <!--<el-option value="">糖尿病</el-option>-->
            <!--<el-option value="">健康体检</el-option>-->
          </el-select>
        </td>
        <td style="width: 100px">创建人</td>
        <td style="width: 100px">{{this.SysDrugManagerVO.createdByName}}</td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">创建机构</td>
        <td style="width: 100px">{{this.SysDrugManagerVO.hosName}}</td>
        <td style="width: 100px"></td>
        <td style="width: 100px"></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import {
    adaptiveHeight,
    saveHeaderHeight,
    getBasicDetail
  } from "@/utils/common";
  import {
    saveSysDrugManager,
    getBaseDrugData
  } from "@/api/phss/drug_management/drug_management";

  export default {
     name: "addDrugPage",
    components: {},
    props: ["data"],
    data() {
      return {
        datalist: this.data,
        drugFreqProposes: [],
        drugUnitProposes: [],
        publicTypes: [],
        drugTypes: [],
        SysDrugManagerVO: {
          id: '',
          drugCode: '',
          drugName: '',
          drugPinyin: '',
          drugJianxie: '',
          drugUsagePropose: '',
          drugUnitPropose: '',
          drugFreqPropose: '',
          drugMedQtyPropose: '',
          drugType: '',
          publicType: '',
          createdBy: '',
          createdByName: '',
          createdAt: '',
          updatedBy: '',
          updatedByName: '',
          updatedAt: '',
          deletedStatus: '',
          hosId: '',
          hosName: ''
        },
        boxshow: false,
        input: "",
        total: 0,
        status: '',
        reqParams: {
          pageNo: 1,
          pageSize: 20
        },
        // 表格数据
        tableData: []
        //--- Options ---

      };
    },
    computed: {
      mainHeight() {
        console.log("adaptiveHeight()", adaptiveHeight());
        return adaptiveHeight();
      }
    },
    created() {
      saveHeaderHeight(143);
      this.status = this.data.status;
      console.log(this.data.status)
      console.log(this.data.rowData)
    },
    mounted() {
      let json = getBasicDetail();
      console.info("jj", JSON.stringify(json));
      this.SysDrugManagerVO.createdByName = json.userName;
      let hos = JSON.parse(json.hos);
      // let role = JSON.parse(json.role);
      // let userName = json.userName;
      this.SysDrugManagerVO.hosName = hos.hosName;
      if(this.datalist.status == 'view'){

            for (let obj in this.SysDrugManagerVO) {
              this.SysDrugManagerVO[obj] = this.datalist.rowData[obj];
            }
      }
      if(this.datalist.status == "modify"){
          for (let obj in this.SysDrugManagerVO) {
            this.SysDrugManagerVO[obj] = this.datalist.rowData[obj];
          }
      }
      this.baseData({
        "params": "231"
      });
      // saveHeaderHeight(this.$refs.header.offsetHeight);
    },
    methods: {
      save() {
         this.$emit("saveMethod",this.SysDrugManagerVO);

      },
      baseData(data) {
        this.datalist = [];
        getBaseDrugData(data)
          .then(res => {
            console.info("节点", JSON.stringify(res.data))
            this.drugFreqProposes = res.data.drug_freq_proposes;
            this.drugUnitProposes = res.data.drug_unit_proposes;
            this.publicTypes = res.data.public_types;
            this.drugTypes = res.data.drug_types;
          }).catch(error => {
            console.log(error);
          });
      },
      expandCollapse() {
        this.boxshow = !this.boxshow;
        // this.boxshow ? saveHeaderHeight(143) : saveHeaderHeight(143);
        saveHeaderHeight(143)
      }
    },
    watch: {}
  };
</script>
<style lang="scss" scoped>
  // .QueryList {}
</style>
