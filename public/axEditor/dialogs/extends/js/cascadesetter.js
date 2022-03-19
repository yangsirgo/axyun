$(document).on ("click",function (event){
    var utils = AX.dom.domUtils;
    var target = event.target;
    // 点击到了 删除按钮
    if ($(target).hasClass('deleteBtn')){
        var itemNode = utils.findParent(target,function (node){
            return $(node).hasClass('result-presentation');
        },true);
        // var itemNode = $(target).parent();
        if (itemNode && $(itemNode).hasClass('selected')) {
            clearPage ();
        }
        rules.splice($(".row-content-result").find(itemNode).index(), 1);
        itemNode && $(itemNode).remove();
        return false;
    };
    var itemNode = utils.findParent(target,function (node){
        return $(node).hasClass('result-presentation');
    },true);
    if (itemNode) {
        clearSelected ();
        $(itemNode).addClass('selected');
        setConfirmBtnUpdate();//更新按钮的状态
        loadItemData (itemNode);
    } else {

    }
});


// 新增条件
$("#addBtn").click(function (){
    var index = formList[formList.length - 1] + 1;
    formList.push(index)
    addNewCondition(index)
})

// 删除条件
$(".formContainer").on("click", "img",function (){
    var index = formList.indexOf($(this).attr('index'))
    $(this).parent().parent().parent().remove();
    formList.splice(index, 1);
})

// 新添加一条 数据
$("#addCascadeSetter").click(function (){
    clearPage ();
    setConfirmBtnAdd ();
});

//点击确定按钮
$("#confirmBtn").click(function (){

    var cascadeData = dataCollection ();
    var json = cascadeData.setting;
    //不是更新的状态就是添加的状态
    if ($("#confirmBtn").attr('state') === 'update') {
        var itemStr = renderItemHtml (json);
        var selectNode =  $(".row-content-result").find(".selected");
        var selectIndex = selectNode.index();
        if (selectIndex > 0) {
            $(".row-content-result").find(".selected").remove();
            $(".row-content-result").prepend(itemStr);
        } else {
            $(".row-content-result").find(".selected").remove();
            $('.row-content-result').prepend(itemStr);
        }

        //更新 结果部分的tree
        var treeParentNode = $(".row-content-result").find(".selected").find("[mark]");
        rules.splice($(".row-content-result").find(".selected").index(), 1, json)
        $.fn.zTree.init(treeParentNode, displaySetting, displayNodes);
        //数据绑定在节点上
        $(".row-content-result").find(".selected").data("data",cascadeData);
        // clearSelected ();
    } else {
        if (isDataRepeated (json)) {
            alert ("相同条件已经存储，请更换条件");
            return;
        };
        rules.unshift(json)
        prependItem ();
        clearPage ();
    }
});

/**
 * 克隆对象方法
 * @param {obj} 克隆对象
 */
function cloneObj (obj) {
    var newObj = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (var key in obj) {
        var val = obj[key];
        //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
        newObj[key] = typeof val === 'object' ? cloneObj(val): val;
    }
    return newObj;
};

/**
 * 重构 list数据格式 获取便于处理的数据 生成 next 参数
 * @param {list} 入参 当前条件集合
 */
function recursionTemplate (list, res = {}, index = 0){
    if (list.length == index) return res;
    res = cloneObj(list[index])
    res.next = recursionTemplate(list, res.next, index + 1);
    return res
}

/**
 * 去除 next 参数 生成数组格式
 * @param {Object} list 传入的用户设置 带有 next 参数
 */
function restoreTemplate (list, res = []) {
    res.push({
        cascadeId: list.cascadeId,
        cascadeIdText: list.cascadeIdText,
        condition: list.condition,
        group: list.group,
        hideConditionList: list.hideConditionList,
        operator: list.operator,
        operatorText: list.operatorText,
        showConditionList: list.showConditionList,
        showConditionText: list.showConditionText
    })
    if(JSON.stringify(list.next) == "{}") return res
    res = restoreTemplate(list.next, res);
    return res;
}

