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
        $('.teethItem' + index, previewDom).addClass('selected');
        if (item.yamian != []) {
          var ymVal = [];
          $('.yamianTeethItem' + index, previewDom).removeClass('selected');
          $.each(item.yamian, function (key, value) {
            $('.yamianTeethItem' + index + '.yamianTeeth' + value, previewDom).addClass('selected');
            ymVal.push(ymValue[parseFloat(value)]);
          });
          $('.teethItemI' + index, previewDom).html(ymVal.join(''));
        } else {
          $('.yamianTeethItem' + index, previewDom).removeClass('selected');
          $('.teethItemImg.teethItemImg' + index + ' .teethItemI', previewDom).empty();
        }

      } else {
        $('.teethItem' + index, previewDom).removeClass('selected');
        $('.yamianTeethItem' + index, previewDom).removeClass('selected');
        $('.teethItemImg.teethItemImg' + index, previewDom).html((index < 9 ? '<div class="h-line"></div>' : '') + (index == 4 || index == 14 ? '<div class="v-line"></div>' : ''));
      }

      keepWidthSame(index, previewDom);
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
          yamian: []
        });
      }
      $('.teethItem').addClass('selected');
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
        for (var i in attrs[j].yamian) {
          oldYamian.push(attrs[j].yamian[i]);
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
      if (attrs[m].yamian.length > 0) {
        createTeethMarkNode($("#imgBox .teethItemImg" + m), oldVal[m], attrs[m], editorModel, ymValue)
      }
    }
  }

  /*循环牙面渲染页面*/
  var dom = '';
  var bottomDom = '';
  $.each($('.topTeeth .teethItem'), function (index, item) {
    dom += '<li class="topYaMianTeeth' + (index == 4 ? ' mr' : '') + '" teeth="' + index + '">' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth0" yamian="0" teeth="' + index + '">P</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth1" yamian="1" teeth="' + index + '">L</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth2" yamian="2" teeth="' + index + '">B</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth3" yamian="3" teeth="' + index + '">D</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth4" yamian="4" teeth="' + index + '">O</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + index + ' yamianTeeth5" yamian="5" teeth="' + index + '">M</span>' +
      '</li>';


  });
  var handelIndex = attrsLength / 2;
  $.each($('.bottomTeeth .teethItem'), function (index, item) {

    bottomDom += '<li class="bottomYaMianTeeth' + (index == 4 ? ' mr' : '') + '" teeth="' + index + '">' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth5" yamian="5"  teeth="' + parseFloat(index + handelIndex) + '">M</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth4" yamian="4"  teeth="' + parseFloat(index + handelIndex) + '">O</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth3" yamian="3"  teeth="' + parseFloat(index + handelIndex) + '">D</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth2" yamian="2"  teeth="' + parseFloat(index + handelIndex) + '">B</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth1" yamian="1"  teeth="' + parseFloat(index + handelIndex) + '">L</span>' +
      '<span class="yamianTeethItem yamianTeethItem' + parseFloat(index + handelIndex) + ' yamianTeeth0" yamian="0"  teeth="' + parseFloat(index + handelIndex) + '">P</span>' +
      '</li>';
  });
  $('.topYaMian').html(dom);
  $('.bottomYaMian').html(bottomDom);

  function refreshContentVisible(index, previewDom) {
    var bufferContent = $('.teethItemImg' + index + ' .teethItemI', previewDom).html();
    if (bufferContent == '') {
      $('.teethItemImg' + index + ' .teethItemText', previewDom).css('visibility', 'hidden');
    } else {
      $('.teethItemImg' + index + ' .teethItemText', previewDom).css('visibility', 'visible');
    }
  }

  /*点击牙面*/
  $('.yamianTeethItem').click(function () {
    var teethIndex = $(this).attr('teeth');
    var yamian = $(this).html();
    var yamianIndex = $(this).attr('yamian');
    var teethContent = $('.teethItem' + teethIndex).html();
    var teethIContent = $('.teethItemI' + teethIndex).html();
    if (!$(this).hasClass('selected')) {
      $(this).addClass('selected');
      attrs[teethIndex].teeth = 1;
      if ($('.teethItem' + teethIndex).hasClass('selected')) {
        //之前牙齿选中状态
        $('.teethItemI' + teethIndex).append(yamian);
        attrs[teethIndex].yamian.push(yamianIndex);
      } else {
        //之前牙齿未选中状态
        $('.teethItem' + teethIndex).addClass('selected');
        $('.teethItemImg' + teethIndex).html((teethIndex < 9 ? '<div class="h-line"></div>' : '') + (teethIndex == 4 || teethIndex == 14 ? '<div class="v-line"></div>' : '') + '<span class="teethItemText">' + teethContent + '</span>' + '<i class="teethItemI teethItemI' + teethIndex + '" teeth="' + teethIndex + '">' + yamian + '</i>');
        attrs[teethIndex].yamian.push(yamianIndex);
      }
    } else {
      $(this).removeClass('selected');
      var a = teethIContent.split(yamian);
      $('.teethItemI' + teethIndex).html(a.join(''));
      attrs[teethIndex].yamian.splice(yamianIndex, 1);
    }
    createTeethMarkNode($("#imgBox .teethItemImg" + teethIndex), oldVal[teethIndex], attrs[teethIndex], editorModel, ymValue)
    keepWidthSame(teethIndex);
    refreshContentVisible(teethIndex);
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
  function keepWidthSame(teethIndex, previewDom){
    var currObj = $('.imgBox .teethItemImg' + teethIndex, previewDom),
      currIObj = $('.imgBox .teethItemImg' + teethIndex + ' .teethItemI', previewDom);
    var currText = $.trim(currIObj.html()); currWidth = currText ? currText.visualLength() : 0;reflectIndex = teethIndex;
    if(teethIndex < 10){
      reflectIndex = parseInt(teethIndex) + 10;
    }else{
      reflectIndex = teethIndex - 10;
    }
    var  reflectObj = $('.imgBox .teethItemImg' + reflectIndex, previewDom),
      reflectIObj = $('.imgBox .teethItemImg' + reflectIndex + ' .teethItemI', previewDom);
    var reflectText = $.trim(reflectIObj.html()); reflectWidth = reflectText ? reflectText.visualLength() : 0;
    $('.imgBox .teethItemImg' + teethIndex + ',.imgBox .teethItemImg' + reflectIndex, previewDom).css({'padding' : '0 6px'});
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
    //   if(teethIndex >= 10 && $.trim(reflectObj.text()) == ''){
    //     reflectObj.html((reflectIndex < 9 ? '<div class="h-line"></div>' : '') + (reflectIndex == 4 || reflectIndex == 14 ? '<div class="v-line"></div>' : '') + '&nbsp;&nbsp;');
    //   }else if(teethIndex < 10 && $.trim(reflectObj.text()) == ''){
    //     reflectObj.html((reflectIndex < 9 ? '<div class="h-line"></div>' : '') + (reflectIndex == 4 || reflectIndex == 14 ? '<div class="v-line"></div>' : '') + '&nbsp;&nbsp;');
    //   }
    // }
  }

  /*点击牙齿*/
  $('.teethItem').click(function () {
    var teethIndex = $(this).attr('teeth');
    var teethContent = $(this).html();
    if (!$(this).hasClass('selected')) {
      $(this).addClass('selected');
      $('.teethItemImg' + teethIndex).html((teethIndex < 9 ? '<div class="h-line"></div>' : '') + (teethIndex == 4 || teethIndex == 14 ? '<div class="v-line"></div>' : '') + '<span class="teethItemText">' + teethContent + '</span>' + '<i class="teethItemI teethItemI' + teethIndex + '" teeth="' + teethIndex + '"></i>');
      attrs[teethIndex].teeth = 1;
    } else {
      $(this).removeClass('selected');
      for (var i in $('.yamianTeethItem' + teethIndex)) {
        if ($('.yamianTeethItem' + teethIndex).attr('teeth') == teethIndex) {
          $('.yamianTeethItem' + teethIndex).removeClass('selected');
        }
      }
      $('.teethItemImg' + teethIndex).html((teethIndex < 9 ? '<div class="h-line"></div>' : '') + (teethIndex == 4 || teethIndex == 14 ? '<div class="v-line"></div>' : '') + '&nbsp;&nbsp;');
      attrs[teethIndex].teeth = 0;
      attrs[teethIndex].yamian = [];
    }
    keepWidthSame(teethIndex);
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
        oldVal[i].yamian.sort(sortMethod)
        attrs[i].yamian.sort(sortMethod)
        if (oldVal[i].yamian.join("") != attrs[i].yamian.join("") && oldVal[i].yamian.length != 0) {
          change[i] = {
            val: oldVal[i],
            teethIndex: $("#imgBoxDirty .teethItemImg" + i + " .teethItemText").html(),
            type: "del"
          }
        } else if (oldVal[i].yamian.join("") != attrs[i].yamian.join("") && oldVal[i].yamian.join("") == "") {
          change[i] = {
            val: attrs[i],
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
    // context.scale(10, 10);
    // html2canvas($('#imgBox')[0], {
    //   scale: 1,
    //   canvas: canvas,
    //   width: $("#imgBox").outerWidth() + 6,
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

  //取消按钮事件
  $('.doCancel').click(function () {
    if (oNode) {
      delete AX.plugins[thePlugins].editdom;
    }
    dialog.close(true);
  });

})(AX)
