<template>
  <div class="seq-container">
    <el-form :inline="true" :model="form" ref="form" class="seq-form">
      <el-form-item v-if="false">
        <el-input v-model="form.seqType" placeholder="请输入流水号名"></el-input>
      </el-form-item>
      <el-form-item v-if="false">
        <el-button type="primary" icon="el-icon-refresh" @click="handleSeqReset" plain>重置</el-button>
      </el-form-item>

      <el-form-item >
        <el-button type="primary" icon="el-icon-plus" @click="handleSeqAdd">添加</el-button>
      </el-form-item>

      <el-form-item >
        <el-button type="primary" icon="el-icon-search" @click="handleSeqQuery">查询</el-button>
      </el-form-item>

    </el-form>

    <el-table
      ref="seqTable"
      :data="seqLists"
      height='500'
      border
      stripe
      highlight-current-row
      class="seq-table"
      element-loading-text="加载中">
      <el-table-column
        v-for="(item, index) in seqParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="false" @click="handleSeqEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleSeqRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="seq-pagination" v-if="false">
      <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="form.pageSize"
        :page.sync="form.page"
        @pagination="changePageSize"/>
    </div>

    <seq-info-dialog
      :isShow.sync="dialogVisible"
      :seqData="seqData"
      title="新建流水号"
      @submit="handleSubmit"
      :dtypeData="dtype"
    />
  </div>
</template>

<script>
  import seqInfoDialog from './components/SeqInfoDialog'
  import { getSeqList, addSeq, deleteSeq } from '@/api/wconf/sequence'

  export default {
    data() {
      return {
        form: {
          page: 1,
          pageSize: 10,
          status: 0
        },
        seqParams: [
          {
            prop: 'seqType',
            label: '流水号名'
          },
           {
            prop: 'dtype',
            label: '类型'
          },
          {
            prop: 'currVal',
            label: '初始值'
          },
          {
            prop: 'formate',
            label: '格式',
            width: 200
          }
        ],
        dtype: [
          {
            val: '',
            label:"请选择"
          },
          {
            val: 'day',
            label: '按天'
          },
          {
            val: 'week',
            label: '按周'
          },
          {
            val: 'month',
            label: '按月',
          }
        ],
        seqData: {},
        seqList: [],
        seqLists:[],
        total: 0,
        dialogVisible: false
      }
    },
    components: {
      seqInfoDialog
    },
    mounted () {
      this.getSeqList()
    },
    methods: {
      getSeqList() {
        // 暂不分页，分页需传this.form作为参数
        getSeqList().then(res => {
          console.log(res.data)
           this.seqList = res.data
          for(var i=0;i<this.seqList.length;i++){
            for(var j=0;j<this.dtype.length;j++){
                if(this.seqList[i].dtype==""||this.seqList[i].dtype=="无"){
                  this.seqList[i].dtype="无";
                }else if(this.seqList[i].dtype==this.dtype[j].val){

                this.seqList[i].dtype=this.dtype[j].label;
              }
            }
          }
          this.seqLists=this.seqList;
          this.total = res.data.length
        }).catch(err => {
          console.log(err)
        })
      },
      handleSeqQuery() {
        /*
        let obj = {
          pageSize: 10,
          page: 1
        }

        this.form = { ...this.form, ...obj }
        */
        this.getSeqList()
      },
      handleSeqAdd() {
        this.seqData = {
          seqType: '',
          currVal: '',
          formate: ''
        }
        this.dialogVisible = true
      },
      handleSeqReset() {
        this.$refs.form.resetFields()
        let obj = {
          seqType: '',
          pageSize: 10,
          page: 1
        }
        this.form = { ...this.form, ...obj }
        this.getSeqList()
      },
      handleMultiSeqRemove() {

      },
      handleSeqRemove(row) {
        this.$confirm('您确定删除吗?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSeq(row).then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '删除流水号成功'
              })
              this.getSeqList()
            } else {
              this.$message({
                type: 'error',
                message: '删除流水号失败'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSeqEdit(row) {
        this.seqData = { ...row }
        this.dialogVisible = true
      },
      handleSubmit(data) {
        this.dialogVisible = false

        addSeq(data).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '添加流水号成功'
            })
            this.getSeqList()
          } else {
            this.$message({
              type: 'error',
              message: '添加流水号失败'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      changePageSize(obj) {
        this.form = { ...this.form, ...obj }
        this.getSeqList();
      },
    },
  }
</script>

<style lang="scss" scoped>
.seq-container {
  background-color: #fff;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}
.seq-form {
  overflow: hidden;

  .btns {
    float: right;
  }
}
.seq-table {
  margin: 20px 0;
}
.pagination-container {
  text-align: right;
}
</style>
