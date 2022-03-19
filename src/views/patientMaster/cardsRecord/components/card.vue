<template>
  <div class="card width100 height100" v-loading="loading">
    <div class="head">卡信息管理</div>
    <div class="content">
      <!--:class="{yellow:item.cardType=='1'&&item.used=='1',blue:item.cardName=='21'&&item.used=='1',gray:item.used=='0'}"-->
      <el-card
        class="one width100"
        :class="{yellow:item.cardStatus=='1',gray:item.cardStatus!='1'}"
        v-for="(item,index) in cardList"
        :key="index"
      >
        <!--<div class="one-left height100">-->
          <!--<el-checkbox v-model="item.checked"></el-checkbox>-->
        <!--</div>-->
        <div class="one-middle height100">
          <el-row class="middle-header">
            <div class="kind"><span :val="item.cardType" code="MARK_TYPE_CODE" v-codeTransform></span></div>
            <div class="isUsed"><span :val="item.used" code="cardStatus" v-codeTransform></span></div>
            <div class="number">{{item.cardNum || '--'}}</div>
          </el-row>
          <el-row  class="second">
            <el-col :span="4">
              <span>{{item.patientName || '--'}}</span>
            </el-col>
            <el-col :span="5" style="margin-right:5px">
              <span><span :val="item.sex" code="GENDER_CODE" v-codeTransform></span></span>
            </el-col>
            <el-col :span="3">
              <span>{{item.age || '--'}}</span>
            </el-col>
            <el-col :span="5">
              <span class="second-balance" v-if="item.cardName !== '21'">{{item.balance}}</span>
            </el-col>
          </el-row>
          <el-row class="third">
            <el-col :span="24">
              <span class="third-title">开卡时间</span>
              <span class="third-data">{{item.date || '--'}}</span>
            </el-col>
            <el-col :span="11">
              <!--   <span class="third-title">就诊科室</span>
                 <span class="third-department">{{item.department}}</span>-->
            </el-col>
          </el-row>
        </div>
        <div class="one-right height100">
          <div class="btn">
            <el-button class="fir-btn" type="primary" size="small" v-if="cardList.length > 1"
                       @click="unbundle(index,item)">解绑
            </el-button>
            <br/>
            <el-button type="primary" size="small" @click="forbidden(index,item)">{{item.cardStatus=='1'?'禁用':'启用'}}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class="footer">
      <div class="footer-l">
        <el-button size="small" @click="bind">绑卡</el-button>
      </div>
      <!--<div class="footer-r">-->
      <!--<el-button class="footer-l" size="small" @click="balanceCombine">余额合并</el-button>-->
      <!--<el-button class="blue" type="primary" size="small" @click="balanceCollect">余额汇总</el-button>-->
      <!--</div>-->
    </div>
    <!--新建卡片-->
    <el-dialog title="绑定新卡" width="533px" :visible.sync="cardDisable" :close-on-click-modal="false">
      <create-card
        @changeCardDisable="changeCardDisable"
        @cardSave="cardSave"
      ></create-card>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import createCard from "./createCard.vue";
  import {getArchCardListByPatientNum, disabledCard, enabledCard, deletedCard} from '@/api/arch/card.js';

  export default {
    name: "card",
    components: {
      createCard
    },
    data() {
      return {
        cardList: [],
        loading: false,
        //绑卡弹框显示
        cardDisable: false
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        async handler(n) {
          this.cardList = [];
          if (JSON.stringify(n) !== "{}" && n.patientId) {
            await this.getCardList();
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
    },
    methods: {
      //获取卡list
      async getCardList() {
        this.loading = true;
        try {
          //解绑接口
          let result = await getArchCardListByPatientNum(this.receivePatientData.patientId);

          console.log(result);

          this.cardList = [];
          let _self = this;
          if (result.code == 1) {

            result.data.forEach(function (item) {
              _self.cardList.push({
                cardId: item.cardId,
                cardType: item.cardType,
                cardNum: item.cardData,
                cardStatus: item.cardStatus,
                patientName: _self.receivePatientData.patientName,
                sex: _self.receivePatientData.patientGender,
                age: _self.receivePatientData.patientAge,
                used: item.cardStatus,
                date: item.cardTime,
                department: "",
                balance: "",
                checked: false

              })

            });
          } else {
            this.$message.error(result.message || "获取卡片列表请求失败");
          }
          //this.cardList = res.data;

          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "获取卡片列表请求失败");
        }
      },
      //解绑
      async unbundle(index, item) {
        this.loading = true;
        try {
          //解绑接口
          // debugger;
          let result = await deletedCard(item.cardId);

          if (result.code == 1) {
            this.$message.success("解绑成功");
          } else {

            if (result.msg && result.msg != '') {
              this.$message.error(result.msg);
            } else {
              this.$message.error("解绑失败");
            }
          }


          this.getCardList();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "标准错误提示");
        }
      },
      //禁用
      async forbidden(index, item) {
        this.loading = true;
        let result = {};
        try {
          console.log(item);
          //禁用接口

          if (item.cardStatus == 1) {
            result = await disabledCard(item.cardId);
            if (result.code == 1) {
              this.$message.success("禁用成功");
            } else {

              if (result.msg && result.msg != '') {
                this.$message.error(result.msg);
              } else {
                this.$message.error("禁用失败");
              }
            }
          } else {
            result = await enabledCard(item.cardId);
            if (result.code == 1) {
              this.$message.success("启用成功");
            } else {

              if (result.msg && result.msg != '') {
                this.$message.error(result.msg);
              } else {
                this.$message.error("启用失败");
              }
            }
          }
          this.getCardList();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || res);
        }
      },
      //余额合并
      async balanceCombine() {
        let cardList = [...this.cardList];
        let cardListNew = [];
        for (let index in cardList) {
          if (cardList[index].checked) {
            cardListNew.push(cardList[index]);
          }
        }
        this.loading = true;
        try {
          //合并接口
          // await balanceCombine(cardListNew);
          this.getCardList();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "标准错误提示");
        }
      },
      //余额汇总
      balanceCollect() {
        let cardList = [...this.cardList];
        let cardListNew = [];
        for (let index in cardList) {
          if (cardList[index].checked) {
            cardListNew.push(cardList[index]);
          }
        }
        this.loading = true;
        try {
          //汇总接口
          // await balanceCollect(cardListNew);
          this.getCardList();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.message || "标准错误提示");
        }
      },
      //绑卡
      bind() {
        this.cardDisable = true;
      },
      //子组件信息
      changeCardDisable(data) {
        this.cardDisable = data;
      },
      async cardSave(data) {
        this.cardDisable = data;
        await this.getCardList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    min-width: 430px;
    padding-top: 15px;
    padding-left: 15px;
    padding-bottom: 15px;
    padding-right: 10px;

    .head {
      height: 20px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
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
      width: 99%;
      @include l-center-horizontal;
      height: calc(100% - 85px);
      overflow-y: auto;

      .is-always-shadow {
        box-shadow: 0 0 0 0 transparent;
      }

      .one {
        height: 110px;
        margin-bottom: 20px;
        position: relative;

        &.yellow {
          background-color: #fff2db;

          .el-button {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(247, 220, 172, 1);
            color: #e08d00;
          }

          .one-right {
            border-left: 1px dashed #f7dcac;
          }
        }

        &.blue {
          background-color: #e4edff;

          .el-button {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(184, 208, 255, 1);
            color: #4a7bdc;
          }

          .one-right {
            border-left: 1px dashed #b8d0ff;
          }
        }

        .one-left {
          float: left;
          padding-top: 16px;
          padding-left: 10px;
        }

        .one-middle {
          padding: 15px 10px 15px 10px;
          float: left;
          width: calc(100% - 70px - 24px);

          .middle-header {
            position: relative;
            margin-bottom: 20px;

            div {
              float: left;
            }

            .kind {
              height: 17px;
              font-size: 16px;
              font-weight: bold;
              color: rgba(46, 50, 58, 1);
              line-height: 17px;
              margin-right: 5px;
            }

            .isUsed {
              position: relative;
              width: 34px;
              height: 17.5px;
              background: rgba(255, 255, 255, 1);
              border-radius: 2px;

              text-align: center;
              font-size: 12px;
              font-weight: 400;
              color: rgba(148, 157, 163, 1);
              line-height: 17.5px;
            }

            .number {
              float: right;
              font-size: 16px;
              font-weight: bold;
              color: rgba(46, 50, 58, 1);
            }
          }

          .second {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(46, 50, 58, 1);

            .second-balance {
              height: 14px;
              font-size: 14px;
              font-weight: bold;
              color: $l-color-primary;
            }
          }

          .third {
            .third-title {
              font-size: 14px;
              font-weight: 400;
              color: rgba(148, 157, 163, 1);
              margin-right: 5px;
            }

            .third-data {
              font-size: 14px;
              font-weight: 400;
              color: rgba(46, 50, 58, 1);
              margin-right: 5px;
            }

            .third-department {
              font-size: 14px;
              font-weight: 400;
              color: rgba(46, 50, 58, 1);
            }
          }
        }

        &.gray {
          background-color: $l-color-bgcolor-18;

          .one-middle {
            .middle-header {
              .kind {
                color: #949da3;
              }

              .isUsed {
                color: #949da3;
              }

              .number {
                color: #949da3;
              }
            }

            .second {
              color: #949da3;
            }

            .third {
              .third-title {
                color: #949da3;
              }

              .third-data {
                color: #949da3;
              }

              .third-department {
                color: #949da3;
              }
            }
          }

          .el-button {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(228, 228, 228, 1);
            color: #2e323a;
          }
        }

        .one-right {
          float: right;
          border-left: 1px dashed #e4e4e4;
          width: 70px;
          height: 100%;

          .btn {
            padding-top: 15px;
            padding-left: 10px;

            .fir-btn {
              margin-bottom: 5px;
            }

            .el-button {
              width: 50px;
              padding: 5px 0;
              text-align: center;
            }
          }
        }
      }
    }

    .footer {
      height: 50px;
      padding-top: 15px;
      border-top: 1px solid #e4e4e4;

      .footer-l {
        float: left;

        .el-button {
          border-radius: 2px;
          border: 1px solid $l-color-primary;
          color: $l-color-primary;
        }
      }

      .footer-r {
        float: right;

        .footer-l {
          border-radius: 2px;
          border: 1px solid $l-color-primary;
          color: $l-color-primary;
        }

        .blue {
        }
      }
    }
  }
</style>
