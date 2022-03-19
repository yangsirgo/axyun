<template>
  <div class="leftList">
    <el-tabs v-model="activeName">
      <el-tab-pane label="患者列表" name="first">

      </el-tab-pane>
      <el-tab-pane label="患者待办事项" name="second">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import {getArchList,getArchInfoByCardNum} from '@/api/arch/arch.js';
    export default {
        name: "leftList",
        data() {
            return {
                activeName: 'first',
                //查询条件
                searchData: {
                    condition: '',
                    hospital: '',
                    depart: '',
                    channel: '',
                    date: ''
                },
                //分页信息
                pageNo: 1,
                pageSize: 5,
                total: 0,
                load1: false,

                patientList: [],
                patientListUnit: [],
                tlm_noMore: false,
                tlm_isLoading: false,
                //l-value-domin中的code值
                selectCode: {
                    hospital: '',
                    depart: '',
                    channel: ''
                }
            }
        },
        computed: {
            totalPage() {
                return Math.ceil(this.total / this.pageSize);
            }
        },
        methods: {
            //获取病人列表
            async getPatientList(param) {
                //this.load1 = true;
                try {
                    //获取数据接口
                    let result = await getArchList(param);

                    console.log(result)
                    if(result.code == '1'){

                        this.patientListUnit = result.data;
                        this.total = result.total;
                    }
                   // this.load1 = false;
                } catch (error) {
                   // this.load1 = false;
                    this.$message.error(error.msg || "标准错误提示");
                }
            },
            search() {
                let param = {
                    ...this.searchData,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };
                this.getPatientList(param);
                this.patientList = this.patientListUnit;


                this.$emit('getPatientInfo', this.patientList[0]);
            },
            //读卡
            async readCard() {
                let param = {
                    cardId: this.searchData.condition,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };

                let result = await getArchInfoByCardNum({cardNum:this.searchData.condition});


                if(result.code == '1'&& result.data){

                    this.patientListUnit = [{

                        patientId: result.data.patientId,
                        patientName: result.data.patientName,
                        identificationType: result.data.createByCardType,
                        cardId: result.data.cardData,
                        createdDate: result.data.archCreateDate
                    }]
                    this.total = 1;
                }

                this.patientList = this.patientListUnit;
                console.log(this.patientList)

                if (this.patientList.length > 0) {
                    this.$emit('getPatientInfo', {
                        cardId: this.searchData.condition,
                        patientId: this.patientList[0].patientId
                    });
                } else {
                    this.$emit('getPatientInfo', {cardId: this.searchData.condition});
                }




            },

            reset() {
                this.searchData = {
                    condition: '',
                    hospital: '',
                    depart: '',
                    channel: '',
                    date: ''
                };
            },
            //滑动加载更多信息
            // load() {
            //     const _this = this;
            //     this.pageNo++;
            //     setTimeout(function () {
            //         let patientList = [..._this.patientList];
            //         //获取分页列表
            //         let param = {
            //             ..._this.searchData,
            //             pageNo: _this.pageNo,
            //             pageSize: _this.pageSize
            //         };
            //         _this.getPatientList(param);
            //         if (_this.pageNo >= _this.totalPage) {
            //             _this.tlm_noMore = true;
            //         }
            //         _this.patientList = [...patientList.concat(_this.patientListUnit)];
            //         _this.tlm_isLoading = false;
            //     }, 2000)
            // },
            //点击表格某一列
            rowClick(row) {
                this.$emit('getPatientInfo', row);
            }
        }
    }
</script>

<style scoped lang="scss">
  .leftList {
    .table-cont {
      margin-top: 20px;
    }
  }
</style>