//  新增条件html模板
function addNewCondition (index){
    var htmlStr = '<div class="formItem">' +
        '<form id="casSetter'+index+'">' +
            '<div class="conditionSet width9">' +
                '<select name="group" id="group" class="operator">' +
                    '<option value=" "> </option>' +
                    '<option value="(">(</option>' +
                '</select>' +
            '</div>' +
            '<div class="conditionSet width21">' +
                '<select name="cascadeId" id="cascadeId">' +
                    '<option value="">条件项</option>' +
                '</select>' +
                '<input type="text" autocomplete="off" name="cascadeIdText" value="" id="cascadeIdText" hidden>' +
            '</div>' +
            '<div class="conditionSet">' +
                '<select name="operator" id="operator" class="conditionOperator">' +
                    '<option value="=">等于</option>' +
                    '<option value="!=">不等于</option>' +
                    '<option value=">">大于</option>' +
                    '<option value=">=">大于等于</option>' +
                    '<option value="<">小于</option>' +
                    '<option value="<=">小于等于</option>' +
                    '<option value="in">包含</option>' +
                    '<option value="null">为空</option>' +
                    '<option value="notNull">不为空</option>' +
                '</select>' +
                '<input type="text" autocomplete="off" name="operatorText" value="等于" id="operatorText" hidden>' +
            '</div>' +
            '<div class="conditionSet width21">' +
                '<input type="text" name="showConditionText" id="showCondition">' +
                // '<input type="text" autocomplete="off" name="showConditionList" value="" id="showConditionList" hidden>' +
                // '<input type="text" autocomplete="off" name="hideConditionList" value="" id="hideConditionList" hidden>' +
            '</div>' +
            '<div class="conditionSet width9">' +
                '<select name="group" id="group" class="operator">' +
                    '<option value=" "> </option>' +
                    '<option value=")">)</option>' +
                '</select>' +
            '</div>' +
            '<div class="conditionSet">' +
                '<select name="condition" id="condition" class="operator">' +
                    '<option value="and">并且</option>' +
                    '<option value="or">或者</option>' +
                '</select>' +
            '</div>' +
            '<div class="conditionSet options">' +
                '<img src="./images/del1.png" id="delCascadeSetter" index="0" title="删除"> </img>' +
            '</div>' +
        '</form>' +
    '</div>'
    $('.formContainer').append(htmlStr)
    initCascadeId(elezNodes, $("#casSetter"+index+" #cascadeId"));
}

// 用户点击新增，需要清空 确定按钮的 state=update
// 更改为state=add
function setConfirmBtnAdd (){
    $("#confirmBtn").removeAttr('state')
        .attr('state','add');
}

function setConfirmBtnUpdate (){
    $("#confirmBtn").removeAttr('state')
        .attr('state','update');
}

function resetDecriptionBox (){
    var html = '                    if\n' +
        '                    <span class="cascadeIdTextDis"></span>\n' +
        '                    <span class="operatorTextDis">等于</span>\n' +
        '                    <span class="showConditionTextDis"></span>\n' +
        '                    <div class="ulDis">\n' +
        '                        <span>显示</span>\n' +
        '                        <ul class="showLi">\n' +
        '                            <!--<li>元素</li>-->\n' +
        '                        </ul>\n' +
        '                        <span>隐藏</span>\n' +
        '                        <ul class="hideLi">\n' +
        '                            <!--<li>元素</li>-->\n' +
        '                        </ul>\n' +
        '                    </div>';
    $(".discription-row-content").html(html);
}

function loadItemData (itemNode){
    var itemNodeData = $(itemNode).data('data');
    var userSetting = itemNodeData.setting;
    var nameList = itemNodeData.eleNameObj;
    var currentNode = $.grep(elezNodes, function (val){
        return val.id === userSetting.cascadeId
    })
    if (currentNode[0].eleType === 'select' || currentNode[0].eleType === 'selectmulti') {
        $("input#showCondition").hide();
        $("select#showCondition").show();
        initCondition(currentNode[0].node.options,$("#showCondition"), userSetting.showConditionText);
    }else if(currentNode[0].eleType === "haveornot"){
        var haveOrNotObj = [
            {
                index: 1,
                isDefault: false,
                key: "有",
                value: "有"
            },
            {
                index: 2,
                isDefault: false,
                key: "无",
                value: "无"
            }
        ]
        $("input#showCondition").hide();
        $("select#showCondition").show();
        initCondition(haveOrNotObj,$("#showCondition"), userSetting.showConditionText);
    }else{
        $("input#showCondition").show();
        $("select#showCondition").hide();
    }
    loadForm(userSetting)
    loadLTreeAndDescrip (itemNodeData.elezNodes,userSetting,nameList.showNameList,nameList.hideNameList);
    // displayNodes = itemNodeData.displayNodes;
    // elezNodes = itemNodeData.elezNodes;
    // initTree ();
    var hideList = userSetting.hideConditionList.split(',');
    for(var i = 0; i < hideList.length; i++) {
        for(var j = 0; j < displayNodes.length; j++) {
            if(hideList[i] == displayNodes[j].id) {
                displayNodes[j].isShow = false;
                elezNodes[j].isShow = false;
            }
        }
    }
    setdisplayNode()
}

/**
 *
 * @param {Object} userSetting 反显用户设置条件
 */
