<template>
  <div class="list">
    <div class="list-top">
      <!--患者列表筛选标签-->
      <div class="top-item2">
        <span class="cont" v-for="(item, i) in labelList" :key="item.id">
          <span>{{item.type}}</span>
          <el-button v-for="(it, index) in item.list" :key="index" :class="it.isSelect?'button isactive':'button'" @click="handle_selectLabel(it)">{{it.name}} {{it.num}}</el-button>
        </span>
      </div>
    </div>
    <!--患者列表-->
    <div class="list-center">
      <!--<div class="head">-->
        <!--<div>卡片信息</div>-->
        <!--<div class="head-before"></div>-->
      <!--</div>-->
      <div class="lists">
        <!--患者列表-->
        <div class="infinite-list-wrapper">
          <div class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
            <div v-for="(item, index) in patientList" :key="index" @click="handle_selectPatient(index)" :class="index == currentPatient?'lists-item clearfix active':'lists-item clearfix'">
              <div>
                <span class="label" v-if="item.isNew">
                  新入
                </span>
                <div class="item item1">
                  <i>{{item.bedNum | repair}} </i>床
                </div>
                <div class="item item2">
                  <i class="number" style="margin-right:10px">00015257</i><i style="margin-right:20px">{{item.name}}</i><i
                  style="margin-right:20px">{{item.gender}}</i><i>{{item.age}}岁</i>
                </div>
                <div class="item item3">
                  <el-row class="item-row">
                    <span>主治医生<i>{{item.doctorName}}</i></span>
                    <span>主管护师<i>{{item.executiveNurse}}</i></span>
                    <span>责任护师<i>{{item.responsibilityNurse}}</i></span>
                    <span>入院时间<i>{{item.inDate + ' (' + item.dayNum + '天)'}}</i></span>
                  </el-row>
                  <el-row class="item-row"><span><i style="margin-left: 0">肾结石</i></span></el-row>
                </div>
                <div class="item item6 cursor-pointer" @click.stop="collection(item)">
                  <svg v-if="item.collection" t="1567059187730" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4150" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#FFD2C2" p-id="4151"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#F05A23" p-id="4152"></path></svg>
                  <svg v-else t="1567059500759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4262" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#F5F5F5" p-id="4263"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#C5CBCF" p-id="4264"></path></svg>
                </div>
                <div class="item item5">
                  <i class="te">特</i>
                  <i class="pushi">普食</i>
                </div>
                <div class="item item4" v-if="item.childrenNum > 0">
                  <span v-for="it in item.childrenNum">
                    <i class="iconfont iconyinger" style="margin-left: 5px;"></i>
                  </span>
                </div>
              </div>
            </div>
            <p v-if="loading" class="bottom-container">加载中...</p>
            <p v-if="noMore" class="bottom-container">没有更多了</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "patientsList",
    data() {
      return {
        loading: false, // 滑动加载状态
        noMore: false, // 滑动无数据时状态
        labelList: [ // 患者列表 标签筛选
          {
            type: "病情",
            id: 'a001',
            list: [
              {
                name: '正常',
                isSelect: false, // 当前属性是否被选中
                num: 2
              },
              {
                name: '重',
                isSelect: false,
                num: 0
              },
              {
                name: '危',
                isSelect: false,
                num: 0
              }
            ]
          },
          {
            type: "护理",
            id: 'a002',
            list: [
              {
                name: '一级',
                isSelect: false, // 当前属性是否被选中
                num: 2
              },
              {
                name: '二级',
                isSelect: false,
                num: 0
              },
              {
                name: '三级',
                isSelect: false,
                num: 0
              },
              {
                name: '特级',
                isSelect: false,
                num: 0
              }
            ]
          },
          {
            type: "床位",
            id: 'a002',
            list: [
              {
                name: '加床',
                isSelect: false, // 当前属性是否被选中
                num: 2
              },
              {
                name: '空床',
                isSelect: false,
                num: 0
              },
              {
                name: '占床',
                isSelect: false,
                num: 0
              }
            ]
          }
        ],
        currentPatient: 0, // 当前选择的患者下标
        patientList: [
          {
            isNew: true, // 是否为新入院
            collection: true, // 收藏状态
            bedNum:'1', // 床号
            adNum: '00098765', // 住院号
            name: '李晓芬', // 云医院
            gender: '女', // 性别
            age: '20', // 年龄
            doctorName: '张扬', // 主治医生
            executiveNurse: '朱芬', // 主管护师
            responsibilityNurse: '刘素芬', // 责任护师
            inDate: '2019-06-06', // 入院时间
            dayNum: 20, // 入院天数
            childrenNum: 2 // 婴儿数
          },
          {
            isNew: true,
            collection: false, // 收藏状态
            bedNum:'1',
            adNum: '00098765',
            name: '李晓芬',
            gender: '女',
            age: '20',
            doctorName: '张扬',
            executiveNurse: '朱芬',
            responsibilityNurse: '刘素芬',
            inDate: '2019-06-06',
            dayNum: 20,
            childrenNum: 1 // 婴儿数
          }
        ], // 患者列表 list
      }
    },
    computed: {
      disabled() {  // 滑动加载禁用状态
        return this.loading || this.noMore;
      }
    },
    filters: {
      repair(val){  // 床号小于0时，前面补0
        return val <= 9 ? '0' + val : val;
      }
    },
    methods: {
      /*搜索查询*/
      search() {

      },
      /*点击入院情况radio*/
      radioChange(data) {
        this.searchForm.radio = data;
        this.search();
      },
      handle_selectLabel (item){
        item.isSelect = !item.isSelect
      },
      handle_selectPatient (index){ // 选择患者
        console.log(1);
        this.currentPatient = index
      },
      load (){ // 滑动到底部加载
        this.loading = true;
        try {
          this.count += 2;

          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          this.noMore = this.count >= 20;
        }catch (e) {
          this.count -= 2;
          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          this.noMore = this.count >= 20;
        }
      },
      collection (item){ // 收藏按钮点击
        item.collection = !item.collection
      },
      async submitForm(formName) { // 添加新生儿床位提交表单
        this.$refs[formName].validate((valid) =>{
          if (valid) {
            try{
              alert('submit!');
            }catch (e) {

            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>


<style scoped lang="scss">
  .el-button--primary, .el-button--default {
    font-size: 14px;
    padding: 5px 10px;
  }

  i {
    font-style: normal;
  }

  .list {
    height: 100%;
    .list-top {
      /*margin-bottom: 20px;*/

      .top-item1 {
        padding: 0px 0 20px 15px;

        .hos {
          display: inline-block;

          span {
            width: 58px;
            height: 36px;
            margin-right: 7PX;
            font-size: 14px;
            
            font-weight: 400;
            text-align: center;
            color: rgba(148, 157, 163, 1);
            line-height: 36px;
            display: inline-block;
            cursor: pointer;
          }

          .isactive {
            width: 58px;
            height: 36px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 2px;
            font-size: 14px;
            
            font-weight: bold;
            text-align: center;
            color: $l-color-primary;
            line-height: 36px;
          }
        }

        .button {
          width: 80px;
          height: 36px;
          margin-left: 10px;
          background: $l-color-primary;
          border-radius: 2px;
          font-size: 14px;
          
          font-weight: 500;
          color: $l-color-white;
        }

        .list-style {
          float: right;
          display: inline-block;

          .style-button {
            display: inline-block;
            font-size: 20px;
            line-height: 36px;
            text-align: center;
            width: 36px;
            height: 36px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 2px;
            border: 1px solid transparent;
            background-color: $l-color-white;
            cursor: pointer;
            color: $l-color-primary;
          }
          .isactive{
            border: 1px solid $l-color-border-2;
            border-radius: 2px;
            background: transparent;
            cursor: default;
            color: #D4D9DC;
          }
        }
      }

      .top-item2 {
        height: 60px;
        padding: 12px 20px;
        background: $l-color-white;
        border-radius: 2px;

        .cont {
          margin-right: 40px;
          display: inline-block;

          span {
            width: 28px;
            height: 36px;
            font-size: 14px;
            
            font-weight: bold;
            color: rgba(148, 157, 163, 1);
            line-height: 36px;
            display: inline-block;
          }

          .button {
            width: 54px;
            height: 24px;
            background: $l-color-bgcolor-14;
            border-radius: 18px;
            font-size: 12px;
            
            font-weight: 400;
            color: $l-color-fontcolor-4;
            border: none;
          }

          .button.isactive {
            background: $l-color-bgcolor-13;
            font-weight: 400;
            color: $l-color-primary;
          }
        }
      }
    }

    .list-center {
      /*padding-top: 20px;*/
      height: calc(100% - 138px);
      .head {
        height: 24px;
        margin-bottom: 20px;
        font-size: 16px;
        
        font-weight: 500;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;
        position: relative;
        left: 35px;

        .head-before {
          width: 4px;
          height: 20px;
          background: $l-color-primary;
          position: absolute;
          left: -10px;
          top: 0;
        }
      }

      .lists {
        height: 100%;
        border-top: 1px solid $l-color-bgcolor-11;

        .lists-item {
          padding: 20px 0;
          border-bottom: 1px solid $l-color-bgcolor-11;
          position: relative;
          .label{
            position: absolute;
            left: 0;
            top: 0;
            width:44px;
            height:24px;
            line-height: 24px;
            text-align: center;
            background: $l-color-bgcolor-18;
            font-size:12px;
            
            font-weight:500;
            color: $l-color-primary1;
          }
          .item {
            float: left;
            border-right: 1px solid $l-color-text-secondary;
            text-align: left;
          }
          .item1 {
            height: 36px;
            margin-left: 64px;
            padding-right: 10px;
            font-size: 14px;
            font-weight: bold;
            
            color: $l-color-fontcolor-3;

            i {
              display: inline-block;
              font-size: 36px;
              
              color: $l-color-fontcolor-3;
              line-height: 36px;
            }
          }

          .item2 {
            height: 36px;
            padding: 0 20px 0 10px;

            i {
              display: inline-block;
              height: 20px;
              font-size: 14px;
              
              font-weight: 400;
              color: $l-color-fontcolor-3;
              line-height: 36px;
            }

            .number {
              font-size: 16px;
              
              font-weight: bold;
              color: $l-color-fontcolor-2;
            }
          }

          .item3 {
            padding-left: 20px;
            border: none;

            .item-row {
              height: 18px;
              line-height: 18px;

              span {
                margin-right: 28px;
                display: inline-block;
                font-size: 12px;
                
                font-weight: 400;
                color: $l-color-fontcolor-4;

                i {
                  color: $l-color-fontcolor-3;
                  margin-left: 10px;
                }
              }
            }
          }

          .item4 {
            height: 36px;
            padding-right: 20px;
            text-align: center;
            line-height: 36px;
            color: $l-color-border-6;
            float: right;
            i{
              font-size: 18px;
            }
          }

          .item5 {
            height: 36px;
            padding: 8px 15px 0 20px;
            float: right;
            i {
              height: 20px;
              margin-right: 5px;
              font-size: 12px;
              
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 20px;
              text-align: center;
              display: inline-block;
            }

            .te {
              width: 20px;
              background-color: $l-color-bgcolor-15;
            }

            .pushi {
              width: 32px;
              background-color: $l-color-bgcolor-16;
            }
          }

          .item6 {
            height: 36px;
            float: right;
            padding: 7px 20px 0 20px;
            border: none;
            span {
              display: inline-block;
              width: 22px;
              height: 22px;
              background-color: $l-color-bgcolor-17;
            }
          }
        }

        .lists-item.active {
          background: $l-color-bgcolor-13;

          .item {
            border-right: 1px solid $l-color-bgcolor-17;
          }
          .item6{
            border: none;
          }
          .item3 {
            border: none;
          }
        }
      }
    }

    .list-card {
      margin-top: 20px;

      .list-card-item {
        border: 2px solid transparent;
        position: relative;
        width: 287px;
        height: 253px;
        border-radius: 4px;
        padding: 47px 0 0 20px;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        margin-bottom: 20px;
        /*line-height: 24px;*/
        .label{
          position: absolute;
          left: 0;
          top: 0;
          width:44px;
          height:24px;
          line-height: 24px;
          text-align: center;
          background: $l-color-bgcolor-18;
          font-size:12px;
          
          font-weight:500;
          color: $l-color-primary1;
        }
        .collection{
          position: absolute;
          right: 10px;
          top: 10px;
        }
        .title {
          margin-bottom: 20px;

          .item-color1 {
            font-size: 38px;
            
            font-weight: bold;
          }

          .item-color2 {
            padding-left: 5px;
            margin-right: 25px;
            border-left: 1px solid $l-color-bgcolor-11;
            display: inline-block;
            font-size: 18px;
            
            font-weight: bold;
            color: $l-color-fontcolor-2;
            /*line-height:23px;*/
          }

          .item-color3 {
            height: 18px;
            font-size: 18px;
            
            font-weight: bold;
            color: $l-color-primary;
            /*line-height:23px;*/
          }
        }

        .info {
          margin-bottom: 30px;
          font-size: 16px;
          
          font-weight: 400;
          color: $l-color-fontcolor-3;
          /*line-height:24px;*/
          span {
            display: block;
            margin-top: 10px;

            .item-color {
              color: $l-color-fontcolor-4;
            }
          }
        }

        .icons {
          font-size: 12px;
          
          font-weight: 400;
          color: $l-color-white;

          .te {
            width: 20px;
            height: 20px;
            display: inline-block;
            background-color: $l-color-bgcolor-15;
            text-align: center;
            line-height: 20px;
          }

          .pushi {
            width: 40px;
            height: 20px;
            margin-right: 10px;
            display: inline-block;
            background-color: $l-color-bgcolor-16;
            text-align: center;
            line-height: 20px;
          }

          .babyicon {
            border-left: 1px solid $l-color-bgcolor-11;
            color: $l-color-border-6;
            padding-left: 10px;
          }
        }
      }
      .active{
        border: 2px solid $l-color-primary;
      }
    }
  }
  // 悬浮弹框
  .hover-alert{
    color: $l-color-fontcolor-3;
    .el-row{
      line-height: 30px;
    }
    .label{
      display: inline-block;
      width: 56px;
      margin-right: 5px;
      color: $l-color-fontcolor-4;
    }
    .spec{
      color: $l-color-primary;
    }
  }
  .addChildren {
    .el-button--primary, .el-button--default {
      font-size: 14px;
      height: 36px;
      width: 80px;
      border-radius: 2px;
    }
    .cancel{
      border: 1px solid $l-color-primary;
      color: $l-color-primary;
    }
    .el-row{
      margin-top: 20px;
      .el-col{
        width: 200px;
      }
      .el-col:last-child{
        margin-left: 10px;
      }
    }
  }
  .infinite-list-wrapper {
    height: 100%;
    text-align: center;
    overflow: auto;
  }
  .bottom-container {
    text-align: center;
    padding: 20px 0px;
  }
</style>
