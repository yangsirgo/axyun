<template>
  <div class="IMInfo" v-loading="loading">
    <header class="IMInfo_header">
      <article class="header_article">
        <info-header-article :baseMes="baseMes" :id="id"></info-header-article>
      </article>
      <aside class="header_aside">
        <info-header-aside :baseMes="baseMes"></info-header-aside>
      </aside>
    </header>
    <main class="IMInfo_main">
      <article class="main_article">
        <header>
          <el-input placeholder="请输入" suffix-icon="el-icon-search" v-model="treeSearch"></el-input>
        </header>
        <main>
          <el-collapse class="main_collapse" v-model="activeNames">
            <el-collapse-item :name="index + 1" v-for="(v,index) in treeData" :key="index">
              <template slot="title">
                <p-svg style="width:24px;height:38px;" name="folder" />
                <div class="w100 pl-10">{{v.description}}</div>
                <div v-if="v.description != '居民健康档案管理'">
                  <div @click.stop="addMethod(v)" v-if="v.docTreeDTOs.length===1">
                    <p-svg name="add" style="width:24px;height:38px;" />
                  </div>
                  <!-- <div @click.stop="TheElderlyVisible = false" v-else>
                    <p-svg name="add" style="width:24px;height:38px;" />
                  </div>-->
                  <div v-else>
                    <el-popover title="请选择" placement="top" width="300" trigger="click">
                      <div>
                        <el-select style="width:100%;" v-model="TheElderlyValue" placeholder="请选择">
                          <el-option v-for="(item,i) in v.docTreeDTOs" :key="i" :value="i" :label="item.description"></el-option>
                        </el-select>
                      </div>
                      <div style="text-align: right; margin: 0">
                        <!-- <el-button class="mt-10" size="mini" @click="TheElderlyVisible = false">取消</el-button> -->
                        <el-button type="primary" size="mini" class="mt-10" @click="addMethod(v,'description')">确定</el-button>
                      </div>
                      <div slot="reference">
                        <p-svg name="add" style="width:24px;height:38px;" />
                      </div>
                    </el-popover>
                  </div>
                </div>
              </template>
              <div class="collapse_content" @click="viewMethod(item)" v-for="(item,i) in v.docs" :key="i">
                <div class="collapse_row">
                  <p-svg style="width:24px;height:18px;" name="doc" />
                  <div class="collapse_title pl-2">{{item.created_at}} {{item.created_by_name}}</div>
                </div>
                <div class="pl-26">{{item.create_org_name}}</div>
                <div class="collapse_operating">
                  <div @click.stop="editMethod(item)">
                    <p-svg name="edit" style="width:24px;height:18px;cursor:pointer;" />
                  </div>
                  <!-- <div @click.stop="deleteMethod()">
                    <p-svg name="delete" style="width:24px;height:18px;cursor:pointer;" />
                  </div>-->
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </main>
      </article>
      <aside class="main_aside" v-if="!loadingView" v-loading="loadingView" ref="main_aside">
        <div class="main_aside_father">
          <div class="main_aside_Mask" ref="main_aside_Mask"></div>
          <div class="main_aside_table" ref="main_aside_table">
            <TableView />
          </div>
        </div>
      </aside>
    </main>

    <TableDialog v-if="showDialog" ref="tableDialogRef" @saveMethod="saveMethod" :showDialog.sync="showDialog"></TableDialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
  import InfoHeaderArticle from "./components/InfoHeaderArticle";
  import InfoHeaderAside from "./components/InfoHeaderAside";
  import { onQueryDocIndexDetail } from "@/api/phss/docIndex/docIndex";
  import { onSaveDocCheckup, onQueryOneDocCheckup } from "@/api/phss/checkup/checkup";
  import { onPost, onGet } from "@/api/public/public";
  export default {
    name: "IMInfo",
    components: { InfoHeaderArticle, InfoHeaderAside },
    data() {
      return {
        treeSearch: "",
        save_method: "",
        tempId: "",
        id: "",
        loading: true,
        loadingView: true,
        showDialog: false,
        TheElderlyVisible: false,
        // 老年人选项
        TheElderlyValue: "",
        // 上方个人信息
        baseMes: {},
        // 左侧列表数据
        docTree: [],
        // 选中状态
        current: 0,
        // 折叠面板
        active: 1,
        activeNames: [1],
        // 切换表格视图
        curComponent: "HealthChecklistPage1"
      };
    },
    created() {
      console.log("this.$route.query.id", this.$route.query.id);
      this.id = this.$route.query.id;
      this.loading = true;
      this.queryDocIndexDetail();
      setTimeout(() => {
        console.log("document.body.offsetHeight", document.body.offsetHeight);
      }, 50);
    },
    computed: {
      ...mapGetters("table", ["tableConfiguration", 'BaseMesData']),
      treeData() {
        let target = [];
        // console.log("this.docTree", JSON.stringify(this.docTree));
        if (this.treeSearch == "") {
          return this.docTree;
        }
        var treeTemp = [];
        var docsTemp = [];
        for (var i = 0; i < this.docTree.length; i++) {
          var t = this.docTree[i];
          if (t.description.indexOf(this.treeSearch) != -1) {
            treeTemp.push(t);
          } else {
            docsTemp = [];
            for (var j = 0; j < t.docs.length; j++) {
              var d = t.docs[j];
              if (d.created_at.indexOf(this.treeSearch) != -1) {
                docsTemp.push(d);
              }
            }
            if (docsTemp.length > 0) {
              t.docs = docsTemp;
              treeTemp.push(t);
            }
          }
        }
        return treeTemp;
      }
    },
    mounted() {},
    methods: {
      ...mapActions({
        setConfiguration: "table/setConfiguration",
        setViewConfiguration: "table/setViewConfiguration",
        setAllStepData: "table/setAllStepData",
        setBaseMesData: "table/setBaseMesData"
      }),
      FirstView() {
        console.log("this.docTree", this.docTree[0]);
        let webTableName = this.docTree[0].docs[0].webTableName;
        let description = this.docTree[0].docs[0].description;
        let queryMethod = this.docTree[0].docs[0].queryMethod;
        let id = this.docTree[0].docs[0].id;
        onGet({ url: queryMethod, data: { id: id } })
          .then(res => {
            if (res.code === 1) {
              this.setConfiguration({
                tableName: webTableName,
                dataYear: "twentySeventeen",
                tableTitle: description,
                status: "view",
                editData: res.data,
                editChObject: res.data.chObject
              });
              setTimeout(() => {
                this.loadingView = false;
              }, 100);
              setTimeout(() => {
                this.DynamicMask();
              }, 150);
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 查询详细信息
      queryDocIndexDetail() {
        onQueryDocIndexDetail({ id: this.id })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.baseMes = res.data.baseMes;
              this.setBaseMesData(this.baseMes)
              this.docTree = res.data.docTree;
              this.FirstView();
              setTimeout(() => {
                this.loading = false;
              }, 100);
            } else {
              this.$message.error("获取数据失败");
              this.loading = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          });
      },
      // 确定保存
      saveMethod(row) {
        row.id = this.tempId;
        row.doc_index_id = this.id;
        console.log("saveMethod", this.save_method);
        onPost({ url: this.save_method, data: row })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.$message.success("保存成功");
              this.queryDocIndexDetail();
              this.$refs.tableDialogRef.initialize();
              this.$refs.tableDialogRef.OnClose();

            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          });
      },
      // 新增
      addMethod(row, val) {
        console.log("addMethod---", row);
        console.log("val",val)
        this.tempId = "";
        let tempRow = "";
        if (val == "description") {
          // console.log("row.docTreeDTOs", row.docTreeDTOs[this.TheElderlyValue]);
          tempRow = row.docTreeDTOs[this.TheElderlyValue];
        } else {
          tempRow = row.docTreeDTOs[0];
        }
        console.log("tempRow", tempRow);
        this.save_method = tempRow.saveMethod;
        this.setConfiguration({
          status: "add",
          tableName: tempRow.webTableName,
          dataYear: "twentySeventeen",
          tableTitle: tempRow.description
        });
        this.TheElderlyValue = "";
        this.TheElderlyVisible = false;
        this.showDialog = true;
      },
      // 查看
      viewMethod(row) {
        this.loadingView = true;
        console.log("viewMethod---", row);
        this.tempId = row.id;
        onGet({ url: row.queryMethod, data: { id: this.tempId } })
          .then(res => {
            if (res.code === 1) {
              setTimeout(() => {
                this.setConfiguration({
                  tableName: row.webTableName,
                  dataYear: "twentySeventeen",
                  tableTitle: row.description,
                  status: "view",
                  editData: res.data,
                  editChObject: res.data.chObject
                });
                this.loadingView = false;
              }, 100);
              setTimeout(() => {
                this.DynamicMask();
              }, 150);
            } else {
              this.$message.error("获取数据失败");
              this.loadingView = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.loadingView = false;
          });
      },
      // 编辑
      editMethod(row) {
        console.log("editMethod---", row);
        this.save_method = row.saveMethod;
        this.tempId = row.id;
        onGet({ url: row.queryMethod, data: { id: this.tempId } })
          .then(res => {
            if (res.code === 1) {
              this.setConfiguration({
                tableName: row.webTableName,
                dataYear: "twentySeventeen",
                tableTitle: row.description,
                status: "edit",
                editData: res.data,
                editChObject: res.data.chObject
              });
              this.showDialog = true;
            } else {
              this.$message.error("获取数据失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      // 动态蒙版
      DynamicMask() {
        // console.log("this.main_aside", this.$refs.main_aside.offsetHeight - 76);
        // this.$refs.main_aside_Mask.style.height =
        //   this.$refs.main_aside.offsetHeight - 95 + "px";
        this.$refs.main_aside_Mask.style.height =
          this.$refs.main_aside_table.offsetHeight - 70 + "px";
        // console.log("this.main_aside", this.$refs.main_aside.offsetWidth);
        // console.log("this.$refs.main_aside.style", this.$refs.main_aside.style);
      }
    },
    watch: {}
  };
</script>

<style lang="scss">
  .el-popper{
      z-index: 2000 !important;
      padding: 5px;
    }
  .IMInfo {
    padding: 30px;
    background: #f0f3f5;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    overflow-x: hidden;

    .IMInfo_header {
      display: flex;
      width: 100%;
      height: 220px;

      .header_article {
        width: 200px;
        background: rgba(44, 70, 130, 1);
        border-radius: 8px;
      }

      .header_aside {
        flex: 1;
        margin-left: 5px;
        background: #fff;
        border-radius: 4px;
      }
    }

    // main
    .IMInfo_main {
      margin-top: 10px;
      display: flex;

      .main_article {
        flex: 1;
        max-width: 300px;
        background: #fff;
        border-radius: 4px;

        header {
          padding: 20px;
        }

        main {
          padding: 0 1px;

          .main_collapse {
            .el-collapse {
              border-top: 1px solid #ffffff;
              border-bottom: 1px solid #ffffff;
            }

            /deep/.el-collapse-item__header {
              font-size: 14px;
              font-weight: bold;
              height: 44px;
              line-height: 44px;
              color: rgba(46, 50, 58, 1);
              background: rgba(241, 244, 246, 1);
              border-bottom: 1px solid #fff;
              padding: 0 10px 0 20px;
            }

            /deep/.el-collapse-item__arrow {
              display: none;
            }

            /deep/.el-collapse-item__wrap {
              will-change: height;
              background-color: #fff;
              overflow: hidden;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              border-bottom: 1px solid #fff;
            }

            /deep/.el-collapse-item__content {
              // padding-bottom: 1px;
              padding: 0;
            }

            .collapse_content {
              cursor: pointer;
              width: 298px;
              height: 74px;
              padding: 18px 0 0 30px;
              position: relative;

              .collapse_operating {
                position: absolute;
                right: 10px;
                top: 10px;
                display: flex;
                align-items: center;
              }

              .collapse_row {
                display: flex;
                align-items: center;

                .collapse_title {
                  font-size: 14px;
                  font-weight: bold;
                  color: rgba(46, 50, 58, 1);
                }
              }

              // background: rgba(241, 244, 246, 1);
              // opacity: 0.4;
            }
          }
        }
      }

      .main_aside {
        flex: 1;
        margin-left: 10px;
        padding: 20px 0;
        background: #fff;
        border-radius: 4px;

        .main_aside_father {
          position: relative;

          .main_aside_Mask {
            position: absolute;
            // background-color: #9d9d9d;
            z-index: 2;
            width: 100%;
          }

          .main_aside_table {
            width: 815px;
            margin: 0 auto 0px;
            background-color: #fff;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .popperclass {
    font-weight: 600;
    color: #884422;

    .el-popover__title {
      color: #303133;
      font-size: 16px;
      line-height: 1;
      margin-bottom: 12px;
      font-weight: 600;
    }

    /deep/.el-button {
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
      width: 56px;
      height: 28px;
    }
  }
</style>
