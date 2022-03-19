<template>
  <div id="macrosLibrary" class="macros-library">
    <div id="searchBox" class="search-box">
      <!-- 检索 -->
      <el-input
        class="keyword"
        placeholder="请输入检索条件"
        v-model="keyword"
        @keyup.enter.native="load"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="load"
        ></el-button>
      </el-input>
    </div>
    <!-- 检索结果 -->
    <div id="results">
      <ul class="macro-list">
        <li
          v-for="(value, index) in macros"
          :key="index"
          @click="baseEleClick(value, index)"
        >
          {{ value.mrShareEleNm }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {getMacros} from '@/api/emrRecord/emr/element';


  export default {
    name: "docToolBasicElement",
    data() {
      return {
        macros: [],
        keyword: ''
      }
    },
    computed: {
      ...mapGetters("nurseDocument", ["nursingTreeData"])
    },
    watch: {
      nursingTreeData: {
        handler(val) {
          this.nursingTreeDataSave = [];
          if (val && val.length > 0) {
            this.nursingTreeDataSave = [...val];
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.changeBasicElement({});
    },
    mounted() {
      this.load();
    },
    methods: {
      ...mapActions({
        changeBasicElement: 'nurseDocument/changeBasicElement'
      }),
      async load() {
        try {
          let response = await getMacros({mrShareEleNm: this.keyword});
          if (response.code == 1) {
            this.macros = response.data;
          }
        } catch (e) {
          this.$message.error(e.msg || "加载失败，请重试！");
        }
      },
      baseEleClick(value, index) {
        // console.log(value);
        this.changeBasicElement({
          elementCode: value.mrShareEleCd,
          elementName: value.mrShareEleNm,
          id: value.mrShareEleId,
          elementBaseName: '基本元素',
          dataElementId: "",
          dataElementName: "",
          dataVersion: 0,
          elementBaseId: "",
          organizationId: "",
          commonAttributeDto: {
            borderPlaceholder: "0",
            borderStyle: "",
            borderType: "",
            checkDeletable: "1",
            checkDisplay: "1",
            checkEdit: "0",
            checkEmpty: "0",
            checkHidden: "0",
            checkPrintable: "0",
            checkReadonly: "0",
            checkReference: "0",
            checkSecret: "0",
            checkSource: "0",
            dataVersion: 0,
            elementId: "",
            id: value.mrShareEleId,
            nameStyle: "",
            placeholderText: "",
            tooltipText: ""
          },
          proprietaryAttributeVoLst: [],
          valueLst: [],
          ...value
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.macros-library {
  padding: 0 !important;
  padding-left: 1px;

  .search-box {
    padding: 10px;
    border-bottom: 1px solid #c5cbcf;
  }

  #results {
    overflow-y: auto;

    .macro-list {
      overflow: hidden;
      margin-bottom: 10px;
      border-left: 1px solid #c5cbcf;

      li {
        float: left;
        width: 50%;
        padding: 15px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #c5cbcf;
        border-right: 1px solid #c5cbcf;
        text-align: center;
        font-size: 14px;
        color: #2e323a;
        cursor: pointer;
        user-select: none;

        &:hover {
          background: $l-color-bgcolor-1;
        }
      }
    }
  }
}
</style>
