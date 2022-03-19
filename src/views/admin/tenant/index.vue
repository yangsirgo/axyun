<template>
  <div class="app-container" ref="page">
    <div
      style="margin-bottom:20px;width:116px;display: inline-block;font-weight:700;font-size: 16px;color:#606266;"
    >
      租户信息:
    </div>
    <el-form :model="form" :label-position="labelPosition" ref="form" label-width="120px">
      <el-form-item
        v-for="(item,index) in form.treeItem"
        :key="index"
        :label="item.orgFieldName"
        :prop="item.orgField"
      >
        <el-input
          v-if="item.orgFieldType === 'input'"
          v-model="item.orgFieldValue"
          @input="changeValue(item)"
        ></el-input>
        <el-select
          v-model="item.orgFieldValue"
          v-if="item.orgFieldType === 'select' && item.orgFieldValues "
        >
          <el-option
            v-for="it in (getJsonData(item.orgFieldName,item.orgFieldValues))"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          ></el-option>
        </el-select>
        <el-checkbox-group
          v-model="item.orgFieldValue"
          v-if="item.orgFieldType === 'checkbox' && item.orgFieldValues"
        >
          <el-checkbox
            v-for="it in (getJsonData(item.orgFieldName,item.orgFieldValues))"
            :label="it.label"
            :key="it.label"
          >{{it.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleOrgAdd()">保存</el-button>
        <el-button type="primary" size="mini" @click="handleOrgClear()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getOrganTypeTable,
  addOrg,
  putOrgItem,
  getOrgItem,
  getArrayList
} from "@/api/admin/type";
import { getTenantData } from "@/api/admin/tenant";


export default {
  data() {
    return {
      type: "",
      labelPosition: "left",
      form: {
        treeItem: []
      },
      id: ""
    };
  },
  mounted() {
    this.getTenantData();
  },
  methods: {
    //当前租户是否有数据
    getTenantData() {
      getTenantData()
        .then(res => {
          console.log("res", res);
          if (res.code == 1) {
            res.data.map(val=>{
              if(val.orgFieldName.indexOf('组织')!=-1){
                val.orgFieldName=val.orgFieldName.replace('组织','租户')
              }
            })
            let list = [...res.data];
            let arr = [];
            let arr1 = [];
            for (let index of res.data) {
              if (
                index.orgFieldType === "checkbox" &&
                index.hasOwnProperty("orgFieldValue") === false
              ) {
                index.orgFieldValue = [];
              }
              if (
                index.orgFieldValues &&
                index.orgFieldValueType === "remote"
              ) {
                arr.push(index.orgFieldValues);
              }
            }
            if (arr.length > 0) {
              let newArr = Array.from(new Set(arr));
              for (let index of newArr) {
                let obj = {
                  code: index
                };
                arr1.push(obj);
              }
              getArrayList(arr1).then(res => {
                for (let index of list) {
                  for (let index1 in res.data) {
                    console.log(index1);
                    if (index.orgFieldValues === index1) {
                      let arr2 = [];
                      for (let index of res.data[index1]) {
                        let obj = {
                          label: index.name,
                          value: index.code
                        };
                        arr2.push(obj);
                      }
                      index.orgFieldValues = JSON.stringify(arr2);
                    }
                  }
                }
                console.log(list);
                this.form.treeItem = list;
              });
            } else {
              this.form.treeItem = list;
            }
          } else {
            this.$message("出现错误")
          }
        });
    },
    handleOrgAdd() {
      this.editOrganItem();
    },
    handleOrgClear() {
      this.$refs["form"].resetFields();
      this.form.treeItem.map(val=>{
        val.orgFieldValue='';
      })
    },
    editOrganItem() {
      putOrgItem(this.form.treeItem).then(res => {
        if (res.code === 1) {
          this.$message("编辑数据成功");
          // this.getTenantData();
        } else {
          this.$message("编辑数据失败");
        }
        this.$refs["form"].resetFields();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding: 20px;
}
/deep/.el-input__inner {
  width: 300px;
  //   padding: 5px 0 5px 3px;
}
.el-form-item__content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
  padding: 0 0 10px;
}
.el-form-item {
  margin: 0 0 10px 0;
}
</style>