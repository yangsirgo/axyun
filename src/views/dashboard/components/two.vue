<template>
    <div ref="page">
    <el-form  label-suffix=":" size="small"  label-position="right" label-width="100px" style="height: 100%">
        <el-row  type="flex" :gutter ="20" justify="start" align="top" style="height: 100%; overflow: hidden">
            <el-col :span="4" style="height: 100%;width:287px;">
                <el-card style="height: 100%" >
                    <el-tabs v-model="first">
                        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
            <el-col :span="20" style="height: 100%;width:100%;overflow: hidden">
                <el-card style="margin-bottom: 20px;">
                    <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
                </el-card>
                <el-row  type="flex" :gutter ="20" justify="start" align="top" style="height: 100%">
                    <el-col :span="6" style="height: 100%">
                        <el-card style="height: 100%">
                            <el-tabs v-model="first">
                                <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
                            </el-tabs>
                        </el-card>
                    </el-col>
                    <el-col :span="18" style="height: 100%">
                        <el-card style="height: 100%">
                            <el-table :data="data" style="width: 100%">
                                <el-table-column  props="date" label="日期" width="180"></el-table-column>
                                <el-table-column  props="name" label="姓名" width="180"></el-table-column>
                                <el-table-column  props="address" label="地址" width="180"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-form>
    </div>

</template>
<script>
    import adHeight from '@/mixins/adHeight'
    export default {
        mixins:[adHeight],
        data(){
            return{

            }
        }
    }
</script>