function loadForm (userSetting) {
    for(var j = 0; j < formList.length; j++){ // 反显前清空列表
        if(j == 0) continue
        console.log($("#casSetter"+i).parent())
        $("#casSetter"+j).parent().remove();
    }
    var arr = restoreTemplate(userSetting);
    for(var i = 0; i < arr.length; i++){
        if(i != 0){
            formList.push(i);
            addNewCondition(i);
        }
        $("#casSetter"+i).fillForm(arr[i])
    }
}

//清除selected
function clearSelected () {
    $(".row-content-result").find(".row-content-item").removeClass('selected');
}

//子元素最前端添加节点
function prependItem () {

    var cascadeData = dataCollection ();
    var json = cascadeData.setting;
    var itemStr = renderItemHtml (json);
    clearSelected ();
    $(".row-content-result").prepend(itemStr);

    // setNewNodeData ();
    //更新 结果部分的tree
    var treeParentNodeMark = $(".row-content-result").find(".selected").find("[mark]").attr("mark");
    // console.log();

    $.fn.zTree.init($("." + treeParentNodeMark), $.extend(true,{},displaySetting), $.extend(true,[],displayNodes));
    //数据绑定在节点上
    $(".row-content-result").find(".selected").data("data",cascadeData);
    // console.log(cascadeData);
}

/**
 * 校验 括号成对规则
 * */
function verificationRules(){
    //获取中间的form表单
    var arr = [], midArr = [];
    for(var i = 0; i < formList.length; i++){
        arr.push($('#casSetter'+formList[i]).serializeJson())
    }
    for(var j = 0; j < arr.length; j++){
        for(var m = 0; m < arr[j].group.length; m++){
            if(arr[j].group[m] == '('){
                midArr.push(arr[j].group[m])
            }else if(arr[j].group[m] == ')' && midArr.length > 0){
                midArr.pop()
            }else if(arr[j].group[m] == ')' && midArr.length === 0){
                return false;
            }
        }
    }
    if(midArr.length === 0) {
        return true;
    } else {
        return false;
    }
}

//收集存储数据
function dataCollection () {
    //获取中间的form表单
    var arr = [];
    // var json;
    for(var i = 0; i < formList.length; i++){
        arr.push($('#casSetter'+formList[i]).serializeJson())
    }
    if(!verificationRules()){
        alert('成组条件错误');
        return;
    }
    for(var j = 0; j < arr.length; j++){
        var json = arr[j];
        if (!json.cascadeId) {
            alert('请选择条件项');
            return;
        }
        if (!json.showConditionText && ['=','!=','>','>=','<','<='].indexOf(json.cascadeId) > -1) {
            alert('请选择触发项');
            return;
        }
        if((arr[j].group[0] == "(" && arr[j].group[1] != ")") || (arr[j].group[0] == "" && arr[j].group[1] == ")")){
            json.isGroup = true
        }else{
            json.isGroup = false
        }
    }
    var nameList = getNameList ();
    // debugger
    return {//会有初始数据格式
        setting : recursionTemplate(arr),
        displayNodes :  $.extend(true,[],displayNodes),
        elezNodes : $.extend(true,[],elezNodes),//经过原始节点加工后的 有 isShow的节点，但是没有 显示 隐藏文本的数据
        eleNameObj : {
            hideNameList: nameList.hideNameList,
            showNameList: nameList.showNameList
        }
    };
}

/**
 *  数据是否重复
 * @param newSeting
 * @returns {boolean}
 */
function isDataRepeated (newSeting) {
    var isRepeated = false;
    var itemNodeList = $('.row-content-result').find(".row-content-item");
    $.each(itemNodeList, function (index,item){
        var data = $(item).data('data');
        var setting = data && data.setting;
        if (setting.cascadeId === newSeting.cascadeId
            && setting.operator === newSeting.operator
            && setting.showConditionText === newSeting.showConditionText) {
            isRepeated = true;
        }
    });
    return isRepeated;
}

//渲染 结果列的 渲染函数
function renderItemHtml (json){
    var mark = "tree" + (+ new Date());
    var itemStr = '<div class="row-content-item result-presentation selected">' +
        '<p> if&nbsp;';
        itemStr += renderResultHtml(json);
    itemStr +='</p> <button class="deleteBtn">删除</button>' +
        '<div id="' + mark + '" mark="' + mark + '" class="ztree ztree ' + mark + '"></div>' +
        '</div>';
    return itemStr;
}
/**
 * 渲染多种条件结果 函数
 * @param {Object} jsonItem 单个条件
 */
