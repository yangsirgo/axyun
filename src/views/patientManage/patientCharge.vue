<template>
  <div class="container1" ref="page">
    <el-card class="left height100">
      <time-line></time-line>
    </el-card>
    <div class="right">
      <div style="height: 80px;">
        <patient-info :patientInfo="patientInfo"></patient-info>
      </div>
      <el-card class="main-content padding20" :style="{height: Height + 'px'}">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="费用合计" name="total">
            <div style="margin-top: 20px;">
              <el-button type="primary" style="margin-right: 40px;">打印</el-button>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </div>
            <div class="allPrice">
              <div class="title">总费用</div>
              <div class="context">
                <div>
                  <p>
                    <span>西药费</span> ¥500.00
                  </p>
                  <p>
                    <span>治疗费</span> --
                  </p>
                  <p>
                    <span>床位费</span> ¥900.00
                  </p>
                  <p>
                    <span>检查费</span> ¥200.00
                  </p>
                  <p>
                    <span>检验费</span> ¥900.00
                  </p>
                  <p>
                    <span>监护费</span> ¥100.00
                  </p>
                </div>
                <div>
                  <p>
                    合计 <span class="primary">¥ 2500</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="allPrice">
              <div class="title">西药费用</div>
              <div>
                <el-table
                  :data="westernTable"
                  border
                  style="width: 100%;">
                  <el-table-column
                    prop="name"
                    min-width="300px"
                    label="项目名称">
                  </el-table-column>
                  <el-table-column
                    prop="spec"
                    label="规格">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    label="单价">
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    label="数量">
                  </el-table-column>
                  <el-table-column
                    prop="total"
                    label="合计">
                  </el-table-column>
                </el-table>
                <div class="total-content">
                  <p>
                    <span>合计</span><span class="primary">¥ 900.00</span>
                  </p>
                  <p>
                    <span>合计</span><span class="primary">10</span>
                  </p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="费用明细" name="detail">
            <div style="width: 400px;margin: 20px 0;overflow:hidden;">
              <div class="float-left">
                <l-formt-title label="录入日期" labelWidth="64">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    style="width: 100%;"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                </l-formt-title>
              </div>
              <div class="float-left">
                <el-button type="primary">查询</el-button>
              </div>
            </div>
            <el-collapse v-model="activeNames" @change="handleChange">
              <l-collapse-item v-for="(parentItem, $index) in collapseData" :name="$index" :key="$index">
                <div slot="title">
                  <el-checkbox v-model="parentItem.checked"></el-checkbox>
                  {{parentItem.applicationDate}} (种类：2，总数量：10，¥90.00)
                </div>
                <div slot="content">
                  <div class="table-wrapper">
                    <el-table
                      header-cell-class-name="headerCls"
                      row-class-name="rowStyleCls"
                      ref="singleTable"
                      :data="parentItem.itemData"
                      highlight-current-row
                      style="width: 100%"
                      stripe
                      border
                      element-loading-text="加载中..."
                    >
                      <el-table-column v-for="item in collapseTableColumn"
                                       :key="item.label"
                                       :label="item.label"
                                       :prop="item.prop"
                                       align="center"
                                       show-overflow-tooltip
                                       header-align="center"
                                       :min-width="item.width">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </l-collapse-item>
            </el-collapse>

          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
  import adHeight from '@/mixins/adHeight'
  import timeLine from './components/timeLine'
  import patientInfo from './components/patientInfo';
  export default {
    mixins:[adHeight],
    components: {
      timeLine,
      patientInfo
    },
    data(){
      return{
        Height: '',
        activeName: 'total',
        dateRange: '', // 时间范围
        westernTable:[
          {
            name: '注射用盐酸头孢甲污',
            spec: '100ml*1瓶',
            price: '50.00',
            num: 5,
            total: '250.00'
          },
          {
            name: '注射用盐酸头孢替安',
            spec: '100ml*1瓶',
            price: '50.00',
            num: 5,
            total: '250.00'
          },
          {
            name: '盐酸钙D3片',
            spec: '600粒*1瓶',
            price: '50.00',
            num: 5,
            total: '250.00'
          },
          {
            name: '骨化三醇软胶南',
            spec: '400粒*1瓶',
            price: '50.00',
            num: 5,
            total: '250.00'
          }
        ],
        collapseData: [
          {
            checked : 0,
            applicationDate: '2018-02-03 12:00',
            itemData: [
              {
                status : '执行中',
                proItem: '阿莫西林',//项目名称
                spec: '1g/1支',//规格
                tuiNo: '1',//实退数量
                singleUse: '2',//单次用量
                unit: '支',//单位
                money: '222222',//票据单号
                userWay: '途径',//途径
                No: '20',//数量
                room: '皮肤科',//执行科室
                id: 1111//id
              },
              {
                status : '执行中',
                proItem: '阿莫西林',//项目名称
                spec: '1g/1支',//规格
                tuiNo: '1',//实退数量
                singleUse: '2',//单次用量
                unit: '支',//单位
                money: '222222',//票据单号
                userWay: '途径',//途径
                No: '20',//数量
                room: '皮肤科',//执行科室
                id: 0//id
              }
            ]
          }, {
            checked : 1,
            applicationDate: '2019-03-03 12:00',
            itemData: [
              {
                status : '执行中',
                proItem: '阿莫西林',//项目名称
                spec: '1g/1支',//规格
                tuiNo: '1',//实退数量
                singleUse: '2',//单次用量
                unit: '支',//单位
                money: '222222',//票据单号
                userWay: '途径',//途径
                No: '20',//数量
                room: '皮肤科',//执行科室
                id: 1111//id
              },
              {
                status : '已执行',
                proItem: '阿莫西林',//项目名称
                spec: '1g/1支',//规格
                tuiNo: '1',//实退数量
                singleUse: '2',//单次用量
                unit: '支',//单位
                money: '222222',//票据单号
                userWay: '途径',//途径
                No: '20',//数量
                room: '皮肤科',//执行科室
                id: 0//id
              }
            ]
          }
        ],
        collapseTableColumn : [
          {
            prop: 'status',
            label: "执行状态",
            width: "20"
          },
          {
            prop: 'proItem',
            label: "项目名称",
            width: "20"
          },
          {
            prop: 'spec',
            label: "规格",
            width: "20"
          },
          {
            prop: 'tuiNo',
            label: "实退数量",
            width: "20"
          },
          {
            prop: 'singleUse',
            label: "单次用量",
            width: "20"
          },
          {
            prop: 'unit',
            label: "单位",
            width: "20"
          },
          {
            prop: 'money',
            label: "金额",
            width: "20"
          },
          {
            prop: 'userWay',
            label: "途径",
            width: "20"
          },
          {
            prop: 'No',
            label: "数量",
            width: "20"
          },
          {
            prop: 'room',
            label: "执行科室",
            width: "20"
          }
        ],
        patientInfo: {}
      }
    },
    created(){
      this.fetchData()
    },
    mounted (){
      this.Height = this.$refs.page.clientHeight - 80;
    },
    methods: {
      handleClick (row){
        // console.log(row);
      },
      fetchData(){
        try {
          const _this = this

          const obj = {
            patientId: '0',
            patientName: '张大伟',
            patientFullName: '张大伟',
            patientGender: 1,
            patientAge: '28岁',
            marry: 0,
            bloodType: 'O型',
            passport: '452587569335412258',
            diagnose: '上呼吸道感染',
            birthDate: '1990-01-12',
            birthTime: '12:25',
            phone: '18978546985',
            email: 'ayxiej12365@163.com',
            identityNum: '145632589654785425',
            townType: '城镇居民保险',
            empiId: '5442',
            nativePlace: '上海市浦东区',
            nationality: '汉族',
            job: '学生',
            postCode: '236587',
            address: '上海市浦东区**小区',
            detailAddress: '上海市浦东区**小区5单元603',
            guardianName: '张伟',
            guardianIdentityNum: '252458755595545875',
            guardianCompanyAdress: '上海市浦东区**小区5单元603',
            hisIll: '高血压，心脏病',
            recordHis: '张家港卫生院',
            familyInfoList: [
              {
                relation: '父亲',
                name: '张伟',
                gender: 1,
                age: '62岁',
                hisIll: '高血压，心脏病',
                recordDate: '2017-05-16',
                recordHis: '张家港卫生院'
              }, {
                relation: '母亲',
                name: '李大娟',
                gender: 0,
                age: '60岁',
                hisIll: '无',
                recordDate: '2019-05-16',
                recordHis: '张家港卫生院'
              }
            ]
          }


          setTimeout(function () {
            _this.westernTable.push({
              name: '骨化三醇软胶南',
              spec: '400粒*1瓶',
              price: '50.00',
              num: 5,
              total: '250.00'
            })
            _this.patientInfo = JSON.stringify(obj)
          }, 2000)
        }catch (e) {

        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .container1{
    overflow:hidden;
    .left{
      float: left;
      width:307px;
      height: 100%;

    }
    .right{
      margin-left:327px;
      height:100%;
      .main-content{
        margin-top: 20px;
        .allPrice{
          margin-top: 10px;
          .title{
            padding: 20px 0;
            color: $l-color-fontcolor-4;
          }
          .context{
            background: $l-color-bgcolor-14;
            border-radius: 2px;
            padding: 0 20px;
            &>div{
              line-height: 60px;
              height: 60px;
              p{
                float: left;
                min-width: 200px;
                span{
                  color: $l-color-fontcolor-4;
                  margin-right: 10px;
                }
                .primary{
                  color: $l-color-primary;
                  font-weight: bold;
                }
              }
            }
            div:first-child{
              border-bottom: 1px solid $l-color-bgcolor-11;
            }
            div:last-child{
              p{
                min-width: auto;
                float: right;
                color: $l-color-fontcolor-4;
              }
            }
          }
          .total-content{
            overflow: hidden;
            border: 1px solid $l-color-bgcolor-11;
            border-top: none;
            line-height: 40px;
            p{
              float: right;
              min-width: 153px;
              span:first-child{
                margin-right: 10px;
              }
              .primary{
                color: $l-color-primary;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
</style>
