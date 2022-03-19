(function (AX) {
  var attrs = [];
  var ymValue = ['P', 'L', 'B', 'D', 'O', 'M'];
  var oNode = null;
  var oldVal = null; // 记录初始值
  var change = {}; // 记录每次修改值
  var history = null; // 记录历史修改信息
  var editorModel = editor.options.editorModel;

  function init(previewDom) {
    $.each(attrs, function (index, item) {
      if (item.teeth == 1) {
        /*判断恒乳牙*/
        if (item.teethType == 1) {
          //恒牙
          // debugger;
          $('.teethHeng .teethItem' + index, previewDom).addClass('teethSelected');
          $('.teethRu .teethItem' + index, previewDom).removeClass('teethSelected');
          $('.teethItemImg' + index, previewDom).html((index < 16 ? '<div class="h-line"></div>':'') + ((index == 7 || index == 23) ? '<div class="v-line"></div>':'') + '<span class="teethItemText" style="visibility:hidden">'+ $('.teethHeng .teethItem' + index).attr('teethHtml') + '</span>');
          /*判断是否有恒牙牙面*/
          if (item.yamianH != []) {
            $('.teethHeng .yamianTeethItem' + index, previewDom).removeClass('selected');
            $.each(item.yamianH, function (key, value) {
              $('.teethHeng .yamianTeethItem' + index + '.yamianTeeth' + value, previewDom).addClass('selected');
            });
            $('.teethItemImg' + index, previewDom).append('<i class="teethItemI teethItemI' + index + '" teethType="1" teeth="1">' + item.yamianHtmlH.join('') + '</i>');
            // $('.teethItemI' + index).html(item.yamianHtmlH.join(''));
          } else {
            $('.teethHeng .yamianTeethItem' + index, previewDom).removeClass('selected');
            $('.teethItemImg.teethItemImg' + index + ' .teethItemI', previewDom).empty();
          }
        } else {
          //乳牙
          $('.teethRu .teethItem' + index, previewDom).addClass('teethSelected');
          $('.teethHeng .teethItem' + index, previewDom).removeClass('teethSelected');
          $('.teethItemImg' + index, previewDom).html((index < 16 ? '<div class="h-line"></div>':'') + ((index == 7 || index == 23) ? '<div class="v-line"></div>':'') + '<span class="teethItemText" style="visibility:hidden">'+ $('.teethRu .teethItem' + index).attr('teethHtml') + '</span>');
          /*判断是否有乳牙牙面*/
          if (item.yamianR != []) {
            $('.teethRu .yamianTeethItem' + index, previewDom).removeClass('selected');
            $.each(item.yamianR, function (key, value) {
              $('.teethRu .yamianTeethItem' + index + '.yamianTeeth' + value, previewDom).addClass('selected');
            });
            $('.teethItemImg' + index, previewDom).append('<i class="teethItemI teethItemI' + index + '" teethType="0" teeth="1">' + item.yamianHtmlR.join('') + '</i>');
            // $('.teethItemI' + index).html(item.yamianHtmlR.join(''));
          } else {
            $('.teethRu .yamianTeethItem' + index, previewDom).removeClass('selected');
            $('.teethItemImg.teethItemImg' + index + ' .teethItemI', previewDom).empty();
          }
        }
      } else {
        $('.teethItem' + index, previewDom).removeClass('teethSelected');
        $('.yamianTeethItem' + index, previewDom).removeClass('selected');
        $('.teethItemImg.teethItemImg' + index, previewDom).html((index < 16 ? '<div class="h-line"></div>':'') + ((index == 7 || index == 23) ? '<div class="v-line"></div>':''));
      }
      keepWidthSame(index, null, previewDom);
      refreshContentVisible(index, previewDom);
    })
  }

  // 再次编辑反显
  window.onload = function () {
    document.getElementById("preview_slot").innerHTML = AX.medicalPreview[thePlugins](false, editorModel);
    if (AX.plugins[thePlugins].editdom) {
      oNode = AX.plugins[thePlugins].editdom;
      attrs = JSON.parse(oNode.getAttribute('attrs')).attrs;
      init();
    } else {
      for (var i = 0; i < attrsLength; i++) {
        attrs.push({
          teeth: 1,
          teethType: 1,
          yamianH: [],
          yamianHtmlH: [],
          yamianR: [],
          yamianHtmlR: []
        })
      }
      //默认恒牙，牙面全不选中状态
      $('.teethHeng .teethItem').addClass('teethSelected');
      $('.yamianTeethItem').removeClass('selected');
    }
    
    //   记录本次编辑初始值 留痕用 start
    if (editorModel == "mark" && oNode) {
      if (oNode.getAttribute("oldval")) {
        oldVal = JSON.parse(oNode.getAttribute("oldval"));
      } else {
        oldVal = JSON.parse(oNode.getAttribute("attrs")).attrs;
      }
      if (oNode.getAttribute("history")) {
        history = JSON.parse(oNode.getAttribute("history"));
      } else {
        history = [];
      }
      for (var i = history.length - 1; i >= 0; i--) {
        for (var j in history[i]) {
          showHistoryTeethMark($("#imgBox .teethItemImg" + j), history[i][j].val, history[i][j].type, ymValue)
        }
      }
    }

    if (oldVal == null) { // 生成旧数据结构
      oldVal = []
      for (var j in attrs) {
        var oldYamian = [];
        var yamianMid = []
        if (attrs[j].teethType == 0) {
          yamianMid = attrs[j].yamianR;
        }else{
          yamianMid = attrs[j].yamianH;
        }
        for (var i in yamianMid) {
          oldYamian.push(yamianMid[i]);
        }
        var obj = {
          teeth: attrs[j].teeth,
          yamian: oldYamian
        }
        oldVal.push(obj);
      }
    }
    // 记录本次编辑初始值 留痕用 end
    for (var m in attrs) {
      var currVal = markDataFormat(attrs[m]);
      createTeethMarkNode($("#imgBox .teethItemImg" + m), oldVal[m], currVal, editorModel, ymValue)
    }
  }

  /*循环牙面渲染页面*/
  $.each($('.teethItem'), function (index, item) {
    var dom;
    var teeth = $('.teethItem').eq(index).attr('teeth');
    var yamian4;
    if (teeth == 5 || teeth == 10 || teeth == 21 || teeth == 26) {
      yamian4 = '';
    } else if ((teeth >= 6 && teeth <= 9) || (teeth >= 22 && teeth <= 25)) {
      yamian4 = '<li class="yamianTeethItem fang yamianTeethItem' + teeth + ' yamianTeeth4" yamian="4" teeth="' + teeth + '"teethYamianHtml="O"></li>'
    } else {
      yamian4 = '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth4" yamian="4" teeth="' + teeth + '"teethYamianHtml="O"></li>'
    }
    if (teeth <= 7 || (teeth >= 16 && teeth <= 23)) {
      dom =
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth0" yamian="0" teeth="' + teeth + '"teethYamianHtml="B"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth1" yamian="1" teeth="' + teeth + '"teethYamianHtml="M"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth2" yamian="2" teeth="' + teeth + '"teethYamianHtml="L"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth3" yamian="3" teeth="' + teeth + '"teethYamianHtml="D"></li>' +
        yamian4;
    } else {
      dom =
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth0" yamian="0" teeth="' + teeth + '"teethYamianHtml="B"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth1" yamian="3" teeth="' + teeth + '"teethYamianHtml="D"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth2" yamian="2" teeth="' + teeth + '"teethYamianHtml="L"></li>' +
        '<li class="yamianTeethItem yamianTeethItem' + teeth + ' yamianTeeth3" yamian="1" teeth="' + teeth + '"teethYamianHtml="M"></li>' +
        yamian4;
    }
    $('.teethItem').eq(index).html(dom);
  });

  function refreshContentVisible(index, previewDom) {
    var bufferContent = $('.teethItemImg' + index + ' .teethItemI', previewDom).html();
    if (bufferContent == '') {
      $('.teethItemImg' + index + ' .teethItemText', previewDom).css('visibility', 'hidden');
    } else {
      $('.teethItemImg' + index + ' .teethItemText', previewDom).css('visibility', 'visible');
    }
  }

  var time = null;
  /*点击牙面*/
  $('.yamianTeethItem').click(function () {
    clearTimeout(time);
    var that = $(this);
    time = setTimeout(function () {
      var teethIndex = that.attr('teeth');//当前牙齿数字
      var teethContent = that.parent('.teethItem' + teethIndex).attr('teethHtml');//当前牙齿名字
      var yamianIndex = that.attr('yamian');//当前牙面数字
      var yamian = that.attr('teethYamianHtml');//当前牙面名字(字母)
      var teethIContent = $('.teethItemI' + teethIndex).html();//当前牙齿已选牙面(字母)

      if (!that.hasClass('selected')) {
        //之前牙面未选中
        // debugger;
        that.addClass('selected');
        that.parent('.teethItem').addClass('teethSelected');
        attrs[teethIndex].teeth = 1;
        /*判断恒乳牙*/
        if (that.parent('.teethItem').attr('teethType') == '1') {
          //点的是恒牙的牙面
          $('.teethRu .teethItem' + teethIndex).removeClass('teethSelected')
            .children('.yamianTeethItem').removeClass('selected');
          attrs[teethIndex].teethType = 1;
          attrs[teethIndex].yamianR = [];
          attrs[teethIndex].yamianHtmlR = [];
          attrs[teethIndex].yamianH.push(yamianIndex);
          attrs[teethIndex].yamianHtmlH.push(yamian);
          $('.teethItemImg' + teethIndex).html((teethIndex < 16 ? '<div class="h-line"></div>':'') + ((teethIndex == 7 || teethIndex == 23) ? '<div class="v-line"></div>':'') + '<span class="teethItemText">' + teethContent + '</span>' + '<i class="teethItemI teethItemI' + teethIndex + '" teeth="' + teethIndex + '">' + attrs[teethIndex].yamianHtmlH.join('') + '</i>');
        } else {
          //点的是乳牙牙面
          $('.teethHeng .teethItem' + teethIndex).removeClass('teethSelected')
            .children('.yamianTeethItem').removeClass('selected');
          attrs[teethIndex].teethType = 0;
          attrs[teethIndex].yamianH = [];
          attrs[teethIndex].yamianHtmlH = [];
          attrs[teethIndex].yamianR.push(yamianIndex);
          attrs[teethIndex].yamianHtmlR.push(yamian);
          $('.teethItemImg' + teethIndex).html((teethIndex < 16 ? '<div class="h-line"></div>':'') + ((teethIndex == 7 || teethIndex == 23) ? '<div class="v-line"></div>':'') + '<span class="teethItemText">' + teethContent + '</span>' + '<i class="teethItemI teethItemI' + teethIndex + '" teeth="' + teethIndex + '">' + attrs[teethIndex].yamianHtmlR.join('') + '</i>');
        }

      } else {
        //之前牙面选中
        that.removeClass('selected');
        var a = teethIContent.split(yamian);
        $('.teethItemI' + teethIndex).html(a.join(''));
        /*判断恒乳牙*/
        if (that.parent('.teethItem').attr('teethType') == '1') {
          //点的是恒牙的牙面
          attrs[teethIndex].yamianH.splice(attrs[teethIndex].yamianH.indexOf(yamianIndex), 1);
          attrs[teethIndex].yamianHtmlH.splice(attrs[teethIndex].yamianHtmlH.indexOf(yamian), 1);
        } else {
          //点的是乳牙的牙面
          attrs[teethIndex].yamianR.splice(attrs[teethIndex].yamianR.indexOf(yamianIndex), 1);
          attrs[teethIndex].yamianHtmlR.splice(attrs[teethIndex].yamianHtmlR.indexOf(yamian), 1);
        }
      }
      var currVal = markDataFormat(attrs[teethIndex]);
      createTeethMarkNode($("#imgBox .teethItemImg" + teethIndex), oldVal[teethIndex], currVal, editorModel, ymValue)
      keepWidthSame(teethIndex,that.parent('.teethItem').attr('teethType'));
      refreshContentVisible(teethIndex);
    }, 300);
  });

  String.prototype.visualLength = function(){
      var ruler = $("#ruler");
      ruler.text(this);
      return ruler[0].offsetWidth;
  };

  /**
   * 保持上下两颗牙占位宽度同步
   * @param {Number} teethIndex 牙齿索引
   */
  function keepWidthSame(teethIndex,type, previewDom){
    var currObj = $('.imgBox .teethItemImg' + teethIndex, previewDom),
      currIObj = $('.imgBox .teethItemImg' + teethIndex + ' .teethItemI', previewDom);
    var currText = $.trim(currIObj.html()); currWidth = currText ? currText.visualLength() : 0;reflectIndex = teethIndex;
    if(teethIndex < 16){
      reflectIndex = parseInt(teethIndex) + 16;
    }else{
      reflectIndex = teethIndex - 16;
    }
    var  reflectObj = $('.imgBox .teethItemImg' + reflectIndex, previewDom),
      reflectIObj = $('.imgBox .teethItemImg' + reflectIndex + ' .teethItemI', previewDom);
    var reflectText = $.trim(reflectIObj.html()); reflectWidth = reflectText ? reflectText.visualLength() : 0;
    reflectObj.css({'padding' : '0 ' + (reflectObj.attr('teethType') == 0 ? 3 : 3) + 'px'});
    currObj.attr('teethType',type).css({'padding' : '0 ' + (type == 0 ? 3 : 3) + 'px'});
    if(reflectText == '' && currText == ''){
      currIObj.width(0);
      reflectIObj.width(0);
    }else{
      if(currWidth <= reflectWidth){
        currIObj.width(reflectWidth);
      }else{
        currIObj.width(currWidth);
        reflectIObj.width(currWidth);
      }
    }
    
    // if($.trim(reflectObj.text()) == '' && $.trim(currObj.text()) == ''){
    //   currObj.css({padding : 0});
    //   reflectObj.css({padding : 0});
    //   currObj.html('');
    //   reflectObj.html('');
    // }else{
    //   if(teethIndex >= 16 && $.trim(reflectObj.text()) == ''){
    //     reflectObj.html((reflectIndex < 16 ? '<div class="h-line"></div>' : '') + (reflectIndex == 7 || reflectIndex == 23 ? '<div class="v-line"></div>' : '') + '&nbsp;&nbsp;');
    //   }else if(teethIndex < 16 && $.trim(reflectObj.text()) == ''){
    //     reflectObj.html((reflectIndex < 16 ? '<div class="h-line"></div>' : '') + (reflectIndex == 7 || reflectIndex == 23 ? '<div class="v-line"></div>' : '') + '&nbsp;&nbsp;');
    //   }
    // }
  }

  /*点击牙齿*/
  $('.yamianTeethItem').on('dblclick', function () {
    clearTimeout(time);
    var $teethParent = $(this).parent('.teethItem');
    var teethIndex = $teethParent.attr('teeth');
    var teethContent = $teethParent.attr('teethHtml');

    if (!$teethParent.hasClass('teethSelected')) {
      /*之前未选中*/
      //乳牙恒牙切换
      if ($teethParent.attr('teethType') == '1') {
        $('.teethRu .teethItem' + teethIndex).removeClass('teethSelected');
        $('.teethRu .yamianTeethItem' + teethIndex).removeClass('selected');
        attrs[teethIndex].teethType = 1;
      } else {
        $('.teethHeng .teethItem' + teethIndex).removeClass('teethSelected');
        $('.teethHeng .yamianTeethItem' + teethIndex).removeClass('selected');
        attrs[teethIndex].teethType = 0;
      }
      $teethParent.addClass('teethSelected');
      $('.teethItemImg' + teethIndex).html((teethIndex < 16 ? '<div class="h-line"></div>':'') + ((teethIndex == 7 || teethIndex == 23) ? '<div class="v-line"></div>':'') + teethContent + '<i class="teethItemI teethItemI' + teethIndex + '" teeth="' + teethIndex + '"></i>');
      attrs[teethIndex].teeth = 1;
    } else {
      $teethParent.removeClass('teethSelected');
      $('.yamianTeethItem' + teethIndex).removeClass('selected');
      $('.teethItemImg' + teethIndex).html((teethIndex < 16 ? '<div class="h-line"></div>':'') + ((teethIndex == 7 || teethIndex == 23) ? '<div class="v-line"></div>':''));
      attrs[teethIndex].teeth = 0;
      attrs[teethIndex].teethType = 1; //默认是恒牙
    }
    attrs[teethIndex].yamianH = [];//所有牙面置空
    attrs[teethIndex].yamianHtmlH = [];
    attrs[teethIndex].yamianR = [];
    attrs[teethIndex].yamianHtmlR = [];
    keepWidthSame(teethIndex,$teethParent.attr('teethType'));
  });

  //确定按钮事件
  $('.doOk').click(function () {
    //设置画布，防止图片变模糊
    var width = oNode && oNode.getAttribute('width') || $("#imgBox").width();
    var height = oNode && oNode.getAttribute('height') || $("#imgBox").height();
    
    var markClass = "";
    var idStr = +new Date();
    if (editorModel == "mark") {  // 留痕模式下生成未留痕表达式
      // 记录本次修改值
      // 记录修改类型  add 增加   del 删除
      for (var i in oldVal) {
        var newYamian = []
        oldVal[i].yamian.sort(sortMethod);
        newYamian = markDataFormat(attrs[i]);
        if (oldVal[i].yamian.join("") != newYamian.yamian.join("") && oldVal[i].yamian.length != 0) {
          change[i] = {
            val: oldVal[i],
            teethIndex: $("#imgBoxDirty .teethItemImg" + i + " .teethItemText").html(),
            type: "del"
          }
        } else if (oldVal[i].yamian.join("") != newYamian.yamian.join("") && oldVal[i].yamian.join("") == "") {
          change[i] = {
            val: newYamian,
            teethIndex: $("#imgBoxDirty .teethItemImg" + i + " .teethItemText").html(),
            type: "add"
          }
        }
      }

      // 记录留痕信息
      var time = formatCurDate(new Date(parseInt(editor.options.dateObj.serverDate) + (+new Date() - editor.options.dateObj.serverDate)), "yyyy-MM-dd HH:mm:ss");
      change["time"] = time;
      change["user"] = editor.options.userInfo.name;
      markClass = "mark-free-medical";
      AX.mh.medical
        .call(window, $("#imgBoxDirty")[0], attrs, thePlugins, {
          sizeWidth: $("#imgBoxDirty").width(),
          sizeHeight: $("#imgBoxDirty").height()
        }, "mark-old-medical hide-mark")
        .then(function (data) {
          var imgStr = data.imgStr;
          var oldMedicals = editor.document.querySelectorAll(".mark-old-medical");
          for (var i = 0; i < oldMedicals.length; i++) {
            if ((oNode ? oNode.getAttribute("focusId") : "") == oldMedicals[i].getAttribute("focusId")) {
              var currentOldMark = oldMedicals[i];
              break
            }
          }
          try {
            if (currentOldMark) {
              idStr = currentOldMark.getAttribute("focusId");
              currentOldMark.setAttribute("src", data.imgSrc);
              currentOldMark.setAttribute("_src", data.imgSrc);
              currentOldMark.setAttribute("attrs", JSON.stringify({ attrs: attrs }));
            } else {
              var div = document.createElement("div");
              div.innerHTML = imgStr;
              div.children[0].setAttribute("focusId", idStr);
              editor.execCommand("insertHtml", div.innerHTML);
            }

          } catch (e) {
            console.log(e);
            return false;
          }
          // dialog.close(true);
        })
        .catch(function (error) {
          dialog.close(true);
          console.log(error);
          return false;
        });
    }

    AX.mh.medical.call(window, $('#imgBox')[0], attrs, thePlugins, {
      sizeWidth: width,
      sizeHeight: height
    }, markClass).then(function(data) {
      var imgStr = data.imgStr;
      var imgSrc = data.imgSrc;
      if (!oNode) {
        try {
          var div = document.createElement("div");
          div.innerHTML = imgStr;
          if(editorModel == "mark") {
            div.children[0].setAttribute("focusId", idStr);
            div.children[0].setAttribute("ymValue", JSON.stringify(ymValue));
            div.children[0].setAttribute("oldVal", JSON.stringify(oldVal));
            div.children[0].setAttribute("change", JSON.stringify(change));
          }
          editor.execCommand("insertHtml", div.innerHTML);
          delete AX.plugins[thePlugins].editdom;
        } catch (e) {
          console.log(e);
          return false;
        }
      } else {
        oNode.setAttribute("src", imgSrc);
        oNode.setAttribute("_src", imgSrc);
        oNode.setAttribute("attrs", JSON.stringify({ attrs: attrs }));
        if(editorModel == "mark") {
          oNode.setAttribute("ymValue", JSON.stringify(ymValue));
          oNode.setAttribute("class", ("medical-expression " + markClass));
          oNode.setAttribute("oldVal", JSON.stringify(oldVal));
          oNode.setAttribute("change", JSON.stringify(change));
        }
        delete AX.plugins[thePlugins].editdom;
      }
      dialog.close(true);
    }).catch(function(error) {
      delete AX.plugins[thePlugins].editdom;
      dialog.close(true);
      console.log(error);
      return false;
    });

    // var canvas = document.createElement("canvas");
    // canvas.width = width * 2;
    // canvas.height = height * 2;
    // canvas.style.width = width + "px";
    // canvas.style.height = height + "px";
    // var context = canvas.getContext("2d");
    // //然后将画布缩放，将图像放大两倍画到画布上
    // context.scale(2, 2);
    // html2canvas($('#imgBox')[0], {
    //   scale: 1,
    //   canvas: canvas,
    //   width: $("#imgBox").outerWidth(),
    //   height: $("#imgBox").outerHeight()
    // }).then(function (canvas) {
    //   var base64Data = canvas.toDataURL();
    //   var html = '<img src="' + base64Data + '" class="medical-expression" axplugins="' + thePlugins + '" attrs=\'' + JSON.stringify({attrs: attrs}) + '\'>';
    //   if (!oNode) {
    //     try {
    //       editor.execCommand('insertHtml', html);
    //       delete AX.plugins[thePlugins].editdom;
    //     } catch (e) {
    //       console.log(e);
    //       return false;
    //     }
    //   } else {
    //     oNode.setAttribute('src', base64Data);
    //     oNode.setAttribute('attrs', JSON.stringify({attrs: attrs}));
    //     delete AX.plugins[thePlugins].editdom;
    //   }
    //   dialog.close(true);
    // });
  });
  /**
   * 留痕操作前 统一attrs 数据格式
   * @param {*} data 
   */
  function markDataFormat(data) {
    var obj = {};
    if (data.teethType == 1) {
      obj = {
        teeth: data.teeth,
        yamian: data.yamianH
      }
    }else {
      obj = {
        teeth: data.teeth,
        yamian: data.yamianR
      }
    }
    return obj;
  }

  //取消按钮事件
  $('.doCancel').click(function () {
    if (oNode) {
      delete AX.plugins[thePlugins].editdom;
    }
    dialog.close(true);
  });

})(AX)
