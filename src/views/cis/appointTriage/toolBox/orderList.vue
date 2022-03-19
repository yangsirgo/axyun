<template>
  <div class="">
    <div class="botton-cont">
      <div style="margin-left:20px">
        <l-card-title>
          <template slot="left"
            >张军预约记录</template
          >
        </l-card-title>
      </div>
      <div class="table mar-top-10">
        <el-table :data="tableLeftData" width="100%" height="208px" border>
          <el-table-column
            v-for="(item, index) in tableLeftParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="left"
            :align="item.align || 'left'"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'hospitalnum'">
                <span class="color-hospital">{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  methods: {},
  components: {},
  data() {
    return {
      tableLeftData: [
        {
          id: 12,
          orderTime: "2018-05-04",
          orderOffice: "普外科",
          isVisit: "完诊"
        }
      ],
      tableLeftParams: [
        {
          prop: "orderTime",
          label: "预约时间",
          width: "40",
          align: "left"
        },
        {
          prop: "orderOffice",
          label: "预约科室",
          width: "40",
          align: "left"
        },
        {
          prop: "isVisit",
          label: "是否就诊",
          width: "40",
          align: "left"
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
</style>
