var PACdss = function(userInfo) {
    var _that = this;
    _that.version = '3.6.0'
    // ===========================baseURL 配置===================================================
    var socketHost = 'ws://127.0.0.1:9000'
    var askBobUrl = 'https://cdss-askbob.yingxiang.pingan.com/pedia'
        // baseURL webBaseURL 随着环境不通改变
    // var baseURL = 'https://cdss.yingxiang.pingan.com:9500'
        // var baseURL = 'https://10.127.137.40:9309'
    // var webBaseURL = 'https://cdss.yingxiang.pingan.com:9500/wanjia'
        // 是什么环境 dev  test  prod
    var env = 'dev'

    var baseURL = process.env.VUE_APP_CDSS_BASEURL;
    var webBaseURL = process.env.VUE_APP_CDSS_WEBBASEURL;

    // if (env == 'dev') {
    //     baseURL = '/api-cdss'
    //     baseURL = 'https://efilm-test.yingxiang.pingan.com:9500'
    //     webBaseURL = '.'
    // } else if (env == 'test') {
    //     baseURL = 'https://efilm-test.yingxiang.pingan.com:9500'
    //     webBaseURL = 'https://efilm-test.yingxiang.pingan.com:9500/wanjia'
    // } else if (env == 'prod') {
    //     baseURL = 'https://cdss.yingxiang.pingan.com:9500'
    //     webBaseURL = 'https://cdss.yingxiang.pingan.com:9500/wanjia'
    // }


    // ===========本地===========
    // var baseURL='https://efilm-test.yingxiang.pingan.com:9309'
    // var baseURL='/api'
    // var baseURL='http://10.25.81.90:9308'
    // var askBobUrl='https://cdss-askbob.yingxiang.pingan.com/pedia'
    // var socketHost='ws://127.0.0.1:9000'
    // var webBaseURL='.';
    // var webBaseURL='https://efilm-test.yingxiang.pingan.com:9309/v30';
    // ===========本地===========
    // ===========生产===========
    // var baseURL='https://cdss.yingxiang.pingan.com:9309'
    // var askBobUrl='https://cdss-askbob.yingxiang.pingan.com/pedia'
    // var socketHost='ws://127.0.0.1:9000'
    // var webBaseURL='https://cdss.yingxiang.pingan.com/v30'
    // ===========生产===========
    // ===========================baseURL 配置===================================================
    // 随机数
    // _that.getUUID = function () {
    //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //     return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    //   })
    // }

    //请求头用渠道号和机构号
    var channelId = userInfo.channelId //渠道号
    var institutionId = userInfo.institutionId //机构号
    var hospitalCode = userInfo.hospitalCode //组织机构代码

    _that.hospitalId = userInfo.hospitalId //医院号
    _that.hospitalName = userInfo.hospitalName || '默认医院' //医院名称
    _that.shortName = userInfo.hospitalName || '默认医院' // 医院简称
    _that.belongCity = userInfo.belongCity || '默认城市' //城市˜
    _that.physicianId = userInfo.physicianId //医生号
    _that.physicianName = userInfo.physicianName //医生姓名
    _that.patientId = userInfo.patientId || '默认患者ID' //患者号
    _that.name = userInfo.name || '默认患者' //患者姓名
    _that.outerSerialNo = userInfo.outerSerialNo //流水号
    _that.T = userInfo.T //体温
    _that.SBP = userInfo.SBP //舒张压
    _that.DBP = userInfo.DBP //收缩压
    _that.P = userInfo.P //脉搏
    _that.height = userInfo.height //身高
    _that.weight = userInfo.weight //体重
    _that.hospitalDepartment = userInfo.hospitalDepartment //科室
    _that.hospitalDepartmentId = userInfo.hospitalDepartmentId // 科室id
    _that.age = userInfo.age || '40' //年龄
    _that.gender = userInfo.gender || '男' //性别
    _that.diseaseName = ''

    _that.writeBackName = '现病史' // 回写toast提示的name
    _that.hisPresent = userInfo.hisPresent // 现病史
    _that.pastHistory = userInfo.pastHistory // 既往史
    _that.diagnosis = userInfo.diagnosis // 诊断结果

    _that.renwei = userInfo.renwei || false //人卫插件开关
    _that.local = userInfo.local || false //本地部署开关
    _that.nodruginfo = userInfo.nodruginfo || false //精准治疗用药推荐药品信息开关
    _that.infection = userInfo.infection || false //传染病开关
    _that.test = userInfo.test || false //检验检查开关
    _that.tabShow = userInfo.tabShow || 0
    _that.hasPower = false // 是否有访问权限
    _that.pendingAuth = false // 是否已经获取过权限
    _that.getDepartmentScaled = false // 量表是否已经查询完毕
    _that.departmentNameList = userInfo.departmentNameList || []
    _that.alwaysAddIcon = userInfo.alwaysAddIcon || false // // 总是显示 常用处方 常用药物回写按钮
    _that.surveyType = 'all'
    _that.eventList = [] // 待执行事件
    _that.noPower = { // 预警提示模块是否有权限
        hasPower: true,
        msg: '无权限'
    }
    _that.afAuth = {
            openAfPage: false,
            afWebUrl: '',
            afWebUrlAll: ''
        }
        //askBob接口authentication
        //test
    var cdssAuth = 'eyJhbGciOiJIUzUxMiJ9.eyJhcHBsaWNhdGlvbkFjY291bnRJbmZvIjp7ImlkIjoyNCwiY2hhbm5lbElkIjoiMDEwMDUwMDAwMCIsImluc3RpdHV0aW9uSWQiOiIwMDQ0NDQwMzAwMDAzMzcwMDAwMDAwIiwicm9sZSI6bnVsbCwic291cmNlIjoyLCJzZXNzaW9uVHlwZSI6InRoaXJkUGFydHlVc2VyIiwiaXNBdXRvTG9naW4iOmZhbHNlLCJjb21tb25Vc2VySWQiOjI0LCJwYXltZW50TGV2ZWwiOm51bGx9LCJleHAiOjE3MjI4NTc4OTV9.nMMcIKkrflKJYfVG0IjQCFIcor67FSLGn7t6EGnfrzSKj02F9dm-vQ2V6NNuPjPkeyc_IWoqoKjH6PoNIA3Pnw'
        //prod
        // var cdssAuth='eyJhbGciOiJIUzUxMiJ9.eyJhcHBsaWNhdGlvbkFjY291bnRJbmZvIjp7ImlkIjoyNSwiY2hhbm5lbElkIjoiMDEwMDUwMDAwMCIsImluc3RpdHV0aW9uSWQiOiIwMDQ0NDQwMzAwMDAzMzcwMDAwMDAwIiwicm9sZSI6bnVsbCwic291cmNlIjoyLCJzZXNzaW9uVHlwZSI6InRoaXJkUGFydHlVc2VyIiwiaXNBdXRvTG9naW4iOmZhbHNlLCJjb21tb25Vc2VySWQiOjI1LCJwYXltZW50TGV2ZWwiOm51bGx9LCJleHAiOjE3MjI4NTc4NzR9.uUqNctaUWp-k0hCtBCsUsNvB3lYp9P5MDisAovjDtajx_oeF27W5Wp8QBU0QllkWy91GyZhg4WP-4iEAZZyl6Q'


    _that.hisPresentDom = '#hisPresent-input' // 现病史输入的id
    _that.diagDom = '#assistwrap' // 右侧框的ID
    _that.RecScale = userInfo.RecScale || false //是否有公式量表
    _that.searchType1 = '' // 搜索支持的类型  搜疾病/症状/药品/检查/病例/指南/手术
    _that.searchType = '' // 搜索支持的类型  搜疾病/症状/药品/检查/病例/指南/手术
    _that.drugcode = ''
    _that.scaleAccess = true // 公式量表权限
    _that.scaleAccessText = '权限暂未开通!解锁更多功能，请联系系统管理员'
    _that.currentPage = 1
    _that.searchKeywords = ''

    _that.evidNum = 0 // 询证的权限 （相似病例和疾病指南的权限） 2则表示 相似病例和疾病指南都没有权限
    _that.treatNum = 0 // 诊疗的权限 
    _that.isInfectionForm = true // 传染病报卡来源 true自己的报卡 不传或者false第三方报卡

    _that.autoCreatePanel = userInfo.autoCreatePanel || false // 自动创建浮层显示面板
    _that.positionInfo = userInfo.positionInfo || null // 创建浮层的指定的位置信息等
    var positionInfo = { // 默认位置数据

    }
        //IE8 console bug处理
    window.console = window.console || (function() {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
        return c;
    })()

    if (!channelId || !institutionId) {
        console.error("请设置渠道号和机构号！")
    }
    if (!_that.hospitalId || !_that.hospitalName || !_that.belongCity || !_that.physicianId ||
        !_that.physicianName || !_that.patientId || !_that.name || !_that.outerSerialNo) {
        console.error('埋点初始化数据不完整！')
    }
    jQuery.support.cors = true

    _that.beforeSend = function(request) {
        request.setRequestHeader('Content-Type', 'application/json')
        request.setRequestHeader('channel-id', channelId)
        request.setRequestHeader('institution-id', institutionId)
        request.setRequestHeader('hospital-code', hospitalCode)
        var token = localStorage.getItem('token') || null
        if (token) {
            request.setRequestHeader('token', token)
        }
    }
    _that.ajax = function(obj) {
            return $.ajax({
                url: baseURL + obj.url,
                type: obj.type || 'post',
                datatype: obj.datatype || 'json',
                data: JSON.stringify(obj.data),
                contentType: obj.contentType || 'application/json',
                scriptCharset: obj.scriptCharset || 'utf-8',
                beforeSend: obj.beforeSend || _that.beforeSend,
                success: obj.success,
                error: obj.error
            })
        }
        // 全局变量glucopenia,默认低危，拿回用药推荐后修改
    var glucopenia = "";
    //本地常见病标示
    var needMove = true;
    //临时存储接入方patientInfo
    var cdssPatientInfo = {}
        // 全局定时器
    var searchTimer = null;

    //人卫socket
    var socket;

    //人卫插件socket配置
    _that.renweiInterface = function() {
        if (window.WebSocket) {
            var head = document.getElementsByTagName('head')[0];
            var spt1 = document.createElement('script');
            spt1.type = 'text/javascript';
            spt1.src = webBaseURL + '/js/json2.min.js';
            head.appendChild(spt1)
            var spt2 = document.createElement('script');
            spt2.type = 'text/javascript';
            spt2.src = webBaseURL + '/js/swfobject.js';
            head.appendChild(spt2)
            var spt3 = document.createElement('script');
            spt3.type = 'text/javascript';
            spt3.src = webBaseURL + '/js/web_socket.js';
            head.appendChild(spt3)

            WEB_SOCKET_SWF_LOCATION = webBaseURL + '/js/WebSocketMain.swf';
            WEB_SOCKET_DEBUG = true;

            var isIE = navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('MSIE') > -1
            if (!isIE) {
                socket = new WebSocket(socketHost);
                socket.onopen = function(msg) {
                    console.log("websocket连接成功！");
                };
                socket.onmessage = function(msg) {
                    console.log("websocket服务端发来的消息");
                };
                socket.onclose = function(msg) {
                    console.log("未打开人卫知识库应用程序!");
                    socket = null;
                };
                window.onbeforeunload = function() {
                    try {
                        socket.close();
                        socket = null;
                    } catch (ex) {}
                };
            }
        } else {
            console.error('浏览器不支持webSocket，无法使用人卫插件功能！');
        }
    }
    _that.renwei && _that.renweiInterface()

    //人卫插件点击启动
    _that.renweiWakeUp = function(name) {
            socket.send('{"rwname":"' + name + '"}' + '\0');
        }
        //动态添加新增dom节点所需css
    _that.dynamicAddCSS = function() {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = webBaseURL + '/css/cdss_style.css';
        head.appendChild(link)
    }
    

    //添加循证用的echarts.js
    _that.dynamicAddEcharts = function() {
        var head = document.getElementsByTagName('head')[0];
        var spt = document.createElement('script');
        spt.type = 'text/javascript';
        spt.src = webBaseURL + '/js/echarts.min.js';
        head.appendChild(spt)
    }
    if(!window.loadCdss){
        _that.dynamicAddCSS()
        _that.dynamicAddEcharts()
        // window.loadCdss = true
    }
    //添加datetimepicker相关css
    _that.addDateTimeCSSAndJS = function() {
            var head = document.getElementsByTagName('head')[0];
            var link1 = document.createElement('link');
            link1.type = 'text/css';
            link1.rel = 'stylesheet';
            link1.href = webBaseURL + '/css/bootstrap.css';
            head.appendChild(link1)

            var link2 = document.createElement('link');
            link2.type = 'text/css';
            link2.rel = 'stylesheet';
            link2.href = webBaseURL + '/css/datetimepicker.css';
            head.appendChild(link2)

            var spt1 = document.createElement('script');
            spt1.type = 'text/javascript';
            spt1.src = webBaseURL + '/js/bootstrap.js';
            head.appendChild(spt1)

            var spt2 = document.createElement('script');
            spt2.type = 'text/javascript';
            spt2.src = webBaseURL + '/js/datetimepicker.js';
            spt2.id = 'cdss-js-file-datepick'
            head.appendChild(spt2)
            
                // $.ajax({
                //     url: spt2.src,
                //     success: function() {
                //         _that.infection && _that.addInfectionDOM() // 传染病
                //         for (var n = 0; n < $(".hospitalizedDate").length; n++) {
                //             $(".hospitalizedDate").eq(n).addClass('hospitalizedDate' + n)
                //             $(".hospitalizedDate" + n).datetimepicker({
                //                 format: 'yyyy-mm-dd hh:ii', // 设置时间年月日时分的格式 如: 2016/11/15 18:00 
                //                 hours12: false,
                //             });
                //         }
                //     }
                // })

            // $("#cdss-js-file-datepick").on('load',function(){
            //     _that.infection && _that.addInfectionDOM() // 传染病
            // })
            //入院日期 hospitalized
            // setTimeout(function(){
            //   _that.infection && _that.addInfectionDOM() // 传染病
            //   for(var n=0;n<$(".hospitalizedDate").length;n++){
            //     $(".hospitalizedDate").eq(n).addClass('hospitalizedDate'+n)
            //     $(".hospitalizedDate"+n).datetimepicker({
            //         format:'yyyy-mm-dd hh:ii',     // 设置时间年月日时分的格式 如: 2016/11/15 18:00 
            //         hours12: false,
            //     });
            //   }
            // }, 500)
    }
    _that.initInfection = function () {  
        setTimeout(function() {
            _that.infection && _that.addInfectionDOM() // 传染病
            for (var n = 0; n < $(".hospitalizedDate").length; n++) {
                $(".hospitalizedDate").eq(n).addClass('hospitalizedDate' + n)
                $(".hospitalizedDate" + n).datetimepicker({
                    format: 'yyyy-mm-dd hh:ii', // 设置时间年月日时分的格式 如: 2016/11/15 18:00 
                    hours12: false
                });
            }
        }, 1000)
    }
    //日期插件初始化
    _that.initDateTimePlugin = function() {
        //出生日期
        $(".cdss-infection-data-birthDate").removeClass().addClass('cdss-infection-data-birthDate')
        for (var i = 0; i < $(".cdss-infection-data-birthDate").length; i++) {
            $(".cdss-infection-data-birthDate").eq(i).addClass('cdss-infection-data-birthDate' + i)
            $(".cdss-infection-data-birthDate" + i).datetimepicker({
                format: 'yyyy-mm-dd',
                startView: "year", //初始化视图是‘年’
                minView: "month", //最精确视图为'月'
                maxView: "decade" //最高视图为'十年'
            });
        }

        //发病日期
        $(".cdss-infection-data-onsetTime").removeClass().addClass('cdss-infection-data-onsetTime')
        for (var j = 0; j < $(".cdss-infection-data-onsetTime").length; j++) {
            $(".cdss-infection-data-onsetTime").eq(j).addClass('cdss-infection-data-onsetTime' + j)
            $(".cdss-infection-data-onsetTime" + j).datetimepicker({
                format: 'yyyy-mm-dd',
                startView: "year", //初始化视图是‘年’
                minView: "month", //最精确视图为'月'
                maxView: "decade" //最高视图为'十年'
            });
        }
        //诊断日期
        $(".cdss-infection-data-diagnosisTime").removeClass().addClass('cdss-infection-data-diagnosisTime')
        for (var k = 0; k < $(".cdss-infection-data-diagnosisTime").length; k++) {
            $(".cdss-infection-data-diagnosisTime").eq(k).addClass('cdss-infection-data-diagnosisTime' + k)
            $(".cdss-infection-data-diagnosisTime" + k).datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                hours12: false,
                startView: "year", //初始化视图是‘年’
                minView: "0", //最精确视图为'月'
                maxView: "decade" //最高视图为'十年'
            });
        }
        //死亡日期
        $(".cdss-infection-data-deathTime").removeClass().addClass('cdss-infection-data-deathTime')
        for (var m = 0; m < $(".cdss-infection-data-deathTime").length; m++) {
            $(".cdss-infection-data-deathTime").eq(m).addClass('cdss-infection-data-deathTime' + m)
            $(".cdss-infection-data-deathTime" + m).datetimepicker({
                format: 'yyyy-mm-dd',
                startView: "year", //初始化视图是‘年’
                minView: "month", //最精确视图为'月'
                maxView: "decade" //最高视图为'十年'
            });
        }
        //填卡日期
        $(".cdss-infection-data-fillCardDate").removeClass().addClass('cdss-infection-data-fillCardDate')
        for (var n = 0; n < $(".cdss-infection-data-fillCardDate").length; n++) {
            $(".cdss-infection-data-fillCardDate").eq(n).addClass('cdss-infection-data-fillCardDate' + n)
            $(".cdss-infection-data-fillCardDate" + n).datetimepicker({
                format: 'yyyy-mm-dd',
                startView: "year", //初始化视图是‘年’
                minView: "month", //最精确视图为'月'
                maxView: "decade" //最高视图为'十年'
            });
        }
        //入院日期 hospitalized
        // for(var n=0;n<$(".hospitalizedDate").length;n++){
        //     $(".hospitalizedDate").eq(n).addClass('hospitalizedDate'+n)
        //     $(".hospitalizedDate"+n).datetimepicker({
        //         format:'yyyy-mm-dd H:i',
        //         startView: "year", //初始化视图是‘年’
        //         minView: "hour",//最精确视图为'月'
        //         maxView: "decade",//最高视图为'十年'
        //     });
        // }
    }

    // 添加循证dom
    _that.addEvidenceDom = function() {
        var body = document.getElementsByTagName('body')[0];
        var maskDiv = '<div class="cdss-envidence-bg" id="cdss-envidence-bg"></div>';
        $(body).append(maskDiv);
        // 添加循证侧栏内容
        var content = '<div class="cdss-envidence-content"><div class="cdss-envidence-cont">' +
            '<div class="cdss-envidence-head"><span id="cdss-envidence-close" class="cdss-envidence-close"><img src=' + webBaseURL + '/image/close1.png /></span></div>' +
            '<div class="cdss-envidence-direct"></div><div class="cdss-envidence-therapyName"></div>' +
            '<div class="cdss-envidence-tabs"><span class="cdss-envidence-tab-button cdss-envidence-active-button" id="cdss-envidence-tab-outline">概要</span>' +
            '<span class="cdss-envidence-tab-button" id="cdss-envidence-tab-reference">参考资料</span>' +
            '<span class="cdss-envidence-tab-button" id="cdss-envidence-tab-similar">相似病患</span>' +
            '<span class="cdss-envidence-tab-button" id="cdss-envidence-tab-clinical">临床指南</span></div>' +
            '<div class="cdss-envidence-tab-div cdss-envidence-active-div" id="cdss-envidence-outline">' +
            '<div class="cdss-envidence-outline-intro">来自相似病患分析、临床指南、医学文献的证据</div><div class="cdss-envidence-clinicalGuide"></div>' +
            '<div class="cdss-envidence-outline-wrap">' +
            '<div class="cdss-envidence-outlines-item"><div class="cdss-envidence-out-top">相关数据集中，当前患者相似的患者数</div>' +
            '<div class="cdss-envidence-out-mid" id="cdss-envidence-out-first-mid"></div><div class="cdss-envidence-out-bot" id="cdss-envidence-out-first-bot"></div></div>' +
            '<div class="cdss-envidence-outlines-item"><div class="cdss-envidence-out-top">使用该处方后,患者血糖达标率</div>' +
            '<div class="cdss-envidence-out-mid" id="cdss-envidence-out-second-mid"></div><div class="cdss-envidence-out-bot" id="cdss-envidence-out-second-bot"></div></div>' +
            '<div class="cdss-envidence-outlines-item"><div class="cdss-envidence-out-top">使用该处方后，患者药物依从性</div>' +
            '<div class="cdss-envidence-out-mid" id="cdss-envidence-out-third-mid"></div><div class="cdss-envidence-out-bot" id="cdss-envidence-out-third-bot"></div></div>' +
            '</div><div id="cdss-envidence-glucopenia-front"></div><div id="cdss-envidence-glucopenia-end"></div>' +
            '<div class="cdss-envidence-tips">-- : 在数据集中，该用药方案样本不足</div></div>' +
            '<div class="cdss-envidence-tab-div" id="cdss-envidence-reference"><div class="cdss-envidence-reference-top">本方案基于如下参考资料</div>' +
            '<div class="cdss-envidence-reference-middle"></div><div class="cdss-envidence-clinicalGuide"></div></div>' +
            '<div class="cdss-envidence-tab-div" id="cdss-envidence-similar"><div class="cdss-envidence-similar-top">| 相似患者特征</div>' +
            '<div class="cdss-envidence-table">' +
            '<div class="cdss-envidence-sim-tables cdss-envidence-ctn-sim1"><div class="cdss-envidence-sim-color">特征</div></div>' +
            '<div class="cdss-envidence-sim-tables cdss-envidence-ctn-sim2"><div class="cdss-envidence-sim-color">相似病患</div></div>' +
            '<div class="cdss-envidence-sim-tables cdss-envidence-ctn-sim3"><div class="cdss-envidence-sim-color">全人群患者</div></div>' +
            '<div class="cdss-envidence-sim-tables cdss-envidence-ctn-sim4"><div class="cdss-envidence-sim-color">显著区别于他组</div></div>' +
            '</div>' +
            '<div class="cdss-envidence-sim-middle">| 相似患者使用药物情况</div>' +
            '<div id="cdss-envidence-sim-pie" style="width: 500px;height:350px;">图1</div>' +
            '<div class="cdss-envidence-sim-middle">| 相似患者血糖控制情况</div>' +
            '<div id="cdss-envidence-sim-bar" style="width: 500px;height:350px;">图2</div>' +
            '<div class="cdss-envidence-sim-note"></div>' +
            '</div>' +
            '<div class="cdss-envidence-tab-div" id="cdss-envidence-clinical">' +
            '<div class="cdss-envidence-cli-guide"><div class="cdss-envidence-cli-guide-l">指南:</div>' +
            '<div class="cdss-envidence-cli-guide-r"><ul>' +
            '<li>2017年中国2型糖尿病防治指南<span><a href="' + webBaseURL + '/pdf/diabetes.pdf" target="_blank">全文</a></span></li>' +
            '<li>2017年中国高血压防治指南<span><a href="' + webBaseURL + '/pdf/hypertension.pdf" target="_blank">全文</a></span></li>' +
            '<li>2017年中国高血脂防治指南<span><a href="' + webBaseURL + '/pdf/hyperlipemia.pdf" target="_blank">全文</a></span></li>' +
            '<ul></div></div>' +
            '<div class="cdss-envidence-cli-img"><img class="cdss-envidence-cli-img-s"></div>' +
            '</div>' +
            '</div></div>'
            // 上方拼接结束
        $("#cdss-envidence-bg").append(content);
        // tabs切换
        $(".cdss-envidence-tab-button").off("click").on("click", function(event) {
                var chosen = "#cdss-envidence-" + ($(event.target).attr('id')).split('-')[3];
                $(this).siblings("span").removeClass("cdss-envidence-active-button");
                $(this).addClass("cdss-envidence-active-button");
                // 显示对应的div
                $(chosen).siblings("div").removeClass("cdss-envidence-active-div");
                $(chosen).addClass("cdss-envidence-active-div");
            })
            // 关闭循证
        $("#cdss-envidence-close").off("click").on("click", function() {
            $("#cdss-envidence-bg").hide();
            $("#cdss-envidence-tab-outline").siblings("span").removeClass("cdss-envidence-active-button");
            $("#cdss-envidence-tab-outline").addClass("cdss-envidence-active-button");
            // 显示对应的div
            $("#cdss-envidence-outline").siblings("div").removeClass("cdss-envidence-active-div");
            $("#cdss-envidence-outline").addClass("cdss-envidence-active-div");
        })
    }
    _that.addEvidenceDom();

    //添加循证决策树DOM
    _that.addEvidenceDecisionTreeDom = function() {
        var bigImgDom = '<div class="cdss-envidence-img-wrap">' +
            '<span id="cdss-envidence-cli-close" class="cdss-envidence-cli-close">' +
            '<img src="' + webBaseURL + '/image/close1.png">' +
            '</span>' +
            '<img class="cdss-envidence-cli-img-l" src=""></div>'
        $("body").append(bigImgDom)
        $("#cdss-envidence-cli-close").on("click", function() {
            $(".cdss-envidence-img-wrap").hide();
        })
    }
    _that.addEvidenceDecisionTreeDom()

    //公式量表问卷内容生成方法
    _that.generateFomularScaleQuestion = function(questions) {
        // console.log(questions)
        var questStr = ''
        for (var i = 0; i < questions.length; i++) {
            questStr += '<div class="cdss-formular-scale-quest-title">' + questions[i].name + '</div>' +
                '<div>'
            for (var j = 0; j < questions[i].question.length; j++) {
                if (questions[i].question[j].type == 'NUMERIC') {
                    questStr += '<div class="cdss-formular-scale-quest-gird" type="NUMERIC">' +
                        '<div class="cdss-formular-scale-quest-name">' +
                        '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                        '</div>' +
                        '<div class="cdss-formular-scale-quest-val" style="width:185px;">'
                    if (questions[i].question[j].range && questions[i].question[j].range[0]) {
                        questStr += '<input type="text" name="" id="' + questions[i].question[j].name +
                            '" rangeleft="' + questions[i].question[j].range[0].lbound +
                            '" rangeright="' + questions[i].question[j].range[0].rbound + '" maxlength="10">'
                    } else {
                        questStr += '<input type="text" name="" id="' + questions[i].question[j].name + '"  maxlength="10">'
                    }
                    questStr += '<span class="cdss-formular-scale-quest-unit">' + questions[i].question[j].unit + '</span>' +
                        '</div>' +
                        '</div>'
                } else if (questions[i].question[j].type == 'SINGLE_CHOICE') {
                    questStr += '<div class="cdss-formular-scale-quest-gird" type="SINGLE_CHOICE">' +
                        '<div class="cdss-formular-scale-quest-name">' +
                        '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                        '</div>' +
                        '<div class="cdss-formular-scale-quest-val">'
                    for (var k = 0; k < questions[i].question[j].choice.length; k++) {
                        questStr += '<span class="cdss-formular-scale-quest-radio" value="' + questions[i].question[j].choice[k].value + '" name="' + questions[i].question[j].name + '">' +
                            '<img class="cdss-formular-scale-quest-radio-true" src="' + webBaseURL + '/image/radio.png" alt="">' +
                            '<img class="cdss-formular-scale-quest-radio-false" src="' + webBaseURL + '/image/radio1.png" alt="">' +
                            questions[i].question[j].choice[k].text +
                            '</span>'
                    }
                    questStr += '</div>' +
                        '</div>'
                } else if (questions[i].question[j].type == 'MULTIPLE_CHOICE') {
                    questStr += '<div class="cdss-formular-scale-quest-gird" id="' + questions[i].question[j].name + '" type="MULTIPLE_CHOICE">' +
                        '<div class="cdss-formular-scale-quest-name">' +
                        '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                        '</div>' +
                        '<div class="cdss-formular-scale-quest-val">'
                    for (var s = 0; s < questions[i].question[j].choice.length; s++) {
                        questStr += '<span class="cdss-formular-scale-quest-checkbox" value="' +
                            questions[i].question[j].choice[s].value + '" id="' +
                            questions[i].question[j].choice[s].id + '">' +
                            '<img class="cdss-formular-scale-quest-checkbox-true" src="' + webBaseURL + '/image/checkbox.png" alt="">' +
                            '<img class="cdss-formular-scale-quest-checkbox-false" src="' + webBaseURL + '/image/checkbox1.png" alt="">' +
                            questions[i].question[j].choice[s].text +
                            '</span>'
                    }
                    questStr += '</div>' +
                        '</div>'
                }
            }

            questStr += '</div>'
        }
        $('.cdss-formular-scale-quest-ctn').empty().append(questStr)
        $('.cdss-formular-scale-quest-unit').off('click').on('click', function() {
            $(this).parent().children('input').focus()
        })
        if (document.body.scrollIntoView) {
            // document.querySelector(".cdss-formular-scale-quest-title").scrollIntoView(true)
            $('.cdss-formular-scale-table').scrollTop(true)
        }
        //单选js
        $('.cdss-formular-scale-quest-radio').on('click', function() {
                $(this).siblings().removeClass('active')
                $(this).addClass('active')
            })
            //多选js
        $('.cdss-formular-scale-quest-checkbox').on('click', function() {
            $(this).toggleClass('active')
        })
    }

    //查询区县
    _that.queryCountryList = function(data, dom, num) {
        $.ajax({
            url: baseURL + '/disease/getAreaList',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(data),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var countryStr = ''
                    for (var i = 0; i < resData.data.dimAreaList.length; i++) {
                        countryStr += '<option value="' + resData.data.dimAreaList[i].code + '">' + resData.data.dimAreaList[i].name + '</option>'
                    }
                    if (num && num == 2) {
                        dom.parent().find(".cdss-infection-data-permanentCountyCode").empty().append(countryStr)
                    } else {
                        dom.parent().find(".cdss-infection-data-countyCode").empty().append(countryStr)
                    }
                }
            },
            error: function(err) {}
        })
    }

    //查询市
    _that.queryCityList = function(data, dom, num) {
        $.ajax({
            url: baseURL + '/disease/getAreaList',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(data),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var cityStr = ''
                    for (var i = 0; i < resData.data.dimAreaList.length; i++) {
                        cityStr += '<option value="' + resData.data.dimAreaList[i].code + '">' + resData.data.dimAreaList[i].name + '</option>'
                    }
                    if (num && num == 2) {
                        dom.parent().find(".cdss-infection-data-permanentCityCode").empty().append(cityStr)
                        var addrData2 = {
                            levelCode: 3,
                            parentCode: $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-permanentCityCode').val()
                        }
                        _that.queryCountryList(addrData2, dom, 2)
                    } else {
                        dom.parent().find(".cdss-infection-data-cityCode").empty().append(cityStr)
                        var addrData = {
                            levelCode: 3,
                            parentCode: $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-cityCode').val()
                        }
                        _that.queryCountryList(addrData, dom)
                    }
                }
            },
            error: function(err) {}
        })
    }

    //查询省
    _that.queryProviList = function(dom, num) {
            var addrData = {
                levelCode: 1,
                parentCode: '000000'
            }
            $.ajax({
                url: baseURL + '/disease/getAreaList',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(addrData),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        var provStr = ''
                        for (var i = 0; i < resData.data.dimAreaList.length; i++) {
                            provStr += '<option value="' + resData.data.dimAreaList[i].code + '">' + resData.data.dimAreaList[i].name + '</option>'
                        }
                        if (num && num == 2) {
                            dom.parent().find(".cdss-infection-data-permanentProvinceCode").empty().append(provStr)
                            var addrData2 = {
                                levelCode: 2,
                                parentCode: $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-permanentProvinceCode').val()
                            }
                            _that.queryCityList(addrData2, dom, 2)
                        } else {
                            dom.parent().find(".cdss-infection-data-provinceCode").empty().append(provStr)
                            var addrData = {
                                levelCode: 2,
                                parentCode: $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-provinceCode').val()
                            }
                            _that.queryCityList(addrData, dom)
                        }
                    }
                },
                error: function(err) {}
            })
        }
        //添加传染病DOM
    _that.addInfectionDOM = function() {
        var infecDom = '<div class="cdss-infection-report-wrap">' +
            '<div class="cdss-infection-left">' +
            '<div class="cdss-title">' +
            '<span class="titlename">中华人民共和国传染病报告卡</span>' +
            '<span class="cdssclose"><img id="cdss-infection-close" src="' + webBaseURL + '/image/close.png" alt=""></span>' +
            '</div>' +
            '<div class="cdss-infection-tabs">' +

            '</div>' +
            '<div class="cdss-infection-card-muti-wrap">' +
            '<div class="cdss-infection-card-wrap active">' +
            '<div class="cdss-infection-card-title">' +
            '<span class="cdss-infection-card-no">' +
            '<label>卡片编号：</label>' +
            '<span class="cdss-infection-data-reportCode"></span>' +
            '</span>' +
            '<span class="cdss-infection-card-spec">' +
            '<label>报卡类别：</label>' +
            '初次报告' +
            '</span>' +
            '</div>' +
            '<div class="cdss-infection-card-info-wrap">' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '姓名：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-patientName" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '患儿家长姓名：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-patientParentName" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-radio-module">' +
            '<div class="cdss-infection-card-radio-left">' +
            '<span class="cdss-required">*</span>' +
            '性别：' +
            '</div>' +
            '<div class="cdss-infection-card-radio-right cdss-infection-data-patientSex">' +
            '<span class="active" value="1">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '男</span>' +
            '<span value="2">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '女</span>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '身份证号：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-patientIdCard">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-long-module">' +
            '<div class="cdss-infection-card-input-long-left">' +
            '<span class="cdss-required">*</span>' +
            '出生日期：' +
            '</div>' +
            '<div class="cdss-infection-card-input-long-right">' +
            '<input type="text" class="cdss-infection-data-birthDate">' +
            '<span class="cdss-infection-card-checkbox cdss-infection-data-unknowBirthFlag">' +
            '<img class="cdss-infection-card-checkbox-true" src="' + webBaseURL + '/image/checkbox.png" />' +
            '<img class="cdss-infection-card-checkbox-false" src="' + webBaseURL + '/image/checkbox1.png" />' +
            '出生日期不详</span>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module" style="width:260px">' +
            '<div class="cdss-infection-card-input-left">' +
            '年龄：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right" style="width:145px">' +
            '<input type="text" style="width:80px;" class="cdss-infection-data-unknowBirthData">' +
            '<select name="" id="" style="width:50px;margin-left:7px;" class="cdss-infection-data-unknowBirthData-unit">' +
            '<option value="Y">岁</option>' +
            '<option value="M">月</option>' +
            '<option value="D">天</option>' +
            '</select>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module" style="margin-left: 27px;">' +
            '<div class="cdss-infection-card-input-left">' +
            '联系电话：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-patientPhone">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '工作单位/学校：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-workUnit" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-radio-module" style="width:825px;">' +
            '<div class="cdss-infection-card-radio-left">' +
            '<span class="cdss-required">*</span>' +
            '病人属于：' +
            '</div>' +
            '<div class="cdss-infection-card-radio-right cdss-infection-data-areaType">' +

            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module" style="width:835px;">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '现住址：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right" style="width:720px;">' +
            '<select name="" id="" class="cdss-infection-data-provinceCode">' +

            '</select>' +
            '<select name="" id="" class="cdss-infection-data-cityCode">' +

            '</select>' +
            '<select name="" id="" class="cdss-infection-data-countyCode">' +

            '</select>' +
            '<input type="text" style="width:370px;" class="cdss-infection-data-address" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module" style="width:835px;">' +
            '<div class="cdss-infection-card-input-left">' +
            // '<span class="cdss-required">*</span>' +
            '户籍地址：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right" style="width:720px;">' +
            '<select name="" id="" class="cdss-infection-data-permanentProvinceCode">' +

            '</select>' +
            '<select name="" id="" class="cdss-infection-data-permanentCityCode">' +

            '</select>' +
            '<select name="" id="" class="cdss-infection-data-permanentCountyCode">' +

            '</select>' +
            '<input type="text" style="width:370px;" class="cdss-infection-data-permanentAddress" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '发病日期：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-onsetTime">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '诊断日期：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" style="width: 180px;" class="cdss-infection-data-diagnosisTime">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '死亡日期：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-deathTime">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-radio-module" style="width:825px;height:145px;">' +
            '<div class="cdss-infection-card-radio-left" style="float:left;">' +
            '<span class="cdss-required">*</span>' +
            '人群分类：' +
            '</div>' +
            '<div class="cdss-infection-card-radio-right cdss-infection-data-peopleClassification" style="width:715px;float:left;">' +

            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-radio-module" style="width:825px;height: 64px;">' +
            '<div class="cdss-infection-card-radio-left" style="float:left;">' +
            '<span class="cdss-required">*</span>' +
            '病例分类：' +
            '</div>' +
            '<div class="cdss-infection-card-radio-right cdss-infection-data-caseClassification" style="width:715px;float:left;">' +
            '<div class="cdss-infection-data-caseClassificationI">（1）' +
            '<span class="active" value="1">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '疑似病例</span>' +
            '<span value="2">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '临床诊断病例</span>' +
            '<span value="3">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '确诊病例</span>' +
            '<span value="4">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '病原携带者</span>' +
            '</div>' +
            '<div class="cdss-infection-data-caseClassificationIi">（2）' +
            '<span class="active" value="1">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '急性</span>' +
            '<span value="2">' +
            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
            '慢性（乙型肝炎、血吸虫病、丙肝）</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-disease-type-wrap">' +

            '</div>' +
            '<div class="cdss-infection-other-infect-wrap">' +
            '<div class="cdss-infection-card-type-title">' +
            '<span class="cdss-infection-card-type-name">其他法定管理以及重点检测传染病</span>' +
            '<span class="cdss-infection-card-type-expand">' +
            '<span class="cdss-infection-zk">展开</span>' +
            '<span class="cdss-infection-sq">收起</span>' +
            '<img src="' + webBaseURL + '/image/arrow.png" alt="" class="cdss-arrow-img">' +
            '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-infection-card-type-content">' +
            '<div class="cdss-infection-card-input-right" style="width: 835px;">' +
            '<span style="display: inline-block;width:118px;text-align:right;">其他疾病名称：</span>' +
            '<input type="text" style="width: 700px;" class="cdss-infection-data-diseaseName"  maxlength="50">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div style="margin-top: 20px;border-top:1px solid #f5f7fb;"  class="cdss-infection-bottom-info-wrap">' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '订正病名：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-revisedDiseaseName">' +
            '</div>' +
            '</div>' +
            // '<div class="cdss-infection-card-input-module">'+
            //     '<div class="cdss-infection-card-input-left">'+
            //         '退卡原因：'+
            //     '</div>'+
            //     '<div class="cdss-infection-card-input-right">'+
            //         '<input type="text" class="cdss-infection-data-backCardReason">'+
            //     '</div>'+
            // '</div>'+
            '<div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '报告单位：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-reportUnit" maxlength="50">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '联系电话：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-reportPhone">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '填卡医生：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-fillCardDoctor">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-input-module">' +
            '<div class="cdss-infection-card-input-left">' +
            '<span class="cdss-required">*</span>' +
            '填卡日期：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right">' +
            '<input type="text" class="cdss-infection-data-fillCardDate">' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="cdss-infection-card-input-module" style="width: 688px;height:115px">' +
            '<div class="cdss-infection-card-input-left" style="float: left;">' +
            '备注：' +
            '</div>' +
            '<div class="cdss-infection-card-input-right" style="margin-bottom: 20px;">' +
            '<textarea name="" id="" cols="30" rows="10" style="resize:none;" class="cdss-infection-data-desc" maxlength="200"></textarea>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-infection-card-type-btngroup">' +
            '<span class="cdss-infection-card-type-btn cdss-infection-clear" id="">放弃</span>' +
            '<span class="cdss-infection-card-type-btn submit cdss-infection-submit" id="">上报</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            // '<div id="cdss-infection-pill">' +
            // '传染病报告卡' +
            // '</div>' +
            // '<div class="cdss-infection-warn-wrap" id="cdss-infection-warn-wrap">'+
            //     '<div class="cdss-title">'+
            //         '<span class="titlename">传染病填报提醒</span>'+
            //         '<span class="cdssclose">'+
            //             '<img id="cdss-infection-warn-close" src="'+webBaseURL+'/image/close.png" alt="">'+
            //         '</span>'+
            //     '</div>'+
            //     '<div class="cdss-infection-warn-ctn">'+
            //         '<div>'+
            //             '<img src="'+webBaseURL+'/image/warn.png" alt="">'+
            //         '</div>'+
            //         '<div>'+
            //             '该诊断为（或疑似）传染病，'+
            //         '</div>'+
            //         '<div>'+
            //             '请及时填写传染病报卡！'+
            //         '</div>'+
            //     '</div>'+
            // '</div>'+
            '<div class="cdss-infection-right">' +
            '<div class="cdss-infection-right-title">' +
            '<span>' +
            '传染病填报质控' +
            '</span>' +
            '</div>' +
            '<div class="cdss-infection-right-content">' +

            '</div>' +
            '</div>' +
            '<div class="cdss-infection-warn-wrap" id="cdss-infection-complete-wrap">' +
            '<div class="cdss-title">' +
            '<span class="titlename">提示</span>' +
            '<span class="cdssclose">' +
            '<img id="cdss-infection-complete-close" src="' + webBaseURL + '/image/close.png" alt="">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-infection-warn-ctn">' +
            '<div>' +
            '<img src="' + webBaseURL + '/image/success.png" alt="">' +
            '</div>' +
            '<div>' +
            '提交成功！' +
            '</div>' +
            // '</div>'+
            '</div>' +
            '</div>'
        var noData = '<div class="no-data">' +
            '<img src="' + webBaseURL + '/image/bg_empty.png" alt="">' +
            '<div class="no-text">' +
            '暂无相关提醒' +
            '</div>' +
            '</div>'

        $("body").append(infecDom)
        $(".cdss-infection-right-content").append(noData)

        _that.initDateTimePlugin()
            //关闭按钮
        $('#cdss-infection-close').on('click', function() {
                $('.cdss-infection-report-wrap').hide()
                $('.cdss-bg').hide()
                $("#cdss-infection-pill").show()
                    // 埋点
                var mddata = {
                    event: "传染病填报关闭",
                    page: '传染病填报页',
                    pageElement: '关闭图标',
                    operation1: _that.diagnosis
                }
                _that.REC(mddata)
            })
            // $('#cdss-infection-warn-close').on('click',function(){
            //     $('.cdss-infection-warn-wrap').hide()
            //     $('.cdss-bg').hide()
            //     $("#cdss-infection-pill").show()
            // })
        $('#cdss-infection-complete-close').on('click', function() {
                $('.cdss-infection-warn-wrap').hide()
            })
            //放弃按钮
        $('.cdss-infection-clear').on('click', function() {
                $('.cdss-infection-report-wrap').hide()
                $('.cdss-bg').hide()
                $("#cdss-infection-pill").show()
                    // 埋点
                var mddata = {
                    event: "传染病填报放弃",
                    page: '传染病填报页',
                    pageElement: '放弃按钮',
                    operation1: _that.diagnosis
                }
                _that.REC(mddata)
            })
            //报卡类别切换
        $('.cdss-infection-card-spec').on('click', 'span', function() {
                $(this).siblings().removeClass('active')
                $(this).addClass('active')
            })
            //单选切换
        $('.cdss-infection-card-radio-right').on('click', 'span', function() {
                $(this).siblings().removeClass('active')
                $(this).addClass('active')
            })
            //出生日期不详checkbox
        $('.cdss-infection-card-checkbox').on('click', function() {
                $(this).toggleClass('active')
            })
            //切换报告卡标签
        $('.cdss-infection-tabs').on('click', 'span', function() {
                $(this).siblings().removeClass('active')
                $(this).addClass('active')
                var index = $(this).index()
                $('.cdss-infection-card-wrap').removeClass('active')
                $('.cdss-infection-card-wrap').eq(index).addClass('active')
                    // 触发传染病指控
                _that.realTimeCheck('', _that.isInfectionForm)
            })
            //传染病按钮逻辑
        $("#cdss-infection-pill").on('click', function() {
            $('.cdss-infection-report-wrap').show()
            $('.cdss-bg').show()
                // $('#cdss-infection-pill').hide()
            var msg = {
                showType: 0
            }
            if (getShowInfectionBtn) {
                getShowInfectionBtn(msg)
            }

            // 埋点
            var mddata = {
                event: "传染病填报按钮点击",
                pageElement: '传染病报卡按钮',
                operation1: _that.diagnosis
            }
            _that.REC(mddata)
        })

        //查询问卷字典(类别 甲乙丙传染病列表)
        $.ajax({
                url: baseURL + '/disease/getDictType',
                type: 'post',
                datatype: 'json',
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        var areaType = resData.data.areaType
                        var caseClassification = resData.data.caseClassification
                        var diseaseClassification = resData.data.diseaseClassification
                        var peopleClassification = resData.data.peopleClassification

                        for (var o = 0; o < diseaseClassification.length; o++) {
                            diseaseClassification[o].single = []
                            diseaseClassification[o].multi = []
                            for (var p = 0; p < diseaseClassification[o].diseaseInfo.length; p++) {
                                if (diseaseClassification[o].diseaseInfo[p].typing.length == 0) {
                                    diseaseClassification[o].single.push(diseaseClassification[o].diseaseInfo[p])
                                } else {
                                    diseaseClassification[o].multi.push(diseaseClassification[o].diseaseInfo[p])
                                }
                            }
                        }

                        var areaTypeStr = ''
                        for (var i = 0; i < areaType.length; i++) {
                            areaTypeStr += '<span value="' + areaType[i].id + '">' +
                                '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
                                '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
                                areaType[i].name + '</span>'
                        }
                        $('.cdss-infection-data-areaType').empty().append(areaTypeStr)

                        var peopleStr = ''
                        for (var j = 0; j < peopleClassification.length; j++) {
                            peopleStr += '<span style="width: 120px;" value="' + peopleClassification[j].id + '">' +
                                '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
                                '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
                                peopleClassification[j].name + '</span>'
                        }
                        $('.cdss-infection-data-peopleClassification').empty().append(peopleStr)

                        var caseStr = ''
                        for (var k = 0; k < caseClassification.length; k++) {
                            caseStr += '<div value="' + caseClassification[k].id + '">' +
                                '<label>' + caseClassification[k].name + '</label>'
                            for (var m = 0; m < caseClassification[k].data.length; m++) {
                                caseStr += '<span value="' + caseClassification[k].data[m].id + '">' +
                                    '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
                                    '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
                                    caseClassification[k].data[m].name + '</span>'
                            }
                            caseStr += '</div>'
                        }
                        $('.cdss-infection-data-caseClassification').empty().append(caseStr)

                        var diseaseStr = ''
                        for (var n = 0; n < diseaseClassification.length; n++) {
                            diseaseStr += '<div>' +
                                '<div class="cdss-infection-card-type-title">' +
                                '<span class="cdss-infection-card-type-name">' + diseaseClassification[n].diseaseTypeName + '</span>' +
                                '<span class="cdss-infection-card-type-expand">' +
                                '<span class="cdss-infection-zk">展开</span>' +
                                '<span class="cdss-infection-sq">收起</span>' +
                                '<img src="' + webBaseURL + '/image/arrow.png" alt="" class="cdss-arrow-img">' +
                                '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                '</span>' +
                                '</div>' +
                                '<div class="cdss-infection-card-type-content">'
                            if (diseaseClassification[n].single.length > 0) {
                                diseaseStr += '<div class="cdss-infection-spec-disease-main">'
                                for (var q = 0; q < diseaseClassification[n].single.length; q++) {
                                    diseaseStr += '<span class="cdss-infection-ctn-checkbox" value="' + diseaseClassification[n].single[q].diseaseCode +
                                        '">' +
                                        '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
                                        '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
                                        diseaseClassification[n].single[q].diseaseName + '</span>'
                                }
                                diseaseStr += '</div>'
                            }
                            if (diseaseClassification[n].multi.length > 0) {
                                diseaseStr += '<div class="cdss-infection-spec-disease-wrap">'
                                for (var w = 0; w < diseaseClassification[n].multi.length; w++) {
                                    diseaseStr += '<div class="cdss-infection-spec-disease">' +
                                        '<div class="cdss-infection-spec-name" value="' +
                                        diseaseClassification[n].multi[w].diseaseCode + '">' +
                                        diseaseClassification[n].multi[w].diseaseName + '：</div>' +
                                        '<div class="cdss-infection-spec-level">'
                                    for (var e = 0; e < diseaseClassification[n].multi[w].typing.length; e++) {
                                        diseaseStr += '<span class="cdss-infection-ctn-checkbox" value="' +
                                            diseaseClassification[n].multi[w].typing[e].typingCode + '">' +
                                            '<img class="cdss-infection-card-radio-true" src="' + webBaseURL + '/image/radio.png" />' +
                                            '<img class="cdss-infection-card-radio-false" src="' + webBaseURL + '/image/radio1.png" />' +
                                            diseaseClassification[n].multi[w].typing[e].typingName + '</span>'
                                    }
                                    diseaseStr += '</div>' +
                                        '</div>'
                                }
                                diseaseStr += '</div>'
                            }
                            diseaseStr += '</div></div>'
                        }
                        $('.cdss-infection-disease-type-wrap').empty().append(diseaseStr)

                        //传染病折叠
                        $('.cdss-infection-card-type-expand').off('click').on('click', function() {
                                $(this).toggleClass('fold')
                                $(this).parent().parent().find(".cdss-infection-card-type-content").toggleClass("fold");
                            })
                            //多选切换checkbox
                        $('.cdss-infection-ctn-checkbox').on('click', function() {
                                $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-ctn-checkbox').removeClass('active')
                                $(this).addClass('active')
                                $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-card-type-content .cdss-infection-data-diseaseName').eq(0).val('')
                                _that.realTimeCheck('', _that.isInfectionForm)
                            })
                            //其他法定管理以及重点检测传染病输入移除甲乙丙选中传染病
                        $('.cdss-infection-data-diseaseName').on('change', function() {
                            $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-ctn-checkbox').removeClass('active')
                        })
                    } else {

                    }
                },
                error: function(err) {}
            })
            //查询省 
        var dom = $('.cdss-infection-data-provinceCode')
        var dom2 = $('.cdss-infection-data-permanentProvinceCode')
        _that.queryProviList(dom)
        _that.queryProviList(dom2, 2)
            //切换省
        $('.cdss-infection-data-provinceCode').on('change', function() {
            var dom = $(this)
            var addrData = {
                levelCode: 2,
                parentCode: $(this).val()
            }
            _that.queryCityList(addrData, dom)
        })
        $('.cdss-infection-data-permanentProvinceCode').on('change', function() {
                var dom = $(this)
                var addrData = {
                    levelCode: 2,
                    parentCode: $(this).val()
                }
                _that.queryCityList(addrData, dom, 2)
            })
            //切换市
        $('.cdss-infection-data-cityCode').on('change', function() {
            var dom = $(this)
            var addrData = {
                levelCode: 3,
                parentCode: $(this).val()
            }
            _that.queryCountryList(addrData, dom)
        })
        $('.cdss-infection-data-permanentCityCode').on('change', function() {
                var dom = $(this)
                var addrData = {
                    levelCode: 3,
                    parentCode: $(this).val()
                }
                _that.queryCountryList(addrData, dom, 2)
            })
            // 查询报卡编号
        $.ajax({
            url: baseURL + '/disease/getSerialNum',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    $('.cdss-infection-data-reportCode').text(resData.data)
                }
            },
            error: function(err) {}
        })

        // 输入即提示信息-全部字段都触发，写备注的是参数相关，
        //  年龄，填卡医生,报告单位,联系电话，身份证号，住址 // 疾病-在1227 点击事件
        $(".cdss-infection-card-muti-wrap").off('keyup').on('keyup', 'input,textarea', function() {
                _that.realTimeCheck('', _that.isInfectionForm)
            })
            // $('.cdss-infection-data-unknowBirthData, .cdss-infection-data-fillCardDoctor, .cdss-infection-data-reportUnit, .cdss-infection-data-patientPhone, .cdss-infection-data-patientIdCard, .cdss-infection-data-address, .cdss-infection-data-patientName, .cdss-infection-data-patientParentName, .cdss-infection-data-workUnit, .cdss-infection-data-permanentAddress, .cdss-infection-data-diseaseName, .cdss-infection-data-revisedDiseaseName, .cdss-infection-data-reportPhone, .cdss-infection-data-desc').on('keyup', function() {})
            // 人群分类
        $(".cdss-infection-card-muti-wrap").off('click').on('click', '.cdss-infection-data-peopleClassification span, .cdss-infection-card-input-long-right span, .cdss-infection-data-areaType span, .cdss-infection-data-caseClassification span, .cdss-infection-data-patientSex span', function() {
                _that.realTimeCheck('', _that.isInfectionForm)
            })
            // 发病日期，诊断日期
        $(".cdss-infection-card-muti-wrap").off('change').on('change', '.cdss-infection-data-onsetTime, .cdss-infection-data-diagnosisTime, .cdss-infection-data-birthDate, .cdss-infection-data-deathTime, .cdss-infection-data-fillCardDate', function() {
            _that.realTimeCheck('', _that.isInfectionForm)
        })
    }

    // 组装数据 //传染病报卡字段实时校验  // flag 报卡数据来源,默认传值为我们报卡，不传为第三方报卡,checkData 数据
    _that.realTimeCheck = function(obj, flag) {
        obj = obj ? obj : {}
        var currentDom = $('.cdss-infection-card-wrap.active')
        var provinceName = currentDom.find('.cdss-infection-data-provinceCode option:selected').text()
        var cityName = currentDom.find('.cdss-infection-data-cityCode option:selected').text()
        var countyName = currentDom.find('.cdss-infection-data-countyCode option:selected').text()
        var address = currentDom.find('.cdss-infection-data-address').val()
            // 户籍地址
        var permanentProvinceName = currentDom.find('.cdss-infection-data-permanentProvinceCode option:selected').text()
        var permanentCityName = currentDom.find('.cdss-infection-data-permanentCityCode option:selected').text()
        var permanentCountyName = currentDom.find('.cdss-infection-data-permanentCountyCode option:selected').text()
        var permanentAddress = currentDom.find('.cdss-infection-data-permanentAddress').val()
            // 疾病类型
        var diseaseName = ''
        if (currentDom.find('.cdss-infection-data-diseaseName').val()) {
            diseaseName = currentDom.find('.cdss-infection-data-diseaseName').val()
        } else {
            var clsName = $('.cdss-infection-card-wrap.active').find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').parent().attr('class')
            if (clsName == 'cdss-infection-spec-disease-main') {
                diseaseName = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').text()
            } else if (clsName == 'cdss-infection-spec-level') {
                var dashLeft = ''
                var str = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').parentsUntil('.cdss-infection-spec-disease-wrap').eq(1).children().eq(0).text()
                dashLeft = str.substring(0, str.length - 1)
                var dashRight = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').text()
                diseaseName = dashLeft + '-' + dashRight
            }
        }
        var checkObj = {
            // 出生日期
            birthday: obj && obj.birthday ? obj.birthday : currentDom.find('.cdss-infection-data-birthDate').val(),
            // 地址
            address: obj && obj.address ? obj.address : (address ? provinceName + cityName + countyName + address : ''), // 省市区 详细地址
            // 户籍地址
            permanentAddress: obj && obj.permanentAddress ? obj.permanentAddress : (permanentAddress ? permanentProvinceName + permanentCityName + permanentCountyName + permanentAddress : ''), // 省市区 详细地址
            // 年龄
            age: obj && obj.age ? obj.age : (currentDom.find('.cdss-infection-data-unknowBirthData').val() ? currentDom.find('.cdss-infection-data-unknowBirthData').val() + '-' + currentDom.find('.cdss-infection-data-unknowBirthData-unit').val() : ''),
            // 填卡医生
            cardDoctor: obj && obj.cardDoctor ? obj.cardDoctor : currentDom.find('.cdss-infection-data-fillCardDoctor').val(),
            // 诊断时间x
            diagnoseAt: obj && obj.diagnoseAt ? obj.diagnoseAt : (currentDom.find('.cdss-infection-data-diagnosisTime').val().replace('T', ' ') ? currentDom.find('.cdss-infection-data-diagnosisTime').val().replace('T', ' ') + ':00' : ''),
            // 诊断医生
            diagnoseDoctor: obj && obj.physicianName ? obj.physicianName : _that.physicianName,
            // 疾病类型
            disease: obj && obj.diseaseName ? obj.diseaseName : diseaseName,
            // 发病日期
            diseaseAt: obj && obj.diseaseAt ? obj.diseaseAt : currentDom.find('.cdss-infection-data-onsetTime').val(),
            // 订正病名
            fixedDisease: obj && obj.fixedDisease ? obj.fixedDisease : currentDom.find('.cdss-infection-data-revisedDiseaseName').val(),
            // 身份证号
            identity: obj && obj.identity ? obj.identity : currentDom.find('.cdss-infection-data-patientIdCard').val(),
            // 家长姓名
            parentName: obj && obj.parentName ? obj.parentName : currentDom.find('.cdss-infection-data-patientParentName').val(),
            // 人群分类
            peopleCluster: obj && obj.peopleCluster ? obj.peopleCluster : (currentDom.find('.cdss-infection-data-peopleClassification span.active').attr('value') || ""),
            // 家长电话
            phone: obj && obj.phone ? obj.phone : currentDom.find('.cdss-infection-data-patientPhone').val(),
            // 上报医疗机构
            reportToHospital: obj && obj.reportToHospital ? obj.reportToHospital : currentDom.find('.cdss-infection-data-reportUnit').val(),
            // 就诊医疗机构
            treatAtHospital: obj && obj.treatAtHospital ? obj.treatAtHospital : _that.hospitalName,
            // 报卡类型
            type: obj && obj.type ? obj.type : 1,
            // 工作单位
            workPlace: obj && obj.workPlace ? obj.workPlace : currentDom.find('.cdss-infection-data-workUnit').val(),
        }
        realTimeCheckAjax(checkObj, flag)
    }

    function realTimeCheckAjax(checkData, flag) {
        $.ajax({
            url: baseURL + '/common/post/infectious',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(checkData),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var dataArr = resData.data
                    var tipStr = ''
                    if (dataArr && dataArr.length != 0) {
                        for (var i = 0; i < dataArr.length; i++) {
                            tipStr += '<div class="cdss-infection-right-content-line">' +
                                '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                '<span>' + dataArr[i] + '</span>' +
                                '</div>'
                        }
                        if (flag) {
                            $('.cdss-infection-right-content').empty().append(tipStr)
                            $('.cdss-infection-report-wrap').css({ "width": "1240px" })
                        } else {
                            $('.cdss-infectious-Diseases-wrap').show()
                            $('.cdss-tab-icon-red').show()
                            $('.cdss-infectious-Diseases-content').empty().append(tipStr)
                            $('.cdss-infectious-Diseases-content .cdss-infection-right-content-line').css('padding-top', 'none')
                            $(".cdss-infection-right").hide()
                        }
                    } else {
                        if (flag) {
                            var noData = '<div class="no-data">' +
                                '<img src="' + webBaseURL + '/image/bg_empty.png" alt="">' +
                                '<div class="no-text">' +
                                '暂无相关提醒' +
                                '</div>' +
                                '</div>'
                            $(".cdss-infection-right-content").empty().append(noData)
                            $('.cdss-infection-report-wrap').css({ "width": "1240px" })
                        } else {
                            $('.cdss-tab-icon-red').hide()
                            $(".cdss-infectious-Diseases-wrap").hide()
                            $(".cdss-infection-right").hide()
                        }
                    }
                    deleteBorder()
                } else {

                }
            },
            error: function(err) {}
        })
    }

    //添加全屏遮罩层DOM
    _that.addMaskFrame = function() {
        var body = document.getElementsByTagName('body')[0];
        var maskStr = '<div class="cdss-bg" id="cdss-bg"></div>'
        $(body).append(maskStr)
    }
    _that.addMaskFrame();

    //添加疾病详情tabs弹窗
    _that.addDiseaseRelevangDom = function() {
        var body = document.getElementsByTagName('body')[0];
        var diseaseDetailStr = '<div class="cdss-disease-relevant-tabs-wrap">' +
            '<div class="cdss-disease-relevant-tabs-title">' +
            '<span>疾病详情</span>' +
            // 罕见病 标签
            '<img src="' + webBaseURL + '/image/bq_hjb.png" alt="" class="cdss-disease-relevant-right-hjb">' +
            '<img src="' + webBaseURL + '/image/close.png" alt="" id="cdss-disease-relevant-tabs-wrap-close">' +
            '</div>' +
            '<div class="cdss-disease-relevant-tabs-content">' +
            '<ul class="cdss-disease-relevant-tabs-list">' +
            '</ul>' +
            '<div class="cdss-disease-model">' +
            '<div class="cdss-disease-relevant-tabs-content-info">' +

            '</div>' +
            '<div class="cdss-disease-relevant-tabs-content-nav">' +

            '</div></div>' +
            '<div class="cdss-disease-relevant-tabs-content-logo">内容来源：Askbob医生站</div>' +
            '</div>' +
            '</div>'
        $(body).append(diseaseDetailStr)
            //关闭  X
        $("#cdss-disease-relevant-tabs-wrap-close").on('click', function() {
            var id = $('.cdss-disease-list-ctn-title').eq(0).attr('id')
            if (document.body.scrollIntoView) {
                document.querySelector("#" + id).scrollIntoView(true)
            }
            $(".cdss-disease-list-nav-list").removeClass("active")
            $(".cdss-disease-list-nav-list").eq(0).addClass("active")
            $(".cdss-disease-relevant-tabs-wrap").hide()
            $("#cdss-bg").hide()
        })
    }
    _that.addDiseaseRelevangDom()

    //添加转诊提示框DOM
    _that.addTransferDialog = function() {
        var body = document.getElementsByTagName('body')[0];
        var dialogStr = '<div class="cdss-warn-tipsWrap" id="cdss-warn-tipsWrap">' +
            '<img class="cdss-warn-img" src="' + webBaseURL + '/image/warn.png" alt="">' +
            '<span>患者可能患有危重疾病，建议您紧急处理后转诊</span>' +
            '<img class="cdss-warn-close" src="' + webBaseURL + '/image/close1.png" alt="">' +
            '</div>'
        $(body).append(dialogStr)
        $('.cdss-warn-close').on('click', function() {
            $('#cdss-warn-tipsWrap').hide()
        })
    }
    _that.addTransferDialog()

    //添加评估报告DOM
    _that.addDiseaseReport = function() {
        var body = document.getElementsByTagName('body')[0];
        var reportStr = '<div class="cdss-drugrec-report" id="cdss-drugrec-report">' +
            '<div class="cdss-report-close" id="cdss-report-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="">' +
            '</div>' +
            '<div class="cdss-report-title">动脉粥样硬化性心脑血管疾病风险评估</div>' +
            '<div class="cdss-drugrec-report-ctn">' +
            '<div class="cdss-report-sub-title">基本信息</div>' +
            '<div class="cdss-report-basic-content">' +

            '</div>' +
            '<div class="cdss-report-sub-title">动脉粥样硬化性心脑血管疾病风险评估结果' +
            '<div class="write-back-ctn cdss-write-cell">' +
            '<img src="' + webBaseURL + '/image/icon_edit.png" alt="" class="cdss-report-btn" id="cdss-report-btn">' +
            '<div class="write-back">回写</div>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-report-cvs-content">' +
            '<ul class="cdss-report-cvs-ctn-left">' +

            '</ul>' +
            '<div class="cdss-report-cvs-ctn-right">' +
            '<img src="" alt="">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-report-sub-title">患者建议</div>' +
            '<div class="cdss-report-patient-advise">' +
            '<div class="cdss-report-patient-advtise-tit">' +
            '您的主要危险因素及理想目标如下：' +
            '</div>' +
            '<div>' +
            '<table id="cdss-report-table">' +
            '<thead>' +
            '<tr>' +
            '<td>主要危险因素</td>' +
            '<td>您的结果</td>' +
            '<td>您的理想目标值</td>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +

            '</tbody>' +
            '</table>' +
            '</div>' +
            '<div class="cdss-report-patient-advtise-tit">' +
            '病史及危险因素：' +
            '</div>' +
            '<div class="cdss-report-patient-history">' +

            '</div>' +
            '<div class="cdss-report-patient-advtise-tit">' +
            '健康处方：' +
            '</div>' +
            '<div class="cdss-report-patient-recipe">' +

            '</div>' +
            '</div>' +
            '</div>' +
            // '<div class="cdss-report-print-wrap">'+
            //     '<span class="cdss-report-print-btn" id="cdss-report-print-btn">打 印</span>'+
            // '</div>'+
            '</div>'
        $(body).append(reportStr)
        $("#cdss-report-close").on("click", function() {
                $("#cdss-drugrec-report").hide();
            })
            // $("#cdss-report-print-btn").on("click",function(){
            //     $("#cdss-drugrec-report").css({"width":"100%","height":"100%"})
            //     $("#cdss-drugrec-report").scrollTop(0)
            //     $("#cdss-report-print-btn").hide()
            //     window.print()
            // })
    }
    _that.addDiseaseReport()

    //SDK内部alert窗口
    _that.addAlertDialogBoxDOM = function() {
        var body = document.getElementsByTagName('body')[0];
        var alertBoxStr = '<div class="cdss-alert-box" id="cdss-alert-box">' +
            '<div class="cdss-alert-title">' +
            '<span>提示</span>' +
            '</div>' +
            '<div class="cdss-alert-content">' +

            '</div>' +
            '<div class="cdss-alert-btn">' +
            '<span>确 定</span>' +
            '</div>' +
            '</div>'
        $(body).append(alertBoxStr)
        $(".cdss-alert-btn").on("click", function() {
            $("#cdss-alert-box").hide();
        })
    }
    _that.addAlertDialogBoxDOM()

    //添加用药推荐浮窗
    _that.addDrugRecPill = function() {
        var body = document.getElementsByTagName('body')[0];
        var str = '<div class="cdss-drug-rec-pill-wrap" id="cdss-drug-rec-pill" style="right:80px;top:40px;">' +
            '<img src="' + webBaseURL + '/image/btn_cdss.png" alt="" class="cdss-drug-rec-pill-img">' +
            '</div>'
        $(body).append(str)

        //精准用药推荐药丸拖动功能
        var can_move = false
        var startTime = 0
        var endTime = 0
        var posX = 0;
        var posY = 0
        var domX = 0
        var domY = 0
        $("#cdss-drug-rec-pill").on("mousedown", function(evt) {
            can_move = true
            posX = evt.pageX
            posY = evt.pageY
            startTime = +new Date()
            domX = parseInt($("#cdss-drug-rec-pill").css("right"))
            domY = parseInt($("#cdss-drug-rec-pill").css("top"))
        })
        $("#cdss-drug-rec-pill").on("mouseup", function(evt) {
            can_move = false
            endTime = +new Date()
            if (endTime - startTime <= 300) {
                $(this).hide()
                $(_that.diagDom).show()
                if(window['toggleAssistPanel']){toggleAssistPanel('show')}
            }
        })
        $("#cdss-drug-rec-pill").on("mousemove", function(evt) {
            if (can_move) {
                var mouseXDim = evt.pageX - posX;
                var mouseYDim = evt.pageY - posY;
                $("#cdss-drug-rec-pill").css({
                    "right": domX - mouseXDim + "px",
                    "top": domY + mouseYDim + "px"
                });
            }
            return false;
        })
        $("#cdss-drug-rec-pill").on("mouseout", function(evt) {
                can_move = false
            })
            //切换小浮窗标签
        $(".cdss-mini-survey-title span").on("click", function() {
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
            var text = $(this).text()
            if (text == '公式量表') {
                $(".cdss-formula-scale-mini-wrap").show()
                $(".cdss-mini-drug-rec-wrap").hide()

                $('.cdss-scale-tit').addClass('active')
                $('.cdss-recdrug-tit').removeClass('active')

                $('.cdss-drugrec-formular-switch-wrap').css({ 'display': 'block' })
                $('.cdss-drugrec-qust-switch-wrap').css({ 'display': 'none' })
            } else if (text == '精准治疗') {
                $(".cdss-formula-scale-mini-wrap").hide()
                $(".cdss-mini-drug-rec-wrap").show()

                $('.cdss-scale-tit').removeClass('active')
                $('.cdss-recdrug-tit').addClass('active')

                $('.cdss-drugrec-formular-switch-wrap').css({ 'display': 'none' })
                $('.cdss-drugrec-qust-switch-wrap').css({ 'display': 'block' })
            }
        })
    }
    _that.addDrugRecPill()

    //调用内部alert窗口方法
    _that.showCdssAlert = function(str) {
            $("#cdss-alert-box .cdss-alert-content").empty().text(str)
            $("#cdss-alert-box").show()
        }
        //查询是否为传染病接口
    _that.checkInfectionSupport = function(diseaseNames) {
            if (_that.tabShow == 2) { return }
            var data = {
                diseaseNames: diseaseNames
            }
            $.ajax({
                url: baseURL + '/disease/checkList',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        var dataArr = resData.data
                        var infecArr = []
                        for (var i = 0; i < dataArr.length; i++) {
                            if (dataArr[i].contagionFlag) {
                                infecArr.push(dataArr[i])
                            }
                            //    console.log(dataArr[i].hasInfo)
                            // zt
                            var hasinfo = dataArr[i].hasInfo
                                // 判断罕见病标签是否显示
                            if (dataArr[i].rareDisease == 1) {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-right-hjb').show()
                            } else {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-right-hjb').hide()
                            }
                        }
                        //存在传染病显示传染病小按钮
                        if (infecArr.length > 0) {
                            var infectiousFlag = localStorage.getItem('infectiousFlag')
                            if (infectiousFlag == 'false') {
                                $('#cdss-bg').show()
                                $('#cdss-infectiousDiseasesBox').show();
                            }
                            localStorage.setItem('infectiousFlag', 'false')

                            //多于一个显示上方tabs标签
                            var tabStr = ''
                            if (infecArr.length == 1) {
                                tabStr += '<span>【' + infecArr[0].diseaseName + '】报告卡</span>'
                            } else {
                                for (var j = 0; j < infecArr.length; j++) {
                                    tabStr += '<span>【' + infecArr[j].diseaseName + '】报告卡' +
                                        '<img class="cdss-infection-tabs-close" src="' + webBaseURL + '/image/close1.png" />' + '</span>'
                                }
                            }
                            $('.cdss-infection-tabs').empty().append(tabStr)
                            if (infecArr.length == 1) {
                                $('.cdss-infection-tabs').removeClass('active')
                                $('.cdss-infection-card-wrap').css({ 'height': '540px' })
                            } else {
                                $('.cdss-infection-tabs').addClass('active')
                                $('.cdss-infection-tabs').find('span').eq(0).addClass('active')
                                $('.cdss-infection-card-wrap').css({ 'height': '475px' })
                            }
                            $('.cdss-infection-submit').removeClass('disabled')
                            $('.cdss-infection-submit').addClass('submit')
                                //删除之前可能存在的多余DOM
                            var tabLen = infecArr.length
                            var oldLen = $('.cdss-infection-card-muti-wrap .cdss-infection-card-wrap').length - 1
                            for (var m = oldLen; m > 0; m--) {
                                $('.cdss-infection-card-muti-wrap .cdss-infection-card-wrap').eq(m).remove()
                            }
                            //根据标签数量添加传染病卡DOM

                            var infecLenth = infecArr.length
                            var syncNum = 0
                            for (var q = 1; q < infecLenth; q++) {
                                var domStr = $('.cdss-infection-card-wrap')[0].outerHTML
                                $('.cdss-infection-card-muti-wrap').append(domStr)
                            }

                            //==================================================================
                            //单选切换
                            $('.cdss-infection-card-radio-right').on('click', 'span', function() {
                                    $(this).siblings().removeClass('active')
                                    $(this).addClass('active')
                                })
                                //出生日期不详checkbox
                            $('.cdss-infection-card-checkbox').on('click', function() {
                                    $(this).toggleClass('active')
                                })
                                //切换报告卡标签
                            $('.cdss-infection-tabs').on('click', 'span', function() {
                                    $(this).siblings().removeClass('active')
                                    $(this).addClass('active')
                                    var index = $(this).index()
                                    $('.cdss-infection-card-wrap').removeClass('active')
                                    $('.cdss-infection-card-wrap').eq(index).addClass('active')
                                })
                                //传染病折叠
                            $('.cdss-infection-card-type-expand').off('click').on('click', function() {
                                    $(this).toggleClass('fold')
                                    $(this).parent().parent().find(".cdss-infection-card-type-content").toggleClass("fold");
                                })
                                //多选切换checkbox
                            $('.cdss-infection-ctn-checkbox').on('click', function() {
                                    $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-ctn-checkbox').removeClass('active')
                                    $(this).addClass('active')
                                    $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-card-type-content .cdss-infection-data-diseaseName').eq(0).val('')
                                })
                                //其他法定管理以及重点检测传染病输入移除甲乙丙选中传染病
                            $('.cdss-infection-data-diseaseName').on('change', function() {
                                    $(this).parentsUntil('.cdss-infection-card-wrap').parent().find('.cdss-infection-ctn-checkbox').removeClass('active')
                                })
                                //切换省
                            $('.cdss-infection-data-provinceCode').on('change', function() {
                                    var dom = $(this)
                                    var addrData = {
                                        levelCode: 2,
                                        parentCode: $(this).val()
                                    }
                                    _that.queryCityList(addrData, dom)
                                })
                                //切换市
                            $('.cdss-infection-data-cityCode').on('change', function() {
                                    var dom = $(this)
                                    var addrData = {
                                        levelCode: 3,
                                        parentCode: $(this).val()
                                    }
                                    _that.queryCountryList(addrData, dom)
                                })
                                //上报按钮
                            $('.cdss-infection-submit').off('click').on('click', function() {
                                    var btnDom = $(this)
                                    if ($(this).hasClass('disabled')) {
                                        return
                                    }
                                    var currentDom = $('.cdss-infection-card-wrap.active')
                                    var diseaseTypeCode = ''
                                    var diseasetype = $('.cdss-infection-card-wrap.active').find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').parentsUntil('.cdss-infection-card-type-content').parent().parent().find('.cdss-infection-card-type-title .cdss-infection-card-type-name').text()
                                    if (diseasetype == '甲类') {
                                        diseaseTypeCode = 1
                                    } else if (diseasetype == '乙类') {
                                        diseaseTypeCode = 2
                                    } else if (diseasetype == '丙类') {
                                        diseaseTypeCode = 3
                                    } else if (currentDom.find('.cdss-infection-data-diseaseName').val()) {
                                        diseaseTypeCode = 4
                                    } else {
                                        diseaseTypeCode = 0
                                    }
                                    var diseaseName = ''
                                    if (currentDom.find('.cdss-infection-data-diseaseName').val()) {
                                        diseaseName = currentDom.find('.cdss-infection-data-diseaseName').val()
                                    } else {
                                        var clsName = $('.cdss-infection-card-wrap.active').find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').parent().attr('class')
                                        if (clsName == 'cdss-infection-spec-disease-main') {
                                            diseaseName = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').text()
                                        } else if (clsName == 'cdss-infection-spec-level') {
                                            var dashLeft = ''
                                            var str = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').parentsUntil('.cdss-infection-spec-disease-wrap').eq(1).children().eq(0).text()
                                            dashLeft = str.substring(0, str.length - 1)
                                            var dashRight = currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').text()
                                            diseaseName = dashLeft + '-' + dashRight
                                        }
                                    }

                                    var info = {
                                        reportCode: currentDom.find('.cdss-infection-data-reportCode').text(),
                                        reportType: 1,
                                        patientName: currentDom.find('.cdss-infection-data-patientName').val(),
                                        patientIdCard: currentDom.find('.cdss-infection-data-patientIdCard').val(),
                                        patientParentName: currentDom.find('.cdss-infection-data-patientParentName').val(),
                                        patientSex: currentDom.find('.cdss-infection-data-patientSex span.active').attr('value'),
                                        birthDate: currentDom.find('.cdss-infection-data-birthDate').val(),
                                        unknowBirthFlag: currentDom.find('.cdss-infection-data-unknowBirthFlag').hasClass('active') ? 1 : 0,
                                        unknowBirthData: currentDom.find('.cdss-infection-data-unknowBirthData').val() + '-' + currentDom.find('.cdss-infection-data-unknowBirthData-unit').val(),
                                        workUnit: currentDom.find('.cdss-infection-data-workUnit').val(),
                                        patientPhone: currentDom.find('.cdss-infection-data-patientPhone').val(),
                                        areaType: currentDom.find('.cdss-infection-data-areaType span.active').attr('value'),
                                        provinceCode: currentDom.find('.cdss-infection-data-provinceCode').val(),
                                        provinceName: currentDom.find('.cdss-infection-data-provinceCode option:selected').text(),
                                        cityCode: currentDom.find('.cdss-infection-data-cityCode').val(),
                                        cityName: currentDom.find('.cdss-infection-data-cityCode option:selected').text(),
                                        countyCode: currentDom.find('.cdss-infection-data-countyCode').val(),
                                        countyName: currentDom.find('.cdss-infection-data-countyCode option:selected').text(),
                                        address: currentDom.find('.cdss-infection-data-address').val(),
                                        peopleClassification: currentDom.find('.cdss-infection-data-peopleClassification span.active').attr('value'),
                                        caseClassificationI: currentDom.find('.cdss-infection-data-caseClassification div').eq(0).find('span.active').attr('value'),
                                        caseClassificationIi: currentDom.find('.cdss-infection-data-caseClassification div').eq(1).find('span.active').attr('value'),
                                        onsetTime: currentDom.find('.cdss-infection-data-onsetTime').val(),
                                        diagnosisTime: currentDom.find('.cdss-infection-data-diagnosisTime').val().replace('T', ' ') + ':00',
                                        deathTime: currentDom.find('.cdss-infection-data-deathTime').val(),
                                        diseaseTypeCode: diseaseTypeCode,
                                        diseaseTypeName: diseasetype,
                                        diseaseCode: currentDom.find('.cdss-infection-disease-type-wrap').find('.cdss-infection-card-type-content').find('span.active').attr('value'),
                                        diseaseName: diseaseName,
                                        revisedDiseaseName: currentDom.find('.cdss-infection-data-revisedDiseaseName').val(),
                                        backCardReason: currentDom.find('.cdss-infection-data-backCardReason').val(),
                                        reportUnit: currentDom.find('.cdss-infection-data-reportUnit').val(),
                                        reportPhone: currentDom.find('.cdss-infection-data-reportPhone').val(),
                                        fillCardDoctor: currentDom.find('.cdss-infection-data-fillCardDoctor').val(),
                                        fillCardDate: currentDom.find('.cdss-infection-data-fillCardDate').val(),
                                        desc: currentDom.find('.cdss-infection-data-desc').val(),
                                        // 户籍地址
                                        permanentProvinceCode: currentDom.find('.cdss-infection-data-permanentProvinceCode').val(),
                                        permanentProvinceName: currentDom.find('.cdss-infection-data-permanentProvinceCode option:selected').text(),
                                        permanentCityCode: currentDom.find('.cdss-infection-data-permanentCityCode').val(),
                                        permanentCityName: currentDom.find('.cdss-infection-data-permanentCityCode option:selected').text(),
                                        permanentCountyCode: currentDom.find('.cdss-infection-data-permanentCountyCode').val(),
                                        permanentCountyName: currentDom.find('.cdss-infection-data-permanentCountyCode option:selected').text(),
                                        permanentAddress: currentDom.find('.cdss-infection-data-permanentAddress').val(),
                                    }
                                    if (!diseasetype) {
                                        info.diseaseTypeName = '其他',
                                            info.diseaseCode = '9999'
                                    }
                                    //必填字段校验
                                    if (!info.patientName) {
                                        _that.showCdssAlert('病人姓名不能为空！')
                                        return
                                    }
                                    if (!info.patientIdCard) {
                                        _that.showCdssAlert('身份证号不能为空！')
                                        return
                                    }
                                    if (!info.birthDate && !info.unknowBirthFlag) {
                                        _that.showCdssAlert('出生日期不能为空！')
                                        return
                                    }
                                    if (!info.areaType) {
                                        _that.showCdssAlert('病人属地不能为空！')
                                        return
                                    }
                                    if (!info.address) {
                                        _that.showCdssAlert('现住址不能为空！')
                                        return
                                    }
                                    if (!info.onsetTime) {
                                        _that.showCdssAlert('发病日期不能为空！')
                                        return
                                    }
                                    if (!currentDom.find('.cdss-infection-data-diagnosisTime').val()) {
                                        _that.showCdssAlert('诊断日期不能为空！')
                                        return
                                    }
                                    if (!info.peopleClassification) {
                                        _that.showCdssAlert('人群分类不能为空！')
                                        return
                                    }
                                    if (!info.caseClassificationI) {
                                        _that.showCdssAlert('病例分类不能为空！')
                                        return
                                    }
                                    if (!info.fillCardDoctor) {
                                        _that.showCdssAlert('填卡医生不能为空！')
                                        return
                                    }
                                    if (!info.fillCardDate) {
                                        _that.showCdssAlert('填卡日期不能为空！')
                                        return
                                    }
                                    if (!info.diseaseTypeCode && !info.diseaseName) {
                                        _that.showCdssAlert('传染病不能为空！')
                                        return
                                    }

                                    var year1 = new Date(info.onsetTime).getFullYear()
                                    if (year1 > 9999 || year1 < 1000) {
                                        _that.showCdssAlert('发病日期年份格式不正确！')
                                        return
                                    }
                                    var year2 = new Date(info.diagnosisTime).getFullYear()
                                    if (year2 > 9999 || year2 < 1000) {
                                        _that.showCdssAlert('诊断日期年份格式不正确！')
                                        return
                                    }
                                    var year3 = new Date(info.fillCardDate).getFullYear()
                                    if (year3 > 9999 || year3 < 1000) {
                                        _that.showCdssAlert('填卡日期年份格式不正确！')
                                        return
                                    }
                                    if (!info.unknowBirthFlag) {
                                        var year4 = new Date(info.birthDate).getFullYear()
                                        if (year4 > 9999 || year4 < 1000) {
                                            _that.showCdssAlert('出生卡日期年份格式不正确！')
                                            return
                                        }
                                    }

                                    var proValue = $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-provinceCode').val()
                                    var proText = $('.cdss-infection-card-wrap.active').find('.cdss-infection-data-provinceCode option:selected').text()
                                    var topDom = currentDom.find('.cdss-infection-card-info-wrap').clone(true)
                                    $('.cdss-infection-card-wrap').find('.cdss-infection-card-info-wrap').remove()
                                    $('.cdss-infection-card-wrap').find('.cdss-infection-card-title').after(topDom)
                                    for (var w = 0; w < $('.cdss-infection-data-provinceCode').length; w++) {
                                        $('.cdss-infection-data-provinceCode').eq(w).val(proValue)
                                    }

                                    var bottomDom = currentDom.find('.cdss-infection-bottom-info-wrap').clone(true)
                                    $('.cdss-infection-card-wrap').find('.cdss-infection-bottom-info-wrap').remove()
                                    $('.cdss-infection-card-wrap').find('.cdss-infection-other-infect-wrap').after(bottomDom)

                                    $.ajax({
                                            url: baseURL + '/disease/sendDiseaseReport',
                                            type: 'post',
                                            datatype: 'json',
                                            data: JSON.stringify(info),
                                            contentType: 'application/json',
                                            scriptCharset: 'utf-8',
                                            beforeSend: function(request) {
                                                request.setRequestHeader('Content-Type', 'application/json')
                                                request.setRequestHeader('channel-id', channelId)
                                                request.setRequestHeader('institution-id', institutionId)
                                            },
                                            success: function(resData) {
                                                if (resData.retCode == '999999') {
                                                    btnDom.removeClass('submit')
                                                    btnDom.addClass('disabled')
                                                    $('#cdss-infection-complete-wrap').show()
                                                    $('#cdss-bg').show()
                                                } else {

                                                }
                                            },
                                            error: function(err) {}
                                        })
                                        // 埋点
                                    var mddata = {
                                        event: "传染病填报成功提交",
                                        page: '传染病填报页',
                                        pageElement: '提交按钮',
                                        operation1: _that.diagnosis
                                    }
                                    _that.REC(mddata)
                                })
                                //==================================================================
                            _that.initDateTimePlugin()

                            for (var q = 0; q < infecLenth; q++) {
                                $.ajax({
                                    url: baseURL + '/disease/getSerialNum',
                                    type: 'post',
                                    datatype: 'json',
                                    contentType: 'application/json',
                                    scriptCharset: 'utf-8',
                                    beforeSend: function(request) {
                                        request.setRequestHeader('Content-Type', 'application/json')
                                        request.setRequestHeader('channel-id', channelId)
                                        request.setRequestHeader('institution-id', institutionId)
                                    },
                                    success: function(resData) {
                                        if (resData.retCode == '999999') {
                                            $('.cdss-infection-card-muti-wrap').find('.cdss-infection-data-reportCode').eq(syncNum).text(resData.data)
                                            syncNum++;
                                        }
                                    },
                                    error: function(err) {}
                                })
                            }
                            $('.cdss-infection-card-wrap').removeClass('active')
                            $('.cdss-infection-card-wrap').eq(0).addClass('active')

                            //关闭传染病标签
                            $('.cdss-infection-tabs-close').off('click').on('click', function() {
                                    var index = $(this).parent().index()
                                    $('.cdss-infection-tabs span').eq(index).remove()
                                    var newLen = $('.cdss-infection-tabs-close').length
                                    if (newLen == 1) {
                                        $('.cdss-infection-tabs').removeClass('active')
                                        $('.cdss-infection-card-wrap').css({ 'height': '540px' })
                                    }
                                    $('.cdss-infection-card-muti-wrap .cdss-infection-card-wrap').eq(index).remove()
                                    $('.cdss-infection-tabs span').removeClass('active')
                                    $('.cdss-infection-card-muti-wrap .cdss-infection-card-wrap').removeClass('active')
                                    $('.cdss-infection-tabs span').eq(0).addClass('active')
                                    $('.cdss-infection-card-muti-wrap .cdss-infection-card-wrap').eq(0).addClass('active')
                                })
                                //报告卡疾病填充
                            $('.cdss-infection-ctn-checkbox').removeClass('active')
                            for (var n = 0; n < infecArr.length; n++) {
                                var infecDiseaseName = infecArr[n].diseaseName
                                var infecDiseaseCode = infecArr[n].diseaseCode
                                var spanArrLen = $('.cdss-infection-card-wrap').eq(n).find('.cdss-infection-card-type-content .cdss-infection-ctn-checkbox').length
                                var flag = false
                                for (var p = 0; p < spanArrLen; p++) {
                                    if ($('.cdss-infection-card-wrap').eq(n).find('.cdss-infection-card-type-content .cdss-infection-ctn-checkbox').eq(p).attr('value') == infecDiseaseCode) {
                                        flag = true
                                        $('.cdss-infection-card-wrap').eq(n).find('.cdss-infection-card-type-content .cdss-infection-ctn-checkbox').eq(p).addClass('active')
                                    }
                                }
                                if (flag) { //匹配到
                                    $('.cdss-infection-card-wrap').eq(n).find('.cdss-infection-card-type-content .cdss-infection-data-diseaseName').val('')
                                } else { //未匹配到
                                    $('.cdss-infection-card-wrap').eq(n).find('.cdss-infection-card-type-content .cdss-infection-data-diseaseName').val(infecDiseaseName)
                                }
                            }
                            //出生日期不详 单独处理
                            $('.cdss-infection-data-unknowBirthFlag').off('click').on('click', function() {
                                    $(this).toggleClass('active')
                                    var ischecked = $(this).hasClass('active')
                                    if (ischecked) {
                                        $(this).parent().parent().find('.cdss-infection-data-birthDate').eq(0).val('')
                                    }
                                })
                                //已有病人信息自动填充(目前只有姓名 性别)
                            $('.cdss-infection-data-patientName').val(_that.name)
                            if (_that.gender == '男') {
                                $('.cdss-infection-data-patientSex span').removeClass('active')
                                for (var d = 0; d < infecArr.length; d++) {
                                    $('.cdss-infection-data-patientSex').eq(d).find('span').eq(0).addClass('active')
                                }
                            } else if (_that.gender == '女') {
                                $('.cdss-infection-data-patientSex span').removeClass('active')
                                for (var d = 0; d < infecArr.length; d++) {
                                    $('.cdss-infection-data-patientSex').eq(d).find('span').eq(1).addClass('active')
                                }
                            }
                        } else {
                            $(".activeColor").removeClass('defSave').addClass('saveall')
                                // $('#cdss-infection-pill').hide()
                            var msg = {
                                showType: 0
                            }
                            if (getShowInfectionBtn) {
                                getShowInfectionBtn(msg)
                            }
                            $('.cdss-infection-tabs').removeClass('active')
                        }
                    }
                },
                error: function(err) {}
            })
        }
        // 传染病确认框
    function infectiousDiseasesBox() {
        var body = document.getElementsByTagName('body')[0];
        var infectiousDiseasesBoxStr = '<div class="cdss-infectiousDiseasesBox" id="cdss-infectiousDiseasesBox">' +
            '<div class="cdss-infectiousDiseasesBox-header">提示' +
            // '<img class="cdss-infectiousDiseasesBox-close" src="./image/closed.png">' +
            '</div>' +
            '<div class="cdss-infectiousDiseasesBox-content">' +
            '<img class="infectious-warn" src="' + webBaseURL + '/image/warn.png" alt="">' +
            '该诊断为（或疑似）传染病,请及时填写传染病报卡！' +
            '</div>' +
            '<div class="cdss-infectiousDiseasesBox-btn">' +
            '<div class="cdss-infectiousDiseasesBox-left">稍后填写</div>' +
            '<div class="cdss-infectiousDiseasesBox-right" id="cdss-infectiousDiseasesBox-right">马上填写</div>' +
            '</div>' +
            '</div>'
        // $(body).append(infectiousDiseasesBoxStr)
        $(".cdss-infectiousDiseasesBox-left").on("click", function() {
                $("#cdss-infectiousDiseasesBox").hide();
                $("#cdss-bg").hide();
                $(".activeColor").removeClass('saveall').addClass('defSave')
                $("#cdss-infection-pill").css({ "display": "inline-block" })
                    // $('#cdss-infection-pill').show()
                var msg = {
                    showType: 0
                }
                if (getShowInfectionBtn) {
                    getShowInfectionBtn(msg)
                }
                // 埋点
                var mddata = {
                    event: "传染病填报弹窗稍后填写点击",
                    page: '传染病填报提示弹窗',
                    pageElement: '稍后填写按钮',
                    operation1: _that.diagnosis
                }
                _that.REC(mddata)
                    // 选项卡第一个默认展示-需要触发
                _that.realTimeCheck('', _that.isInfectionForm)
            })
            // 马上填写
        $(".cdss-infectiousDiseasesBox-right").on("click", function() {
            $("#cdss-infectiousDiseasesBox").hide();
            $("#cdss-infection-pill").css({ "display": "inline-block" })
            $(".activeColor").removeClass('saveall').addClass('defSave')
            $('.cdss-infection-report-wrap').show()
            $('.cdss-bg').show()
                // $('#cdss-infection-pill').show()
            var msg = {
                showType: 0
            }
            if (getShowInfectionBtn) {
                getShowInfectionBtn(msg)
            }
            // 埋点
            var mddata = {
                event: "传染病填报弹窗马上填写点击",
                page: '传染病填报提示弹窗',
                pageElement: '马上填写按钮',
                operation1: _that.diagnosis
            }
            _that.REC(mddata)
                // 选项卡第一个默认展示-需要触发
            _that.realTimeCheck('', _that.isInfectionForm)
        })
    }
    infectiousDiseasesBox()


    //动态生成用药问卷面板和用药方案面板DOM（二合一）2.4集成增加公式量表（三合一）
    _that.creatQuestionAndRecommendPanel = function() {
            var dom = ''
            var treatment = ''
            treatment = '<div class="cdss-drugrec-questionwrap" id="cdss-treatment-questionwrap">' +
                '<div class="cdss-title">' +
                '<span class="titlename cdss-recdrug-tit">精准治疗</span>' +
                '<span class="cdssclose" id="cdss-treatment-question-close">' +
                '<img src="' + webBaseURL + '/image/close.png" alt="">' +
                '</span>' +
                '</div>'
            treatment += '<div class="cdss-drugrec-qust-switch-wrap">' +
                '<div class="cdss-drug-quest-ctn">' +
                '</div>' +
                '<div class="cdss-drug-quest-btnwrap">' +
                '<span class="cdss-quest-btn cdss-quest-viewprogram" id="cdss-quest-viewprogram">确 定</span>' +
                '</div>' +
                '<div class="cdss-drug-recommed-ctn">' +
                '</div>' +
                '<div class="cdss-drug-recommend-btnwrap">' +
                '<span class="cdss-drug-recommend-btn cdss-drug-recommend-report" id="cdss-drug-recommend-report">评估报告</span>' +
                '<span class="cdss-drug-recommend-btn cdss-drug-recommend-cancel" id="cdss-drug-recommend-cancel">上一步</span>' +
                '<span class="cdss-drug-recommend-btn cdss-drug-recommend-adopt" id="cdss-drug-recommend-adopt">确 定</span>' +
                '</div>' +
                '<div class="cdss-drug-recommend-loading">' +
                '<img src="' + webBaseURL + '/image/loading.png" alt="" />' +
                '</div>'
            '</div>' +
            '</div>'

            $('body').append(treatment)
            $("#cdss-drug-recommend-cancel").off("click").on("click", function() {
                $("#cdss-treatment-questionwrap .cdss-drug-quest-ctn").show()
                $("#cdss-treatment-questionwrap .cdss-drug-quest-btnwrap").show()
                $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").hide()
                $("#cdss-treatment-questionwrap .cdss-drug-recommend-btnwrap").hide()
            })
            $("#cdss-treatment-question-close").off("click").on("click", function() {
                $("#cdss-bg").hide()
                $("#cdss-treatment-questionwrap").hide()
                    //安卓端自定义方法
                _that.drugRecommendComplete && _that.drugRecommendComplete(false)
            })
            $.ajax({
                url: baseURL + '/diagnose/post/getDepartmentScale',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify({ departmentNameList: _that.departmentNameList }),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    _that.getDepartmentScaled = true
                    if (resData.retCode == '999999') {
                        var data = resData.data
                        dom = '<div class="cdss-drugrec-questionwrap" id="cdss-drugrec-questionwrap">' +
                            '<div class="cdss-title">' +
                            '<span class="titlename active cdss-scale-tit">公式量表</span>' +
                            '<span class="cdssclose" id="cdss-drugrec-question-close">' +
                            '<img src="' + webBaseURL + '/image/close.png" alt="">' +
                            '</span>' +
                            '</div>' +
                            '<div class="cdss-drugrec-formular-switch-wrap">' +

                            '<div class="cdss-formular-scale-content">' +
                            '<div class="cdss-formular-scale-nav">'
                        for (var i = 0; i < data.length; i++) {
                            dom += '<div class="cdss-formular-scale-grid-wrap">' +
                                '<div class="cdss-formular-depart-nav ">' +
                                data[i].department +
                                '<img src="' + webBaseURL + '/image/up.png" class="cdss-formular-depart-nav-up" />' +
                                '<img src="' + webBaseURL + '/image/down.png" class="cdss-formular-depart-nav-down" />' +
                                '</div>' +
                                '<div class="cdss-formular-item-wrap">'
                            for (var j = 0; j < data[i].survey.length; j++) {
                                dom += '<div id="' + data[i].survey[j].surveyName + '" class="cdss-formular-eval-name">' + data[i].survey[j].scaleTerm + '</div>'
                            }
                            dom += '</div>' +
                                '</div>'
                        }
                        dom += '</div>' +
                            '<div class="cdss-formular-scale-table">' +
                            '<div class="cdss-formular-scale-quest-ctn">' +

                            '</div>' +
                            '<div class="cdss-formular-scale-quest-btngroup">' +
                            '<span class="cdss-formular-scale-quest-btn cdss-formular-scale-quest-empty">清空</span>' +
                            '<span class="cdss-formular-scale-quest-btn cdss-formular-scale-quest-eva">评估</span>' +
                            '</div>' +
                            '<div class="cdss-formular-scale-quest-result-wrap">' +
                            '<table>' +
                            '<tr>' +
                            '<td style="width:50px;">' +
                            '<span class="cdss-formular-scale-quest-result-level"></span>' +
                            '</td>' +
                            '<td style="width:486px;">' +
                            '<div class="cdss-formular-scale-quest-result-score-wrap">评分：<span class="cdss-formular-scale-quest-result-score"></span></div>' +
                            '<div class="cdss-formular-scale-quest-result-desc"></div>' +
                            '</td>' +
                            '<td style="width:26px;">' +
                            '<div class="write-back-ctn">' +
                            '<img src="' + webBaseURL + '/image/icon_edit.png" class="cdss-formular-scale-quest-result-write" id="cdss-formular-scale-quest-result-write" />' +
                            '<div class="write-back">回写</div>' +
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'

                        $('body').append(dom)
                            // 护理评估
                        var departmentobj = null
                        $.each(resData.data, function(index, item) {
                            if (item.department == '护理') {
                                departmentobj = item
                            }
                        })
                        if (departmentobj) {
                            var department = departmentobj['survey']
                            var evalStr = ''
                            for (var i = 0; i < department.length; i++) {
                                evalStr += '<div class="cdss-disease-ascvd-eval"><label class="cdss-nursing-ascvd-eval-btn" surveyName="' +
                                    department[i].surveyName + '">' +
                                    department[i].scaleTerm +
                                    '</label>' +
                                    //   '<div class="cdss-disease-ascvd-eval-tips"><div class="cdss-disease-ascvd-eval--triangle"></div><div class="cdss-disease-ascvd-eval--tips-ctn">'+department[i].scaleTerm+'</div></div>'+
                                    '</div>'
                            }
                            $('.cdss-nursing-department-list').empty().html(evalStr)
                            $('.cdss-nursing-department-wrap').addClass('hasDepartment')
                        }

                        // 手术评估
                        var transfusionDepartobj = null
                        $.each(resData.data, function(index, item) {
                            if (item.department == '术前评估') {
                                transfusionDepartobj = item
                            }
                        })
                        if (transfusionDepartobj) {
                            var transfusionDepart = transfusionDepartobj['survey']
                            var transfusionDepartStr = ''
                            for (var i = 0; i < transfusionDepart.length; i++) {
                                transfusionDepartStr += '<div class="cdss-disease-ascvd-eval"><label class="cdss-transfusion-ascvd-eval-btn" surveyName="' +
                                    transfusionDepart[i].surveyName + '">' +
                                    transfusionDepart[i].scaleTerm +
                                    '</label>' +
                                    // '<div class="cdss-disease-ascvd-eval-tips"><div class="cdss-disease-ascvd-eval--triangle"></div><div class="cdss-disease-ascvd-eval--tips-ctn">'+department[i].scaleTerm+'</div></div>'+
                                    '</div>'
                            }
                            $('.cdss-transfusion-department-list').empty().html(transfusionDepartStr)
                            $('.cdss-transfusion-department-wrap').addClass('hasDepartment')
                        }

                        //搜索提示信息
                        $(".cdss-nursing-ascvd-eval-btn,.cdss-transfusion-ascvd-eval-btn").on('mouseenter', function() {
                            $(this).parent().find(".cdss-disease-ascvd-eval-tips").show()
                        })
                        $(".cdss-nursing-ascvd-eval-btn,.cdss-transfusion-ascvd-eval-btn").on('mouseout', function() {
                            $(this).parent().find(".cdss-disease-ascvd-eval-tips").hide()
                        })

                        function departBtnFun(type, id, text) {
                            // 展开术前评估
                            $('.cdss-formular-depart-nav').each(function(i) {
                                    if ($(this).text() === type && !$(this).hasClass('active')) {
                                        $(this).click()
                                    }
                                    if ($(this).text() === type) {
                                        console.log($(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name'))
                                        var list = $(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name')
                                        var length = $(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name').length
                                        console.log(length)
                                        $('.cdss-formular-scale-nav .cdss-formular-eval-name').removeClass('active')
                                        for (var i = 0; j < length; i++) {
                                            if ($(list[i]).attr('id') == id) {
                                                $(list[i]).addClass('active')
                                                break;
                                            }
                                        }
                                    }
                                })
                                // 打开公式量表
                            _that.showSurveyDom('展开问卷:' + text)
                            console.log(id, text)
                        }
                        $(".cdss-nursing-ascvd-eval-btn").off('click').bind('click', function() {
                            var id = $(this).attr('surveyname')
                            var text = $(this).text()
                            _that.surveyType = 'nursing'
                            var mdData = {
                                event: "护理评估量表打开",
                                page: "护理评估量表详情页",
                                pageElement: "评估量表名称",
                                operation1: text
                            }
                            _that.REC(mdData)
                            departBtnFun('护理', id, text)
                        })
                        $(".cdss-transfusion-ascvd-eval-btn").off('click').on('click', function() {
                            var id = $(this).attr('surveyname')
                            var text = $(this).text()
                            _that.surveyType = 'transfusion'
                            var mdData = {
                                event: "手术评估量表打开",
                                page: "手术评估量表详情页",
                                pageElement: "评估量表名称",
                                operation1: text
                            }
                            _that.REC(mdData)
                            departBtnFun('术前评估', id, text)
                        })

                        $('.cdss-drugrec-formular-switch-wrap').show()
                            // $('.cdss-drugrec-qust-switch-wrap').hide()


                        //初始化展开第一个 激活第一个问卷
                        $(".cdss-formular-depart-nav").eq(0).addClass('active')
                        $('.cdss-formular-item-wrap').eq(0).css({ 'display': 'inline-block' })
                        $('.cdss-formular-eval-name').eq(0).addClass('active')
                        var id = $('.cdss-formular-eval-name').eq(0).attr('id')
                        var name = $('.cdss-formular-eval-name').eq(0).text()
                            // $('.cdss-formular-scale-quest-title').empty().text(name)
                        _that.surveyType = 'all'
                        scaleDetail(id)

                        //关闭按钮
                        $("#cdss-formular-scale-close").on("click", function() {
                                $(".cdss-formular-scale-wrap").hide();
                                $(".cdss-bg").hide()
                            })
                            //清空按钮
                        $('.cdss-formular-scale-quest-empty').on('click', function() {
                                $('.cdss-formular-scale-quest-val input').val('')
                                $('.cdss-formular-scale-quest-radio').removeClass('active')
                                $('.cdss-formular-scale-quest-checkbox').removeClass('active')
                            })
                            //评估按钮
                        $('.cdss-formular-scale-quest-eva').on('click', function() {
                                //校验必须都填写(输入框 单选 多选)
                                var questArr = $('.cdss-formular-scale-quest-gird')
                                var questLen = questArr.length
                                var inputArr = []
                                var radioArr = []
                                var checkboxArr = []
                                var inputLen = 0
                                var radioLen = 0
                                var checkLen = 0
                                for (var p = 0; p < questArr.length; p++) {
                                    var type = questArr.eq(p).attr('type')
                                    if (type == 'NUMERIC') {
                                        inputArr.push(questArr.eq(p))
                                        inputLen++
                                    } else if (type == 'SINGLE_CHOICE') {
                                        radioArr.push(questArr.eq(p))
                                        radioLen++
                                    } else if (type == 'MULTIPLE_CHOICE') {
                                        checkboxArr.push(questArr.eq(p))
                                        checkLen++
                                    }
                                }
                                //step1.校验输入框
                                for (var a = 0; a < inputArr.length; a++) {
                                    var val = inputArr[a].find('input').val()
                                    var text = inputArr[a].find('.cdss-formular-scale-quest-name').text().slice(1)
                                    if (!val.length) {
                                        _that.showCdssAlert('所有选项必填，请填写完整！')
                                        return
                                    }
                                    //校验输入框范围
                                    var low = parseFloat(inputArr[a].find('input').attr('rangeleft'))
                                    var high = parseFloat(inputArr[a].find('input').attr('rangeright'))
                                    if (((low || high) && val < low) || ((low || high) && val > high)) {
                                        _that.showCdssAlert(text + '超出[' + low + '~' + high + ']的范围！')
                                        return
                                    }
                                }
                                //step2.校验单选
                                var activeRadioArr = $('.cdss-formular-scale-quest-val .cdss-formular-scale-quest-radio.active')
                                var activeRadioLen = activeRadioArr.length
                                if (activeRadioLen != radioLen) {
                                    _that.showCdssAlert('所有选项必填，请填写完整！')
                                    return
                                }
                                //step3.校验多选
                                var activeCheckArr = $('.cdss-formular-scale-quest-val .cdss-formular-scale-quest-checkbox.active')
                                var activeCheckLen = activeCheckArr.length
                                if (checkLen > activeCheckLen) {
                                    _that.showCdssAlert('所有选项必填，请填写完整！')
                                    return
                                }

                                var kvList = []
                                for (var i = 0; i < inputArr.length; i++) {
                                    var id = inputArr[i].find('input').attr('id').split('.')
                                    var len = id.length - 1
                                    var key = id[len]
                                    var obj = {
                                        key: key,
                                        value: parseFloat(inputArr[i].find('input').val())
                                    }
                                    kvList.push(obj)
                                }
                                for (var j = 0; j < activeRadioArr.length; j++) {
                                    var id = activeRadioArr.eq(j).attr('name').split('.')
                                    var len = id.length - 1
                                    var key = id[len]
                                    var obj = {
                                        key: key,
                                        value: parseFloat(activeRadioArr.eq(j).attr('value'))
                                    }
                                    kvList.push(obj)
                                }
                                if (checkboxArr.length > 0) {
                                    for (var k = 0; k < checkboxArr.length; k++) {
                                        var obj = {}
                                        var id = checkboxArr[k].attr('id').split('.')
                                        var len = id.length - 1
                                        var key = id[len]
                                        var value = ''
                                        for (var s = 0; s < checkboxArr[k].find('.cdss-formular-scale-quest-checkbox').length; s++) {
                                            value += checkboxArr[k].find('.cdss-formular-scale-quest-checkbox').eq(s).hasClass("active") ? "1" : "0"
                                        }
                                        obj['key'] = key
                                        obj['value'] = value
                                        kvList.push(obj)
                                    }
                                }
                                console.log(kvList)

                                var surveyName = $('.cdss-formular-eval-name.active').attr('id')
                                var scaleName = $('.cdss-formular-scale-quest-title').text()
                                console.log('scaleName', scaleName)
                                var reqData = {
                                    hospitalId: _that.hospitalId, //医院号
                                    hospitalName: _that.hospitalName, //医院名称
                                    belongCity: _that.belongCity, //城市
                                    physicianId: _that.physicianId, //医生号
                                    physicianName: _that.physicianName, //医生姓名
                                    patientId: _that.patientId, //患者号
                                    name: _that.name, //患者姓名
                                    outerSerialNo: _that.outerSerialNo, //流水号
                                    age: _that.age || 40,
                                    gender: _that.gender,
                                    hospitalDepartment: _that.hospitalDepartment,
                                    surveyName: surveyName,
                                    kvList: kvList,
                                    scaleName: scaleName
                                }
                                if (kvList && kvList.length) {
                                    for (var i = 0; i < kvList.length; i++) {
                                        if ((kvList[i].key == 'age') && kvList[i].value) {
                                            reqData.age = kvList[i].value
                                        }
                                        console.log(kvList[i])
                                        if ((kvList[i].key == 'gender')) {
                                            reqData.gender = kvList[i].value == 1 ? '男' : '女'
                                        }
                                    }
                                }
                                $.ajax({
                                    url: baseURL + '/diagnose/post/getScaleDiagnosis',
                                    type: 'post',
                                    datatype: 'json',
                                    data: JSON.stringify(reqData),
                                    contentType: 'application/json',
                                    scriptCharset: 'utf-8',
                                    beforeSend: function(request) {
                                        request.setRequestHeader('Content-Type', 'application/json')
                                        request.setRequestHeader('channel-id', channelId)
                                        request.setRequestHeader('institution-id', institutionId)
                                        request.setRequestHeader('source', _that.surveyType)
                                    },
                                    success: function(resData) {
                                        if (resData.retCode == '999999') {
                                            var data = resData.data.riskResult
                                            if (data && data.length > 0) {
                                                var risk = data[0]
                                                $('.cdss-formular-scale-quest-result-level').empty().text(risk.grade || '评估结果')
                                                if (risk.score == '-1') {
                                                    $('.cdss-formular-scale-quest-result-score-wrap').hide()
                                                } else {
                                                    $('.cdss-formular-scale-quest-result-score').empty().text(risk.score)
                                                    $('.cdss-formular-scale-quest-result-score-wrap').show()
                                                }
                                                var desc = risk.description ? risk.description : '无评估结果'
                                                $('.cdss-formular-scale-quest-result-desc').empty().text(desc)
                                                $('.cdss-formular-scale-quest-result-wrap').show()
                                                if (document.body.scrollIntoView) {
                                                    document.querySelector(".cdss-formular-scale-quest-result-wrap").scrollIntoView(true);
                                                }
                                                // 公式量表回写
                                                risk.writeType = 2
                                                risk.writeText = $('.cdss-formular-scale-quest-title').text() + '评估结果：' + risk.description.replace(/<.*?>/ig,  "")
                                                $('#cdss-formular-scale-quest-result-write').off('click').on('click', function() {
                                                    var mdData = {
                                                        event: "公式量表评估结果回写",
                                                        page: "公式量表详情页",
                                                        pageElement: "结果回写图标",
                                                        operation1: $('.cdss-formular-scale-quest-title').text()
                                                    }
                                                    _that.REC(mdData)
                                                    if (getWriteBack) {
                                                        _that.toast('回写成功')
                                                        getWriteBack(risk)
                                                    }
                                                })
                                            } else {
                                                $('.cdss-formular-scale-quest-result-level').empty().text('评估结果')
                                                $('.cdss-formular-scale-quest-result-score-wrap').hide()
                                                $('.cdss-formular-scale-quest-result-desc').empty().text('无评估结果')
                                                $('.cdss-formular-scale-quest-result-wrap').show()
                                                if (document.body.scrollIntoView) {
                                                    document.querySelector(".cdss-formular-scale-quest-result-wrap").scrollIntoView(true);
                                                }
                                            }
                                        }
                                    },
                                    error: function(err) {}
                                })
                            })
                            //导航切换科室
                        $('.cdss-formular-depart-nav').on('click', function() {
                                isActive = $(this).hasClass('active')
                                if (isActive) {
                                    $('.cdss-formular-depart-nav').removeClass('active')
                                    $('.cdss-formular-item-wrap').hide()
                                } else {
                                    $('.cdss-formular-depart-nav').removeClass('active')
                                    $(this).addClass('active')
                                    $('.cdss-formular-item-wrap').hide()
                                    $(this).parent().find('.cdss-formular-item-wrap').show()
                                }

                                var id = $(this).next().find('.cdss-formular-eval-name').eq(0).attr('id')
                                setTimeout(function() {
                                    if (document.body.scrollIntoView) {
                                        if (document.querySelector(".cdss-formular-depart-nav.active")) {
                                            document.querySelector(".cdss-formular-depart-nav.active").scrollIntoView(true);
                                        }
                                    }
                                }, 100)
                            })
                            //科室下具体公式量表
                        $('.cdss-formular-eval-name').on('click', function() {
                            console.log($(this))
                            $('.cdss-formular-scale-quest-result-wrap').hide()
                            $('.cdss-formular-eval-name').removeClass('active')
                            $(this).addClass('active')
                            var id = $(this).attr('id')
                            var name = $(this).text()
                                // $('.cdss-formular-scale-quest-title').empty().text(name)
                            var surobj = {
                                    diseaseTypes: [id]
                                }
                                //问卷内容DOM处理
                            $.ajax({
                                url: baseURL + '/common/post/getSurvey',
                                type: 'post',
                                datatype: 'json',
                                data: JSON.stringify(surobj),
                                contentType: 'application/json',
                                scriptCharset: 'utf-8',
                                beforeSend: function(request) {
                                    request.setRequestHeader('Content-Type', 'application/json')
                                    request.setRequestHeader('channel-id', channelId)
                                    request.setRequestHeader('institution-id', institutionId)
                                    request.setRequestHeader('source', _that.surveyType)
                                },
                                success: function(resData) {
                                    if (resData.retCode == '999999') {
                                        var questions = resData.data.questions[0].question
                                        _that.generateFomularScaleQuestion(questions)
                                    }
                                },
                                error: function(err) {}
                            })
                        })

                        $("#cdss-drugrec-question-close").off("click").on("click", function() {
                            $("#cdss-drugrec-questionwrap .cdss-drug-quest-ctn").show()
                            $("#cdss-drugrec-questionwrap .cdss-drug-quest-btnwrap").show()
                            $("#cdss-drugrec-questionwrap .cdss-drug-recommed-ctn").hide()
                            $("#cdss-drugrec-questionwrap .cdss-drug-recommend-btnwrap").hide()
                            $("#cdss-bg").hide()
                            $("#cdss-drugrec-questionwrap").hide()
                            $('.cdss-formular-scale-quest-result-wrap').hide()

                            //安卓端自定义方法
                            _that.drugRecommendComplete && _that.drugRecommendComplete(false)
                        })

                        $("#cdss-quest-cancel").off("click").on("click", function() {
                            // $("#cdss-drugrec-questionwrap .cdss-title .cdss-recdrug-tit").text("用药推荐")
                            $("#cdss-drugrec-questionwrap .cdss-drug-quest-ctn").show()
                            $("#cdss-drugrec-questionwrap .cdss-drug-quest-btnwrap").show()
                            $("#cdss-drugrec-questionwrap .cdss-drug-recommed-ctn").hide()
                            $("#cdss-drugrec-questionwrap .cdss-drug-recommend-btnwrap").hide()
                            $("#cdss-bg").hide()
                            $("#cdss-drugrec-questionwrap").hide()
                                //安卓端自定义方法
                            _that.drugRecommendComplete && _that.drugRecommendComplete(false)
                        })


                        $('.titlename').on('click', function() {
                            $('.titlename').removeClass('active')
                            $(this).addClass('active')
                            var index = $(this).index()
                            if (index == 0) { //公式量表
                                $('.cdss-drugrec-formular-switch-wrap').show()
                                $('.cdss-drugrec-qust-switch-wrap').hide()

                                $('.cdss-mini-survey-title span').eq(0).addClass('active')
                                $('.cdss-mini-survey-title span').eq(1).removeClass('active')

                                $('.cdss-formula-scale-mini-wrap').css({ 'display': 'block' })
                                $('.cdss-mini-drug-rec-wrap').css({ 'display': 'none' })
                            } else if (index == 1) { //用药推荐
                                $('.cdss-drugrec-formular-switch-wrap').hide()
                                $('.cdss-drugrec-qust-switch-wrap').show()

                                $('.cdss-mini-survey-title span').eq(0).removeClass('active')
                                $('.cdss-mini-survey-title span').eq(1).addClass('active')

                                $('.cdss-formula-scale-mini-wrap').css({ 'display': 'none' })
                                $('.cdss-mini-drug-rec-wrap').css({ 'display': 'block' })
                            }
                        })
                    } else if (resData.retCode == '-100010') {
                        _that.scaleAccess = false
                        _that.scaleAccessText = resData.retMsg
                    }
                },
                error: function(err) {
                    _that.getDepartmentScaled = true
                }
            })
        }
        // _that.creatQuestionAndRecommendPanel()
        // 查具体量表详情
    function scaleDetail(id) {
        var surobj = {
                diseaseTypes: [id]
            }
            //问卷内容DOM处理
        $.ajax({
            url: baseURL + '/common/post/getSurvey',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(surobj),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
                request.setRequestHeader('source', _that.surveyType)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var questions = resData.data.questions[0].question
                    _that.generateFomularScaleQuestion(questions)
                }
            },
            error: function(err) {}
        })
    }
    // 显示护理评估
    var InterNursing = null
    _that.nursingDepartment = function() {
            clearInterval(InterNursing)
            $('.cdss-tab-icon-red').show()
            InterNursing = setInterval(function() {
                if ($('.cdss-nursing-department-wrap').length && _that.getDepartmentScaled && ($(".cdss-container").css("background-color") == "rgb(255, 255, 255)" || $(".cdss-container").css("background-color") == "#ffffff")) {
                    if ($('.cdss-nursing-department-wrap').hasClass('hasDepartment')) {
                        $('.cdss-nursing-department-wrap').show()
                    }
                    deleteBorder()
                    clearInterval(InterNursing)
                    console.log('InterNursing')
                }
            }, 200)
        }
        // 显示手术评估
    var InterTransfusion = null
    _that.transfusionDepartment = function() {
            clearInterval(InterTransfusion)
            $('.cdss-tab-icon-red').show()
            InterTransfusion = setInterval(function() {
                if ($('.cdss-transfusion-department-wrap').length && _that.getDepartmentScaled && ($(".cdss-container").css("background-color") == "rgb(255, 255, 255)" || $(".cdss-container").css("background-color") == "#ffffff")) {
                    if ($('.cdss-transfusion-department-wrap').hasClass('hasDepartment')) {
                        $('.cdss-transfusion-department-wrap').show()
                    }
                    deleteBorder()
                    clearInterval(InterTransfusion)
                }
            }, 200)
        }
        //初化辅助输入面板和辅助诊断面板 先检验权限
    _that.createAssistPanel = function(inputDom, hisPresentDom, diagDom) {
            var interVal = null
            if (!_that.pendingAuth) { // 没有检验过权限 正在检验权限中
                interVal = setInterval(function() {
                    if (_that.pendingAuth) {
                        clearInterval(interVal)
                        if (!_that.hasPower) { // 没有访问权限
                            return
                        } else { // 有访问权限
                            _that.createAssistPanelAuth(inputDom, hisPresentDom, diagDom)
                        }
                    }
                }, 100)
            } else { // 检验过权限了
                if (_that.hasPower) { // 有访问权限
                    _that.createAssistPanelAuth(inputDom, hisPresentDom, diagDom)
                }
            }
        }
        //初化辅助输入面板和辅助诊疗面板
    _that.createAssistPanelAuth = function (inputDom, hisPresentDom, diagDom) {  
        console.log('createAssistPanelAuth')
        _that.createAuxiliaryInput(inputDom, hisPresentDom)
        if(diagDom){
            _that.createCdssPanel(diagDom)
        }
    }
    // 创建面板
    _that.createCdssPanel = function(diagDom) {
        //免责申明
        var statementStr = '<div class="cdss-disease-statement" id="cdss-disease-statement">' +
            '<div class="cdss-title">' +
            '<span class="titlename">免责申明</span>' +
            '<span class="cdssclose"><img id="cdss-closeStatement" src="' + webBaseURL + '/image/close.png" alt=""></span>' +
            '</div>' +
            '<div class="cdss-content">' +
            '<div>' +
            '在使用本系统的所有功能之前，请您务必仔细阅读并透彻理解本声明。您可以选择不使用本系统，' +
            '但如果您使用本系统，您的使用行为将被视为对本 声明全部内容的认可。' +
            '</div>' +
            '<div class="cdss-content-title">' +
            '关于隐私权' +
            '</div>' +
            '<div>' +
            '鉴于本系统使用非人工检索/分析方式，无法确定您输入的条件进行是否合法，所以本系统对' +
            '检索/分析出的结果不承担责任。如果因以本系统的检索/分析结果作为任何商业行为或者学术研究的' +
            '依据而产生不良后果，本系统不承担任何法律责任。' +
            '</div>' +
            '<div class="cdss-content-title">' +
            '关于版权：' +
            '</div>' +
            '<div>' +
            '一、 凡本系统注明“国家知识产权局”、“专利检索及分析”的所有作品，其版权属于国家知识产权局' +
            '和本系统（www.pss-system.gov.cn）所有。其他媒体、网站或个人转载使用时不得进行商业性' +
            '的原版原式的转载，也不得歪曲和篡改本系统所发布的内容。' +
            '</div>' +
            '<div>' +
            '二、 凡本系统转载其它媒体作品的目的在于传递更多信息，并不代表本系统赞同其观点和对其真实' +
            '性负责；其他媒体、网站或个人转载使用时必须保留本站注明的文章来源，并自负法律责任。' +
            '</div>' +
            '<div>' +
            '三、 被本系统授权使用的单位，不应超越授权范围。' +
            '</div>' +
            '<div>' +
            '四、 本系统提供的资料如与相关纸质文本不符，以纸质文本为准。' +
            '</div>' +
            '<div>' +
            '五、 如因作品内容、版权和其它问题需要同本系统联系的，请在本系统发布该作品后的30日内进行。' +
            '</div>' +
            '<div class="cdss-content-title">' +
            '关于解释权：' +
            '</div>' +
            '<div>' +
            '鉴于本系统使用非人工检索/分析方式，无法确定您输入的条件进行是否合法，所以本系统对' +
            '检索/分析出的结果不承担责任。如果因以本系统的检索/分析结果作为任何商业行为或者学术' +
            '研究的依据而产生不良后果，本系统不承担任何法律责任。 本系统之声明以及其修改权、更新' +
            '权及最终解释权均属本站以及国家知识产权局所有。' +
            '</div>' +
            '</div>' +
            '</div>'
        var body = document.getElementsByTagName('body')[0];
        $(body).append(statementStr)

        
        //辅助诊疗
        var ScaleClass = _that.RecScale ? '' : 'disabled'
        var diagStr = '<div class="cdss-askbob-search-wrap">' +
            '<ul class="cdss-ul-tab cdss-clearfix">' +
            '<li class="cdss-tab-li cdss-tab-li-first active">' +
            '<div class="cdss-tab-icon-ctn " id="cdss-tab-icon-ctn">' +
            '<img src="' + webBaseURL + '/image/icon_tab.png" />' +
            '<ul class="cdss-tab-icon-ul" id="cdss-tab-icon-ul" style="margin-left: 26px;">' +
            '<li class="' + ScaleClass + '">公式量表</li>' +
            // '<li class="cdss-af-li">房颤</li>' +
            // '<li>最小化</li>' +
            '</ul>' +
            '</div>' +
            '<div class="cdss-tab-li-ctn">' +
            '<span class="cdss-tab-li-ctn-span"></span>' +
            '辅助诊疗</div></li>' +
            '<li class="cdss-tab-li cdss-tab-li-second">' +
            '<div class="cdss-tab-li-ctn">' +
            '<span class="cdss-tab-li-ctn-span"></span>' +
            '预警提示</div>' +
            '<i class="cdss-tab-icon-red"></i>' +
            '</li>' +
            '</ul>' +
            '<div class="cdss-askbob-search-ctn">' +
            '<div class="cdss-askbob-search-right">' +
            '<input type="text" value="' + _that.searchType + '" id="cdss-askbob-search-input">' +

            '<img src="' + webBaseURL + '/image/icon_search.png" class="cdss-askbob-search-icon" />' +
            '<img src="' + webBaseURL + '/image/close1.png" class="cdss-askbob-search-icon-clear" />' +
            '<div class="cdss-askbobbox-search-tips">' +
            '<div class="cdss-askbobbox-search--triangle"></div>' +
            '<div class="cdss-askbobbox-search--tips-ctn">' + _that.searchType1 + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="cdss-askbob-search-suggest">' +
            '<div class="cdss-search-content"></div>' +
            '<div class="cdss-search-more">加载更多</div>' +
            '</div>' +
            '<div id="cdss-tab-ctn-left">' +
            '<div class="cdss-auxiliaryConsultation-diagnosis-box">' +

            '<div class="cdss-auxiliaryConsultation">' +
            // 工具标题栏
            '<div class="cdss-auxiliary-top">' +
            '<div class="cdss-line-left active" onselectstart = "return false" >' +
            '<span class="cdss-auxiliary-l-title">' +
            '辅助问诊' +
            '</span>' +
            '<img class="cdss-auxiliary-img-active" src="' + webBaseURL + '/image/icon_unfold.png" />' +
            '<img class="cdss-auxiliary-img-deactive" src="' + webBaseURL + '/image/icon_unfold-rotate.png" />' +
            '</div>' +
            '<div class="cdss-line-right" onselectstart = "return false" >' +
            '<span class="cdss-auxiliary-r-title">' +
            '换一批' +
            '</span>' +
            '<img class="cdss-auxiliary-r-img" src="' + webBaseURL + '/image/ic_gengxing.png" />' +
            '</div>' +
            '</div>' +
            // 内容区
            '<div class="cdss-auxiliary-bottom">' +

            '</div>' +

            '</div>' +
            '<div class="cdss-diagnosis-wrap cdss-diagnosis-wrap-step">' +
            '<div class="cdss-moduletit">' +
            '疑似诊断' +
            '<div class="cdss-filter-local-disease active" id="cdss-filter-local-disease">' +
            '<img class="cdss-filter-local-img-active" src="' + webBaseURL + '/image/checkbox.png" />' +
            '<img class="cdss-filter-local-img-deactive" src="' + webBaseURL + '/image/checkbox1.png" />' +
            '本地常见病靠前</div>' +

            '</div>' +
            '<div class="cdss-diagnosis-list" id="cdss-diagnosis-list">' +

            '</div>' +
            '<div class="cdss-diagnpsis-empty">' +
            '输入主诉等信息，获取疑似诊断推荐' +
            '<div class="cdss-askbob-qr-code-img"><img src="' + webBaseURL + '/image/qrcode.png" /><span>扫码关注Askbob医生站</span></div>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<div class="cdss-disease-detail-wrap">' +
            '<div class="cdss-disease-detail-header">' +
            '<span class="cdss-disease-detail-close" id="cdss-disease-detail-close-btn">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="">' +
            '</span>' +

            '<div class="cdss-disease-header-module">' +
            '<div class="cdss-disease-detail-active">' +
            '<span class="cdss-disease-detail-name"></span>' +
            '<img src="' + webBaseURL + '/image/icon_more_advice.png" alt="" class="cdss_disease_icon_more" />' +

            '<img src="' + webBaseURL + '/image/bq_hjb.png" class="cdss-disease-detail-right-hjb"/>' +
            '<img class="cdss-disease-detail-name-icon" src="' + webBaseURL + '/image/icon_diseasedetail.png" />' +
            '<img class="cdss-disease-detail-name-icon-add" src="' + webBaseURL + '/image/icon_add_prescriptions.png" />' +

            '<div class="cdss-disease-header-tab">' +
            '<div class="cdss-disease-detail-triangle"></div>' +
            '<ul class="cdss-disease-detail-list"></ul>' +
            '</div>' +
            '</div>' +

            '</div>'

        // '<span class="cdss-disease-detail-ctn"><span class="cdss-disease-detail-name"></span>'+

        // '</span>'
        if (_that.renwei) {
            diagStr += '<img  id="cdss-renwei-url-icon" src="' + webBaseURL + '/image/icon_renwei.png" />'
        }
        diagStr += '</div>' +
            '<div class="cdss-disease-treat-evidence">' +
            '<div class="cdss-disease-treat-evid-tabs">' +
            '<span class="cdss-disease-treat-label active">诊疗</span><span class="cdss-disease-evid-label">循证</span>' +
            '</div>' +
            '<div class="cdss-disease-treat-evid-ctn">' +
            '<div class="cdss-disease-treat-ctn">' +
            '<div class="cdss-disease-ascvd-eval-wrap cdss-before-border">' +
            '<div class="cdss-disease-treat-title"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_pingguliangbiao.png /> 评估量表</div>' +
            '<div class="cdss-disease-eval-list"></div>' +
            '</div>' +
            '<div class="cdss-disease-module-inspect cdss-before-border">' +
            '<div class="cdss-disease-treat-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_jianbiezhenduan.png /> 鉴别诊断</span>' +
            '</div>' +
            '<div class="cdss-disease-inspect-diagmsg">' +

            '</div>' +
            '</div>' +

            '<div class="cdss-checkRecommend-model cdss-before-border" >' +
            '<div class="cdss-checkRecommend-title"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_jingzhunyongyao.png /> 检查检验推荐</div>' +
            '<div class="cdss-checkRecommend-ctn-model"></div>' +
            '</div>' +

            '<div class="cdss-treat-btn cdss-before-border" id="cdss-treat-btn">' +
            '<div class="cdss-disease-treat-title"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_jingzhunyongyao.png /> 精准用药推荐</div>' +
            '<div class="cdss-treat-ctn-model"><div class="cdss-treat-ctn">' +
            '<img src="' + webBaseURL + '/image/icon_jingzhunzhiliao.png" />' +
            '精准治疗方案推荐</div></div>' +
            '</div>' +
            // 常用处方
            '<div class="cdss-disease-module-prescription cdss-before-border">' +
            '<div class="cdss-disease-prescription-title">' +
            '<span  id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_changyongchufang.png /> 常用西药处方推荐</span>' +
            '</div>' +
            '<div class="cdss-disease-prescription-list-wrap">' +

            '</div>' +
            '</div>' +

            // 常用西药推荐
            '<div class="cdss-disease-module-commondrugs cdss-before-border">' +
            '<div class="cdss-disease-treat-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_changyongchufang.png /> 常用西药推荐</span>' +
            '</div>' +
            '<div class="cdss-disease-commondrugs-list-wrap">' +

            '</div>' +
            '</div>' +

            // 常用中草药方推荐
            '<div class="cdss-disease-module-chDrugRecommend cdss-before-border">' +
            '<div class="cdss-disease-chDrugRecommend-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_chDrugRecommend.png /> 常用中草药方</span>' +
            '</div>' +
            '<div class="cdss-disease-chDrugRecommend-list-wrap">' +

            '</div>' +
            '</div>' +
            // 常用中成药推荐
            '<div class="cdss-disease-module-chPatentDrugRecommend cdss-before-border">' +
            '<div class="cdss-disease-chPatentDrugRecommend-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_chPatentDrugRecommend.png /> 常用中成药</span>' +
            '</div>' +
            '<div class="cdss-disease-chPatentDrugRecommend-list-wrap">' +

            '</div>' +
            '</div>' +

            '<div class="cdss-disease-module-treatmethod cdss-before-border">' +
            '<div class="cdss-disease-treat-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_tongyongzhiliao.png /> 通用治疗方案</span>' +
            '</div>' +
            '<div class="cdss-disease-treat-list-content">' +

            '</div>' +
            '</div>' +
            // 详情的检验解读
            '<div class="cdss-detail-sheet-diagnosis-wrap cdss-before-border">' +
            '<div class="cdss-detail-sheet-diagnosis-title">' +
            '检验解读' +
            '</div>' +
            '<div class="cdss-detail-sheet-diagnosis-ctn">' +

            '</div>' +
            '</div>' +
            // 无权限 提示
            '<div class="cdss-detail-no-access">' +
            '</div>' +

            '</div>' +
            '<div class="cdss-disease-evid-ctn">' +
            '<div class="cdss-disease-evid-module-similar">' +
            '<div class="cdss-disease-evid-module-title active">' +
            '<span>相似病例</span>' +
            '<span class="cdss-disease-evid-module-fold">' +
            '<img src="' + webBaseURL + '/image/icon_unfold.png" class="cdss-unfold-img"/>' +
            '<img src="' + webBaseURL + '/image/icon_unfold-rotate.png" class="cdss-rotate-img"/>' +
            '</span>' +
            '</div>' +
            '<div class="cdss-disease-evid-module-list">' +

            '</div>' +
            '</div>' +
            '<div class="cdss-disease-evid-module-instru">' +
            '<div class="cdss-disease-evid-module-title active">' +
            '<span>疾病指南</span>' +
            '<span class="cdss-disease-evid-module-fold">' +
            '<img src="' + webBaseURL + '/image/icon_unfold.png" class="cdss-unfold-img"/>' +
            '<img src="' + webBaseURL + '/image/icon_unfold-rotate.png" class="cdss-rotate-img"/>' +
            '</span>' +
            '</div>' +
            '<div class="cdss-disease-evid-module-list">' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="cdss-eval-table-wrap">' +
            '<span class="cdss-eval-table-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-eval-table-close-btn">' +
            '</span>' +
            '<div class="cdss-eval-table-title">' +
            '评估量表' +
            '</div>' +
            '<div class="cdss-eval-table-wrap-ctn">' +

            '</div>' +
            '<div class="cdss-eval-calc-btn">' +
            '<span class="cdss-eval-btn" id="cdss-eval-btn">评估</span>' +
            '</div>' +
            '<div class="cdss-eval-result-wrap">' +
            '<div class="cdss-eval-result-risk">' +
            '<span><i>高危</i></span>' +
            '</div>' +
            '<div class="cdss-eval-result-discrip">' +
            '<div class="cdss-eval-result-discrip-child">' +
            '患者目前属于冠心病、脑梗死等动脉粥样硬化疾病的高危（10年风险>10%）人群' +
            '</div>' +
            '</div>' +
            '<div class="cdss-eval-result-writeback">' +
            '<div class="write-back-ctn cdss-writeback-ctn">' +
            '<img src="' + webBaseURL + '/image/icon_edit.png" alt="" id="cdss-eval-result-writeback-btn">' +
            '<div class="write-back">回写</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="cdss-disease-case-detail-wrap">' +
            '<span class="cdss-disease-case-detail-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-disease-detail-case-close-btn">' +
            '</span>' +
            '<div class="cdss-disease-case-detail-wrap-ctn">' +

            '</div>' +
            '</div>' +

            '<div class="cdss-all-search-list-wrap">' +
            '<span class="cdss-all-search-list-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-all-search-list-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-all-search-list-item">' +

            '</div>' +
            '</div>' +

            '<div class="cdss-case-guide-search-list-wrap">' +
            '<span class="cdss-case-guide-search-list-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-case-guide-search-list-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-case-guide-search-list-item-wrap">' +
            '</div>' +
            '</div>' +

            '<div class="cdss-other-search-list-wrap">' +
            '<span class="cdss-other-search-list-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-other-search-list-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-other-search-list-item-wrap">' +

            '</div>' +
            '</div>' +

            '<div class="cdss-case-guide-detail-wrap">' +
            '<span class="cdss-case-guide-detail-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-case-guide-detail-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-case-guide-detail-title">' +
            '</div>' +
            '<div class="cdss-case-guide-detail-source">' +
            '<div>来源：</div>' +
            '<span></span>' +
            '</div>' +
            '<div class="cdss-case-guide-detail-keywords">' +
            '关键词：' +
            '<div class="cdss-case-guide-detail-keywords-wrap">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-case-guide-detail-notes">' +
            '<div class="cdss-case-guide-detail-nofold"></div>' +
            '<div class="cdss-case-guide-detail-bref-intro">' +
            '</div>' +
            '<div class="cdss-case-guide-detail-list-item-wrap">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-case-guide-detail-relate-disease">' +
            '</div>' +
            '</div>' +

            '<div class="cdss-drug-common-list-wrap">' +
            '<span class="cdss-drug-common-list-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-drug-common-list-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-drug-common-list-item-wrap">' +
            '</div>' +
            '</div>' +

            '<div class="cdss-drug-mec-list-wrap">' +
            '<div class="cdss-drug-mec-list-title">' +
            '<div class="cdss-drug-mec-list-title-tit">' +
            '<div class="cdss-drug-mec-list-tit">' +
            '</div>' +
            '<span class="cdss-drug-mec-list-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-drug-mec-list-wrap-close-btn">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-drug-mec-list-subtit">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-drug-mec-list-ctn">' +
            '</div>' +
            '</div>' +

            '<div class="cdss-select-drug-type-wrap">' +
            '<span class="cdss-select-drug-type-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-select-drug-type-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-select-drug-type-title">' +
            '选择药品的剂量和规格' +
            '</div>' +
            '<div class="cdss-select-drug-type-dosage">' +
            '<div class="cdss-select-drug-type-dosage-title">' +
            '剂型' +
            '</div>' +
            '<div class="cdss-select-drug-type-dosage-wrap">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-select-drug-type-spec">' +
            '<div class="cdss-select-drug-type-spec-title">' +
            '规格' +
            '</div>' +
            '<div class="cdss-select-drug-type-spec-wrap">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-select-drug-type-todetail">' +
            '查看药品详情' +
            '</div>' +
            '</div>' +

            '<div class="cdss-select-drug-detail-wrap">' +
            '<span class="cdss-select-drug-detail-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-select-drug-detail-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-select-drug-detail-title">' +
            '</div>' +
            '<div class="cdss-select-drug-detail-spec">' +
            '规格：' +
            '<div class="cdss-select-drug-detail-spec-item">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-select-drug-detail-usage">' +
            '<div class="cdss-select-drug-detail-usage-title">' +
            '用法用量：' +
            '</div>' +
            '<div class="cdss-select-drug-detail-usage-ctn">' +
            '</div>' +
            '</div>' +
            '<div class="cdss-select-drug-detail-relate-drug-wrap">' +
            '<div class="cdss-select-drug-detail-relate-drug-wrap-title">' +
            '相关药品' +
            '</div>' +
            '<div class="cdss-select-drug-detail-relate-drug-wrap-ctn">' +
            '</div>' +
            '</div>' +
            '</div>' +
            // 疾病详情
            '<div class="cdss-drug-detail-wrap">' +
            '<div class="cdss-drug-detail-basicinfo-wrap">' +
            '<span class="cdss-drug-detail-wrap-close">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="" id="cdss-drug-detail-wrap-close-btn">' +
            '</span>' +
            '<div class="cdss-drug-detail-atcNameZh"></div>' +
            '<div class="cdss-drug-detail-drugname">' +
            '</div>' +
            '<div class="cdss-drug-detail-drugcompany">' +
            '</div>' +
            '<div class="cdss-drug-detail-drugcate">' +
            '</div>' +
            '<div class="cdss-drug-detail-drugimg">' +
            '<img src="" onerror=\'this.src="' + webBaseURL + '/image/default_drug.png"\'  alt="" id="cdss-drug-detail-drug-img">' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">通用名：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-cnname"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">英文名：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-enname"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">剂型：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-type"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">主要成分：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-madeof"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">规格：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-specific"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">贮藏：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-storage"></div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basicinfo">' +
            '<div class="cdss-drug-detail-basic-left">批准文号：</div>' +
            '<div class="cdss-drug-detail-basic-right cdss-drug-detail-basic-top-code"></div>' +
            '</div>' +
            '</div>' +
            '<div class="cdss-drug-detail-basic-info-fold-wrap">' +
            '<div class="cdss-drug-detail-basic-info-title">' +
            '<span class="cdss-drug-detail-basic-info-title-name">适应症</span>' +
            '<span class="cdss-drug-detail-basic-info-title-fold">' +
            '<img src="' + webBaseURL + '/image/arrow.png" alt="" class="cdss-arrow-img">' +
            '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-drug-detail-basic-info-ctn">' +

            '</div>' +
            '</div>' +

            '</div>' +
            // 检查解读
            '<div class="cdss-test-sheet-diagnosis-wrap">' +
            '<div class="cdss-test-sheet-diagnosis-title">' +
            '检验解读' +
            '<span class="cdss-test-sheet-diagnosis-close" id="cdss-test-sheet-diagnosis-close-btn">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-test-sheet-diagnosis-ctn">' +

            '</div>' +
            '<div class="cdss-test-sheet-diagnosis-no-access"></div>' +
            '</div>' +

            // 处方信息的点击 显示的区块
            '<div class="cdss-prescription-detail-wrap">' +
            '<span class="cdss-prescription-detail-close" id="cdss-prescription-detail-close-btn">' +
            '<img src="' + webBaseURL + '/image/close1.png" alt="">' +
            '</span>' +
            '<div class="cdss-advice-header-module">' +
            '<div class="cdss-advice-disease-active">' +
            '<span></span>' +
            '<img src="' + webBaseURL + '/image/icon_more_advice.png" alt="">' +
            '</div>' +
            '<div class="cdss-advice-header-tab">' +
            '<div class="cdss-advice-disease-triangle"></div>' +
            '<ul class="cdss-advice-disease-list"></ul>' +
            '</div>' +
            '</div>' +

            '<div class="cdss-treat-btn cdss-before-border" id="cdss-prescription-treat-btn">' +
            '<div class="cdss-disease-treat-title"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_jingzhunyongyao.png /> 精准用药推荐</div>' +
            '<div class="cdss-treat-ctn-model"><div class="cdss-treat-ctn">' +
            '<img src="' + webBaseURL + '/image/icon_jingzhunzhiliao.png" />' +
            '精准治疗方案推荐</div></div>' +
            '</div>' +

            // 常用处方
            '<div class="cdss-drug-list-most-module-prescription cdss-before-border">' +
            '<div class="cdss-disease-prescription-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_changyongchufang.png /> 常用西药处方推荐</span>' +
            '</div>' +
            '<div class="cdss-drug-list-most-prescription-list-wrap">' +

            '</div>' +
            '</div>' +
            //常用药物
            '<div class="cdss-drug-list-most-commom-wrap cdss-before-border">' +
            '<div class="cdss-drug-list-basic-commom-ctn">' +
            '<div class="cdss-disease-treat-title"><span><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_changyongchufang.png /> 常用西药推荐</span></div>' +
            '<div class="cdss-drug-list-commom-ctn"></div>' +
            '</div>' +
            '</div>' +

            // 常用中草药方推荐
            '<div class="cdss-drug-list-most-module-chDrugRecommend cdss-before-border">' +
            '<div class="cdss-disease-chDrugRecommend-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_chDrugRecommend.png /> 常用中草药方</span>' +
            '</div>' +
            '<div class="cdss-drug-list-most-chDrugRecommend-list-wrap">' +

            '</div>' +
            '</div>' +
            // 常用中成药推荐
            '<div class="cdss-drug-list-most-module-chPatentDrugRecommend cdss-before-border">' +
            '<div class="cdss-disease-chPatentDrugRecommend-title">' +
            '<span id="cdss-disease-prescription-title-span"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_chPatentDrugRecommend.png /> 常用中成药</span>' +
            '</div>' +
            '<div class="cdss-drug-list-most-chPatentDrugRecommend-list-wrap">' +

            '</div>' +
            '</div>' +
            //药物用量参考
            '<div class="cdss-drug-usage-and-dosage-wrap cdss-before-border">' +
            '<div class="cdss-drug-usage-and-dosage-title">' +
            '药品用法参考' +
            '</div>' +
            '<div class="cdss-drug-usage-and-dosage-ctn">' +
            '</div>' +
            '<div class="cdss-drug-usage-and-dosage-no-access"></div>' +
            '</div>' +
            //说明书快捷入口
            '<div class="cdss-instruction-commom-wrap cdss-before-border">' +
            '<div class="cdss-instruction-title">说明书快捷入口</div>' +
            '<div class="cdss-instruction-commom-ctn"></div>' +
            '</div>' +
            '<div class="cdss-no-prescription"></div>' +
            '</div>' +
            '</div>' +


            '<div id="cdss-tab-ctn-right" class="cdss-tab-ctn-right">' +
            // // // // // warn-img zt
            '<div class="warn_imgage" style="padding-top:15px;">' +
            '<img src=' + webBaseURL + '/image/bg_warning.png />' +
            '</div>' +
            // 检验检查合理性
            '<div class="cdss-check-conflict-commom-wrap cdss-before-border">' +
            '<div class="cdss-check-list-basic-commom-title">' +
            '检验检查合理性' +
            '</div>' +
            '<ul class="cdss-check-conflict-ctn">' +

            '</ul>' +

            '</div>' +


            // 漏检漏诊
            '<div class="cdss-miss-check-wrap cdss-before-border">' +
            '<div class="cdss-miss-check-title">' +
            '漏检' +
            '</div>' +
            '<div class="cdss-miss-check-content">' +

            '</div>' +
            '</div>' +
            // 用药合理性
            '<div class="cdss-drug-conflict-commom-wrap cdss-before-border">' +
            '<div class="cdss-drug-list-basic-commom-title">' +

            '用药合理性' +
            '</div>' +
            '<div class="cdss-drug-conflict-wrap">' +
            '<div class="cdss-drug-conflict-ctn">' +

            '</div>' +
            '</div>' +
            '<div class="cdss-drug-conflict-no-access"></div>' +
            '</div>' +

            // 病历质控
            '<div class="cdss-caseQc-wrap cdss-before-border">' +
            '<div class="cdss-caseQc-title">' +
            '病历质控' +
            '</div>' +
            '<ul class="cdss-caseQc-ctn">' +

            '</ul>' +
            '<div class="cdss-caseQc-no-access"></div>' +
            '</div>' +
            // 手术智能提醒
            '<div class="cdss-surgeryRemind-wrap cdss-before-border">' +
            '<div class="cdss-surgeryRemind-title">' +
            '手术智能提醒' +
            '</div>' +
            '<ul class="cdss-surgeryRemind-ctn">' +

            '</ul>' +
            '<div class="cdss-surgeryRemind-no-access"></div>' +
            '</div>' +
            // 医嘱执行提醒
            '<div class="cdss-doctorAdvice-wrap cdss-before-border">' +
            '<div class="cdss-doctorAdvice-title">' +
            '医嘱执行提醒' +
            '</div>' +
            '<ul class="cdss-doctorAdvice-ctn">' +

            '</ul>' +
            '<div class="cdss-doctorAdvice-no-access"></div>' +
            '</div>' +
            // 输血禁忌提醒
            '<div class="cdss-transfusionRemind-wrap cdss-before-border">' +
            '<div class="cdss-doctorAdvice-title">' +
            '输血禁忌提醒' +
            '</div>' +
            '<ul class="cdss-transfusionRemind-ctn">' +

            '</ul>' +
            '<div class="cdss-transfusionRemind-no-access"></div>' +
            '</div>' +
            // 护理智能提醒
            '<div class="cdss-nursing-commom-wrap cdss-before-border">' +
            '<div class="cdss-drug-list-basic-commom-title">' +
            '护理智能提醒' +
            '</div>' +
            '<div class="cdss-nursing-wrap">' +
            '<p class="cdss-nursing-des">患者以下体征超出正常范围，请通知医生并按时复查：</p>' +
            '<ul class="cdss-nursing-ctn">' +
            '</ul>' +
            '</div>' +
            '<div class="cdss-nursing-no-access"></div>' +
            '</div>' +
            // 护理评估
            '<div class="cdss-nursing-department-wrap cdss-before-border">' +
            '<div class="cdss-nursing-treat-title">护理评估</div>' +
            '<div class="cdss-nursing-department-list"></div>' +
            '</div>' +
            // 手术评估
            '<div class="cdss-transfusion-department-wrap cdss-before-border">' +
            '<div class="cdss-transfusion-treat-title">手术评估</div>' +
            '<div class="cdss-transfusion-department-list"></div>' +
            '</div>' +
            // 传染病填报质控提醒
            '<div class="cdss-infectious-Diseases-wrap cdss-before-border">' +
            '<div class="cdss-infectious-Diseases-title">' +
            '传染病填报质控' +
            '</div>' +
            '<div class="cdss-infectious-Diseases-content">' +

            '</div>' +
            '</div>' +


            '<div class="cdss-no-data">暂无预警提示信息</div>' +
            '</div>' +
            // 免责声明
            '<div class="cdss-statementbtn cdss-clearfix">' +
            '<div class="cdss-statementbtn-left">' +
            '<span>' +
            _that.shortName +
            '<div class="cdss-hospital-tips"><div class="cdss-hospital-triangle"></div><div class="cdss-hospital-tips-ctn">' + _that.hospitalName + '</div></div>' +
            '</span>' +
            '</div>' +
            '<i class="cdss-statementbtn-middle"></i>' +
            '<div class="cdss-statementbtn-right">平安CDSS&nbsp<span id="cdss-statementbtn">免责申明</span></div>' +
            '</div>'
        $(diagDom).empty().append(diagStr).addClass('cdss-container')
        if (_that.tabShow == 1) { // 辅助诊疗
            $('.cdss-tab-li-first').css('width', '100%').addClass('cdss-no-border')
            $('.cdss-tab-li-second').hide()
            $('.cdss-tab-li-ctn-span').hide()
        } else if (_that.tabShow == 2) { // 预警提示
            console.log(_that.tabShow)
            $('.cdss-tab-li-first').css('width', '100%').addClass('cdss-no-border')
            $('.cdss-tab-li-ctn').text('预警提示')
            $('.cdss-tab-li-second').hide()
            $('.cdss-tab-li-ctn-span').hide()
            showTab('right')
            $('.cdss-tab-li-first').addClass('active')
            _that.showNoData()
        }
        if (_that.afAuth.openAfPage) {
            $('.cdss-af-li').show()
        } else {
            $('.cdss-af-li').hide()
        }
        console.log('cdss-container', $('.cdss-container').length)
        var Inter = setInterval(function() {
            if ($('.cdss-container').length && ($(".cdss-container").css("background-color") == "rgb(255, 255, 255)" || $(".cdss-container").css("background-color") == "#ffffff")) {
                clearInterval(Inter)
                if (_that.eventList.length) {
                    $.each(_that.eventList, function(index, item) {
                        _that[item.eventType](item.eventData)
                        _that.eventList.shift(1)
                    })
                }
            }
        }, 200)
        _that.diagDom = diagDom
        $('.cdss-tab-li').off('click').on('click', function(e) {
            if ($(this).hasClass('cdss-tab-li-first')) { // 点击的辅助诊疗
                showTab('left')
            } else { // 点击的预警提示
                showTab('right')
                $('.cdss-tab-icon-red').hide()
                _that.showNoData()
            }
        })
        $('#cdss-tab-icon-ctn').off('click').on('click', function(e) {
            $("#cdss-tab-icon-ul").toggle()
            e.stopPropagation()
        })
        $('#cdss-tab-icon-ul li').on('click', function(e) {
            console.log($(this).text())
            if ($(this).text() == '公式量表') {
                if (_that.RecScale) {
                    if (_that.scaleAccess) {
                        _that.surveyType = 'all'
                        $('.cdss-formular-depart-nav').each(function(i) {
                            if (i == 0 && !$(this).hasClass('active')) {
                                $(this).click()
                            }
                            if (i == 0) {
                                console.log($(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name'))
                                var list = $(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name')
                                var length = $(this).next('.cdss-formular-item-wrap').find('.cdss-formular-eval-name').length
                                console.log(length)
                                $('.cdss-formular-scale-nav .cdss-formular-eval-name').removeClass('active')
                                $(list[0]).addClass('active')
                            }
                        })
                        _that.showSurveyDom()

                        var mdData = {
                            event: "公式量表打开",
                            page: "公式量表页",
                            pageElement: "公式量表名称",
                            operation1: '公式量表'
                        }
                        _that.REC(mdData)
                    } else {
                        _that.showCdssAlert(_that.scaleAccessText.replace('<br>', ''))
                    }
                } else {
                    e.stopPropagation()
                }
            } else if ($(this).text() == '最小化') {
                $('#cdss-drug-rec-pill').show()
                $(_that.diagDom).hide()
                if(window['toggleAssistPanel']){toggleAssistPanel('show')}
            } else if ($(this).text() == '房颤') {
                console.log('跳转房颤url')
                if (_that.afAuth.openAfPage) {
                    _that.afAuth.afWebUrlAll = _that.afAuth.afWebUrl + '#/content/news/?hospitalId=' + _that.hospitalId + '&patientId=' + _that.patientId + '&hospitalName=' + _that.hospitalName +
                        '&patientName=' + _that.name + '&age=' + _that.age + '&gender=' + _that.gender + '&belongCity=' + _that.belongCity +
                        "&physicianName=" + _that.physicianName + '&physicianId=' + _that.physicianId + '&outerSerialNo=' + _that.outerSerialNo + '&hospitalDepartment=' + _that.hospitalDepartment + '&noHeade=1' +
                        '&channelid=' + _that.channelId + '&institutionid=' + _that.institutionId + '&hospitalDepartmentId=' + _that.hospitalDepartmentId

                    _that.iframeAF()
                }
            }
        })
        $('body').on('click', function() {
            $('#cdss-tab-icon-ul').hide()
        })
        $("#cdss-statementbtn").off('click').on('click', function() {
            $("#cdss-bg").show()
            $("#cdss-disease-statement").show()
        })
        $("#cdss-closeStatement").off('click').on('click', function() {
            $("#cdss-bg").hide()
            $("#cdss-disease-statement").hide()
        })
        $("#cdss-filter-local-disease").off('click').on('click', function() {
                $(this).toggleClass("active")
                needMove = !needMove
                _that.setRecommendInput(cdssPatientInfo)
            })
            //清除askbob输入
        $(".cdss-askbob-search-icon-clear").on("click", function() {
                $(".cdss-askbob-search-suggest").hide();
                $("#cdss-askbob-search-input").val(_that.searchType).css('color', '#999999');

                $(".cdss-askbob-search-icon-clear").hide();
            })
            //关闭
        $("#cdss-disease-detail-close-btn").off('click').on('click', function() {
            $(".cdss-disease-detail-wrap").hide()
        })
        $("#cdss-disease-detail-case-close-btn").off('click').on('click', function() {
            $(".cdss-disease-case-detail-wrap").hide()
        })
        $("#cdss-eval-table-close-btn").off('click').on('click', function() {
            $(".cdss-eval-table-wrap").hide()
        })
        $("#cdss-all-search-list-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-all-search-list-wrap").hide()
        })
        $("#cdss-other-search-list-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-other-search-list-wrap").hide()
        })
        $("#cdss-drug-mec-list-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-drug-mec-list-wrap").hide()
        })
        $("#cdss-drug-common-list-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-drug-common-list-wrap").hide()
        })
        $("#cdss-select-drug-type-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-select-drug-type-wrap").hide()
        })
        $("#cdss-select-drug-detail-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-select-drug-detail-wrap").hide()
        })
        $("#cdss-case-guide-search-list-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-case-guide-search-list-wrap").hide()
        })
        $("#cdss-case-guide-detail-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-case-guide-detail-wrap").hide()
        })
        $("#cdss-test-sheet-diagnosis-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-test-sheet-diagnosis-wrap").hide()
        })
        $("#cdss-drug-conflict-commom-wrap-close-btn").off('click').on('click', function() {
            $(".cdss-drug-conflict-commom-wrap").hide()
        })

        // 辅助问诊-展开/收起
        $(".cdss-line-left").off('click').on('click', function() {
            // .children('.cdss-drug-usage-and-dosage-cell')
            $(this).parent().next('.cdss-auxiliary-bottom').toggle()
            $(this).toggleClass('active')
        })

        //详情内治疗循证切换
        $(".cdss-disease-treat-label").off('click').on('click', function() {
            $(".cdss-disease-evid-label").removeClass('active')
            $(this).addClass('active')
            $(".cdss-disease-treat-ctn").show()
            $(".cdss-disease-evid-ctn").hide()
        })
        $(".cdss-disease-evid-label").off('click').on('click', function() {
                $(".cdss-disease-treat-label").removeClass('active')
                $(this).addClass('active')
                $(".cdss-disease-treat-ctn").hide()
                $(".cdss-disease-evid-ctn").show()
            })
            //治疗方案折叠
        $(".cdss-disease-module-treatmethod").on('click', '.cdss-disease-treat-title-sub', function() {
                $(this).toggleClass("active")
                $(this).next().toggleClass("hide")
            })
            //循证内相似病例 疾病指南折叠
        $(".cdss-disease-evid-module-title").on('click', function() {
                $(this).toggleClass("active")
                $(this).next().toggleClass("hide")
            })
            //药物详情折叠
        $(".cdss-drug-detail-basic-info-fold-wrap").on('click', '.cdss-drug-detail-basic-info-title', function() {
                $(this).toggleClass("active")
                $(this).next().toggleClass("hide")
            })
            //关闭药物详情
        $("#cdss-drug-detail-wrap-close-btn").off('click').on('click', function() {
                $(".cdss-drug-detail-wrap").hide()
            })
            //相似病例跳转详情
        $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list").on('click', '.cdss-disease-evid-sim-pdf-item', function() {
                var title = $(this).attr('title')
                var diseasename = $(this).attr('diseasename')
                var mdData = {
                    event: "相似病例打开",
                    page: "疾病循证详情页",
                    pageElement: "相似病例名称",
                    operation1: diseasename,
                    operation2: title
                }
                _that.REC(mdData)
                var id = $(this).prop('id')
                var info = {
                    id: id,
                    type: 'case',
                    hospitalId: _that.hospitalId, //医院号
                    hospitalName: _that.hospitalName, //医院名称
                    belongCity: _that.belongCity, //城市
                    physicianId: _that.physicianId, //医生号
                    physicianName: _that.physicianName, //医生姓名
                    patientId: _that.patientId, //患者号
                    name: _that.name, //患者姓名
                    outerSerialNo: _that.outerSerialNo, //流水号
                    age: _that.age,
                    gender: _that.gender
                }
                $.ajax({
                    url: baseURL + '/diagnose/post/similarCaseAndGuideDetail',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(info),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                        request.setRequestHeader('source', 'evid')
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {
                            $(".cdss-disease-case-detail-wrap").show()
                            $(".cdss-all-search-list-wrap").hide()
                            $(".cdss-case-guide-search-list-wrap").hide()
                            $(".cdss-other-search-list-wrap").hide()
                            $(".cdss-case-guide-detail-wrap").hide()
                            $(".cdss-drug-common-list-wrap").hide()
                            $(".cdss-drug-mec-list-wrap").hide()
                            $(".cdss-select-drug-type-wrap").hide()
                            $(".cdss-select-drug-detail-wrap").hide()
                            $(".cdss-drug-detail-wrap").hide()
                            $(".cdss-prescription-detail-wrap").hide()
                            $(".cdss-drug-conflict-commom-wrap").hide()
                            $('.cdss-drug-usage-and-dosage-wrap').hide()
                            var data = resData.data
                            var totalStr = ''
                            for (var title in data) {
                                totalStr += '<div class="cdss-disease-case-detail-title">' + title + '</div>'
                                if (Object.prototype.toString.call(data[title]) == '[object String]') {
                                    totalStr += '<div >' + data[title] + '</div>'
                                } else if (Object.prototype.toString.call(data[title]) == '[object Array]') {
                                    if (Object.prototype.toString.call(data[title][0]) == '[object String]') {
                                        for (var i = 0; i < data[title].length; i++) {
                                            totalStr += '<div >' + data[title][i] + '</div>'
                                        }
                                    } else if (Object.prototype.toString.call(data[title][0]) == '[object Object]') {
                                        var arr = data[title]
                                        for (var j = 0; j < arr.length; j++) {
                                            for (var tit in arr[j]) {
                                                totalStr += '<div class="tit-p">' + tit + ':</div>'
                                                if (Object.prototype.toString.call(arr[j][tit][0]) == '[object String]') {
                                                    for (var k = 0; k < arr[j][tit].length; k++) {
                                                        totalStr += '<div >' + arr[j][tit][k] + '</div>'
                                                    }
                                                } else if (Object.prototype.toString.call(arr[j][tit][0]) == '[object Object]') {
                                                    var dt = arr[j][tit]
                                                    for (var m = 0; m < dt.length; m++) {
                                                        for (var key in dt[m]) {
                                                            totalStr += '<div>' + key + ':' + dt[m][key] + '</div>'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            $(".cdss-disease-case-detail-wrap-ctn").empty().append(totalStr)
                        } else {


                        }
                    },
                    error: function(err) {

                    }
                })
            })
            //疾病指南跳转详情
        $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list").on('click', '.cdss-disease-evid-sim-pdf-item', function() {
            var title = $(this).attr('title')
            var diseasename = $(this).attr('diseasename')
            var mdData = {
                event: "疾病指南打开",
                page: "疾病循证详情页",
                pageElement: "疾病指南名称",
                operation1: diseasename,
                operation2: title
            }
            _that.REC(mdData)

            var id = $(this).attr('key')
            var url = baseURL + '/diagnose/get/getOfflinePdf?key=' + id
            var notIE = !(/trident/g.test(navigator.userAgent.toLowerCase()) || /edge/g.test(navigator.userAgent.toLowerCase()))
            if (notIE) {
                var xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.responseType = 'blob'
                xhr.setRequestHeader('source', 'pdf_detail')
                xhr.onload = function() {
                    if (this.status == 200) {
                        var blob = this.response
                        var href = window.URL.createObjectURL(blob)
                        window.open(href, '_blank')
                    }
                }
                xhr.send()
            } else {
                // window.open(url,'_blank')
                var downloadElement = document.createElement('a');
                downloadElement.href = url;
                downloadElement.target = '_blank';
                downloadElement.download = 'doc.pdf'; //下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                // window.URL.revokeObjectURL(url); //释放掉blob对象
            }

            // $.ajax({
            //     url: baseURL + '/diagnose/get/getOfflinePdf?key='+id,
            //     type: 'get',
            //     datatype: 'mutipart/form-data', //期望服务器返回类型
            //     contentType: 'json',//application/x-www-form-unlencoded;charset=UTF-8
            //     scriptCharset: 'utf-8',
            //     beforeSend: function (request) {
            //     },
            //     success: function (resData,status,response){
            //         console.log(response)
            //         // console.log(response.getResponseHeader('Content-Disposition'))
            //         var blob=new Blob([resData],{type:'application/pdf'})
            //         var url=window.URL.createObjectURL(blob)
            //         console.log(url)
            //         window.open(url,'_blank')
            //         // window.URL.revokeObjectURL(url)
            //     },
            //     error:function(err){

            //     }
            // })

        })

        //搜疾病/症状/药品/检查/病例/指南/手术
        $("#cdss-askbob-search-input").on("focus", function() {
                $('#cdss-tab-icon-ul').hide()
                $('.cdss-askbobbox-search-tips').hide()
                if ($("#cdss-askbob-search-input").val() == _that.searchType) {
                    $("#cdss-askbob-search-input").val('').css('color', '#333333')

                }
            })
            //处理提示信息
        $("#cdss-askbob-search-input").on("blur", function() {
                searchTimer = setTimeout(function() {
                    // $(".cdss-askbob-search-suggest").hide()
                    if (!$("#cdss-askbob-search-input").val()) {
                        $("#cdss-askbob-search-input").val(_that.searchType).css('color', '#999999')
                    }
                }, 500)
            })
            // 点击其他区域关闭搜索建议框
        $('body').click(function(e) {
            $(".cdss-askbob-search-suggest").hide()
        })
        $('.cdss-askbob-search-right').on('mouseenter', function() {
            $('.cdss-askbobbox-search-tips').show()
        })
        $('.cdss-askbob-search-right').on('mouseleave', function() {
            $('.cdss-askbobbox-search-tips').hide()
        })
        $('.cdss-askbob-search-right,.cdss-askbob-search-suggest').click(function(e) {
                e.stopPropagation()
            })
            //askbob搜索框
        var askBobInputTimeout;
        $("#cdss-askbob-search-input").on("keyup", function(e) {
            if (e.keyCode == '13') { //回车执行搜索功能
                var text = $(this).val()
                _that.currentPage = 1
                _that.enterSearchFuc(text)
            } else { //联想输入列表相关功能
                var keyword = $(this).val()
                if (askBobInputTimeout) {
                    clearTimeout(askBobInputTimeout);
                    askBobInputTimeout = null
                }
                var notIE = !(/trident/g.test(navigator.userAgent.toLowerCase()) || /edge/g.test(navigator.userAgent.toLowerCase()))
                askBobInputTimeout = setTimeout(function() {
                    if (keyword) {
                        if (notIE) {
                            $(".cdss-askbob-search-icon-clear").show()
                        }
                        var text = e.target.value;
                        _that.currentPage = 1
                        _that.enterSearchFuc(text);
                    } else {
                        $(".cdss-askbob-search-suggest").hide()
                        $(".cdss-askbob-search-icon-clear").hide()
                    }
                }, 450);
            }
        })
        $(".cdss-askbob-search-suggest .cdss-search-more").click(function() {
            if ($(this).hasClass('cdss-no-more')) { // 没有更多了
                return
            }
            _that.currentPage++
                _that.enterSearchFuc(_that.searchKeywords)
        })


        //askbob联想列表字段点击
        $(".cdss-askbob-search-suggest").on("click", ".cdss-askbob-search-list-item", function() {
                var ids = $(this).attr('id');
                var types = $(this).attr('type');
                var attrbute = $(this).attr('attrbute');
                var names = $(this).attr('name');
                var keys = $(this).attr('key');
                var keywords = $(this).attr('name');
                var isRare = $(this).attr('isRare');

                var typeobj = {
                    "drug": "药品",
                    "case": "相似病例",
                    "guide": "疾病指南",
                    "scale": "公式量表",
                    "check": "检验检查",
                    "disease": "疾病",
                    "operation": "手术",
                    "symptom": "症状"
                }
                var recData = {
                    event: "搜索结果详情查看",
                    page: "医学搜索",
                    pageElement: "搜索结果名称",
                    operation1: (typeobj[types] ? typeobj[types] : types),
                    operation2: names
                }
                _that.REC(recData)

                if (types == 'case') {
                    var info = {
                        id: keys,
                        type: 'case',
                        hospitalId: _that.hospitalId, //医院号
                        hospitalName: _that.hospitalName, //医院名称
                        belongCity: _that.belongCity, //城市
                        physicianId: _that.physicianId, //医生号
                        physicianName: _that.physicianName, //医生姓名
                        patientId: _that.patientId, //患者号
                        name: _that.name, //患者姓名
                        outerSerialNo: _that.outerSerialNo, //流水号
                        age: _that.age,
                        gender: _that.gender
                    }
                    $.ajax({
                        url: baseURL + '/diagnose/post/similarCaseAndGuideDetail',
                        type: 'post',
                        datatype: 'json',
                        data: JSON.stringify(info),
                        contentType: 'application/json',
                        scriptCharset: 'utf-8',
                        beforeSend: function(request) {
                            request.setRequestHeader('Content-Type', 'application/json')
                            request.setRequestHeader('channel-id', channelId)
                            request.setRequestHeader('institution-id', institutionId)
                            request.setRequestHeader('source', 'case_search')
                        },
                        success: function(resData) {
                            if (resData.retCode == '999999') {
                                if (resData.data) {
                                    if ($(".cdss-askbob-detail-pop").length == 0) {
                                        var wraper = '<div class="cdss-askbob-detail-pop">' +
                                            '<div class="cdss-detail-pop-title">' +
                                            '<span class="cdss-detail-pop-titlename">' + resData.data['标题'] + '</span>' +
                                            '<span class="cdssclose"><img id="cdss-detail-pop-close" src="' + webBaseURL + '/image/close.png" alt=""></span>' +
                                            '</div>' +
                                            '<div class="cdss-detail-pop-content">' +
                                            '<div class="cdss-detail-pop-content-left"></div>' +
                                            '<div class="cdss-detail-pop-content-right"></div>' +
                                            '</div>' +
                                            '<div class="cdss-detail-pop-footer"><span>内容来源 : Askbob医生站</span></div>'
                                        '</div>';
                                        var body = document.getElementsByTagName('body')[0];
                                        $(body).append(wraper);
                                    } else {
                                        $('.cdss-detail-pop-titlename').text(resData.data['标题'])
                                    }

                                    var data = resData.data
                                    var totalStr = ''
                                    var idIndex = 0
                                    for (var title in data) {
                                        totalStr += '<div class="cdss-disease-case-detail-title" id="cdss-disease-case-scroll-' + idIndex + '">' + title + '</div>'
                                        if (Object.prototype.toString.call(data[title]) == '[object String]') {
                                            totalStr += '<div >' + data[title] + '</div>'
                                        } else if (Object.prototype.toString.call(data[title]) == '[object Array]') {
                                            if (Object.prototype.toString.call(data[title][0]) == '[object String]') {
                                                for (var i = 0; i < data[title].length; i++) {
                                                    totalStr += '<p >' + data[title][i] + '</p>'
                                                }
                                            } else if (Object.prototype.toString.call(data[title][0]) == '[object Object]') {
                                                var arr = data[title]
                                                for (var j = 0; j < arr.length; j++) {
                                                    for (var tit in arr[j]) {
                                                        totalStr += '<div class="tit-p">' + tit + ':</div>'
                                                        if (Object.prototype.toString.call(arr[j][tit][0]) == '[object String]') {
                                                            for (var k = 0; k < arr[j][tit].length; k++) {
                                                                totalStr += '<p >' + arr[j][tit][k] + '</p>'
                                                            }
                                                        } else if (Object.prototype.toString.call(arr[j][tit][0]) == '[object Object]') {
                                                            var dt = arr[j][tit]
                                                            for (var m = 0; m < dt.length; m++) {
                                                                for (var key in dt[m]) {
                                                                    totalStr += '<p >' + key + ':' + dt[m][key] + '</p>'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        idIndex++
                                    }
                                    $(".cdss-detail-pop-content-left").empty().append(totalStr)
                                        // 处理右侧目录数据
                                    var rightStr = ''
                                    var rightArr = [];
                                    for (var keyr in data) {
                                        rightArr.push(keyr);
                                    }
                                    for (var keyIndexr = 0; keyIndexr < rightArr.length; keyIndexr++) {
                                        if (data[rightArr[keyIndexr]]) {
                                            rightStr += '<a href="javascript:void(0)" class="cdss-detail-pop-right-item" id="cdss-detail-list-nav-' + keyIndexr + '"><span>' + rightArr[keyIndexr] + '</span></a>'
                                        }
                                    }
                                    rightStr += '<div class="cdss-disease-list-nave-qrimg"><img src="' + webBaseURL + '/image/qrcode.png" /><span>扫码关注Askbob医生站</span></div>'
                                    $(".cdss-detail-pop-content-right").empty().html(rightStr);
                                    // 点击右侧目录跳转
                                    $(".cdss-detail-pop-right-item:first").addClass('active');
                                    $(".cdss-detail-pop-right-item").on("click", function() {
                                        $(this).addClass('active');
                                        $(this).siblings().removeClass('active');
                                        var ids = $(this).attr("id");
                                        var tarId = 'cdss-disease-case-scroll-' + ids.split('cdss-detail-list-nav-')[1];
                                        if (document.body.scrollIntoView) {
                                            document.querySelector("#" + tarId).scrollIntoView(true);
                                        }
                                    });
                                    $("#cdss-bg").show();
                                    $(".cdss-askbob-detail-pop").show();
                                    // 关闭弹窗
                                    $("#cdss-detail-pop-close").off('click').on('click', function() {
                                        document.querySelector(".cdss-detail-pop-content-left").scrollTop = 0;
                                        document.querySelector(".cdss-detail-pop-content-right").scrollTop = 0;
                                        $("#cdss-bg").hide();
                                        $(".cdss-askbob-detail-pop").hide();
                                    })
                                } else {
                                    _that.showCdssAlert('未查询到病例详情！')
                                }
                            } else {

                            }
                        },
                        error: function(err) {}
                    })
                } else if (types == 'guide') {
                    var url = baseURL + '/diagnose/get/getOfflinePdf?key=' + keys
                    var notIE = !(/trident/g.test(navigator.userAgent.toLowerCase()) || /edge/g.test(navigator.userAgent.toLowerCase()))
                    if (notIE) {
                        var xhr = new XMLHttpRequest()
                        xhr.open('GET', url, true)
                        xhr.responseType = 'blob'
                        xhr.setRequestHeader('source', 'pdf_search')
                        xhr.onload = function() {
                            if (this.status == 200) {
                                var blob = this.response
                                var href = window.URL.createObjectURL(blob)
                                window.open(href, '_blank')
                            }
                        }
                        xhr.send()
                    } else {
                        // window.open(url,'_blank')
                        var downloadElement = document.createElement('a');
                        downloadElement.href = url;
                        downloadElement.target = '_blank';
                        downloadElement.download = 'doc.pdf'; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        // window.URL.revokeObjectURL(url); //释放掉blob对象
                    }

                } else if (types == 'scale') { // 公式量表
                    if (_that.RecScale) {
                        var id = $(this).attr('key')
                        var text = $(this).attr('name')
                        var department = $(this).attr('department')
                        $('#cdss-drugrec-search-questionwrap .cdss-scale-tit').attr('id', id)
                        _that.searchDepartFun(id)
                    }
                } else {
                    _that.getMedicalInfo({ keyword: names, type: types, messageId: ids, key: keys, source: 'search', isRare: isRare })
                }
                var mdData = {
                    outerSerialNo: _that.outerSerialNo,
                    hospitalId: _that.hospitalId,
                    hospitalName: _that.hospitalName,
                    belongCity: _that.belongCity,
                    physicianId: _that.physicianId,
                    physicianName: _that.physicianName,
                    patientId: _that.patientId,
                    name: _that.name,
                    age: _that.age,
                    gender: _that.gender,
                    messageId: ids || '123',
                    type: types,
                    keyword: keywords,
                    key: keys,
                    attrbute: attrbute,
                    rareDisease: (isRare && isRare == 'rare_disease') ? 1 : 0
                }
                $.ajax({
                    url: baseURL + '/diagnose/post/searchRecord',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(mdData),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {} else {

                        }
                    },
                    error: function(err) {

                    }
                })
            })
            // 搜索打开新量表
        _that.searchDepartFun = function(id) {
                var surobj = {
                    diseaseTypes: [id]
                }
                $.ajax({
                    url: baseURL + '/common/post/getSurvey',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(surobj),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                        request.setRequestHeader('source', _that.surveyType)
                    },
                    success: function(resData) {

                        if (resData.retCode == '999999') {
                            var data = resData.data

                            if (data.questions) {
                                renderSearchSurvey(data.questions[0].question)
                                showSearchDom()
                            }
                            //关闭按钮
                            $("#cdss-drugrec-search-question-close").on("click", function() {
                                    $("#cdss-drugrec-search-questionwrap").hide();
                                    $('.cdss-formular-search-scale-quest-result-wrap').hide()
                                    $(".cdss-bg").hide()
                                })
                                //清空按钮
                            $('.cdss-formular-search-scale-quest-empty').on('click', function() {
                                    $('.cdss-formular-search-scale-quest-val input').val('')
                                    $('.cdss-formular-search-scale-quest-radio').removeClass('active')
                                    $('.cdss-formular-search-scale-quest-checkbox').removeClass('active')
                                })
                                //评估按钮
                            $('.cdss-formular-search-scale-quest-eva').off('click').on('click', function() {
                                //校验必须都填写(输入框 单选 多选)
                                var questArr = $('.cdss-formular-search-scale-quest-gird')
                                var questLen = questArr.length
                                var inputArr = []
                                var radioArr = []
                                var checkboxArr = []
                                var inputLen = 0
                                var radioLen = 0
                                var checkLen = 0
                                for (var p = 0; p < questArr.length; p++) {
                                    var type = questArr.eq(p).attr('type')
                                    if (type == 'NUMERIC') {
                                        inputArr.push(questArr.eq(p))
                                        inputLen++
                                    } else if (type == 'SINGLE_CHOICE') {
                                        radioArr.push(questArr.eq(p))
                                        radioLen++
                                    } else if (type == 'MULTIPLE_CHOICE') {
                                        checkboxArr.push(questArr.eq(p))
                                        checkLen++
                                    }
                                }
                                //step1.校验输入框
                                for (var a = 0; a < inputArr.length; a++) {
                                    var val = inputArr[a].find('input').val()
                                    var text = inputArr[a].find('.cdss-formular-search-scale-quest-name').text().slice(1)
                                    if (!val.length) {
                                        _that.showCdssAlert('所有选项必填，请填写完整！')
                                        return
                                    }
                                    //校验输入框范围
                                    var low = parseFloat(inputArr[a].find('input').attr('rangeleft'))
                                    var high = parseFloat(inputArr[a].find('input').attr('rangeright'))
                                    if (((low || high) && val < low) || ((low || high) && val > high)) {
                                        _that.showCdssAlert(text + '超出[' + low + '~' + high + ']的范围！')
                                        return
                                    }
                                }
                                //step2.校验单选
                                var activeRadioArr = $('.cdss-formular-search-scale-quest-val .cdss-formular-search-scale-quest-radio.active')
                                var activeRadioLen = activeRadioArr.length
                                if (activeRadioLen != radioLen) {
                                    _that.showCdssAlert('所有选项必填，请填写完整！')
                                    return
                                }
                                //step3.校验多选
                                var activeCheckArr = $('.cdss-formular-search-scale-quest-val .cdss-formular-search-scale-quest-checkbox.active')
                                var activeCheckLen = activeCheckArr.length
                                if (checkLen > activeCheckLen) {
                                    _that.showCdssAlert('所有选项必填，请填写完整！')
                                    return
                                }

                                var kvList = []
                                for (var i = 0; i < inputArr.length; i++) {
                                    var id = inputArr[i].find('input').attr('id').split('.')
                                    var len = id.length - 1
                                    var key = id[len]
                                    var obj = {
                                        key: key,
                                        value: parseFloat(inputArr[i].find('input').val())
                                    }
                                    kvList.push(obj)
                                }
                                for (var j = 0; j < activeRadioArr.length; j++) {
                                    var id = activeRadioArr.eq(j).attr('name').split('.')
                                    var len = id.length - 1
                                    var key = id[len]
                                    var obj = {
                                        key: key,
                                        value: parseFloat(activeRadioArr.eq(j).attr('value'))
                                    }
                                    kvList.push(obj)
                                }
                                if (checkboxArr.length > 0) {
                                    for (var k = 0; k < checkboxArr.length; k++) {
                                        var obj = {}
                                        var id = checkboxArr[k].attr('id').split('.')
                                        var len = id.length - 1
                                        var key = id[len]
                                        var value = ''
                                        for (var s = 0; s < checkboxArr[k].find('.cdss-formular-search-scale-quest-checkbox').length; s++) {
                                            value += checkboxArr[k].find('.cdss-formular-search-scale-quest-checkbox').eq(s).hasClass("active") ? "1" : "0"
                                        }
                                        obj['key'] = key
                                        obj['value'] = value
                                        kvList.push(obj)
                                    }
                                }

                                var surveyName = $('#cdss-drugrec-search-questionwrap .cdss-scale-tit').attr('id')
                                var scaleName = $('.cdss-formular-search-scale-quest-title').text()
                                console.log('scaleName', scaleName)
                                var reqData = {
                                    hospitalId: _that.hospitalId, //医院号
                                    hospitalName: _that.hospitalName, //医院名称
                                    belongCity: _that.belongCity, //城市
                                    physicianId: _that.physicianId, //医生号
                                    physicianName: _that.physicianName, //医生姓名
                                    patientId: _that.patientId, //患者号
                                    name: _that.name, //患者姓名
                                    outerSerialNo: _that.outerSerialNo, //流水号
                                    age: _that.age || 40,
                                    gender: _that.gender,
                                    hospitalDepartment: _that.hospitalDepartment,
                                    surveyName: surveyName,
                                    kvList: kvList,
                                    scaleName: scaleName
                                }
                                if (kvList && kvList.length) {
                                    for (var i = 0; i < kvList.length; i++) {
                                        if ((kvList[i].key == 'age') && kvList[i].value) {
                                            reqData.age = kvList[i].value
                                        }
                                        console.log(kvList[i])
                                        if ((kvList[i].key == 'gender')) {
                                            reqData.gender = kvList[i].value == 1 ? '男' : '女'
                                        }
                                    }
                                }
                                $.ajax({
                                        url: baseURL + '/diagnose/post/getScaleDiagnosis',
                                        type: 'post',
                                        datatype: 'json',
                                        data: JSON.stringify(reqData),
                                        contentType: 'application/json',
                                        scriptCharset: 'utf-8',
                                        beforeSend: function(request) {
                                            request.setRequestHeader('Content-Type', 'application/json')
                                            request.setRequestHeader('channel-id', channelId)
                                            request.setRequestHeader('institution-id', institutionId)
                                            request.setRequestHeader('source', _that.surveyType)
                                        },
                                        success: function(resData) {
                                            if (resData.retCode == '999999') {
                                                var data = resData.data.riskResult
                                                if (data && data.length > 0) {
                                                    var risk = data[0]
                                                    $('.cdss-formular-search-scale-quest-result-level').empty().text(risk.grade || '评估结果')
                                                    if (risk.score == '-1') {
                                                        $('.cdss-formular-search-scale-quest-result-score-wrap').hide()
                                                    } else {
                                                        $('.cdss-formular-search-scale-quest-result-score').empty().text(risk.score)
                                                        $('.cdss-formular-search-scale-quest-result-score-wrap').show()
                                                    }
                                                    var desc = risk.description ? risk.description : '无评估结果'
                                                    $('.cdss-formular-search-scale-quest-result-desc').empty().text(desc)
                                                    $('.cdss-formular-search-scale-quest-result-wrap').show()
                                                    if (document.body.scrollIntoView) {
                                                        document.querySelector(".cdss-formular-search-scale-quest-result-wrap").scrollIntoView(true);
                                                    }
                                                    // 公式量表回写
                                                    risk.writeType = 2
                                                    risk.writeText = $('.cdss-formular-search-scale-quest-title').text() + '评估结果：' + risk.description.replace(/<.*?>/ig,  "")
                                                    $('#cdss-formular-search-scale-quest-result-write').off('click').on('click', function() {
                                                        var mdData = {
                                                            event: "量表搜索评估结果回写",
                                                            page: "单量表详情页",
                                                            pageElement: "结果回写图标",
                                                            operation1: $('.cdss-formular-search-scale-quest-title').text()
                                                        }
                                                        _that.REC(mdData)
                                                        if (getWriteBack) {
                                                            _that.toast('回写成功')
                                                            getWriteBack(risk)
                                                        }
                                                    })
                                                } else {
                                                    $('.cdss-formular-search-scale-quest-result-level').empty().text('评估结果')
                                                    $('.cdss-formular-search-scale-quest-result-score-wrap').hide()
                                                    $('.cdss-formular-search-scale-quest-result-desc').empty().text('无评估结果')
                                                    $('.cdss-formular-search-scale-quest-result-wrap').show()
                                                    if (document.body.scrollIntoView) {
                                                        document.querySelector(".cdss-formular-search-scale-quest-result-wrap").scrollIntoView(true);
                                                    }
                                                }
                                            }
                                        },
                                        error: function(err) {}
                                    })
                                    // 搜索公式量表评估按钮埋点
                                var mdData = {
                                    event: "量表搜索评估结果查看",
                                    page: "单量表详情页",
                                    pageElement: "评估按钮",
                                    operation1: $('.cdss-formular-search-scale-quest-title').text()
                                }
                                _that.REC(mdData)

                            })
                        }
                    },
                    error: function(err) {}
                })

            }
            // 搜索量表 dom
        function creatSearchScale(id) {
            var dom = '<div class="cdss-drugrec-search-questionwrap" id="cdss-drugrec-search-questionwrap">' +
                '<div class="cdss-title">' +
                '<span class="titlename active cdss-scale-tit">公式量表</span>' +
                '<span class="cdssclose" id="cdss-drugrec-search-question-close">' +
                '<img src="' + webBaseURL + '/image/close.png" alt="">' +
                '</span>' +
                '</div>' +
                '<div class="cdss-drugrec-search-formular-switch-wrap">' +

                '<div class="cdss-formular-search-scale-content">' +
                '<div class="cdss-formular-search-scale-table">' +
                '<div class="cdss-formular-search-scale-quest-ctn">' +

                '</div>' +
                '<div class="cdss-formular-search-scale-quest-btngroup">' +
                '<span class="cdss-formular-search-scale-quest-btn cdss-formular-search-scale-quest-empty">清空</span>' +
                '<span class="cdss-formular-search-scale-quest-btn cdss-formular-search-scale-quest-eva">评估</span>' +
                '</div>' +
                '<div class="cdss-formular-search-scale-quest-result-wrap">' +
                '<table>' +
                '<tr>' +
                '<td style="width:50px;">' +
                '<span class="cdss-formular-search-scale-quest-result-level"></span>' +
                '</td>' +
                '<td style="">' +
                '<div class="cdss-formular-search-scale-quest-result-score-wrap">评分：<span class="cdss-formular-search-scale-quest-result-score"></span></div>' +
                '<div class="cdss-formular-search-scale-quest-result-desc"></div>' +
                '</td>' +
                '<td style="width:26px;">' +
                '<div class="write-back-ctn">' +
                '<img src="' + webBaseURL + '/image/icon_edit.png" class="cdss-formular-search-scale-quest-result-write" id="cdss-formular-search-scale-quest-result-write" />' +
                '<div class="write-back">回写</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'

            $('body').append(dom)
        }
        creatSearchScale()
            // 渲染问卷
        function renderSearchSurvey(questions) {
            var questStr = ''
            for (var i = 0; i < questions.length; i++) {
                questStr += '<div class="cdss-formular-search-scale-quest-title">' + questions[i].name + '</div>' +
                    '<div>'
                for (var j = 0; j < questions[i].question.length; j++) {
                    if (questions[i].question[j].type == 'NUMERIC') {
                        questStr += '<div class="cdss-formular-search-scale-quest-gird" type="NUMERIC">' +
                            '<div class="cdss-formular-scale-quest-name">' +
                            '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                            '</div>' +
                            '<div class="cdss-formular-search-scale-quest-val" style="width:185px;">'
                        if (questions[i].question[j].range && questions[i].question[j].range[0]) {
                            questStr += '<input type="text" name="" id="' + questions[i].question[j].name +
                                '" rangeleft="' + questions[i].question[j].range[0].lbound +
                                '" rangeright="' + questions[i].question[j].range[0].rbound + '" maxlength="10">'
                        } else {
                            questStr += '<input type="text" name="" id="' + questions[i].question[j].name + '"  maxlength="10">'
                        }
                        questStr += '<span class="cdss-formular-search-scale-quest-unit">' + questions[i].question[j].unit + '</span>' +
                            '</div>' +
                            '</div>'
                    } else if (questions[i].question[j].type == 'SINGLE_CHOICE') {
                        questStr += '<div class="cdss-formular-search-scale-quest-gird" type="SINGLE_CHOICE">' +
                            '<div class="cdss-formular-scale-quest-name">' +
                            '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                            '</div>' +
                            '<div class="cdss-formular-search-scale-quest-val">'
                        for (var k = 0; k < questions[i].question[j].choice.length; k++) {
                            questStr += '<span class="cdss-formular-search-scale-quest-radio" value="' + questions[i].question[j].choice[k].value + '" name="' + questions[i].question[j].name + '">' +
                                '<img class="cdss-formular-search-scale-quest-radio-true" src="' + webBaseURL + '/image/radio.png" alt="">' +
                                '<img class="cdss-formular-search-scale-quest-radio-false" src="' + webBaseURL + '/image/radio1.png" alt="">' +
                                questions[i].question[j].choice[k].text +
                                '</span>'
                        }
                        questStr += '</div>' +
                            '</div>'
                    } else if (questions[i].question[j].type == 'MULTIPLE_CHOICE') {
                        questStr += '<div class="cdss-formular-search-scale-quest-gird" id="' + questions[i].question[j].name + '" type="MULTIPLE_CHOICE">' +
                            '<div class="cdss-formular-scale-quest-name">' +
                            '<span class="cdss-red">*</span>' + questions[i].question[j].text +
                            '</div>' +
                            '<div class="cdss-formular-search-scale-quest-val">'
                        for (var s = 0; s < questions[i].question[j].choice.length; s++) {
                            questStr += '<span class="cdss-formular-search-scale-quest-checkbox" value="' +
                                questions[i].question[j].choice[s].value + '" id="' +
                                questions[i].question[j].choice[s].id + '">' +
                                '<img class="cdss-formular-search-scale-quest-checkbox-true" src="' + webBaseURL + '/image/checkbox.png" alt="">' +
                                '<img class="cdss-formular-search-scale-quest-checkbox-false" src="' + webBaseURL + '/image/checkbox1.png" alt="">' +
                                questions[i].question[j].choice[s].text +
                                '</span>'
                        }
                        questStr += '</div>' +
                            '</div>'
                    }
                }

                questStr += '</div>'
            }
            $('.cdss-formular-search-scale-quest-ctn').empty().append(questStr)
            $('.cdss-formular-search-scale-quest-unit').off('click').on('click', function() {
                $(this).parent().children('input').focus()
            })
            if (document.body.scrollIntoView) {
                // document.querySelector(".cdss-formular-scale-quest-title").scrollIntoView(true)
                $('.cdss-formular-search-scale-table').scrollTop(true)
            }
            //单选js
            $('.cdss-formular-search-scale-quest-radio').on('click', function() {
                    $(this).siblings().removeClass('active')
                    $(this).addClass('active')
                })
                //多选js
            $('.cdss-formular-search-scale-quest-checkbox').on('click', function() {
                $(this).toggleClass('active')
            })

        }
        // 显示搜索量表
        function showSearchDom() {
            $("#cdss-bg").show()
                // $('.cdss-formular-search-scale-nav').show()
            $("#cdss-drugrec-search-questionwrap").show()
        }
        //人卫icon点击跳转
        $("#cdss-renwei-url-icon").on("click", function() {
            var name = $(this).parent().find('span').text()
            _that.renweiWakeUp(name)
        })

        //动态处理小药丸位置
        // setTimeout(function(){
        //   $("#cdss-drug-rec-pill").css({
        //       "top":"40px"
        //   })
        // },1000)
    }
    // 创建辅助输入面板
    _that.createAuxiliaryInput = function (inputDom, hisPresentDom) {  
        // 主诉辅助输入
        var span = '<div class="cdss-assist-input" id="cdss-assist-input">' +
            '<div class="cdss-assist-relative cdss-bottom-border">' +
            '<p class="cdss-assist-left cdss-assist-input-left">症状：</p>' +
            '<div class="cdss-assist-left cdss-assist-input-right cdss-assist-input-clearfix" id="cdss-assist-input-right"><span >肥胖</span>' +
            '<span>多尿</span>' +
            '<span>发热</span>' +
            '<span>头痛</span>' +
            '<span>头晕</span>' +
            '<span>水肿</span>' +
            '<span>痉挛</span>' +
            '<span>呕吐</span>' +
            '<span>咳嗽</span>' +
            '<span>呼吸困难</span>' +
            '<span>腹痛</span>' +
            '<span>腹泻</span>' +
            '<span>腹胀</span>' +
            '<span>恶心</span>' +
            '<span>尿失禁</span>' +
            '<span>便秘</span>' +
            '<span>胸痛</span>' +
            '<span>震颤</span>' +
            '<span>肩痛</span></div></div>' +
            '<div class="cdss-assist-relative">' +
            '<p class="cdss-assist-left cdss-assist-input-left">时间：</p>' +
            '<div class="cdss-assist-left cdss-assist-input-right cdss-assist-input-clearfix"><span >0</span>' +
            '<span>1</span>' +
            '<span>2</span>' +
            '<span>3</span>' +
            '<span>4</span>' +
            '<span>5</span>' +
            '<span>6</span>' +
            '<span>7</span>' +
            '<span>8</span>' +
            '<span>9</span>' +
            '<span>小时</span>' +
            '<span>分钟</span>' +
            '<span>秒</span>' +
            '<span>早晨</span>' +
            '<span>中午</span>' +
            '<span>晚上</span>' +
            '<span>天</span>' +
            '<span>周</span>' +
            '<span>月</span>' +
            '<span>年</span></div></div>' +
            '</div>';
        $(inputDom).empty().append(span);
        // 现病史辅助输入
        var hisPresent = '<div class="cdss-assist-input" id="cdss-hisPresent-input"></div>';
        $(hisPresentDom).empty().append(hisPresent);
        _that.hisPresentDom = hisPresentDom
    }
    _that.autoCreatePanelFun = function () {  
        if(_that.autoCreatePanel){
            var interVal = null
            if (!_that.pendingAuth) { // 没有检验过权限 正在检验权限中
                interVal = setInterval(function() {
                    if (_that.pendingAuth) {
                        clearInterval(interVal)
                        if (!_that.hasPower) { // 没有访问权限
                            return
                        } else { // 有访问权限
                            _that.autoCreatePanelFunAuth()
                        }
                    }
                }, 100)
            } else { // 检验过权限了
                if (_that.hasPower) { // 有访问权限
                    _that.autoCreatePanelFunAuth()
                }
            }
        }
    }
    _that.autoCreatePanelFunAuth = function () {  
        if(_that.autoCreatePanel){
            var str = '<div class="cdss-container"></div>'
            $('body').append(str)
            if(_that.positionInfo){
                var positionInfo = {
                    left: null,
                    right: '10px',
                    top: 0,
                    bottom: 0,
                    height: null,
                    width: '300px',
                    zIndex: '9800',
                }
                $('.cdss-container').css({
                    position: 'fixed',
                    left: (_that.positionInfo.left !== undefined ? _that.positionInfo.left : positionInfo.left),
                    right: (_that.positionInfo.right !== undefined ? _that.positionInfo.right : positionInfo.right),
                    top: (_that.positionInfo.top !== undefined ? _that.positionInfo.top : positionInfo.top),
                    bottom: (_that.positionInfo.bottom !== undefined ? _that.positionInfo.bottom : positionInfo.bottom),
                    height: (_that.positionInfo.height !== undefined ? _that.positionInfo.height : positionInfo.height),
                    width: (_that.positionInfo.width !== undefined ? _that.positionInfo.width : positionInfo.width),
                    borderLeft: '16px solid #f2f3f7',
                    zIndex: (_that.positionInfo.zIndex !== undefined ? _that.positionInfo.zIndex : positionInfo.zIndex)
                })
            }else{
                $('.cdss-container').css({
                    position: 'fixed',
                    left: null,
                    right: positionInfo.right,
                    top: positionInfo.top,
                    height: positionInfo.height,
                    width: positionInfo.width,
                    borderLeft: '16px solid #f2f3f7',
                    zIndex: positionInfo.zIndex
                })
            }
            _that.createCdssPanel('.cdss-container')
        }
    }
    _that.autoCreatePanelFun()
    _that.iframeAF = function(param) {
        console.log(11, $('.cdss-iframe-af').length)
        if (!$('.cdss-iframe-af').length) {
            // window.location.href = _that.afAuth.afWebUrlAll
            // return
            console.log(_that.afAuth.afWebUrlAll)
            var html = '<div class="cdss-iframe-af">' +
                '<div class="cdss-title">' +
                '<span class="titlename cdss-recdrug-tit">房颤临床辅助决策系统</span>' +
                '<span class="cdssclose cdss-iframe-af-close"><img src="' + webBaseURL + '/image/close.png" alt=""></span>' +
                '</div>' +
                '<iframe class="cdss-iframe-af-content" src = ' + _that.afAuth.afWebUrlAll + '></iframe></div>'
            var body = document.getElementsByTagName('body')[0];
            $(body).append(html)
            $('.cdss-iframe-af').show()
            $('.cdss-bg').show()
            $('.cdss-iframe-af-close').off('click').on('click', function() {
                $('.cdss-iframe-af').hide()
                $('.cdss-bg').hide()
            })
        } else {
            $('.cdss-iframe-af').show()
            $('.cdss-bg').show()
        }
    }

    //只创建用量查询
    _that.createUsageDom = function(diagDom) {
        var domStr = '<div class="cdss-drug-usage-and-dosage-wrap">' +
            '<div class="cdss-drug-usage-and-dosage-title">' +
            '药品用法参考' +
            '</div>' +
            '<div class="cdss-drug-usage-and-dosage-ctn">' +

            '</div>' +
            '</div>'
        $(diagDom).empty().append(domStr)
    }

    // askbob搜索方法
    _that.enterSearchFuc = function(val) {
        var info = {}
        info.keywords = val;
        _that.searchKeywords = val;
        info.currentPage = _that.currentPage || 1
        $.ajax({
            url: baseURL + '/diagnose/post/offlineSearch',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(info),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999' && resData.data.content && resData.data.content.length) {
                    var listData = resData.data.content;
                    // 组装返回的list数据
                    var backStr = ''
                    if (listData && listData.length) {
                        for (var bi = 0; bi < listData.length; bi++) {
                            var leftName = ''
                            var type = listData[bi].type
                            if (type == 'disease') {
                                leftName = '疾病'
                            } else if (type == 'drug') {
                                leftName = '药品'
                            } else if (type == 'check') {
                                leftName = '检查'
                            } else if (type == 'symptom') {
                                leftName = '症状'
                            } else if (type == 'case') {
                                leftName = '病例'
                            } else if (type == 'guide') {
                                leftName = '指南'
                            } else if (type == 'operation') {
                                leftName = '手术'
                            } else if (type == 'scale') {
                                leftName = '量表'
                            }
                            backStr += '<div class="cdss-askbob-search-list-item" name="' +
                                listData[bi].name + '" type="' +
                                type + '" id="' +
                                listData[bi].id + '" key="' +
                                listData[bi].key + '" isRare="' +
                                listData[bi].isRare + '" department="' +
                                listData[bi].department + '">' +
                                '<span class="cdss-askbob-search-list-left ' +
                                'cdss-askbob-search-list-' + type + '">' + leftName +
                                '</span>' +
                                '<div class="cdss-askbob-search-list-right">' +
                                listData[bi].name +
                                '</div>'
                            if (listData[bi].isRare == 'rare_disease') { // 罕见病
                                backStr += '<img class="cdss-askbob-search-list-right-hjb" src="' + webBaseURL + '/image/bq_hjb.png" />'
                            }
                            backStr += '<div class="cdss-askbob-search-tips">' +
                                '<div class="cdss-askbob-search--triangle"></div>' +
                                '<div class="cdss-askbob-search--tips-ctn">' + listData[bi].name + '</div>' +
                                '</div>' +
                                '</div>'
                        }
                    }
                    if (listData.length >= 20) { // 有第二页
                        $(".cdss-askbob-search-suggest .cdss-search-more").removeClass('cdss-no-more').html('加载更多')
                    } else {
                        $(".cdss-askbob-search-suggest .cdss-search-more").addClass('cdss-no-more').html('没有更多了')
                    }
                    if (_that.currentPage == 1) {
                        $(".cdss-askbob-search-suggest .cdss-search-content").empty().append(backStr)
                    } else {
                        $(".cdss-askbob-search-suggest .cdss-search-content").append(backStr)
                    }
                    $(".cdss-askbob-search-suggest").show()
                    $(".cdss-askbob-search-icon-clear").show()
                        //搜索提示信息
                    $(".cdss-askbob-search-list-right").on('mouseenter', function() {
                        $(this).parent().find(".cdss-askbob-search-tips").show()
                    })
                    $(".cdss-askbob-search-list-right").on('mouseout', function() {
                        $(this).parent().find(".cdss-askbob-search-tips").hide()
                    })
                } else {
                    $(".cdss-askbob-search-suggest .cdss-search-more").addClass('cdss-no-more').html('没有更多了')
                }
            },
            error: function(err) {

            }
        })
    }

    // 检验检查合理性 接口调用
    _that.checkTestReport = function(reports, drugs) {
        if (!_that.hasPower || _that.tabShow == 1) { return }
        var data = {
                age: _that.age, // 年龄
                gender: _that.gender, // 性别
                hpi: _that.hisPresent, // 现病史
                pastHistory: _that.pastHistory, // 既往史
                diagnosis: _that.diagnosis, // 诊断
                reports: reports, // 检验检查项 化验单信息 
                drugs: drugs || []
            }
            // data.drugs = [
            //   "华法林钠片",
            //   "阿托伐他汀钙片"
            // ]
        var text = ''
        if (reports && reports.length) {
            for (var i = 0; i < reports.length; i++) {
                text += reports[i].name
            }
        } else {
            return
        }
        var mdData = {
            event: "检验检查合理性调用",
            page: "预警提示页",
            pageElement: "检验检查合理性",
            operation1: text
        }
        _that.REC(mdData)
        $.ajax({
            url: baseURL + '/decision/post/testReportRationality',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                _that.noPower.hasPower = true
                if (resData.retCode == '999999') {
                    // 返回状态正常 且返回的数据数组正常  当检验检查校验有冲突数据时
                    if (resData.data.status === 0 && resData.data.risk && resData.data.risk.length) {
                        $('.cdss-tab-icon-red').show()
                            // resData.data.risk
                        var conflictStr = ''
                        var length = resData.data.risk.length
                        for (var i = 0; i < length; i++) {
                            if (i == 0) {
                                conflictStr += '<li>' +
                                    '<div class="cdss-check-cell-header">' +
                                    '<img src="' + webBaseURL + '/image/' + (resData.data.risk[i].testSheetType == 1 ? "icon_jianyan" : "icon_jiancha") + '.png" alt="">' +
                                    resData.data.risk[i].testName +
                                    '</div>' +
                                    '<div class="cdss-check-cell-ctn">' +
                                    '<p>' + resData.data.risk[i].message + '</p>' +
                                    '<p>冲突对象：' + resData.data.risk[i].conflict + '</p>' +
                                    '</div>' +
                                    '</li>'
                            }
                        }
                        if (length > 1) {
                            conflictStr += '<div class="cdss-check-more">'
                            for (var i = 1; i < resData.data.risk.length; i++) {
                                conflictStr += '<li>' +
                                    '<div class="cdss-check-cell-header">' +
                                    '<img src="' + webBaseURL + '/image/' + (resData.data.risk[i].testSheetType == 1 ? "icon_jianyan" : "icon_jiancha") + '.png" alt="" >' +
                                    resData.data.risk[i].testName +
                                    '</div>' +
                                    '<div class="cdss-check-cell-ctn">' + resData.data.risk[i].message +
                                    '</div>' +
                                    '</li>'
                            }
                            conflictStr += '</div>'
                            conflictStr += '<div class="cdss-check-showmore">更多' +
                                '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                '</div>' +
                                '<div class="cdss-check-hidemore">隐藏' +
                                '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                '</div>'
                        }
                        $('.cdss-check-conflict-commom-wrap').show()
                        _that.showNoData()
                        $('.cdss-check-conflict-ctn').empty().html(conflictStr)
                        if (length > 1) {
                            $('.cdss-check-showmore').off('click').on('click', function() {
                                $('.cdss-check-more').show()
                                $(this).hide()
                                $('.cdss-check-hidemore').show()
                            })
                            $('.cdss-check-hidemore').off('click').on('click', function() {
                                $('.cdss-check-more').hide()
                                $('.cdss-check-showmore').show()
                                $(this).hide()
                            })
                        }
                    }
                } else if (resData.retCode == '-100010') {
                    _that.noPower = {
                        hasPower: false,
                        msg: resData.retMsg
                    }
                    _that.showNoData()
                }
                deleteBorder()
            },
            error: function() {
                console.log("检验检查合理性接口调用失败")
            }
        })

    }
    _that.toast = function(text, time) {
            $("#cdss-warn-tipsWrap span").text(text)
            $("#cdss-warn-tipsWrap").show()
            setTimeout(function() { $("#cdss-warn-tipsWrap").hide() }, time || 3000)
        }
        //更新辅助数据
    _that.setRecommendInput = function(patientInfo) {
            if (!_that.hasPower || _that.tabShow == 2) { return }
            if(patientInfo.age !== undefined){
                _that.age = patientInfo.age 
            }
            if(patientInfo.gender !== undefined){
                _that.gender = patientInfo.gender
            }
            _that.T = patientInfo.T //体温
            _that.SBP = patientInfo.SBP //舒张压
            _that.DBP = patientInfo.DBP //收缩压
            _that.P = patientInfo.P //脉搏
            _that.height = patientInfo.height //身高
            _that.weight = patientInfo.weight //体重
            _that.hisPresent = patientInfo.hisPresent //现病史
            _that.pastHistory = patientInfo.pastHistory //既往史

            cdssPatientInfo = patientInfo
            var newkvList = []
            patientInfo.hasDisease && newkvList.push({
                key: "hasDisease",
                value: patientInfo.hasDisease
            })
            patientInfo.T && newkvList.push({
                key: "T",
                value: parseFloat(patientInfo.T)
            })
            patientInfo.SBP && newkvList.push({
                key: "SBP",
                value: parseFloat(patientInfo.SBP)
            })
            patientInfo.DBP && newkvList.push({
                key: "DBP",
                value: parseFloat(patientInfo.DBP)
            })
            patientInfo.P && newkvList.push({
                key: "P",
                value: parseFloat(patientInfo.P)
            })
            patientInfo.height && newkvList.push({
                key: "height",
                value: parseFloat(patientInfo.height)
            })
            patientInfo.weight && newkvList.push({
                key: "weight",
                value: parseFloat(patientInfo.weight)
            })
            var info = {
                mainComplaint: patientInfo.mainComplaint,
                gender: patientInfo.gender,
                age: patientInfo.age || 40,
                hisPresent: patientInfo.hisPresent, //现病史
                pastHistory: patientInfo.pastHistory, //既往史
                hospitalId: _that.hospitalId, //医院号
                hospitalName: _that.hospitalName, //医院名称
                belongCity: _that.belongCity, //城市
                physicianId: _that.physicianId, //医生号
                physicianName: _that.physicianName, //医生姓名
                patientId: _that.patientId, //患者号
                name: _that.name, //患者姓名
                outerSerialNo: _that.outerSerialNo, //流水号
                age: _that.age || 40,
                gender: _that.gender,
                kvList: newkvList,
                needMove: needMove
            }
            info.hospitalDepartment = _that.hospitalDepartment
            info.hospitalDepartmentId = _that.hospitalDepartmentId
            var span = '<div class="cdss-assist-relative cdss-bottom-border">' +
                '<p class="cdss-assist-left cdss-assist-input-left">症状：</p>' +
                '<div class="cdss-assist-left cdss-assist-input-right cdss-assist-input-clearfix" id="cdss-assist-input-right"><span >肥胖</span>' +
                '<span>多尿</span>' +
                '<span>发热</span>' +
                '<span>头痛</span>' +
                '<span>头晕</span>' +
                '<span>水肿</span>' +
                '<span>痉挛</span>' +
                '<span>呕吐</span>' +
                '<span>咳嗽</span>' +
                '<span>呼吸困难</span>' +
                '<span>腹痛</span>' +
                '<span>腹泻</span>' +
                '<span>腹胀</span>' +
                '<span>恶心</span>' +
                '<span>尿失禁</span>' +
                '<span>便秘</span>' +
                '<span>胸痛</span>' +
                '<span>震颤</span>' +
                '<span>肩痛</span></div></div>' +
                '<div class="cdss-assist-relative">' +
                '<p class="cdss-assist-left cdss-assist-input-left">时间：</p>' +
                '<div class="cdss-assist-left cdss-assist-input-right cdss-assist-input-clearfix"><span >0</span>' +
                '<span>1</span>' +
                '<span>2</span>' +
                '<span>3</span>' +
                '<span>4</span>' +
                '<span>5</span>' +
                '<span>6</span>' +
                '<span>7</span>' +
                '<span>8</span>' +
                '<span>9</span>' +
                '<span>小时</span>' +
                '<span>分钟</span>' +
                '<span>秒</span>' +
                '<span>早晨</span>' +
                '<span>中午</span>' +
                '<span>晚上</span>' +
                '<span>天</span>' +
                '<span>周</span>' +
                '<span>月</span>' +
                '<span>年</span></div></div>'
            $.ajax({
                    url: baseURL + '/diagnose/post/diseaseDiagnose',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(info),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == "999999") {
                            $('#cdss-filter-local-disease').show()
                            showTab()
                                //todo变量值赋值drugcode
                                // _that.drugcode=resData.drugcode
                            $(".cdss-disease-detail-wrap").hide()
                            $(".cdss-disease-case-detail-wrap").hide()
                            $(".cdss-all-search-list-wrap").hide()
                            $(".cdss-case-guide-search-list-wrap").hide()
                            $(".cdss-other-search-list-wrap").hide()
                            $(".cdss-case-guide-detail-wrap").hide()
                            $(".cdss-drug-common-list-wrap").hide()
                            $(".cdss-drug-mec-list-wrap").hide()
                            $(".cdss-select-drug-type-wrap").hide()
                            $(".cdss-select-drug-detail-wrap").hide()
                            $(".cdss-drug-detail-wrap").hide()
                            $(".cdss-askbob-search-suggest").hide()
                                // $("#cdss-drug-rec-pill").hide()
                                // $("#cdss-mini-survey-wrap").hide()
                            $(".cdss-eval-table-wrap").hide()
                            $(".cdss-test-sheet-diagnosis-wrap").hide()
                            $(".cdss-prescription-detail-wrap").hide()
                            $(".cdss-drug-conflict-commom-wrap").hide()
                            $('.cdss-drug-usage-and-dosage-wrap').hide()
                            if (resData.data.aiResponse.referral) {
                                $("#cdss-warn-tipsWrap span").text("患者可能患有危重疾病，建议您紧急处理后转诊")
                                $("#cdss-warn-tipsWrap").show()
                                setTimeout(function() { $("#cdss-warn-tipsWrap").hide() }, 10000)
                            }
                            if (resData.data && resData.data.aiResponse && resData.data.aiResponse.symptom) {
                                //主诉辅助输入列表
                                if (resData.data.aiResponse.symptom.length == 0) {
                                    $("#cdss-assist-input").empty().html(span)
                                } else {
                                    var tempspan = ''
                                    for (var i = 0; i < resData.data.aiResponse.symptom.length; i++) {
                                        tempspan += '<span>' + resData.data.aiResponse.symptom[i].description + '</span>'
                                    }
                                    $("#cdss-assist-input-right").empty().html(tempspan)
                                }
                                // 现病史辅助输入列表
                                if (resData.data && resData.data.aiResponse && resData.data.aiResponse.presentHistory) {
                                    var presentHistory = resData.data.aiResponse.presentHistory
                                    if (!(presentHistory.causes && presentHistory.causes.length) && !(presentHistory.relatedSymptom && presentHistory.relatedSymptom.length) &&
                                        !(presentHistory.treatHistory && presentHistory.treatHistory.length)) { // 三个都没有推荐数据时

                                    } else { // 有推荐数据时
                                        var hisPresentInput = ''
                                        if (presentHistory.causes && presentHistory.causes.length) { // 有发病情况
                                            hisPresentInput += '<div class="cdss-assist-relative cdss-bottom-border">' +
                                                '<p class="cdss-hisPresent-left cdss-assist-input-left">发病情况：</p>' +
                                                '<div class="cdss-hisPresent-left cdss-assist-input-right cdss-assist-input-clearfix">'
                                            for (var i = 0; i < presentHistory.causes.length; i++) {
                                                hisPresentInput += '<span >' + presentHistory.causes[i] + '</span>'
                                            }
                                            hisPresentInput += '</div></div>'
                                        }
                                        if (presentHistory.relatedSymptom && presentHistory.relatedSymptom.length) { // 有伴随/排除
                                            presentHistory.relatedSymptom.unshift({ description: '伴' }, { description: '无' })
                                            hisPresentInput += '<div class="cdss-assist-relative cdss-bottom-border">' +
                                                '<p class="cdss-hisPresent-left cdss-assist-input-left">伴随/排除：</p>' +
                                                '<div class="cdss-hisPresent-left cdss-assist-input-right cdss-assist-input-clearfix">'
                                            for (var i = 0; i < presentHistory.relatedSymptom.length; i++) {
                                                hisPresentInput += '<span >' + presentHistory.relatedSymptom[i].description + '</span>'
                                            }
                                            hisPresentInput += '</div></div>'
                                        }
                                        if (presentHistory.treatHistory && presentHistory.treatHistory.length) { // 有诊治经过
                                            hisPresentInput += '<div class="cdss-assist-relative">' +
                                                '<p class="cdss-hisPresent-left cdss-assist-input-left">诊治经过：</p>' +
                                                '<div class="cdss-hisPresent-left cdss-assist-input-right cdss-assist-input-clearfix">'
                                            for (var i = 0; i < presentHistory.treatHistory.length; i++) {
                                                hisPresentInput += '<span >' + presentHistory.treatHistory[i] + '</span>'
                                            }
                                            hisPresentInput += '</div></div>'
                                        }
                                        $("#cdss-hisPresent-input").empty().html(hisPresentInput)
                                    }
                                }
                                //诊断列表
                                if (!resData.data.aiResponse.diagnosis || resData.data.aiResponse.diagnosis.length == 0) {
                                    var emptyStr = '<div class="cdss-diagnpsis-empty">' +
                                        '无诊断结果' +
                                        '</div>'
                                    $('.cdss-diagnpsis-empty').hide()
                                    $("#cdss-diagnosis-list").empty().append(emptyStr).show()
                                } else {
                                    var diaglist = ''
                                    var localNum = resData.data.movedCount
                                    for (var j = 0; j < resData.data.aiResponse.diagnosis.length; j++) {
                                        var symptoms = resData.data.aiResponse.diagnosis[j].symptoms
                                        var labtests = resData.data.aiResponse.diagnosis[j].labtests
                                        diaglist += '<div class="cdss-dianosis-disease">'
                                        diaglist += '<div class="cdss-disease-name-wrap">' +
                                            '<img class="cdss-disease-name" src="' + webBaseURL + '/image/icon_add2.png" name="' +
                                            resData.data.aiResponse.diagnosis[j].term + '" id="' +
                                            resData.data.aiResponse.diagnosis[j].code + '">' +
                                            '<div class="cdss-disease-name-text-box">'
                                            // zt
                                        if ((symptoms && symptoms.length) || (labtests && labtests.length)) {
                                            diaglist += '<span class="cdss-disease-name-text" hasInfo="' +
                                                resData.data.aiResponse.diagnosis[j].hasInfo + '" symptoms="' + true + '" cn="' + resData.data.aiResponse.diagnosis[j].term + '">' +
                                                resData.data.aiResponse.diagnosis[j].term +
                                                '</span>'
                                        } else {
                                            diaglist += '<span class="cdss-disease-name-text" hasInfo="' +
                                                resData.data.aiResponse.diagnosis[j].hasInfo + '" symptoms="' + false + '" cn="' + resData.data.aiResponse.diagnosis[j].term + '">' +
                                                resData.data.aiResponse.diagnosis[j].term +
                                                '</span>'
                                        }
                                        diaglist += '<div class="cdss-disease-tips">' +
                                            '<div class="cdss-disease-triangle"></div>' +
                                            '<div class="cdss-disase-tips-ctn">'
                                        diaglist += resData.data.aiResponse.diagnosis[j].term
                                        diaglist += '</div>' +
                                            '</div>'
                                        diaglist += '</div>'
                                        var star_level
                                        var mo = parseFloat(resData.data.aiResponse.diagnosis[j].modelOutput)
                                        if (0 <= mo && mo < 0.35) {
                                            star_level = 3
                                        } else if (0.35 <= mo && mo < 0.7) {
                                            star_level = 2
                                        } else if (0.7 <= mo && mo < 0.8) {
                                            star_level = 1
                                        } else if (0.8 <= mo) {
                                            star_level = 0
                                        }
                                        diaglist += '<image class="cdss-disease-name-possbility" src="' + webBaseURL + '/image/star_' + star_level + '.png" />'
                                        if (j < localNum) { //本地常见病
                                            diaglist += '<label class="cdss-local-span">常</label>'
                                        }
                                        if (j > localNum) { // 罕见病 暂定
                                            // diaglist += '<img class="cdss-disease-right-hjb" src="' + webBaseURL + '/image/ic_han.png" />'
                                        }
                                        if (resData.data.aiResponse.diagnosis[j].message) {
                                            diaglist += '<span class="cdss-show-disease-detail">详情 &gt;' +
                                                // '<img src="'+webBaseURL+'/image/icon_more.png" />'+
                                                '</span>'
                                        }
                                        diaglist += '</div>'
                                            //
                                        diaglist += '<div class="cdss-diag-list-infos-wrap">'
                                        if (resData.data.aiResponse.diagnosis[j].symptoms && resData.data.aiResponse.diagnosis[j].symptoms.length > 0) {
                                            diaglist += '<div class="cdss-disease-diag-symptoms"><div class="cdss-disease-symptoms-left">表现：</div><div class="cdss-disease-symptoms-right">'
                                            for (var k = 0; k < resData.data.aiResponse.diagnosis[j].symptoms.length; k++) {
                                                diaglist += '<span>' + resData.data.aiResponse.diagnosis[j].symptoms[k] + '</span>'
                                            }
                                            diaglist += '</div></div>'
                                        }
                                        //检验检查
                                        if (resData.data.aiResponse.diagnosis[j].labtests && resData.data.aiResponse.diagnosis[j].labtests.length > 0) {
                                            var testList = [] //检验列表
                                            var inspectList = [] //检查列表
                                            for (var l = 0; l < resData.data.aiResponse.diagnosis[j].labtests.length; l++) {
                                                if (resData.data.aiResponse.diagnosis[j].labtests[l].ischeck == 0) {
                                                    testList.push(resData.data.aiResponse.diagnosis[j].labtests[l])
                                                } else if (resData.data.aiResponse.diagnosis[j].labtests[l].ischeck == 1) {
                                                    inspectList.push(resData.data.aiResponse.diagnosis[j].labtests[l])
                                                }
                                            }
                                            console.log(testList, inspectList)

                                            var list = []
                                            if (testList.length) {
                                                testList[0]['isfirst'] = true
                                            }
                                            if (inspectList.length) {
                                                inspectList[0]['isfirst'] = true
                                            }
                                            list = testList.concat(inspectList)
                                            console.log(list)
                                            diaglist += '<div class="cdss-disease-diag-test">'
                                            diaglist += '<div class="cdss-disease-test-right">'
                                            $.each(list, function(index, item) {
                                                if (index < 2) {
                                                    if (item.isfirst) {
                                                        var text = item.ischeck == 0 ? "检验" : "检查";
                                                        diaglist += '<div class="cdss-disease-test-left"> ' + text + '：</div>'
                                                    }
                                                    diaglist += '<div class="cdss-disease-test-inspect-name" testCode="' + item.testCode +
                                                        '"><span hasInfo="' + item.hasInfo + '" cn="' + item.labtest + '">' + item.labtest +
                                                        '<div class="cdss-disease-test-tips">' +
                                                        '<div class="cdss-disease-test-triangle"></div>' +
                                                        '<div class="cdss-disase-test-tips-ctn">'
                                                    diaglist += item.labtest
                                                    diaglist += '</div>' +
                                                        '</div>' +
                                                        '</span>' +
                                                        '<img class="cdss-disease-test-icon" cn="' + item.labtest + '" src="' + webBaseURL + '/image/icon_attention_b@2x.png" />'
                                                    if (index == 1 && list.length > 2) {
                                                        diaglist += '<img class="cdss-disease-test-fold-right" src="' + webBaseURL + '/image/u616.png" />'
                                                    }
                                                    diaglist += '</div>'
                                                }
                                            })
                                            if (list.length > 2) {
                                                diaglist += '<div  class="cdss-disease-test-foldwrap-right">'
                                                $.each(list, function(index, item) {
                                                    if (index >= 2) {
                                                        if (item.isfirst) {
                                                            var text = item.ischeck == 0 ? "检验" : "检查";
                                                            diaglist += '<div class="cdss-disease-test-left"> ' + text + '：</div>'
                                                        }
                                                        diaglist += '<div class="cdss-disease-test-inspect-name" testCode="' + item.testCode +
                                                            '"><span hasInfo="' + item.hasInfo + '" cn="' + item.labtest + '">' + item.labtest +
                                                            '<div class="cdss-disease-test-tips">' +
                                                            '<div class="cdss-disease-test-triangle"></div>' +
                                                            '<div class="cdss-disase-test-tips-ctn">'
                                                        diaglist += item.labtest
                                                        diaglist += '</div>' +
                                                            '</div>' +
                                                            '</span>' +
                                                            '<img class="cdss-disease-test-icon" cn="' + item.labtest + '" src="' + webBaseURL + '/image/icon_attention_b@2x.png" />'
                                                        if (index == list.length - 1) {
                                                            diaglist += '<img class="cdss-disease-test-icon-img-right"  src="' + webBaseURL + '/image/icon_fold.png" />'
                                                        }
                                                        diaglist += '</div>'
                                                    }
                                                })
                                                diaglist += '</div>'
                                            }
                                            diaglist += '</div>'
                                            diaglist += '</div>'
                                        }

                                        diaglist += '</div>'
                                        diaglist += '<div class="cdss-disease-tips">' +
                                            '<div class="cdss-disease-triangle"></div>' +
                                            '<div class="cdss-disase-tips-ctn">'
                                        diaglist += resData.data.aiResponse.diagnosis[j].term
                                        diaglist += '</div>' +
                                            '</div>'
                                        diaglist += '</div>'
                                    }



                                    $('.cdss-diagnpsis-empty').hide()
                                    $("#cdss-diagnosis-list").empty().html(diaglist).show()
                                        // $(".cdss-auxiliaryConsultation").show()

                                    //详情绑定方法
                                    // zt
                                    $(".cdss-show-disease-detail").off("click").on("click", function() {
                                        // var hasinfo = $(this).parent().children().eq(1).find('.cdss-disease-name-text').attr('hasInfo')
                                        // if (hasinfo == 'true') {
                                        //     $('.cdss-disease-detail-name-icon').show()
                                        // } else {
                                        //     $('.cdss-disease-detail-name-icon').hide()
                                        // }
                                        var diseaseName = $(this).parent().children().eq(1).find('.cdss-disease-name-text').text()
                                        var code = $(this).parent().children().eq(0).attr('id')
                                        var diseaseArr = [diseaseName]
                                        var diseaseFinalArr = [diseaseName]
                                        _that.diagnosisListToDetail(diseaseFinalArr, code, 2)
                                    })
                                    $(".cdss-diagnosis-list").on("click", '.cdss-disease-name', function() {
                                        var text = $(this).attr('name')
                                        var mddata = {
                                            event: "列表页疑似诊断回写",
                                            page: "疑似诊断列表页",
                                            pageElement: "添加诊断图标",
                                            operation1: text
                                        }
                                        _that.REC(mddata)
                                    })
                                    $(".cdss-disease-test-icon").off("click").on("click", function() {
                                            var text = $(this).attr('cn')
                                            console.log($(this).attr('cdss-type'))
                                            var mdData = {
                                                event: "列表页检验检查回写",
                                                page: "疑似诊断列表页",
                                                pageElement: "检验检查项目名称",
                                                operation1: text
                                            }
                                            _that.REC(mdData)
                                        })
                                        //疾病提示信息

                                    //展开折叠检验检查列表
                                    $('.cdss-disease-test-fold-right').off('click').on('click', function() {

                                        $(this).parent().parent().find('.cdss-disease-test-foldwrap-right').show()
                                        $(this).parent().parent().find('.cdss-disease-test-icon-img-right').show()
                                        $(this).hide()

                                    })

                                    $('.cdss-disease-test-fold-left').off('click').on('click', function() {
                                        $(this).parent().parent().find('.cdss-disease-test-foldwrap-left').show()
                                        $(this).parent().parent().find('.cdss-disease-test-icon-img-left').show()
                                        $(this).hide()
                                        $(this).parent().parent().parent().siblings().find('.cdss-disease-test-foldwrap-right').show()

                                    })


                                    $(".cdss-disease-test-icon-img-right").off('click').on('click', function() {
                                        $(this).hide()
                                        $('.cdss-disease-test-fold-right').show()
                                        $(this).parent().parent().hide()


                                    })

                                    $(".cdss-disease-test-icon-img-left").off('click').on('click', function() {
                                        $(this).hide()
                                        $(this).parent().parent().parent().children().eq(0).find('.cdss-disease-test-fold-left').show()
                                        $(this).parent().parent().hide()
                                        $(this).parent().parent().parent().parent().siblings().find('.cdss-disease-test-foldwrap-right').hide()
                                    })

                                    //检验检查icon点击查询详情
                                    $('.cdss-disease-test-inspect-name span').off('click').on('click', function() {
                                            var name = $(this).parent().find('span').attr('cn')
                                            var code = $(this).parent().attr('testcode')
                                                // zt
                                            var hasinfo = $(this).parent().find('span').attr('hasInfo')
                                            if (hasinfo == 'true') {
                                                var mdData = {
                                                    event: "列表页检验检查详情打开",
                                                    page: "疑似诊断列表页",
                                                    pageElement: "检验检查详情图标",
                                                    operation1: name
                                                }
                                                _that.REC(mdData)
                                                _that.getMedicalInfo({ keyword: name, key: code, type: 'check', source: 'diagnosis_list' })
                                            }
                                        })
                                        //表现-检验-检查前三个展开 后面折叠
                                    var listLen = $('.cdss-dianosis-disease').length
                                    for (var i = 0; i < 1; i++) {
                                        $('.cdss-dianosis-disease').eq(i).find('.cdss-diag-list-infos-wrap').show()
                                        var symptoms = $('.cdss-dianosis-disease').eq(i).find('.cdss-disease-name-wrap').find('.cdss-disease-name-text-box').find('.cdss-disease-name-text').attr('symptoms')
                                        if (symptoms == "true") {
                                            $('.cdss-dianosis-disease').eq(i).addClass('active')
                                        }
                                    }
                                    for (var j = 1; j < listLen; j++) {
                                        $('.cdss-dianosis-disease').eq(j).find('.cdss-diag-list-infos-wrap').hide()
                                    }
                                    //展开折叠 表现/检验/检查
                                    $(".cdss-disease-name-text").off('click').on('click', function() {
                                        var symptoms = $(this).attr('symptoms')
                                        if (symptoms == "true") {
                                            $(this).parent().parent().parent().toggleClass('active')
                                        }
                                        $(this).parent().parent().parent().find('.cdss-diag-list-infos-wrap').toggle()
                                    })
                                }
                            } else {
                                console.log("更新数据失败，返回值为空!")
                                $("#cdss-assist-input").empty().html(span)
                            }

                        } else {
                            $("#cdss-assist-input").empty().html(span)
                            $("#cdss-hisPresent-input").empty()
                            $(_that.hisPresentDom).hide()
                            console.log(resData.retMsg)
                        }
                    },
                    error: function(err) {
                        console.log('setRecommendInput2', err)
                        console.log(JSON.stringify(err))
                    }
                })
                //面板加载完成回调
                // _that.onRecommendLoad();
        }
        // 漏诊漏检
    _that.missCheck = function(obj) {
        // 门诊病历、入院记录、医嘱管理或检查检验申请页面触发
        // obj 来源数据 全字段都在，都接受传入，否则拿userinfo，否则空
        obj.patientInfo = obj.patientInfo ? obj.patientInfo : {}
        obj.medicalRecord = obj.medicalRecord ? obj.medicalRecord : {}
        var data = {
            // 病人基本信息
            patientInfo: {
                // 必填
                age: obj.patientInfo.age ? obj.patientInfo.age : _that.age, // 年龄
                channelId: channelId,
                institutionId: institutionId,
                department: obj.patientInfo.department ? obj.patientInfo.department : (_that.hospitalDepartment || '全科'), // 科室
                diagnosisTime: obj.patientInfo.diagnosisTime || '', // 就诊时间
                gender: obj.patientInfo.gender ? obj.patientInfo.gender : _that.gender, // 性别
                patientId: obj.patientInfo.patientId ? obj.patientInfo.patientId : _that.patientId, // 患者id
                stayHospital: obj.patientInfo.stayHospital || 0, // 就诊方式（0：门诊 1：住院
                // 非必填
                consultationId: obj.patientInfo.consultationId || '', // 就诊id
                consultationType: obj.patientInfo.consultationType || 0, // 0 初诊；1 复诊 
                height: obj.patientInfo.height ? obj.patientInfo.height : (_that.height || ''), // 身高
                weight: obj.patientInfo.weight ? obj.patientInfo.weight : (_that.weight || ''), // 体重
            },
            // 病历信息
            medicalRecord: {
                // 必填
                diagnose: obj.medicalRecord.diagnose ? obj.medicalRecord.diagnose : (_that.diagnosis ? _that.diagnosis.join(",") : ''), // 诊断结果
                // 非必填
                mainComplaint: obj.medicalRecord.mainComplaint || '', // 主诉
                examinations: obj.medicalRecord.examinations || '', // 体格检查,示例值(甲状腺左叶可触及一肿物，质地较硬，活动度可。)
                histories: obj.medicalRecord.histories ? obj.medicalRecord.histories : (_that.pastHistory || ''), // 既往史
                medicalHis: obj.medicalRecord.medicalHis || '', // 用药史
                personal: obj.medicalRecord.personal || '', // 个人史,示例值(生于原籍居于本地，否认近期旅游史，否认疫区疫水接触史，无不良嗜好，否认冶游史。)
                present: obj.medicalRecord.present ? obj.medicalRecord.present : (_that.hisPresent || ''), // 现病史
                treatmentRD: obj.medicalRecord.treatmentRD || '', // 医嘱,示例值(建议住院手术)
            },
        }
        if (obj.checkReports && obj.checkReports.length != 0) { // 检查信息
            data.checkReports = obj.checkReports
        }
        if (obj.testReports && obj.testReports.length != 0) { // 检验
            data.testReports = obj.testReports
        }
        if (obj.prescriptions && obj.prescriptions.length != 0) { // 处方
            data.prescriptions = obj.prescriptions
        }
        // console.log(data)
        $.ajax({
            url: baseURL + '/decision/post/missCheck',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(data),
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var resultList = resData.data.qualityControlReport.testLose
                    if (resultList && resultList.length != 0) {
                        $('.cdss-miss-check-wrap').show()
                        $('.cdss-tab-icon-red').show()
                        deleteBorder()
                        var str = ''
                        for (var i = 0; i < resultList.length; i++) {
                            str += '<div class="cdss-miss-check-content-line">' +
                                '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                '<span class="cdss-miss-check-content-line-txt">' +
                                resultList[i] +
                                '</span>' +
                                '</div>'
                        }
                        $('.cdss-miss-check-content').empty().html(str)
                    }
                }
            },
            error: function() {
                console.log("漏诊漏查接口调用失败")
            }
        })
    }

    // 辅助问诊
    _that.getAuxiliaryConsultation = function(info) {
            var data = {
                age: info.age,
                mainComplaint: info.mainComplaint
            }
            $.ajax({
                url: baseURL + '/diagnose/post/assistDiagnose',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(data),
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        if (resData.data.length != 0) {
                            var allInfo = resData.data[0].questionList[0].question
                                // 渲染右侧辅助问诊
                            var info = []
                            for (var i = 0; i < allInfo.length; i++) {
                                if (allInfo[i].visible) {
                                    info.push(allInfo[i])
                                }
                            }
                            renderAuxiliary(allInfo, info) // allInfo所有数据，info过滤true后的
                                // 调整样式
                            $(".cdss-diagnosis-wrap").removeClass("cdss-diagnosis-wrap-step")
                            var bigH = $(".cdss-container").height() - 151
                            $(".cdss-auxiliaryConsultation-diagnosis-box").css({ "height": bigH + 'px' })
                            $(".cdss-diagnosis-list").css({ "position": "static" })
                        } else {
                            $(".cdss-auxiliaryConsultation").hide()
                            $(".cdss-diagnosis-wrap").addClass("cdss-diagnosis-wrap-step")
                            $(".cdss-diagnosis-list").css({ "position": "absolute" })
                            $(".cdss-diagnosis-list").css({ "top": "57px" })
                        }

                    }
                },
                error: function() {
                    console.log("辅助问诊详情接口调用失败")
                }
            })
        }
        // 渲染问诊-renderAuxiliary传参前两位注意顺序
    function renderAuxiliary(allInfo, info, num, stepInfoArr) {
        // allInfo 这里传进来是为了后面stepInfoArr过滤时候用
        $(".cdss-auxiliaryConsultation").show()
        if (num) {
            if (num < info.length) {
                num = num // 有值且值不能大于最大项，info的index
            } else {
                num = 0 // 不传默认第一项
            }
        } else num = 0
        var detailObj = []
        if (stepInfoArr && stepInfoArr.length != 0) {
            detailObj = stepInfoArr // 点击类型里面具体病症时才会传参，用于渲染数据来源
        } else {
            detailObj.push(info[num]) // num是控制换一批info里面的类型
        }
        var htmlStr = ''
        for (var i = 0; i < detailObj.length; i++) {
            if (detailObj[i].type == 'SINGLE_CHOICE' || detailObj[i].type == 'MULTIPLE_CHOICE') {
                htmlStr += '<div class="cdss-auxiliary-bottom-line cdss-auxiliary-xingzhi">' +
                    '<div class="cdss-auxiliary-bottom-line-tit" name="' + detailObj[i].name + '"> ' +
                    detailObj[i].text +
                    '</div>' +
                    '<div class="cdss-auxiliary-bottom-line-content">'
                for (var j = 0; j < detailObj[i].choice.length; j++) {
                    htmlStr += '<div class="cdss-auxiliary-bottom-line-box">' +
                        '<span class="cdss-auxiliary-bottom-line-span" qenabled="' + detailObj[i].choice[j].qenabled + '" qenabledName="' + detailObj[i].choice[j].text + '">' +
                        detailObj[i].choice[j].text +
                        '</span>' +
                        '<div class="cdss-auxiliary-span-tips">' +
                        '<div class="cdss-askbob-search--triangle"></div>' +
                        '<div class="cdss-askbob-search--tips-ctn">' + detailObj[i].choice[j].text + '</div>' +
                        '</div>' +
                        '</div>'
                }
                htmlStr += '</div>' +
                    '</div>'
                $(".cdss-auxiliary-bottom").empty().html(htmlStr)

            } else if (detailObj[i].type == 'NUMERIC') {
                htmlStr += '<div class="cdss-auxiliary-bottom-line cdss-auxiliary-wendu">' +
                    '<div class="cdss-auxiliary-bottom-line-tit" name="' + detailObj[i].name + '"> ' +
                    detailObj[i].text +
                    '</div>' +
                    '<div class="cdss-auxiliary-bottom-line-content">' +
                    "<input type='text' attrUnit='" + detailObj[i].unit + "' range='" + JSON.stringify(detailObj[i].range) + "' class='cdss-auxiliary-bottom-farewendu' >" +
                    '<div class="cdss-auxiliary-wendu-txt">' +
                    detailObj[i].unit +
                    '</div>' +
                    '<img class="cdss-auxiliary-wendu-icon-add" src="' + webBaseURL + '/image/Icon_Add.png" />' +
                    '</div>' +
                    '</div>'
                $(".cdss-auxiliary-bottom").empty().html(htmlStr)
            }
        }
        // 辅助问诊span点击事件
        $(".cdss-auxiliary-bottom-line-span").on('click', function() {
                var qenabledId = $(this).attr('qenabled')
                var qenabledName = $(this).attr('qenabledName')
                qenabledId = qenabledId ? qenabledId.split(";") : []
                getRenderInfo(qenabledId, 6, qenabledName ? qenabledName : '')
                    // 埋点
                var mddata = {
                    event: "记录辅助问诊回写",
                    page: '疑似诊断列表页',
                    pageElement: '辅助问诊信息名称',
                    operation1: qenabledName
                }
                _that.REC(mddata)
            })
            // span内容过长-气泡展示
        $(".cdss-auxiliary-bottom-line-span").on('mouseenter', function() {
            var qenabledName = $(this).attr('qenabledName')
            var nameLang = qenabledName.length
            if (nameLang > 18) {
                $(this).parent().find(".cdss-auxiliary-span-tips").show()
            }
        })
        $(".cdss-auxiliary-bottom-line-span").on('mouseout', function() {
                $(this).parent().find(".cdss-auxiliary-span-tips").hide()
            })
            // 问诊输入框类型失焦 有最大值最小值范围
        $(".cdss-auxiliary-bottom-farewendu").on("blur", function() {
                var rangArr = JSON.parse($(this).attr('range')) // range
                var intValue = $(".cdss-auxiliary-bottom-farewendu").val() // input 值
                if (rangArr.length != 0) {
                    // for (var i = 0; i < rangArr.length; i++) {
                    var i = 0
                    if (rangArr[i].lbound != null && (intValue < rangArr[i].lbound || intValue == '')) { // 最大值 最小值 为空就给最小值
                        $(".cdss-auxiliary-bottom-farewendu").val(rangArr[i].lbound)
                    } else if (rangArr[i].rbound != null && (intValue > rangArr[i].rbound || intValue == '')) {
                        $(".cdss-auxiliary-bottom-farewendu").val(rangArr[i].rbound)
                    }
                    // }
                }
            })
            //  添加按钮
        $(".cdss-auxiliary-wendu-icon-add").on("click", function() {
                var rangArr = JSON.parse($(this).prev().prev().attr('range')) // range
                var unitName = $(this).prev().prev().attr('attrUnit') // input 单位
                var intValue = $(".cdss-auxiliary-bottom-farewendu").val() // input 值
                var qenabledId // 所属类型name
                if (rangArr.length != 0) {
                    var i = 0
                    qenabledId = rangArr[i].qenabled
                }
                qenabledId = qenabledId ? qenabledId.split(";") : []
                if (unitName == '天') {
                    intValue = "已经咳嗽" + intValue + "天"
                    getRenderInfo(qenabledId, 6, intValue)
                }
                if (unitName == '℃') {
                    getRenderInfo(qenabledId, 7, intValue)
                    intValue = "发热时最高体温度数" + intValue + "℃"
                    getRenderInfo(qenabledId, 6, intValue)
                }
            })
            // 换一批
        $(".cdss-line-right").off('click').on('click', function() {
                // 防止点击下一个与当前一样
                var parentName = $(this).parent().parent().find('.cdss-auxiliary-bottom-line-tit').attr('name')
                if (info[num + 1]) {
                    if (parentName == info[num + 1].name) {
                        num += 1
                    }
                }
                num += 1
                renderAuxiliary(allInfo, info, num)
            })
            // 数据源渲染,回写类型，回写值
        function getRenderInfo(idArr, writeLx, writeValue) {
            var stepInfoArr = []
            if (idArr.length != 0) { // id多个会对应多个诊断类型 其他情况都会显示一项
                for (var i = 0; i < allInfo.length; i++) {
                    for (var j = 0; j < idArr.length; j++) {
                        if (allInfo[i].name == idArr[j]) {
                            stepInfoArr.push(allInfo[i])
                        }
                    }
                }
                renderAuxiliary(allInfo, info, num, stepInfoArr)
            }
            if (writeValue) {
                var rawData = { // 6回写现病史/7体温
                    writeType: writeLx,
                    writeText: writeValue
                }
                getWriteBack(rawData)
            }
        }
    }

    // 获取检验检查 药品 疾病 手术的详情
    _that.getMedicalInfo = function(obj) {
        var data = {
            messageId: obj.messageId || 0,
            type: obj.type,
            keyword: obj.keyword,
            key: obj.key || '',
            attribute: '',
            hospitalId: _that.hospitalId, //医院号
            hospitalName: _that.hospitalName, //医院名称
            belongCity: _that.belongCity, //城市
            physicianId: _that.physicianId, //医生号
            physicianName: _that.physicianName, //医生姓名
            patientId: _that.patientId, //患者号
            name: _that.name, //患者姓名
            outerSerialNo: _that.outerSerialNo, //流水号
            age: _that.age,
            gender: _that.gender,
        }
        var text = '检验检查详情'
        var wrong_text = '检验检查详情'
        var types = obj.type + '_info'
        switch (obj.type) {
            case "check":
                text = obj.keyword;
                wrong_text = '检验检查详情';
                break; // 检验检查
            case "disease":
                text = obj.keyword;
                types = 'dis_info';
                wrong_text = '疾病详情';
                break; // 疾病
            case "operation":
                text = obj.keyword;
                wrong_text = '手术详情';
                break; // 手术
            case "drug":
                text = obj.keyword;
                wrong_text = '药品详情';
                break; // 药品
            case "drug_like":
                text = obj.keyword;
                types = 'drug_info';
                wrong_text = '药品详情';
                break; // 常用处方的药品查询
            case "symptom":
                text = obj.keyword;
                wrong_text = '症状详情';
                break; // 症状
            default:
                text = obj.keyword;;
                break;
        }
        if (obj.source == 'search') {
            obj.source = obj.type + '_' + obj.source
        }

        console.log(obj.source)
            // zt
        if (obj.type == 'drug' || obj.type == 'drug_like') {

            data.hasInfo = $('.cdss-prescriptions-drug-header-icon').attr("hasInfo")
        }
        $.ajax({
            url: baseURL + '/diagnose/post/getMedicalInfo',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
                request.setRequestHeader('source', obj.source)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var detailObj = resData.data[obj.type]
                    if (resData.data && resData.data[obj.type]) {
                        $('.cdss-disease-relevant-tabs-title span').text(text)
                        $(".cdss-disease-relevant-tabs-wrap").show()
                            // 疾病详情罕见病标签
                        if (obj.isRare && obj.isRare == 'rare_disease') {
                            $('.cdss-disease-relevant-right-hjb').show()
                        } else {
                            $('.cdss-disease-relevant-right-hjb').hide()
                        }
                        _that.getDrugHeight()
                        $(".cdss-bg").show()

                        var listStr = ''
                        var objname = 'name'
                        var reslist = resData.data[obj.type].list
                        var detailObj = resData.data[obj.type].info
                        var list = []
                        $.each(reslist, function(index, item) {
                            if (typeof item.productSpecification == 'string') {
                                list.push(item)
                            }
                        })
                        if (list && obj.type != 'symptom') { // 非症状
                            if (obj.type == 'drug' || obj.type == 'drug_like') {
                                objname = 'productSpecification'
                                for (var i = 0; i < list.length; i++) {
                                    if (i == 0) {
                                        listStr += '<li class="active" key="' + list[i].key + '" manufacturer="' + list[i].manufacturer + '" productSpecification="' + list[i].productSpecification + '"><span class="cdss-disease-relevant-tabs-li-text">' + list[i][objname] + '</span>'
                                    } else {
                                        listStr += '<li key="' + list[i].key + '" manufacturer="' + list[i].manufacturer + '" productSpecification="' + list[i].productSpecification + '"><span class="cdss-disease-relevant-tabs-li-text">' + list[i][objname] + '</span>'
                                    }
                                    if (list[i][objname].length > 8) {
                                        listStr += '<div class="cdss-disease-relevant-tabs-list-tips"><div class="cdss-disease-relevant-tabs-list-triangle"></div><div class="cdss-disease-relevant-tabs-list-ctn">' + list[i][objname] + '</div></div>'
                                    }
                                    listStr += '</li>'
                                }
                            } else {
                                for (var i = 0; i < list.length; i++) {
                                    if (i == 0) {
                                        listStr += '<li class="active" key="' + list[i].key + '"><span class="cdss-disease-relevant-tabs-li-text">' + list[i][objname] + '</span>'
                                    } else {
                                        listStr += '<li key="' + list[i].key + '"><span class="cdss-disease-relevant-tabs-li-text">' + list[i][objname] + '</span>'
                                    }
                                    if (list[i][objname].length > 8) {
                                        listStr += '<div class="cdss-disease-relevant-tabs-list-tips"><div class="cdss-disease-relevant-tabs-list-triangle"></div><div class="cdss-disease-relevant-tabs-list-ctn">' + list[i][objname] + '</div></div>'
                                    }
                                    listStr += '</li>'
                                }
                            }
                            $(".cdss-disease-relevant-tabs-list").empty().append(listStr)

                            //顶部tabs切换逻辑
                            $(".cdss-disease-relevant-tabs-list li").off("click").on("click", function() {
                                $(".cdss-disease-relevant-tabs-list li").removeClass("active")
                                $(this).addClass("active")
                                var keyword = $(this).text()
                                var manufacturer, productSpecification
                                if (obj.type == 'drug' || obj.type == 'drug_like') {
                                    keyword = obj.keyword
                                    manufacturer = $(this).attr("manufacturer")
                                    productSpecification = $(this).attr("productSpecification")
                                }
                                var key = $(this).attr("key")

                                var data = {
                                    messageId: 0,
                                    type: types,
                                    keyword: keyword,
                                    key: key,
                                    attribute: '',
                                    hospitalId: _that.hospitalId, //医院号
                                    hospitalName: _that.hospitalName, //医院名称
                                    belongCity: _that.belongCity, //城市
                                    physicianId: _that.physicianId, //医生号
                                    physicianName: _that.physicianName, //医生姓名
                                    patientId: _that.patientId, //患者号
                                    name: _that.name, //患者姓名
                                    outerSerialNo: _that.outerSerialNo, //流水号
                                    age: _that.age,
                                    gender: _that.gender,
                                }
                                if (obj.type == 'drug' || obj.type == 'drug_like') {
                                    data.manufacturer = manufacturer
                                    data.productSpecification = productSpecification
                                }
                                $.ajax({
                                    url: baseURL + '/diagnose/post/getMedicalInfo',
                                    type: 'post',
                                    data: JSON.stringify(data),
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    scriptCharset: 'utf-8',
                                    beforeSend: function(request) {
                                        request.setRequestHeader('Content-Type', 'application/json')
                                        request.setRequestHeader('channel-id', channelId)
                                        request.setRequestHeader('institution-id', institutionId)
                                        request.setRequestHeader('source', obj.source)
                                    },
                                    success: function(resData) {
                                        if (resData.retCode == '999999') {
                                            if (resData.data && resData.data[types]) {
                                                var detailObj = resData.data[types]
                                                _that.generateDiseaseDetailWrap(detailObj)
                                            } else {
                                                _that.showCdssAlert("没有查询到检查详情信息！")
                                            }

                                        } else {
                                            _that.showCdssAlert("没有查询到检查详情信息！")
                                        }
                                    },
                                    error: function() {
                                        console.log("检查详情接口调用失败")
                                    }
                                })
                            })
                        } else { // 症状
                            $(".cdss-disease-relevant-tabs-list").empty()
                            detailObj = resData.data[obj.type]
                        }
                        _that.generateDiseaseDetailWrap(detailObj)
                    } else {
                        _that.showCdssAlert('没有查询到' + wrong_text + '!')
                    }
                } else {
                    _that.showCdssAlert("没有查询到" + wrong_text + '!')
                }
            },
            error: function() {
                console.log("检查详情接口调用失败")
            }
        })
    }
    _that.getDrugHeight = function() {
            var listHeight = $('.cdss-disease-relevant-tabs-list').height()
            $('.cdss-disease-model').height(540 - 37 - listHeight)
        }
        // 中药详细信息查询
    _that.getChDrugInfo = function(obj, func) {
            var data = {
                drugID: obj.drugID,
                drugType: obj.drugType,
            }
            var text = obj.drugName
            var wrong_text = obj.drugName

            _that.ajax({
                url: '/decision/post/getChDrugInfo',
                data: data,
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        var detailObj = resData.data
                        if (detailObj) {
                            if (!obj.hide) {
                                $('.cdss-disease-relevant-tabs-title span').text(text)
                                $(".cdss-disease-relevant-tabs-wrap").show()
                                _that.getDrugHeight()
                                $(".cdss-bg").show()
                                $(".cdss-disease-relevant-tabs-list").empty()
                                _that.generateDiseaseDetailWrap(detailObj)
                            }
                            func && func(detailObj)
                        } else {
                            _that.showCdssAlert('没有查询到' + wrong_text + '!')
                        }
                    } else {
                        _that.showCdssAlert("没有查询到" + wrong_text + '!')
                    }
                },
                error: function() {
                    console.log("检查详情接口调用失败")
                }
            })
        }
        // tab的切换
    function showTab(type) {
        $('.cdss-tab-li').removeClass('active')
        if (type == 'right') {
            $('.cdss-tab-li').eq(1).addClass('active')
            $('#cdss-tab-ctn-left').hide()
            $('#cdss-tab-ctn-right').show()
            $('#cdss-tab-ctn-right').css('display', 'block')
        } else {
            $('.cdss-tab-li').eq(0).addClass('active')
            $('#cdss-tab-ctn-left').show()
            $('#cdss-tab-ctn-right').hide()
        }
    }
    // 去除首个的border-top
    function deleteBorder() {
        // 疾病详情模块
        var length = $('.cdss-disease-treat-ctn .cdss-before-border').length
        for (var i = 0; i < length; i++) {
            $('.cdss-disease-treat-ctn .cdss-before-border').eq(i).css('border-top', '1px solid #ececec')
        }
        $('.cdss-disease-treat-ctn .cdss-before-border.cdss-detail-sheet-diagnosis-wrap').css('border-top', '10px solid #F8F9FA')
        for (var i = 0; i < length; i++) {
            if ($('.cdss-disease-treat-ctn .cdss-before-border').eq(i).css('display') == 'block') {
                $('.cdss-disease-treat-ctn .cdss-before-border').eq(i).css('border-top', 'none')
                break;
            }
        }
        // 处方信息模块
        var length = $('.cdss-prescription-detail-wrap .cdss-before-border').length
        for (var i = 0; i < length; i++) {
            $('.cdss-prescription-detail-wrap .cdss-before-border').eq(i).css('border-top', '1px solid #ececec')
        }
        $('.cdss-prescription-detail-wrap .cdss-before-border.cdss-drug-usage-and-dosage-wrap').css('border-top', '10px solid #F8F9FA')
        $('.cdss-prescription-detail-wrap .cdss-before-border.cdss-instruction-commom-wrap').css('border-top', '10px solid #F8F9FA')
        for (var i = 0; i < length; i++) {
            if ($('.cdss-prescription-detail-wrap .cdss-before-border').eq(i).css('display') == 'block') {
                $('.cdss-prescription-detail-wrap .cdss-before-border').eq(i).css('border-top', 'none')
                break;
            }
        }
        // 预警提示模块
        var length = $('.cdss-tab-ctn-right .cdss-before-border').length
        for (var i = 0; i < length; i++) {
            $('.cdss-tab-ctn-right .cdss-before-border').eq(i).css('border-top', '10px solid #F8F9FA')
        }
        for (var i = 0; i < length; i++) {
            if ($('.cdss-tab-ctn-right .cdss-before-border').eq(i).css('display') == 'block') {
                $('.cdss-tab-ctn-right .cdss-before-border').eq(i).css('border-top', 'none')
                break;
            }
        }
    }
    var awaitToDetailTimer = null
    _that.awaitToDetail = function(diseaseFinalArr, code, notFinal, Index) {
            if (awaitToDetailTimer) {
                clearInterval(awaitToDetailTimer)
            }
            awaitToDetailTimer = setInterval(function() {
                if (_that.pendingAuth && ($(".cdss-container").css("background-color") == "rgb(255, 255, 255)" || $(".cdss-container").css("background-color") == "#ffffff")) {
                    _that.diagnosisListToDetail(diseaseFinalArr, code, notFinal, Index)
                    clearInterval(awaitToDetailTimer)
                }
            }, 200)
        }
        //诊断结果列表详情封装方法 notFinal: 0 - 最终诊断  1- 采用诊断 2-仅仅查看详情
    _that.diagnosisListToDetail = function(diseaseFinalArr, code, notFinal, Index) {
            if (!Index) {
                Index = 0
            }
            if (!notFinal) {
                notFinal = 0
            }
            if (!_that.hasPower || _that.tabShow == 2) { return }
            _that.diagnosis = diseaseFinalArr || null
            if (!diseaseFinalArr || !diseaseFinalArr.length) {
                $(".cdss-disease-detail-wrap").hide()
                $(".cdss-disease-case-detail-wrap").hide()
                $(".cdss-all-search-list-wrap").hide()
                $(".cdss-case-guide-search-list-wrap").hide()
                $(".cdss-other-search-list-wrap").hide()
                $(".cdss-case-guide-detail-wrap").hide()
                $(".cdss-drug-common-list-wrap").hide()
                $(".cdss-drug-mec-list-wrap").hide()
                $(".cdss-select-drug-type-wrap").hide()
                $(".cdss-select-drug-detail-wrap").hide()
                $(".cdss-drug-detail-wrap").hide()
                $("#cdss-infection-pill").hide()
                $(".activeColor").removeClass('defSave').addClass('saveall')
                return
            }
            console.log('diseaseFinalArr', diseaseFinalArr)
            _that.infection && _that.checkInfectionSupport(diseaseFinalArr)
            var diseaseName = diseaseFinalArr[Index]
            $(".cdss-askbob-search-suggest").hide()
            $(".cdss-eval-table-wrap").hide()
            if (diseaseFinalArr.length == 1) { // 罕见病 暂定
                $('.cdss-disease-detail-active .cdss-disease-detail-right-hjb').hide()
            } else {
                $('.cdss-disease-detail-active .cdss-disease-detail-right-hjb').hide()
            }
            if (diseaseFinalArr.length > 1) {
                $('.cdss-disease-detail-active .cdss_disease_icon_more').show()
                var html = ''
                for (var i = 0; i < diseaseFinalArr.length; i++) {
                    if (i == Index) {
                        html += '<li class="active" Index=' + i + '>' + diseaseFinalArr[i] + '</li>'
                    } else {
                        html += '<li Index=' + i + '>' + diseaseFinalArr[i] + '</li>'
                    }
                }
                $('.cdss-disease-detail-list').empty().html(html)
                $('.cdss-disease-detail-list li').off('click').on('click', function() {
                    if ($(this).hasClass('active')) {
                        return
                    }
                    var text = $(this).text()
                    var Indexs = $(this).attr('Index')
                    $('.cdss-disease-detail-list li').removeClass('active')
                    $(this).addClass('active')
                    $('.cdss-disease-detail-name').empty().html(text)
                    $('.cdss-disease-header-tab').hide()
                    _that.diagnosisListToDetail(diseaseFinalArr, code, 2, Indexs)
                })
                $('.cdss-disease-detail-active .cdss-disease-detail-name,.cdss-disease-detail-active .cdss_disease_icon_more').on('mouseover', function() {
                    $('.cdss-disease-header-tab').show()
                })
                $('.cdss-disease-detail-active').on('mouseleave', function() {
                    $('.cdss-disease-header-tab').hide()
                })
            } else {
                $('.cdss-disease-detail-active .cdss_disease_icon_more').hide()
                $('.cdss-disease-detail-list').empty()
                $('.cdss-disease-detail-active').unbind()
            }
            var info = {
                diseaseName: diseaseName,
                diseaseNames: [diseaseName],
                offset: 0,
                pageSize: 50,
                hospitalId: _that.hospitalId, //医院号
                hospitalName: _that.hospitalName, //医院名称
                belongCity: _that.belongCity, //城市
                physicianId: _that.physicianId, //医生号
                physicianName: _that.physicianName, //医生姓名
                patientId: _that.patientId, //患者号
                name: _that.name, //患者姓名
                outerSerialNo: _that.outerSerialNo, //流水号
                age: _that.age || 40,
                gender: _that.gender,
                diseaseTypes: ['E11.9_DM2']
            }
            var diseaseArr = []
            diseaseArr.push(diseaseName)
            var info1 = {
                    diseaseNames: diseaseArr,
                    hospitalId: _that.hospitalId, //医院号
                    hospitalName: _that.hospitalName, //医院名称
                    belongCity: _that.belongCity, //城市
                    physicianId: _that.physicianId, //医生号
                    physicianName: _that.physicianName, //医生姓名
                    patientId: _that.patientId, //患者号
                    name: _that.name, //患者姓名
                    outerSerialNo: _that.outerSerialNo, //流水号
                    age: _that.age || 40,
                    gender: _that.gender
                }
                // 埋点用的疾病名
            _that.diseaseName = info1.diseaseNames[Index]
            _that.shouldShowWrap = false
            if (notFinal == 1) {
                //采用诊断埋点
                var acceptData = {
                    acceptedDiseaseTerm: diseaseName,
                    acceptedDiseaseCode: code,
                    outerSerialNo: _that.outerSerialNo
                }
                $.ajax({
                    url: baseURL + '/diagnose/post/saveAcceptedDiagnose',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(acceptData),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {} else {

                        }
                    },
                    error: function(err) {}
                })
            } else if (notFinal == 0) {
                //医生最终诊断埋点
                var doctorDiagData = {
                    outerSerialNo: _that.outerSerialNo,
                    doctorFinalDiagnose: diseaseName
                }
                $.ajax({
                    url: baseURL + '/diagnose/post/saveDoctorFinalDiagnose',
                    type: 'post',
                    data: JSON.stringify(doctorDiagData),
                    contentType: 'application/json',
                    dataType: 'json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {

                        } else {}
                    },
                    error: function() {}
                })
            }
            //鉴别诊断&治疗方案
            _that.treatNum = 0
            $(".cdss-disease-inspect-diagmsg").removeClass('text-center')
            $(".cdss-disease-treat-list-content").removeClass('text-center')
            info.hospitalDepartment = _that.hospitalDepartment
            info.hospitalDepartmentId = _that.hospitalDepartmentId
            $.ajax({
                url: baseURL + '/diagnose/post/getDiagAndTreat',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(info),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        $('.cdss-disease-module-inspect').show()
                        $('.cdss-disease-module-treatmethod').show()
                        $(".cdss-disease-evid-label").removeClass('active')
                        $(".cdss-disease-treat-label").addClass('active')
                        $(".cdss-disease-evid-ctn").hide()
                        $(".cdss-disease-detail-wrap").scrollTop(0)
                            //鉴别诊断
                        if (resData.data && resData.data.diags && resData.data.diags.length > 0) {
                            var diags = resData.data.diags[0]
                            var diagMsgStr = ''
                            var len = diags.info.length
                            var totalStr = ''
                            for (var i = 0; i < diags.info.length; i++) {
                                // totalStr+=diags.info[i]
                                totalStr += '<p>' + diags.info[i] + '</p>'
                            }

                            // if(totalStr.length<60){
                            //     diagMsgStr+='<div class="cdss-disease-inspect-diagmsg-brefmsg">'+
                            //                     totalStr+
                            //                 '</div>'
                            // }else{
                            // var brefStr=totalStr.slice(0,60)
                            // var brefStr=diags.info[0]
                            // diagMsgStr+='<div class="cdss-disease-inspect-diagmsg-brefmsg">'+
                            //                 brefStr+'...'+
                            //             '</div>'+
                            //             '<div class="cdss-disease-inspect-diagmsg-moremsg">'
                            // for(var j=0;j<diags.info.length;j++){
                            //     diagMsgStr+='<p>'+ diags.info[j] +'</p>'
                            // }
                            // diagMsgStr+='</div>'+
                            diagMsgStr += '<div class="cdss-disease-inspect-diagmsg-brefmsg">' +
                                totalStr +
                                '</div>' +
                                '<div class="cdss-disease-inspect-diagmsg-showmore">更多' +
                                '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                '</div>' +
                                '<div class="cdss-disease-inspect-diagmsg-hidemore">隐藏' +
                                '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                '</div>'
                                // }
                            $(".cdss-disease-inspect-diagmsg").empty().append(diagMsgStr)
                            setTimeout(function() {
                                var height = $('.cdss-disease-inspect-diagmsg-brefmsg').height()
                                console.log('height', height)
                                if (height == 108) {
                                    $(".cdss-disease-inspect-diagmsg-showmore").show()
                                } else {
                                    $(".cdss-disease-inspect-diagmsg-showmore").hide()
                                }
                            }, 100)
                            $(".cdss-disease-inspect-diagmsg-showmore").off("click").on("click", function() {
                                // $(".cdss-disease-inspect-diagmsg-brefmsg").hide()
                                // $(".cdss-disease-inspect-diagmsg-moremsg").show()
                                $(".cdss-disease-inspect-diagmsg-hidemore").show()
                                $(".cdss-disease-inspect-diagmsg-showmore").hide()
                                $('.cdss-disease-inspect-diagmsg-brefmsg').css('max-height', '100%')
                            })
                            $(".cdss-disease-inspect-diagmsg-hidemore").off("click").on("click", function() {
                                // $(".cdss-disease-inspect-diagmsg-brefmsg").show()
                                // $(".cdss-disease-inspect-diagmsg-moremsg").hide()
                                $(".cdss-disease-inspect-diagmsg-showmore").show()
                                $(".cdss-disease-inspect-diagmsg-hidemore").hide()
                                $('.cdss-disease-inspect-diagmsg-brefmsg').css('max-height', '108px')

                            })
                        } else {
                            $(".cdss-disease-inspect-diagmsg").empty().append('暂无鉴别诊断').addClass('text-center')
                        }
                        //治疗方案
                        if (resData.data && resData.data.decisions && resData.data.decisions.length > 0) {
                            var decisions = resData.data.decisions
                            for (var i = 0; i < decisions.length; i++) {
                                if (!decisions[i].title) {
                                    decisions.splice(i, 1)
                                }
                            }
                            var decStr = ''
                            for (var j = 0; j < decisions.length; j++) {
                                if (j == 0) {
                                    decStr += '<div class="cdss-disease-treat-title-sub active">'
                                } else {
                                    decStr += '<div class="cdss-disease-treat-title-sub">'
                                }
                                decStr += '<span>' + decisions[j].title + '</span>' +
                                    '<span class="cdss-disease-treatmethod-fold">' +
                                    '<img src="' + webBaseURL + '/image/icon_unfold.png" alt="" class="cdss-disease-img-icon-fold cdss-unfold-img" />' +
                                    '<img src="' + webBaseURL + '/image/icon_unfold-rotate.png" class="cdss-rotate-img"/>' +
                                    '</span>' +
                                    '</div>'
                                if (j == 0) {
                                    decStr += '<div class="cdss-disease-treatmethod-words">'
                                } else {
                                    decStr += '<div class="cdss-disease-treatmethod-words hide">'
                                }
                                for (var k = 0; k < decisions[j].info.length; k++) {
                                    if (typeof decisions[j].info[k] == 'string') {
                                        decStr += '<p>' + decisions[j].info[k] + '</p>'
                                    } else if (Object.prototype.toString.call(decisions[j].info[k]) == '[object Object]') {
                                        for (var key in decisions[j].info[k]) {
                                            decStr += '<p>' + key + '：</p>'
                                            $.each(decisions[j].info[k][key], function(index, item) {
                                                decStr += '<p>' + item + '</p>'
                                            })
                                        }
                                    }
                                }
                                decStr += '</div>'
                                $(".cdss-disease-treat-list-content").empty().append(decStr)
                            }
                        } else {
                            $(".cdss-disease-treat-list-content").empty().append('暂无治疗方案').addClass('text-center')
                        }
                        if (resData.data && resData.data.diags || resData.data && resData.data.decisions) {
                            _that.shouldShowWrap = true
                        } else {
                            // shouldShowWrap=false
                        }
                    } else {
                        $('.cdss-disease-module-inspect').hide()
                        $('.cdss-disease-module-treatmethod').hide()
                        _that.treatNum++

                    }
                },
                error: function(err) {}
            }).then(function() {
                $('.cdss-disease-module-commondrugs').hide()
                $('.cdss-disease-module-prescription').hide()
                    // 常用处方
                _that.getCommonPrescription(info, false)
            }).then(function() {
                // 常用中草药方推荐
                _that.getChDrugRecommend(info, false)
                    // 常用中成药推荐
                _that.getChPatentDrugRecommend(info, false)
            }).then(function() {
                _that.evidNum = 0
                $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list").removeClass('text-center')
                    //相似病例
                info.hospitalDepartment = _that.hospitalDepartment
                info.hospitalDepartmentId = _that.hospitalDepartmentId
                $.ajax({
                    url: baseURL + '/diagnose/post/similarCase',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(info),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {
                            $('.cdss-disease-evid-module-similar').show()
                            var similarData = resData.data ? resData.data : []
                            var simStr = ''
                            if (similarData.length > 0) {
                                _that.shouldShowWrap = true
                                var len = similarData.length
                                if (len <= 3) {
                                    for (var i = 0; i < similarData.length; i++) {
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" title="' + similarData[i].title + '" diseaseName="' + info.diseaseName + '" id="' + similarData[i].id + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].title +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                } else {
                                    for (var i = 0; i < 3; i++) {
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" title="' + similarData[i].title + '" diseaseName="' + info.diseaseName + '" id="' + similarData[i].id + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].title +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                    simStr += '<div class="cdss-disease-evid-sim-pdf-item-moremsg">'
                                    for (var i = 3; i < similarData.length; i++) {
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" title="' + similarData[i].title + '" diseaseName="' + info.diseaseName + '" id="' + similarData[i].id + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].title +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                    simStr += '</div>' +
                                        '<div class="cdss-disease-evid-sim-pdf-item-showmore">更多' +
                                        '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                        '</div>' +
                                        '<div class="cdss-disease-evid-sim-pdf-item-hidemore">隐藏' +
                                        '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                        '</div>'
                                }

                            } else {
                                simStr = '暂无相似病例'
                                $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list").addClass('text-center')
                            }
                            $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list").empty().append(simStr)
                            $(".cdss-disease-evid-sim-pdf-item-showmore").off("click").on("click", function() {
                                $(".cdss-disease-evid-sim-pdf-item-moremsg").show()
                                $(".cdss-disease-evid-sim-pdf-item-hidemore").show()
                                $(".cdss-disease-evid-sim-pdf-item-showmore").hide()
                                $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list .cdss-disease-evid-sim-pdf-item").eq(2).css('border-bottom', '1px solid #e7e9ed');
                            })
                            $(".cdss-disease-evid-sim-pdf-item-hidemore").off("click").on("click", function() {
                                $(".cdss-disease-evid-sim-pdf-item-moremsg").hide()
                                $(".cdss-disease-evid-sim-pdf-item-showmore").show()
                                $(".cdss-disease-evid-sim-pdf-item-hidemore").hide()
                                $(".cdss-disease-evid-module-similar .cdss-disease-evid-module-list .cdss-disease-evid-sim-pdf-item").eq(2).css('border-bottom', 'none');
                            })

                        } else {
                            $('.cdss-disease-evid-module-similar').hide()
                            _that.evidNum++

                        }
                    },
                    error: function(err) {

                    }
                })
            }).then(function() {
                //疾病指南
                $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list").removeClass('text-center')
                $.ajax({
                    url: baseURL + '/diagnose/post/diseaseGuidance',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(info),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {
                            $('.cdss-disease-evid-module-instru').show()
                            var similarData = resData.data ? resData.data : []
                            var simStr = ''
                            if (similarData.length > 0) {
                                _that.shouldShowWrap = true
                                var len = similarData.length
                                if (len <= 3) {
                                    for (var i = 0; i < similarData.length; i++) {
                                        var dataStr = ''
                                        if (similarData[i].date) {
                                            dataStr = '(' + similarData[i].date.split('-')[0] + '年)'
                                        }
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" diseaseName="' + info.diseaseName + '" title="' + similarData[i].name + dataStr + '" key="' + similarData[i].key + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].name + dataStr +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                } else {
                                    for (var i = 0; i < 3; i++) {
                                        var dataStr = ''
                                        if (similarData[i].date) {
                                            dataStr = '(' + similarData[i].date.split('-')[0] + '年)'
                                        }
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" diseaseName="' + info.diseaseName + '" title="' + similarData[i].name + dataStr + '" key="' + similarData[i].key + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].name + dataStr +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                    simStr += '<div class="cdss-disease-evid-module-list-moremsg">'
                                    for (var i = 3; i < similarData.length; i++) {
                                        var dataStr = ''
                                        if (similarData[i].date) {
                                            dataStr = '(' + similarData[i].date.split('-')[0] + '年)'
                                        }
                                        simStr += '<div class="cdss-disease-evid-sim-pdf-item" diseaseName="' + info.diseaseName + '" title="' + similarData[i].name + dataStr + '" key="' + similarData[i].key + '">' +
                                            '<div class="cdss-disease-evid-pdf-name">' +
                                            similarData[i].name + dataStr +
                                            '</div>' +
                                            '<div class="cdss-disease-evid-pdf-ins">' +
                                            similarData[i].source +
                                            '</div>' +
                                            '</div>'
                                    }
                                    simStr += '</div>' +
                                        '<div class="cdss-disease-evid-module-list-showmore">更多' +
                                        '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                        '</div>' +
                                        '<div class="cdss-disease-evid-module-list-hidemore">隐藏' +
                                        '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                        '</div>'
                                }

                            } else {
                                simStr = '暂无疾病指南'
                                $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list").addClass('text-center')
                            }

                            $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list").empty().append(simStr)
                            $(".cdss-disease-evid-module-list-showmore").off("click").on("click", function() {
                                $(".cdss-disease-evid-module-list-moremsg").show()
                                $(".cdss-disease-evid-module-list-hidemore").show()
                                $(".cdss-disease-evid-module-list-showmore").hide()
                                $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list .cdss-disease-evid-sim-pdf-item").eq(2).css('border-bottom', '1px solid #e7e9ed');

                            })
                            $(".cdss-disease-evid-module-list-hidemore").off("click").on("click", function() {
                                $(".cdss-disease-evid-module-list-moremsg").hide()
                                $(".cdss-disease-evid-module-list-showmore").show()
                                $(".cdss-disease-evid-module-list-hidemore").hide()
                                $(".cdss-disease-evid-module-instru .cdss-disease-evid-module-list .cdss-disease-evid-sim-pdf-item").eq(2).css('border-bottom', 'none');
                            })
                        } else {
                            $('.cdss-disease-evid-module-instru').hide()
                            _that.evidNum++

                        }
                    },
                    error: function(err) {

                    }
                })
            }).then(function() {
                //评估量表
                var obj = {
                    diseaseName: diseaseName,
                    hospitalId: _that.hospitalId, //医院号
                    hospitalName: _that.hospitalName, //医院名称
                    belongCity: _that.belongCity, //城市
                    physicianId: _that.physicianId, //医生号
                    physicianName: _that.physicianName, //医生姓名
                    patientId: _that.patientId, //患者号
                    name: _that.name, //患者姓名
                    outerSerialNo: _that.outerSerialNo, //流水号
                    age: _that.age || 40,
                    gender: _that.gender
                }
                obj.hospitalDepartment = _that.hospitalDepartment
                obj.hospitalDepartmentId = _that.hospitalDepartmentId
                $.ajax({
                    url: baseURL + '/diagnose/post/getScale',
                    type: 'post',
                    datatype: 'json',
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode == '999999') {
                            if (resData.data) {
                                _that.shouldShowWrap = true
                                var evalStr = ''
                                resData.data.scales = resData.data.scales
                                var scaleslength = resData.data.scales.length
                                for (var i = 0; i < resData.data.scales.length; i++) {
                                    if (i < 3) {
                                        evalStr += '<div class="cdss-disease-ascvd-eval"><label class="cdss-disease-ascvd-eval-btn" surveyName="' +
                                            resData.data.scales[i].surveyName + '">' +
                                            resData.data.scales[i].name +
                                            '</label>' +
                                            '<div class="cdss-disease-ascvd-eval-tips"><div class="cdss-disease-ascvd-eval--triangle"></div><div class="cdss-disease-ascvd-eval--tips-ctn">' + resData.data.scales[i].name + '</div></div>' +
                                            '</div>'
                                    }
                                }
                                if (scaleslength > 3) {
                                    evalStr += '<div class="cdss-disease-ascvd-eval-more">'
                                    for (var i = 0; i < resData.data.scales.length; i++) {
                                        if (i >= 3) {
                                            evalStr += '<div class="cdss-disease-ascvd-eval"><label class="cdss-disease-ascvd-eval-btn" surveyName="' +
                                                resData.data.scales[i].surveyName + '">' +
                                                resData.data.scales[i].name +
                                                '</label></div>'
                                        }
                                    }
                                    evalStr += '</div>'
                                    evalStr += '<div class="cdss-disease-ascvd-eval-showmore">更多' +
                                        '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                        '</div>' +
                                        '<div class="cdss-disease-ascvd-eval-hidemore">隐藏' +
                                        '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                        '</div>'
                                }
                                $(".cdss-disease-eval-list").empty().append(evalStr)
                                $(".cdss-disease-ascvd-eval-showmore").off("click").on("click", function() {
                                    $(".cdss-disease-ascvd-eval-more").show()
                                    $(".cdss-disease-ascvd-eval-hidemore").show()
                                    $(".cdss-disease-ascvd-eval-showmore").hide()
                                })
                                $(".cdss-disease-ascvd-eval-hidemore").off("click").on("click", function() {
                                    $(".cdss-disease-ascvd-eval-more").hide()
                                    $(".cdss-disease-ascvd-eval-showmore").show()
                                    $(".cdss-disease-ascvd-eval-hidemore").hide()
                                })
                                $(".cdss-disease-ascvd-eval-wrap").show()
                                $(".cdss-eval-result-wrap").hide()

                                $(".cdss-disease-ascvd-eval-btn").off("click").on("click", function() {
                                        var surveyName = $(this).attr('surveyName')
                                        var text = $(this).text()
                                        var mdData = {
                                            event: "详情页评估量表打开",
                                            page: "疾病诊疗详情页",
                                            pageElement: "评估量表名称",
                                            operation1: text
                                        }
                                        _that.REC(mdData)
                                        var surobj = {
                                            diseaseTypes: [surveyName]
                                        }
                                        $.ajax({
                                            url: baseURL + '/common/post/getSurvey',
                                            type: 'post',
                                            data: JSON.stringify(surobj),
                                            contentType: 'application/json',
                                            dataType: 'json',
                                            scriptCharset: 'utf-8',
                                            beforeSend: function(request) {
                                                request.setRequestHeader('Content-Type', 'application/json')
                                                request.setRequestHeader('channel-id', channelId)
                                                request.setRequestHeader('institution-id', institutionId)
                                            },
                                            success: function(resData) {
                                                $(".cdss-eval-table-wrap").show()
                                                $(".cdss-eval-result-wrap").hide()
                                                var questions = resData.data.questions
                                                var domStr = ""
                                                for (var i = 0; i < questions.length; i++) {
                                                    domStr += '<div class="cdss-eval-quest-content">'
                                                    if (questions[i].notes) {
                                                        domStr += '<div class="cdss-quest-ctn-tip">' +
                                                            '<img src="' + webBaseURL + '/image/warn.png" alt="">' +
                                                            questions[i].notes +
                                                            '</div>'
                                                    }
                                                    for (var j = 0; j < questions[i].question.length; j++) {
                                                        domStr += '<div class="cdss-eval-quest-item">' +
                                                            '<div class="cdss-eval-item-title">' +
                                                            questions[i].question[j].name +
                                                            '</div>' +
                                                            '<div class="cdss-eval-item-content">'

                                                        for (var k = 0; k < questions[i].question[j].question.length; k++) {
                                                            //单选radio问题
                                                            if (questions[i].question[j].question[k].type == "SINGLE_CHOICE") {
                                                                domStr += '<div class="cdss-eval-input-item-radio-grid" id="' +
                                                                    questions[i].question[j].question[k].name + '">'
                                                                if (questions[i].question[j].question[k].text) {

                                                                    // if(questions[i].question[j].question[k].required){
                                                                    //     domStr+='<span class="cdss-input-item-requied">*'+ questions[i].question[j].question[k].text +'：</span>'
                                                                    // }else{
                                                                    domStr += '<span class="cdss-input-item-requied">*</span><span>' + questions[i].question[j].question[k].text + '：</span>'
                                                                        // }
                                                                    if (questions[i].question[j].question[k].hint) {
                                                                        domStr += '<div style="display:inline-block;position: relative;"><img class="cdss-radio-tips-img" src="' + webBaseURL + '/image/icon_i.png' +
                                                                            '" /><div class="cdss-eval-input-item-radio-tips">' +
                                                                            questions[i].question[j].question[k].hint + '</div></div>'
                                                                    }
                                                                }
                                                                domStr += '<div class="cdss-eval-quest-item-radio-inputwrap">'
                                                                for (var m = 0; m < questions[i].question[j].question[k].choice.length; m++) {
                                                                    domStr += '<span class="cdss-eval-quest-item-radio" value="' +
                                                                        questions[i].question[j].question[k].choice[m].value + '" qenabled="' +
                                                                        questions[i].question[j].question[k].choice[m].qenabled + '">' +
                                                                        '<img class="cdss-eval-quest-item-radio-false" src="' + webBaseURL + '/image/radio1.png">' +
                                                                        '<img class="cdss-eval-quest-item-radio-true" src="' + webBaseURL + '/image/radio.png">' +
                                                                        questions[i].question[j].question[k].choice[m].text +
                                                                        '</span>'
                                                                }
                                                                domStr += '</div></div>'
                                                                    //输入值问题input
                                                            } else if (questions[i].question[j].question[k].type == "NUMERIC" || questions[i].question[j].question[k].type == "TEXT") {
                                                                domStr += '<div class="cdss-eval-input-item-grid" id="' +
                                                                    questions[i].question[j].question[k].name + '">'
                                                                if (questions[i].question[j].question[k].required) {
                                                                    domStr += '<span class="cdss-input-item-requied">*</span><span>' + questions[i].question[j].question[k].text + '：</span>'
                                                                    domStr += '<div class="cdss-eval-quest-item-inputwrap">'
                                                                    domStr += '<input type="text" maxlength="10" rangeleft="' + questions[i].question[j].question[k].range[0].lbound +
                                                                        '" rangeright="' + questions[i].question[j].question[k].range[0].rbound + '" requiredq=true>' +
                                                                        '<span class="cdss-eval-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                                                                    domStr += '</div></div>'
                                                                } else {
                                                                    domStr += '<span class="cdss-input-item-requied">*</span><span>' + questions[i].question[j].question[k].text + '：</span>'
                                                                    if (questions[i].question[j].question[k].hint) {
                                                                        domStr += '<div style="display:inline-block;position: relative;"><img class="cdss-radio-tips-img" src="' + webBaseURL + '/image/icon_i.png' +
                                                                            '" /><div class="cdss-eval-input-item-radio-tips">' +
                                                                            questions[i].question[j].question[k].hint + '</div></div>'
                                                                    }

                                                                    domStr += '<div class="cdss-eval-quest-item-inputwrap">'
                                                                    if (questions[i].question[j].question[k].range && questions[i].question[j].question[k].range[0]) {
                                                                        domStr += '<input type="text" maxlength="10" rangeleft="' + questions[i].question[j].question[k].range[0].lbound
                                                                    } else {
                                                                        domStr += '<input type="text" maxlength="10" rangeleft="'
                                                                    }
                                                                    if (questions[i].question[j].question[k].range && questions[i].question[j].question[k].range[0]) {
                                                                        domStr += '" rangeright="' + questions[i].question[j].question[k].range[0].rbound + '">'
                                                                    } else {
                                                                        domStr += '" rangeright="">'
                                                                    }
                                                                    domStr += '<span class="cdss-eval-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                                                                    domStr += '</div></div>'
                                                                }
                                                                // 多选checkbox问题
                                                            } else if (questions[i].question[j].question[k].type == "MULTIPLE_CHOICE") {
                                                                domStr += '<div class="cdss-quest-drug-history-wrap">'
                                                                if (questions[i].question[j].question[k].required) {
                                                                    // domStr+='<div class="cdss-quest-drug-history-title cdss-input-title-required">*'
                                                                    domStr += '<div class="cdss-quest-drug-history-title"><span>*</span>'
                                                                } else {
                                                                    domStr += '<div class="cdss-quest-drug-history-title">'
                                                                }

                                                                domStr += questions[i].question[j].question[k].text +
                                                                    '</div>' +
                                                                    '<div class="cdss-quest-drug-history-ctn">'
                                                                for (var n = 0; n < questions[i].question[j].question[k].choice.length; n++) {
                                                                    domStr += '<div class="cdss-input-item-check-grid" id="' +
                                                                        questions[i].question[j].question[k].name + '">' +
                                                                        '<span class="cdss-quest-checkbox" value="' +
                                                                        questions[i].question[j].question[k].choice[n].value + '" qenabled="' +
                                                                        questions[i].question[j].question[k].choice[n].qenabled + '" renabled="' +
                                                                        questions[i].question[j].question[k].choice[n].renabled + '">' +
                                                                        '<img class="cdss-checkbox-img-dact" src="' + webBaseURL + '/image/checkbox1.png" />' +
                                                                        '<img class="cdss-checkbox-img-act" src="' + webBaseURL + '/image/checkbox.png" />' +
                                                                        questions[i].question[j].question[k].choice[n].text +
                                                                        '</span>' +
                                                                        '</div>'
                                                                }
                                                                domStr += '</div></div>'
                                                            }
                                                        }
                                                        domStr += '</div></div>'
                                                    }
                                                    domStr += '</div>'
                                                }
                                                $(".cdss-eval-table-wrap-ctn").empty().append(domStr)

                                                //评估信息自动填入
                                                var radioWrapArr = $(".cdss-eval-input-item-radio-grid")
                                                for (var i = 0; i < radioWrapArr.length; i++) {
                                                    var itemlabel = radioWrapArr.eq(i).find('span').eq(1).text()
                                                    if (itemlabel.indexOf('性别') >= 0) {
                                                        radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').removeClass('active')
                                                        if (_that.gender == "1" || _that.gender == "男") {
                                                            radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(0).addClass('active')
                                                                //设置默认联动==性别
                                                            var id = radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(0).attr("qenabled").split(";")
                                                            for (var p = 0; p < id.length; p++) {
                                                                if ((id[p] != "null") && id[p]) {
                                                                    $("[id$='" + id[p] + "']").show()
                                                                }
                                                            }
                                                        } else {
                                                            radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(1).addClass('active')
                                                                //设置默认联动==性别
                                                            var id = radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(1).attr("qenabled").split(";")
                                                            for (var p = 0; p < id.length; p++) {
                                                                if ((id[p] != "null") && id[p]) {
                                                                    $("[id$='" + id[p] + "']").show()
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (itemlabel.indexOf('吸烟') >= 0) {
                                                        radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').removeClass('active')
                                                        if (_that.smoker == "1") {
                                                            radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(0).addClass('active')
                                                                //设置默认联动==吸烟
                                                            var id = radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(0).attr("qenabled").split(";")
                                                            for (var p = 0; p < id.length; p++) {
                                                                if ((id[p] != "null") && id[p]) {
                                                                    $("[id$='" + id[p] + "']").show()
                                                                }
                                                            }
                                                        } else {
                                                            radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(1).addClass('active')
                                                                //设置默认联动==吸烟
                                                            var id = radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').eq(0).find('span').eq(1).attr("qenabled").split(";")
                                                            for (var p = 0; p < id.length; p++) {
                                                                if ((id[p] != "null") && id[p]) {
                                                                    $("[id$='" + id[p] + "']").show()
                                                                }
                                                            }
                                                        }
                                                    }

                                                }
                                                var inputGridArr = $(".cdss-eval-input-item-grid")
                                                for (var i = 0; i < inputGridArr.length; i++) {
                                                    //由于AI返回的字段没有约定id的name，所以这里只能用汉字indexof处理
                                                    var inputlabel = inputGridArr.eq(i).find('span').eq(1).text()
                                                    if (inputlabel.indexOf("姓名") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.name)
                                                    }
                                                    if (inputlabel.indexOf("年龄") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.age)
                                                    }
                                                    if (inputlabel.indexOf("身高") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.height)
                                                    }
                                                    if (inputlabel.indexOf("体重") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.weight)
                                                    }
                                                    if (inputlabel.indexOf("收缩压") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.sbp)
                                                    }
                                                    if (inputlabel.indexOf("舒张压") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.dbp)
                                                    }
                                                    if (inputlabel.indexOf("糖化血红蛋白") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.hbA1c)
                                                    }
                                                    if (inputlabel.indexOf("空腹血糖") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.fpg)
                                                    }
                                                    if (inputlabel.indexOf("随机血糖") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.glu)
                                                    }
                                                    if (inputlabel.indexOf("血钾") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.k)
                                                    }
                                                    if (inputlabel.indexOf("血清肌酐") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.scr)
                                                    }
                                                    if (inputlabel.indexOf("总胆固醇") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.tc)
                                                    }
                                                    if (inputlabel.indexOf("高密度脂蛋白胆固醇") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.hdl_c)
                                                    }
                                                    if (inputlabel.indexOf("低密度脂蛋白胆固醇") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.ldl_c)
                                                    }
                                                    if (inputlabel.indexOf("甘油三酯") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.tg)
                                                    }
                                                    if (inputlabel.indexOf("收缩压") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.DBP)
                                                    }
                                                    if (inputlabel.indexOf("舒张压") >= 0) {
                                                        inputGridArr.eq(i).find('input').val(_that.SBP)
                                                    }
                                                }
                                                //单选radio模拟
                                                $(".cdss-eval-quest-item-radio").off("click").on("click", function() {
                                                        $(this).siblings().removeClass("active")
                                                        $(this).addClass("active")
                                                            // var allRadioArr=$(".cdss-quest-item-radio")
                                                            //step1.将所有被radio联动的菜单隐藏
                                                            // for(var i=0;i<allRadioArr.length;i++){
                                                            //     var id=allRadioArr.eq(i).attr("qenabled").split(";")
                                                            //     for(var p=0;p<id.length;p++){
                                                            //         if((id[p]!="null")&& id[p]){
                                                            //             $("[id='"+id[p]+"']").hide()
                                                            //         }
                                                            //     }
                                                            // }
                                                            //step2.复合联动的所有激活才显示
                                                            // for(var i=0;i<allRadioArr.length;i++){
                                                            //     var id=allRadioArr.eq(i).attr("qenabled").split(";")
                                                            //     var active=allRadioArr.eq(i).hasClass("active")
                                                            //     for(var k=0;k<id.length;k++){
                                                            //         if(active && (id[k]!="null")){
                                                            //             //多层联动复合判断
                                                            //             // var flag=true
                                                            //             // for(var s=0;s<allRadioArr.length;s++){
                                                            //             //     var allid=allRadioArr.eq(s).attr("qenabled").split(";")
                                                            //             //     var singleactive=allRadioArr.eq(s).hasClass("active")
                                                            //             //     if(allid.indexOf(id[k])>=0 && !singleactive){
                                                            //             //         flag=false
                                                            //             //     }
                                                            //             // }
                                                            //             // if(flag){
                                                            //                 $("[id='"+id[k]+"']").show()
                                                            //             // }
                                                            //         }
                                                            //     }
                                                            // }
                                                    })
                                                    //多选checkbox模拟
                                                $(".cdss-quest-checkbox").off("click").on("click", function() {
                                                        $(this).toggleClass("active")
                                                    })
                                                    //病史hint提示
                                                $(".cdss-eval-input-item-radio-grid .cdss-radio-tips-img").on("mouseenter", function() {
                                                    $(this).next().show()
                                                })
                                                $(".cdss-eval-input-item-radio-grid .cdss-radio-tips-img").on("mouseleave", function() {
                                                        $(this).next().hide()
                                                    })
                                                    //评估hint提示
                                                $(".cdss-eval-input-item-grid .cdss-radio-tips-img").on("mouseenter", function() {
                                                    $(this).next().show()
                                                })
                                                $(".cdss-eval-input-item-grid .cdss-radio-tips-img").on("mouseleave", function() {
                                                        $(this).next().hide()
                                                    })
                                                    //点击评估按钮
                                                $("#cdss-eval-btn").off("click").on("click", function() {
                                                    //处理kvList
                                                    var kvList = []
                                                        //step1 处理输入框
                                                    for (var k = 0; k < $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").length; k++) {
                                                        var key = $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).attr("id").split(".")[$(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).attr("id").split(".").length - 1]
                                                        var value = $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).find(".cdss-eval-quest-item-inputwrap").find("input")[0].value ? $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).find(".cdss-eval-quest-item-inputwrap").find("input")[0].value : 0
                                                        var isInput = $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).find(".cdss-eval-quest-item-inputwrap").find("input")[0].value.length > 0
                                                        if (!isInput) {
                                                            _that.showCdssAlert('输入框为必填选项！')
                                                            return
                                                        }
                                                        if (parseFloat(value)) { //AI要求空值不传
                                                            if (parseFloat(value) >= 0) {
                                                                if (value.indexOf(".") < 0) {
                                                                    var obj = {}
                                                                    obj['key'] = key
                                                                    obj['value'] = parseFloat(value)
                                                                    kvList.push(obj)
                                                                } else if (value.indexOf(".") > 0 && value.split(".")[1].length < 3) {
                                                                    var obj = {}
                                                                    obj['key'] = key
                                                                    obj['value'] = parseFloat(value)
                                                                    kvList.push(obj)
                                                                } else {
                                                                    $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).find(".cdss-eval-quest-item-inputwrap").find("input").addClass("cdss-input-error")
                                                                    if (document.body.scrollIntoView) {
                                                                        document.querySelector(".cdss-eval-quest-item-inputwrap")[k].scrollIntoView()
                                                                    }
                                                                    return
                                                                }
                                                            } else {
                                                                $(".cdss-eval-table-wrap-ctn .cdss-eval-input-item-grid").eq(k).find(".cdss-eval-quest-item-inputwrap").find("input").addClass("cdss-input-error")
                                                                if (document.body.scrollIntoView) {
                                                                    document.querySelector(".cdss-eval-quest-item-inputwrap")[k].scrollIntoView()
                                                                }
                                                                return
                                                            }
                                                        }
                                                    }
                                                    //step2 处理radio
                                                    for (var m = 0; m < $(".cdss-eval-input-item-radio-grid").length; m++) {
                                                        var activeRadioDom = $(".cdss-eval-input-item-radio-grid").eq(m).find(".cdss-eval-quest-item-radio-inputwrap").find(".cdss-eval-quest-item-radio").hasClass("active")
                                                        if (!!activeRadioDom) {
                                                            var key = $(".cdss-eval-input-item-radio-grid").eq(m).attr("id").split(".")[$(".cdss-eval-input-item-radio-grid").eq(m).attr("id").split(".").length - 1]
                                                            var value = $(".cdss-eval-input-item-radio-grid").eq(m).find(".cdss-eval-quest-item-radio-inputwrap").find(".cdss-eval-quest-item-radio.active").attr("value")
                                                            var obj = {}
                                                            obj['key'] = key
                                                            obj['value'] = parseInt(value)
                                                            kvList.push(obj)
                                                        } else {
                                                            _that.showCdssAlert('单选为必填项！')
                                                            return
                                                        }

                                                    }
                                                    //step3 处理checkbox
                                                    var checkboxDomArr = $(".cdss-eval-table-wrap .cdss-eval-quest-content").has(".cdss-input-item-check-grid")
                                                    for (var n = 0; n < checkboxDomArr.length; n++) {
                                                        for (var k = 0; k < checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").length; k++) {
                                                            var value = ""
                                                            var key = checkboxDomArr.eq(n).find(".cdss-input-item-check-grid").eq(k).attr("id").split(".")
                                                            var len = key.length - 1
                                                            var id = key[len]
                                                            for (var s = 0; s < checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").eq(k).find(".cdss-input-item-check-grid").length; s++) {
                                                                value += checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").eq(k).find(".cdss-input-item-check-grid").eq(s).find(".cdss-quest-checkbox").hasClass("active") ? "1" : "0"
                                                            }
                                                            var obj = {}
                                                            obj['key'] = id
                                                            obj['value'] = value
                                                            kvList.push(obj)
                                                            if (value.indexOf('1') < 0) {
                                                                _that.showCdssAlert('多选为必填选项！')
                                                                return
                                                            }
                                                        }
                                                    }
                                                    //评估采用当前输入值
                                                    var radioWrapArr = $(".cdss-eval-input-item-radio-grid")
                                                    var eva_gender = ''
                                                    for (var i = 0; i < radioWrapArr.length; i++) {
                                                        var itemlabel = radioWrapArr.eq(i).find('span').eq(0).text()
                                                        if (itemlabel.indexOf('性别') >= 0) {
                                                            var genderNum = radioWrapArr.eq(i).find('.cdss-eval-quest-item-radio-inputwrap').find('span.active').attr('value')
                                                            if (genderNum == '1') {
                                                                eva_gender = '男'
                                                            } else {
                                                                eva_gender = '女'
                                                            }
                                                        }
                                                    }
                                                    var inputGridArr = $(".cdss-eval-input-item-grid")
                                                    var eva_age = ''
                                                    for (var i = 0; i < inputGridArr.length; i++) {
                                                        //由于AI返回的字段没有约定id的name，所以这里只能用汉字indexof处理
                                                        var inputlabel = inputGridArr.eq(i).find('span').eq(0).text()
                                                        if (inputlabel.indexOf("年龄") >= 0) {
                                                            eva_age = inputGridArr.eq(i).find('.cdss-eval-quest-item-inputwrap').find('input').val()
                                                        }
                                                    }
                                                    var reqData = {
                                                        hospitalId: _that.hospitalId, //医院号
                                                        hospitalName: _that.hospitalName, //医院名称
                                                        belongCity: _that.belongCity, //城市
                                                        physicianId: _that.physicianId, //医生号
                                                        physicianName: _that.physicianName, //医生姓名
                                                        patientId: _that.patientId, //患者号
                                                        name: _that.name, //患者姓名
                                                        outerSerialNo: _that.outerSerialNo, //流水号
                                                        age: eva_age || _that.age || 40,
                                                        gender: eva_gender || _that.gender,
                                                        hospitalDepartment: _that.hospitalDepartment,
                                                        surveyName: surveyName,
                                                        kvList: kvList,
                                                    }
                                                    if (kvList && kvList.length) {
                                                        for (var i = 0; i < kvList.length; i++) {
                                                            if ((kvList[i].key == 'age') && kvList[i].value) {
                                                                reqData.age = kvList[i].value
                                                            }
                                                            console.log(kvList[i])
                                                            if ((kvList[i].key == 'gender')) {
                                                                reqData.gender = kvList[i].value == 1 ? '男' : '女'
                                                            }
                                                        }
                                                    }
                                                    reqData.hospitalDepartment = _that.hospitalDepartment
                                                    reqData.hospitalDepartmentId = _that.hospitalDepartmentId
                                                    $.ajax({
                                                        url: baseURL + '/diagnose/post/getScaleDiagnosis',
                                                        type: 'post',
                                                        datatype: 'json',
                                                        data: JSON.stringify(reqData),
                                                        contentType: 'application/json',
                                                        scriptCharset: 'utf-8',
                                                        beforeSend: function(request) {
                                                            request.setRequestHeader('Content-Type', 'application/json')
                                                            request.setRequestHeader('channel-id', channelId)
                                                            request.setRequestHeader('institution-id', institutionId)
                                                            request.setRequestHeader('source', 'diagnosis')
                                                        },
                                                        success: function(resData) {
                                                            if (resData.retCode == '999999') {
                                                                var data = resData.data.riskResult
                                                                if (data && data.length > 0) {
                                                                    var rawData = data[0]
                                                                    var grade = rawData.grade
                                                                    if (grade) {
                                                                        $(".cdss-eval-result-risk").css('width', '20%')
                                                                        $(".cdss-eval-result-discrip").css({ 'width': '60%', 'left': '20%' })
                                                                        $(".cdss-eval-result-risk").show()
                                                                    } else {
                                                                        $(".cdss-eval-result-risk").css('width', '0')
                                                                        $(".cdss-eval-result-discrip").css({ 'width': '80%', 'left': '0' })
                                                                        $(".cdss-eval-result-risk").hide()
                                                                    }
                                                                    var desc = rawData.description
                                                                    if (desc) {
                                                                        $(".cdss-eval-result-risk span i").text(grade)
                                                                        $(".cdss-eval-result-discrip .cdss-eval-result-discrip-child").text(desc)
                                                                        $(".cdss-eval-result-wrap").show()
                                                                        if (document.body.scrollIntoView) {
                                                                            setTimeout(function() {
                                                                                var ele = document.querySelector(".cdss-eval-table-wrap");
                                                                                ele.scrollTop = ele.scrollHeight;
                                                                            }, 500);
                                                                        }
                                                                    } else {
                                                                        _that.showCdssAlert('未查询到评估结果！')
                                                                        $(".cdss-eval-result-risk span i").text('')
                                                                        $(".cdss-eval-result-discrip .cdss-eval-result-discrip-child").text('')
                                                                        $(".cdss-eval-result-wrap").hide()
                                                                    }
                                                                    // 疾病详情-治疗-评估量表回写
                                                                    rawData.writeType = 0
                                                                    rawData.writeText = $('.cdss-eval-item-title').text() + '评估结果：' + rawData.description.replace(/<.*?>/ig,  "")
                                                                    $('#cdss-eval-result-writeback-btn').off('click').on('click', function() {
                                                                        var mdData = {
                                                                            event: "详情页评估量表结果回写",
                                                                            page: "疾病诊疗详情页",
                                                                            pageElement: "结果回写名称",
                                                                            operation1: $('.cdss-eval-item-title').text()
                                                                        }
                                                                        _that.REC(mdData)
                                                                        if (getWriteBack) {
                                                                            _that.toast('回写' + _that.writeBackName + '成功')
                                                                            getWriteBack(rawData)
                                                                        }
                                                                    })
                                                                } else {
                                                                    _that.showCdssAlert('未查询到评估结果！')
                                                                    $(".cdss-eval-result-risk span i").text('')
                                                                    $(".cdss-eval-result-discrip .cdss-eval-result-discrip-child").text('')
                                                                    $(".cdss-eval-result-wrap").hide()
                                                                }
                                                            } else {

                                                            }
                                                        },
                                                        error: function(err) {

                                                        }
                                                    })
                                                })
                                            },
                                            error: function(err) {
                                                _that.showCdssAlert("网络错误，请稍后尝试！")
                                            }
                                        })
                                    })
                                    //搜索提示信息
                                $(".cdss-disease-ascvd-eval-btn").on('mouseenter', function() {
                                    $(this).parent().find(".cdss-disease-ascvd-eval-tips").show()
                                })
                                $(".cdss-disease-ascvd-eval-btn").on('mouseout', function() {
                                    $(this).parent().find(".cdss-disease-ascvd-eval-tips").hide()
                                })
                            } else {
                                $(".cdss-disease-ascvd-eval-wrap").hide()
                            }
                        } else {
                            $(".cdss-disease-ascvd-eval-wrap").hide()

                            if (resData.retCode == '-100010') { // 权限暂未开通!解锁更多功能，请联系系统管理员
                                _that.treatNum++
                                    $('.cdss-detail-no-access').empty().html(resData.retMsg)
                            }
                        }
                        deleteBorder()
                    },
                    error: function(err) {
                        $(".cdss-disease-ascvd-eval-wrap").hide()
                    }
                })
            }).then(function() {
                _that.checkDiseaseSupport(diseaseFinalArr, 'detail', Index)
                _that.checkRecommend(diseaseName)
            }).then(function() {
                if (_that.treatNum == 7 || _that.evidNum == 2) { // 诊疗 询证 有一个没有  则不显示tab
                    $('.cdss-disease-treat-evid-tabs').hide()
                }
                if (_that.treatNum == 7 && _that.evidNum != 2) { // 无诊疗 有询证 默认就显示询证
                    $('.cdss-disease-evid-ctn').show()
                }
                if (_that.treatNum == 7 && _that.evidNum == 2) { // 无诊疗 且 无询证 则显示无权限 请联系系统管理员
                    $('.cdss-detail-no-access').show()
                }
                $('.cdss-disease-treat-ctn').show()
                $(".cdss-disease-detail-name").text(diseaseName)
                $(".cdss-disease-detail-wrap").show()
                deleteBorder()
                $(".cdss-disease-case-detail-wrap").hide()
                $(".cdss-all-search-list-wrap").hide()
                $(".cdss-case-guide-search-list-wrap").hide()
                $(".cdss-other-search-list-wrap").hide()
                $(".cdss-case-guide-detail-wrap").hide()
                $(".cdss-drug-common-list-wrap").hide()
                $(".cdss-drug-mec-list-wrap").hide()
                $(".cdss-select-drug-type-wrap").hide()
                $(".cdss-select-drug-detail-wrap").hide()
                $(".cdss-drug-detail-wrap").hide()
                showTab()
            }).then(function() {
                // 查询是否有详情/是否是罕见病
                _that.isRarediseaseXq()
            })

            // 详情的检验解读
            var testSheetData = {
                checkParams: [
                    // {checkName: "总胆固醇", result: "4.81", referenceRange: "3.38-6.00", unit: "mmol/L"},
                    // {checkName: "甘油三酯", result: "2.59", referenceRange: "0.51-1.71", unit: "mmol/L"},
                    // {checkName: "高密度脂蛋白胆固醇", result: "1.27", referenceRange: "0.78-1.53", unit: "mmol/L"},
                    // {checkName: "低密度脂蛋白胆固醇", result: "3.59", referenceRange: "2.07-3.12", unit: "mmol/L"}
                ],
                gender: _that.gender,
                age: _that.age,
                disease: _that.diseaseName,
                hospitalId: _that.hospitalId,
                hospitalName: _that.hospitalName,
                belongCity: _that.belongCity,
                physicianId: _that.physicianId,
                physicianName: _that.physicianName,
                patientId: _that.patientId,
                name: _that.name,
                outerSerialNo: _that.outerSerialNo
            }
            if (testSheetData.checkParams.length) {
                _that.testSheetDiagnosis(testSheetData, 'detail')
            }
            //新疾病详情tabs弹窗逻辑


            $(".cdss-disease-detail-name-icon").off("click").on("click", function() {
                var keyword = $(this).parent().find('.cdss-disease-detail-name').text()
                _that.getMedicalInfo({ type: 'disease', keyword: keyword, source: 'disease_detail' })

            })

            $('.cdss-disease-detail-name-icon-add').off('click').on('click', function() {
                var result = {}
                result.writeType = 3 // 会写到诊断结果
                result.writeText = $(this).parent().find('.cdss-disease-detail-name').text()
                if (getWriteBack) {
                    getWriteBack(result)
                }
                var mdData = {
                    event: "详情页疑似诊断回写",
                    page: "疾病诊疗详情页",
                    pageElement: "添加诊断图标",
                    operation1: result.writeText
                }
                _that.REC(mdData)
            })
        }
        // 获取某种疾病是否有罕见病/详情flag
    _that.isRarediseaseXq = function() {
            var diseaseValue = $('.cdss-disease-detail-name').text()
            var data = { diseaseNames: [diseaseValue] }
            $.ajax({
                url: baseURL + '/disease/diseaseListCheck',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        if (resData.data.length != 0) {
                            // 判断罕见病标签是否显示
                            if (resData.data[0].rareDisease == 1) {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-right-hjb').show()
                            } else {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-right-hjb').hide()
                            }
                            // 判断详情是否显示
                            if (resData.data[0].hasInfo) {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-name-icon').show()
                            } else {
                                $('.cdss-disease-detail-active').find('.cdss-disease-detail-name-icon').hide()
                            }
                        }
                    } else {

                    }
                },
                error: function(err) {

                }
            })
        }
        // 常用处方 isDrugConflict true:中药处方的 false: 是详情的
    _that.getCommonPrescription = function(info, isDrugConflict) {
            if (_that.tabShow == 2) { return }
            $('.cdss-drug-list-most-module-prescription').hide()
            $(".cdss-drug-list-most-commom-wrap").hide()
            info.hospitalDepartment = _that.hospitalDepartment
            info.hospitalDepartmentId = _that.hospitalDepartmentId
            return $.ajax({
                url: baseURL + '/diagnose/post/getCommonPrescription',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(info),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(res) {
                    if (res.retCode == '999999' && res.data) {
                        // console.log(res.data.prescriptionUses)

                        if (res.data.type == 1 && res.data.prescriptionUses && res.data.prescriptionUses.length) { // 常用处方
                            var str = ''
                            var prescriptionUses = res.data.prescriptionUses

                            function prescriptionUsesFun() {
                                str += '<div class="cdss-prescriptionUses-condition">' + prescriptionUses[i].condition + '</div>'
                                str += '<div class="cdss-prescriptionUses-content">'
                                if (prescriptionUses[i].prescriptions && prescriptionUses[i].prescriptions.length) { //处方列表 多个处方
                                    var prescriptions = prescriptionUses[i].prescriptions
                                    var length = prescriptions.length > 20 ? 20 : prescriptions.length // 处方列表 多个处方 超过20个 取前20个
                                    var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                                        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"
                                    ]
                                    if (length == 1) {} else if (length == 2) {
                                        str += '<ul class="cdss-tab-ul cdss-clearfix">' // 处方的tab
                                        for (var prej = 0; prej < length; prej++) {
                                            var active = prej == 0 ? 'active' : ''
                                            str += '<li class="cdss-prescriptionUses-tab-li second-li ' + active + '" index="' + prej + '">处方' + arr[prej] + '</li>'
                                        }
                                        str += '</ul>'
                                    } else if (length == 3) {
                                        str += '<ul class="cdss-tab-ul cdss-clearfix">' // 处方的tab
                                        for (var prej = 0; prej < length; prej++) {
                                            var active = prej == 0 ? 'active' : ''
                                            str += '<li class="cdss-prescriptionUses-tab-li third-li ' + active + '" index="' + prej + '">处方' + arr[prej] + '</li>'
                                        }
                                        str += '</ul>'
                                    } else if (length > 3) {
                                        var widthLength = length * 67 + 'px'
                                        str += '<div class="cdss-clearfix">'
                                        str += '<div class="cdss-prescriptionUses-icon cdss-prescriptionUses-left">'
                                        str += '<img src="' + webBaseURL + '/image/icon_turnpage_hover.png" alt="" class="active"/>'
                                        str += '<img src="' + webBaseURL + '/image/icon_turnpage-left.png" alt="" class="disable"/>'
                                        str += '</div>'
                                        str += '<div class="cdss-tab-ul-model">'
                                        str += '<ul class="cdss-tab-ul cdss-clearfix" posindex=0 poslength="' + length + '" style="width:' + widthLength + '">' // 处方的tab
                                        for (var prej = 0; prej < length; prej++) {
                                            var active = prej == 0 ? 'active' : ''
                                            str += '<li class="cdss-prescriptionUses-tab-li most-li ' + active + '" index="' + prej + '">处方' + arr[prej] + '</li>'
                                        }
                                        str += '</ul>'
                                        str += '</div>'
                                        str += '<div class="cdss-prescriptionUses-icon cdss-prescriptionUses-right">'
                                        str += '<img src="' + webBaseURL + '/image/icon_turnpage_hover-right.png" alt="" class="active"/>'
                                        str += '<img src="' + webBaseURL + '/image/icon_turnpage.png" alt="" class="disable"/>'
                                        str += '</div></div>'
                                    }

                                    for (var j = 0; j < length; j++) { // 处方tab对应的药品列表
                                        var active = j == 0 ? 'active' : ''
                                        str += '<div class="cdss-content-item ' + active + '">'
                                        var drugs = prescriptions[j].drugs
                                        if (drugs && drugs.length) {
                                            str += '<ul>'
                                            for (var drugsi = 0; drugsi < drugs.length; drugsi++) { // 具体药品
                                                str += '<li>'
                                                str += '<div class="cdss-prescriptions-drug-header">' +
                                                    drugs[drugsi].drugName
                                                    // zt
                                                if (drugs[drugsi].hasInfo) {
                                                    str += '<img class="cdss-prescriptions-drug-header-icon" hasInfo="' + drugs[drugsi].hasInfo + '" drugName="' + drugs[drugsi].drugName + '" src="' + webBaseURL + '/image/icon_diseasedetail.png" />'
                                                }

                                                if (drugs[drugsi].stock > 0 || _that.alwaysAddIcon) {
                                                    str += '<span class="cdss-prescriptions-common-drug-list-add">' +
                                                        '<img src="' + webBaseURL + '/image/icon_add_prescriptions.png" drugname="' + (drugs[drugsi].drugName || "") + '" spec="' + (drugs[drugsi].spec || "") + '" dose="' + (drugs[drugsi].dose || "") + '" freq="' + (drugs[drugsi].freq || "") + '" drugMethod="' + (drugs[drugsi].drugMethod || "") + '" manufacturer="' + (drugs[drugsi].manufacturer || "") + '" unit="' + (drugs[drugsi].unit || "") + '" drugcode="' + (drugs[drugsi].drugCode || "") + '" class="cdss-prescriptions-common-drug-list-add-btn" />' +
                                                        '</span>'
                                                }
                                                str += '</div>'
                                                var arr = ['drugMethod', 'dose', 'freq', 'spec', 'course', 'note']
                                                var arrs = []
                                                var childStr = ''
                                                for (var arri = 0; arri < arr.length; arri++) {
                                                    console.log(arr[arri], drugs[drugsi][arr[arri]])
                                                    if (drugs[drugsi][arr[arri]]) {
                                                        arrs.push(arr[arri])
                                                    }
                                                }
                                                for (var drugsj = 0; drugsj < arrs.length; drugsj++) {
                                                    if (drugs[drugsi][arrs[drugsj]]) {
                                                        if (drugsj == arrs.length - 1) {
                                                            childStr += drugs[drugsi][arrs[drugsj]]
                                                        } else {
                                                            childStr += drugs[drugsi][arrs[drugsj]] + '，'
                                                        }
                                                    }
                                                }
                                                str += '<div>' + childStr + '</div>'
                                                str += '</li>'
                                            }
                                            str += '</ul>'

                                        }
                                        str += '</div>'
                                    }(window)
                                }
                                str += '</div>'
                            }
                            for (var i = 0; i < prescriptionUses.length; i++) {
                                if (i == 0) {
                                    prescriptionUsesFun(i)
                                }
                            }
                            if (prescriptionUses.length > 1) {
                                for (var i = 0; i < prescriptionUses.length; i++) {
                                    str += '<div class="cdss-prescriptionUses-list-sub-morelist">'
                                    if (i > 0) {
                                        prescriptionUsesFun(i)
                                    }
                                    str += '</div>'
                                }
                                str += '<div class="cdss-prescriptionUses-list-sub-showmore">更多' +
                                    '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                    '</div>' +
                                    '<div class="cdss-prescriptionUses-list-sub-hidemore">隐藏' +
                                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                    '</div>'
                            }
                            if (isDrugConflict) {
                                $('.cdss-drug-list-most-prescription-list-wrap').empty().html(str)
                                $('.cdss-drug-list-most-module-prescription').show()
                                $(".cdss-prescription-detail-wrap").show()
                                $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                                    $(".cdss-prescription-detail-wrap").hide()
                                })
                            } else {
                                $('.cdss-disease-prescription-list-wrap').empty().html(str)
                                $('.cdss-disease-module-prescription').show()
                                _that.shouldShowWrap = true
                            }

                            deleteBorder()

                            $('.cdss-prescriptions-common-drug-list-add-btn').off('click').on('click', function() {
                                    var data = {
                                        drugName: $(this).attr('drugname'),
                                        freq: $(this).attr('freq'),
                                        dose: $(this).attr('dose'),
                                        drugMethod: $(this).attr('drugMethod'),
                                        spec: $(this).attr('spec'),
                                        manufacturer: $(this).attr('manufacturer'),
                                        unit: $(this).attr('unit'),
                                        id: $(this).attr('drugcode'),
                                    }

                                    var result = {
                                        writeType: 4,
                                        data: [data]
                                    }
                                    if (getWriteBack) {
                                        _that.toast('回写成功')
                                        getWriteBack(result)
                                    }
                                    var mdData = {
                                        event: "常用西药处方回写",
                                        page: "疾病诊疗详情页",
                                        pageElement: "常用处方添加图标",
                                        operation1: data.drugName
                                    }
                                    _that.REC(mdData)
                                    _that.acceptCommonlyUsedDrug(data.drugName)
                                })
                                // 显示隐藏
                            $(".cdss-prescriptionUses-list-sub-showmore").off("click").on("click", function() {
                                $(".cdss-prescriptionUses-list-sub-morelist").show()
                                $(".cdss-prescriptionUses-list-sub-hidemore").show()
                                $(".cdss-prescriptionUses-list-sub-showmore").hide()
                            })
                            $(".cdss-prescriptionUses-list-sub-hidemore").off("click").on("click", function() {
                                    $(".cdss-prescriptionUses-list-sub-morelist").hide()
                                    $(".cdss-prescriptionUses-list-sub-showmore").show()
                                    $(".cdss-prescriptionUses-list-sub-hidemore").hide()
                                })
                                // zt
                            $('.cdss-prescriptions-drug-header-icon').off('click').on('click', function() {
                                var drugName = $(this).attr('drugName')
                                var mdData = {
                                    event: "常用西药处方详情查看",
                                    page: "疾病诊疗详情页",
                                    pageElement: "常用处方说明书图标",
                                    operation1: drugName
                                }
                                _that.REC(mdData)
                                _that.getMedicalInfo({ keyword: drugName, type: 'drug', source: 'prescriptions' + (isDrugConflict ? '_info' : '_detail') })
                            })


                            $('.cdss-prescriptionUses-tab-li').off('click').on('click', function() { // 处方列表的切换事件
                                $(this).parent().children('.cdss-prescriptionUses-tab-li').removeClass('active')
                                $(this).addClass('active')
                                var index = $(this).attr('index')
                                $(this).parent().parent().children('.cdss-content-item').removeClass('active')
                                $(this).parent().parent().children('.cdss-content-item').eq(index).addClass('active')
                                if ($(this).parent().parent().parent().children('.cdss-content-item')) {
                                    $(this).parent().parent().parent().children('.cdss-content-item').removeClass('active')
                                    $(this).parent().parent().parent().children('.cdss-content-item').eq(index).addClass('active')
                                }
                                if ($(this).parent().parent().parent().parent().children('.cdss-content-item')) {
                                    $(this).parent().parent().parent().parent().children('.cdss-content-item').removeClass('active')
                                    $(this).parent().parent().parent().parent().children('.cdss-content-item').eq(index).addClass('active')
                                }
                            })
                            $('.cdss-prescriptionUses-left').off('click').on('click', function() { // 向又滑动
                                var posindex = $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('posindex')
                                var poslength = $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('poslength')
                                if (posindex > 0) {
                                    posindex = parseInt(posindex) - 1
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').css('margin-left', (-67 * posindex + 'px'))
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('posindex', posindex)
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').css('border-radius', '0')
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').eq(posindex).css('border-radius', '4px 0 0 4px')
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').eq(posindex + 2).css('border-radius', '0 4px 4px 0')
                                    if (posindex == 0) {
                                        $(this).children('.active').hide()
                                        $(this).children('.disable').show()
                                    }
                                    $(this).parent().children('.cdss-prescriptionUses-right').children('.active').show()
                                    $(this).parent().children('.cdss-prescriptionUses-right').children('.disable').hide()
                                }
                            })
                            $('.cdss-prescriptionUses-right').off('click').on('click', function() { // 向左滑动
                                var posindex = $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('posindex')
                                var poslength = $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('poslength')
                                if (posindex < poslength - 3) {
                                    posindex = parseInt(posindex) + 1
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').css('margin-left', (-67 * posindex + 'px'))
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').attr('posindex', posindex)
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').css('border-radius', '0')
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').eq(posindex).css('border-radius', '4px 0 0 4px')
                                    $(this).parent().children('.cdss-tab-ul-model').children('.cdss-tab-ul').children('li').eq(posindex + 2).css('border-radius', '0 4px 4px 0')
                                    if (posindex == poslength - 3) {
                                        $(this).children('.active').hide()
                                        $(this).children('.disable').show()
                                    }
                                    $(this).parent().children('.cdss-prescriptionUses-left').children('.active').show()
                                    $(this).parent().children('.cdss-prescriptionUses-left').children('.disable').hide()
                                }
                            })
                        } else {
                            $('.cdss-drug-list-most-module-prescription').hide()
                                // 常用药物
                            _that.getCommonlyUsedDrugs(info, isDrugConflict)
                        }
                    } else {
                        if (res.retCode == '-100010') { // 未授权
                            if (isDrugConflict == false) {
                                _that.treatNum++
                            }
                        } else {
                            // 常用药物
                            _that.getCommonlyUsedDrugs(info, isDrugConflict)
                        }
                    }
                    _that.showNoPrescription()
                }
            })
        }
        //常用药物 
    _that.getCommonlyUsedDrugs = function(info, isDrugConflict) {
        info.hospitalDepartment = _that.hospitalDepartment
        info.hospitalDepartmentId = _that.hospitalDepartmentId
        $(".cdss-drug-list-most-commom-wrap").hide()
        $('.cdss-disease-commondrugs-list-wrap').removeClass('text-center')
        $.ajax({
            url: baseURL + '/diagnose/post/getCommonlyUsedDrugs',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(info),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    if (isDrugConflict) {
                        $(".cdss-drug-list-most-commom-wrap").show()
                        $(".cdss-prescription-detail-wrap").show()
                        $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                            $(".cdss-prescription-detail-wrap").hide()
                        })
                        $(".cdss-drug-conflict-commom-wrap").show()
                        showTab('left')
                    }
                    var data = resData.data
                    var totalList = []
                    for (var disease in data) {
                        if (data[disease]) {
                            totalList = data[disease]
                        }
                    }
                    var drugListStr = ''
                    if (totalList && totalList.length > 0) {
                        _that.shouldShowWrap = true
                        var len = totalList.length
                        if (len <= 3) {
                            for (var i = 0; i < totalList.length; i++) {
                                drugListStr += '<div class="cdss-disease-common-drug-list-sub">' +
                                    '<span>' + totalList[i].drugMapping.drugName + '</span>'
                                if (totalList[i].essentialDrug == '1') {
                                    drugListStr += '<span class="cdss-drug-basic-icon">基</span>'
                                }
                                drugListStr += '<img src="' + webBaseURL + '/image/icon_diseasedetail.png" alt="" class="cdss-disease-common-drug-list-query-btn" ' +
                                    'id="' + totalList[i].drugMapping.id + '" />'
                                if (totalList[i].drugMapping.stock > 0 || _that.alwaysAddIcon) {
                                    drugListStr += '<span class="cdss-disease-common-drug-list-add">' +
                                        '<img src="' + webBaseURL + '/image/icon_attention_b@2x.png" alt="" class="cdss-disease-common-drug-list-add-btn"' +
                                        'id="' + totalList[i].drugMapping.id + '"' +
                                        'drugname="' + totalList[i].drugMapping.drugName + '"' +
                                        'frequency="' + totalList[i].drugMapping.frequency + '"' +
                                        'dosage="' + totalList[i].drugMapping.dosage + '"' +
                                        'spec="' + totalList[i].drugMapping.spec + '"' +
                                        'unit="' + totalList[i].drugMapping.unit + '"' +
                                        'conceptId="' + totalList[i].drugMapping.conceptId + '"' +
                                        'disease="' + totalList[i].drugMapping.disease + '"' +
                                        'stock="' + totalList[i].drugMapping.stock + '"' +
                                        'taboo="' + totalList[i].drugMapping.taboo + '"' +
                                        'manufacturer="' + totalList[i].drugMapping.manufacturer + '"' +
                                        '/>' +
                                        '</span>'
                                }
                                drugListStr += '</div>'
                            }
                        } else {
                            for (var i = 0; i < 3; i++) {
                                drugListStr += '<div class="cdss-disease-common-drug-list-sub">' +
                                    '<span>' + totalList[i].drugMapping.drugName + '</span>'
                                if (totalList[i].essentialDrug == '1') {
                                    drugListStr += '<span class="cdss-drug-basic-icon">基</span>'
                                }
                                drugListStr += '<img src="' + webBaseURL + '/image/icon_diseasedetail.png" alt="" class="cdss-disease-common-drug-list-query-btn" ' +
                                    'id="' + totalList[i].drugMapping.id + '" />'
                                if (totalList[i].drugMapping.stock > 0 || _that.alwaysAddIcon) {
                                    drugListStr += '<span class="cdss-disease-common-drug-list-add">' +
                                        '<img src="' + webBaseURL + '/image/icon_attention_b@2x.png" alt="" class="cdss-disease-common-drug-list-add-btn"' +
                                        'id="' + totalList[i].drugMapping.id + '"' +
                                        'drugname="' + totalList[i].drugMapping.drugName + '"' +
                                        'frequency="' + totalList[i].drugMapping.frequency + '"' +
                                        'dosage="' + totalList[i].drugMapping.dosage + '"' +
                                        'spec="' + totalList[i].drugMapping.spec + '"' +
                                        'unit="' + totalList[i].drugMapping.unit + '"' +
                                        'conceptId="' + totalList[i].drugMapping.conceptId + '"' +
                                        'disease="' + totalList[i].drugMapping.disease + '"' +
                                        'stock="' + totalList[i].drugMapping.stock + '"' +
                                        'taboo="' + totalList[i].drugMapping.taboo + '"' +
                                        'manufacturer="' + totalList[i].drugMapping.manufacturer + '"' +
                                        '>' +
                                        '</span>'
                                }
                                drugListStr += '</div>'
                            }
                            drugListStr += '<div class="cdss-disease-common-drug-list-sub-morelist">'
                            for (var i = 3; i < totalList.length; i++) {
                                drugListStr += '<div class="cdss-disease-common-drug-list-sub">' +
                                    '<span>' + totalList[i].drugMapping.drugName + '</span>'
                                if (totalList[i].essentialDrug == '1') {
                                    drugListStr += '<span class="cdss-drug-basic-icon">基</span>'
                                }
                                drugListStr += '<img src="' + webBaseURL + '/image/icon_diseasedetail.png" alt="" class="cdss-disease-common-drug-list-query-btn" ' +
                                    'id="' + totalList[i].drugMapping.id + '" />'
                                if (totalList[i].drugMapping.stock > 0 || _that.alwaysAddIcon) {
                                    drugListStr += '<span class="cdss-disease-common-drug-list-add">' +
                                        '<img src="' + webBaseURL + '/image/icon_attention_b@2x.png" alt="" class="cdss-disease-common-drug-list-add-btn"' +
                                        'id="' + totalList[i].drugMapping.id + '"' +
                                        'drugname="' + totalList[i].drugMapping.drugName + '"' +
                                        'frequency="' + totalList[i].drugMapping.frequency + '"' +
                                        'dosage="' + totalList[i].drugMapping.dosage + '"' +
                                        'spec="' + totalList[i].drugMapping.spec + '"' +
                                        'unit="' + totalList[i].drugMapping.unit + '"' +
                                        'conceptId="' + totalList[i].drugMapping.conceptId + '"' +
                                        'disease="' + totalList[i].drugMapping.disease + '"' +
                                        'stock="' + totalList[i].drugMapping.stock + '"' +
                                        'taboo="' + totalList[i].drugMapping.taboo + '"' +
                                        'manufacturer="' + totalList[i].drugMapping.manufacturer + '"' +
                                        '>' +
                                        '</span>'
                                }
                                drugListStr += '</div>'
                            }
                            drugListStr += '</div>' +
                                '<div class="cdss-disease-common-drug-list-sub-showmore">更多' +
                                '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                '</div>' +
                                '<div class="cdss-disease-common-drug-list-sub-hidemore">隐藏' +
                                '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                '</div>'
                        }

                    } else {
                        drugListStr = '暂无常用西药推荐'
                        $('.cdss-disease-commondrugs-list-wrap').addClass('text-center')
                    }
                    if (isDrugConflict) {
                        $('.cdss-drug-list-commom-ctn').empty().append(drugListStr)
                    } else {
                        $('.cdss-disease-module-commondrugs').show()
                        $('.cdss-disease-commondrugs-list-wrap').empty().append(drugListStr)
                    }
                    deleteBorder()
                    $(".cdss-disease-common-drug-list-sub-showmore").off("click").on("click", function() {
                        $(".cdss-disease-common-drug-list-sub-morelist").show()
                        $(".cdss-disease-common-drug-list-sub-hidemore").show()
                        $(".cdss-disease-common-drug-list-sub-showmore").hide()
                        $(".cdss-disease-module-commondrugs .cdss-disease-commondrugs-list-wrap .cdss-disease-common-drug-list-sub").eq(2).css('border-bottom', '1px solid #e7e9ed');
                    })
                    $(".cdss-disease-common-drug-list-sub-hidemore").off("click").on("click", function() {
                            $(".cdss-disease-common-drug-list-sub-morelist").hide()
                            $(".cdss-disease-common-drug-list-sub-showmore").show()
                            $(".cdss-disease-common-drug-list-sub-hidemore").hide()
                            $(".cdss-disease-module-commondrugs .cdss-disease-commondrugs-list-wrap .cdss-disease-common-drug-list-sub").eq(2).css('border-bottom', 'none');
                        })
                        //添加常用药物
                    $(".cdss-disease-common-drug-list-add-btn").on('click', function() {
                            // _that.createRecipeTable && _that.createRecipeTable(submitData)

                            var data = {
                                drugName: $(this).attr('drugname') == 'null' ? '' : $(this).attr('drugname'),
                                freq: $(this).attr('frequency') == 'null' ? '' : $(this).attr('frequency'),
                                dose: $(this).attr('dosage') == 'null' ? '' : $(this).attr('dosage'),
                                spec: $(this).attr('spec') == 'null' ? '' : $(this).attr('spec'),
                                id: $(this).attr('id') == 'null' ? '' : $(this).attr('id'),
                                manufacturer: $(this).attr('manufacturer') == 'null' ? '' : $(this).attr('manufacturer'),
                                unit: $(this).attr('unit') == 'null' ? '' : $(this).attr('unit'),
                            }

                            var result = {
                                writeType: 4,
                                data: [data]
                            }
                            if (getWriteBack) {
                                _that.toast('回写成功')
                                getWriteBack(result)
                            }
                            var mdData = {
                                event: "常用药物回写",
                                page: "疾病诊疗详情页",
                                pageElement: "常用西药添加图标",
                                operation1: data.drugName
                            }
                            _that.REC(mdData)
                            _that.acceptCommonlyUsedDrug(data.drugName)

                        })
                        //跳转药品详情
                    $(".cdss-disease-common-drug-list-query-btn").on('click', function() {
                        var drugname = $(this).parent().find('span').eq(0).text()
                        var mdData = {
                            event: "常用药物药品详情查看",
                            page: "疾病诊疗详情页",
                            pageElement: "常用西药推荐详情图标",
                            operation1: drugname
                        }
                        _that.REC(mdData)
                        _that.getMedicalInfo({ keyword: drugname, type: 'drug', source: 'commondrug' + (isDrugConflict ? '_info' : '_detail') })
                    })
                } else {}
                _that.showNoPrescription()
            },
            error: function(err) {

            }
        })
    }
    _that.acceptCommonlyUsedDrug = function(drugName) {
        var mdData = {
            outerSerialNo: _that.outerSerialNo,
            diseaseName: _that.diseaseName,
            drugName: drugName
        }
        $.ajax({
            url: baseURL + '/diagnose/post/acceptCommonlyUsedDrug',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(mdData),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {} else {

                }
            },
            error: function(err) {

            }
        })
    }

    // 常用中草药方推荐 isDrugConflict true: false: 是详情的
    _that.getChDrugRecommend = function(info, isDrugConflict) {
        if (_that.tabShow == 2) { return }
        if (isDrugConflict == undefined) {
            isDrugConflict = true
            $('.cdss-drug-list-most-module-chDrugRecommend').hide()
                // $('.cdss-disease-module-chDrugRecommend').hide()
        } else {
            // $('.cdss-drug-list-most-module-chDrugRecommend').hide()
            $('.cdss-disease-module-chDrugRecommend').hide()
        }
        return $.ajax({
            url: baseURL + '/decision/post/chDrugRecommend',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(info),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(res) {
                if (res.retCode == '999999' && res.data) {
                    if (res.data.length && res.data[0].recommendDrug && res.data[0].recommendDrug.length) { // 常用中草药方推荐
                        var str = ''
                        var prescriptionUses = res.data[0].recommendDrug

                        function prescriptionUsesFun(i) {
                            var item = prescriptionUses[i]
                            str += '<div class="cdss-chDrugRecommend-item">'
                            str += '<div class="cdss-chDrugRecommend-drug-header">' +
                                item.herb
                                // zt
                            if (item.hasInfo) {
                                str += '<img class="cdss-chDrugRecommend-drug-header-icon"  drugID="' + item.id + '" drugName="' + item.herb + '" src="' + webBaseURL + '/image/icon_diseasedetail.png" />'
                            }


                            if (_that.alwaysAddIcon) {
                                str += '<span class="cdss-chDrugRecommend-common-drug-list-add">' +
                                    '<img src="' + webBaseURL + '/image/icon_add_prescriptions.png" drugID="' + item.id + '" drugName="' + item.herb + '" class="cdss-chDrugRecommend-common-drug-list-add-btn" />' +
                                    '</span>'

                            }
                            str += '</div>'
                            str += '<div>' + item['function'] + '</div>'
                            str += '</div>'
                        }
                        for (var i = 0; i < prescriptionUses.length; i++) {
                            if (i < 3) {
                                prescriptionUsesFun(i)
                            }
                        }
                        if (prescriptionUses.length > 1) {
                            for (var i = 0; i < prescriptionUses.length; i++) {
                                str += '<div class="cdss-chDrugRecommend-list-sub-morelist">'
                                if (i >= 3) {
                                    prescriptionUsesFun(i)
                                }
                                str += '</div>'
                            }
                            str += '<div class="cdss-chDrugRecommend-list-sub-showmore">更多' +
                                '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                '</div>' +
                                '<div class="cdss-chDrugRecommend-list-sub-hidemore">隐藏' +
                                '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                '</div>'
                        }
                        if (isDrugConflict) {
                            $('.cdss-drug-list-most-chDrugRecommend-list-wrap').empty().html(str)
                            $('.cdss-drug-list-most-module-chDrugRecommend').show()
                            $(".cdss-prescription-detail-wrap").show()
                            $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                                $(".cdss-prescription-detail-wrap").hide()
                            })
                        } else {
                            $('.cdss-disease-chDrugRecommend-list-wrap').empty().html(str)
                            $('.cdss-disease-module-chDrugRecommend').show()
                            _that.shouldShowWrap = true
                        }

                        deleteBorder()

                        $('.cdss-chDrugRecommend-common-drug-list-add-btn').off('click').on('click', function() {
                                var data = {
                                    drugName: $(this).attr('drugname'),
                                }
                                var drugID = $(this).attr('drugID')
                                var drugName = $(this).attr('drugName')

                                function func(obj) {
                                    console.log(obj)
                                    if (obj) {
                                        for (var key in obj) {
                                            if (key == '药物详细列表' && obj[key]) {
                                                var result = {
                                                    writeType: 5,
                                                    data: obj[key]
                                                }
                                                if (getWriteBack) {
                                                    _that.toast('回写成功')
                                                    getWriteBack(result)
                                                }
                                            }
                                        }
                                    }
                                }
                                var obj = _that.getChDrugInfo({ drugID: drugID, drugType: 'ch_medicine', drugName: drugName, hide: true }, func) // 中草药
                                var mdData = {
                                    event: "中草药的回写",
                                    page: "疾病诊疗详情页",
                                    pageElement: "常用中草药添加图标",
                                    operation1: data.drugName
                                }
                                _that.REC(mdData)
                                _that.acceptCommonlyUsedDrug(data.drugName)
                            })
                            // 显示隐藏
                        $(".cdss-chDrugRecommend-list-sub-showmore").off("click").on("click", function() {
                            $(".cdss-chDrugRecommend-list-sub-morelist").show()
                            $(".cdss-chDrugRecommend-list-sub-hidemore").show()
                            $(".cdss-chDrugRecommend-list-sub-showmore").hide()
                        })
                        $(".cdss-chDrugRecommend-list-sub-hidemore").off("click").on("click", function() {
                            $(".cdss-chDrugRecommend-list-sub-morelist").hide()
                            $(".cdss-chDrugRecommend-list-sub-showmore").show()
                            $(".cdss-chDrugRecommend-list-sub-hidemore").hide()
                        })


                        $('.cdss-chDrugRecommend-drug-header-icon').off('click').on('click', function() {
                            var drugID = $(this).attr('drugID')
                            var drugName = $(this).attr('drugName')
                            var mdData = {
                                event: "常用中草药方详情查看",
                                page: "疾病诊疗详情页",
                                pageElement: "常用中草药说明书图标",
                                operation1: drugName
                            }
                            _that.REC(mdData)
                            _that.getChDrugInfo({ drugID: drugID, drugType: 'ch_medicine', drugName: drugName }) // 中草药


                        })
                    } else {
                        $('.cdss-drug-list-most-module-chDrugRecommend').hide()
                    }
                } else {
                    if (res.retCode == '-100010') { // 未授权
                        if (isDrugConflict == false) {
                            _that.treatNum++
                        }
                    }
                }
                _that.showNoPrescription()
            }
        })
    }

    // 常用中成药推荐 isDrugConflict true: false: 是详情的
    _that.getChPatentDrugRecommend = function(info, isDrugConflict) {
            if (isDrugConflict == undefined) {
                isDrugConflict = true
                $('.cdss-drug-list-most-module-chPatentDrugRecommend').hide()
            } else {
                $('.cdss-disease-module-chPatentDrugRecommend').hide()
                    // $('.cdss-drug-list-most-module-chPatentDrugRecommend').hide()
            }
            if (_that.tabShow == 2) { return }
            return $.ajax({
                url: baseURL + '/decision/post/chPatentDrugRecommend',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(info),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(res) {
                    if (res.retCode == '999999' && res.data) {

                        if (res.data.length && res.data[0].recommendDrug && res.data[0].recommendDrug.length) { // 常用中草药方推荐
                            var str = ''
                            var prescriptionUses = res.data[0].recommendDrug

                            function prescriptionUsesFun(i) {
                                var item = prescriptionUses[i]
                                str += '<div class="cdss-chPatentDrugRecommend-item">'
                                str += '<div class="cdss-chPatentDrugRecommend-drug-header">' +
                                    item.name
                                    // zt
                                if (item.hasInfo) {
                                    str += '<img class="cdss-chPatentDrugRecommend-drug-header-icon"  drugID="' + item.id + '" drugName="' + item.name + '" src="' + webBaseURL + '/image/icon_diseasedetail.png" />'
                                }



                                if (_that.alwaysAddIcon) {
                                    str += '<span class="cdss-chPatentDrugRecommend-common-drug-list-add">' +
                                        '<img src="' + webBaseURL + '/image/icon_add_prescriptions.png" drugName="' + item.name + '" indication="' + item.indication + '" class="cdss-chPatentDrugRecommend-common-drug-list-add-btn" />' +
                                        '</span>'
                                }
                                str += '</div>'
                                str += '<div>' + item.indication + '</div>'
                                str += '</div>'
                            }
                            for (var i = 0; i < prescriptionUses.length; i++) {
                                if (i < 3) {
                                    prescriptionUsesFun(i)
                                }
                            }
                            if (prescriptionUses.length > 1) {
                                for (var i = 0; i < prescriptionUses.length; i++) {
                                    str += '<div class="cdss-chPatentDrugRecommend-list-sub-morelist">'
                                    if (i >= 3) {
                                        prescriptionUsesFun(i)
                                    }
                                    str += '</div>'
                                }
                                str += '<div class="cdss-chPatentDrugRecommend-list-sub-showmore">更多' +
                                    '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                    '</div>' +
                                    '<div class="cdss-chPatentDrugRecommend-list-sub-hidemore">隐藏' +
                                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                    '</div>'
                            }
                            if (isDrugConflict) {
                                $('.cdss-drug-list-most-chPatentDrugRecommend-list-wrap').empty().html(str)
                                $('.cdss-drug-list-most-module-chPatentDrugRecommend').show()
                                $(".cdss-prescription-detail-wrap").show()
                                $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                                    $(".cdss-prescription-detail-wrap").hide()
                                })
                            } else {
                                $('.cdss-disease-chPatentDrugRecommend-list-wrap').empty().html(str)
                                $('.cdss-disease-module-chPatentDrugRecommend').show()
                                _that.shouldShowWrap = true
                            }

                            deleteBorder()

                            $('.cdss-chPatentDrugRecommend-common-drug-list-add-btn').off('click').on('click', function() {
                                    var data = {
                                        drugName: $(this).attr('drugName'),
                                        describe: $(this).attr('indication'),
                                    }

                                    var result = {
                                        writeType: 4,
                                        data: [data]
                                    }
                                    if (getWriteBack) {
                                        _that.toast('回写成功')
                                        getWriteBack(result)
                                    }
                                    var mdData = {
                                        event: "中成药的回写",
                                        page: "疾病诊疗详情页",
                                        pageElement: "常用中成药添加图标",
                                        operation1: data.drugName
                                    }
                                    _that.REC(mdData)
                                    _that.acceptCommonlyUsedDrug(data.drugName)
                                })
                                // 显示隐藏
                            $(".cdss-chPatentDrugRecommend-list-sub-showmore").off("click").on("click", function() {
                                $(".cdss-chPatentDrugRecommend-list-sub-morelist").show()
                                $(".cdss-chPatentDrugRecommend-list-sub-hidemore").show()
                                $(".cdss-chPatentDrugRecommend-list-sub-showmore").hide()
                            })
                            $(".cdss-chPatentDrugRecommend-list-sub-hidemore").off("click").on("click", function() {
                                $(".cdss-chPatentDrugRecommend-list-sub-morelist").hide()
                                $(".cdss-chPatentDrugRecommend-list-sub-showmore").show()
                                $(".cdss-chPatentDrugRecommend-list-sub-hidemore").hide()
                            })

                            $('.cdss-chPatentDrugRecommend-drug-header-icon').off('click').on('click', function() {
                                var drugName = $(this).attr('drugName')
                                var mdData = {
                                    event: "常用中成药详情查看",
                                    page: "疾病诊疗详情页",
                                    pageElement: "常用中成药说明书图标",
                                    operation1: drugName
                                }
                                _that.REC(mdData)
                                _that.getMedicalInfo({ type: 'drug', keyword: drugName })
                            })
                        } else {
                            $('.cdss-drug-list-most-module-chPatentDrugRecommend').hide()
                        }
                    } else {
                        if (res.retCode == '-100010') { // 未授权
                            if (isDrugConflict == false) {
                                _that.treatNum++
                            }
                        }
                    }
                    _that.showNoPrescription()
                }
            })
        }
        //根据返回值生成具体疾病详情弹窗
    _that.generateDiseaseDetailWrap = function(detailObj) {
            //处理导航信息
            var navStr = ''
            for (var nav in detailObj) {
                if (nav && detailObj[nav] && nav !== '药物详细列表') {
                    navStr += '<div class="cdss-disease-list-nav-list" id="">' +
                        nav +
                        '</div>'
                }
            }
            navStr += '<div class="cdss-disease-list-nave-qrimg"><img src="' + webBaseURL + '/image/qrcode.png" /><span>扫码关注Askbob医生站</span></div>'
            $('.cdss-disease-relevant-tabs-content-nav').empty().append(navStr)
            $(".cdss-disease-list-nav-list").eq(0).addClass("active")
                //处理具体信息
            var detailStr = ''
            for (var title in detailObj) {
                if (detailObj[title] && title !== '药物详细列表') {
                    detailStr += '<div class="cdss-disease-list-ctn-title" id="nav-tit-' + title + '">' +
                        title +
                        '</div>' +
                        '<div class="cdss-disease-info-description" id="">'

                    if (Object.prototype.toString.call(detailObj[title]) == '[object Array]') {
                        // for(var j=0;j<detailObj[title].length;j++){
                        //     detailStr += '<p style="padding-left:20px;">'+ detailObj[title][j]+'</p>'
                        // }
                        var para = detailObj[title]
                            // var title = key
                        if (typeof para[0] == 'string') {
                            for (var io = 0; io < para.length; io++) {
                                detailStr += '<p class="cdss-left-bottom-item-top">' + para[io] + '</p>'
                            }
                        } else {
                            if (para[0]['name']) {
                                for (var m = 0; m < para.length; m++) {
                                    detailStr += '<p class="cdss-left-bottom-item-top" key="' + para[m]['key'] + '">' + para[m]['name'] + '</p>'
                                }
                            } else {
                                for (var n = 0; n < para.length; n++) {
                                    var title = ''
                                    var content = ''
                                    for (var key in para[n]) {
                                        title = key
                                        content = para[n][key] //arr
                                    }
                                    detailStr += '<p class="cdss-left-bottom-item-top">' + title + '</p>'
                                    for (var p = 0; p < content.length; p++) {
                                        if (typeof content[0] == 'string') {
                                            detailStr += '<p >' + content[p] + '</p>'
                                        } else if (Object.prototype.toString.call(content[p]) == '[object Object]') {
                                            var titles = ''
                                            var contents = ''
                                            for (var key in content[p]) {
                                                titles = key
                                                contents = content[p][key] //arr
                                                detailStr += '<p>' + titles + '</p>'
                                                for (var i = 0; i < contents.length; i++) {
                                                    detailStr += '<p>' + contents[i] + '</p>'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (Object.prototype.toString.call(detailObj[title]) == '[object Object]') {
                        var tempObj = detailObj[title]
                        for (var tit in tempObj) {
                            if (Object.prototype.toString.call(tempObj[tit]) == '[object String]') {
                                if (tit) {
                                    detailStr += '<p class="tit-p">' + tit + ':' + '</p>' +
                                        '<p >' + tempObj[tit] + '</p>'
                                } else {
                                    detailStr += '<p>' + tempObj[tit] + '</p>'
                                }
                            } else if (Object.prototype.toString.call(tempObj[tit]) == '[object Array]') {
                                if (tit) {
                                    detailStr += '<p class="tit-p">' + tit + ':' + '</p>'
                                }
                                for (var k = 0; k < tempObj[tit].length; k++) {
                                    detailStr += '<p>' + tempObj[tit][k] + '</p>'
                                }
                            } else if (Object.prototype.toString.call(tempObj[tit]) == '[object Object]') {
                                if (tit) {
                                    detailStr += '<p class="tit-p">' + tit + ':' + '</p>'
                                }
                                var obj = tempObj[tit]
                                for (var key in obj) {
                                    detailStr += '<p style="padding-left:40px;padding-bottom:4px;">' + key + ':' + '</p>'
                                    for (var len = 0; len < obj[key].length; len++) {
                                        detailStr += '<p style="padding-left:40px;padding-bottom:4px;">' + obj[key][len] + '</p>'
                                    }
                                }
                            }
                        }
                    } else if (Object.prototype.toString.call(detailObj[title]) == '[object String]') {
                        detailStr += '<p>' + detailObj[title] + '</p>'
                    }

                    detailStr += '</div>'
                }

            }
            $('.cdss-disease-relevant-tabs-content-info').scrollTop(0)
            $('.cdss-disease-relevant-tabs-content-info').empty().append(detailStr)

            //右边导航按钮点击跳转逻辑
            $(".cdss-disease-list-nav-list").off('click').on('click', function() {
                $(".cdss-disease-list-nav-list").removeClass("active")
                $(this).addClass('active')
                var text = $(this).text()
                var arr = $('.cdss-disease-list-ctn-title')
                for (var i = 0; i < arr.length; i++) {
                    if (arr.eq(i).text() == text) {
                        var id = arr.eq(i).attr('id')
                        if (document.body.scrollIntoView) {
                            document.querySelector("#" + id).scrollIntoView(true)
                        }
                    }
                }
            })
            _that.getDrugHeight()
        }
        //根据疾病名称判断是否支持该疾病
    _that.checkDiseaseSupport = function(disease, type, Index) {
            if (!_that.hasPower || _that.tabShow == 2) { return }
            if (!Index) { Index = 0 }
            if (type != 'detail') { // 非详情的调用 即默认是处方信息处方
                type = 'prescription'
                $('.cdss-advice-header-module').show()
                if (disease && disease.length > 1) { // 医嘱页面的展示多个诊断tab
                    $('.cdss-advice-disease-active img').show()
                    var html = ''
                    for (var i = 0; i < disease.length; i++) {
                        if (i == Index) {
                            html += '<li class="active" index=' + i + '>' + disease[i] + '</li>'
                        } else {
                            html += '<li index=' + i + '>' + disease[i] + '</li>'
                        }
                    }
                    $('.cdss-advice-disease-active span').empty().html(disease[Index])
                    $('.cdss-advice-disease-list').empty().html(html)
                        //   $('.cdss-prescription-detail-close').hide()
                    $('.cdss-advice-disease-list li').off('click').on('click', function() {
                        var text = $(this).text()
                        var indexs = $(this).attr('index')
                        $('.cdss-advice-disease-list li').removeClass('active')
                        $(this).addClass('active')
                        console.log(text)
                        $('.cdss-advice-disease-active span').empty().html(text)
                        $('.cdss-advice-header-tab').hide()
                            //用药冲突常用处方、常用药物
                        var Info = {
                            diseaseName: text,
                            offset: 0,
                            pageSize: 50,
                            hospitalId: _that.hospitalId, //医院号
                            hospitalName: _that.hospitalName, //医院名称
                            belongCity: _that.belongCity, //城市
                            physicianId: _that.physicianId, //医生号
                            physicianName: _that.physicianName, //医生姓名
                            patientId: _that.patientId, //患者号
                            name: _that.name, //患者姓名
                            outerSerialNo: _that.outerSerialNo, //流水号
                            age: _that.age || 40,
                            gender: _that.gender
                        }
                        _that.getCommonPrescription(Info, true)
                        _that.checkDiseaseSupport(disease, 'prescription', indexs)

                    })
                    $('.cdss-advice-header-module').on('mouseover', function() {
                        $('.cdss-advice-header-tab').show()
                    })
                    $('.cdss-advice-header-module').on('mouseleave', function() {
                        $('.cdss-advice-header-tab').hide()
                    })
                } else if (disease && disease.length == 1) {
                    $('.cdss-advice-disease-active img').hide()
                    $('.cdss-advice-disease-active span').empty().html(disease[0])
                } else {
                    $('.cdss-advice-header-module').hide()
                }
                $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                    $(".cdss-prescription-detail-wrap").hide()
                })
            }

            var data = {
                decision: disease,
                hospitalId: _that.hospitalId, //医院号
                hospitalName: _that.hospitalName, //医院名称
                belongCity: _that.belongCity, //城市
                physicianId: _that.physicianId, //医生号
                physicianName: _that.physicianName, //医生姓名
                patientId: _that.patientId, //患者号
                name: _that.name, //患者姓名
                outerSerialNo: _that.outerSerialNo, //流水号
                age: _that.age || '40',
                gender: _that.gender || '女',
            }
            var result = {
                isSupport: 1, //0:支持；1.不支持
                ruleId: [],
                diseaseNames: [],
                hospitalId: _that.hospitalId, //医院号
                hospitalName: _that.hospitalName, //医院名称
                belongCity: _that.belongCity, //城市
                physicianId: _that.physicianId, //医生号
                physicianName: _that.physicianName, //医生姓名
                patientId: _that.patientId, //患者号
                name: _that.name, //患者姓名
                outerSerialNo: _that.outerSerialNo, //流水号
                age: _that.age,
                gender: _that.gender
            }
            data.hospitalDepartment = _that.hospitalDepartment
            data.hospitalDepartmentId = _that.hospitalDepartmentId
            return $.ajax({
                url: baseURL + '/common/post/isSupport',
                type: 'post',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        if (resData.data) {
                            if (resData.data.length > 0) {
                                var treatBtnShow = false
                                $.each(resData.data, function(index, el) {
                                    if (el.term == disease[Index]) {
                                        treatBtnShow = true
                                    }
                                    if (el.disease == disease[Index]) {
                                        treatBtnShow = true
                                    }
                                    if (el.ruleId == 'CVD' && (disease[Index].indexOf('高血压') > -1 || disease[Index].indexOf('糖尿病') > -1)) {
                                        treatBtnShow = true
                                    }
                                })
                                console.log('treatBtnShow', treatBtnShow)
                                if (type && type == 'prescription') { // 处方信息触发的 检查 是否支持精准用药推荐按钮
                                    if (treatBtnShow) {
                                        $('#cdss-prescription-treat-btn').show() // 显示精准用药推荐按钮
                                    } else {
                                        $('#cdss-prescription-treat-btn').hide() // 隐藏精准治疗按钮
                                    }
                                    deleteBorder()
                                    $(".cdss-prescription-detail-wrap").show()
                                    $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                                        $(".cdss-prescription-detail-wrap").hide()
                                    })
                                    $('#cdss-prescription-treat-btn .cdss-treat-ctn').on('click', function() {
                                        $('#cdss-treatment-questionwrap').show()
                                        $('#cdss-bg').show()
                                    })
                                } else {
                                    if (treatBtnShow) {
                                        $('#cdss-treat-btn').show() // 显示精准治疗按钮
                                    } else {
                                        $('#cdss-treat-btn').hide() // 隐藏精准治疗按钮
                                    }
                                    $(".cdss-disease-detail-name").text(disease[Index || 0])
                                    $(".cdss-disease-detail-wrap").show()
                                    deleteBorder()
                                    $('#cdss-treat-btn .cdss-treat-ctn').on('click', function() {
                                        $("#cdss-treatment-questionwrap .cdss-drug-quest-ctn").show()
                                        $("#cdss-treatment-questionwrap .cdss-drug-quest-btnwrap").show()
                                        $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").hide()
                                        $("#cdss-treatment-questionwrap .cdss-drug-recommend-btnwrap").hide()
                                        $('#cdss-treatment-questionwrap').show()
                                        $('#cdss-bg').show()
                                    })
                                }
                                // result.isSupport=0
                                result.isSupport = 1
                                    //内部调用问卷
                                var patientInfo = {
                                    name: result.name, //病人姓名
                                    gender: result.gender, //性别,男1，女0
                                    age: result.age, //年龄
                                    height: _that.height, //身高
                                    weight: _that.weight, //体重
                                    sbp: _that.SBP, //收缩压
                                    dbp: _that.DBP, //舒张压
                                    smoker: _that.smoker || '', //吸烟,吸烟1，不吸烟0
                                    hbA1c: _that.hbA1c || '', //糖化血红蛋白
                                    fpg: _that.fpg || '', //空腹血糖
                                    glu: _that.glu || '', //随机血糖
                                    k: _that.k || '', //血钾
                                    scr: _that.scr || '', //血清肌酐
                                    tc: _that.tc || '', //总胆固醇
                                    hdl_c: _that.hdl_c || '', //高密度脂蛋白胆固醇
                                    ldl_c: _that.ldl_c || '', //低密度脂蛋白胆固醇
                                    tg: _that.tg || '' //甘油三酯
                                }
                                var ruleId = []
                                    // for(var i=0;i<resData.data.length;i++){
                                    //     ruleId.push(resData.data[i].ruleId)
                                    // }
                                $.each(resData.data, function(index, el) {
                                    if (el.term == disease[Index]) {
                                        ruleId = [el.ruleId]
                                    }
                                    if (el.disease == disease[Index]) {
                                        ruleId = [el.ruleId]
                                    }
                                    if (el.ruleId == 'CVD' && (disease[Index].indexOf('高血压') > -1 || disease[Index].indexOf('糖尿病') > -1)) {
                                        ruleId = [el.ruleId]
                                    }
                                })
                                var survdata = {
                                    ruleId: ruleId,
                                    diseaseNames: disease[0],
                                    patientInfo: patientInfo,
                                    type: type
                                }
                                _that.createTreatPanel(survdata)
                            } else {
                                result.isSupport = 1
                                $('#cdss-treat-btn').hide()
                                if (type && type == 'prescription') { // 处方信息触发的 检查 是否支持精准用药推荐按钮
                                    $('#cdss-prescription-treat-btn').hide() // 显示精准用药推荐按钮
                                }
                            }
                            for (var i = 0; i < resData.data.length; i++) {
                                result.ruleId.push(resData.data[i].ruleId);
                                result.diseaseNames.push(resData.data[i].term ? resData.data[i].term : resData.data[i].ruleId)
                            }
                        } else {
                            console.warn("是否支持疾病接口返回空值")
                            if (type && type == 'prescription') { // 处方信息触发的 检查 是否支持精准用药推荐按钮
                                $('#cdss-prescription-treat-btn').hide() // 显示精准用药推荐按钮
                            }
                        }
                        _that.showNoPrescription()
                    } else {
                        console.log("是否支持疾病接口调用失败")
                        if (type == 'detail') {
                            _that.treatNum++
                        }
                    }
                },
                error: function() {
                    console.log("是否支持疾病接口调用失败")
                        // $("#cdss-drug-rec-pill").hide()
                        // $("#cdss-mini-survey-wrap").hide()
                }
            })
        }
        // 检验检查推荐
    _that.checkRecommend = function(diseaseName) {
            $('.cdss-checkRecommend-model').hide()
            return $.ajax({
                url: baseURL + '/decision/post/checkRecommend?diseaseName=' + diseaseName,
                type: 'get',
                contentType: 'application/json',
                dataType: 'json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    if (resData.retCode == '999999') {
                        if (resData.data) {
                            //检验检查
                            if (resData.data && resData.data.length > 0) {
                                var testList = [] //检验列表
                                var inspectList = [] //检查列表
                                for (var l = 0; l < resData.data.length; l++) {
                                    if (resData.data[l].ischeck == 0) {
                                        testList.push(resData.data[l])
                                    } else if (resData.data[l].ischeck == 1) {
                                        inspectList.push(resData.data[l])
                                    }
                                }

                                var diaglist = ''

                                var list = []
                                if (testList.length) {
                                    testList[0]['isfirst'] = true
                                }
                                if (inspectList.length) {
                                    inspectList[0]['isfirst'] = true
                                }
                                list = testList.concat(inspectList)
                                console.log(list)
                                diaglist += '<div class="cdss-disease-diag-test">'
                                diaglist += '<div class="cdss-disease-test-right">'
                                $.each(list, function(index, item) {
                                    if (index < 2) {
                                        if (item.isfirst) {
                                            var text = item.ischeck == 0 ? "检验" : "检查";
                                            diaglist += '<div class="cdss-disease-test-left"> ' + text + '：</div>'
                                        }
                                        diaglist += '<div class="cdss-disease-test-inspect-name" testCode="' + item.testCode +
                                            '"><span hasInfo="' + item.hasInfo + '" cn="' + item.labtest + '">' + item.labtest +
                                            '<div class="cdss-disease-test-tips">' +
                                            '<div class="cdss-disease-test-triangle"></div>' +
                                            '<div class="cdss-disase-test-tips-ctn">'
                                        diaglist += item.labtest
                                        diaglist += '</div>' +
                                            '</div>' +
                                            '</span>' +
                                            '<img class="cdss-disease-test-icon" cn="' + item.labtest + '" src="' + webBaseURL + '/image/icon_attention_b@2x.png" />'
                                        if (index == 1 && list.length > 2) {
                                            diaglist += '<img class="cdss-disease-test-fold-right" src="' + webBaseURL + '/image/u616.png" />'
                                        }
                                        diaglist += '</div>'
                                    }
                                })
                                if (list.length > 2) {
                                    diaglist += '<div  class="cdss-disease-test-foldwrap-right">'
                                    $.each(list, function(index, item) {
                                        if (index >= 2) {
                                            if (item.isfirst) {
                                                var text = item.ischeck == 0 ? "检验" : "检查";
                                                diaglist += '<div class="cdss-disease-test-left"> ' + text + '：</div>'
                                            }
                                            diaglist += '<div class="cdss-disease-test-inspect-name" testCode="' + item.testCode +
                                                '"><span hasInfo="' + item.hasInfo + '" cn="' + item.labtest + '">' + item.labtest +
                                                '<div class="cdss-disease-test-tips">' +
                                                '<div class="cdss-disease-test-triangle"></div>' +
                                                '<div class="cdss-disase-test-tips-ctn">'
                                            diaglist += item.labtest
                                            diaglist += '</div>' +
                                                '</div>' +
                                                '</span>' +
                                                '<img class="cdss-disease-test-icon" cn="' + item.labtest + '" src="' + webBaseURL + '/image/icon_attention_b@2x.png" />'
                                            if (index == list.length - 1) {
                                                diaglist += '<img class="cdss-disease-test-icon-img-right"  src="' + webBaseURL + '/image/icon_fold.png" />'
                                            }
                                            diaglist += '</div>'
                                        }
                                    })
                                    diaglist += '</div>'
                                }
                                diaglist += '</div>'
                                diaglist += '</div>'
                                if (inspectList.length == 0 && testList.length == 0) {
                                    return
                                }
                                $('.cdss-checkRecommend-ctn-model').empty().html(diaglist)
                                $('.cdss-checkRecommend-model').show()
                                    //疾病提示信息


                                $(".cdss-disease-test-icon").off("click").on("click", function() {
                                        var text = $(this).attr('cn')
                                        var mdData = {
                                            event: "详情页检验检查回写",
                                            page: "疾病诊疗详情页",
                                            pageElement: "检验检查项目名称",
                                            operation1: text
                                        }
                                        _that.REC(mdData)
                                    })
                                    //展开折叠检验检查列表
                                $('.cdss-disease-test-fold-right').off('click').on('click', function() {

                                    $(this).parent().parent().find('.cdss-disease-test-foldwrap-right').show()
                                    $(this).parent().parent().find('.cdss-disease-test-icon-img-right').show()
                                    $(this).hide()

                                })

                                $('.cdss-disease-test-fold-left').off('click').on('click', function() {
                                    $(this).parent().parent().find('.cdss-disease-test-foldwrap-left').show()
                                    $(this).parent().parent().find('.cdss-disease-test-icon-img-left').show()
                                    $(this).hide()
                                    $(this).parent().parent().parent().siblings().find('.cdss-disease-test-foldwrap-right').show()

                                })


                                $(".cdss-disease-test-icon-img-right").off('click').on('click', function() {
                                    $(this).hide()
                                    $('.cdss-disease-test-fold-right').show()
                                    $(this).parent().parent().hide()


                                })

                                $(".cdss-disease-test-icon-img-left").off('click').on('click', function() {
                                    $(this).hide()
                                    $(this).parent().parent().parent().children().eq(0).find('.cdss-disease-test-fold-left').show()
                                    $(this).parent().parent().hide()
                                    $(this).parent().parent().parent().parent().siblings().find('.cdss-disease-test-foldwrap-right').hide()
                                })
                                $('.cdss-disease-test-inspect-name span').off('click').on('click', function() {
                                    var name = $(this).parent().find('span').attr('cn')
                                    var code = $(this).parent().attr('testcode')
                                    var hasinfo = $(this).parent().find('span').attr('hasInfo')
                                    if (hasinfo === 'true') {
                                        var mdData = {
                                            event: "详情页的检验检查详情查看",
                                            page: "疾病诊疗详情页",
                                            pageElement: "检验检查详情图标",
                                            operation1: name
                                        }
                                        _that.REC(mdData)
                                        _that.getMedicalInfo({ keyword: name, key: code, type: 'check', source: 'diagnosis_list' })
                                    }

                                })
                            } else {

                            }
                        }
                    } else {
                        console.log("是否支持疾病接口调用失败")
                        _that.treatNum++
                    }

                },
                error: function() {
                    console.log("是否支持疾病接口调用失败")
                        // $("#cdss-drug-rec-pill").hide()
                        // $("#cdss-mini-survey-wrap").hide()
                }
            })
        }
        //创建用药推荐问卷面板
    _that.createTreatPanel = function(mutipleData) {
        var ruleId = mutipleData.ruleId
        var patientInfo = mutipleData.patientInfo
        var diseaseNames = mutipleData.diseaseNames
        if (mutipleData.type == 'detail') {
            mutipleData.type = 'support_diagnosis' // 精准用药：诊疗
        } else {
            mutipleData.type = 'support_prescription' // 精准用药：处方信息
        }
        var data = {
            diseaseTypes: [],
            hospitalId: _that.hospitalId, //医院号
            hospitalName: _that.hospitalName, //医院名称
            belongCity: _that.belongCity, //城市
            physicianId: _that.physicianId, //医生号
            physicianName: _that.physicianName, //医生姓名
            patientId: _that.patientId, //患者号
            name: _that.name, //患者姓名
            outerSerialNo: _that.outerSerialNo, //流水号
            age: _that.age,
            gender: _that.gender
        }
        data.diseaseTypes = ruleId

        $.ajax({
            url: baseURL + '/common/post/getSurvey',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
                request.setRequestHeader('source', mutipleData.type)
            },
            success: function(resData) {
                if (resData.retCode == '999999' && resData.data['questions'] && resData.data['questions'].length > 0) {
                    var questions = resData.data['questions'];
                    //调用内部生成问卷和自动填入方法
                    _that.createQuestionListAndAutoFixin(questions, patientInfo)

                    //查看方案按钮功能
                    $("#cdss-quest-viewprogram").off("click").on("click", function() {
                        $("#cdss-treatment-questionwrap .cdss-input-item-grid").find(".cdss-quest-item-inputwrap").find("input").removeClass("cdss-input-error")
                        var tempAge = ''
                        for (var i = 0; i < $("#cdss-treatment-questionwrap .cdss-input-item-grid").length; i++) {
                            if ($("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(i).find("span").eq(0).text().indexOf("年龄") >= 0) {
                                tempAge = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(i).find("input").eq(0).val()
                            }
                        }
                        var tempGender = ''
                        for (var j = 0; j < $(".cdss-input-item-radio-grid").length; j++) {
                            if ($(".cdss-input-item-radio-grid").eq(j).find("span").eq(0).text().indexOf("性别") >= 0) {
                                tempGender = $(".cdss-input-item-radio-grid").eq(j).find(".cdss-quest-item-radio.active").attr("value") == "1" ? "男" : "女"
                            }
                        }

                        //处理kvList
                        var kvList = []
                            //step1 处理输入框
                        for (var k = 0; k < $("#cdss-treatment-questionwrap .cdss-input-item-grid").length; k++) {
                            var key = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).attr("id").split(".")[$("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).attr("id").split(".").length - 1]
                            var value = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).find(".cdss-quest-item-inputwrap").find("input")[0].value ? $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).find(".cdss-quest-item-inputwrap").find("input")[0].value : 0
                            if (parseFloat(value)) { //AI要求空值不传
                                if (parseFloat(value) >= 0) {
                                    if (value.indexOf(".") < 0) {
                                        var obj = {}
                                        obj['key'] = key
                                        obj['value'] = parseFloat(value)
                                        kvList.push(obj)
                                    } else if (value.indexOf(".") > 0 && value.split(".")[1].length < 3) {
                                        var obj = {}
                                        obj['key'] = key
                                        obj['value'] = parseFloat(value)
                                        kvList.push(obj)
                                    } else {
                                        $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).find(".cdss-quest-item-inputwrap").find("input").addClass("cdss-input-error")
                                        if (document.body.scrollIntoView) {
                                            document.querySelector(".cdss-quest-item-inputwrap")[k].scrollIntoView()
                                        }
                                        return
                                    }
                                } else {
                                    $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(k).find(".cdss-quest-item-inputwrap").find("input").addClass("cdss-input-error")
                                    if (document.body.scrollIntoView) {
                                        document.querySelector(".cdss-quest-item-inputwrap")[k].scrollIntoView()
                                    }
                                    return
                                }
                            }
                        }
                        //step2 处理radio
                        for (var m = 0; m < $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid").length; m++) {
                            var activeRadioDom = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid").eq(m).find(".cdss-quest-item-radio-inputwrap").find(".cdss-quest-item-radio").hasClass("active")
                            if (!!activeRadioDom) {
                                var key = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid").eq(m).attr("id").split(".")[$("#cdss-treatment-questionwrap .cdss-input-item-radio-grid").eq(m).attr("id").split(".").length - 1]
                                var value = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid").eq(m).find(".cdss-quest-item-radio-inputwrap").find(".cdss-quest-item-radio.active").attr("value")
                                var obj = {}
                                obj['key'] = key
                                obj['value'] = parseInt(value)
                                kvList.push(obj)
                            }

                        }
                        //step3 处理checkbox
                        var checkboxDomArr = $("#cdss-treatment-questionwrap .cdss-quest-item-content").has(".cdss-input-item-check-grid")
                        for (var n = 0; n < checkboxDomArr.length; n++) {
                            for (var k = 0; k < checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").length; k++) {
                                var value = ""
                                var key = checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").eq(k).attr("id").split(".")
                                var len = key.length - 1
                                var id = key[len]
                                for (var s = 0; s < checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").eq(k).find(".cdss-input-item-check-grid").length; s++) {
                                    value += checkboxDomArr.eq(n).find(".cdss-quest-drug-history-wrap").eq(k).find(".cdss-input-item-check-grid").eq(s).find(".cdss-quest-checkbox").hasClass("active") ? "1" : "0"
                                }
                                var obj = {}
                                obj['key'] = id
                                obj['value'] = value
                                kvList.push(obj)
                            }
                        }
                        var drugRecommendStr = ""
                        var searchStr = location.search
                        if (searchStr && searchStr.indexOf("pre") >= 0) {
                            drugRecommendStr = searchStr.split("?pre=")[1]
                        }
                        //step4 校验必填字段及值范围
                        for (var n = 0; n < $("#cdss-treatment-questionwrap .cdss-input-item-grid").length; n++) {
                            if ($("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).find(".cdss-quest-item-inputwrap").find("input").attr('requiredq')) {
                                var required_value = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).find(".cdss-quest-item-inputwrap").find("input")[0].value
                                var required_left = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).find(".cdss-quest-item-inputwrap").find("input").attr('rangeleft')
                                var required_right = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).find(".cdss-quest-item-inputwrap").find("input").attr('rangeright')
                                var required_text = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).find(".cdss-input-item-requied").text()
                                var pure_text = required_text.substring(1).substring(0, required_text.length - 2)
                                var isshow = $("#cdss-treatment-questionwrap .cdss-input-item-grid").eq(n).css("display") != 'none'
                                if (!required_value && isshow) {
                                    _that.showCdssAlert('必填字段' + pure_text + '不能为空！')
                                    return
                                }
                                if (required_left && required_right) {
                                    if (parseFloat(required_value) < parseFloat(required_left) || parseFloat(required_value) > parseFloat(required_right)) {
                                        _that.showCdssAlert('必填字段' + pure_text + '超出范围！(' + required_left + ' - ' + required_right + ')')
                                        return
                                    }
                                }
                            }
                        }

                        var reqData = {
                                age: tempAge || patientInfo.age,
                                diseaseTypes: ruleId,
                                diseaseNames: [diseaseNames],
                                gender: tempGender || _that.gender || patientInfo.gender,
                                hospital: '',
                                kvList: kvList,
                                drugRecommendCode: drugRecommendStr,
                                hospitalId: _that.hospitalId, //医院号
                                hospitalName: _that.hospitalName, //医院名称
                                belongCity: _that.belongCity, //城市
                                physicianId: _that.physicianId, //医生号
                                physicianName: _that.physicianName, //医生姓名
                                patientId: _that.patientId, //患者号
                                name: _that.name, //患者姓名
                                outerSerialNo: _that.outerSerialNo, //流水号
                                hospitalDepartment: _that.hospitalDepartment,
                                hospitalDepartmentId: _that.hospitalDepartmentId,
                            }
                            // console.log(reqData)
                        $.ajax({
                            url: baseURL + '/decision/post/drugRecommend',
                            type: 'post',
                            data: JSON.stringify(reqData),
                            // data:dt,
                            contentType: 'application/json',
                            dataType: 'json',
                            scriptCharset: 'utf-8',
                            beforeSend: function(request) {
                                request.setRequestHeader('Content-Type', 'application/json')
                                request.setRequestHeader('channel-id', channelId)
                                request.setRequestHeader('institution-id', institutionId)
                                $(".cdss-drug-recommend-loading").show()
                            },
                            success: function(resData) {
                                $(".cdss-drug-recommend-loading").hide()
                                $(".cdss-drug-recommed-ctn").empty()
                                if (resData.retCode == "999999") {
                                    //防止AI某个字段突然为null，多加几层判断
                                    if (resData.data) {
                                        if (resData.data.aiResponse) {
                                            if (resData.data.aiResponse.jointDecision) {
                                                var emptyNotes = resData.data.aiResponse.jointDecision.notes
                                                if (emptyNotes) {
                                                    _that.showCdssAlert(emptyNotes)
                                                    return
                                                }
                                                var drugRecommendCode = resData.data.drugRecommendCode
                                                    //app内置方法===========
                                                var drugrecCodeObj = {
                                                    drugRecommendCode: drugRecommendCode
                                                }
                                                try {
                                                    CEFAPI.trigger('DrugRecommendCodeEvent', JSON.stringify(drugrecCodeObj))
                                                } catch (error) {}
                                                //转诊逻辑提示框
                                                if (resData.data.aiResponse.jointDecision.referralDecisions && resData.data.aiResponse.jointDecision.referralDecisions.length > 0) {
                                                    $("#cdss-warn-tipsWrap span").text(resData.data.aiResponse.jointDecision.referralDecisions[0].referralNotes)
                                                    $("#cdss-warn-tipsWrap").show()
                                                    setTimeout(function() { $("#cdss-warn-tipsWrap").hide() }, 10000)
                                                }

                                                // $("#cdss-treatment-questionwrap .cdss-title .cdss-recdrug-tit").text("用药推荐方案")
                                                $("#cdss-treatment-questionwrap .cdss-drug-quest-ctn").hide()
                                                $("#cdss-treatment-questionwrap .cdss-drug-quest-btnwrap").hide()
                                                $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").show()
                                                $("#cdss-treatment-questionwrap .cdss-drug-recommend-btnwrap").show()

                                                //转诊操作DOM========@additional DOM
                                                if (resData.data.aiResponse.jointDecision.referral) {
                                                    var referDom = '<div class="cdss-drug-recommend-referwrap">' +
                                                        '<div class="cdss-drug-recommend-refer">建议转诊</div>'
                                                    if (resData.data.aiResponse.jointDecision.referralDecisions && resData.data.aiResponse.jointDecision.referralDecisions.length > 0) {
                                                        referDom += '<div class="cdss-drug-recommedn-refer-ctn">' + resData.data.aiResponse.jointDecision.referralDecisions[0].referralNotes + '</div>'
                                                    }
                                                    referDom += '</div>'
                                                    $(".cdss-drug-recommed-ctn").append(referDom)
                                                }
                                                //风险等级评估DOM========@additional DOM
                                                if (resData.data.aiResponse.jointDecision.riskPredictions && resData.data.aiResponse.jointDecision.riskPredictions.length > 0) {
                                                    var riskEmuStr = '<div class="cdss-drug-recommend-program-title">' +
                                                        '风险评估' +
                                                        '</div>'
                                                    for (var i = 0; i < resData.data.aiResponse.jointDecision.riskPredictions.length; i++) {
                                                        var level = resData.data.aiResponse.jointDecision.riskPredictions[i].level
                                                        if (level == '已患') {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl4">'
                                                        } else if (level == '疑似') {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl0">'
                                                        } else if (level == '极高危' || level == "极高风险") {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl0">'
                                                        } else if (level == '高危' || level == "高风险") {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl1">'
                                                        } else if (level == '中危' || level == "中风险") {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl2">'
                                                        } else if (level == '低危' || level == '低风险') {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-tip lvl3">'
                                                        }
                                                        riskEmuStr += '<div class="cdss-drug-recommend-ascvd-title">' +
                                                            resData.data.aiResponse.jointDecision.riskPredictions[i].riskName +
                                                            '</div>'
                                                        if (resData.data.aiResponse.jointDecision.riskPredictions[i].description) {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-msg">' +
                                                                resData.data.aiResponse.jointDecision.riskPredictions[i].description +
                                                                '</div>'
                                                        }
                                                        for (var j = 0; j < resData.data.aiResponse.jointDecision.riskPredictions[i].risks.length; j++) {
                                                            riskEmuStr += '<div class="cdss-drug-recommend-ascvd-msg">' +
                                                                resData.data.aiResponse.jointDecision.riskPredictions[i].risks[j].riskModel +
                                                                '评分：' +
                                                                resData.data.aiResponse.jointDecision.riskPredictions[i].risks[j].score
                                                            if (resData.data.aiResponse.jointDecision.riskPredictions[i].risks[j].description) {
                                                                riskEmuStr += '<div class="cdss-drug-recommend-ascvd-info"><img class="cdss-radio-tips-img" src="' +
                                                                    webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-recommend-ascvd-info-tips">' +
                                                                    resData.data.aiResponse.jointDecision.riskPredictions[i].risks[j].description + '</div></div>'
                                                            }
                                                            riskEmuStr += '</div>'
                                                        }
                                                        riskEmuStr += '<div class="cdss-drug-recommend-ascvd-btn">' + resData.data.aiResponse.jointDecision.riskPredictions[i].level + '</div>' +
                                                            '</div>'
                                                    }
                                                    $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").append(riskEmuStr)
                                                }
                                                //治疗方案公用头部
                                                if ((resData.data.aiResponse.jointDecision.decision && resData.data.aiResponse.jointDecision.decision.length > 0) || (resData.data.aiResponse.jointDecision.therapyDecisions && resData.data.aiResponse.jointDecision.therapyDecisions.length > 0)) {
                                                    var drugProgStr = '<div class="cdss-drug-recommend-program-title">' +
                                                        '治疗方案' +
                                                        '</div>' +
                                                        '<div class="cdss-drug-recommend-program">' +
                                                        '<div id="cdss-recommend">' +
                                                        '</div>' +
                                                        '</div>'
                                                    $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").append(drugProgStr)
                                                }
                                                //用药推荐总体列表数组（结合decision和therapy decision）
                                                var data = []
                                                    //治疗方案DOM======用药推荐处方内容逻辑（decision字段）
                                                if (resData.data.aiResponse.jointDecision.decision && resData.data.aiResponse.jointDecision.decision.length > 0) {
                                                    var data1 = resData.data.aiResponse.jointDecision.decision
                                                    _that.buildDrugRecommendRecipe(data1)
                                                    data = data.concat(data1)
                                                }
                                                //治疗方案DOM========@additional DOM（therapyDecisions字段）
                                                if (resData.data.aiResponse.jointDecision.therapyDecisions && resData.data.aiResponse.jointDecision.therapyDecisions.length > 0) {
                                                    var data2 = resData.data.aiResponse.jointDecision.therapyDecisions
                                                    _that.buildDrugRecommendRecipe(data2)
                                                    data = data.concat(data2)
                                                }
                                                //切换治疗方案(治疗方案都在therapyDecisions内)
                                                $("#cdss-recommend .cdss-drug-rec-treatproposal").on("change", function() {
                                                        var trDrugObj = {}
                                                        var curvalue = $(this).val()
                                                        for (var i = 0; i < data.length; i++) {
                                                            if (data[i].subTherDecision && data[i].subTherDecision.length > 0) {
                                                                for (var j = 0; j < data[i].subTherDecision.length; j++) {
                                                                    if (data[i].subTherDecision[j].category == curvalue) {
                                                                        trDrugObj = data[i].subTherDecision[j]
                                                                        break
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        // console.log(trDrugObj)
                                                        //处理下一个td内的用药方案
                                                        if (trDrugObj.decisionOption && trDrugObj.decisionOption.length > 0) {
                                                            var newDrugDom = '<span>用药方案</span><select class="cdss-drug-rec-drugproposal">'
                                                            for (var j = 0; j < trDrugObj.decisionOption.length; j++) {
                                                                newDrugDom += '<option value="' + trDrugObj.decisionOption[j].therapy +
                                                                    '" title="' + trDrugObj.decisionOption[j].therapy +
                                                                    '" therapyType="' + trDrugObj.decisionOption[j].therapyType + '" index="' + j + '">' + trDrugObj.decisionOption[j].therapy + '</option>'
                                                            }
                                                            newDrugDom += '</select>'
                                                                //notes内容
                                                            if (trDrugObj.decisionOption[0].therapyNotes && trDrugObj.decisionOption[0].therapyNotes.split(";")[0]) {
                                                                newDrugDom += '<span class="cdss-drug-rec-info active"><img class="cdss-radio-tips-img" src="' +
                                                                    webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                                                                    trDrugObj.decisionOption[0].therapyNotes.split(";")[0] + '</div></span>'
                                                            } else {
                                                                newDrugDom += '<span class="cdss-drug-rec-info"><img class="cdss-radio-tips-img" src="' +
                                                                    webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                                                                    trDrugObj.decisionOption[0].therapyNotes + '</div></span>'
                                                            }
                                                            if (trDrugObj.decisionOption[0].therapyNotes) {
                                                                newDrugDom += '<span class="cdss-drug-rec-info-all">' + trDrugObj.decisionOption[0].therapyNotes + '</span>'
                                                            } else {
                                                                newDrugDom += '<span class="cdss-drug-rec-info-all"></span>'
                                                            }
                                                            if (trDrugObj.decisionOption[0].hasEvicence) {
                                                                newDrugDom += '<span id="' + trDrugObj.ruleId + '" class="cdss-drug-recommend-xunzheng">查看循证</span>'
                                                            }
                                                        }
                                                        $(this).parent().next().empty().append(newDrugDom)
                                                            //处理切换后的tbody内容
                                                        var newListDom = ''
                                                        if (trDrugObj.decisionOption && trDrugObj.decisionOption.length > 0) {
                                                            if (trDrugObj.decisionOption[0].drugUnion && trDrugObj.decisionOption[0].drugUnion.length > 0 && trDrugObj.decisionOption[0].drugUnion[0].drugInfo && trDrugObj.decisionOption[0].drugUnion[0].drugInfo.length > 0) {
                                                                for (var t = 0; t < trDrugObj.decisionOption[0].drugUnion.length; t++) {
                                                                    newListDom += '<tr>' +
                                                                        '<td>' +
                                                                        '<span class="active">' +
                                                                        '<img src="' + webBaseURL + '/image/checkbox.png" class="cdss-drug-rec-thrary-true" />' +
                                                                        '<img src="' + webBaseURL + '/image/checkbox1.png" class="cdss-drug-rec-thrary-false" />' +
                                                                        trDrugObj.decisionOption[0].drugUnion[t].therapy +
                                                                        '</span>' +
                                                                        '</td>' +
                                                                        '<td>' +
                                                                        '<select class="cdss-select-drugunion">'
                                                                    for (var k = 0; k < trDrugObj.decisionOption[0].drugUnion[t].drugInfo.length; k++) {
                                                                        newListDom += '<option value="' + trDrugObj.decisionOption[0].drugUnion[t].drugInfo[k].genericName +
                                                                            '" title="' + trDrugObj.decisionOption[0].drugUnion[t].drugInfo[k].genericName +
                                                                            '">' + trDrugObj.decisionOption[0].drugUnion[t].drugInfo[k].genericName + '</option>'
                                                                    }
                                                                    newListDom += '</select></td><td><select class="cdss-select-druginfo">'

                                                                    var noStock = false
                                                                    for (var z = 0; z < trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping.length; z++) {
                                                                        if (trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[z].stock != 0) {
                                                                            noStock = true
                                                                        }
                                                                    }
                                                                    if (!noStock) {
                                                                        newListDom += '<option stock="0">暂无库存</option>'
                                                                    }

                                                                    for (var n = 0; n < trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping.length; n++) {
                                                                        if (rDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock)
                                                                            var stock = trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock
                                                                        if (stock == 0) {
                                                                            newListDom += '<option value="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" title="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" dosage="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].dosage +
                                                                                '" unit="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].unit +
                                                                                '" frequency="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].frequency +
                                                                                '" spec="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].spec +
                                                                                '" id="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].id +
                                                                                '" drugName="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" stock="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock +
                                                                                '" taboo="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].taboo +
                                                                                '" manufacturer="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].manufacturer +
                                                                                '" disabled>' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '</option>'
                                                                        } else {
                                                                            newListDom += '<option value="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" title="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" dosage="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].dosage +
                                                                                '" unit="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].unit +
                                                                                '" frequency="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].frequency +
                                                                                '" spec="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].spec +
                                                                                '" id="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].id +
                                                                                '" drugName="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '" stock="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock +
                                                                                '" taboo="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].taboo +
                                                                                '" manufacturer="' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].manufacturer +
                                                                                '">' + trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                                                                '</option>'
                                                                        }

                                                                    }
                                                                    newListDom += '</select>'
                                                                    var ggstr = ''
                                                                    var csstr = ''
                                                                    var gg = trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[0].spec
                                                                    var cs = trDrugObj.decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[0].manufacturer
                                                                    if (!gg || gg == 'null' || gg == 'undefined') {
                                                                        ggstr = '无'
                                                                    } else {
                                                                        ggstr = gg
                                                                    }
                                                                    if (!cs || cs == 'null' || cs == 'undefined') {
                                                                        csstr = '无'
                                                                    } else {
                                                                        csstr = cs
                                                                    }

                                                                    // if(!_that.nodruginfo){
                                                                    //   tableStr+='<span class="cdss-drug-detail-info-notes">规格：'+ggstr+' 厂商：3'+ csstr +'</span>'
                                                                    // }else{
                                                                    //     tableStr+='<span class="cdss-drug-detail-info-notes">规格：'+ggstr+'</span>'
                                                                    // }
                                                                    // tableStr+= '</td>'
                                                                    newListDom += '</td>'
                                                                    newListDom += '<td><span class="cdss-drug-detail-info-specs">规格：' + ggstr + '</span></td>'
                                                                    if (!_that.nodruginfo) {
                                                                        newListDom += '<td><span class="cdss-drug-detail-info-notes-nodruginfo">厂商：' + csstr + '</span></td>'
                                                                    }

                                                                    newListDom += '</tr>'
                                                                }

                                                            }
                                                        } else {
                                                            newListDom += '<tr><td colspan="3">' + trDrugObj.therapy + '</td><span>'
                                                        }
                                                        $(this).parent().parent().parent().next().empty().append(newListDom)
                                                            //对药品库存stock进行处理
                                                        for (var j = 0; j < $("#cdss-recommend tbody tr").length; j++) {
                                                            var stock = $("#cdss-recommend tbody tr").eq(j).find("select.cdss-select-druginfo option:selected").attr("stock")
                                                            if (stock == 1) {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").addClass("active")
                                                            } else {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").removeClass("active")
                                                            }
                                                        }
                                                    })
                                                    //切换用药方案
                                                $("#cdss-recommend").on("change", ".cdss-drug-rec-drugproposal", function() {
                                                        var trDrugObj = {}
                                                        var curvalue = $(this).val()
                                                            //tips notes logic
                                                        var totalTipsText = $(this).siblings().eq(2).text()
                                                        var index = $(this).find("option:selected").prop('index')
                                                        var currentTipsText = totalTipsText.split(";")[index]
                                                        if (currentTipsText) {
                                                            $(this).siblings().eq(1).find(".cdss-drug-rec-info-tips").empty().text(currentTipsText)
                                                            $(this).siblings().eq(1).addClass("active")
                                                        } else {
                                                            $(this).siblings().eq(1).removeClass("active")
                                                        }

                                                        for (var i = 0; i < data.length; i++) {
                                                            //decision字段
                                                            if (data[i].decisionOption && data[i].decisionOption.length > 0) {
                                                                for (var j = 0; j < data[i].decisionOption.length; j++) {
                                                                    if (data[i].decisionOption[j].therapy == curvalue) {
                                                                        trDrugObj = data[i].decisionOption[j]
                                                                        break
                                                                    }
                                                                }
                                                                //therapyDecisions字段
                                                            } else if (data[i].subTherDecision && data[i].subTherDecision.length > 0) {
                                                                for (var k = 0; k < data[i].subTherDecision.length; k++) {
                                                                    for (var m = 0; m < data[i].subTherDecision[k].decisionOption.length; m++) {
                                                                        if (data[i].subTherDecision[k].decisionOption[m].therapy == curvalue) {
                                                                            trDrugObj = data[i].subTherDecision[k].decisionOption[m]
                                                                            break
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                console.error('切换用药方案出错！')
                                                            }
                                                        }
                                                        // console.log(trDrugObj)
                                                        //生成相邻的tbody用药列表
                                                        var newListDom = ''
                                                        if (trDrugObj.drugUnion && trDrugObj.drugUnion.length > 0 && trDrugObj.drugUnion[0].drugInfo && trDrugObj.drugUnion[0].drugInfo.length > 0) {
                                                            for (var t = 0; t < trDrugObj.drugUnion.length; t++) {
                                                                newListDom += '<tr>' +
                                                                    '<td>' +
                                                                    '<span class="active">' +
                                                                    '<img src="' + webBaseURL + '/image/checkbox.png" class="cdss-drug-rec-thrary-true" />' +
                                                                    '<img src="' + webBaseURL + '/image/checkbox1.png" class="cdss-drug-rec-thrary-false" />' +
                                                                    trDrugObj.drugUnion[t].therapy +
                                                                    '</span>' +
                                                                    '</td>' +
                                                                    '<td>' +
                                                                    '<select class="cdss-select-drugunion">'
                                                                for (var k = 0; k < trDrugObj.drugUnion[t].drugInfo.length; k++) {
                                                                    newListDom += '<option value="' + trDrugObj.drugUnion[t].drugInfo[k].genericName +
                                                                        '" title="' + trDrugObj.drugUnion[t].drugInfo[k].genericName +
                                                                        '">' + trDrugObj.drugUnion[t].drugInfo[k].genericName + '</option>'
                                                                }
                                                                newListDom += '</select></td><td><select class="cdss-select-druginfo">'
                                                                var noStock = false
                                                                for (var z = 0; z < trDrugObj.drugUnion[t].drugInfo[0].drugMapping.length; z++) {
                                                                    if (trDrugObj.drugUnion[t].drugInfo[0].drugMapping[z].stock != 0) {
                                                                        noStock = true
                                                                    }
                                                                }
                                                                if (!noStock) {
                                                                    newListDom += '<option stock="0">暂无库存</option>'
                                                                }
                                                                for (var n = 0; n < trDrugObj.drugUnion[t].drugInfo[0].drugMapping.length; n++) {
                                                                    var stock = trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].stock
                                                                    if (stock == 0) {
                                                                        newListDom += '<option value="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" title="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" dosage="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].dosage +
                                                                            '" unit="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].unit +
                                                                            '" frequency="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].frequency +
                                                                            '" spec="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].spec +
                                                                            '" id="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].id +
                                                                            '" drugName="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" stock="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].stock +
                                                                            '" taboo="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].taboo +
                                                                            '" manufacturer="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].manufacturer +
                                                                            '" disabled>' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '</option>'
                                                                    } else {
                                                                        newListDom += '<option value="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" title="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" dosage="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].dosage +
                                                                            '" unit="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].unit +
                                                                            '" frequency="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].frequency +
                                                                            '" spec="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].spec +
                                                                            '" id="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].id +
                                                                            '" drugName="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '" stock="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].stock +
                                                                            '" taboo="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].taboo +
                                                                            '" manufacturer="' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].manufacturer +
                                                                            '">' + trDrugObj.drugUnion[t].drugInfo[0].drugMapping[n].drugName +
                                                                            '</option>'
                                                                    }

                                                                }
                                                                newListDom += '</select>'
                                                                var ggstr = ''
                                                                var csstr = ''
                                                                var gg = trDrugObj.drugUnion[t].drugInfo[0].drugMapping[0].spec
                                                                var cs = trDrugObj.drugUnion[t].drugInfo[0].drugMapping[0].manufacturer
                                                                if (!gg || gg == 'null' || gg == 'undefined') {
                                                                    ggstr = '无'
                                                                } else {
                                                                    ggstr = gg
                                                                }
                                                                if (!cs || cs == 'null' || cs == 'undefined') {
                                                                    csstr = '无'
                                                                } else {
                                                                    csstr = cs
                                                                }
                                                                newListDom += '</td>'
                                                                newListDom += '<td><span class="cdss-drug-detail-info-specs">规格：' + ggstr + '</span></td>'
                                                                if (!_that.nodruginfo) {
                                                                    newListDom += '<td><span class="cdss-drug-detail-info-notes-nodruginfo">厂商：' + csstr + '</span></td>'
                                                                }
                                                                newListDom += '</tr>'
                                                            }

                                                        }
                                                        $(this).parent().parent().parent().next().empty().append(newListDom)
                                                            //对药品库存stock进行处理
                                                        for (var j = 0; j < $("#cdss-recommend tbody tr").length; j++) {
                                                            var stock = $("#cdss-recommend tbody tr").eq(j).find("select.cdss-select-druginfo option:selected").attr("stock")
                                                            if (stock == 1) {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").addClass("active")
                                                            } else {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").removeClass("active")
                                                            }
                                                        }
                                                    })
                                                    //用药大类切换
                                                $("#cdss-recommend").on("change", ".cdss-select-drugunion", function() {
                                                        var curvalue = $(this).val()
                                                        var drugObj = {}
                                                        for (var i = 0; i < data.length; i++) {
                                                            //decision字段
                                                            if (data[i].decisionOption && data[i].decisionOption.length > 0) {
                                                                for (var j = 0; j < data[i].decisionOption.length; j++) {
                                                                    for (var k = 0; k < data[i].decisionOption[j].drugUnion.length; k++) {
                                                                        for (var m = 0; m < data[i].decisionOption[j].drugUnion[k].drugInfo.length; m++) {
                                                                            if (data[i].decisionOption[j].drugUnion[k].drugInfo[m].genericName == curvalue) {
                                                                                drugObj = data[i].decisionOption[j].drugUnion[k].drugInfo[m].drugMapping
                                                                                break
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                //therapyDecisions字段
                                                            } else if (data[i].subTherDecision && data[i].subTherDecision.length > 0) {
                                                                for (var k = 0; k < data[i].subTherDecision.length; k++) {
                                                                    for (var m = 0; m < data[i].subTherDecision[k].decisionOption.length; m++) {
                                                                        for (var n = 0; n < data[i].subTherDecision[k].decisionOption[m].decisionOption.length; n++) {
                                                                            for (var s = 0; s < data[i].subTherDecision[k].decisionOption[m].decisionOption[n].drugUnion.length; s++) {
                                                                                for (var p = 0; p < data[i].subTherDecision[k].decisionOption[m].decisionOption[n].drugUnion[s].drugInfo.length; p++) {
                                                                                    if (data[i].subTherDecision[k].decisionOption[m].decisionOption[n].drugUnion[s].drugInfo[p].genericName == curvalue) {
                                                                                        drugObj = data[i].subTherDecision[k].decisionOption[m].decisionOption[n].drugUnion[s].drugInfo[p].drugMapping
                                                                                        break
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                console.error('切换用药大类出错！')
                                                            }
                                                        }
                                                        // console.log(drugObj)
                                                        var drugStr = '<select name="" id="" class="cdss-select-druginfo">'
                                                        var noStock = false
                                                        for (var z = 0; z < drugObj.length; z++) {
                                                            if (drugObj[z].stock != 0) {
                                                                noStock = true
                                                            }
                                                        }
                                                        if (!noStock) {
                                                            drugStr += '<option stock="0">暂无库存</option>'
                                                        }
                                                        for (var m = 0; m < drugObj.length; m++) {
                                                            var stock = drugObj[m].stock
                                                            if (stock == 0) {
                                                                drugStr += '<option value="' + drugObj[m].drugName +
                                                                    '" title="' + drugObj[m].drugName +
                                                                    '" dosage="' + drugObj[m].dosage +
                                                                    '" unit="' + drugObj[m].unit +
                                                                    '" frequency="' + drugObj[m].frequency +
                                                                    '" spec="' + drugObj[m].spec +
                                                                    '" id="' + drugObj[m].id +
                                                                    '" drugName="' + drugObj[m].drugName +
                                                                    '" stock="' + drugObj[m].stock +
                                                                    '" taboo="' + drugObj[m].taboo +
                                                                    '" manufacturer="' + drugObj[m].manufacturer +
                                                                    '" disabled>' + drugObj[m].drugName + '</option>'
                                                            } else {
                                                                drugStr += '<option value="' + drugObj[m].drugName +
                                                                    '" title="' + drugObj[m].drugName +
                                                                    '" dosage="' + drugObj[m].dosage +
                                                                    '" unit="' + drugObj[m].unit +
                                                                    '" frequency="' + drugObj[m].frequency +
                                                                    '" spec="' + drugObj[m].spec +
                                                                    '" id="' + drugObj[m].id +
                                                                    '" drugName="' + drugObj[m].drugName +
                                                                    '" stock="' + drugObj[m].stock +
                                                                    '" taboo="' + drugObj[m].taboo +
                                                                    '" manufacturer="' + drugObj[m].manufacturer +
                                                                    '">' + drugObj[m].drugName + '</option>'
                                                            }

                                                        }
                                                        drugStr += '</select>'
                                                        var ggstr = ''
                                                        var csstr = ''
                                                        var gg = drugObj[0].spec
                                                        var cs = drugObj[0].manufacturer
                                                        if (!gg || gg == 'null' || gg == 'undefined') {
                                                            ggstr = '无'
                                                        } else {
                                                            ggstr = gg
                                                        }
                                                        if (!cs || cs == 'null' || cs == 'undefined') {
                                                            csstr = '无'
                                                        } else {
                                                            csstr = cs
                                                        }

                                                        var Next = '<span class="cdss-drug-detail-info-specs">规格：' + ggstr + '</span></<span>'
                                                        $(this).parent().next().empty().append(drugStr)
                                                        $(this).parent().next().next().empty().append(Next)
                                                        if (!_that.nodruginfo) {
                                                            var Next2 = '<span class="cdss-drug-detail-info-notes-nodruginfo">厂商：' + csstr + '</span></<span>'
                                                            $(this).parent().next().next().next().empty().append(Next2)
                                                        }
                                                        //对药品库存stock进行处理
                                                        for (var j = 0; j < $("#cdss-recommend tbody tr").length; j++) {
                                                            var stock = $("#cdss-recommend tbody tr").eq(j).find("select.cdss-select-druginfo option:selected").attr("stock")
                                                            if (stock == 1) {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").addClass("active")
                                                            } else {
                                                                $("#cdss-recommend tbody tr").eq(j).find("span").removeClass("active")
                                                            }
                                                        }
                                                    })
                                                    //切换具体药品(更新库存，更新药品厂商规格信息)
                                                $("#cdss-recommend").on("change", ".cdss-select-druginfo", function() {
                                                        var stock = $(this).find("option:selected").attr("stock")
                                                        if (stock == 1) {
                                                            $(this).parent().parent().parent().find('td').eq(0).find('span').addClass("active")
                                                        } else {
                                                            $(this).parent().parent().parent().find('td').eq(0).find('span').removeClass("active")
                                                        }
                                                        var manufacturer = $(this).find("option:selected").attr("manufacturer")
                                                        var spec = $(this).find("option:selected").attr("spec")
                                                        var ggstr = ''
                                                        var csstr = ''
                                                        if (!spec || spec == 'null' || spec == 'undefined') {
                                                            ggstr = '无'
                                                        } else {
                                                            ggstr = spec
                                                        }
                                                        if (!manufacturer || manufacturer == 'null' || manufacturer == 'undefined') {
                                                            csstr = '无'
                                                        } else {
                                                            csstr = manufacturer
                                                        }
                                                        var noteStr = '规格：' + ggstr + ' ' + '厂商：' + csstr
                                                        var noteStr1 = '规格：' + ggstr
                                                        if (!_that.nodruginfo) {
                                                            $(this).parent().nextAll().find(".cdss-drug-detail-info-notes-nodruginfo").empty().text('厂商：' + csstr)
                                                            $(this).parent().nextAll().find(".cdss-drug-detail-info-specs").empty().text(noteStr1)
                                                        } else {
                                                            $(this).parent().nextAll().find(".cdss-drug-detail-info-specs").empty().text(noteStr1)
                                                        }
                                                    })
                                                    //生活方式DOM========@additional DOM
                                                if (resData.data.aiResponse.jointDecision.lifestyleDecisions && resData.data.aiResponse.jointDecision.lifestyleDecisions.length > 0) {
                                                    var lifeStyleDom = '<div class="cdss-drug-recommend-program-title">生活方式</div>' +
                                                        '<div class="cdss-drug-recommend-program"><table><thead><tr><td>' +
                                                        resData.data.aiResponse.jointDecision.lifestyleDecisions[0].category + '</td></tr></thead><tbody>'
                                                    for (var i = 0; i < resData.data.aiResponse.jointDecision.lifestyleDecisions.length; i++) {
                                                        lifeStyleDom += '<tr><td>' + resData.data.aiResponse.jointDecision.lifestyleDecisions[i].lifestyle + '</td></tr>'
                                                    }
                                                    lifeStyleDom += '</tbody></table></div>'
                                                    $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").append(lifeStyleDom)
                                                }
                                                //随访方案DOM========@additional DOM
                                                if (resData.data.aiResponse.jointDecision.followUpDecisions && resData.data.aiResponse.jointDecision.followUpDecisions.length > 0) {
                                                    var followUpDom = '<div class="cdss-drug-recommend-program-title">随访方案</div>' +
                                                        '<div class="cdss-drug-recommend-program"><table><thead><tr><td>' +
                                                        resData.data.aiResponse.jointDecision.followUpDecisions[0].category + '</td></tr></thead><tbody>'
                                                    for (var i = 0; i < resData.data.aiResponse.jointDecision.followUpDecisions.length; i++) {
                                                        followUpDom += '<tr><td>' + resData.data.aiResponse.jointDecision.followUpDecisions[i].followUp + '</td></tr>'
                                                    }
                                                    followUpDom += '</tbody></table></div>'
                                                    $("#cdss-treatment-questionwrap .cdss-drug-recommed-ctn").append(followUpDom)
                                                }
                                                //最终采用方案
                                                $("#cdss-drug-recommend-adopt").off("click").on("click", function() {
                                                    //首先判断是否没有选择处方或者处方列表长度为0
                                                    var selectedDrugList = $("#cdss-recommend tbody tr td:first-child span.active").parent().parent()
                                                    var hasDrugList = $("#cdss-recommend tbody tr td:first-child span").length > 0
                                                    if (selectedDrugList.length <= 0 && hasDrugList) {
                                                        _that.showCdssAlert("未选择药品！")
                                                            // return
                                                    }
                                                    //处理保存处方数据，依据已选择的方案
                                                    var submitData = {
                                                        drugRecommendCode: drugRecommendCode,
                                                        recipeList: [],
                                                        hospitalId: _that.hospitalId, //医院号
                                                        hospitalName: _that.hospitalName, //医院名称
                                                        belongCity: _that.belongCity, //城市
                                                        physicianId: _that.physicianId, //医生号
                                                        physicianName: _that.physicianName, //医生姓名
                                                        patientId: _that.patientId, //患者号
                                                        name: _that.name, //患者姓名
                                                        outerSerialNo: _that.outerSerialNo, //流水号
                                                        age: _that.age,
                                                        gender: _that.gender
                                                    }
                                                    var tempTbody = $("#cdss-recommend tbody tr td:first-child span.active").parent().parent().parent()
                                                    for (var i = 0; i < tempTbody.length; i++) {
                                                        var recipeObj = {}
                                                        recipeObj.category = tempTbody.eq(i).prev().find("tr td").eq(0).text()
                                                        recipeObj.ruleId = tempTbody.eq(i).prev().find("tr td").eq(1).find("select").attr("id")
                                                        recipeObj.therapy = tempTbody.eq(i).prev().find("tr td").eq(1).find("select").val()
                                                        recipeObj.recipeDetails = []
                                                        var tempTr = tempTbody.eq(i).find("tr td:first-child span.active").parent().parent()
                                                        for (var j = 0; j < tempTr.length; j++) {
                                                            var recipeDetailObj = {}
                                                            recipeDetailObj.drugClass = tempTr.eq(j).find("td").eq(0).find("span").text()
                                                            recipeDetailObj.genericName = tempTr.eq(j).find("td").eq(1).find("select").val()
                                                            recipeDetailObj.drugName = tempTr.eq(j).find("td").eq(2).find("select").val()
                                                            recipeDetailObj.drugId = tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("id") ? tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("id") : ""
                                                            recipeDetailObj.dosage = tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("dosage") ? tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("dosage") : ""
                                                            recipeDetailObj.unit = tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("unit") ? tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("unit") : ""
                                                            recipeDetailObj.frequency = tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("frequency") ? tempTr.eq(j).find("td").eq(2).find("select").find('option:selected').attr("frequency") : ""
                                                            recipeObj.recipeDetails.push(recipeDetailObj)
                                                        }
                                                        submitData.recipeList.push(recipeObj)
                                                    }
                                                    $.ajax({
                                                        url: baseURL + '/common/post/saveRecipe',
                                                        type: 'post',
                                                        contentType: 'application/json;',
                                                        scriptCharset: 'utf-8',
                                                        dataType: 'json',
                                                        data: JSON.stringify(submitData),
                                                        beforeSend: function(request) {
                                                            request.setRequestHeader('Content-Type', 'application/json')
                                                            request.setRequestHeader('channel-id', channelId)
                                                            request.setRequestHeader('institution-id', institutionId)
                                                        },
                                                        success: function(result) {
                                                            if (result.retCode == '999999') {
                                                                // $("#cdss-treatment-questionwrap .cdss-title .cdss-recdrug-tit").text("用药推荐")
                                                                $(".cdss-drug-quest-ctn").show()
                                                                $(".cdss-drug-quest-btnwrap").show()
                                                                $(".cdss-drug-recommed-ctn").hide()
                                                                $(".cdss-drug-recommend-btnwrap").hide()
                                                                $("#cdss-bg").hide()
                                                                $("#cdss-treatment-questionwrap").hide()
                                                                console.log("用药推荐保存成功")
                                                                var recipeList = submitData.recipeList
                                                                var writeArr = []
                                                                console.log(recipeList)
                                                                if (recipeList && recipeList.length) {
                                                                    for (var i = 0; i < recipeList.length; i++) {
                                                                        var recipeDetails = recipeList[i].recipeDetails
                                                                        console.log(recipeDetails)
                                                                        if (recipeDetails && recipeDetails.length) {
                                                                            for (var j = 0; j < recipeDetails.length; j++) {
                                                                                var obj = {
                                                                                    drugName: recipeDetails[j].drugName, // 药品名称
                                                                                    freq: recipeDetails[j].frequency, // 
                                                                                    dose: recipeDetails[j].dosage, // 用量
                                                                                    id: recipeDetails[j].id, // ID
                                                                                    manufacturer: recipeDetails[j].manufacturer, // 厂商
                                                                                    spec: recipeDetails[j].spec, // 规格
                                                                                    unit: recipeDetails[j].unit, // 单位
                                                                                }
                                                                                writeArr.push(obj)
                                                                            }
                                                                        }
                                                                    }
                                                                }

                                                                var result = {
                                                                    writeType: 4,
                                                                    data: writeArr
                                                                }
                                                                if (getWriteBack) {
                                                                    _that.toast('回写成功')
                                                                    getWriteBack(result)
                                                                }

                                                                _that.createRecipeTable && _that.createRecipeTable(submitData)
                                                                    //安卓端自定义方法
                                                                _that.drugRecommendComplete && _that.drugRecommendComplete(true)
                                                            } else {
                                                                console.log("用药推荐保存失败")
                                                            }
                                                        }
                                                    })

                                                })

                                                //查看评估报告
                                                if (!resData.data.aiResponse.jointDecision.riskReport) {
                                                    $("#cdss-drug-recommend-report").hide()
                                                } else {
                                                    $("#cdss-drug-recommend-report").show()
                                                }
                                                //ascvd内info鼠标tips功能
                                                $(".cdss-drug-recommend-ascvd-info img").on("mouseenter", function() {
                                                    $(this).next().show()
                                                })
                                                $(".cdss-drug-recommend-ascvd-info img").on("mouseleave", function() {
                                                    $(this).next().hide()
                                                })
                                                $("#cdss-drug-recommend-report").off("click").on("click", function() {
                                                    var riskReport = resData.data.aiResponse.jointDecision.riskReport
                                                    if (riskReport) {
                                                        var mdData = {
                                                            event: "精准治疗方案评估报告打开",
                                                            page: "精准治疗页",
                                                            pageElement: "评估报告名称",
                                                            operation1: '动脉粥样硬化性心脑血管疾病风险评估'
                                                        }
                                                        _that.REC(mdData)

                                                        var basicStr = ''
                                                            //基本信息内容
                                                        for (var i = 0; i < riskReport.basicInfo.length; i++) {
                                                            basicStr += '<div class="cdss-report-basic-item">' +
                                                                '<span>' + riskReport.basicInfo[i].name + '：</span>' +
                                                                '<span>' + riskReport.basicInfo[i].val + '</span>' +
                                                                '</div>'
                                                        }
                                                        $(".cdss-report-basic-content").empty().append(basicStr)

                                                        //动脉粥样硬化心脑血管疾病风险评估
                                                        var cvsStr = ''
                                                        var result = {
                                                            assessment: riskReport.assessment,
                                                            heartAgeInfo: riskReport.heartAgeInfo,
                                                            writeText: ''
                                                        }
                                                        result.writeText += '动脉粥样硬化性心脑血管疾病风险评估结果：'
                                                        if (riskReport.assessment && riskReport.assessment.length) {
                                                            cvsStr += '<li>'
                                                            for (var j = 0; j < riskReport.assessment.length; j++) {
                                                                if (riskReport.assessment[j]) {
                                                                    if (j == riskReport.assessment.length - 1) {
                                                                        cvsStr += riskReport.assessment[j]
                                                                    } else {
                                                                        cvsStr += riskReport.assessment[j] + '，'
                                                                    }
                                                                    result.writeText += riskReport.assessment[j].replace(/<.*?>/ig,  "")
                                                                }
                                                            }
                                                            cvsStr += '</li>'
                                                        }

                                                        if (riskReport.heartAgeInfo) {
                                                            cvsStr += '<li>' + riskReport.heartAgeInfo + '</li>'
                                                            result.writeText += riskReport.heartAgeInfo.replace(/<.*?>/ig,  "")

                                                        }
                                                        $(".cdss-report-cvs-ctn-left").empty().append(cvsStr)

                                                        // 精准用药推荐的评估量表回写
                                                        result.writeType = 1
                                                        $('#cdss-report-btn').off('click').on('click', function() {
                                                            var mdData = {
                                                                event: "精准治疗方案评估报告回写",
                                                                page: "精准治疗页",
                                                                pageElement: "回写图标",
                                                                operation1: '动脉粥样硬化性心脑血管疾病风险评估'
                                                            }
                                                            _that.REC(mdData)
                                                            if (getWriteBack) {
                                                                _that.toast('回写' + _that.writeBackName + '成功')
                                                                getWriteBack(result)
                                                            }
                                                        })

                                                        if (riskReport.riskLevel == "0") {
                                                            $(".cdss-report-cvs-ctn-right img").attr("src", webBaseURL + "/image/level-pyramid0.png")
                                                        } else if (riskReport.riskLevel == "1") {
                                                            $(".cdss-report-cvs-ctn-right img").attr("src", webBaseURL + "/image/level-pyramid1.png")
                                                        } else if (riskReport.riskLevel == "2") {
                                                            $(".cdss-report-cvs-ctn-right img").attr("src", webBaseURL + "/image/level-pyramid2.png")
                                                        } else if (riskReport.riskLevel == "3") {
                                                            $(".cdss-report-cvs-ctn-right img").attr("src", webBaseURL + "/image/level-pyramid3.png")
                                                        } else {
                                                            $(".cdss-report-cvs-ctn-right img").attr("src", webBaseURL + "/image/level-pyramid3.png")
                                                        }
                                                        //危险因素及理想目标表格
                                                        var dangerTableStr = ''
                                                        for (var j = 0; j < riskReport.advise.riskRactor.length; j++) {
                                                            dangerTableStr += '<tr>' +
                                                                '<td>' + riskReport.advise.riskRactor[j].factor + '</td>'
                                                            if (riskReport.advise.riskRactor[j].isAbnormal == '1') {
                                                                dangerTableStr += '<td class="cdss-report-td-error">' + riskReport.advise.riskRactor[j].labelResult + '</td>'
                                                            } else {
                                                                dangerTableStr += '<td>' + riskReport.advise.riskRactor[j].labelResult + '</td>'
                                                            }
                                                            dangerTableStr += '<td>' + riskReport.advise.riskRactor[j].ideal + '</td>' +
                                                                '</tr>'
                                                        }
                                                        $("#cdss-report-table tbody").empty().append(dangerTableStr)
                                                            //病史及危险因素
                                                        $(".cdss-report-patient-history").empty().append(riskReport.advise.illhistory)
                                                            //健康处方
                                                        var recipeStr = ''
                                                        for (var k = 0; k < riskReport.advise.healthPrescription.length; k++) {
                                                            recipeStr += '<div>' + riskReport.advise.healthPrescription[k] + '</div>'
                                                        }
                                                        $(".cdss-report-patient-recipe").empty().append(recipeStr)

                                                        $("#cdss-drugrec-report").show();
                                                    } else {
                                                        _that.showCdssAlert("暂无评估报告！")
                                                    }

                                                })
                                            } else {
                                                _that.showCdssAlert("暂无用药推荐")
                                            }
                                        } else {
                                            console.log('aiResponse字段为空')
                                        }
                                    } else {
                                        console.log('data字段值出错')
                                    }
                                } else {
                                    _that.showCdssAlert(resData.retMsg)
                                }
                            },
                            error: function() {
                                $(".cdss-drug-recommend-loading").hide()
                            }
                        })
                    })
                } else {
                    console.log("用药推荐返回结果错误")
                }
            },
            error: function(err) {
                _that.showCdssAlert("网络错误，请稍后尝试！")
            }
        })
    }

    //生成用药方案问卷及自动填入已知病人数据
    _that.createQuestionListAndAutoFixin = function(questions, patientInfo) {
        // console.log(questions)
        // console.log(patientInfo)
        //生成cdss问卷dom
        var domStr = ""
        for (var i = 0; i < questions.length; i++) {
            domStr += '<div class="cdss-drug-quest-module">' +
                '<div class="cdss-drug-quest-title">' +
                '<span class="cdss-drug-quest-titlename">' + questions[i].name + '</span>'
            if (questions[i].name == "ASCVD风险评估") {
                domStr += '<span class="cdss-drug-quest-expand fold">' +
                    '<span class="cdss-zk">展开</span>' +
                    '<span class="cdss-sq">收起</span>' +
                    '<img src="' + webBaseURL + '/image/arrow.png" alt="" class="cdss-arrow-img">' +
                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                    '</span>' +
                    '</div>' +
                    '<div class="cdss-drug-quest-content fold">'
            } else {
                domStr += '<span class="cdss-drug-quest-expand">' +
                    '<span class="cdss-zk">展开</span>' +
                    '<span class="cdss-sq">收起</span>' +
                    '<img src="' + webBaseURL + '/image/arrow.png" alt="" class="cdss-arrow-img">' +
                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                    '</span>' +
                    '</div>' +
                    '<div class="cdss-drug-quest-content">'
            }

            if (questions[i].notes) {
                domStr += '<div class="cdss-quest-ctn-tip">' +
                    '<img src="' + webBaseURL + '/image/warn.png" alt="">' +
                    questions[i].notes +
                    '</div>'
            }
            for (var j = 0; j < questions[i].question.length; j++) {
                domStr += '<div class="cdss-quest-item">' +
                    '<div class="cdss-quest-item-title">' +
                    questions[i].question[j].name +
                    '</div>' +
                    '<div class="cdss-quest-item-content">'

                for (var k = 0; k < questions[i].question[j].question.length; k++) {
                    var entranceStr = ''
                    var questItem = questions[i].question[j].question[k]
                        //andor-operator-qname-value|andor-operator-qname-value
                    if (questItem.entrance && questItem.entrance.length > 0) {
                        for (var e = 0; e < questItem.entrance.length; e++) {
                            var andor = questItem.entrance[e].andor
                            var operator = questItem.entrance[e].operator
                            var qname = questItem.entrance[e].qname
                            var value = questItem.entrance[e].value
                            entranceStr += andor + '-' + operator + '-' + qname + '-' + value + '|'
                        }
                    }
                    //单选radio问题
                    if (questions[i].question[j].question[k].type == "SINGLE_CHOICE") {
                        var visibleshow = questions[i].question[j].question[k].visible ? 'block' : 'none'
                        domStr += '<div class="cdss-input-item-radio-grid" id="' +
                            questions[i].question[j].question[k].name +
                            '" entrance="' + entranceStr + '" visible="' +
                            questions[i].question[j].question[k].visible +
                            '" style="display:' + visibleshow + '" type="SINGLE_CHOICE">'
                        if (questions[i].question[j].question[k].text) {
                            if (questions[i].question[j].question[k].hint) {
                                domStr += '<img class="cdss-radio-tips-img" src="' + webBaseURL + '/image/icon_i.png' +
                                    '" /><div class="cdss-input-item-radio-tips">' +
                                    questions[i].question[j].question[k].hint + '</div>'
                            }
                            if (questions[i].question[j].question[k].required) {
                                domStr += '<span class=""><span class="cdss-red">*</span>' + questions[i].question[j].question[k].text + '：</span>'
                            } else {
                                domStr += '<span>' + questions[i].question[j].question[k].text + '：</span>'
                            }
                        }
                        domStr += '<div class="cdss-quest-item-radio-inputwrap">'
                        for (var m = 0; m < questions[i].question[j].question[k].choice.length; m++) {
                            domStr += '<span class="cdss-quest-item-radio" value="' +
                                questions[i].question[j].question[k].choice[m].value + '" qenabled="' +
                                questions[i].question[j].question[k].choice[m].qenabled + '" renabled="' +
                                questions[i].question[j].question[k].choice[m].renabled + '">' +
                                '<img class="cdss-radio-img-act" src="' + webBaseURL + '/image/radio.png" />' +
                                '<img class="cdss-radio-img-dact" src="' + webBaseURL + '/image/radio1.png" />' +
                                questions[i].question[j].question[k].choice[m].text
                            if (questions[i].question[j].question[k].choice[m].hint) {
                                domStr += '<div class="cdss-input-item-radio-tip-wrap">' +
                                    '<img class="cdss-radio-tips-img" src="' + webBaseURL + '/image/icon_i.png" />' +
                                    '<div class="cdss-input-item-radio-tips">' +
                                    questions[i].question[j].question[k].choice[m].hint +
                                    '</div></div>'
                            }
                            domStr += '</span>'
                        }
                        domStr += '</div></div>'
                            //输入值问题input
                    } else if (questions[i].question[j].question[k].type == "NUMERIC" || questions[i].question[j].question[k].type == "TEXT") {
                        var visibleshow = questions[i].question[j].question[k].visible ? 'block' : 'none'
                        domStr += '<div class="cdss-input-item-grid" id="' +
                            questions[i].question[j].question[k].name +
                            '" entrance="' + entranceStr + '" visible="' +
                            questions[i].question[j].question[k].visible +
                            '" style="display:' + visibleshow + '" type="NUMERIC">'
                        if (questions[i].question[j].question[k].required) {
                            domStr += '<span class=""><span class="cdss-red">*</span>' + questions[i].question[j].question[k].text + '：</span>'
                            domStr += '<div class="cdss-quest-item-inputwrap">'
                            if (questions[i].question[j].question[k].range && questions[i].question[j].question[k].range.length > 0) {
                                domStr += '<input type="text" maxlength="10" rangeleft="' + questions[i].question[j].question[k].range[0].lbound +
                                    '" rangeright="' + questions[i].question[j].question[k].range[0].rbound + '" requiredq=true>' +
                                    '<span class="cdss-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                                domStr += '</div></div>'
                            } else {
                                domStr += '<input type="text" maxlength="10" requiredq=true>' +
                                    '<span class="cdss-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                                domStr += '</div></div>'
                            }
                        } else {
                            domStr += '<span>' + questions[i].question[j].question[k].text + '：</span>'
                            domStr += '<div class="cdss-quest-item-inputwrap">'
                            if (questions[i].question[j].question[k].range && questions[i].question[j].question[k].range.length > 0) {
                                domStr += '<input type="text" maxlength="10" rangeleft="' + questions[i].question[j].question[k].range[0].lbound +
                                    '" rangeright="' + questions[i].question[j].question[k].range[0].rbound + '">' +
                                    '<span class="cdss-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                            } else {
                                domStr += '<input type="text" maxlength="10">' +
                                    '<span class="cdss-input-quest-unit">' + questions[i].question[j].question[k].unit + '</span>'
                            }
                            domStr += '</div></div>'
                        }
                        // 多选checkbox问题
                    } else if (questions[i].question[j].question[k].type == "MULTIPLE_CHOICE") {
                        var visibleshow = questions[i].question[j].question[k].visible ? 'block' : 'none'
                        domStr += '<div class="cdss-quest-drug-history-wrap" id="' +
                            questions[i].question[j].question[k].name +
                            '" entrance="' + entranceStr + '" visible="' +
                            questions[i].question[j].question[k].visible +
                            '" style="display:' + visibleshow + '" type="MULTIPLE_CHOICE">'
                        if (questions[i].question[j].question[k].required) {
                            // domStr+='<div class="cdss-quest-drug-history-title cdss-input-title-required">*'
                            domStr += '<div class="cdss-quest-drug-history-title"><span>*</span>'
                        } else {
                            domStr += '<div class="cdss-quest-drug-history-title">'
                        }

                        domStr += questions[i].question[j].question[k].text +
                            '</div>' +
                            '<div class="cdss-quest-drug-history-ctn">'
                        for (var n = 0; n < questions[i].question[j].question[k].choice.length; n++) {
                            domStr += '<div class="cdss-input-item-check-grid">' +
                                '<div class="cdss-quest-checkbox" value="' +
                                questions[i].question[j].question[k].choice[n].value + '" qenabled="' +
                                questions[i].question[j].question[k].choice[n].qenabled + '" visible="' +
                                questions[i].question[j].question[k].visible + '" id="' +
                                questions[i].question[j].question[k].name + '" renabled="' +
                                questions[i].question[j].question[k].renabled + '">' +
                                '<img class="cdss-checkbox-img-dact" src="' + webBaseURL + '/image/checkbox1.png" />' +
                                '<img class="cdss-checkbox-img-act" src="' + webBaseURL + '/image/checkbox.png" />' +
                                questions[i].question[j].question[k].choice[n].text +
                                '</div>' +
                                '</div>'
                        }
                        domStr += '</div></div>'
                    }
                }
                domStr += '</div></div>'
            }
            domStr += '</div></div>'
        }
        // $("#cdss-drugrec-questionwrap .cdss-drug-quest-ctn").empty().append(domStr)
        $("#cdss-treatment-questionwrap .cdss-drug-quest-ctn").empty().append(domStr)

        //小浮窗业务逻辑
        // var shortDom=$(".cdss-drug-quest-ctn .cdss-quest-item-content")
        // var newBrefDom=shortDom.clone()
        // $(".cdss-mini-drug-rec-wrap").empty().append(newBrefDom)

        //step 1.将所有联动的radio选项输入都隐藏 & 将所有被联动的checkbox隐藏(单个radio选项和单个checkbox)
        var radioQenableArr = $("#cdss-treatment-questionwrap .cdss-quest-item-radio")
        for (var i = 0; i < radioQenableArr.length; i++) {
            var id = radioQenableArr.eq(i).attr("qenabled").split(";")
            for (var j = 0; j < id.length; j++) {
                if (id[j] && (id[j] != "null")) {
                    $("#cdss-treatment-questionwrap [id$='" + id[j] + "']").hide()
                }
            }
        }
        var checkboxWrapArr = $("#cdss-treatment-questionwrap .cdss-quest-checkbox")
        for (var i = 0; i < checkboxWrapArr.length; i++) {
            var id = checkboxWrapArr.eq(i).attr("qenabled").split(";")
            for (var j = 0; j < id.length; j++) {
                if (id[j] && (id[j] != "null")) {
                    $("#cdss-treatment-questionwrap [id$='" + id[j] + "']").hide()
                }
            }
        }
        // v2.3 entrance有值的隐藏
        var entraArr1 = $('#cdss-treatment-questionwrap .cdss-input-item-radio-grid')
        var entraArr2 = $('#cdss-treatment-questionwrap .cdss-input-item-grid')
        var entraArr3 = $('#cdss-treatment-questionwrap .cdss-quest-drug-history-wrap')
        for (var k = 0; k < entraArr1.length; k++) {
            if (entraArr1.eq(k).attr("entrance") && entraArr1.eq(k).attr("entrance").indexOf('|') > 0) {
                entraArr1.eq(k).hide()
            }
        }
        for (var k = 0; k < entraArr2.length; k++) {
            if (entraArr2.eq(k).attr("entrance") && entraArr2.eq(k).attr("entrance").indexOf('|') > 0) {
                entraArr2.eq(k).hide()
            }
        }
        for (var k = 0; k < entraArr3.length; k++) {
            if (entraArr3.eq(k).attr("entrance") && entraArr3.eq(k).attr("entrance").indexOf('|') > 0) {
                entraArr3.eq(k).hide()
            }
        }

        //step 2.设置radio有值的填入(性别/吸烟)
        var radioWrapArr = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid")
        for (var i = 0; i < radioWrapArr.length; i++) {
            var itemlabel = radioWrapArr.eq(i).find('span').eq(0).text()
            if (itemlabel.indexOf('性别') >= 0) {
                radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').removeClass('active')
                if (patientInfo.gender == "1" || patientInfo.gender == "男") {
                    radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(0).addClass('active')
                        //设置默认联动==性别
                    var id = radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(0).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").show()
                        }
                    }
                } else {
                    radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(1).addClass('active')
                        //设置默认联动==性别
                    var id = radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(1).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").show()
                        }
                    }
                }
            }
            if (itemlabel.indexOf('吸烟') >= 0) {
                radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').removeClass('active')
                if (patientInfo.smoker == "1") {
                    radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(0).addClass('active')
                        //设置默认联动==吸烟
                    var id = radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(0).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").show()
                        }
                    }
                } else {
                    radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(1).addClass('active')
                        //设置默认联动==吸烟
                    var id = radioWrapArr.eq(i).find('.cdss-quest-item-radio-inputwrap').eq(0).find('span').eq(1).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").show()
                        }
                    }
                }
            }

        }
        //step 3.设置input有值的填入
        var inputGridArr = $(".cdss-input-item-grid")
        for (var i = 0; i < inputGridArr.length; i++) {
            //由于AI返回的字段没有约定id的name，所以这里只能用汉字indexof处理
            var inputlabel = inputGridArr.eq(i).find('span').eq(0).text()
            if (inputlabel.indexOf("姓名") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.name)
            }
            if (inputlabel.indexOf("年龄") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.age)
            }
            if (inputlabel.indexOf("身高") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.height)
            }
            if (inputlabel.indexOf("体重") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.weight)
            }
            if (inputlabel.indexOf("收缩压") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.sbp)
            }
            if (inputlabel.indexOf("舒张压") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.dbp)
            }
            if (inputlabel.indexOf("糖化血红蛋白") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.hbA1c)
            }
            if (inputlabel.indexOf("空腹血糖") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.fpg)
            }
            if (inputlabel.indexOf("随机血糖") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.glu)
            }
            if (inputlabel.indexOf("血钾") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.k)
            }
            if (inputlabel.indexOf("血清肌酐") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.scr)
            }
            if (inputlabel.indexOf("总胆固醇") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.tc)
            }
            if (inputlabel.indexOf("高密度脂蛋白胆固醇") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.hdl_c)
            }
            if (inputlabel.indexOf("低密度脂蛋白胆固醇") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.ldl_c)
            }
            if (inputlabel.indexOf("甘油三酯") >= 0) {
                inputGridArr.eq(i).find('input').val(patientInfo.tg)
            }
        }
        _that.visibleCtrlFunc()
        _that.survryAutoToDrugRec()

        //展开收起功能
        $(".cdss-drug-quest-expand").off("click").on("click", function() {
                $(this).toggleClass("fold");
                var isHide = $(this).parent().parent().find(".cdss-drug-quest-content").css("display") == 'none';
                if (isHide) {
                    $(this).parent().parent().find(".cdss-drug-quest-content").css({ "display": "block" })
                } else {
                    $(this).parent().parent().find(".cdss-drug-quest-content").css({ "display": "none" })
                }
            })
            //单选radio功能
        $(".cdss-quest-item-radio").off("click").on("click", function() {
                $(this).siblings().removeClass("active")
                $(this).addClass("active")
                    // entrance v2.3联动逻辑 andor-operator-qname-value|andor-operator-qname-value
                    // var entranName=$(this).parent().parent().attr('id')
                    // var entranVal=$(this).attr('value')
                    // var isshow=$(this).parent().parent().css("display")!='none'
                    // console.log(entranName)
                    // console.log(entranVal)
                    // console.log(isshow)
                    //cdss-input-item-radio-grid
                    //cdss-quest-drug-history-wrap

                //renabled v2.2新增字段，此字段为true直接查询用药推荐
                var isRenabled = $(this).attr('renabled').toString()
                if (isRenabled == 'true') {
                    $("#cdss-quest-viewprogram").click()
                    return
                }
                var id = $(this).attr("qenabled").split(";")
                for (var p = 0; p < id.length; p++) {
                    if ((id[p] != "null") && id[p]) {
                        $("#cdss-treatment-questionwrap [id$='" + id[p] + "']").show()
                    }
                }
                var allRadioArr = $(".cdss-quest-item-radio")
                    //step1.将所有被radio联动的菜单隐藏
                for (var i = 0; i < allRadioArr.length; i++) {
                    var id = allRadioArr.eq(i).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").hide()
                        }
                    }
                }
                //step2.复合联动的所有激活才显示
                for (var i = 0; i < allRadioArr.length; i++) {
                    var id = allRadioArr.eq(i).attr("qenabled").split(";")
                    var active = allRadioArr.eq(i).hasClass("active")
                    for (var k = 0; k < id.length; k++) {
                        if (active && (id[k] != "null")) {
                            $("[id$='" + id[k] + "']").show()
                        }
                    }
                }
                _that.visibleCtrlFunc()
                _that.survryAutoToDrugRec()
            })
            //多选checkbox功能
        $(".cdss-quest-checkbox").off("click").on("click", function() {
                $(this).toggleClass("active")
                var id = $(this).parent().attr('id')
                var hasActive = $(this).hasClass('active')
                    // var radioQenableArr=$("#cdss-drugrec-questionwrap .cdss-input-item-radio-grid")
                    // for(var i=0;i<radioQenableArr.length;i++){
                    //     var enteanceStr=radioQenableArr.eq(i).attr('entrance')
                    //     if(enteanceStr.indexOf(id)>0){
                    //         if(hasActive){
                    //             radioQenableArr.eq(i).show()
                    //         }else{
                    //             radioQenableArr.eq(i).hide()
                    //         }
                    //     }
                    // }
                var checkboxQenableArr = $("#cdss-treatment-questionwrap .cdss-quest-checkbox")
                    //step1.将所有被checkbox联动的菜单隐藏
                for (var i = 0; i < checkboxQenableArr.length; i++) {
                    var id = checkboxQenableArr.eq(i).attr("qenabled").split(";")
                    for (var p = 0; p < id.length; p++) {
                        if ((id[p] != "null") && id[p]) {
                            $("[id$='" + id[p] + "']").hide()
                        }
                    }
                }
                //step2.复合联动的所有选项激活才显示
                for (var j = 0; j < checkboxQenableArr.length; j++) {
                    var id = checkboxQenableArr.eq(j).attr("qenabled").split(";")
                    var active = checkboxQenableArr.eq(j).hasClass("active")
                    for (var k = 0; k < id.length; k++) {
                        if (active && (id[k] != "null")) {
                            // var flag=true
                            // for(var s=0;s<checkboxQenableArr.length;s++){
                            //     var allid=checkboxQenableArr.eq(s).attr("qenabled").split(";")
                            //     var singleactive=checkboxQenableArr.eq(s).hasClass("active")
                            //     if(allid.indexOf(id[k])>=0 && !singleactive){
                            //         flag=false
                            //     }
                            // }
                            // if(flag){
                            $("[id$='" + id[k] + "']").show()
                                // }
                        }
                    }
                }

                var isRenabled = $(this).attr('renabled').toString()
                if (isRenabled == 'true') {
                    $("#cdss-quest-viewprogram").click()
                    return
                }
                _that.visibleCtrlFunc()
            })
            //radio tips 逻辑
        $(".cdss-input-item-radio-grid .cdss-radio-tips-img").on("mouseenter", function() {
            $(this).next().show()
        })
        $(".cdss-input-item-radio-grid .cdss-radio-tips-img").on("mouseleave", function() {
            $(this).next().hide()
        })
        $(".cdss-input-item-grid").find(".cdss-quest-item-inputwrap").find("input").on("blur", function() {
            var value = $(this).val()
            if (value && parseFloat(value) < 0) {
                $(this).addClass("cdss-input-error")
            } else if (value && value.indexOf('.') > 0) {
                if (value.split(".")[1].length > 2) {
                    $(this).addClass("cdss-input-error")
                } else {
                    $(this).removeClass("cdss-input-error")
                }
            } else {
                $(this).removeClass("cdss-input-error")
            }
        })
    }

    // entrance联动逻辑
    _that.entranceLogic = function() {
        //entrance绑定节点class字段
        //cdss-input-item-radio-grid
        //cdss-input-item-grid
        //cdss-quest-drug-history-wrap
        var radioArr = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid")
        var inputArr = $("#cdss-treatment-questionwrap .cdss-input-item-grid")
        var checkArr = $("#cdss-treatment-questionwrap .cdss-quest-drug-history-wrap")
        for (var j = 0; j < radioArr.length; j++) {
            var entranStr = radioArr.eq(j).attr('entrance')
            var currentName = radioArr.eq(j).attr('id')
            var conditionArr = entranStr.split('|')
            var pure_cdt = []
            if (!entranStr) {
                continue
            }
            // console.log('entranStr:'+entranStr)
            //null-EQ-K81.9_CHO.type-1|OR-EQ-K81.9_CHO.type-2|AND-EQ-K81.9_CHO.isAcute-1|
            for (var a = 0; a < conditionArr.length; a++) {
                if (conditionArr[a]) {
                    pure_cdt.push(conditionArr[a])
                }
            }
            // console.log(pure_cdt)
            //["null-EQ-K81.9_CHO.type-1", "OR-EQ-K81.9_CHO.type-2", "AND-EQ-K81.9_CHO.isAcute-1"]
            // console.log('===================================')
            // console.log('currentName:'+currentName)

            var shouldShow = false //是否显示当前grid
            if (pure_cdt.length == 0) {
                shouldShow = true
            }

            for (var b = 0; b < pure_cdt.length; b++) {
                var andor = pure_cdt[b].split('-')[0]
                var operator = pure_cdt[b].split('-')[1]
                var qname = pure_cdt[b].split('-')[2]
                var value = pure_cdt[b].split('-')[3]
                    // console.log(andor)
                    // console.log(operator)
                    // console.log(qname)
                    // console.log(value)
                var targetDOM = $('#cdss-treatment-questionwrap').find('div[id^="' + qname + '"]')
                var targetType = targetDOM.attr('type')
                var targetValue
                var targetIsShow = targetDOM.css("display") != 'none'
                if (targetType == 'SINGLE_CHOICE') {
                    targetValue = targetDOM.find('.cdss-quest-item-radio.active').attr("value")
                } else if (targetType == 'NUMERIC') {
                    targetValue = targetDOM.find('input').val()
                } else if (targetType == 'MULTIPLE_CHOICE') {
                    targetValue = targetDOM.find('div.active').attr('value')
                        // console.log(targetDOM)
                        // console.log(targetType)
                        // console.log(targetValue)
                }
                //目标未选择不显示
                if (!targetIsShow) {
                    shouldShow = false
                } else {
                    if (operator == 'EQ') {
                        if (targetValue == value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GT') {
                        if (targetValue > value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LT') {
                        if (targetValue < value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GE') {
                        if (targetValue >= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LE') {
                        if (targetValue <= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'NE') {
                        if (targetValue != value) {
                            shouldShow = true
                        }
                    }
                }
            }
            if (shouldShow) {
                radioArr.eq(j).show()
            } else {
                radioArr.eq(j).hide()
                radioArr.eq(j).find('.cdss-quest-item-radio-inputwrap').find('span').removeClass('active')
            }
        }
        for (var i = 0; i < inputArr.length; i++) {
            var entranStr = inputArr.eq(i).attr('entrance')
            var currentName = inputArr.eq(i).attr('id')
            var conditionArr = entranStr.split('|')
            var pure_cdt = []
            if (!entranStr) {
                continue
            }
            for (var a = 0; a < conditionArr.length; a++) {
                if (conditionArr[a]) {
                    pure_cdt.push(conditionArr[a])
                }
            }
            var shouldShow = false //是否显示当前grid
            if (pure_cdt.length == 0) {
                shouldShow = true
            }
            for (var b = 0; b < pure_cdt.length; b++) {
                var andor = pure_cdt[b].split('-')[0]
                var operator = pure_cdt[b].split('-')[1]
                var qname = pure_cdt[b].split('-')[2]
                var value = pure_cdt[b].split('-')[3]

                var targetDOM = $('#cdss-treatment-questionwrap').find('div[id^="' + qname + '"]')
                var targetType = targetDOM.attr('type')
                var targetValue
                var targetIsShow = targetDOM.css("display") != 'none'

                if (targetType == 'SINGLE_CHOICE') {
                    targetValue = targetDOM.find('.cdss-quest-item-radio.active').attr("value")
                } else if (targetType == 'NUMERIC') {
                    targetValue = targetDOM.find('input').val()
                } else if (targetType == 'MULTIPLE_CHOICE') {
                    targetValue = targetDOM.find('div.active').attr('value')
                }
                if (!targetIsShow) {
                    shouldShow = false
                } else {
                    if (operator == 'EQ') {
                        if (targetValue == value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GT') {
                        if (targetValue > value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LT') {
                        if (targetValue < value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GE') {
                        if (targetValue >= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LE') {
                        if (targetValue <= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'NE') {
                        if (targetValue != value) {
                            shouldShow = true
                        }
                    }
                }
            }
            if (shouldShow) {
                inputArr.eq(i).show()
            } else {
                inputArr.eq(i).hide()
                inputArr.eq(i).find('.cdss-quest-item-inputwrap').find('input').val('')
            }
        }
        for (var i = 0; i < checkArr.length; i++) {
            var entranStr = checkArr.eq(i).attr('entrance')
            var currentName = checkArr.eq(i).attr('id')
            var conditionArr = entranStr.split('|')
            var pure_cdt = []
            if (!entranStr) {
                continue
            }
            for (var a = 0; a < conditionArr.length; a++) {
                if (conditionArr[a]) {
                    pure_cdt.push(conditionArr[a])
                }
            }
            var shouldShow = false //是否显示当前grid
            if (pure_cdt.length == 0) {
                shouldShow = true
            }
            for (var b = 0; b < pure_cdt.length; b++) {
                var andor = pure_cdt[b].split('-')[0]
                var operator = pure_cdt[b].split('-')[1]
                var qname = pure_cdt[b].split('-')[2]
                var value = pure_cdt[b].split('-')[3]

                var targetDOM = $('#cdss-treatment-questionwrap').find('div[id^="' + qname + '"]')
                var targetType = targetDOM.attr('type')
                var targetValue
                var targetIsShow = targetDOM.css("display") != 'none'
                if (targetType == 'SINGLE_CHOICE') {
                    targetValue = targetDOM.find('.cdss-quest-item-radio.active').attr("value")
                } else if (targetType == 'NUMERIC') {
                    targetValue = targetDOM.find('input').val()
                } else if (targetType == 'MULTIPLE_CHOICE') {
                    targetValue = targetDOM.find('div.active').attr('value')
                }
                if (!targetIsShow) {
                    shouldShow = false
                } else {
                    if (operator == 'EQ') {
                        if (targetValue == value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GT') {
                        if (targetValue > value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LT') {
                        if (targetValue < value) {
                            shouldShow = true
                        }
                    } else if (operator == 'GE') {
                        if (targetValue >= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'LE') {
                        if (targetValue <= value) {
                            shouldShow = true
                        }
                    } else if (operator == 'NE') {
                        if (targetValue != value) {
                            shouldShow = true
                        }
                    }
                }
            }
            if (shouldShow) {
                checkArr.eq(i).show()
            } else {
                checkArr.eq(i).hide()
                checkArr.eq(i).find('.cdss-quest-drug-history-ctn').find('.cdss-input-item-check-grid').find('.cdss-quest-checkbox').removeClass('active')
            }
        }
    }

    //visible字段处理
    _that.visibleCtrlFunc = function() {

        _that.entranceLogic()

        //1级单个问题cdss-quest-item-content content下有单选 输入 多选3种情况
        var ctnArr = $("#cdss-treatment-questionwrap .cdss-quest-item-content")
        var expandArr = $("#cdss-treatment-questionwrap .cdss-drug-quest-expand") // 对应的展开收起
        for (var q = 0; q < ctnArr.length; q++) {
            var item = ctnArr.eq(q).find('.cdss-input-item-radio-grid')
            var showCtnWrap = false
            for (var p = 0; p < item.length; p++) {
                var display = item.eq(p).css('display')
                if (display != 'none') {
                    showCtnWrap = true
                }
            }
            var item1 = ctnArr.eq(q).find('.cdss-input-item-grid')
            for (var p = 0; p < item1.length; p++) {
                var display = item1.eq(p).css('display')
                if (display != 'none') {
                    showCtnWrap = true
                }
            }
            var item2 = ctnArr.eq(q).find('.cdss-quest-drug-history-wrap')
            for (var p = 0; p < item2.length; p++) {
                var display = item2.eq(p).css('display')
                if (display != 'none') {
                    showCtnWrap = true
                }
            }
            if (showCtnWrap) {
                ctnArr.eq(q).css({ 'display': 'block' })
                expandArr.eq(q).addClass('fold')
            } else {
                ctnArr.eq(q).css({ 'display': 'none' })
                expandArr.eq(q).removeClass('fold')
            }
        }
        //2级cdss-quest-item
        var quesItemArr = $("#cdss-treatment-questionwrap .cdss-quest-item")
        for (var a = 0; a < quesItemArr.length; a++) {
            var item = quesItemArr.eq(a).find('.cdss-quest-item-content')
            var showItemWrap = false
            for (var b = 0; b < item.length; b++) {
                var display = item.eq(b).css('display')
                if (display != 'none') {
                    showItemWrap = true
                }
            }
            if (showItemWrap) {
                quesItemArr.eq(a).css({ 'display': 'block' })
            } else {
                quesItemArr.eq(a).css({ 'display': 'none' })
            }
        }
        //3级 cdss-drug-quest-content
        var cttArr = $("#cdss-treatment-questionwrap .cdss-drug-quest-content")
        for (var a = 0; a < cttArr.length; a++) {
            var item = cttArr.eq(a).find('.cdss-quest-item')
            var showItemWrap = false
            for (var b = 0; b < item.length; b++) {
                var display = item.eq(b).css('display')
                if (display != 'none') {
                    showItemWrap = true
                }
            }
            if (showItemWrap) {
                cttArr.eq(a).css({ 'display': 'block' })
                expandArr.eq(q).addClass('fold')
            } else {
                cttArr.eq(a).css({ 'display': 'none' })
                expandArr.eq(q).removeClass('fold')
            }
        }
        //4级 cdss-drug-quest-module
        var modtArr = $("#cdss-treatment-questionwrap .cdss-drug-quest-module")
        for (var a = 0; a < modtArr.length; a++) {
            var item = modtArr.eq(a).find('.cdss-drug-quest-content')
            var showItemWrap = false
            for (var b = 0; b < item.length; b++) {
                var display = item.eq(b).css('display')
                if (display != 'none') {
                    showItemWrap = true
                }
            }
            if (showItemWrap) {
                modtArr.eq(a).css({ 'display': 'block' })
            } else {
                modtArr.eq(a).css({ 'display': 'none' })
            }
        }
    }

    //问卷页面自动跳转用药推荐列表逻辑
    _that.survryAutoToDrugRec = function() {
        var radioArr = $("#cdss-treatment-questionwrap .cdss-input-item-radio-grid")
        var inputArr = $("#cdss-treatment-questionwrap .cdss-input-item-grid")
        var checkArr = $("#cdss-treatment-questionwrap .cdss-quest-drug-history-wrap")
        var shouldDrugRec = true
        for (var i = 0; i < radioArr.length; i++) {
            if (radioArr.eq(i).css('display') != 'none') {
                var selected = radioArr.eq(i).find('.cdss-quest-item-radio-inputwrap').find('span').hasClass('active')
                if (!selected) {
                    shouldDrugRec = false
                }
            }
        }
        for (var i = 0; i < inputArr.length; i++) {
            if (inputArr.eq(i).css('display') != 'none') {
                var selected = inputArr.eq(i).find('.cdss-quest-item-inputwrap').find('input').val().length > 0
                if (!selected) {
                    shouldDrugRec = false
                }
            }
        }
        for (var i = 0; i < checkArr.length; i++) {
            if (checkArr.eq(i).css('display') != 'none') {
                var selected = checkArr.eq(i).find('.cdss-quest-drug-history-ctn').find('.cdss-input-item-check-grid').find('.cdss-quest-checkbox').hasClass('active')
                if (!selected) {
                    shouldDrugRec = false
                }
            }
        }
        if (shouldDrugRec) {
            $("#cdss-quest-viewprogram").click()
        }
    }

    //显示 公式量表-id只有搜索打开量表的时候传递，其他地方不传
    _that.showSurveyDom = function(pageElement, id) {
        $("#cdss-bg").show()
        $('.cdss-nursing-scale-nav').hide()
        var item = $('.cdss-formular-scale-nav .cdss-formular-eval-name.active')
        scaleDetail(id ? scaleDetail(id) : scaleDetail(item.attr('id')))
        $('.cdss-formular-scale-nav').show()
        $("#cdss-drugrec-questionwrap").show()
    }

    //decision &therapyDecisions 字段====根据数据生成用药推荐方案
    _that.buildDrugRecommendRecipe = function(data) {
        //notes:therapy和decision字段公用一个方法，内部属性不同，区分对待
        var tableStr = ''
        var thnum = 3
        if (!_that.nodruginfo) {
            thnum = 4
        }
        for (var i = 0; i < data.length; i++) {
            //====用药推荐table表头内容====
            tableStr += '<div class="cdss-table-head">' +
                '<span>' +
                '<span>' + data[i].category + ' </span>'
                //@1.用药方案
            if (data[i].decisionOption) {
                //有方案的情况
                if (data[i].decisionOption && data[i].decisionOption.length > 0) {
                    tableStr += '<span colspan="' + thnum + '">' +
                        '<span>用药方案: </span>' +
                        '<select class="cdss-drug-rec-drugproposal" name="" id="' + data[i].ruleId + '">'
                    for (var j = 0; j < data[i].decisionOption.length; j++) {
                        tableStr += '<option value="' + data[i].decisionOption[j].therapy +
                            '" title="' + data[i].decisionOption[j].therapy +
                            '" therapyType="' + data[i].decisionOption[j].therapyType + '" index="' + j + '">' + data[i].decisionOption[j].therapy + '</option>'
                    }
                    tableStr += '</select>'
                    if (data[i].therapyNotes && data[i].therapyNotes.split(";")[0]) {
                        tableStr += '<span class="cdss-drug-rec-info active"><img class="cdss-radio-tips-img" src="' +
                            webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                            data[i].therapyNotes.split(";")[0] + '</div></span>'
                    } else {
                        tableStr += '<span class="cdss-drug-rec-info"><img class="cdss-radio-tips-img" src="' +
                            webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                            data[i].therapyNotes + '</div></span>'
                    }
                    if (data[i].therapyNotes) {
                        tableStr += '<span class="cdss-drug-rec-info-all">' + data[i].therapyNotes + '</span>'
                    } else {
                        tableStr += '<span class="cdss-drug-rec-info-all"></span>'
                    }
                    //循证按钮
                    if (data[i].hasEvicence) {
                        tableStr += '<span id="' +
                            data[i].ruleId + '" class="cdss-drug-recommend-xunzheng">查看循证</span>'
                    }
                    tableStr += '</span>'
                } else {
                    //没有方案情况
                    tableStr += '<span colspan="' + thnum + '"></span>'
                }

                tableStr += '</span>' +
                    '</div>' +
                    '<table><tbody>'
                    //====用药推荐table列表内容====
                if (data[i].therapy && data[i].decisionOption.length > 0 && data[i].decisionOption[0].drugUnion && data[i].decisionOption[0].drugUnion.length > 0 && data[i].decisionOption[0].drugUnion[0].drugInfo && data[i].decisionOption[0].drugUnion[0].drugInfo.length > 0 && data[i].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping && data[i].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping.length > 0) {
                    for (var k = 0; k < data[i].decisionOption[0].drugUnion.length; k++) {
                        tableStr += '<tr>' +
                            '<td>' +
                            '<span class="active">' +
                            '<img src="' + webBaseURL + '/image/checkbox.png" class="cdss-drug-rec-thrary-true" />' +
                            '<img src="' + webBaseURL + '/image/checkbox1.png" class="cdss-drug-rec-thrary-false" />' +
                            data[i].decisionOption[0].drugUnion[k].therapy + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<select name="" id="" class="cdss-select-drugunion">'
                        for (var m = 0; m < data[i].decisionOption[0].drugUnion[k].drugInfo.length; m++) {
                            tableStr += '<option value="' + data[i].decisionOption[0].drugUnion[k].drugInfo[m].genericName +
                                '" title="' + data[i].decisionOption[0].drugUnion[k].drugInfo[m].genericName +
                                '">' + data[i].decisionOption[0].drugUnion[k].drugInfo[m].genericName + '</option>'
                        }
                        tableStr += '</select>' +
                            '</td>' +
                            '<td>' +
                            '<select name="" id="" class="cdss-select-druginfo">'
                        var noStock = false
                        for (var z = 0; z < data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping.length; z++) {
                            if (data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[z].stock != 0) {
                                noStock = true
                            }
                        }
                        if (!noStock) {
                            tableStr += '<option stock="0">暂无库存</option>'
                        }
                        for (var n = 0; n < data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping.length; n++) {
                            var stock = data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].stock
                            if (stock == 0) {
                                tableStr += '<option value="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" title="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" dosage="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].dosage +
                                    '" unit="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].unit +
                                    '" frequency="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].frequency +
                                    '" spec="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].spec +
                                    '" id="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].id +
                                    '" drugName="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" stock="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].stock +
                                    '" taboo="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].taboo +
                                    '" manufacturer="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].manufacturer +
                                    '" disabled>' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName + '</option>'
                            } else {
                                tableStr += '<option value="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" title="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" dosage="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].dosage +
                                    '" unit="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].unit +
                                    '" frequency="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].frequency +
                                    '" spec="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].spec +
                                    '" id="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].id +
                                    '" drugName="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName +
                                    '" stock="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].stock +
                                    '" taboo="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].taboo +
                                    '" manufacturer="' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].manufacturer +
                                    '">' + data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[n].drugName + '</option>'
                            }

                        }
                        tableStr += '</select>'
                        var ggstr = ''
                        var csstr = ''
                        var gg = data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[0].spec
                        var cs = data[i].decisionOption[0].drugUnion[k].drugInfo[0].drugMapping[0].manufacturer
                        if (!gg || gg == 'null' || gg == 'undefined') {
                            ggstr = '无'
                        } else {
                            ggstr = gg
                        }
                        if (!cs || cs == 'null' || cs == 'undefined') {
                            csstr = '无'
                        } else {
                            csstr = cs
                        }
                        tableStr += '</td>'
                        tableStr += '<td><span class="cdss-drug-detail-info-specs">规格：' + ggstr + '</span></td>'
                        if (!_that.nodruginfo) {
                            tableStr += '<td><span class="cdss-drug-detail-info-notes-nodruginfo">厂商：' + csstr + '</span></td>'
                        }
                        tableStr += '</tr>'
                    }
                } else {
                    //没有option情况
                    tableStr += '<tr><td colspan="' + thnum + 1 + '">' + data[i].therapy + ' </td></tr>'
                }
                //@2.治疗方案
            } else if (data[i].subTherDecision) {
                //有方案情况
                if (data[i].subTherDecision && data[i].subTherDecision.length > 0) {
                    //治疗方案
                    tableStr += '<span>' +
                        '<span>治疗方案: </span>' +
                        '<select class="cdss-drug-rec-treatproposal" name="" id="' + data[i].ruleId + '">'
                    for (var j = 0; j < data[i].subTherDecision.length; j++) {
                        tableStr += '<option value="' + data[i].subTherDecision[j].category +
                            '" index="' + j + '">' + data[i].subTherDecision[j].category + '</option>'
                    }
                    tableStr += '</select>'
                    if (data[i].therapyNotes && data[i].therapyNotes.split(";")[0]) {
                        tableStr += '<span class="cdss-drug-rec-info active"><img class="cdss-radio-tips-img" src="' +
                            webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                            data[i].therapyNotes.split(";")[0] + '</div></span>'
                    } else {
                        tableStr += '<span class="cdss-drug-rec-info"><img class="cdss-radio-tips-img" src="' +
                            webBaseURL + '/image/icon_i.png" /><div class="cdss-drug-rec-info-tips">' +
                            data[i].therapyNotes + '</div></span>'
                    }
                    if (data[i].therapyNotes) {
                        tableStr += '<span class="cdss-drug-rec-info-all">' + data[i].therapyNotes + '</span>'
                    } else {
                        tableStr += '<span class="cdss-drug-rec-info-all"></span>'
                    }

                    tableStr += '</span>'
                        //治疗方案具体列表
                    if (data[i].subTherDecision[0].decisionOption && data[i].subTherDecision[0].decisionOption.length > 0) {
                        tableStr += '<span><span>用药方案: </span><select class="cdss-drug-rec-drugproposal">'
                        for (var d = 0; d < data[i].subTherDecision[0].decisionOption.length; d++) {
                            tableStr += '<option value="' + data[i].subTherDecision[0].decisionOption[d].therapy +
                                '" title="' + data[i].subTherDecision[0].decisionOption[d].therapy +
                                '" therapyType="' + data[i].subTherDecision[0].decisionOption[d].therapyType + '">' + data[i].subTherDecision[0].decisionOption[d].therapy + '</option>'
                        }
                        tableStr += '</select>'
                            //循证按钮
                        if (data[i].hasEvicence) {
                            tableStr += '<span id="' +
                                data[i].ruleId + '" class="cdss-drug-recommend-xunzheng">查看循证</span>'
                        }
                        tableStr += '</span>'
                    }

                } else {
                    //没有方案情况
                    tableStr += '<span colspan="' + thnum + '"></span>'
                }

                tableStr += '</span>' +
                    '</div>' +
                    '<table><tbody>'
                    //====用药推荐table列表内容====
                if (data[i].therapy && data[i].subTherDecision.length > 0 && data[i].subTherDecision[0].decisionOption && data[i].subTherDecision[0].decisionOption.length > 0 && data[i].subTherDecision[0].decisionOption[0].drugUnion && data[i].subTherDecision[0].decisionOption[0].drugUnion.length > 0 && data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo && data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo.length > 0) {
                    for (var k = 0; k < data[i].subTherDecision[0].decisionOption[0].drugUnion.length; k++) {
                        tableStr += '<tr>' +
                            '<td>' +
                            '<span class="active">' + data[i].subTherDecision[0].decisionOption[0].drugUnion[k].therapy + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<select name="" id="" class="cdss-select-drugunion">'
                        for (var m = 0; m < data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo.length; m++) {
                            tableStr += '<option value="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[m].genericName +
                                '" title="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[m].genericName +
                                '">' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[m].genericName + '</option>'
                        }
                        tableStr += '</select>' +
                            '</td>' +
                            '<td>' +
                            '<select name="" id="" class="cdss-select-druginfo">'
                        var noStock = false
                        for (var z = 0; z < data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping.length; z++) {
                            if (data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[z].stock != 0) {
                                noStock = true
                            }
                        }
                        if (!noStock) {
                            tableStr += '<option stock="0">暂无库存</option>'
                        }
                        for (var n = 0; n < data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping.length; n++) {
                            var stock = data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock
                            if (stock == 0) {
                                tableStr += '<option value="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" title="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" dosage="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].dosage +
                                    '" unit="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].unit +
                                    '" frequency="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].frequency +
                                    '" spec="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].spec +
                                    '" id="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].id +
                                    '" drugName="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" stock="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock +
                                    '" taboo="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].taboo +
                                    '" manufacturer="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].manufacturer +
                                    '" disabled>' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName + '</option>'
                            } else {
                                tableStr += '<option value="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" title="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" dosage="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].dosage +
                                    '" unit="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].unit +
                                    '" frequency="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].frequency +
                                    '" spec="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].spec +
                                    '" id="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].id +
                                    '" drugName="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName +
                                    '" stock="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].stock +
                                    '" taboo="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].taboo +
                                    '" manufacturer="' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].manufacturer +
                                    '">' + data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[n].drugName + '</option>'
                            }

                        }
                        tableStr += '</select>'
                        var ggstr = ''
                        var csstr = ''
                        var gg = data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[0].spec
                        var cs = data[i].subTherDecision[0].decisionOption[0].drugUnion[0].drugInfo[0].drugMapping[0].manufacturer
                        if (!gg || gg == 'null' || gg == 'undefined') {
                            ggstr = '无'
                        } else {
                            ggstr = gg
                        }
                        if (!cs || cs == 'null' || cs == 'undefined') {
                            csstr = '无'
                        } else {
                            csstr = cs
                        }
                        tableStr += '</td>'
                        tableStr += '<td><span class="cdss-drug-detail-info-specs">规格：' + ggstr + '</span></td>'
                        if (!_that.nodruginfo) {
                            tableStr += '<td><span class="cdss-drug-detail-info-notes-nodruginfo">厂商：' + csstr + '</span></td>'
                        }
                        tableStr += '</tr>'
                    }
                } else {
                    tableStr += '<tr><td colspan="' + thnum + 1 + '">' + data[i].therapy + '</td></tr>'
                }
                //@3.用药方案和治疗方案都不存在
            } else {
                tableStr += '<span colspan="' + thnum + '"></span></div><table><tbody>'
            }
            tableStr += '</tbody></table>'
        }
        $("#cdss-recommend").append(tableStr)
            //用药方案tips鼠标功能
        $(".cdss-drug-rec-info img").on("mouseenter", function() {
            $(this).next().show()
        })
        $(".cdss-drug-rec-info img").on("mouseleave", function() {
                $(this).next().hide()
            })
            //对药品库存stock进行处理
        for (var j = 0; j < $("#cdss-recommend tbody tr").length; j++) {
            var stock = $("#cdss-recommend tbody tr").eq(j).find("select.cdss-select-druginfo option:selected").attr("stock")
            if (stock == 1) {
                $("#cdss-recommend tbody tr").eq(j).find("span").addClass("active")
            } else {
                $("#cdss-recommend tbody tr").eq(j).find("span").removeClass("active")
            }
        }
        //用药方案选择checkbox功能
        $("#cdss-recommend").off("click").on("click", "tbody tr td:first-child span", function() {
                var stock = $(this).parent().siblings().find("select.cdss-select-druginfo option:selected").attr("stock")
                if (stock == 1) {
                    $(this).toggleClass("active")
                } else {
                    $(this).removeClass("active")
                    _that.showCdssAlert("该药品暂无库存！")
                }

            })
            // 循证按钮点击查询循证
        $("#cdss-recommend").on("click", ".cdss-drug-recommend-xunzheng", function(event) {
            // 治疗方案,并判断是否为血糖管理，不是的提示
            var id = $(this).attr("id");
            var _this = $(this);
            var direct = $(_this).parent().prev().html();
            var therapyNameSelect = $(_this).parent()[0].children[1];
            var firstSelectIndex = therapyNameSelect.selectedIndex;
            var therapyName = (therapyNameSelect.children[firstSelectIndex]).innerText;
            var therapyType = (therapyNameSelect.children[firstSelectIndex]).getAttribute("therapyType");
            if (therapyType == 'null') {
                therapyType = 'CVD'
            }
            var obj = {
                ruleId: id,
                therapyType: therapyType,
                therapyName: therapyName,
                direct: direct
            }
            try {
                CEFAPI.trigger('EvidenceBased', JSON.stringify(obj))
            } catch (error) {
                $.ajax({
                    url: baseURL + '/diagnose/get/getEvidence/' + id,
                    type: 'get',
                    contentType: 'application/json',
                    dataType: 'json',
                    scriptCharset: 'utf-8',
                    beforeSend: function(request) {
                        request.setRequestHeader('Content-Type', 'application/json')
                        request.setRequestHeader('channel-id', channelId)
                        request.setRequestHeader('institution-id', institutionId)
                    },
                    success: function(resData) {
                        if (resData.retCode = '999999') {
                            var data = resData.data.message;
                            // message.length<10时候为未找到结果，无循证数据,进入else提示
                            if (data.length > 10) {
                                // 判断是否有建议div
                                $(".cdss-envidence-direct").html('治疗方案 : ' + direct);
                                therapyNameSelect = $(_this).parent()[0].children[1];
                                var firstSelectIndex = therapyNameSelect.selectedIndex;
                                var therapyName = (therapyNameSelect.children[firstSelectIndex]).innerText;
                                $(".cdss-envidence-therapyName").html(therapyName);
                                // 调用去重方法,调用查询方法获取要用到的循证内容
                                var eva = setArray(JSON.parse(data).info, 'therapType');
                                // console.log(eva)
                                // 获取方案中的therapyType(左)
                                var therapyType = (therapyNameSelect.children[firstSelectIndex]).getAttribute("therapyType");
                                // console.log(therapyType);
                                var evMsgAll = searchEv(eva, therapyType);
                                var evMsg = evMsgAll.therapInfo;
                                // console.log(evMsg);
                                // 填充三个tabs，概要/参考资料/相似病患
                                // if为非赛诺菲，else为赛诺菲
                                // console.log(evMsg)
                                if (therapyType == 'null' || therapyType == 'CVD') {
                                    // 概要
                                    $(".cdss-envidence-clinicalGuide").html(evMsg.clinicalGuide);
                                    if (evMsg.contrast && evMsg.contrast !== "数据不足") {
                                        $("#cdss-envidence-out-first-mid").html(evMsg.contrast.samePersonPerc);
                                        $("#cdss-envidence-out-first-bot").html(evMsg.contrast.samePerson + "/" + evMsg.contrast.allPerson);
                                    } else {
                                        $("#cdss-envidence-out-first-mid").html("--");
                                        $("#cdss-envidence-out-first-bot").html();
                                    }
                                    if (evMsg.image && evMsg.image[therapyName] && evMsg.image[therapyName] !== "数据不足" && evMsg.image[therapyName].goodPercent) {
                                        $("#cdss-envidence-out-second-mid").html(evMsg.image[therapyName].goodPercent + "%");
                                        $("#cdss-envidence-out-second-bot").html()
                                            // $("#cdss-envidence-out-second-bot").html("总" + evMsg.sameRecipel['hba1c达标率'].person + "人");
                                    } else {
                                        $("#cdss-envidence-out-second-mid").html("--");
                                        $("#cdss-envidence-out-second-bot").html();
                                    }
                                    if (evMsg.image && evMsg.image[therapyName] && evMsg.image[therapyName] !== "数据不足" && evMsg.image[therapyName].sameRecipelPerc) {
                                        $("#cdss-envidence-out-third-mid").html(evMsg.image[therapyName].sameRecipelPerc + "%");
                                        $("#cdss-envidence-out-third-bot").html()
                                            // $("#cdss-envidence-out-third-bot").html("总" + evMsg.sameRecipel['依从性'].person + "人");
                                    } else {
                                        $("#cdss-envidence-out-third-mid").html("--");
                                        $("#cdss-envidence-out-third-bot").html();
                                    }
                                    if ($("#cdss-envidence-out-second-mid").html() == '--') {
                                        $(".cdss-envidence-tips").show();
                                    } else {
                                        $(".cdss-envidence-tips").hide();
                                    }
                                    // 参考资料,sanofi有该标签页
                                    if (evMsg.clinicalInfo) {
                                        $(".cdss-envidence-reference-middle").html(evMsg.clinicalInfo);
                                        $("#cdss-envidence-tab-reference").show();
                                    } else {
                                        $("#cdss-envidence-tab-reference").hide();
                                    }
                                    // 相似病患
                                    simTable(evMsg.feature, evMsg.profile, evMsg.allPeople, evMsg.pvalue);
                                    if (evMsg.image && evMsg.image.categray && evMsg.image[therapyName] && evMsg.image[therapyName].goodPercent) {
                                        // 画图
                                        drawPie(evMsg.image);
                                        drawBar(evMsg.image);
                                        $("#cdss-envidence-sim-pie").show();
                                        $("#cdss-envidence-sim-bar").show();
                                        $(".cdss-envidence-sim-middle").show();
                                    } else {
                                        $("#cdss-envidence-sim-pie").hide();
                                        $("#cdss-envidence-sim-bar").hide();
                                        $(".cdss-envidence-sim-middle").hide();
                                    }
                                    // 图下说明
                                    if (evMsg.image && evMsg.image.cylindrical && evMsg.image.cylindrical.note) {
                                        $(".cdss-envidence-sim-note").html("数据证据 : " + evMsg.image.cylindrical.note);
                                        $(".cdss-envidence-sim-note").show();
                                    } else {
                                        $(".cdss-envidence-sim-note").hide();
                                    }
                                    // 临床指南图片
                                    if (evMsgAll.img) {
                                        var imgSrc = webBaseURL + "/image/evid/L" + evMsgAll.img;
                                        var imgSrcL = webBaseURL + "/image/evid/" + evMsgAll.img;
                                        $(".cdss-envidence-cli-img-s").attr("src", imgSrc);
                                        // 设置大图路径
                                        $(".cdss-envidence-cli-img-l").attr("src", imgSrcL);
                                        // 点击展开大图
                                        $(".cdss-envidence-cli-img-s").on("click", function() {
                                            $(".cdss-envidence-img-wrap").show();
                                        })
                                        $("#cdss-envidence-cli-close").on("click", function() {
                                            $(".cdss-envidence-img-wrap").hide();
                                        })
                                    }

                                    // 处理风险因子
                                    if (glucopenia) {
                                        if (glucopenia.indexOf("低危") !== -1) {
                                            $("#cdss-envidence-glucopenia-front").html("低危");
                                            $("#cdss-envidence-glucopenia-end").hide();
                                        } else {
                                            $("#cdss-envidence-glucopenia-front").html("低血糖风险 : " + glucopenia.substring(0, 2));
                                            if (glucopenia.indexOf(";") !== -1) {
                                                $("#cdss-envidence-glucopenia-end").html("主要的风险因子 : " + glucopenia.substring(3));
                                                $("#cdss-envidence-glucopenia-end").show();
                                            }
                                        }
                                    }
                                    // sanofi
                                } else {
                                    // 概要
                                    $(".cdss-envidence-clinicalGuide").html(evMsg.clinicalGuide);
                                    if (evMsg.contrast && evMsg.contrast !== "数据不足") {
                                        $("#cdss-envidence-out-first-mid").html(evMsg.contrast.samePersonPerc);
                                        $("#cdss-envidence-out-first-bot").html(evMsg.contrast.samePerson + "/" + evMsg.contrast.allPerson);
                                    } else {
                                        $("#cdss-envidence-out-first-mid").html("--");
                                        $("#cdss-envidence-out-first-bot").html("--/--");
                                    }
                                    if (evMsg.sameRecipel && evMsg.sameRecipel['hba1c达标率'] !== "数据不足") {
                                        $("#cdss-envidence-out-second-mid").html(evMsg.sameRecipel['hba1c达标率'].goodPercent);
                                        $("#cdss-envidence-out-second-bot").html("总" + evMsg.sameRecipel['hba1c达标率'].person + "人");
                                    } else {
                                        $("#cdss-envidence-out-second-mid").html("--");
                                        $("#cdss-envidence-out-second-bot").html("--");
                                    }
                                    if (evMsg.sameRecipel && evMsg.sameRecipel['依从性'] !== "数据不足") {
                                        $("#cdss-envidence-out-third-mid").html(evMsg.sameRecipel['依从性'].goodPercent);
                                        $("#cdss-envidence-out-third-bot").html("总" + evMsg.sameRecipel['依从性'].person + "人");
                                    } else {
                                        $("#cdss-envidence-out-third-mid").html("--");
                                        $("#cdss-envidence-out-third-bot").html("--");
                                    }
                                    if ($("#cdss-envidence-out-second-mid").html() == '--') {
                                        $(".cdss-envidence-tips").show();
                                    } else {
                                        $(".cdss-envidence-tips").hide();
                                    }
                                    // 参考资料,sanofi有该标签页
                                    if (evMsg.clinicalInfo) {
                                        $(".cdss-envidence-reference-middle").html(evMsg.clinicalInfo);
                                        $("#cdss-envidence-tab-reference").show();
                                    } else {
                                        $("#cdss-envidence-tab-reference").hide();
                                    }
                                    // 相似病患
                                    simTable(evMsg.feature, evMsg.profile, evMsg.allPeople, evMsg.pvalue);
                                    if (evMsg.image && evMsg.image.sector) {
                                        // 画图
                                        drawPieS(evMsg.image.sector);
                                        drawBarS(evMsg.image.cylindrical);
                                        $("#cdss-envidence-sim-pie").show();
                                        $("#cdss-envidence-sim-bar").show();
                                        $(".cdss-envidence-sim-middle").show();
                                    } else {
                                        $("#cdss-envidence-sim-pie").hide();
                                        $("#cdss-envidence-sim-bar").hide();
                                        $(".cdss-envidence-sim-middle").hide();
                                    }
                                    // 图下说明
                                    if (evMsg.image && evMsg.image.cylindrical && evMsg.image.cylindrical.note) {
                                        $(".cdss-envidence-sim-note").html("数据证据 : " + evMsg.image.cylindrical.note);
                                        $(".cdss-envidence-sim-note").show();
                                    } else {
                                        $(".cdss-envidence-sim-note").hide();
                                    }
                                    // 处理风险因子
                                    if (glucopenia) {
                                        if (glucopenia.indexOf("低危") !== -1) {
                                            $("#cdss-envidence-glucopenia-front").html("低危");
                                            $("#cdss-envidence-glucopenia-end").hide();
                                        } else {
                                            $("#cdss-envidence-glucopenia-front").html("低血糖风险 : " + glucopenia.substring(0, 2));
                                            if (glucopenia.indexOf(";") !== -1) {
                                                $("#cdss-envidence-glucopenia-end").html("主要的风险因子 : " + glucopenia.substring(3));
                                                $("#cdss-envidence-glucopenia-end").show();
                                            }
                                        }
                                    }
                                }
                                // 打开循证侧栏
                                $("#cdss-envidence-bg").show();
                            } else {
                                _that.showCdssAlert('该方案暂不支持循证')
                            }
                        }
                    }
                })
            }

        })
    }

    //化验单解读功能
    _that.testSheetDiagnosis = function(data, type) {
        deleteBorder()
        if (!_that.hasPower || _that.tabShow == 2) { return }
        $('.cdss-test-sheet-diagnosis-no-access').hide()
        $('.cdss-prescription-detail-wrap').hide()
        data.hospitalDepartment = _that.hospitalDepartment
        data.hospitalDepartmentId = _that.hospitalDepartmentId
        $.ajax({
            url: baseURL + '/decision/post/testExplainUpgrade',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(data),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    if (resData.data.status == 0) {
                        var data = resData.data.testResultWrappers
                        var str = ''
                        if (type && type == 'detail') {
                            var length = data.length
                            for (var i = 0; i < data.length; i++) {
                                if (i < 1) {
                                    str += '<div class="cdss-detail-sheet-diagnosis-item">' + data[i].testName
                                    if (data[i].stdResult == '未知') {
                                        str += '<span class="cdss-detail-diagnosis-label1">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '正常') {
                                        str += '<span class="cdss-detail-diagnosis-label2">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '偏低') {
                                        str += '<span class="cdss-detail-diagnosis-label3">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '偏高') {
                                        str += '<span class="cdss-detail-diagnosis-label4">' + data[i].stdResult + '</span>'
                                    } else {
                                        str += '<span class="cdss-detail-diagnosis-label1">' + data[i].stdResult + '</span>'
                                    }
                                    str += '</div>' +
                                        '<div class="cdss-detail-sheet-diagnosis-des noBottom">'
                                    if (data[i].referenceRange) {
                                        str += '<p class="cdss-detail-section">参考区间：' + data[i].referenceRange + data[i].unit + '</p>'
                                    }
                                    str += data[i].resultExplan +
                                        '</div>'
                                }
                            }
                            if (length > 1) {
                                str += '<div class="cdss-detail-sheet-diagnosis-more">'
                                for (var i = 1; i < data.length; i++) {
                                    str += '<div class="cdss-detail-sheet-diagnosis-item">' + data[i].testName
                                    if (data[i].stdResult == '未知') {
                                        str += '<span class="cdss-detail-diagnosis-label1">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '正常') {
                                        str += '<span class="cdss-detail-diagnosis-label2">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '偏低') {
                                        str += '<span class="cdss-detail-diagnosis-label3">' + data[i].stdResult + '</span>'
                                    } else if (data[i].stdResult == '偏高') {
                                        str += '<span class="cdss-detail-diagnosis-label4">' + data[i].stdResult + '</span>'
                                    } else {
                                        str += '<span class="cdss-detail-diagnosis-label1">' + data[i].stdResult + '</span>'
                                    }
                                    str += '</div>' +
                                        '<div class="cdss-detail-sheet-diagnosis-des">'
                                    if (data[i].referenceRange) {
                                        str += '<p class="cdss-detail-section">参考区间：' + data[i].referenceRange + data[i].unit + '</p>'
                                    }
                                    str += data[i].resultExplan + '</div>'
                                }
                                str += '</div>'
                                str += '<div class="cdss-detail-sheet-diagnosis-showmore">更多' +
                                    '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                    '</div>' +
                                    '<div class="cdss-detail-sheet-diagnosis-hidemore">隐藏' +
                                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                    '</div>'
                                $(".cdss-detail-sheet-diagnosis-ctn").empty().append(str)
                                $('.cdss-detail-sheet-diagnosis-wrap').show()
                            } else {
                                $('.cdss-detail-sheet-diagnosis-wrap').hide()
                            }

                            $(".cdss-detail-sheet-diagnosis-showmore").off("click").on("click", function() {
                                $(".cdss-detail-sheet-diagnosis-more").show()
                                $(".cdss-detail-sheet-diagnosis-hidemore").show()
                                $(".cdss-detail-sheet-diagnosis-showmore").hide()
                                var length = $('.cdss-detail-sheet-diagnosis-des').length
                                for (var i = 0; i < length; i++) {
                                    $('.cdss-detail-sheet-diagnosis-des').eq(i).removeClass('noBottom')
                                    if (i == length - 1) {
                                        $('.cdss-detail-sheet-diagnosis-des').eq(i).addClass('noBottom')
                                    }
                                }
                            })
                            $(".cdss-detail-sheet-diagnosis-hidemore").off("click").on("click", function() {
                                $(".cdss-detail-sheet-diagnosis-more").hide()
                                $(".cdss-detail-sheet-diagnosis-showmore").show()
                                $(".cdss-detail-sheet-diagnosis-hidemore").hide()
                                var length = $('.cdss-detail-sheet-diagnosis-des').length
                                for (var i = 0; i < length; i++) {
                                    $('.cdss-detail-sheet-diagnosis-des').eq(i).removeClass('noBottom')
                                    if (i == 0) {
                                        $('.cdss-detail-sheet-diagnosis-des').eq(i).addClass('noBottom')
                                    }
                                }
                            })
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                str += '<div class="cdss-test-sheet-diagnosis-item">' + data[i].testName
                                if (data[i].stdResult == '未知') {
                                    str += '<span class="cdss-test-diagnosis-label1">' + data[i].stdResult + '</span>'
                                } else if (data[i].stdResult == '正常') {
                                    str += '<span class="cdss-test-diagnosis-label2">' + data[i].stdResult + '</span>'
                                } else if (data[i].stdResult == '偏低') {
                                    str += '<span class="cdss-test-diagnosis-label3">' + data[i].stdResult + '</span>'
                                } else if (data[i].stdResult == '偏高') {
                                    str += '<span class="cdss-test-diagnosis-label4">' + data[i].stdResult + '</span>'
                                } else {
                                    str += '<span class="cdss-test-diagnosis-label1">' + data[i].stdResult + '</span>'
                                }
                                str += '</div>' +
                                    '<div class="cdss-test-sheet-diagnosis-des">'
                                if (data[i].referenceRange) {
                                    str += '<p class="cdss-detail-section">参考区间：' + data[i].referenceRange + data[i].unit + '</p>'
                                }
                                str += data[i].resultExplan + '</div>'
                            }

                            $(".cdss-test-sheet-diagnosis-ctn").empty().append(str)
                            $(".cdss-test-sheet-diagnosis-wrap").show()
                            $(".cdss-prescription-detail-wrap").hide()
                            $('#cdss-test-sheet-diagnosis-close-btn').off('click').on('click', function() {
                                $(".cdss-test-sheet-diagnosis-wrap").hide()
                            })

                        }
                    }
                } else {
                    if (resData.retCode == '-100010') {
                        $(".cdss-test-sheet-diagnosis-wrap").show()
                        $('.cdss-test-sheet-diagnosis-no-access').empty().html(resData.retMsg).show()
                        $('#cdss-test-sheet-diagnosis-close-btn').off('click').on('click', function() {
                            $(".cdss-test-sheet-diagnosis-wrap").hide()
                        })
                    }

                }
            },
            error: function(err) {

            }
        })
    }
    _that.showNoData = function() {
        var arr = ['cdss-check-conflict-commom-wrap', 'cdss-drug-conflict-commom-wrap', 'cdss-caseQc-wrap', 'cdss-surgeryRemind-wrap', 'cdss-doctorAdvice-wrap', 'cdss-transfusionRemind-wrap',
            'cdss-nursing-commom-wrap', 'cdss-nursing-department-wrap', 'cdss-transfusion-department-wrap', 'cdss-infectious-Diseases-wrap', 'cdss-miss-check-wrap'
        ]
        var leng = 0
        for (var i = 0; i < arr.length; i++) {
            if ($('.' + arr[i]).css('display') == 'none') {
                leng++
            }
        }
        if (leng == arr.length) {
            if (_that.noPower.hasPower) {
                $('.cdss-no-data').html('暂无预警提示信息').show()
                    // zt

                $('.warn_imgage').hide()
            } else {
                $('.cdss-no-data').html(_that.noPower.msg).show()
            }
        } else {
            $('.cdss-no-data').hide()
                // zt
            $('.warn_imgage').show()
        }
    }
    _that.showNoPrescription = function() {
            var arr = ['cdss-treat-btn', 'cdss-drug-list-most-module-prescription', 'cdss-drug-list-most-commom-wrap', 'cdss-drug-usage-and-dosage-wrap', 'cdss-instruction-commom-wrap',
                'cdss-drug-list-most-module-chDrugRecommend', 'cdss-drug-list-most-module-chPatentDrugRecommend'
            ]
            var leng = 0
            for (var i = 0; i < arr.length; i++) {
                if ($('.' + arr[i]).css('display') == 'none') {
                    leng++
                }
            }
            if (leng == arr.length) {
                $('.cdss-no-prescription').html('暂无辅助诊疗信息').show()
            } else {
                $('.cdss-no-prescription').hide()
            }
        }
        //合理用药功能
    _that.drugConflict = function(data, type) {
            if (!_that.hasPower || _that.tabShow == 1) { return }
            console.log(data.disease)

            data.hospitalDepartment = _that.hospitalDepartment
            data.hospitalDepartmentId = _that.hospitalDepartmentId
                //药品冲突功能
            $('.cdss-drug-conflict-no-access').hide()
            $.ajax({
                url: baseURL + '/decision/post/rationalDrug',
                type: 'post',
                datatype: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                scriptCharset: 'utf-8',
                beforeSend: function(request) {
                    request.setRequestHeader('Content-Type', 'application/json')
                    request.setRequestHeader('channel-id', channelId)
                    request.setRequestHeader('institution-id', institutionId)
                },
                success: function(resData) {
                    _that.noPower.hasPower = true
                    if (resData.retCode == '999999') {
                        var str = ''
                        var data = []
                        var warnInfoWithUsageList = resData.data.warnInfoWithUsageList // 药品列表
                        for (var key in warnInfoWithUsageList) {
                            var obj = {
                                commonName: key,
                                list: warnInfoWithUsageList[key]
                            }
                            data.push(obj)
                        }
                        if (data && data.length) {
                            var highRiskDrugs = resData.data.highRiskDrugs // 高危药品
                            if (highRiskDrugs && highRiskDrugs.length) {
                                str += '<div class="header">' +
                                    '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                    '【高危药品】</div><ul class="cdss-danger-ul">'
                                for (var i = 0; i < highRiskDrugs.length; i++) {
                                    str += '<li>' + highRiskDrugs[i] + '</li>'
                                }
                                str += '</ul>'
                            }
                            var length = data.length
                            for (var i = 0; i < data.length; i++) {
                                if (i < 1) {
                                    str += '<div class="cdss-drug-conflict-cell"><div class="cdss-drug-conflict-name"><img class="cdss-header-title" src=' + webBaseURL + '/image/icon_yongyaohelixing.png /> ' +
                                        data[i].commonName +
                                        '</div><ul>'
                                    for (var j = 0; j < data[i].list.length; j++) {
                                        var hasmessage = ''
                                        if (!data[i].list[j].message && !data[i].list[j].monograph) {
                                            hasmessage = 'hasmessage'
                                        }
                                        str += '<li>'
                                        str += '<div class="header ' + hasmessage + '" >' +
                                            '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                            (data[i].list[j].type == 'DDI' ? ('【' + data[i].list[j].typeDesc + '】：' + data[i].list[j].opponent) : ('【' + data[i].list[j].typeDesc + '】')) +
                                            '</div>'
                                        str += '<div class="cdss-drug-conflict-body">' + (data[i].list[j].message || data[i].list[j].monograph || '') + '</div>';
                                        str += '</li>';

                                    }
                                    str += '</ul></div>';
                                }
                            }
                            if (length > 1) {
                                str += '<div class="cdss-drug-conflict-more">'
                                for (var i = 1; i < data.length; i++) {
                                    str += '<div class="cdss-drug-conflict-cell"><div class="cdss-drug-conflict-name">' +
                                        '<img class="cdss-header-title" src=' + webBaseURL + '/image/icon_yongyaohelixing.png /> ' +
                                        data[i].commonName +
                                        '</div><ul>'
                                    for (var j = 0; j < data[i].list.length; j++) {
                                        var hasmessage = ''
                                        if (!data[i].list[j].message && !data[i].list[j].monograph) {
                                            hasmessage = 'hasmessage'
                                        }
                                        str += '<li>'
                                        str += '<div class="header ' + hasmessage + '">' +
                                            '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                            (data[i].list[j].type == 'DDI' ? ('【' + data[i].list[j].typeDesc + '】：' + data[i].list[j].opponent) : ('【' + data[i].list[j].typeDesc + '】')) +
                                            '</div>'
                                        str += '<div class="cdss-drug-conflict-body">' + (data[i].list[j].message || data[i].list[j].monograph || '') + '</div>';
                                        str += '</li>';
                                    }
                                    str += '</ul></div>';
                                }
                                str += '</div>'
                                str += '<div class="cdss-drug-conflict-showmore">更多' +
                                    '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                    '</div>' +
                                    '<div class="cdss-drug-conflict-hidemore">隐藏' +
                                    '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                    '</div>'
                            }
                            $(".cdss-drug-conflict-ctn").empty().append(str)
                            if (length > 1) {
                                $(".cdss-drug-conflict-showmore").off("click").on("click", function() {
                                    $(".cdss-drug-conflict-more").show()
                                    $(".cdss-drug-conflict-hidemore").show()
                                    $(".cdss-drug-conflict-showmore").hide()
                                })
                                $(".cdss-drug-conflict-hidemore").off("click").on("click", function() {
                                    $(".cdss-drug-conflict-more").hide()
                                    $(".cdss-drug-conflict-showmore").show()
                                    $(".cdss-drug-conflict-hidemore").hide()
                                })
                            }
                            $(".cdss-drug-conflict-commom-wrap").show()
                            $('.cdss-tab-icon-red').show()
                        } else {
                            $(".cdss-drug-conflict-commom-wrap ").hide()
                        }
                        _that.showNoData()
                        deleteBorder()
                    } else {
                        $(".cdss-drug-conflict-commom-wrap").hide()
                        if (resData.retCode == '-100010') {
                            _that.noPower = {
                                hasPower: false,
                                msg: resData.retMsg
                            }
                            _that.showNoData()
                            deleteBorder()
                        } else {
                            $(".cdss-drug-conflict-commom-wrap").hide()
                            if (resData.retCode == '-100010') {
                                _that.noPower = {
                                    hasPower: false,
                                    msg: resData.retMsg
                                }
                                _that.showNoData()
                                deleteBorder()
                            }
                        }
                    }
                },
                error: function(err) {
                    $(".cdss-drug-conflict-commom-wrap ").hide()

                }
            })

            if (data.disease && data.disease.length > 0) {
                //用药冲突常用处方、常用药物
                var commonInfo = {
                    diseaseName: data.disease[0],
                    diseaseNames: data.disease.slice(0, 1),
                    offset: 0,
                    pageSize: 50,
                    hospitalId: _that.hospitalId, //医院号
                    hospitalName: _that.hospitalName, //医院名称
                    belongCity: _that.belongCity, //城市
                    physicianId: _that.physicianId, //医生号
                    physicianName: _that.physicianName, //医生姓名
                    patientId: _that.patientId, //患者号
                    name: _that.name, //患者姓名
                    outerSerialNo: _that.outerSerialNo, //流水号
                    age: _that.age || 40,
                    gender: _that.gender,
                    diseaseTypes: ['E11.9_DM2']
                }
                if (data.disease && data.disease.length > 1) { // 医嘱页面 多个诊断
                    commonInfo.diseaseName = data.disease[0]
                }
                $('.cdss-drug-list-most-module-prescription, .cdss-drug-list-most-module-chDrugRecommend, .cdss-drug-list-most-module-chPatentDrugRecommend, .cdss-drug-list-most-commom-wrap').hide()
                if (type == 'chdrug') { // 常用中草药方推荐
                    _that.getChDrugRecommend(commonInfo, true) // 常用中草药方推荐
                } else {
                    _that.getChPatentDrugRecommend(commonInfo, true) // 常用中成药推荐
                    _that.getCommonPrescription(commonInfo, true) // 处方
                }
            } else {
                console.log('诊断结果没有疾病数据')
            }
        }
        //用法用量查询 显示药物参考用量弹框
    _that.getUsageAndDosage = function(info) {
        if (!_that.hasPower || _that.tabShow == 2) { return }
        // var hasMiniWrap=$("#cdss-mini-survey-wrap").css('display')
        // if(hasMiniWrap != 'none'){
        //     $("#cdss-mini-survey-wrap").hide()
        //     $("#cdss-drug-rec-pill").show()
        // }
        var data = {
            dosageRequest: info.dosageRequest || {},
            diagId: info.diagId || "",
            weight: info.weight,
            hospitalId: info.hospitalId || _that.hospitalId || "001",
            hospitalName: info.hospitalName || _that.hospitalName,
            belongCity: info.belongCity || _that.belongCity,
            physicianId: info.physicianId || _that.physicianId,
            physicianName: info.physicianName || _that.physicianName,
            patientId: info.patientId || _that.patientId,
            name: info.name || _that.patientId,
            outerSerialNo: info.outerSerialNo || _that.outerSerialNo,
            age: info.age || _that.age,
            gender: info.gender || _that.gender,
        }
        data.hospitalDepartment = _that.hospitalDepartment
        data.hospitalDepartmentId = _that.hospitalDepartmentId
        $('.cdss-drug-usage-and-dosage-no-access').hide()
        $.ajax({
            url: baseURL + '/diagnose/post/getUsageDosage',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(data),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {
                    var info = []
                    if (resData.data) {
                        for (var key in resData.data) {
                            console.log(key)
                            var obj = resData.data[key][0]
                            obj.drugName = key
                            info.push(obj)
                        }
                    }
                    var domStr = ''
                    var ageStr = ''
                    var age = data.age
                    var weight = ''
                    if (data.weight && data.weight != 'null' && data.weight != 'undefined') {
                        weight = data.weight
                    }
                    if (info && info.length && info.length > 0) {
                        for (var i = 0; i < info.length; i++) {
                            domStr += '<div class="cdss-drug-usage-and-dosage-item">' +
                                '<div class="cdss-drug-usage-and-dosage-item-title">' +
                                '<img src="' + webBaseURL + '/image/icon_unfold.png" class="cdss-unfold-img"/>' +
                                '<img src="' + webBaseURL + '/image/icon_unfold-rotate.png" class="cdss-rotate-img"/>' +
                                '<span>' + info[i].drugName + '</span>' +
                                '</div>'
                            domStr += '<div class="cdss-drug-usage-and-dosage-cell">'
                            if (info[i].methodType) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '用药方式：' + info[i].methodType +
                                    '</div>'
                            }
                            if (info[i].dosage) {
                                if (info[i].dosageUnit) {
                                    domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                        '剂量：' + info[i].dosage + info[i].dosageUnit +
                                        '</div>'
                                } else {
                                    domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                        '剂量：' + info[i].dosage +
                                        '</div>'
                                }
                            }
                            if (info[i].conditionStatus) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '适用状态：' + info[i].conditionStatus +
                                    '</div>'
                            }
                            if (info[i].methodAttention) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '用药注意：' + info[i].methodAttention +
                                    '</div>'
                            }
                            if (info[i].methodTime) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '用药时间：' + info[i].methodTime +
                                    '</div>'
                            }
                            if (info[i].dailyMaxDosage) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '每日最大剂量：' + info[i].dailyMaxDosage + (info[i].dailyMaxDosageUnit ? info[i].dailyMaxDosageUnit : '') +
                                    '</div>'
                            }
                            if (info[i].conditionPeople) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '人群条件：' + info[i].conditionPeople +
                                    '</div>'
                            }
                            if (info[i].frequency) {
                                domStr += '<div class="cdss-drug-usage-and-dosage-item-list">' +
                                    '频次：' + info[i].frequency +
                                    '</div>'
                            }
                            domStr += '</div>'
                            domStr += '</div>'
                        }
                        $('.cdss-drug-usage-and-dosage-ctn').empty().append(domStr)
                        $('.cdss-drug-usage-and-dosage-item-title').off('click').on('click', function() {
                            $(this).parent().children('.cdss-drug-usage-and-dosage-cell').toggle()
                            $(this).toggleClass('active')
                        })
                        $('.cdss-drug-usage-and-dosage-item-title').eq(0).click()
                        $('.cdss-drug-usage-and-dosage-wrap').show()
                        deleteBorder()
                        $(".cdss-prescription-detail-wrap").show()
                        $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                                $(".cdss-prescription-detail-wrap").hide()
                            })
                            // showTab('left')
                    } else {
                        var str = '<div class="cdss-no-data-dosage" style="display: block;">暂无药物用量信息</div>'
                        $('.cdss-drug-usage-and-dosage-ctn').empty().append(str)
                    }
                } else {
                    if (resData.retCode == '-100010') {
                        $(".cdss-prescription-detail-wrap").show()
                            // $('.cdss-drug-usage-and-dosage-wrap').show()
                        $('#cdss-prescription-detail-close-btn img').off('click').on('click', function() {
                            $(".cdss-prescription-detail-wrap").hide()
                        })
                        deleteBorder()
                            // $('.cdss-drug-usage-and-dosage-no-access').empty().html(resData.retMsg).show()
                    }
                }
                _that.showNoPrescription()
            },
            error: function(err) {

            }
        })
    }

    //添加QR-DOM
    _that.addQRDom = function() {
        var QRDom = '<div class="cdss-qr-img-wrap" id="cdss-qr-img-wrap">' +
            '<div class="cdss-title">' +
            '<span class="titlename">患教二维码</span>' +
            '<span class="cdssclose" id="cdss-qr-img-close">' +
            '<img src="' + webBaseURL + '/image/close.png" alt="">' +
            '</span>' +
            '</div>' +
            '<div class="cdss-qr-quest-ctn">' +
            '<img src="" id="cdss-qr-img-code" />' +
            '</div>' +
            '</div>'
        $("body").append(QRDom)
        $("#cdss-qr-img-close").on("click", function() {
            $("#cdss-bg").hide()
            $(".cdss-qr-img-wrap").hide();
        })
    }
    _that.addQRDom()

    //患教二维码接口 todo url需要确定
    _that.generatePatientQRCode = function(QRData) {
        if (!_that.hasPower) { return }
        $.ajax({
            url: baseURL + '/qrCode/post/qRCodeGenerate?url=' + webBaseURL + '/report.html?patient=',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(QRData),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                $("#cdss-bg").show()
                $("#cdss-qr-img-wrap").show()
                $("#cdss-qr-img-code").attr('src', 'data:image/png;base64,' + resData.data)
            },
            error: function(err) {

            }
        })
    }

    //埋点方法封装
    _that.REC = function(data) {
        if (!_that.hasPower) { return }
        var hosTime = new Date()
        var m1 = parseInt('' + hosTime.getMonth(), 10) + 1
        var s1 = ''
        if (m1 < 10) {
            s1 = '0' + m1
        } else {
            s1 = '' + m1
        }
        var d1 = parseInt('' + hosTime.getDate(), 10)
        var sd1 = ''
        if (d1 < 10) {
            sd1 = '0' + d1
        } else {
            sd1 = '' + d1
        }
        var h1 = parseInt('' + hosTime.getHours(), 10)
        var sh1 = ''
        if (h1 < 10) {
            sh1 = '0' + h1
        } else {
            sh1 = '' + h1
        }
        var min1 = parseInt('' + hosTime.getMinutes(), 10)
        var sm1 = ''
        if (min1 < 10) {
            sm1 = '0' + min1
        } else {
            sm1 = '' + min1
        }
        var Yhos = hosTime.getFullYear()
        var Monthhos = s1
        var Dhos = sd1
        var Hhos = sh1
        var Minhos = sm1
        var nowTimeString = Yhos + '-' + Monthhos + '-' + Dhos + ' ' + Hhos + ':' + Minhos + ':00'
        var info = {
            page: "CDSS SDK页面",
            pageElement: "整体",
            operation: "",
            deviceId: "",
            entryTime: nowTimeString,
            leaveTime: nowTimeString,
            hospitalId: _that.hospitalId,
            hospitalName: _that.hospitalName,
            belongCity: _that.belongCity,
            physicianId: _that.physicianId,
            physicianName: _that.physicianName,
            patientId: _that.patientId,
            name: _that.name,
            outerSerialNo: _that.outerSerialNo,
            age: _that.age || 40,
            gender: _that.gender
        }
        if (data.event) {
            info.event = data.event
        }
        if (data.page) {
            info.page = data.page
        }
        if (data.pageElement) {
            info.pageElement = data.pageElement
        }
        if (data.operation1) {
            info.operation1 = data.operation1
        }
        if (data.operation2) {
            info.operation2 = data.operation2
        }
        if (data.deviceId) {
            info.deviceId = data.deviceId
        }
        info.hospitalDepartment = _that.hospitalDepartment
        info.hospitalDepartmentId = _that.hospitalDepartmentId
        $.ajax({
            url: baseURL + '/userEvent/post/save',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(info),
            contentType: 'application/json',
            scriptCharset: 'utf-8',
            beforeSend: function(request) {
                request.setRequestHeader('Content-Type', 'application/json')
                request.setRequestHeader('channel-id', channelId)
                request.setRequestHeader('institution-id', institutionId)
            },
            success: function(resData) {
                if (resData.retCode == '999999') {} else {

                }
            },
            error: function(err) {

            }
        })
    }

    // info下json数组去重
    function setArray(array, key) {
        // console.log(array);
        var result = [array[0]]
        for (var i = 1; i < array.length; i++) {
            var item = array[i]
            var repeat = false
            for (var j = 0; j < result.length; j++) {
                if (item[key] == result[j][key]) {
                    repeat = true
                    break
                }
            }
            if (!repeat) {
                result.push(item)
            }
        }
        return result
    }

    // 查找符合条件的询证数据并进行后续操作
    function searchEv(data, name) {
        var res = {};
        // 用药方案返回null时暂定显示type为CVD的循证,null是string类型...
        if (name === 'null') {
            name = 'CVD';
        }
        if (data) {
            // 符合条件并输出
            for (var i = 0; i < data.length; i++) {
                if (data[i].therapType == name) {
                    res = data[i];
                }
            }
            if (name === 'null') {
                res.pvalue = {}
            }
            return res;
        }
    }

    // 处理相似病患的表格
    function simTable(feature, profile, allPeople, pvalue) {
        if (!pvalue) {
            pvalue = { "sex": "no", "age": "no", "year": "no" };
            var pvalueLength = countProperty(profile);
            if (pvalueLength > 3) {
                for (var pi = 3; pi < pvalueLength; pi++) {
                    pvalue["z" + pi] = "yes";
                }
            }
        }
        $(".cdss-envidence-ctn-sim1").html("<div class='cdss-envidence-sim-color'>特征</div>");
        $(".cdss-envidence-ctn-sim2").html("<div class='cdss-envidence-sim-color'>相似病患</div>");
        $(".cdss-envidence-ctn-sim3").html("<div class='cdss-envidence-sim-color'>全人群患者</div>");
        $(".cdss-envidence-ctn-sim4").html("<div class='cdss-envidence-sim-color'>显著区别于他组</div>");
        for (var i = 0; i < arguments.length; i++) {
            var str = "";
            for (var key in arguments[i]) {
                if (key == "gender") {
                    if (i == 0) {
                        str = str + "<div class='cdss-envidence-sim-gender'>性别</div>";
                    } else if (i == 3) {
                        str = str + "<div class='cdss-envidence-sim-gender'>" + arguments[i][key] + "</div>"
                    } else {
                        str = str + "<div class='cdss-envidence-sim-gender'><span>" + arguments[i][key]['male'] + "男</span>" + "<span>" + arguments[i][key]['female'] + "女</span>" + "</div>";
                    }
                } else {
                    str = str + "<div>" + arguments[i][key] + "</div>";
                }
            }
            $(".cdss-envidence-ctn-sim" + (i + 1)).append(str);
        }
    }

    // 饼状图方法
    function drawPieS(para) {
        var myPies = echarts.init(document.getElementById('cdss-envidence-sim-pie'))
        myPies.setOption({
            formatter: function(params) {
                var newParamsName = '' // 最终拼接成的字符串
                var paramsNameNumber = params.length // 实际标签的个数
                var provideNumber = 4 // 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                    /**
                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                     */
                    // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                    /** 循环每一行,p表示行 */
                    for (var p = 0; p < rowNumber; p++) {
                        var tempStr = '' // 表示每一次截取的字符串
                        var start = p * provideNumber // 开始截取的位置
                        var end = start + provideNumber // 结束截取的位置
                            // 此处特殊处理最后一行的索引值
                        if (p == rowNumber - 1) {
                            // 最后一次不换行
                            tempStr = params.substring(start, paramsNameNumber)
                        } else {
                            // 每一次拼接字符串并换行
                            tempStr = params.substring(start, end) + '\n'
                        }
                        newParamsName += tempStr // 最终拼成的字符串
                    }
                } else {
                    // 将旧标签的值赋给新标签
                    newParamsName = params
                }
                // 将最终的字符串返回
                return newParamsName
            },
            series: [{
                //   name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                // data: datas,
                data: [{
                        value: para.detemirValue,
                        name: para.detemir,
                        itemStyle: { color: '#000000' }
                    },
                    {
                        value: para.glargineValue,
                        name: para.glargine,
                        itemStyle: { color: '#808080' }
                    },
                    {
                        value: para.recombinantValue,
                        name: para.recombinant,
                        itemStyle: { color: '#D3D3D3' }
                    }
                ],
                //
                label: {
                    normal: {
                        textStyle: {
                            color: '#000000', // 改变标示文字的颜色
                            fontSize: 10
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 5, // 改变标示线的长度
                        lineStyle: {
                            color: '#000000' // 改变标示线的颜色
                        }
                    }
                }
                //
            }]
        })
    }

    // 柱状图方法
    function drawBarS(para) {
        var myChart = echarts.init(document.getElementById('cdss-envidence-sim-bar'));
        myChart.setOption({
            xAxis: {
                data: [para.detemir, para.glargine, para.recombinant],
                //
                axisLabel: {
                    // 坐标轴刻度标签的相关设置。
                    formatter: function(params) {
                        var newParamsName = '' // 最终拼接成的字符串
                        var paramsNameNumber = params.length // 实际标签的个数
                        var provideNumber = 4 // 每行能显示的字的个数
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                        if (paramsNameNumber > provideNumber) {
                            /** 循环每一行,p表示行 */
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = '' // 表示每一次截取的字符串
                                var start = p * provideNumber // 开始截取的位置
                                var end = start + provideNumber // 结束截取的位置
                                    // 此处特殊处理最后一行的索引值
                                if (p == rowNumber - 1) {
                                    // 最后一次不换行
                                    tempStr = params.substring(start, paramsNameNumber)
                                } else {
                                    // 每一次拼接字符串并换行
                                    tempStr = params.substring(start, end) + '\n'
                                }
                                newParamsName += tempStr // 最终拼成的字符串
                            }
                        } else {
                            // 将旧标签的值赋给新标签
                            newParamsName = params
                        }
                        // 将最终的字符串返回
                        return newParamsName
                    }
                }
                //
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %'
                },
                show: true
            }],
            series: [{
                //   name: '销量',
                type: 'bar',
                data: [para.detemirValue, para.glargineValue, para.recombinantValue],
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: '#005482',
                        label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            textStyle: {
                                // 数值样式
                                color: 'black',
                                fontSize: 10
                            },
                            formatter: '{b}\n{c}%'
                        }
                    }
                }
            }],
            grid: {
                x: 15,
                y: 45,
                x2: 15,
                y2: 25,
                containLabel: true
            }
        })
    }

    // 饼状图方法gen
    function drawPie(para) {
        // 处理para传过来的值给series
        var seriesArr = [];
        var counter = 0;
        var colorArr = ['#005482', '#808080', '#A9A9A9', '#D3D3D3', 'F5F5F5'];
        for (var ser in para) {
            var tempJsoner = {}
            if (ser !== 'categray') {
                tempJsoner.value = para[ser].sameRecipelPerc;
                tempJsoner.name = ser + para[ser].sameRecipelPerc + '%';
                tempJsoner.itemStyle = { color: '#000000' };
                tempJsoner.itemStyle.color = colorArr[counter];
                seriesArr.push(tempJsoner);
                counter++;
            }
        }
        var myPies = echarts.init(document.getElementById('cdss-envidence-sim-pie'));
        myPies.setOption({
            series: [{
                //   name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: seriesArr,
                label: {
                    normal: {
                        textStyle: {
                            color: '#000000', // 改变标示文字的颜色
                            fontSize: 8
                        },
                        formatter: function(v) {
                            var text = v.name
                            return text.length < 10 ? text : text.slice(0, 10) + '\n' + text.slice(10)
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 5, // 改变标示线的长度
                        lineStyle: {
                            color: '#000000' // 改变标示线的颜色
                        }
                    }
                }
                //
            }]
        })
    }

    // 柱状图方法gen
    function drawBar(para) {
        // 处理para传过来的值给series
        var seriesArr = [];
        var xData = [];
        for (var ser in para) {
            if (ser !== 'categray') {
                if (para[ser].goodPercent == "") {
                    para[ser].goodPercent = 0;
                }
                xData.push(ser)
                seriesArr.push(para[ser].goodPercent);
            }
        }
        // console.log(seriesArr);
        var myChart = echarts.init(document.getElementById('cdss-envidence-sim-bar'));
        myChart.setOption({
            xAxis: {
                data: xData,
                //
                axisLabel: {
                    // 坐标轴刻度标签的相关设置。
                    formatter: function(params) {
                        var newParamsName = '' // 最终拼接成的字符串
                        var paramsNameNumber = params.length // 实际标签的个数
                        var provideNumber = 4 // 每行能显示的字的个数
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                        if (paramsNameNumber > provideNumber) {
                            /** 循环每一行,p表示行 */
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = '' // 表示每一次截取的字符串
                                var start = p * provideNumber // 开始截取的位置
                                var end = start + provideNumber // 结束截取的位置
                                    // 此处特殊处理最后一行的索引值
                                if (p == rowNumber - 1) {
                                    // 最后一次不换行
                                    tempStr = params.substring(start, paramsNameNumber)
                                } else {
                                    // 每一次拼接字符串并换行
                                    tempStr = params.substring(start, end) + '\n'
                                }
                                newParamsName += tempStr // 最终拼成的字符串
                            }
                        } else {
                            // 将旧标签的值赋给新标签
                            newParamsName = params
                        }
                        // 将最终的字符串返回
                        return newParamsName
                    }
                }
                //
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %'
                },
                show: true
            }],
            series: [{
                //   name: '销量',
                type: 'bar',
                data: seriesArr,
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: '#005482',
                        label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            textStyle: {
                                // 数值样式
                                color: 'black',
                                fontSize: 10
                            },
                            formatter: '{c}%'
                                // formatter: '{b}\n{c}%'
                        }
                    }
                }
            }],
            grid: {
                x: 15,
                y: 45,
                x2: 15,
                y2: 25,
                containLabel: true
            }
        })
    }

    // obj属性个数
    function countProperty(obj) {
        var count = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                count++;
            }
        }
        return count;
    }
    // 校验是否有权限
    _that.checkPower = function() {
        var data = {
            hospitalId: _that.hospitalId,
            hospitalName: _that.hospitalName
        }
        _that.pendingAuth = false
        _that.ajax({
            url: '/hospitalAuth/doAuth',
            data: data,
            success: function(res) {
                if (res.retCode == '999999') {
                    if (res.data.code == '999999') { // 校验通过
                        _that.hasPower = true
                        if (_that.hasPower) { // 有访问权限
                            _that.shortName = res.data.hospitalInfo.shortName
                            _that.afAuth = res.data.afAuth || false
                            _that.creatQuestionAndRecommendPanel()
                            _that.addDrugRecPill()
                            if(!window.loadCdss){
                                _that.addDateTimeCSSAndJS()
                                window.loadCdss = true
                            }
                            _that.initInfection()
                            _that.searchType1 = '搜' + (res.data.searchType ? res.data.searchType : '疾病/症状/药品/检查/病例/指南/手术')
                            _that.searchType = '搜' + (res.data.searchType ? res.data.searchType : '疾病/症状/药品/检查/病例/指南/手术')
                            var length = _that.searchType.length
                            if (length > 18) {
                                _that.searchType = _that.searchType.substring(0, 18) + '...'
                            }
                        }
                    } else { // 校验不通过
                        _that.hasPower = false
                        _that.showCdssAlert(res.data.msg)
                    }
                }
                console.log(res)
                if (res.code == 401) {
                    window.location.href = 'login.html'
                }
                _that.pendingAuth = true
            },
            error: function(err) {
                _that.pendingAuth = true
            }
        })
    }
    _that.checkPower()
        // 病历质控
    _that.caseQc = function(patientInfo) {
        if (_that.tabShow == 1) { return }
        var data = {
            subjComplaint: patientInfo.mainComplaint, // 主诉
            pastMedicalHistory: _that.pastHistory, // 既往史
            age: _that.age,
            gender: _that.gender,
            hpi: _that.hisPresent, // 现病史
            diagnosis: _that.diagnosis ? _that.diagnosis[0] : null, // 诊断
            startAt: patientInfo.hospitalizedDate || null,
            endAt: patientInfo.endAt || null,
            medicalRecord: patientInfo.medicalRecord || null // 病例类型
        }
        $('.cdss-caseQc-wrap').hide()
        $('.cdss-infectious-Diseases-wrap').hide()
        _that.ajax({
            url: '/decision/post/caseQc',
            data: data,
            success: function(res) {
                _that.noPower.hasPower = true
                if (res.retCode == '999999') {
                    if ((res.data.contentQc && res.data.contentQc.length) || (res.data.timeQc && res.data.timeQc.length)) {
                        var html = '',
                            contentQc = res.data.contentQc,
                            timeQc = res.data.timeQc
                        var typeArr = [{ type: 'subjComplaint', name: '主诉' }, { type: 'hpi', name: '现病史' }, { type: 'pastMedicalHistory', name: '既往史' }]
                        var contentArr = [{ type: 'wrong_character', name: '错别字' }, { type: 'inconsistent', name: '前后矛盾' }, { type: 'relevance', name: '关联性' }]
                        if (timeQc && timeQc.length) {
                            html += '<li>' +
                                '<div class="cdss-caseQc-li-header"><img src=' + webBaseURL + '/image/icon_binglijishixing.png /> 及时性</div>' +
                                '<ul class="cdss-caseQc-childul">'
                            for (var i = 0; i < timeQc.length; i++) {
                                html += '<li>' + timeQc[i].desc + '</li>'
                            }
                            html += '</ul>' +
                                '</li>'
                        }
                        if (contentQc && contentQc.length) {
                            for (var i = 0; i < contentQc.length; i++) {
                                var typeName = ''
                                $.each(typeArr, function(index, item) {
                                    if (item.type == contentQc[i].type) {
                                        typeName = item['name']
                                    }
                                })
                                html += '<li>' +
                                    '<div class="cdss-caseQc-li-header"><img src=' + webBaseURL + '/image/icon_bingli.png /> ' + typeName + '</div>' +
                                    '<ul class="cdss-caseQc-childul">'
                                for (var j = 0; j < contentQc[i].errorMessage.length; j++) {
                                    var messageItem = contentQc[i].errorMessage[j]
                                    var contentName = ''
                                    $.each(contentArr, function(index, item) {
                                        if (item.type == messageItem.type) {
                                            contentName = item['name']
                                        }
                                    })
                                    html += '<li>' +
                                        '<div class="header">【' +
                                        contentName + '】' +
                                        '</div>' +
                                        '<div classs="cdss-drug-conflict-body">' +
                                        messageItem.description +
                                        '</div>' +
                                        '</li>'
                                }
                                html += '</ul>' +
                                    '</li>'
                            }
                        }
                        $('.cdss-caseQc-ctn').empty().html(html)
                        $('.cdss-caseQc-wrap').show()
                        $('.cdss-tab-icon-red').show()
                    }
                } else if (res.retCode == '-100010') {
                    _that.noPower = {
                        hasPower: false,
                        msg: res.retMsg
                    }
                }
                _that.showNoData()
                deleteBorder()
            },
            error: function(err) {}
        })
    }

    // 手术智能提醒
    _that.surgeryRemind = function(list) {
            if (_that.tabShow == 1) { return }
            var data = {
                operationList: list
            }
            _that.ajax({
                url: '/decision/post/operationAdvice',
                data: data,
                success: function(res) {
                    _that.noPower.hasPower = true
                    if (res.retCode == '999999') {
                        if (res.data && res.data.length) {
                            var html = '';
                            $.each(res.data, function(index, data) {
                                var preoperativePreparation = data.preoperativePreparation,
                                    reminds = data.reminds,
                                    perioperativeMessages = data.perioperativeMessages,
                                    complications = data.complications
                                if (preoperativePreparation && preoperativePreparation.length) {
                                    html += '<li><div class="cdss-surgeryRemind-li-header"><img src=' + webBaseURL + '/image/icon_bingli.png /> 术前辅助检查</div>' +
                                        '<div class="cdss-surgeryRemind-child">'
                                    var totalStr = preoperativePreparation.join('')
                                    if (totalStr.length < 60) {
                                        html += '<span class="cdss-surgeryRemind-inspect-diagmsg-brefmsg">' +
                                            totalStr +
                                            '</span>'
                                    } else {
                                        var brefStr = totalStr.slice(0, 60)
                                        html += '<span class="cdss-surgeryRemind-inspect-diagmsg-brefmsg">' +
                                            brefStr + '...' +
                                            '</span>' +
                                            '<span class="cdss-surgeryRemind-inspect-diagmsg-moremsg">' +
                                            totalStr +
                                            '</span>' +
                                            '<div class="cdss-surgeryRemind-inspect-diagmsg-showmore">更多' +
                                            '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                            '</div>' +
                                            '<div class="cdss-surgeryRemind-inspect-diagmsg-hidemore">隐藏' +
                                            '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                            '</div>'
                                    }
                                    html += '</div></li>'
                                }
                                if (reminds && reminds.length) {
                                    html += '<li><div class="cdss-surgeryRemind-li-header"><img src=' + webBaseURL + '/image/icon_bingli.png /> 高风险手术提醒</div>' +
                                        '<div class="cdss-surgeryRemind-child">'
                                    for (var i = 0; i < reminds.length; i++) {
                                        html += '<span>手术级别：' + reminds[i].operationLevel + '级</span>'
                                    }
                                    html += '</div></li>'
                                }
                                if (perioperativeMessages && perioperativeMessages.length) {
                                    html += '<li><div class="cdss-surgeryRemind-li-header"><img src=' + webBaseURL + '/image/icon_bingli.png /> 围手术期抗菌药物选择</div>' +
                                        '<div class="cdss-surgeryRemind-child">'
                                    for (var i = 0; i < perioperativeMessages.length; i++) {
                                        html += '<p>切口类别：' + perioperativeMessages[i].incisionCategory + '级</p>'
                                        html += '<p>污染菌：' + perioperativeMessages[i].bacterium + '</p>'
                                        html += '<p>抗菌药物：' + perioperativeMessages[i].drugs.join('、') + '</p>'

                                    }
                                    html += '</div></li>'
                                }
                                if (complications && complications.length) {
                                    html += '<li><div class="cdss-surgeryRemind-li-header"><img src=' + webBaseURL + '/image/icon_bingli.png /> 术后并发症</div>' +
                                        '<div class="cdss-surgeryRemind-child">'
                                        // for(var i=0;i<complications.length;i++){
                                        //     html+='<span>'+complications[i]+'</span>'
                                        // }
                                    var totalStr = complications.join('')
                                    if (totalStr.length < 60) {
                                        html += '<span class="cdss-complications-inspect-diagmsg-brefmsg">' +
                                            totalStr +
                                            '</span>'
                                    } else {
                                        var brefStr = totalStr.slice(0, 60)
                                        html += '<span class="cdss-complications-inspect-diagmsg-brefmsg">' +
                                            brefStr + '...' +
                                            '</span>' +
                                            '<span class="cdss-complications-inspect-diagmsg-moremsg">' +
                                            totalStr +
                                            '</span>' +
                                            '<div class="cdss-complications-inspect-diagmsg-showmore">更多' +
                                            '<img src="' + webBaseURL + '/image/arrow.png" />' +
                                            '</div>' +
                                            '<div class="cdss-complications-inspect-diagmsg-hidemore">隐藏' +
                                            '<img src="' + webBaseURL + '/image/arrow-rotate.png" alt="" class="cdss-rotate-img">' +
                                            '</div>'
                                    }
                                    html += '</div></li>'
                                }
                            })
                            $('.cdss-surgeryRemind-ctn').empty().html(html)
                            $(".cdss-surgeryRemind-inspect-diagmsg-showmore").off("click").on("click", function() {
                                $(".cdss-surgeryRemind-inspect-diagmsg-brefmsg").hide()
                                $(".cdss-surgeryRemind-inspect-diagmsg-moremsg").show()
                                $(".cdss-surgeryRemind-inspect-diagmsg-hidemore").show()
                                $(".cdss-surgeryRemind-inspect-diagmsg-showmore").hide()
                            })
                            $(".cdss-surgeryRemind-inspect-diagmsg-hidemore").off("click").on("click", function() {
                                $(".cdss-surgeryRemind-inspect-diagmsg-brefmsg").show()
                                $(".cdss-surgeryRemind-inspect-diagmsg-moremsg").hide()
                                $(".cdss-surgeryRemind-inspect-diagmsg-showmore").show()
                                $(".cdss-surgeryRemind-inspect-diagmsg-hidemore").hide()
                            })
                            $(".cdss-complications-inspect-diagmsg-showmore").off("click").on("click", function() {
                                $(".cdss-complications-inspect-diagmsg-brefmsg").hide()
                                $(".cdss-complications-inspect-diagmsg-moremsg").show()
                                $(".cdss-complications-inspect-diagmsg-hidemore").show()
                                $(".cdss-complications-inspect-diagmsg-showmore").hide()
                            })
                            $(".cdss-complications-inspect-diagmsg-hidemore").off("click").on("click", function() {
                                $(".cdss-complications-inspect-diagmsg-brefmsg").show()
                                $(".cdss-complications-inspect-diagmsg-moremsg").hide()
                                $(".cdss-complications-inspect-diagmsg-showmore").show()
                                $(".cdss-complications-inspect-diagmsg-hidemore").hide()
                            })
                            $('.cdss-surgeryRemind-wrap').show()
                            $('.cdss-tab-icon-red').show()
                        }
                        _that.showNoData()
                        deleteBorder()
                    } else if (res.retCode == '-100010') {
                        _that.noPower = {
                            hasPower: false,
                            msg: res.retMsg
                        }
                        _that.showNoData()
                        deleteBorder()
                    }

                },
                error: function(err) {}
            })
        }
        // 医嘱执行提醒
    _that.doctorAdviceRemind = function(data) {
            if (_that.tabShow == 1) { return }
            var data = {
                patientInfo: {
                    age: _that.age,
                    gender: _that.gender == '男' ? 1 : 0,
                    weight: _that.weight || data.weight || null,
                }, //患者基本信息
                advices: data.advices, //医嘱信息
                hospitalId: _that.hospitalId,
                diseases: data.diseases //疾病信息
            }
            _that.ajax({
                url: '/decision/post/doctorAdvice',
                data: data,
                success: function(res) {
                    var arr = ['cdss-check-conflict-commom-wrap', 'cdss-drug-conflict-commom-wrap', 'cdss-caseQc-wrap', 'cdss-surgeryRemind-wrap',
                        'cdss-transfusionRemind-wrap', 'cdss-nursing-commom-wrap', 'cdss-nursing-department-wrap', 'cdss-transfusion-department-wrap'
                    ]
                    $.each(arr, function(index, item) {
                        $('.' + item).hide()
                    })
                    if (res.retCode == '999999') {
                        var highRiskDrugs = res.data.highRiskDrugs,
                            inspectionRemind = res.data.inspectionRemind,
                            conflictWarningOrignal = res.data.conflictWarningOrignal
                        console.log(inspectionRemind)
                        if ((highRiskDrugs && highRiskDrugs.length) || (inspectionRemind && inspectionRemind.length) || (conflictWarningOrignal)) {
                            var html = ''
                            if (highRiskDrugs && highRiskDrugs.length) {
                                html += '<li><div class="cdss-doctorAdvice-li-header"><img src=' + webBaseURL + '/image/icon_yizhu.png /> 高风险医嘱</div>' +
                                    '<div class="cdss-doctorAdvice-child">将要执行以下高风险医嘱，请注意核对：' +
                                    '<p class="cdss-doctorAdvice-child-wraing">' + highRiskDrugs.join('、') + '</p>'
                                html += '</div></li>'
                            }
                            if (conflictWarningOrignal) {
                                var data = []
                                for (var key in conflictWarningOrignal) {
                                    var obj = {
                                        commonName: key,
                                        list: conflictWarningOrignal[key]
                                    }
                                    data.push(obj)
                                }
                                html += '<li class="cdss-conflictWarningOrignal"><div class="cdss-doctorAdvice-li-header"><img src=' + webBaseURL + '/image/icon_yongyaohelixing.png /> 用药合理性</div>'
                                for (var i = 0; i < data.length; i++) {
                                    html += '<div class="cdss-drug-conflict-cell"><div class="cdss-drug-conflict-name">' +
                                        data[i].commonName +
                                        '</div><ul>'
                                    for (var j = 0; j < data[i].list.length; j++) {
                                        var hasmessage = ''
                                        if (!data[i].list[j].message && !data[i].list[j].monograph) {
                                            hasmessage = 'hasmessage'
                                        }
                                        html += '<li>'
                                        html += '<div class="header ' + hasmessage + '">' +
                                            '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                            (data[i].list[j].type == 'DDI' ? ('【' + data[i].list[j].typeDesc + '】：' + data[i].list[j].opponent) : ('【' + data[i].list[j].typeDesc + '】')) +
                                            '</div>'
                                        html += '<div class="cdss-drug-conflict-body">' + (data[i].list[j].message || data[i].list[j].monograph || '') + '</div>';
                                        html += '</li>';
                                    }
                                    html += '</ul></div>';
                                }
                                html += '</li>'
                            }
                            if (inspectionRemind && inspectionRemind.length) {
                                var arr = [
                                    { type: 'salivette', name: '采集管要求' },
                                    { type: 'capacity', name: '容量要求' },
                                    { type: 'acquisitionTime', name: '采集时间要求' },
                                    { type: 'operation', name: '采集操作要求' },
                                    { type: 'afterAcquisition', name: '采集后处理' },
                                    { type: 'careAfterCollection', name: '采集后应注意' },
                                    { type: 'inspectionTime', name: '送检时间要求' },
                                    { type: 'testTime', name: '检验时间要求' },
                                    { type: 'other', name: '其他' },
                                ]
                                html += '<li><div class="cdss-doctorAdvice-li-header"><img src=' + webBaseURL + '/image/icon_jianyanremind.png /> 检验提醒</div>'
                                for (var i = 0; i < inspectionRemind.length; i++) {
                                    console.log(i)
                                    var message = inspectionRemind[i].message
                                    html += '<div class="cdss-doctorAdvice-cell">' +
                                        '<div class="cdss-doctorAdvice-cell-header">' +
                                        '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                        inspectionRemind[i].project + '</div>'
                                    for (var j = 0; j < message.length; j++) {
                                        $.each(arr, function(index, item) {
                                            if (item && message[j][item['type']]) {
                                                html += '<p>' + item['name'] + '：' + message[j][item['type']] + '</p>'
                                            }
                                        })
                                    }
                                    html += '</div>'
                                }
                                html += '</li>'
                            }
                            $('.cdss-doctorAdvice-ctn').empty().html(html)
                            $('.cdss-doctorAdvice-wrap').show()
                            $('.cdss-tab-icon-red').show()
                        } else {
                            $('.cdss-doctorAdvice-wrap').hide()
                        }
                    } else if (res.retCode == '-100010') {
                        $('.cdss-doctorAdvice-wrap').show()
                        $('.cdss-tab-icon-red').show()
                        $('.cdss-doctorAdvice-no-access').empty().html(res.retMsg).show()
                    }
                    _that.showNoData()
                    deleteBorder()
                },
                error: function(err) {}
            })
        }
        // 护理智能提醒 careRemind
    _that.careRemind = function(data) {
        if (_that.tabShow == 1) { return }
        var data = {
            age: _that.age,
            gender: _that.gender,
            nursingLevel: data.nursingLevel, // 护理级别，0 特级护理
            nursingRecord: data.nursingRecord // 护理记录
        }
        _that.ajax({
            url: '/decision/post/nurseAdvise',
            data: data,
            success: function(res) {
                _that.noPower.hasPower = true
                if (res.retCode == '999999') {
                    if (res.data) {
                        var riskRecord = res.data.riskRecord
                        if (riskRecord && riskRecord.length) {
                            var html = ''
                            for (var i = 0; i < riskRecord.length; i++) {
                                var recordNum = riskRecord[i].recordNum
                                html += '<div class="cdss-nurseAdvise-li-header">' +
                                    '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />' +
                                    recordNum + '</div>'
                                for (var j = 0; j < riskRecord[i].nursingProjects.length; j++) {
                                    var item = riskRecord[i].nursingProjects[j]
                                    html += '<li>' + item.name + "：" + item.value + item.unit + '</li>'
                                }
                            }
                            $('.cdss-nursing-ctn').empty().html(html)
                            $('.cdss-nursing-commom-wrap').show()
                            $('.cdss-tab-icon-red').show()
                            _that.showNoData()
                            deleteBorder()
                        }
                    }
                } else if (res.retCode == '-100010') {
                    _that.noPower = {
                        hasPower: false,
                        msg: res.retMsg
                    }
                    _that.showNoData()
                    deleteBorder()
                }

            },
            error: function(err) {}
        })
    }
    _that.awaitCdssEvent = function(eventType, data) {
            if ($('.cdss-container').length && ($(".cdss-container").css("background-color") == "rgb(255, 255, 255)" || $(".cdss-container").css("background-color") == "#ffffff")) {
                _that[eventType](data)
            } else {
                var ishad = false
                $.each(_that.eventList, function(index, item) {
                    if (item.eventType == eventType) { ishad = true }
                })
                if (!ishad) {
                    _that.eventList.push({
                        eventType: eventType,
                        eventData: data
                    })
                }
            }
        }
        // 输血禁忌提醒 transfusionRemind
    _that.transfusionRemind = function(datas) {
            if (_that.tabShow == 1) { return }
            var data = {
                patientInfo: {
                    age: datas.patientInfo.age || _that.age,
                    gender: datas.patientInfo.gender || _that.gender
                },
                bloodType: datas.bloodType
            }
            _that.ajax({
                url: '/decision/post/transfuseAdvice',
                data: data,
                success: function(res) {
                    _that.noPower.hasPower = true
                    if (res.retCode == '999999') {
                        var html = ''
                        for (var i = 0; i < res.data.length; i++) {
                            html += '<div class="cdss-transfusionRemind-content">'
                            html += '<div class="cdss-transfusionRemind-bloodType">' +
                                '<img class="cdss-miss-check-content-line-img" src="' + webBaseURL + '/image/ic_warning@2x.png" />输血类型：' +
                                res.data[i].bloodType + '</div>'
                            html += '<div>禁忌症：' + res.data[i].contraindication.join('；') + '</div>'
                            html += '</div>'
                        }
                        $('.cdss-transfusionRemind-ctn').empty().html(html)
                        $('.cdss-transfusionRemind-wrap').show()
                        $('.cdss-transfusionRemind-ctn').empty().html(html)
                        $('.cdss-transfusionRemind-wrap').show()
                        $('.cdss-tab-icon-red').show()
                        _that.showNoData()
                        deleteBorder()
                    } else if (res.retCode == '-100010') {
                        _that.noPower = {
                            hasPower: false,
                            msg: res.retMsg
                        }
                        _that.showNoData()
                        deleteBorder()
                    }

                },
                error: function(err) {}
            })
        }
        // 说明书快捷入口
    _that.getInstructions = function(arr) {
            if (arr && arr.length) {
                var html = ''
                $.each(arr, function(index, item) {
                    html += '<div class="cdss-instruction-commom-cell">' +
                        item.keyword +
                        '<img src=' + webBaseURL + '/image/icon_diseasedetail.png class="cdss-instruction-commom-cell-icon" keyword=' + item.keyword + ' type=' + item.type + ' />' +
                        '</div>'
                })
                $('.cdss-instruction-commom-ctn').empty().html(html)
                $('.cdss-instruction-commom-wrap').show()
                $('.cdss-prescription-detail-wrap').show()
                _that.showNoPrescription()
                $('.cdss-instruction-commom-cell-icon').off('click').on('click', function() {
                    var keyword = $(this).attr('keyword')
                    var type = $(this).attr('type')
                    var mdData = {
                        event: "说明书快捷入口说明书打开",
                        page: "疾病诊疗详情页",
                        pageElement: "快捷入口说明书图标",
                        operation1: '药品',
                        operation2: keyword
                    }
                    _that.REC(mdData)
                        // if(type == 'drug'){ // 西药
                    _that.getMedicalInfo({ type: type, keyword: keyword })
                        // }
                        //  else if(type == 'ch_medicine'){
                        //     _that.getChDrugInfo({drugID: drugID, drugType: 'ch_medicine',drugName: drugName}) // 中草药
                        // }else if(type == 'ch_patent_medicine'){
                        //     _that.getChDrugInfo({drugID: drugID, drugType: 'ch_patent_medicine',drugName: drugName}) // 中成药
                        // }
                })
            } else {
                $('.cdss-instruction-commom-wrap').hide()
            }
    }
        // 我这边暂时是这样命名的
        // 病历质控 recordsQuality
        // 手术智能提醒 surgeryRemind
        // 医嘱执行提醒 doctorAdviceRemind
        // 输血禁忌提醒 transfusionRemind
        // 手术评估 surgeryAssessment
        // 护理智能提醒 careRemind
        // 护理评估 careAssessment

    // 清除cdss dom
    _that.destoryCdss = function () {  
        $('body').find("[class*='cdss-']").remove()
    }
    window.destoryCdss = _that.destoryCdss
    // 最小化cdss显示面板
    _that.miniCdss = function () {  
        $('#cdss-drug-rec-pill').show()
        $(_that.diagDom).hide()
        if(window['toggleAssistPanel']){toggleAssistPanel('show')}
    }
}

export { PACdss };