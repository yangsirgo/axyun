<template>
  <div class="cls height100">
    <el-form
      ref="recordForm"
      :model="treeForm"
      :rules="rules"
    >
      <el-form-item prop="adviceCategory">
        <LFormtTitle label="医嘱分类" required>
          <el-select v-model="treeForm.adviceCategory" @change="onChangeGetList">
            <el-option label="检查申请" value="0"></el-option>
            <el-option label="检验申请" value="1"></el-option>
            <el-option label="治疗申请" value="2"></el-option>
          </el-select>
        </LFormtTitle>
      </el-form-item>
      <el-form-item prop="catalogName">
        <LFormtTitle label="目录名称" required>
          <el-input v-model="treeForm.catalogName"
                    style="line-height: 34px;width:100%"
                    placeholder="请输入目录名称"
          >
          </el-input>
        </LFormtTitle>
      </el-form-item>
      <el-form-item prop="rank">
        <LFormtTitle label="排序" required>
          <el-input v-model.number="treeForm.rank"
                    style="line-height: 34px;width:100%"
                    placeholder="请输入排序"
          >
          </el-input>
        </LFormtTitle>
      </el-form-item>
      <el-form-item prop="statusCode">

        <LFormtTitle label="状态标识" required>
          <el-select v-model="treeForm.statusCode">
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
            <!--<el-option label="作废" value="2"></el-option>-->
          </el-select>
        </LFormtTitle>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"size="mini" @click="save(3)">保存目录</el-button>
        <el-button plain size="mini"  @click="save(1)">新增目录</el-button>
        <el-button plain size="mini"  @click="save(2)">新增下级目录</el-button>
      </el-form-item>
    </el-form>
    <div class="tree" style="height:calc(100% - 266px); margin-top: 15px" v-loading="loading">
      <el-table
        highlight-current-row
        @row-click="rowClick"
        row-key="id"
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        height="100%">
        <!-- 业务列 -->
        <el-table-column
          v-for="(item,index) in tableParams"
          :type="item.type"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="center"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <span>{{ scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    saveOrUpdateElectronicApplicationCatalog,
    getListByAdviceCategory
  } from '@/api/systemManagement/dataMaintain/adviceItem'

  export default {
    name: "leftTree",
    components: {},
    data() {
      let numberValidate=(rule,value,callback)=> {
        this.treeForm.rank = value;
        if (this.treeForm.rank != "") {
          const reg = /\d+/;
          if (reg.test(value)) {
            return callback();
          } else {
            return callback(new Error('请输入正确的数字'));
          }
        } else {
          return callback(new Error('请输入排序'))
        }
      }

      return {
        loading:false,
        treeForm: {
          statusCode: '',
          rank: '',
          catalogName: '',
          adviceCategory: '',
          parentId:'',
          id:''
        },
        rules: {
          rank: [
            {trigger: 'blur', required: true, message: '排序不能为空'},
            {validator:numberValidate, trigger: 'blur', message: '排序必须是数字'},
          ],
          catalogName : [{trigger: 'blur', required: true, message: '目录名称不能为空'}],
          adviceCategory : [ {trigger: 'blur', required: true, message: '医嘱分类不能为空'}]
        },
        tableData : [
        //   {
        //   id:1,
        //   status: '失效',
        //   order: '22',
        //   name: '一级菜单菜单',
        //   category: '111',
        //   children:[{
        //     id:11,
        //     status: '失效',
        //     order: '22',
        //     name: '二级菜单菜单',
        //     category: '111',
        //     children:[{
        //       id:111,
        //       status: '失效',
        //       order: '22',
        //       name: '三级菜单菜单',
        //       category: '111',
        //     }]
        //   }]
        // }
        ],
        tableParams:[{
          prop: 'catalogName',
          label: '医嘱目录',
          width: '50%'
        },   {
          prop: 'rank',
          label: '序号',
          width: '20%'
        },{
          prop: 'statusCode',
          label: '状态标识',
          width: '30%'
        }],
      };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
     //切换医嘱分类查询数据
      onChangeGetList()
      {
        let json = {};
        json.adviceCategory = this.treeForm.adviceCategory;
        this.getListByAdviceCategory(json);
      },

      rowClick(row) {
        console.log(row)
        this.$nextTick(()=>{
          this.$refs['recordForm'].resetFields();
          for (let key in this.treeForm) {
            this.treeForm[key] = row[key];
          }
        })
      },
      save (operationType){
        this.$refs["recordForm"].validate((valid) => {
          if (valid) {
           // alert('submit!');
            this.treeForm.operationType = operationType;
            switch (operationType) {
              case "2" :
                 this.treeForm.parentId = this.treeForm.id;
                    break;
            }
            console.log("treeForm" + JSON.stringify(this.treeForm));
            this.saveOrUpdateElectronicApplicationCatalog(this.treeForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      getListByAdviceCategory(obj) {
        getListByAdviceCategory(obj)
          .then(res => {
            if (res.code === 1) {
              this.tableData = res.data;
              console.log("this.tableData" +JSON.stringify(this.tableData));
            } else {
              this.$message('保存失败')
            }
          })
      },



      saveOrUpdateElectronicApplicationCatalog(obj) {
        saveOrUpdateElectronicApplicationCatalog(obj)
          .then(res => {
            if (res.code === 1) {
              this.$message('保存成功')
              this.getListByAdviceCategory(this.treeForm)
            } else {
              this.$message(res.msg)
            }
          })
      },

    },
    watch: {},
    computed: {}
  }
</script>

<style scoped lang="scss">
  .cls {
    padding: 5px;

    /deep/ .el-form-item__error {
      top: 68% !important;
    }

    .active {
      background-color: #c4e3f3;
    }

    .divContent {
      line-height: 36px;
      padding: 0 30px;
    }
  }
</style>
