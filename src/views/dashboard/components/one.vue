<template>
    <div class="box_container clearfix" ref="page">
        <div class="box_left">
            <div v-if="show" style="height: 100%">

                <div class="tigger" @click="handleShow">
                    <i class="el-icon-arrow-right" ></i>
                </div>
                <el-card class="box-card" style="height: 100%">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="我的患者" name="first">
                            <el-table
                                    :data="tableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="userNum"
                                        label="床号"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="住院号"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="姓名">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="本组患者" name="second">

                        </el-tab-pane>
                        <el-tab-pane label="本科患者" name="third">

                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
            <div v-else style="height: 100%;width:80px">
                <div class="tigger" @click="handleShow">
                    <i class="el-icon-arrow-right" ></i>
                </div>
                <el-card class="box-card" style="height: 100%;width:100%" >
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="我的患者" name="first">
                            <el-table
                                    :data="tableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="userNum"
                                        label="床号"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="住院号"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="姓名">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="本组患者" name="second">

                        </el-tab-pane>
                        <el-tab-pane label="本科患者" name="third">

                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>

        </div>


        <div :class="show ? 'box_content':'box_content1' ">
            <div class="msg_header clearfix">
                <div class="person fl">
                <span>
                    <span class="person_num">04</span>
                    <span class="person_number">000098732</span>
                    <span>李小芬</span>
                    <span class="pad20">女</span>
                    <span>21岁</span>
                </span>

                </div>
                <div class="docter fl">
                    <div class="docter_box">
                        <div class="box_item">
                            <span>主治医师：</span><span>张扬</span>
                            <span>入院日期：</span><span>2019-04-14 （7天）</span>
                        </div>
                        <div class="box_item">
                            <span>紫外线过敏</span>
                            <span>肾结石</span>
                            <span>血尿查因</span>
                        </div>
                    </div>

                </div>
            </div>
            <div class="msg_bottom">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="门诊" name="first">
                            <el-timeline>
                                <el-timeline-item timestamp="泌尿外科-张磊" placement="top">
                                    <div>
                                        <h4>泌尿道感染</h4>
                                        <p>住院13天</p>
                                        <p>2019-04-04</p>
                                    </div>
                                </el-timeline-item>
                                <el-timeline-item timestamp="泌尿外科-张磊" placement="top">
                                    <div>
                                        <h4>泌尿道感染</h4>
                                        <p>住院13天</p>
                                        <p>2019-04-04</p>
                                    </div>
                                </el-timeline-item>
                                <el-timeline-item timestamp="泌尿外科-张磊" placement="top">
                                    <div>
                                        <h4>泌尿道感染</h4>
                                        <p>住院13天</p>
                                        <p>2019-04-04</p>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-tab-pane>
                        <el-tab-pane label="住院" name="second">

                        </el-tab-pane>

                    </el-tabs>
                </el-card>

                <div class="box_tabs">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="患者档案" name="first">
                            <!--<div>
                                <div>住院记录</div>

                                <div>
                                   <div v-for="item in items">

                                   </div>
                                </div>
                            </div>-->
                            <div class="out_box">
                                <div class="out_title">出入科室记录</div>
                                <el-table
                                        :data="data"
                                        border
                                        width="100%"
                                >
                                    <el-table-column
                                            prop="a"
                                            label="原病区"
                                            width="140px"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="b"
                                            label="原科室"
                                            width="90"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="c"
                                            label="诊断"
                                            width="120">
                                    </el-table-column>
                                    <el-table-column
                                            prop="d"
                                            label="原床号"
                                            width="90">
                                    </el-table-column>
                                    <el-table-column
                                            prop="e"
                                            label="转出时间"
                                            width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="f"
                                            label="转入"
                                            width="90">
                                    </el-table-column>
                                    <el-table-column
                                            prop="g"
                                            label="目标病区"
                                            width="90">
                                    </el-table-column>
                                    <el-table-column
                                            prop="h"
                                            label="目标床号"
                                            width="90">
                                    </el-table-column>
                                    <el-table-column
                                            prop="i"
                                            label="接收时间"
                                            width="140">
                                    </el-table-column>
                                    <el-table-column
                                            prop="j"
                                            label="接收人">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="配置管理" name="second">时间线试图</el-tab-pane>
                        <el-tab-pane label="角色管理" name="third">医嘱</el-tab-pane>
                        <el-tab-pane label="定时任务补偿" name="fourth">病历</el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                tableData:[
                    {
                        userNum: '04床',
                        userNumber: '12346',
                        userName: '黎明'
                    },
                    {
                        userNum: '05床',
                        userNumber: '12346',
                        userName: '黎明'
                    },
                    {
                        userNum: '06床',
                        userNumber: '12346',
                        userName: '黎明'
                    },
                ],
                data:[
                    {
                        a:123,
                        b:123,
                        c:123,
                        d:123,
                        e:123,
                        f:123,
                        g:123,
                        h:123,
                        i:123,
                        j:123,
                    }
                ],
                activeName: 'first',
                clientHeight:'',
                show:true,
                tableHeader:[
                    {
                        prop: "a",
                        label: "原病区",
                        width: "120"

                    },
                    {
                        prop: "a",
                        label: "原病区",
                        width: "120"

                    },
                ]
            }
        },
        mounted() {
            this.clientHeight = `${document.documentElement.clientHeight}`
            window.onresize = function temp() {
                this.clientHeight = `${document.documentElement.clientHeight}`;
            };
        },
        methods:{
            changeFixed(clientHeight){
                this.$refs.page.style.height = (clientHeight-163)+'px';

            },
            handleShow(){
                this.show = !this.show
            },
            handleClick(){
                
            }
        },
        watch: {
            clientHeight: function () {
                this.changeFixed(this.clientHeight)
            }
        },
    }
