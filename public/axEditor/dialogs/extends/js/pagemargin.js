$(function() {
    var marginBox = editor.document.getElementById('pageMarginHidden');
    if(marginBox){
        var currVal = marginBox.value.split(',');
        $('#tv').val(currVal[0]);
        $('#rv').val(currVal[1]);
        $('#bv').val(currVal[2]);
        $('#lv').val(currVal[3]);
    }
    
    $('#doOk').click(function(){
        var tv = $('#tv').val(),
            rv = $('#rv').val(),
            bv = $('#bv').val(),
            lv = $('#lv').val();
        
        var rule = /^[0-9]+(.?[0-9]{1,2})?$/;
        if(tv == '' || !rule.test(tv)){
            alert('上边距应为整数，最多保留两位小数');
            return ;
        }
        if(rv == '' || !rule.test(rv)){
            alert('上边距应为整数，最多保留两位小数');
            return ;
        }
        if(bv == '' || !rule.test(bv)){
            alert('上边距应为整数，最多保留两位小数');
            return ;
        }
        if(lv == '' || !rule.test(lv)){
            alert('上边距应为整数，最多保留两位小数');
            return ;
        }

        var margin = [tv,rv,bv,lv];
        editor.execCommand('pagemargin',margin);

        dialog.close(true);
    });

    //取消按钮事件
    $('#doCancel').click(function(){
        dialog.close(true);
    })
});

