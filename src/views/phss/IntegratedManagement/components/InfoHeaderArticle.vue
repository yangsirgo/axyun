<template>
  <div class="InfoHeaderArticle">
    <div class="InfoHeaderArticle_main">
      <img class="img" src="../../../../assets/PublicHealth/Avatar.png" alt />
      <div>
        <span class="name">{{baseMes.rsdt_name}}</span>
        <span>{{baseMes.sex}}</span>
        <span>{{baseMes.age}}</span>
      </div>
      <div class="badge_group">
        <div class="badge" :class="dynamicClass(v)" v-for="(v,i) in baseMes.rsdtTypeDescs" :key="i">
          <span>{{v}}</span>
        </div>
      </div>
      <div>
        <i class="el-icon-edit cursor" @click="EditStatus"></i>
      </div>
    </div>
    <el-dialog title="修改人群类别" :visible.sync="CrowdCategoryVisible" width="650px">
      <div class="flex_c ml-20 mt-30 mb-10">
        <div class="pl-10 pr-10 title">人群类别</div>
        <el-checkbox-group v-model="CrowdCategoryCheckList">
          <el-checkbox label="普通"></el-checkbox>
          <el-checkbox label="老年人"></el-checkbox>
          <el-checkbox label="高血压"></el-checkbox>
          <el-checkbox label="糖尿病"></el-checkbox>
          <el-checkbox label="肺结核"></el-checkbox>
          <el-checkbox label="严重精神障碍"></el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CrowdCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="CrowdCategory()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { onSaveRsdtType } from "@/api/phss/docIndex/docIndex";
export default {
  name: "InfoHeaderArticle",
  components: {},
  props: {
    baseMes: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      CrowdCategoryVisible: false,
      CrowdCategoryCheckList: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    EditStatus() {
      this.CrowdCategoryCheckList = [];
      this.baseMes.rsdtTypeDescs.forEach(el => {
        // console.log("el", el);
        let temp = "";
        switch (el) {
          case "普":
            temp = "普通";
            break;
          case "老":
            temp = "老年人";
            break;
          case "高":
            temp = "高血压";
            break;
          case "糖":
            temp = "糖尿病";
            break;
          case "精":
            temp = "严重精神障碍";
            break;
          case "结":
            temp = "肺结核";
            break;

          default:
            break;
        }
        this.CrowdCategoryCheckList.push(temp);
      });
      this.CrowdCategoryVisible = true;
    },
    CrowdCategory() {
      let tempList = [];
      this.CrowdCategoryCheckList.forEach(el => {
        // console.log("el", el);
        let temp = "";
        switch (el) {
          case "普通":
            temp = "normal";
            break;
          case "老年人":
            temp = "old";
            break;
          case "高血压":
            temp = "hypertension";
            break;
          case "糖尿病":
            temp = "diabetes";
            break;
          case "肺结核":
            temp = "tuberculosis";
            break;
          case "严重精神障碍":
            temp = "mental";
            break;

          default:
            break;
        }
        // child 幼
        // pregnant 孕  孕产妇
        tempList.push(temp);
      });
      console.log("this.id", this.id, tempList);
      console.log("this.$parent", this.$parent.queryDocIndexDetail);
      onSaveRsdtType({ rsdtTypes: tempList, id: this.id })
        .then(res => {
          console.log(res.data);
          if (res.code == 1) {
            console.log("this.$parent", this.$parent);
            this.$message.success("修改成功！");
            this.$parent.queryDocIndexDetail();
          } else {
            this.$message.error("失败");
          }
        })
        .catch(err => {
          console.log("err", err);
        });
      this.CrowdCategoryVisible = false;
    },
    dynamicClass(v) {
      // console.log("v", v);
      let className = "";
      switch (v) {
        case "普":
          className = "lao";
          break;
        case "老":
          className = "pu";
          break;
        case "糖":
          className = "tang";
          break;
        case "高":
          className = "gao";
          break;
        case "精":
          className = "jing";
          break;
        case "结":
          className = "jie";
          break;

        default:
          break;
      }
      return className;
    }
  },
  watch: {},
  computed: {
    ordinary() {
      // console.log("this.CrowdCategoryCheckList", this.CrowdCategoryCheckList);
      if (
        this.CrowdCategoryCheckList == "" ||
        this.CrowdCategoryCheckList.length == 0
      ) {
        return false;
      }
      if (this.CrowdCategoryCheckList.length == 0) {
        this.CrowdCategoryCheckList.forEach((el, i) => {
          if (el == "普通") {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.CrowdCategoryCheckList.splice(i, 1);
          }
        });
      }

      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.InfoHeaderArticle {
  width: 100%;
  .InfoHeaderArticle_main {
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    img {
      margin: 0;
      margin-top: 20px;
      width: 100px;
      height: 100px;
    }
    .name {
      font-size: 20px;
      color: rgba(255, 255, 255, 1);
    }
    .badge_group {
      margin-top: 10px;
      margin-bottom: 3px;
      display: flex;
      justify-content: center;
      .badge {
        margin-left: 10px;
        width: 30px;
        height: 20px;
        text-align: center;
        border-radius: 10px;
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }
      .pu {
        background: #67c23a;
        border: 1px solid #67c23a;
      }
      .lao {
        background: rgba(54, 86, 255, 1);
        border: 1px solid rgba(54, 86, 255, 1);
      }
      .tang {
        background: #ef1011;
        border: 1px solid #ef1011;
      }
      .gao {
        background: #f26e40;
        border: 1px solid #f26e40;
      }
      .jing {
        background: #ffc109;
        border: 1px solid #ffc109;
      }
      .jie {
        background: #25d9f5;
        border: 1px solid #25d9f5;
      }
    }
    .badge_group:nth-child(1) {
      padding: 0;
    }
  }
  .title {
    font-size: 14px;
    color: rgba(148, 157, 163, 1);
  }
  font-size: 14px;
  color: rgba(46, 50, 58, 1);
}
</style>
