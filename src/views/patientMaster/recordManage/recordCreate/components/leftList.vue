<template>
  <div class="leftList">
    <el-tabs v-model="activeName">
      <el-tab-pane label="患者列表" name="first" v-load="load1">
        <el-row>
          <el-input placeholder="请输入内容" v-model="searchData.condition">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-button type="primary" class="duka-button" style="width:100%" @click="readCard"><i
            class="iconfont iconduka"></i>读卡
          </el-button>
        </el-row>
        <el-row style="margin-top: 10px">
          <LFormtTitle label="院区">
            <l-value-domain
              :code="selectCode.hospital"
              :value.sync="searchData.hospital"
              class="select-container"
              :placeholder="$t('base.placeholder')"
            ></l-value-domain>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-top: 10px">
          <LFormtTitle label="科室">
            <l-value-domain
              :code="selectCode.depart"
              :value.sync="searchData.depart"
              class="select-container"
              :placeholder="$t('base.placeholder')"
            ></l-value-domain>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-top: 10px">
          <LFormtTitle label="渠道">
            <l-value-domain
              :code="selectCode.channel"
              :value.sync="searchData.channel"
              class="select-container"
              :placeholder="$t('base.placeholder')"
            ></l-value-domain>
          </LFormtTitle>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-date-picker
            v-model="searchData.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%">
          </el-date-picker>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="20">
          <el-col :span="12">
            <el-button class="primary-button" @click="search">搜索</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" plain @click="reset">重置</el-button>
          </el-col>
        </el-row>
        <div class="table-cont">
          <el-table
            class="border-none"
            :data="patientList"
            border
            stripe
            width="100%"
            height="200px"
            v-loadmore="load"
            v-loading="tlm_isLoading"
            highlight-current-row
            @row-click="rowClick"
          >
            <el-table-column
              v-for="(item,index) in patientListParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'identificationType'">
                  <span :val="scope.row[item.prop]" code="identificationType" v-codeTransform></span>

                </div>
                <div v-else>
                  <span>{{scope.row[item.prop]}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待办事项" name="second"></el-tab-pane>
      <el-tab-pane label="个人备忘" name="third"></el-tab-pane>
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
                patientListParams: [
                    {
                        prop: "patientName",
                        label: "患者姓名",
                        align: "left",
                        width: "80",
                        fixed: "left"
                    }, {
                        prop: "identificationType",
                        label: "介质类型",
                        align: "left",
                        width: "80",
                        fixed: "left"
                    }, {
                        prop: "createdDate",
                        label: "建档时间",
                        align: "left",
                        width: "110",
                        fixed: "left"
                    }
                ],
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
            load() {
                const _this = this;
                this.pageNo++;
                setTimeout(function () {
                    let patientList = [..._this.patientList];
                    //获取分页列表
                    let param = {
                        ..._this.searchData,
                        pageNo: _this.pageNo,
                        pageSize: _this.pageSize
                    };
                    _this.getPatientList(param);
                    if (_this.pageNo >= _this.totalPage) {
                        _this.tlm_noMore = true;
                    }
                    _this.patientList = [...patientList.concat(_this.patientListUnit)];
                    _this.tlm_isLoading = false;
                }, 2000)
            },
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
