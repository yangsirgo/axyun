<template>
  <div class="width100 height100 knowledge-container" v-loading="loading">
    <el-button @click="testName">测试</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane label="合理点评" name="comment">
        <div class="section" v-for="(item, index) in comment" :key="'c' + index">
          <p class="title">{{item.title}}</p>
          <p class="content">{{item.content}}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="说明书" name="instruction">
        <div class="section" v-for="(item, index) in instruction" :key="'i' + index">
          <p class="title">{{item.title}}</p>
          <p class="content">{{item.content}}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

// 知识库
export default {
  props: {
    sid: {
      type: String
    }
  },
  watch: {
    sid: {
      immediate: true,
      handler() {
        this.loadInfo();
      }
    },
    count: {
      handler() {
        console.log("count change2")
      }
    }
  },
  computed: {
    ...mapGetters("cis", ["count"]),
  },
  data() {
    return {
      activeName: "comment",
      // 合理点评
      comment: [
        {
          title: "成分",
          content:
            "本品的主要成分为七叶皂苷钠A和七叶皂苷钠B，是从七叶树科植物天师栗的干燥成熟种子中提取的一种含酯键的三萜皂苷。"
        },
        {
          title: "适应症",
          content: "用于脑水肿、创伤或手术所致肿胀，也用于静脉回流障碍性疾病。"
        },
        {
          title: "用法用量",
          content:
            "静脉注射或静脉滴注。成人按体重一日0.1～0.4mg/kg，或取本品5～10mg溶于10%葡萄糖注射液或0.9%氯化钠注射液250ml中供静脉滴注；也可取本品5～10mg溶于10～20ml 10%葡萄..."
        },
        {
          title: "不良反应",
          content:
            "可见注射部位局部疼痛、肿胀，经热敷可使症状消失。 偶有过敏反应，可按药物过敏处理原则治疗。"
        }
      ],
      // 说明书
      instruction: [
        {
          title: "成分",
          content:
            "本品的主要成分为七叶皂苷钠A和七叶皂苷钠B，是从七叶树科植物天师栗的干燥成熟种子中提取的一种含酯键的三萜皂苷。"
        },
        {
          title: "适应症",
          content: "用于脑水肿、创伤或手术所致肿胀，也用于静脉回流障碍性疾病。"
        },
        {
          title: "用法用量",
          content:
            "静脉注射或静脉滴注。成人按体重一日0.1～0.4mg/kg，或取本品5～10mg溶于10%葡萄糖注射液或0.9%氯化钠注射液250ml中供静脉滴注；也可取本品5～10mg溶于10～20ml 10%葡萄..."
        },
        {
          title: "不良反应",
          content:
            "可见注射部位局部疼痛、肿胀，经热敷可使症状消失。 偶有过敏反应，可按药物过敏处理原则治疗。"
        }
      ],

      loading: false
    };
  },
  methods: {
    async loadInfo() {
      if (!this.sid) {
        return;
      }
      try {
        this.loading = true;
        // TODO await request
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    },
    testName() {
      this.$store.dispatch("cis/testCount", Math.random())
    }
  }
};
</script>
<style lang="scss" scoped>
.section {
  margin: 10px 0px 20px 0px;
}
.title {
  color: $l-color-fontcolor-3;
  font-size: 14px;
  margin-bottom: 3px;
}
.content {
  color: $l-color-fontcolor-4;
  font-size: 14px;
}

</style>