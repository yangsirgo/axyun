<template>
  <div class="page height100">
    <el-form class="formPart">
      <!--标题-->
      <l-card-title>
        <span slot="left">个人信息</span>
      </l-card-title>
      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="机构">
            <el-input v-model="filter.orgName"></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="人员类别">
            <el-select
              v-model="filter.person"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="状态">
            <el-select
              v-model="filter.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sTatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>

      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.dept"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="职称">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.title"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择职称"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="档案完善">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.filePerfection"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择档案完善"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
      </el-row>
      <!--标题-->
      <l-card-title>
        <span slot="left">工作信息</span>
      </l-card-title>
      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="机构">
            <el-input v-model="filter.orgName"></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="人员类别">
            <el-select
              v-model="filter.person"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="状态">
            <el-select
              v-model="filter.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sTatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>

      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.dept"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="职称">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.title"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择职称"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="档案完善">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.filePerfection"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择档案完善"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
      </el-row>
      <!--标题-->
      <l-card-title>
        <span slot="left">教育信息</span>
      </l-card-title>
      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="机构">
            <el-input v-model="filter.orgName"></el-input>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="人员类别">
            <el-select
              v-model="filter.person"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="状态">
            <el-select
              v-model="filter.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sTatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
      </el-row>

      <el-row :gutter="8">
        <el-col :span="8">
          <l-formt-title label="科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.dept"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="职称">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.title"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择职称"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
        <el-col :span="8">
          <l-formt-title label="档案完善">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="filter.filePerfection"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择档案完善"
            ></l-value-domain>
          </l-formt-title>
        </el-col>
      </el-row>
      <!--标题-->
      <l-card-title>
        <span slot="left">业务权限</span>
      </l-card-title>

    </el-form>
    <div class="buttonPart">
      <el-button type="primary">保存</el-button>
      <el-button>打印</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      filter: {
        orgName: "",
        person: "",
        status: "",
        title: "",
        filePerfection: "",
        dept: "",
        search: ""
      }
    };
  },
  components: {}
};
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  padding: 8px 0 0 0;
  .formPart {
    flex: 1;
        .el-row {
      margin: 8px 0;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .buttonPart {
    line-height: 60px;
    text-align: end;
  }
}
</style>
