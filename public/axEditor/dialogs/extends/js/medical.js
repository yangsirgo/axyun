function createMarkNode(that, oldVal, currVal, editorModel) {
    if (editorModel != 'mark') return;
    // if (that.parent().find(".editor-new").length > 0) { // 防止生成多个留痕
    //     that.parent().find(".editor-new").remove();
    // }
    if (oldVal !== currVal && oldVal != "") {
        that.prepend("<p class='editor-mark mark-new editor-mark-del-text editor-free-text " + that.attr("class") + "'>" + oldVal + "</p>")
    } else if (oldVal !== currVal && oldVal == "") {
        that.prepend("<p class='editor-mark mark-new editor-mark-text editor-mark-modify-text on " + that.attr("class") + "'>" + currVal + "</p>")
    }
}

function showHistoryMark(that, val, type) {
    if (type == "del") {
        that.parent().prepend("<p class='editor-mark mark-old editor-mark-del-text editor-free-text'>" + val + "</p>")
    } else if (type == "add") {
        that.parent().prepend("<p class='editor-mark mark-old editor-mark-text editor-mark-modify-text on'>" + val + "</p>")
    }
}

function sortMethod(a, b) { // 数组从小到大排序
    return a - b;
}
// 牙位图生成留痕标签
function createTeethMarkNode(that, oldVal, currVal, editorModel, ymValue) {
    var oldText = "", currText = "", html = "";
    if (editorModel != 'mark') return;
    if (that.find(".mark-new").length > 0) { // 防止生成多个留痕
        that.find(".mark-new").remove();
    }
    oldVal.yamian.sort(sortMethod)
    currVal.yamian.sort(sortMethod)
    for(var i = 0; i < oldVal.yamian.length; i++) {
        oldText += ymValue[oldVal.yamian[i]];
    }
    for(var i = 0; i < currVal.yamian.length; i++) {
        currText += ymValue[currVal.yamian[i]];
    }
    if (oldText !== currText && oldText != "") {
        html = "<p class='editor-mark mark-new editor-mark-del-text editor-free-text'>" + that.find(".teethItemText").html() + "<i class='teethItemI editor-mark editor-mark-del-text editor-free-text'>" + oldText + "</i></p>"
        if (that.find(".mark-old").length > 0) {
            $(html).appendTo(that.find(".mark-old")[that.find(".mark-old").length - 1])
        }else{
            that.prepend(html)
        }
    } else if (oldText !== currText && oldText == "") {
        html = "<p class='editor-mark mark-new editor-mark-text editor-mark-modify-text on'>" + that.find(".teethItemText").html() + "<i class='teethItemI editor-mark editor-mark-text editor-mark-modify-text on'>" + currText + "</i></p>"
        if (that.find(".mark-old").length > 0) {
            $(html).appendTo(that.find(".mark-old")[that.find(".mark-old").length - 1])
        }else{
            that.prepend(html)
        }
    } else if (oldText === currText) {
        that.find(".mark-new").remove();
    }
}
function showHistoryTeethMark(that, val, type, ymValue) {
    if (!val) return;
    var text = "", html = "";
    for(var i = 0; i < val.yamian.length; i++) {
        text += ymValue[val.yamian[i]];
    }
    if (type == "del") {
        html = "<p class='editor-mark mark-old editor-mark-del-text editor-free-text'>" + that.find(".teethItemText").html() + "<i class='teethItemI editor-mark editor-mark-del-text editor-free-text'>" + text + "</i></p>";
        that.prepend(html)
    } else if (type == "add") {
        html = "<p class='editor-mark mark-old editor-mark-text editor-mark-modify-text on'>" + that.find(".teethItemText").html() + "<i class='teethItemI editor-mark editor-mark-text editor-mark-modify-text on'>" + text + "</i></p>"
        that.prepend(html)
    }
}


function formatCurDate(time, newFormat) {
    var myDate = time == null ? new Date() : new Date(time);
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    var date = myDate.getDate();
    var hours = myDate.getHours();       // 获取当前小时数(0-23)
    var minutes = myDate.getMinutes();     // 获取当前分钟数(0-59)
    var seconds = myDate.getSeconds();
    newFormat = newFormat.match(new RegExp('yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s|.', 'g')) || [];

    digit = function (num, length, end) {
        var str = '';
        num = String(num);
        length = length || 2;
        for (var i = num.length; i < length; i++) {
            str += '0';
        }
        return num < Math.pow(10, length) ? str + (num | 0) : num;
    };
    //转义为规定格式
    $.each(newFormat, function (i, item) {
        if (/yyyy|y/.test(item)) { //年
            newFormat[i] = digit(year, item.length);
        } else if (/MM|M/.test(item)) { //月
            newFormat[i] = digit(month + 1, item.length);
        } else if (/dd|d/.test(item)) { //日
            newFormat[i] = digit(date, item.length);
        } else if (/HH|H/.test(item)) { //时
            newFormat[i] = digit(hours, item.length);
        } else if (/mm|m/.test(item)) { //分
            newFormat[i] = digit(minutes, item.length);
        } else if (/ss|s/.test(item)) { //秒
            newFormat[i] = digit(seconds, item.length);
        }
    });
    console.log(newFormat.join(''));
    return newFormat.join('');
}