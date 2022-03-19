
/**
 * 遍历dom 节点 汇总成树形结构
 * @param el  el Dom节点元素
 */
function walkDom(el){
    var c = el.firstChild;
    var retObj = {};
    var array = [];
    while(c !== null){//这里只是返回了元素节点，没有节点就是个空数组
        if(c.nodeType == 1){
            var walkObj = walkDom(c);
            array.push(walkObj);
        }
        c = c.nextSibling;
    }
    if (el.getAttribute("attrs")) {
        var attrsObj = JSON.parse(el.getAttribute("attrs"));
        var options = attrsObj.options || JSON.stringify([]);
        retObj.options = options.length > 0? JSON.parse(options): [];
    }
    retObj.text = el.getAttribute("title");
    retObj.eleType = el.getAttribute('axplugins');//元素类型
    if (el.className === '_textnode_') {
        retObj.eleType = 'textnode';
        retObj.text = $(el).text();
    }
    retObj.name = retObj.text; // + "(" +  getEleTypeText(retObj.eleType) +  ")";
    if (el.getAttribute("attrs")) {
        retObj.name = attrsObj.name;
    }
    retObj.id = el.id;
    retObj.pId = null;
    retObj.children = array;
    return retObj;
}

/**
 * 获取元素的名称
 * @param eleType
 * @returns {string}
 */
function getEleTypeText(eleType) {
    var text = '';
    switch (eleType) {
        case 'combine':
            text = '组合元素';
            break;
        case 'macro':
            text = '基本元素';
            break;
        case 'text':
            text = '文本元素';
            break;
        case 'select':
            text = '单选下拉元素';
            break;
        case 'selectmulti':
            text = '多选下拉元素';
            break;
        case 'numberelement':
            text = '数字元素';
            break;
        case 'radio':
            text = '单选元素';
            break;
        case 'checkbox':
            text = '多选元素';
            break;
        case 'tagelement':
            text = '标签元素';
            break;
        case 'datedomain':
            text = '日期元素';
            break;
        case 'textnode' :
            text = '自由文本';
            break;
        default :
            text = '文本元素';
            break;
    }
    return text;
}

/**
 *  对dom 树节点处理 获得axlugins 元素的树形节点
 * @param ele  Dom节点元素
 * @returns {array}  返回节点数组
 */
function getDomTreeData (ele){
    var obj = walkDom (ele);
    // console.log(obj);
    var clearedData = tranTreeData ([obj]);
    return clearedData;

    /**
     *  清除 axplugins 是null的情况
     * @param arr 节点数组
     * @returns {*}
     */
    function tranTreeData (arr) {
        var arr = $.extend(true,[],arr);
        var flatArr = [];
        var keyCounter = 0;

        $.each(arr,function (sonIndex,rootNode){
            flattenChildren(rootNode);
        });
        clearNullAxplNode ();

        /**
         *  将树形数组 扁平化处理
         * @param node
         * @param parent
         */
        function flattenChildren(node,parent){
            node.nodeKey = keyCounter++;
            flatArr[node.nodeKey] = { node: node, nodeKey: node.nodeKey };
            if (typeof parent != 'undefined') {
                flatArr[node.nodeKey].pKey = parent.nodeKey;
            }
            if (node['children'].length > 0) {
                flatArr[node.nodeKey]['children'] = [];
                $.each(node['children'],function (sonIndex,child){
                    flattenChildren(child, node);
                });
            }
        }

        /**
         *  清除axplugins 为 null 的节点
         */
        function clearNullAxplNode (){
            var cloneArr = $.extend(true,[],flatArr);
            $.each(cloneArr, function (index,item){
                var nullParentId = null;
                var nullNodeKey = null;
                if (item.node.eleType === null || ((item.node.text === "\u200B" || item.node.text === "") && item.node.eleType === 'textnode')) {
                    nullParentId = item.pKey;
                    nullNodeKey = item.nodeKey;
                    //对 flatArr 过滤 node.eleType 为 null
                    flatArr = $.grep(flatArr,function (grepitem){
                        grepitem.eleType = grepitem.node.eleType;
                        grepitem.name = grepitem.node.name;
                        grepitem.id = grepitem.node.id;
                        grepitem.open = true;
                        return grepitem.nodeKey != nullNodeKey;
                    });

                    //flatArr 中pId 更换
                    $.each(flatArr,function (sonIndex,sonItem){
                        if (sonItem.pKey === nullNodeKey){
                            sonItem.pKey = nullParentId;
                        }
                    });

                    //对其中的pKey 转换为实际节点的Id
                    $.each(flatArr,function (sonIndex,sonItem){
                        var pKey = sonItem.pKey;
                        //获取nodeKey 是 pKey 的节点
                        var pKeyNodeArr = $.grep(flatArr,function (grepitem){
                            return grepitem.nodeKey == pKey;
                        });
                        // 对pId 赋值
                        if (pKeyNodeArr.length > 0) {
                            sonItem.pId = pKeyNodeArr[0].node.id;//pKeyNodeArr[0].eleType == "textnode"? pKeyNodeArr[0].pId: pKeyNodeArr[0].node.id;
                        }
                    });
                }
            });
        }

        return flatArr;
    }

}
