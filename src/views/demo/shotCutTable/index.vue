<template>
  <div>
    <vxe-grid
      border
      show-overflow
      keep-source
      resizable
      ref="xTable"
      height="600"
      class="my-xtable-element"
      :loading="loading"
      :data="tableData"
      :toolbar="tableToolbar"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}">
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column type="seq" width="80">
        <template v-slot:header>
          <span>序号</span>
          <i class="el-icon-question"></i>
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" title="ElInput" min-width="140" :edit-render="{autofocus: '.el-input__inner'}">
        <template v-slot:edit="scope">
          <el-input v-model="scope.row.name" v-axShotcut :shotindex="1" :shotready="checkReady(scope.row, 'name')"></el-input>
        </template>
        <template v-slot="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="role" title="ElAutocomplete" min-width="160" :edit-render="{}">
        <template v-slot:edit="{ row }">
          <el-input v-model="row.role" v-axShotcut :shotindex="3" :shotready="!!row.role" @ended.native="endHandler(1)"></el-input>
        </template>
      </vxe-table-column>
      <vxe-table-column field="date" title="ElDatePicker" width="200" :edit-render="{}">
        <template v-slot:edit="{ row }">
          <l-shotcut-input component="el-date-picker" v-model="row.date" type="date" format="yyyy/MM/dd" v-axShotcut :shotindex="2" :shotready="!!row.date" @ended.native="endHandler(2)" @change="changeHandler"></l-shotcut-input>
        </template>
        <template v-slot="{ row }">{{ formatDate(row.date, 'yyyy/MM/dd') }}</template>
      </vxe-table-column>
      <vxe-table-column field="date1" title="ElDatePicker" width="220" :edit-render="{}">
        <template v-slot:edit="{ row }">
          <el-date-picker v-model="row.date1" type="datetime" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
        <template v-slot="{ row }">{{ formatDate(row.date1, 'yyyy-MM-dd HH:mm:ss') }}</template>
      </vxe-table-column>
      <vxe-table-column field="date2" title="ElTimePicker" width="200" :edit-render="{}">
        <template v-slot:edit="{ row }">
          <el-time-select v-model="row.date2" :picker-options="{start: '08:30', step: '00:15', end: '18:30'}"></el-time-select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="rate" title="ElRate" width="200">
        <template v-slot="{ row }">
          <el-rate v-model="row.rate"></el-rate>
        </template>
      </vxe-table-column>
      <vxe-table-column field="flag" title="ElSwitch" width="100">
        <template v-slot="{ row }">
          <el-switch v-model="row.flag"></el-switch>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="160" fixed="right">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-grid>

  </div>
</template>

<script>
import XEUtils from 'xe-utils'

export default {
  data () {
    return {
      loading: false,
      tableData: [],
      sexList: [{
        label: "男",
        value: 1
      }, {
        label: "女",
        value: 2
      }],
      regionList: [],
      restaurants: [
        { value: '前端', name: '前端' },
        { value: '后端', name: '后端' }
      ],


      // 表格配置
      tableToolbar: {
        buttons: [
          { code: 'insert_actived', name: '新增' },
          { code: 'mark_cancel', name: '标记/取消' },
          { code: 'save', name: '保存' }
        ],
        custom: true
      },
    }
  },
  created () {
    this.tableData = [{
      "name": 1,
      "role": 1,
      "age": 1,
      "sex": 1,
      "sex1": 1,
      "region": 1,
      "date": new Date(),
      "date1": new Date(),
      "date2": new Date(),
      "color1": 1,
      "rate": 1,
      "flag": 1,
    }];
    // this.columnDrop();
  },
  methods: {
    checkReady(row, prop) {
      return row[prop] == 'zhkuang'
    },
    formatDate (value, format) {
      return XEUtils.toDateString(value, format)
    },
    getSelectLabel (value, list, valueProp = 'value', labelField = 'label') {
      const item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelField] : null
    },
    getSelectMultipleLabel (value, list, valueProp = 'value', labelField = 'label') {
      return value.map(val => {
        const item = XEUtils.find(list, item => item[valueProp] === val)
        return item ? item[labelField] : null
      }).join(', ')
    },
    getCascaderLabel (value, list) {
      const values = value || []
      const labels = []
      const matchCascaderData = function (index, list) {
        const val = values[index]
        if (list && values.length > index) {
          list.forEach(item => {
            if (item.value === val) {
              labels.push(item.label)
              matchCascaderData(++index, item.children)
            }
          })
        }
      }
      matchCascaderData(0, list)
      return labels.join(' / ')
    },
    roleFetchSuggestions (queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    
    // 操作
    editRowEvent (row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent (row) {
      console.log(this.$refs.xTable.getActiveRecord());
      return
      // this.$refs.xTable.clearActived().then(() => {
      //   this.loading = true
      //   setTimeout(() => {
      //     this.loading = false
      //     this.$XModal.message({ message: '保存成功！', status: 'success' })
      //   }, 300)
      // })
    },
    cancelRowEvent (row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },

    changeHandler() {
      console.log()
    },

    // 触发到了最后一个
    endHandler(val) {
      console.log("--end--", val);
    }
  }
}
</script>

<style lang="scss">
.vxe-header--row .vxe-header--column.sortable-ghost,
.vxe-header--row .vxe-header--column.sortable-chosen {
  background-color: #dfecfb;
}
.vxe-header--row .vxe-header--column.col--fixed {
  cursor: no-drop;
}
</style>

