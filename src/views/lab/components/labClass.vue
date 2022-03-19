<template>
  <div>

    <el-menu default-active="2" class="el-menu-vertical-demo">
      <el-submenu index="1">
        <template slot="title">
          <span>科室套餐</span>
        </template>

        <el-menu-item v-for="(item) in deptPackage"
                      :index="item.id"
                      >{{item.name}}
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <span>个人套餐</span>
        </template>

        <el-menu-item v-for="(item) in personalPckage"
                      :index="item.id"
        >{{item.name}}
        </el-menu-item>


      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
    export default {
        name: "applyClass",
        data() {
            return {
                deptPackage: [
                    {
                        "id": "d123",
                        "name": "科室套餐一"
                    },
                    {
                        "id": "d456",
                        "name": "科室套餐二"
                    },
                    {
                        "id": "d789",
                        "name": "科室套餐三"
                    }
                ],
                personalPckage: [
                    {
                        "id": "p123",
                        "name": "个人套餐一"
                    },
                    {
                        "id": "p456",
                        "name": "个人套餐二"
                    },
                    {
                        "id": "p789",
                        "name": "个人套餐三"
                    }
                ]
            }
        },
        created() {

        }

    }
</script>

<style scoped>

</style>
