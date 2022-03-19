<template>
  <div class="img_card">
    <el-card class="width100 height100" @click.native="handlerClick">
      <div style="overflow: auto" class="height100">
        <div style="margin: 10px; border-bottom: 1px solid #dcdfe6">
          <el-checkbox style="margin: 10px" v-model="selected"
            >{{ myInfo.imageName }}{{ myInfo.format }}</el-checkbox
          >
          <span style="float: right; margin: 10px">{{
            myInfo.imageTypeNm
          }}</span>
        </div>
        <div style="text-align: center; margin-bottom: 20px">
          <div style="width: 200px; height: 200px; margin-left: 40px">
            <img
              alt="图片"
              :src="'http://' + myInfo.masterUrl + myInfo.imageUrlId"
              style="
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
              "
            />
          </div>
          <el-row style="margin-top: 10px">
            <el-col :span="12" style="text-align: right">
              <span>所属级别:</span>
            </el-col>
            <el-col :span="12" style="text-align: left">
              <span
                style="margin-left: 20px"
                :val="myInfo.ownerType"
                code="LevelType"
                v-code-transformEmr
              ></span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="12" style="text-align: right">
              <span>图片所属:</span>
            </el-col>
            <el-col :span="12" style="text-align: left">
              <span
                style="margin-left: 20px"
                v-if="myInfo.ownerType === '0'"
                tableName="sys_org"
                :conditionMap="{ id: myInfo.ownerId }"
                columns="org_nm"
                v-tableTransformEmr
              ></span>
              <div
                style="margin-left: 20px"
                v-else-if="myInfo.ownerType === '1'"
                v-for="(item, index) in myInfo.ownerId.split(',')"
                :key="item"
              >
                <span
                  tableName="sys_org"
                  :conditionMap="{ id: item }"
                  columns="org_nm"
                  v-tableTransformEmr
                ></span>
                <i v-if="index != myInfo.ownerId.split(',').length - 1">、</i>
              </div>
              <span
                style="margin-left: 20px"
                v-else-if="myInfo.ownerType === '2'"
                tableName="sys_user"
                :conditionMap="{ id: myInfo.ownerId }"
                columns="name"
                v-tableTransformEmr
              ></span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="12" style="text-align: right">
              <span>医护标识:</span>
            </el-col>
            <el-col :span="12" style="text-align: left">
              <span
                style="margin-left: 20px"
                :val="myInfo.dnFlag"
                code="EmployeeMark"
                v-code-transformEmr
              ></span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="12" style="text-align: right">
              <span>启用标识:</span>
            </el-col>
            <el-col :span="12" style="text-align: left">
              <span
                style="margin-left: 20px"
                :val="myInfo.enabled"
                code="ModelStatus"
                v-code-transformEmr
              ></span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ImageCard",
  props: {
    info: Object,
    imageTypeMap: Map,
  },
  data() {
    return {
      selected: false,
      myInfo: {
        imageType: "2222",
        imageName: "1111",
        format: ".jpg",
        fileUrl: "",
        dnFlag: "",
        enabled: "",
        ownerId: "",
        ownerType: "",
        imageTypeNm: "",
      },
      timer: null,
    };
  },
  methods: {
    handlerClick(e) {
      let fn = this.debounce(() => {
        this.selected = !this.selected;
        this.$emit("card-click", this.myInfo, this.selected);
      });
      fn();
    },
    debounce(fn) {
      return (...arg) => {
        if (this.timer) {
          clearTimeout();
        }
        this.timer = setTimeout(() => {
          fn.apply(this, arg);
        });
      };
    },
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.myInfo = Object.assign(val);
            this.$set(
              this.myInfo,
              "imageTypeNm",
              this.imageTypeMap.get(this.myInfo.imageType)
            );
          });
        }
      },
    },
  },
};
</script>

<style type="scss" scoped>
.img_card {
  width: 300px;
  height: 430px;
  padding: 10px;
  display: inline-block;
}
</style>
