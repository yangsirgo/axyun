<template>
    <div class="l-select-wrap">
        <div class="l-select-body">
            <span class="l-select-title">{{title}}</span>
            <span class="l-select-gap"></span>
            <el-select v-bind="$attrs" v-model="selectValue" v-on="$listeners">
                <slot></slot>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LSelectWithTitle",
        props: {
            title: {
                type: String,
                require: true
            },
            value: {
                type: String
            }
        },
        data() {
            return {
                selectValue: this.value
            };
        },
        watch : {
            value (){
                this.selectValue = this.value;
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    $titleColor : rgba(148,157,163,1);

    .l-select-wrap {
        display: inline-block;
        white-space: nowrap;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        box-sizing: border-box;
        transition: .1s;
        font-weight: 500;
        padding-left: 10px;
        font-size: 14px;
        border-radius: 4px;
        line-height: 36px;
        width: 240px;

        .l-select-body {
            width: 100%;
            height: 100%;
            position: relative;
            display: inline-block;

            .l-select-title {
                font-size:14px;
                // font-family:SourceHanSansSC-Regular;
                font-weight:400;
                color:$titleColor;
                line-height: 36px;
            }

            .l-select-gap {
                width: 1px;
                padding: 0 8px;
                display: inline-block;
                &:before {
                    content: "";
                    position: absolute;
                    top: calc(50% - 7px);
                    width: 1px;
                    height: 14px;
                    background:rgba(228,228,228,1);
                }
            }

            /deep/ .el-select {
                width: auto;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
            }
            /deep/ .el-select > .el-input {
                width: calc(100% - 10px);
            }
            /deep/ .el-input__inner {
                border: 0;
                vertical-align: 0;
                padding-left: 4px;
                line-height: 1;
            }

            /deep/ .el-input--medium .el-input__inner {
                font-size: 14px;
                // font-family: PingFangSC-Regular;
                font-weight: 400;
                line-height: 34px;
                height: 34px;
            }
            /deep/.el-input--suffix .el-input__inner {
                padding-right: 10px;
            }
            /deep/.el-input__suffix {
                right: -6px;
            }
        }

    }



</style>
