/* $('#metaData').change(function(){
    var selectOpt = $(this).find('option:selected'),
        type = selectOpt.attr('metaType'),
        val = selectOpt.attr('value');
    $('#name').val(selectOpt.html()).trigger('keyup');  

    if(val == 'more'){
        // if($('#listTable').length==0){
        //     var tableStr='div'
        // }
        //弹窗展示--待做
        // $("#pages").pagination({
        //     currentPage: currentPage,// 当前页数
        //     totalPage: totalPage,// 总页数
        //     isShow: true,// 是否显示首尾页
        //     count: 10,// 显示个数
        //     homePageText: "首页",// 首页文本
        //     endPageText: "尾页",// 尾页文本
        //     prevPageText: "上一页",// 上一页文本
        //     nextPageText: "下一页",// 下一页文本
        //     callback: function (current) {
        //         search(current);
        //     }
        // });
    }else{
        if(type == 1 || type == 2){
            getRanges(type);
        }else{
            $('.option-tr').remove();
            // reIndex();
        }
    }3d6accd0b00d46c0b0db9ed91fcd66eb
}) */

/**
 * 获取数据元值域
 * @param {String} type 数据元类型：1--单级；2--多级
 */
function getRanges(type, valueId, callback){
    var url = '';
    if(type == 1){
        url = '/contrast/getDataElementValueSingleLst/';
    }else if(type == 2){
        url = '/contrast/getDataElementValueMutiLst/';
    }else{
        return;
    }
    valueId = valueId || $('#metaDataId').val();
    $('#ajaxMask').show();
    $.ajax({
        "url": apiUrl + url + valueId,
        "type": "get",
        "dataType": "json",
        "data": {Authorization: userInfo.token,hospitalId: userInfo.hosId,organizationId: userInfo.dept,_currRole: userInfo.role},
        "success": function (data) {
            $('#ajaxMask').hide();
            if(data.code == 1){
                $('.option-tr').remove();
                data = data.data;
                for(var i = 0;i < data.length;i++){
                    fnAddComboTr({key: data[i].vCode,value: data[i].vMean,isDefault: false,isMetaRange: true});
                }
                callback && callback(null, data);
            } else {
                callback && callback(data);
            }
        },
        "error": function (error) {
            $('#ajaxMask').hide();
            alert('数据元值域获取失败，请刷新重试！');
            console.log(error);
            callback && callback(error);
        }
    })
}

/**
 * 值域重新排序
 */
function reIndex(){
    $('.index').each(function(index,item){
        $(this).html(index + 1);
    })
}