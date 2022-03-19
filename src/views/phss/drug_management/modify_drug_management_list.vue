<template>
  <div style="text-align: center;">
    <div style="font-size: 20px ">修改药品</div>
    <table border="1" cellspacing="0" style=" margin:auto; width:50%; ">
                    <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
      <tr style="height: 40px">
        <td style="width: 100px">药品编码</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugCode" placeholder="请输入内容" :disabled="(status=='modify'||status=='view')&&SysDrugManagerVO.drugCode!=''" :readonly="status=='view'" />
        </td>
        <td style="width: 100px">药品名称</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugName" placeholder="请输入内容" :disabled="status=='view'" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品拼音码</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugPinyin" placeholder="请输入内容" :disabled="status=='view'" />
        </td>
        <td style="width: 100px">药品简码</td>
        <td style="width: 100px">
          <el-input v-model="SysDrugManagerVO.drugJianxie" placeholder="请输入内容" :disabled="status=='view'" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品用法</td>
        <td style="width: 100px">
          <el-select placeholder="请选择药品用法" v-model="SysDrugManagerVO.drugFreqPropose" :disabled="status=='view'">
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
          <el-input v-model="SysDrugManagerVO.drugMedQtyPropose" placeholder="请输入内容" :disabled="status=='view'" />
        </td>
      </tr>
      <tr style="height: 40px">
        <td style="width: 100px">药品用量单位</td>
        <td style="width: 100px">
          <el-select placeholder="请选择药品单位" v-model="SysDrugManagerVO.drugUnitPropose" :disabled="status=='view'">
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
          <el-select placeholder="请选择药品类型" v-model="SysDrugManagerVO.drugType" :disabled="status=='view'">
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
          <el-select placeholder="请选择公卫类型" v-model="SysDrugManagerVO.publicType" :disabled="status=='view'">
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
    <div style="margin-top: 20px" v-if="status!='view'">
      <el-button>取消</el-button>
      <el-button @click="save()">保存</el-button>
    </div>
    <!--<el-form label-width="80px">-->
    <!--<el-form-item  >-->
    <!--<el-col :span="5">-->
    <!--<div style="display:inline-block;width:100px">药品编码</div>-->
    <!--<el-input style="width: 100px "></el-input>-->
    <!--</el-col>-->
    <!--<el-col :span="5">-->
    <!--<div style="display:inline-block;width:100px">药品名称</div>-->
    <!--<el-input style="width: 100px"></el-input>-->
    <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item  >-->
    <!--<el-col :span="5">-->
    <!--<div style="display:inline-block;width:100px">药品拼音码</div>-->
    <!--<el-input style="width: 100px"></el-input>-->
    <!--</el-col>-->
    <!--<el-col :span="5">-->
    <!--<div style="display:inline-block;width:100px">药品简码</div>-->
    <!--<el-input style="width: 100px"></el-input>-->
    <!--</el-col>-->
    <!--</el-form-item>-->

    <!--</el-form>-->
  </div>
</template>

<script>
  import { adaptiveHeight, saveHeaderHeight, getBasicDetail } from "@/utils/common";
  import { saveSysDrugManager, getBaseDrugData } from "@/api/phss/drug_management/drug_management";

  export default {
    name: "QueryList",
    components: {},
    data() {
      return {
        status: '',
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
        reqParams: {
          pageNo: 1,
          pageSize: 10
        },
        // 表格数据
        tableData: [{
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-06",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          }
        ],
        //--- Options ---
        // 人群类别选项
        crowdCategoryOptions: [{
            value: "1",
            label: "普通人群"
          },
          {
            value: "2",
            label: "高血压"
          },
          {
            value: "3",
            label: "糖尿病"
          },
          {
            value: "4",
            label: "老年人"
          },
          {
            value: "5",
            label: "儿童"
          },
          {
            value: "6",
            label: "孕产妇"
          },
          {
            value: "7",
            label: "结核病"
          },
          {
            value: "8",
            label: "精神病"
          },
          {
            value: "9",
            label: "贫困人群"
          },
          {
            value: "10",
            label: "低收入人群"
          }
        ]
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
    },
    mounted() {
      let json = getBasicDetail();
      console.info("jj", JSON.stringify(json));
      this.SysDrugManagerVO.createdByName = json.userName;

      // let hos = JSON.parse(json.hos);
      // let role = JSON.parse(json.role);
      // let userName = json.userName;
      // this.SysDrugManagerVO.hosName = hos.hosName;
      this.baseData({ "params": "231" });
      // saveHeaderHeight(this.$refs.header.offsetHeight);
      let params = this.$route.params;
      this.SysDrugManagerVO = params.row;
      this.status = params.status;
      console.info("编辑页面传过来的参数", JSON.stringify(params));
    },
    methods: {
      save() {
        saveSysDrugManager(this.SysDrugManagerVO).then(res => {
          if (res.code == "1") {
            this.$message.success("保存成功");
          }
          if (res.code == "0") {
            this.$message.error(res.msg);
          }



        }).catch(error => {
          console.log(error);
          this.$message.error(res.data);
        })
      },

      baseData(data) {
        this.data = [];
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
        saveHeaderHeight(143);
      },
      queryMethod() {
        console.log("查询queryMethod");
      },
      resetMethod() {
        console.log("重置resetMethod");
      },
      newMethod() {
        console.log("新建newMetho");

        this.$router.push({
          name: "referaladd",
          params: {
            status: this.params.status,
            id: "123"
          }
        });
      },
      refreshMethod() {
        console.log("刷新refreshMethod");
      },
      // --- 操作 ---
      handleView(index, row) {
        console.log("查看---", index, row);
      },
      handleEdit(index, row) {
        console.log("编辑---", index, row);
      },
      handleIntegrated(index, row) {
        console.log("综合管理---", index, row);
      },
      // 当某一行被双击时会触发该事件
      rowDblclick(row) {
        console.log("双击---", row);
      },
      handleReview(index, row) {
        console.log("复核---", index, row);
      },
      handleArchive(index, row) {
        console.log("封存---", index, row);
      },
      handleDelete(index, row) {
        console.log("删除---", index, row);

      },
      // --- 操作 ---
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  .QueryList {}
</style>