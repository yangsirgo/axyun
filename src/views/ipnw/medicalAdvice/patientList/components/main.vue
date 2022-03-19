<template>
  <div class="height100" ref="page">
    <el-card class="height100 list-container" style="margin-top: 20px;">
      <div class="label-box">
        <div v-for="item in labelList" :key="item.id" class="label-box-content">

          <span class="title">{{item.type_name}}</span>
          <span
            v-for="itemTwo in item.tags"
            @click="selectTag(itemTwo)"
            :key="itemTwo.id"
            :class="itemTwo.isActive?'tag active':'tag'"
          >{{itemTwo.name +' '+ itemTwo.num}}</span>

        </div>
        <div  class="label-box-content">
        <buttom class="label-box-content title" @click="resetting()">重置</buttom>
        </div>
      </div>
      <div class="mid-content" :style="{'height': maxHeight + 'px'}">
        <ul class="infinite-list" v-if="outList.length !== 0"  v-infinite-scroll="loadNext" style="overflow:auto">

            <li class="infinite-list-item"
                v-for="(item, index) in outList"
                @click="activeIndex = index"
                :class="{'activeLi':index === activeIndex}"
                :key="item.id">
              <template v-if="item.patientName">
              <!--<el-checkbox v-model="item.isSelected" @change="selectItem(index)" style="margin: 24px;"></el-checkbox>-->
              <div>
                <span class="bed-no">{{item.bedCode <= 9?'0'+item.bedCode:item.bedCode}}</span>
                <span
                  style="font-size:14px;font-weight:bold;color:rgba(46,50,58,1);line-height:20px;">床</span>
              </div>
              <div class="user-info">
                <span class="number">{{item.inpCode}}</span>
                <span>{{item.patientName}}</span>
                <span :val="item.patientGender" code="GENDER_CODE" v-codeTransform  v-if="item.patientGender"></span>
                <span>{{item.patientAge}}</span>
              </div>
              <div class="doc-info">
                <p>
                  <span class="label">主治医师</span><span class="label-con">{{item.manageDoctorName}}</span>
                  <span class="label">主管护师</span><span class="label-con">{{item.manageNurseName}}</span>
                 <!-- <span class="label">责任护师</span><span class="label-con">{{item.main_duty}}</span>-->
                  <span class="label">入院日期</span><span class="label-con">{{item.wdeptAdmissionTime}}</span>
                </p>
                <p>
                  <span class="label-con">{{item.detail}}</span>
                </p>
              </div>
              <div class="tag-icon">
                <span :val="item.nursingLevel" code="nursingLevel" v-codeTransform></span>
                <!--<span   v-if="item.nursingLevel == '1' ">Ⅰ</span>-->
                <!--<span   v-if="item.nursingLevel == '2' ">Ⅱ</span>-->
                <!--<span   v-if="item.nursingLevel == '3' ">Ⅲ</span>-->

                <!--<span   v-if="item.nursingLevel == '4' ">特</span>-->
                <!--<span class="special">特</span>     &lt;!&ndash;  {{item.illnessStatus}}&ndash;&gt;-->
                <span class="decline"   :val="item.securityRisk" code="CrisisType" v-codeTransform v-if="item.securityRisk">{{item.securityRisk}}</span>   <!-- {{item.securityRisk}}-->
                <span class="ordinary"  :val="item.dietType" code="food" v-codeTransform></span>   <!--{{item.dietType}}-->
              </div>
              </template>
              <template v-else>
                <div>
                  <span class="bed-no">{{item.bed_num <= 9?'0'+item.bed_num:item.bed_num}}</span>
                  <span
                    style="font-size:14px;font-weight:bold;color:rgba(46,50,58,1);line-height:20px;">床</span>
                </div>
                <div class="user-info" style="border-right: 0">
                  空床
                </div>
              </template>
            </li>
        </ul>
        <div v-else :style="{'height': maxHeight + 'px'}" style="display: table-cell;
    text-align: center;
    width: 9999px;
    vertical-align: middle;">
          暂无数据
        </div>
      </div>
    </el-card>
    <!-- 召回弹框 -->
    <el-dialog title="召回操作" :visible.sync="recallDialogVisible" width="800px">
      <div class="recall-content-box">
        <ul>
          <li>
            <p>
              <span class="black em">05床</span>
              <span class="black em">刘明海</span>
              <span class="black em">男</span>
              <span class="black em">22岁</span>
              <span class="blue em">000448474</span>
            </p>
          </li>
        </ul>

        <div class="user-info">
          <div class="title">
            <i></i>
            <b>患者信息</b>
          </div>
          <div class="info">
            <div>
              <p>
                <span class="babel">当前科室</span>
                <span>泌尿外科</span>
              </p>
              <p>
                <span class="babel">结算类型</span>
                <span>本地结算</span>
              </p>
              <p>
                <span class="babel">身份证号</span>
                <span>23423423748237</span>
              </p>
            </div>
            <div>
              <p>
                <span class="babel">入院日期</span>
                <span>2019-06-06</span>
              </p>
              <p>
                <span class="babel">出院日期</span>
                <span>2019-07-06</span>
              </p>
              <p>
                <span class="babel">住院日期</span>
                <span>预出院</span>
              </p>
            </div>
            <div>
              <p>
                <span class="babel">费用总额</span>
                <span>2500.00</span>
              </p>
              <p>
                <span class="babel">预交金</span>
                <span>1000.00</span>
              </p>
              <p>
                <span class="babel">余额</span>
                <span>-1500.00</span>
              </p>
            </div>
          </div>
        </div>
        <div class="out-info">
          <div class="title">
            <i></i>
            <b>出院信息</b>
          </div>
          <div class="info">
            <p>
              <span class="babel">出院日期</span>
              <span>2019-07-06</span>
            </p>
            <p>
              <span class="babel">出院时间</span>
              <span>09:08:07</span>
            </p>
            <p>
              <span class="babel">出院病情</span>
              <el-dropdown trigger="click" @command="selectState">
                <span class="el-dropdown-link">
                  {{state}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="01">一般、普通</el-dropdown-item>
                  <el-dropdown-item>一般、普通</el-dropdown-item>
                  <el-dropdown-item>一般、普通</el-dropdown-item>
                  <el-dropdown-item>一般、普通</el-dropdown-item>
                  <el-dropdown-item>一般、普通</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </div>
        <div class="out-info">
          <div class="title">
            <i></i>
            <b>召回信息</b>
          </div>
          <div class="info">
            <el-input v-model="recallReason" placeholder="请输入召回原因" style="margin-top: 20px;"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          style="border-radius: 2px;"
          @click="recallDialogVisible = false"
        >确认召回</el-button>
        <el-button
          class="secondBtn"
          @click="recallDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getPatients, getPatientsState, getNursingLevel, getEntranceCode, getEntranceCodeNum, getNursingLevelNum} from '@/api/cis/resident/resident.js';

  export default {
    data() {
      return {
        maxHeight: '', // 列表最大高
        state: '', // 出院病情状况
        activeIndex: 0,// 选中的 li 标签
        select_index: '', // 选中项下标
        keyWord: "", // 搜索关键字
        recallReason: '', // 召回原因
        recallDialogVisible: false, // 召回操作弹出框
        nursingLevel : '',
        entranceCode : '',
        labelList: [
          {
            type_name: "病情",
            id: 1,
            tags: []
          },
          {
            type_name: "护理",
            id: 2,
            tags: []
          }
        ],
        outList: []
      };
    },
    created() {

     // this.getPatientList();
      this.getPatientLists();
      this.getNursingLevel();
      this.getEntranceCode();
    },
    updated() {
      this.$nextTick(() => {
        this.maxHeight = this.$refs.page.clientHeight - 180;
      })
    },
    methods: {
      // 获取患者列表
     /* async getPatientList() {
        let data = {
          admissionStatus: 1
        }

        let result = await getPatients(data);
        if (result.code == 1) {
          this.patientsList = result.data;
          if (this.receivePatientData.bedId === undefined) {
            //默认选中第一个
            this.changeRecPatientData(result.data[0]);
            this.setCurrent(result.data[0]);
          } else {
            //选中 vuex 中的数据
            let targetRow = result.data.find((item)=>{
              return item.finAdId === this.receivePatientData.finAdId
            })
            this.setCurrent(targetRow);
          }
        }
      },*/

     //获取护理等级
      async getNursingLevel () {
        let all = [{
          pId : 2,
          name : '全部',
          id : '',
          code : '',
          num : 0,
          isActive : false
        }];
        let result = await getNursingLevel();
        if (result.code === 1) {
          let serverData = result.data;
          serverData = serverData.map((item)=>{
            return {
              pId : 2,
              name : item.name,
              id : item._id,
              code : item.code,
              num : item.num || 0,
              isActive : false
            }
          });
          this.labelList[1].tags = all.concat(serverData);
          console.log('护理等级',this.labelList[1].tags);
          this.getNursingLevelNum ();
        } else {
          this.$message({message: '获取护理等级失败',type: 'error'});
        }
      },

      //获取护理等级数量
      async getNursingLevelNum () {
        let result = await getNursingLevelNum();
        if (result.code === 1) {
          let serverData = result.data;
          serverData.forEach((pItem)=> {
            this.labelList[1].tags.forEach((sItem)=>{
              if (pItem.code === sItem.code) {
                sItem.num = pItem.num;
              }
            });
          });
          this.labelList[1].tags.forEach((sItem)=>{
            this.labelList[1].tags[0].num = this.labelList[1].tags[0].num + Number(sItem.num);
          });

        } else {
          this.$message({message: '获取护理等级失败',type: 'error'});
        }
      },

      // 获取病情
      async getEntranceCode () {
        let all = [{
          pId : 1,
          name : '全部',
          id : '',
          code : '',
          num : 0,
          isActive : false
        }];
        let result = await getEntranceCode();
        if (result.code === 1) {
          let serverData = result.data;
          serverData = serverData.map((item)=>{
            return {
              pId : 1,
              name : item.name,
              id : item._id,
              code : item.code,
              num : item.num || 0,
              isActive : false
            }
          });
          this.labelList[0].tags = all.concat(serverData);
          console.log('病情等级',this.labelList[0].tags);
          this.getEntranceCodeNum ();
        } else {
          this.$message({message: '获取护理等级失败',type: 'error'});
        }
      },

      // 获取病情数量
      async getEntranceCodeNum () {
        let result = await getEntranceCodeNum();
        if (result.code === 1) {
          let serverData = result.data;
          serverData.forEach((pItem)=> {
            this.labelList[0].tags.forEach((sItem)=>{
              if (pItem.code === sItem.code) {
                sItem.num = pItem.num;
              }
            });
          });
          this.labelList[0].tags.forEach((sItem)=>{
            this.labelList[0].tags[0].num = this.labelList[0].tags[0].num + Number(sItem.num);
            console.log(this.labelList[0].tags[0].num);
          });

        } else {
          this.$message({message: '获取病情数量失败',type: 'error'});
        }
      },

      //获取病人列表主页面
      async getPatientLists() {
        let data = {
          admissionStatus: 2,
          nursingRank : this.nursingLevel,
          admissionSituation : this.entranceCode,
        }
        console.log(data);
        let result = await getPatients(data);
        if (result.code == 1) {
          this.outList = result.data;
          /* if (this.receivePatientData.bedId === undefined) {
             //默认选中第一个
             this.changeRecPatientData(result.data[0]);
             this.setCurrent(result.data[0]);
           } else {
             //选中 vuex 中的数据
             let targetRow = result.data.find((item)=>{
               return item.finAdId === this.receivePatientData.finAdId
             })
             this.setCurrent(targetRow);
           }*/
        }
      },

      selectTag(item) {
        let _this = this;
          if (item.pId === 1) {
            this.labelList[0].tags.forEach((sonItem)=>{
              sonItem.isActive = false;
              if (sonItem.id === item.id) {
                sonItem.isActive = true;
                _this.entranceCode = sonItem.code;
              }
            });
          } else if (item.pId === 2) {
            this.labelList[1].tags.forEach((sonItem)=>{
              sonItem.isActive = false;
              if (sonItem.id === item.id) {
                sonItem.isActive = true;
                _this.nursingLevel = sonItem.code;
              }
            });
          }

        //点击获取数据
        this.getPatientLists ();
      },
      resetting(){
        this.labelList[0].tags.forEach((sonItem) => {
          sonItem.isActive = false;
        });
        this.labelList[1].tags.forEach((sonItem) => {
          sonItem.isActive = false;
        });
        this.entranceCode = '';
        this.nursingLevel = '';
        this.getPatientLists ();
      },
      selectItem(index) { // 选项单选功能实现
        let list = this.outList;
        if (index === this.select_index) {
          list[index].isSelected = false
          this.select_index = ''
        } else {
          this.select_index = index
          list.map((item1, i) => {
            if (i == index) {
              item1.isSelected = true
            } else {
              item1.isSelected = false
            }
          })
        }
      },
      selectState() {

      },
      loadNext() {
        console.log("加载下一页");
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/ .el-input--medium .el-input__inner {
    height: 36px;
  }

  .container /deep/ .el-checkbox {
    line-height: normal;
  }

  .label-box {
    min-height: 44px;
    background: #fff;
    overflow: hidden;
    padding: 0 20px;

    & > div {
      float: left;
      font-size: 14px;
      margin: 10px 0;
      line-height: 44px;

      .title {
        color: #949DA3;
        font-size: 14px;
        
        font-weight: 400;
      }

      span:last-child {
        margin-right: 40px;
      }

      .tag {
        display: inline-block;
        line-height: 24px;
        text-align: center;
        margin-left: 10px;
        color: #949da3;
        cursor: pointer;
        width: auto;
        padding: 0 10px;
        background: rgba(246, 246, 246, 1);
        border-radius: 18px;
      }

      .active {
        color: $l-color-primary;
        background: rgba(253, 238, 233, 1);
      }
    }
  }

  .list-container {
    //height: calc(100% - 20px);
    height: 100%;

    /deep/ .el-card__body {
      overflow: auto;
    }
  }

  .top-content {
    height: 72px;
    line-height: 72px;
    border-bottom: 1px solid #e4e4e4;
  }

  .mid-content {
    height: calc(100% - 72px);

    ul {
      height: 100%;
      min-width: 1026px;

      li {
        width: 100%;
        height: 72px;
        align-items: center;
        position: relative;
        border-bottom: 1px solid #E4E4E4;
        padding: 0 20px;

        label {
          float: left;
        }

        div {
          margin-top: 13px;
          float: left;

          .bed-no {
            font-size: 36px;
            font-weight: bold;
            color: rgba(46, 50, 58, 1);
            line-height: 46px;
          }
        }

        .user-info {
          height: 34px;
          line-height: 34px;
          padding: 0 20px;
          margin: 19px 20px 0 10px;
          color: #2E323A;
          border-left: 1px solid #E4E4E4;
          border-right: 1px solid #E4E4E4;

          span {
            margin-right: 20px;
            font-size: 16px;
          }

          span:last-child {
            margin: 0;
          }

          .number {
            color: #3D7DFB;
            font-weight: bold;
          }
        }

        .doc-info {
          height: 40px;
          margin-top: 16px;

          p {
            margin: 0;
            height: 20px;

            .label {
              font-size: 12px;
              
              font-weight: 400;
              color: rgba(148, 157, 163, 1);
              line-height: 17px;
              margin-right: 10px;
            }

            .label-con {
              font-size: 12px;
              
              font-weight: 400;
              color: rgba(46, 50, 58, 1);
              line-height: 17px;
              margin-right: 28px;
            }
          }
        }

        .tag-icon {
          padding-left: 22px;
          height: 20px;
          position: absolute;
          top: 26px;
          right: 20px;
          border-left: 1px solid #E4E4E4;
          margin-top: 0;

          span {
            display: inline-block;
            font-size: 12px;
            
            font-weight: 400;
            line-height: 20px;
            text-align: center;
            border-radius: 2px;
          }

          .special {
            width: 20px;
            height: 20px;
            background: rgba(225, 20, 10, 1);
            color: rgba(255, 255, 255, 1);
          }

          .ordinary {
            color: rgba(255, 255, 255, 1);
            background: rgba(189, 193, 195, 1);
          }

          .decline {
            width: 20px;
            height: 20px;
            color: rgba(255, 255, 255, 1);
            background: rgba(61, 125, 251, 1);
          }

          .level {
            width: 20px;
            height: 20px;
            background: rgba(247, 168, 32, 1);
            border-radius: 2px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }

      .activeLi {
        background-color: $l-color-bgcolor-1;
      }
    }
  }

  .recall-content-box {
    // border-top: 1px solid #E4E4E4;
    padding: 0 20px;

    .title {

      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);

      i {
        display: inline-block;
        width: 4px;
        height: 20px;
        background: $l-color-primary;
        margin-right: 5px;
        position: relative;
        top: 4px;
      }
    }

    ul {
      li {
        height: 60px;
        font-size: 16px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;

        p {
          margin: 0;
          line-height: 60px;

          span {
            padding: 0 5px;
          }

          .black {
            color: #2e323a;
          }

          .blue {
            color: #3D7DFB;
          }

          .gray {
            color: #949da3;
          }

          .em {
            font-weight: 600;
          }

          img {
            width: 60px;
          }
        }
      }
    }

    .user-info {
      .info {
        margin: 10px 0;

        & > div {
          overflow: hidden;

          p {
            width: 240px;
            font-size: 14px;
            line-height: 20px;
            margin: 10px 0;
            float: left;

            .babel {
              color: #949da3;
              display: inline-block;
              width: 56px;
              margin-right: 10px;
            }
          }
        }
      }
    }

    .out-info {
      .info {
        margin: 20px 0;
        overflow: hidden;

        & > p {
          width: 240px;
          height: 36px;
          line-height: 36px;
          border: 1px solid #e4e4e4;
          border-radius: 2px;
          margin-left: 10px;
          float: left;
          color: #2e323a;
          background: rgba(245, 245, 245, 1);

          .babel {
            color: #949da3;
            margin-left: 10px;
            margin-right: 10px;
            padding-right: 10px;
            border-right: 1px solid #e4e4e4;
          }
        }

        & > p:first-child {
          margin-left: 0px;
        }
      }
    }
  }

  .secondBtn {
    border-radius: 2px;
    border-color:$l-color-primary;
    color:$l-color-primary;
    background: #fff;
  }

</style>