function renderResultHtml (jsonItem, str = ''){
    str += jsonItem.group instanceof Array?jsonItem.group[0]:jsonItem.group;
    str += '<span class="casacadeIdDis">' + jsonItem.cascadeIdText + '</span><span class="operatorDis">&nbsp;' + jsonItem.operatorText + '&nbsp;</span><span class="showConditionDis">' + jsonItem.showConditionText + '</span>';
    str += jsonItem.group instanceof Array?jsonItem.group[1]:jsonItem.group;
    if (JSON.stringify(jsonItem.next) == "{}") return str
    if(str != ''){
        str += '<span class="orCondition">' + (jsonItem.condition=='and'?'并且':'或者') + '</span>';
    }
    str = renderResultHtml(jsonItem.next, str);
    return str;
}

/**
 *  在 隐藏元素中插入 list text
 * @param options
 * @param cascadeIdText
 * @param showConditionText
 */
function insertHiddenIpt (options,cascadeIdText,showConditionText,operatorText, parent){
    if (options != undefined || options != null) {
        var strOtions = JSON.stringify(options);
        parent.find("#showConditionList").val(strOtions);
    }
    if (cascadeIdText != undefined || cascadeIdText != null) {
        parent.find("#cascadeIdText").val(cascadeIdText);
    }
    if (showConditionText != undefined || showConditionText != null) {
        parent.find("#showConditionText").val(showConditionText);
    }
    if (operatorText != undefined || operatorText != null) {
        parent.find("#operatorText").val(operatorText);
    }
}


/**
 *  初始化判断条件
 */
function initOperator () {
    if (usersetting.operator) {
        $("#operator").val(usersetting.operator);
    }
}

/**
 * 描述部分=渲染
 * @param cascadeData
 */
function renderDescriptionsPart (cascadeData) {
    var html = '';
    $.each(cascadeData,function (index,item){
        var userSetting = item.setting;
        html += '                <div class="row-content-item' + index === 0 ? ' selected' : ' ' + '">' +
            '                    if<span class="operatorDis">' + userSetting.operator + '</span>' +
            '                    <span class="showConditionDis">' + userSetting.showConditionText + '</span>' +
            '                    <div class="ulDis">' +
            '                        <span>显示</span>' +
            '                        <ul class="showLi">';
        $.each(userSetting.showNameList,function (sonindex,sonitem){
            html +='<li>' + sonitem + '</li>';
        });
        html += '</ul><span>隐藏</span><ul class="hideLi">';
        $.each(userSetting.hideNameList,function (sonindex,sonitem){
            html +='<li>' + sonitem + '</li>';
        });
        html += '</ul></div></div>';
    });
    $(".row-content-result").html(html);
}

function renderResultPresentation (cascadeData){
    var html = '';
    $.each(cascadeData,function (index,item){
        var userSetting = item.setting;
        var itemStr = renderItemHtml(userSetting);
        clearSelected ();
        $(".row-content-result").prepend(itemStr);
        //更新 结果部分的tree
        var treeParentNode = $(".row-content-result").find(".selected").find("[mark]");
        $.fn.zTree.init(treeParentNode, displaySetting, $.extend(true,[],item.displayNodes));
        //数据绑定在节点上
        $(".row-content-result").find(".selected").data("data",item);
    });
}

/**
 *  初始化节点数据 拷贝 到 elezNodes
 */
function originTransfereleNodes () {
    elezNodes = $.extend(true,[],elezNodesOrigin);
}

/**
 *  清空操作 包括 树列表清空选项  描述初始化 清空条件设置
 */
function clearPage (iskeepZnodes){
    if (iskeepZnodes) {
        //保留 显示绑定的数据状态
        setdisplayNode ();
    } else {
        // 参数是true的时候 node节点 设置 显示字段 并对全局变量的 displayNodes 赋值
        setdisplayNode (true);
    }
    //清空元素结构板块
    clearEleStructPart ();
    // 清空 条件设置
    clearConditionSetting();
    //描述初始化
    resetDecriptionBox();

}


//清空条件设置
function  clearConditionSetting (){
    for(var i = 0; i < formList.length; i++){
        if(i == 0) continue;
        $("#casSetter"+i).parent().remove();
    }
    formList = [0];
    // 中间重置表单
    $('#casSetter0').fillForm({//用户设置的json
        condition: 'and', //
        group: [' ', ' '],
        showCondition:"",//触发值的key
        showConditionText:"",// 触发值的value
        operator:"=",//默认等于
        operatorText:"等于",//默认等于
        cascadeId:"",//条件项的nodeid
        cascadeIdText:"",//条件项的node name
        showConditionList : ''//触发值的 list
    });
}

//清空元素结构板块 包括树取消勾选 默认选中显示
function clearEleStructPart () {
    //左边的树重新刷新置空
    $.fn.zTree.init($("#treeDemo"), eleSetting, elezNodes);
    $(".controlShow").find("#showContr").attr("checked","checked")

}
