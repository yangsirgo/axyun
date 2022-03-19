<template>
  <div class="container clearfix" ref="page">
    <div class="left">
      <left :patientInfo="patientInfo" :accountDisable="accountDisable"></left>
    </div>
    <div class="center">
      <div class="top">
        <list @changeAccountDisable="changeAccountDisable"></list>
      </div>
      <div class="clearfix bottom">
        <div class="account-detail">
          <account-detail :patientInfo="patientInfo" @getAccountDetail="getAccountDetail"
                          :accountDisable="accountDisable"></account-detail>
        </div>
        <div class="card-detail">
          <card-detail :patientInfo="patientInfo" :isAccountDetail="isAccountDetail" :accountDisable="accountDisable"></card-detail>
        </div>
      </div>
    </div>
    <div class="right">
      <right :patientInfo="patientInfo" :accountDisable="accountDisable"></right>
    </div>
  </div>
</template>
<script>
  import adHeight from "@/mixins/adHeight";
  import list from './components/list.vue';
  import accountDetail from './components/accountDetail.vue';
  import cardDetail from './components/cardDetail.vue';
  import left from './components/left.vue';
  import right from './components/right.vue';

  export default {
    components: {
      list,
      accountDetail,
      cardDetail,
      left,
      right
    },
    name: "Files",
    mixins: [adHeight],
    data() {
      return {
        accountDisable: false,
        patientInfo: {},
        isAccountDetail: false//账户信息是否更新完
      }
    },
    methods: {
      changeAccountDisable(data) {
        this.accountDisable = data.accountDisable;
        this.patientInfo = data.patientInfo;
      },
      //账户信息是否更新完
      getAccountDetail(data) {
        this.isAccountDetail = data;
      }
    }
  }
</script>
<style scoped lang="scss">
  .container {
    .left {
      width: 292px;
      height: 100%;
      float: left;
    }

    .center {
      width: calc(100% - 580px);
      height: 100%;
      margin: 0 20px;
      float: left;

      .top {
        height: 44%;
      }

      .bottom {
        height: calc(56% - 20px);
        margin-top: 20px;

        .account-detail {
          width: calc(50% - 10px);
          height: 100%;
          float: left;
        }

        .card-detail {
          width: calc(50% - 10px);
          margin-left: 20px;
          height: 100%;
          float: right;
        }

      }
    }

    .right {
      width: 248px;
      height: 100%;
      float: left;
    }
  }

</style>
