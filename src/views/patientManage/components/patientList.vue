<template>
  <div class="patientList width100 height100">
    <el-card class="width100 height100">
      <div class="title">
        <l-card-title>
          <template slot="left">患者列表</template>
        </l-card-title>
      </div>
      <div class="list">
        <el-table
          :data="patientList"
          border
          width="100%"
          height="450px"
          ref="singleTable"
          highlight-current-row
          v-loadmore="load"
          v-loading="tlm_isLoading"
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
            <template slot-scope="patientList">
              <template v-if="item.prop == 'patientInfo'">
                {{ patientList.row['patientName']}} {{ patientList.row['patientGender']==1?'男':'女'}}
                {{patientList.row['patientAge']}}
              </template>
              <template v-else>
                <span>{{ patientList.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "patientList",
    data() {
      return {
        patientListParams: [
          {
            prop: "patientInfo",
            label: "患者信息",
            align: "left",
            width: "120",
            fixed: false
          }, {
            prop: "diagnose",
            label: "最近诊断",
            align: "left",
            width: "175",
            fixed: false
          }
        ],
        patientList: [],
        patientListUnit: [],
        //分页数据
        page: 1,
        limit: 10,
        total: 0,
        tlm_noMore: false,
        tlm_isLoading: false
      }
    },
    created() {
      this.getPatientList();
      this.patientList = this.patientListUnit;
      this.$emit('getPatientInfo', JSON.stringify(this.patientList[0]));
    },
    methods: {
      getPatientList() {
        this.$showLoading();
        try {
          //获取患者数据接口
          //假数据填充
          let res = [
            {
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
            },
            {
              patientId: '1',
              patientName: '张小伟',
              patientFullName: '张小伟',
              patientGender: 0,
              patientAge: '32岁',
              marry: 0,
              bloodType: 'A型',
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
                  name: '张伟一',
                  gender: 1,
                  age: '59岁',
                  hisIll: '高血压，心脏病',
                  recordDate: '2017-05-16',
                  recordHis: '张家港卫生院'
                }, {
                  relation: '母亲',
                  name: '李小娟',
                  gender: 0,
                  age: '58岁',
                  hisIll: '无',
                  recordDate: '2019-05-16',
                  recordHis: '张家港卫生院'
                }
              ]
            },
            {
              patientId: '2',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '3',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '4',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '5',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '6',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '7',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '8',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
            },
            {
              patientId: '9',
              patientName: '张大伟',
              patientFullName: '张大伟',
              patientGender: 0,
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
          ];
          this.total = 10;
          this.patientListUnit = res;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }

      },
      rowClick(row) {
        this.$emit('getPatientInfo', JSON.stringify(row));
      },
      //滑动加载更多信息
      load() {
        const _this = this;
        this.page++;
        setTimeout(function () {
          let patientList = [..._this.patientList];
          //获取分页列表
          _this.getPatientList();
          if (_this.page >= _this.total) {
            _this.tlm_noMore = true;
          }
          _this.patientList = [...patientList.concat(_this.patientListUnit)];
          _this.tlm_isLoading = false;
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .patientList {
    .title {
      margin-left: 20px;
    }
  }
</style>
