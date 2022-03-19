<template>
  <div>
    <div class="item" v-for="item in list">
      <div class="title">
        <span class="titleOn">{{item.title}}</span>
        <span class="util fr">
          <span v-if="item.state === 1" class="done">已审核</span>
          <span v-if="item.state === 0" class="noDone">未审核</span>
          <span v-else class="done">未提交审核</span>
        </span>
      </div>
      <div class="content">
        <div class="paragraph">
          <span v-for="sonItem in item.column" class="span-wrapper">
            <span class="label">{{sonItem.prop}}</span>
            <span class="value">{{sonItem.value}}</span>
          </span>
        </div>
        <div class="remarks">
          {{item.descriptions}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "treatmentTab",
    data() {
      return {
        list: [{
          title: '泌尿外科',
          state: '已审核',
          descriptions: '左输尿管镜检+钬激光碎石术',
          column: [{
            prop: '申请时间',
            value: '2019-08-02 18:12'
          }, {
            prop: '手术时长',
            value: '2019-08-02 18:12'
          }, {
            prop: '手术医生',
            value: '张爽'
          }]
        },{
          title: '泌尿外科',
          state: '已审核',
          descriptions: '左输尿管镜检+钬激光碎石术',
          column: [{
            prop: '申请时间',
            value: '2019-08-02 18:12'
          }, {
            prop: '手术时长',
            value: '2019-08-02 18:12'
          }, {
            prop: '手术医生',
            value: '张爽'
          }]
        }],

      }
    },
    components: {},
    methods: {}
  }
</script>

<style scoped lang="scss">
  .item {
    height: auto;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    .title {
      line-height: 34px;
      border-bottom: 1px solid rgba(228, 228, 228, 1);
      padding: 0 10px;
      > span {
        display: inline-block;
      }

      .titleOn {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }

      .util {
        .done {
          font-size: 14px;
          
          font-weight: 400;
          color: rgba(61, 125, 251, 1);
        }

        .noDone {
          font-size: 14px;
          
          font-weight: 400;
          color: $l-color-primary;
        }
      }
    }

    .content {
      padding: 10px;
      .paragraph,.remarks  {
        line-height: 24px;
      }
      .span-wrapper + .span-wrapper {
        margin-left: 20px;
      }

      .label {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(148, 157, 163, 1);
      }

      .value {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }
    }


  }

  .item + .item {
    margin-top: 10px;
  }
</style>