</script>
<style lang="scss" scoped>
    .box_container{
        overflow: hidden;
        .box_left{
            float:left;
            height:100%;
            position: relative;
            &>div{
                position: relative;
            }
            .tigger{
                position: absolute;
                top: 50%;
                right: -11px;
                overflow: hidden;
                width: 22px;
                height: 80px;
                transform: translateY(-50%);
                background-color: #2d2e36;
                border-radius: 11px;
                cursor: pointer

            }
            .tigger1{
                position: absolute;
                top: 50%;
                right:11px;
                overflow: hidden;
                width: 22px;
                height: 80px;
                transform: translateY(-50%);
                background-color: #2d2e36;
                border-radius: 11px;
                cursor: pointer

            }
        }
        .box-card{
            width:287px;
            float: left;
            /deep/.el-card__body{
                padding:0;
            }
            /deep/.el-tabs__nav-wrap.is-scrollable{
                padding:0
            }
            /deep/.el-tabs__nav-prev{
                display: none;
            }
            /deep/.el-tabs__nav-next{
                display: none;
            }
            /deep/.el-tabs--card>.el-tabs__header .el-tabs__nav{
                border:none;
            }
            /deep/.el-tabs--card>.el-tabs__header .el-tabs__item{
                border:none;
            }
        }
        .box_content{
            margin-left:310px;
            height:100%;

        }
        .box_content1{
            margin-left:110px;
            height:100%
        }
        .msg_header{
            height: 60px;
            line-height: 60px;
            background-color: #ffffff;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            margin-bottom:10px;
            .person{
                height:62px;
                line-height: 62px;

                &>span{
                    display: flex;
                    align-items: center;
                }
                .person_num{
                    font-size: 36px;
                    color: #F7A820;
                    width:82px;
                    text-align: center;
                    background-color: #FEF6E8;
                    display: inline-block;

                }
                .person_number{
                    font-size: 18px;
                    color: #3D7DFB;
                    padding:0 20px;
                    display: inline-block;

                }
                .pad20{
                    padding:0 20px;
                }
            }
            .docter{
                padding:12px 20px;
                height: 60px;
                line-height: 60px;
                .docter_box{
                    height: 100%;
                    border-left:1px solid #C5CBCF;
                    padding-left:20px;
                    font-size: 12px;
                    .box_item{
                        line-height: 20px;
                    }
                }
            }
        }
        .msg_bottom{
            overflow: hidden;
            height: 100%;
            .box-card{
                height: 100%;
                /deep/.el-tabs__nav-scroll{
                    display: flex;
                    justify-content: center;
                }
                /deep/.el-timeline{
                    padding:20px;
                }
            }
            .box_tabs{
                margin-left:307px;
                background-color: #ffffff;
                height: 100%;
                padding-right:20px;
                /deep/.el-tabs{
                    width:100%;
                }
                /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2){
                    padding-left:20px;
                }
                /deep/.el-tabs__active-bar{
                    background-color: transparent;
                }
            }
            .out_box{
                padding:0 20px;
                .out_title{
                    font-size: 14px;
                    color: #949DA3;
                    margin-bottom:20px
                }
            }

        }

    }

</style>
