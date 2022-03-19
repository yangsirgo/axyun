<template>
  <div class="jingdi">
    <div class="title">静滴</div>
    <div class="content">
      <div class="top clearfix">
        <div class="left">
          <div>病区: <i></i></div>
          <div>姓名: <i></i></div>
          <div>床号: <i></i></div>
        </div>
        <div class="right">
          <div>住院号: <i></i></div>
          <div>性别: <i></i></div>
          <div>年龄: <i></i></div>
        </div>
      </div>
      <div class="middle">
        <div>
          <span class="drug">低分子量肝素钠注射液</span>
          <span class="quantity">5000IU</span>
        </div>
      </div>
      <div class="bottom clearfix">
        <div class="left-info">
          <div class="left-info1">日期: <i>2019年8月8日 20:14</i></div>
          <div class="left-info2">
            <div>用法: <i></i></div>
            <div>频次: <i></i></div>
          </div>
          <div class="left-info3">
            <div>核对者: <i></i></div>
            <div>执行者: <i></i></div>
          </div>
        </div>
        <div class="right-img"></div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "jingdi"
    }
</script>

<style scoped lang="scss">
  i {
    font-style: normal;
  }
  .jingdi {
    width: 370px;
    margin: 20px auto;
    padding: 10px;
    background-color: #fff;

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }

    .content {
      .top {
        padding: 10px;
        border-bottom: 1px solid #000;

        .left {
          width: 50%;
          float: left;
        }

        .right {
          width: 50%;
          float: right;
        }
      }

      .middle {
        padding: 10px;
        height: 200px;
        border-bottom: 1px solid #000;
        .drug {
          float: left;
        }

        .quantity {
          float: right;
        }
      }

      .bottom {
        padding: 10px;
        .left-info {
          width: 60%;
          height: 65px;
          float: left;
          .left-info1 {
            font-size: 16px;
            font-weight: bold;
          }

          .left-info2 div, .left-info3 div {
            width: 50%;
            float: left;
          }
        }
        .right-img {
          width: calc(40% - 20px);
          height: 65px;
          border: 1px solid #ccc;
          float: right;
        }
      }
    }
  }
</style>
