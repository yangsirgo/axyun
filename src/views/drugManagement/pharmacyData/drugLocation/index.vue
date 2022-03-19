<template>
  <div class="drugLocation width100 height100">
    <el-card class="card-cont width100 height100">
      <div class="search-input-list">
        <el-row :gutter="5">
          <el-col :span="6">
            <LFormtTitle label="库房" labelWidth="48">
              <el-select v-model="searchData.drugStorage" style="line-height: 34px;" placeholder="">
                <el-option label="西药药库" value="0"></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
          <el-col :span="4">
            <LFormtTitle label="位置大类" labelWidth="76">
              <el-select v-model="searchData.position" style="line-height: 34px;" placeholder="">
                <el-option label="全部位置" value="0"></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
          <el-col :span="3">
            <LFormtTitle label="货位显示规则" labelWidth="104">
              <el-select v-model="searchData.showRule" style="line-height: 34px;" placeholder="">
                <el-option label="显示全部药品" value="0"></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
          <el-col :span="4">
            <LFormtTitle label="药品名称" labelWidth="76">
              <el-input v-model="searchData.drugName" style="line-height: 34px;" placeholder="请输入药品名称"></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="7">
            <el-button class="primary-button" @click="search">查询</el-button>
            <el-button class="plain-button">新增</el-button>
            <el-button class="plain-button">保存</el-button>
            <el-button class="plain-button" @click="reset">清空</el-button>
            <el-button class="plain-button">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        searchData: {
          drugStorage: '',
          position: '',
          showRule: '',
          drugName: ''
        },
        //表格
        drugParams: [],
        //表格数据
        drugData: []
      }
    },
    methods: {
      //获取药品列表
      async getDrugList() {
        this.$showLoading();
        try {
          //获取药品数据接口,searchData,page分页信息
          // let res = await getDrugList(传参searchData);
          //假数据填充
          let res = [
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            },
            {
              drugName: '阿莫西林胶囊',
              specification: '0.5g*16',
              formulation: '胶囊',
              inStorageDate: '',
              num: '',
              inStorageType: '',
              odd: '',
              batch: '',
              purchasingPrice: '',
              purchasingPriceNum: '',
              sellingPrice: '',
              sellingPriceNum: '',
              manufacturer: '',
              manufacturerLogo: '',
              supplier: '',
              batchNum: '',
              validity: '',
              note: '',
              inStorageMan: ''
            }
          ];
          this.drugDataUnit = res;
          this.total = 10;
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取药品列表失败");
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .card-cont {
    .search-input-list {
      margin: 20px;
    }

    .plain-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-white;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-primary;
      border: 1px solid $l-color-primary;
    }

    .primary-button {
      width: 80px;
      height: 36px;
      padding: 0 12px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: $l-font-size;
      
      font-weight: 400;
      color: $l-color-white;
      border: none;
    }
  }
</style>
