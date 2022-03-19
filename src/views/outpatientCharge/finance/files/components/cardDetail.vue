<template>
  <div class="width100 height100">
    <el-card class="card-cont">
      <div class="width100 height100" v-if="isDisabled">
        <l-card-title>
          <template slot="left">卡片信息</template>
        </l-card-title>
        <div class="cards">
          <div v-for="(item, index) in cardList" :key="index"
               :class="{'card-item':true,'card-item-invaid':item.cardStatus==0?true:false}">
            <div class="top">
              <div class="title">{{getCardType(item.cardType)}}<i>{{item.cardStatus==0?'无效':'有效'}}</i></div>
              <div class="cardNum">{{item.cardData}}</div>
            </div>
            <div class="bottom">
              <div class="details">
                <div class="detail-item detail-item1">
                  <div class="detail-title">结算方式</div>
                  <div class="detail-cont">{{item.settlementType==1?'本地自费':'医保结算'}}</div>
                </div>
                <!--<div class="detail-item detail-item2">-->
                <!--<div class="detail-title">有效期至</div>-->
                <!--<div class="detail-cont">{{}}</div>-->
                <!--</div>-->
              </div>
              <div class="button" v-if="item.deletedStatus!=0">
                <el-button @click="del(item.cardId)">解绑</el-button>
              </div>
            </div>
          </div>
          <div class="card-add" @click="cardDisable=true">+ 绑定新卡</div>
        </div>
      </div>
    </el-card>

    <!--新建卡片-->
    <el-dialog title="绑定新卡"
               width="533px"
               :visible.sync="cardDisable"
               :close-on-click-modal="false"
    >
      <create-card
        @changeCardDisable="changeCardDisable"
        @cardSave="cardSave"
        :patientInfo="patientInfo"
      ></create-card>
    </el-dialog>
  </div>
</template>

<script>
  import createCard from '../components/createCard.vue';
  import {getArchCardListByPatientNum, delArchCard} from '@/api/arch/arch.js';

  export default {
    name: "cardDetail",
    components: {
      createCard
    },
    props: ['patientInfo', 'isAccountDetail', 'accountDisable'],
    data() {
      return {
        cardDisable: false,
        cardList: [],
        // loading: true
      }
    },
    computed: {
      isDisabled: function () {
        return this.accountDisable && this.isAccountDetail;
      }
    },
    watch: {
      patientInfo(newPatientInfo, oldPatientInfo) {
        this.getCard();
      }
    },
    async created() {
      // if (this.patientInfo && this.isAccountDetail) {
      //   await this.getCard();
      // }
    },
    methods: {
      /*获取卡片列表*/
      async getCard() {
        let cardData = await getArchCardListByPatientNum({
          patientNum: JSON.parse(this.patientInfo).patientNum
        });
        // this.loading = false;
        if (cardData.data) {
          this.cardList = cardData.data;
        } else {
          this.cardList = [];
        }

      },
      changeCardDisable(data) {
        this.cardDisable = data;
      },
      async cardSave(data) {
        this.cardDisable = data;
        await this.getCard();
      },
      async del(cardId) {
        this.$confirm('解除绑定后，此卡将不能使用，你还要继续吗？', '解除绑定', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          /*卡片解绑接口？*/
          let data = await delArchCard(
            cardId
          );
          if (data.code == 1) {
            this.$message({
              type: 'success',
              message: '卡片解绑成功!'
            });
            this.getCard();
          } else {
            this.$message({
              type: 'warning',
              message: data.msg
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          });
        });

      },
      /*获取卡类型*/
      getCardType(cardType) {
        if (cardType == 1) {
          return '身份证';
        } else if (cardType == 2) {
          return '医保卡';
        }
        return '就诊卡';
      }
    }
  }
</script>

<style scoped lang="scss">
  .card-cont {
    width: 100%;
    height: 100%;
    margin-right: 20px;
    padding: 0 20px;

    .cards {
      height: calc(100% - 63px);
      padding: 0 10px 20px 10px;
      overflow: auto;

      .card-item {
        width: calc(50% - 10px);
        height: 136px;
        padding: 15px 20px;
        margin-right: 10px;
        margin-top: 10px;
        border-radius: 2px;
        background: rgba(255, 242, 219, 1);
        float: left;

        .top {
          width: 100%;
          height: 24px;
          margin-bottom: 36px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(46, 50, 58, 1);
          line-height: 24px;

          .title {
            height: 24px;
            
            float: left;

            i {
              width: 30px;
              height: 18px;
              margin-left: 8px;
              background: rgba(255, 255, 255, 1);
              border-radius: 2px;
              font-style: normal;
              font-size: 12px;
              
              font-weight: 400;
              color: rgba(204, 161, 84, 1);
              line-height: 24px;
            }
          }

          .cardNum {
            height: 24px;
            
            float: right;
          }
        }

        .bottom {

          .details {
            .detail-item {
              float: left;

              .detail-title {
                height: 17px;
                font-size: 12px;
                
                font-weight: 400;
                color: rgba(204, 161, 84, 1);
                line-height: 17px;
              }

              .detail-cont {
                height: 20px;
                font-size: 14px;
                
                font-weight: 400;
                color: rgba(46, 50, 58, 1);
                line-height: 20px;
              }
            }

            .detail-item1 {
              margin-right: 20px;
              float: left;
            }
          }

          .button {
            float: right;

            button {
              width: 80px;
              height: 36px;
              border-radius: 2px;
              border: 1px solid rgba(247, 220, 172, 1);
              font-size: 14px;
              
              font-weight: 400;
              color: rgba(224, 141, 0, 1);
              /*line-height: 36px;*/
            }
          }
        }
      }

      .card-item.card-item-invaid {
        background: rgba(245, 245, 245, 1);

        .top {
          .title {
            color: rgba(148, 157, 163, 1);

            i {
              color: rgba(148, 157, 163, 1);
            }
          }

          .cardNum {
            color: rgba(148, 157, 163, 1);
          }
        }

        .bottom {
          .details {
            .detail-item {
              color: rgba(148, 157, 163, 1);

              .detail-title {
                color: rgba(148, 157, 163, 1);
              }

              .detail-cont {
                color: rgba(148, 157, 163, 1);
              }
            }

            .detail-item1 {
              color: rgba(148, 157, 163, 1);
            }
          }

          .button {
            button {
              color: rgba(148, 157, 163, 1);
            }
          }
        }
      }

      .card-add {
        width: calc(50% - 10px);
        height: 136px;
        margin: 10px 10px 0 0;
        border-radius: 2px;
        border: 1px solid rgba(207, 207, 207, 1);
        float: left;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(61, 125, 251, 1);
        line-height: 136px;
      }
    }
  }
</style>
