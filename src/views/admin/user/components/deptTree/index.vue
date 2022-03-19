<template>
  <el-dialog :visible.sync="deptVisible" title="科室选择" class="tree_dialog"  :before-close="handleCancel">
    <div class="tree_box" style="height: 100%;padding-bottom:20px;">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 255px;margin:10px 20px;height: 38px;"></el-input>
      <el-tree
        :data="data"
        default-expand-all
        node-key="id"
        :default-checked-keys="id"
        ref="tree"
        highlight-current
        :filter-node-method="filterNode"
        show-checkbox
        style="height: 350px;overflow-y: auto;margin-left: 20px"
        @check-change="handleCheck"
        :check-strictly=true
        :props="defaultProps"
      >
      </el-tree>
      <div style="text-align: right;margin-right: 30px">
        <span >
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
       </span>
      </div>

    </div>


  </el-dialog>
</template>
<script>
  import {getOrgTree} from "@/api/admin/type"
import { log } from 'util'
  export default {
    data(){
      return{
        isCheck:false,
        data: [],
        filterText: "",
        checkedId:'',
        deptItem:{},
        defaultProps: {
          children: 'children',
          label: 'label',
          disabled: this.disabledFn,
        }

      }
    },
    mounted(){
      this.getOrgTree()
    },
    props: {
      deptVisible: {
        type: Boolean,
        default() {
          return false
        }
      },
      id: {
        type: Array,
        default() {
          return []
        }
      },

    },
    methods:{
      //清空树
      clearTree(){
        if(this.id.length <= 0 && this.deptItem){
          this.$nextTick(function() {
            this.$refs.tree.setCheckedKeys([])
          })
        }
      },
      disabledFn(data, node){
          if(data.exts.orgType == "_ORG_" || data.exts.orgType == "_HOS_"){
            return true;
          }
      },
      //加载树
      getOrgTree(data) {
        getOrgTree(data)
          .then(res => {
            if(res.code === 1){
              console.log(res.data)
              this.data = res.data;
              console.log("res.data****",res.data)

            }else{
              this.$message('请求数据失败')
            }
          })
      },
      // 确定按钮
      handleOk(){
        let data = this.$refs.tree.getCheckedNodes();
        console.log(data)
            if(data){
            this.$emit("dialogDept",data[0])
            return;
            }

        if(data.length <= 0){
          this.deptItem = {}
          this.$emit("dialogDept",this.deptItem)
        }

      },
      //取消按钮
      handleCancel(){
        if(this.id.length <= 0 && this.deptItem){
          this.deptItem = {}
          this.clearTree()
        }
        this.$emit("dialogDept",this.deptItem)
      },
      //单选
      handleCheck(data,check){
        console.log(data,check)
        if (check) {
          let arr = [data.id];
          this.$refs.tree.setCheckedKeys(arr);
        }
      },
      //搜索显示子节点
      filterNode(value, data,node) {
        if(!value){
          return true;
        }
        let _array = [];
        this.getReturnNode(node,_array,value);
        let result = false;
        _array.forEach((item)=>{
          result = result || item;
        });
        return result;
      },
      getReturnNode(node,_array,value){
        let isPass = node.data &&  node.data.label && node.data.label.indexOf(value) !== -1;
        // eslint-disable-next-line no-unused-expressions
        // isPass ? _array.push(isPass) : '';
            if(isPass) {
        _array.push(isPass)
      }
        this.index++;
        console.log(this.index)
        if(!isPass && node.level != 1 && node.parent){
          this.getReturnNode(node.parent,_array,value);
        }
      },
    },

    watch:{
      //监听id
      id: function (val) {
        if(val.length <= 0 && this.deptItem){
          this.clearTree();
        }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }

    }

  }
</script>
<style lang="scss" scoped>
  /deep/.el-form-item__content {
    margin-left: 0px!important;
  }

</style>
