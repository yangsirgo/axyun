
/**
 * @Description:
 * @param {oldFormat} 老的格式
 * @param {dateValue} 老的格式下的日期值
 * @param {newFormat} 新的格式
 * @date 2019/6/18
*/

function dateFormatHandler (oldFormat,dateValue,newFormat){
    console.log(oldFormat,dateValue,newFormat);
    var dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s';
    var format = oldFormat.match(new RegExp('yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s|.', 'g')) || [];
    newFormat = newFormat.match(new RegExp('yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s|.', 'g')) || [];
    var EXP_SPLIT = "";

    $.each(format, function(i, item){
        var EXP =  new RegExp(dateType).test(item)
            ? '\\d{'+ function(){
            if(new RegExp(dateType).test(format[i === 0 ? i + 1 : i - 1]||'')){
                if(/^yyyy|y$/.test(item)) return 4;
                return item.length;
            }
            if(/^yyyy$/.test(item)) return '1,4';
            if(/^y$/.test(item)) return '1,308';
            return '1,2';
        }() +'}'
            : '\\' + item;
        // EXP_IF = EXP_IF + EXP;
        EXP_SPLIT = EXP_SPLIT + '(' + EXP + ')';
    });

    EXP_SPLIT = new RegExp('^'+ EXP_SPLIT +'$', '');
    var value = (dateValue.match(EXP_SPLIT) || []).slice(1);
    var year,month,date,hours,minutes,seconds;
    $.each(format, function(i, item){
        var thisv = parseFloat(value[i]);
        if(/yyyy|y/.test(item)){ //年
            year = thisv;
        } else if(/MM|M/.test(item)){ //月
            if(thisv < 1) thisv = 1;
            month = thisv - 1;
        } else if(/dd|d/.test(item)){ //日
            if(thisv < 1) thisv = 1;
            date = thisv;
        } else if(/HH|H/.test(item)){ //时
            if(thisv < 1) thisv = 0;
            hours = thisv;
        } else if(/mm|m/.test(item)){ //分
            if(thisv < 1) thisv = 0;
            minutes = thisv;
        } else if(/ss|s/.test(item)){ //秒
            if(thisv < 1) thisv = 0;
            seconds = thisv;
        }
    });

    digit = function(num, length, end){
        var str = '';
        num = String(num);
        length = length || 2;
        for(var i = num.length; i < length; i++){
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num|0) : num;
    };

    //转义为规定格式
    $.each(newFormat, function(i, item){
        if(/yyyy|y/.test(item)){ //年
            newFormat[i] = digit(year, item.length);
        } else if(/MM|M/.test(item)){ //月
            newFormat[i] = digit(month + 1, item.length);
        } else if(/dd|d/.test(item)){ //日
            newFormat[i] = digit(date, item.length);
        } else if(/HH|H/.test(item)){ //时
            newFormat[i] = digit(hours, item.length);
        } else if(/mm|m/.test(item)){ //分
            newFormat[i] = digit(minutes, item.length);
        } else if(/ss|s/.test(item)){ //秒
            newFormat[i] = digit(seconds, item.length);
        }
    });
    console.log(newFormat.join(''));
    return newFormat.join('');
}


/**
 * @Description: 按格式要求插入当前时间
 * @param {String}
 * @date 2019/6/18
*/
function insertCurDate (newFormat) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    var date = myDate.getDate();
    var hours = myDate.getHours();       // 获取当前小时数(0-23)
    var minutes = myDate.getMinutes();     // 获取当前分钟数(0-59)
    var seconds = myDate.getSeconds();
    newFormat = newFormat.match(new RegExp('yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s|.', 'g')) || [];

    digit = function(num, length, end){
        var str = '';
        num = String(num);
        length = length || 2;
        for(var i = num.length; i < length; i++){
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num|0) : num;
    };
    //转义为规定格式
    $.each(newFormat, function(i, item){
        if(/yyyy|y/.test(item)){ //年
            newFormat[i] = digit(year, item.length);
        } else if(/MM|M/.test(item)){ //月
            newFormat[i] = digit(month + 1, item.length);
        } else if(/dd|d/.test(item)){ //日
            newFormat[i] = digit(date, item.length);
        } else if(/HH|H/.test(item)){ //时
            newFormat[i] = digit(hours, item.length);
        } else if(/mm|m/.test(item)){ //分
            newFormat[i] = digit(minutes, item.length);
        } else if(/ss|s/.test(item)){ //秒
            newFormat[i] = digit(seconds, item.length);
        }
    });
    console.log(newFormat.join(''));
    return newFormat.join('');
}
