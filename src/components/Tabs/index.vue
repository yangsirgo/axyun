<template>
    <div class="my-tabs">
        <div class="tabs-bar">
            <div class="tabs-bar-nav">
                <div class="tabs-tab"
                     v-for="(tab,index) in tabList"
                     :key = index
                     :class="[tabIndex == tab.index ? 'tabs-active' : '']"
                     @click="changeTab(tab)">
                    <i :class="tab.icon"></i>
                    {{tab.name}}
                </div>
            </div>
        </div>
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'MyTabs',
        props:
            {
                tabList: Array,
                tabIndex: Number
            },
        data () {
            return {
            }
        },
        methods: {
            changeTab: function (tab) {
                this.$emit('changeTab', tab)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .my-tabs {
        font-size: 14px;
        .tabs-bar {
            border-bottom: 1px solid #eee;
            position: relative;
            padding: 20px 0;
            .tabs-bar-nav {
                display: flex;
               justify-content: center;
                .tabs-tab {
                    min-width: 110px;
                    padding: 9px 18px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    cursor: pointer;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
                    border-radius: 4px;
                    margin:0 40px;
                    &::after{
                        width:44px;
                        height: 1px;
                        background: #C5CBCF;
                        content: "";
                        position: absolute;
                        right:-60px;
                        top:22px;
                    }
                    &:last-child{
                        &::after{
                            background-color:transparent;
                        }
                    }
                    i{
                        font-size:24px;
                        vertical-align: middle;
                        padding-right:10px;
                    }
                }

                .tabs-active {
                    background-color:$l-color-primary;
                    color:#ffffff;
                }
            }
        }
    }




    .tabs-content {
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        /*padding-bottom: 30px;*/
    }
</style>
