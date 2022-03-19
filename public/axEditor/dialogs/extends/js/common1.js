(function(AX) {
  var oNode = null;
  var oldVal = null; // 记录初始值
  var change = {}; // 记录每次修改值
  var history = null; // 记录历史修改信息
  var editorModel = editor.options.editorModel;

  //初始化加载之前编辑的数据
  window.onload = function() {
    document.getElementById("preview_slot").innerHTML = AX.medicalPreview[thePlugins](false, editorModel);
    if (AX.plugins[thePlugins].editdom) {
      oNode = AX.plugins[thePlugins].editdom;
      //编辑时根据属性数据反显
      attrs = JSON.parse(oNode.getAttribute("attrs")).attrs;
    }
    for (var key in attrs) {
      $("#i" + key).val(attrs[key]);
      $("." + key).html(attrs[key]);
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
      for(var i = history.length - 1; i >= 0 ; i--) {
        for(var j in history[i]) {
          // 显示留痕信息
          showHistoryMark($("#imgBox ." + j), history[i][j].val, history[i][j].type)
        }
      }
    }

    if (oldVal == null) { //
      oldVal = {}
      for (var j in attrs) {
        oldVal[j] = attrs[j];
      }
    }
    // 记录本次编辑初始值 留痕用 end


    //绑定输入框与实时预览处联动
    for (var k in attrs) {
      (function(k) {
        $("#i" + k).on("keyup", function() {
          var val = $(this).val();
          $("." + k).html(val);
          attrs[k] = val;
        });
        $("#i" + k).blur(function() {
          var val = $(this).val();
          $("." + k).html(val);
          attrs[k] = val;
          createMarkNode($("#imgBox ." + k), oldVal[k], val, editorModel)
        });
      })(k);
      // 初始化本次 所有修改留痕
      createMarkNode($("#imgBox ." + k), oldVal[k], attrs[k], editorModel)
    }
  };

  //确定按钮事件
  $("#doOk").click(function() {
    //设置画布，防止图片变模糊
    var width = (oNode && oNode.getAttribute("width")) || $("#imgBox").width();
    var height =
      (oNode && oNode.getAttribute("height")) || $("#imgBox").height();
    var markClass = "";
    var idStr = +new Date();
    if (editorModel == "mark") {  // 留痕模式下生成未留痕表达式
      // 记录本次修改值
      // 记录修改类型  add 增加   del 删除
      for(var i in oldVal) {
        if (oldVal[i] != attrs[i] && oldVal[i] != "") {
          change[i] = {
            val: oldVal[i],
            type: "del"
          }
        }else if(oldVal[i] != attrs[i] && oldVal[i] == ""){
          change[i] = {
            val: attrs[i],
            type: "add"
          }
        }
      }

      // 记录留痕信息
      var time = formatCurDate(new Date(parseInt(editor.options.dateObj.serverDate) + (+new Date() - editor.options.dateObj.serverDate)), "yyyy-MM-dd HH:mm:ss");
      change["time"] = time;
      change["user"] = editor.options.userInfo.name;
      markClass = "mark-free-medical";
      // 生成正常的表达式图片
      AX.mh.medical
        .call(window, $("#imgBoxDirty")[0], attrs, thePlugins, {
          sizeWidth: $("#imgBoxDirty").width(),
          sizeHeight: $("#imgBoxDirty").height()
        }, "mark-old-medical hide-mark")
        .then(function (data) {
          var imgStr = data.imgStr;
          var oldMedicals = editor.document.querySelectorAll(".mark-old-medical");
          for (var i = 0; i < oldMedicals.length; i++) {
            if ((oNode?oNode.getAttribute("focusId"):"") == oldMedicals[i].getAttribute("focusId")) {
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
            }else{
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
    // 生成带有留痕信息的表达式图片
    AX.mh.medical.call(window, $('#imgBox')[0], attrs, thePlugins, {
      sizeWidth: width,
      sizeHeight: height
    },markClass).then(function(data) {
      var imgStr = data.imgStr;
      var imgSrc = data.imgSrc;
      if (!oNode) {
        try {
          var div = document.createElement("div");
          div.innerHTML = imgStr;
          if(editorModel == "mark") {
            // 留痕模式携带信息
            div.children[0].setAttribute("focusId", idStr);
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
    // html2canvas($("#imgBox")[0], {
    //   scale: 1,
    //   canvas: canvas,
    //   width: $("#imgBox").outerWidth(),
    //   height: $("#imgBox").outerHeight()
    // }).then(function(canvas) {
    //   var base64Data = canvas.toDataURL();
    //   var html =
    //     '<img src="' +
    //     base64Data +
    //     '" class="medical-expression menses" axplugins="' +
    //     thePlugins +
    //     "\" attrs='" +
    //     JSON.stringify(attrs) +
    //     "'>";
    //   if (!oNode) {
    //     try {
    //       editor.execCommand("inserthtml", html);
    //       delete AX.plugins[thePlugins].editdom;
    //     } catch (e) {
    //       console.log(e);
    //       return false;
    //     }
    //   } else {
    //     oNode.setAttribute("src", base64Data);
    //     oNode.setAttribute("attrs", JSON.stringify(attrs));
    //     delete AX.plugins[thePlugins].editdom;
    //   }
    //   dialog.close(true);
    // });
  });

  //取消按钮事件
  $("#doCancel").click(function() {
    if (oNode) {
      delete AX.plugins[thePlugins].editdom;
    }
    dialog.close(true);
  });
})(AX);
