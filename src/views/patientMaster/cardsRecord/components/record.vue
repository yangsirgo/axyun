<template>
  <div class="record width100 height100" v-loading="loading">
    <div class="head">档案信息合并</div>
    <div class="content width100">
      <el-card :class="{'one':true,'width100':true,'selectColor':selectIndex == index}"
               v-for="(item,index) in cardList" :key="index"
      >
        <div class="width100 height100" @click="recordItemClick(item,index)">
          <div class="select height100">
            <el-checkbox v-model="item.checked"></el-checkbox>
          </div>
          <div class="model height100">
            <el-row class="row fir">
              <el-col :span="5">
                <div>{{item.patientName|| '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div><span :val="item.sex" code="GENDER_CODE" v-codeTransform></span></div>
              </el-col>
              <el-col :span="3">
                <div>{{item.similarity ?`${item.similarity}%` : ''}}</div>
              </el-col>
              <el-col :span="4">
                <div>{{item.age|| ''}}</div>
              </el-col>
            </el-row>
            <el-row class="row sec">
              <el-col :span="14">
                <span class="row-title">身份证</span>
                <span class="row-data">{{item.idCard|| '--'}}</span>
              </el-col>
              <el-col :span="10">
                <span class="row-title">手机号</span>
                <span class="row-data">{{item.phoneNum|| '--'}}</span>
              </el-col>
            </el-row>
            <el-row class="row third">
              <el-col :span="16">
                <span class="row-title">家庭住址</span>
                <span class="row-data">{{item.address|| '--'}}</span>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="16">
                <span class="row-title">患者编号</span>
                <span class="row-data blod">{{item.patientIndex|| '--'}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="right height100">
            <el-button v-if="false" type="primary" size="small" @click="unbindContact(index,item)">解绑关联</el-button>
          </div>
        </div>

      </el-card>
    </div>
    <div class="footer width100">
      <div class="footer-r">
        <!-- <el-button class="footer-l" size="small" @click="backout">撤销操作</el-button>-->
        <el-button class="blue" type="primary" size="small" @click="recordCombine" :disabled="cardList.length == 0">
          档案合并
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {patientSilimarList, merger} from '@/api/arch/arch';

  export default {
    data() {
      return {
        //相似档案列表
        cardList: [],
        loading: false,
        //档案选中index
        selectIndex: 0
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        async handler(n) {
          this.cardList = [];
          if (JSON.stringify(n) !== "{}") {
            if (n.patientId) {
              await this.getCardList();
              await this.changeRecordData(this.cardList[0]);
            } else {
              this.cardList = [];
              this.$message("该患者未建档，请开始建档");
              this.$router.push('/patientMaster/recordCreate');
            }
          } else {
            this.cardList = [];
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
    },
    methods: {
      ...mapActions({
        changeRecordData: 'patientMaster/changeRecordData'
      }),
      //获取相似档案
      async getCardList() {
        this.loading = true;
        let _self = this;
        this.cardList = [];
        try {
          //解绑接口
          let result = await patientSilimarList({

            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            birthDate: this.receivePatientData.birthDate,
            identificationNum: this.receivePatientData.identificationNum,
            mobileNum: this.receivePatientData.mobileNum


          });
          console.log(result);


          if (result.code == '1') {

            result.data.forEach(function (item) {
              _self.cardList.push({
                ...item,
                patientName: item.patientName,
                sex: item.patientGender,
                age: item.patientAge,
                idCard: item.identificationNum,
                phoneNum: item.mobileNum,
                city: item.addrCity,
                addrDistrict: item.addrDistrict,
                addrProvince: item.addrProvince,
                address: item.detailAddr,
                patientIndex: item.patientCode,
                patientId: item.patientId,
                checked: item.bindingStatus == '1' ? true : false,
                hosId: item.hosId,
                createdAt: item.createdAt,
                createdByName: item.createdByName,
                chronicStatus: item.chronicStatus
              })

            });
            this.selectIndex = 0;
          } else {
            this.$message.error(result.message || "获取相似档案列表失败");

          }

          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "获取相似档案列表失败");
        }
      },
      //解除关联
      unbindContact(index, item) {
        this.loading = true;
        try {
          //解绑接口
          //let result =  await unbindContact(item);
          // if(result.code == 1){
          //   this.getCardList();
          // }else{
          //   this.$message.error(result.message || "解除关联失败");
          // }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "解除关联失败");
        }
      },
      //撤销
      backout() {
        let cardList = [...this.cardList];
        let patientIndex = [];
        let mergerData = {};
        for (let index in cardList) {
          if (cardList[index].checked) {
            patientIndex.push(cardList[index].patientId);
          }
        }
        mergerData["mainId"] = this.receivePatientData.patientid;
        mergerData["fuIds"] = patientIndex;

        this.loading = true;
        try {
          console.log(mergerData);
          //撤销接口
          // await balanceCombine(cardListNew);
          // this.getCardList();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "撤销失败");
        }
      },
      //档案合并
      recordCombine() {
        this.$confirm('确定合并档案吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let cardList = [...this.cardList];
          let cardListNew = [];
          let mergerData = {};
          for (let index in cardList) {
            if (cardList[index].checked) {
              cardListNew.push(cardList[index].patientId);
            }
          }
          mergerData["mainId"] = this.receivePatientData.patientId;
          mergerData["fuIds"] = cardListNew;
          if (cardListNew.length <= 0) {
            this.$message.error('合并档案个数不能小于1');
          } else {
            this.loading = true;
            try {
              //合并接口
              // await recordCombine(cardListNew);
              //this.getCardList();
              let reslut = await merger(mergerData);
              if (reslut.code == 1) {

                this.$message.success("合并档案成功");
                // this.getCardList();
                //获取左侧列表信息
                await this.$emit('changeParam', true);
              } else {

                this.$message.error(reslut.msg || '合并档案失败');
              }

              console.log(mergerData);
              this.loading = false;
            } catch (error) {
              this.loading = false;
              this.$message.error(error.message || "合并档案失败");
            }
          }
        });
      },
      //点击档案事件
      recordItemClick(item, index) {
        this.selectIndex = index;
        this.changeRecordData(item);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .record {
    position: relative;
    padding-top: 15px;
    padding-left: 10px;
    padding-bottom: 15px;
    padding-right: 5px;

    .head {
      height: 20px;
      font-size: 16px;
      font-weight: bold;
      color: $l-color-fontcolor-3;
      line-height: 20px;
      margin-bottom: 15px;

      &::before {
        content: "";
        float: left;
        width: 4px;
        height: 20px;
        background: $l-color-primary;
        margin-right: 10px;
      }
    }

    .content {
      @include l-center-horizontal;
      height: calc(100% - 85px);
      overflow-y: auto;

      .is-always-shadow {
        box-shadow: 0 0 0 0 transparent;
      }

      .one {
        height: 136px;
        padding: 15px 5px;
        margin-bottom: 15px;
        position: relative;
        background-color: $l-color-bgcolor-18;

        .select {
          float: left;
          width: 20px;
          padding-top: 6px;
        }

        .model {
          float: left;
          width: calc(100% - 90px);

          .row {
            margin-bottom: 10px;

            .row-title {
              font-size: 14px;
              font-weight: 400;
              color: $l-color-fontcolor-4;
            }
          }

          .fir {
            font-weight: bold;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
          }

          .third {
            font-size: 14px;
            font-weight: 400;
            color: $l-color-fontcolor-3;
          }

          .blod {
            font-weight: bold;
          }
        }

        .right {
          width: 70px;
          float: right;

          .el-button {
            width: 70px;
            text-align: center;
            padding: 5px 0;
            background: $l-color-white;
            border: 1px solid $l-color-bgcolor-11;
            height: 30px;
            font-size: 14px;
            font-weight: 400;
            color: $l-color-fontcolor-3;
          }
        }
      }

      .selectColor {
        background-color: $l-color-bgcolor-10;
      }
    }

    .footer {
      height: 50px;
      padding-top: 15px;
      border-top: 1px solid $l-color-bgcolor-11;
      padding-right: 5px;

      .footer-r {
        float: right;
      }

      .footer-l {
        border-radius: 2px;
        border: 1px solid $l-color-primary;
        color: $l-color-primary;
      }
    }
  }
</style>
