/* eslint-disable */
var userInfo = editor.options.userInfo,
  apiUrl = editor.options.apiUrl,
  pageSize = 10;
// var userInfo = {
//     token: "+cNGS4gWVKYdgecBLy7Bs5iYKaG8Fv0mqDuGCMaX1bxhAr1c3b1YYA4yqN3jmyFV77kuo6vNbmzAh4fCtD+ZzkW732asHRk5cw1fspek94pijY+2PrjerOATsXFYCYMlccy+d3lHpyw1H+y3Iap/Z/u2EMzkKSigvPypnjA4gGphDsYP7XN3qpdVw8rN4x2bHumqkBXR2rVY4Zh7cEWO2x++xfQ7XPLYtzVjsi+Mht5oSkNkeHTK5SVJ2FCBDDbG/s4GSCNzGhPnO5x+d8POtgAVlrUnyexwfhrg8CgfM0XuZsD37WgA0V7cA9m0StzIGVaaRdfnG166ciJ39jkC+5+r1XZ6pxc/nuR2Sx8M3qUEo1TgeBR3R4GcT3ZuYQMrjcCM/kLvXBPOcac6t8tRNKQ10SlaiBdfJHKfwSPZj4v+y7ckozVMPIA0iDGXV95l4hx/Y2ibABdzLio/pWosfQ==",
//     dept: '92',
//     _currRole: '402836816de23545016de2c38a6e0005'
// };
(function(AX) {
  if ($("#metasDialog").length == 0) {
    $("body").append(
      '<div id="metasDialog" style="display:none;"><span class="colseIcon" onclick="$(\'#metasDialog\').hide();">X</span><table id="metasTable"><tr><td>数据元代码</td><td>数据元名称</td><td>所属目录</td></tr></table><div id="pagers"></div></div>'
    );
  }
  $("body").append(
    '<div id="ajaxMask" style="display:none;position: absolute;top:0;left:0;width:100%;height:' +
      $("body").height() +
      'px;padding-top:40%;color:#fff;text-align:center;background:#000;filter:opacity(60);opacity:0.6;">数据正在加载中......</div>'
  );
  var tabIndex = -1,
    mode = "add";
  $("#metaData").focus(function() {
    this.select();
  });
  $("#showMore").click(function() {
    showMetasDialog(1);
  });
  // 边框类型
  $("input[name='borderType']").change(function(){
    updateBorderTypeElem();
  });
  // 根据边框类型选择情况，显示隐藏HTML结构
  function updateBorderTypeElem () {
    var value = $("input[name='borderType']:checked").val();
    $("#borderType").css("display", value == "border" ? "block" : "none");
    $("#borderHolder").css("display", value == "border" ? "block" : "none");
  }

  //弹窗tr双击时返回数据元信息
  $("#metasTable").on("dblclick", ".meta-tr", function() {
    var label = $(this).attr("label"),
      code = $(this).attr("code"),
      currVal = $("#metaDataId").val();
    (value = $(this).attr("value")), (metaType = $(this).attr("metaType"));
    if (currVal == value) {
      $("#metasDialog").hide();
      return;
    }
    var metaInfo = { label: label, value: value, metaType: metaType, code: code };
    $("#metaData").val(label);
    $("#metaDataId").val(value);
    $("#metaDataInfo").val(JSON.stringify(metaInfo)).trigger("change");
    $("#metaData").trigger("change");
    if (typeof getRanges != "undefined" && (metaType == 1 || metaType == 2)) {
      getRanges(metaType);
    }
    $("#metasDialog").hide();
    $("input[name='isRange'][value='isDictRange']").prop('checked', 'checked');
  });

  /**
   * 列表形式展现更多数据元
   * @param {Number} currentPage 当前页
   */
  function showMetasDialog(currentPage) {
    $("#metasDialog,#ajaxMask").show();
    $.ajax({
      url: apiUrl + "/contrast/getPageByCondition",
      type: "get",
      dataType: "json",
      data: {
        Authorization: userInfo.token,
        hospitalId: userInfo.hosId,
        organizationId: userInfo.dept,
        _currRole: userInfo.role,
        elementBaseCode: pluginCode,
        elementName: $("#metaData").val(),
        pageNo: currentPage,
        pageSize: pageSize
      },
      success: function(data) {
        $("#ajaxMask").hide();
        if (data.code == 1) {
          $(".meta-tr,.no-meta-tr").remove();
          if (data.data) {
            data = data.data;
            var metaDatas = data.contrastPageContentDto;
            if (metaDatas.length > 0) {
              var trs = "",
                totalPage = data.totalPage;
              for (var i = 0; i < metaDatas.length; i++) {
                trs +=
                  '<tr class="meta-tr" label="' +
                  metaDatas[i].dataElementName +
                  '" value="' +
                  metaDatas[i].valueId +
                  '" code="' +
                  metaDatas[i].dataElementCode +
                  '" metaType="' +
                  (metaDatas[i].storageType ? metaDatas[i].storageType : "") +
                  '"><td>' +
                  metaDatas[i].dataElementCode +
                  '</td><td style="text-align:left;">' +
                  metaDatas[i].dataElementName +
                  "</td><td>" +
                  metaDatas[i].standardName +
                  "</td></tr>";
              }
              $("#metasTable").append(trs);

              $("#pagers").pagination({
                currentPage: currentPage, // 当前页数
                totalPage: totalPage, // 总页数
                isShow: true, // 是否显示首尾页
                count: 6, // 显示个数
                homePageText: "首页", // 首页文本
                endPageText: "尾页", // 尾页文本
                prevPageText: "上一页", // 上一页文本
                nextPageText: "下一页", // 下一页文本
                callback: function(current) {
                  showMetasDialog(current);
                }
              });
            } else {
              $("#metasTable").append(
                '<tr class="no-meta-tr"><td colspan="3" align="center">未查找到相关数据元信息！</td></tr>'
              );
            }
          }
        } else {
          alert("数据元获取失败，请刷新重试！");
        }
      },
      error: function(error) {
        $("#ajaxMask").hide();
        alert("数据元获取失败，请刷新重试！");
        console.log(error);
      }
    });
  }

  // 数据元发生变化，关联属性随之改变
  // 考虑到提示和占位文本为空时，元素名称变化，上述两项会随之改变，因此需要触发元素名称的keyup事件
  $("#metaData").change(function() {
    var selectOpt = $(this);
    if ($("#metaDataInfo").val() == '') {
      return;
    }
    $("#name")
      .val(selectOpt.val())
      .trigger("blur");
  });
  $("#metaData").blur(function () {
    if ($("#metaDataInfo").val() == '') {
      $(this).val('')
      $("#name").val('');
    }
  })
  // 元素名称改变，若占位和提示文本为空，则随着元素名称而改变
  // $('#name').change(function(){
  //     var name = $.trim($(this).val()),
  //         placeholderText = $.trim($('#placeholderText').val()),
  //         tipText = $.trim($('#tipText').val());
  //     if(placeholderText == '' || placeholderText.substring(3) == name.substring(0,name.length - 1)){
  //         $('#placeholderText').val('请输入' + name)
  //     }
  //     if(tipText == '' || tipText == name.substring(0,name.length - 1)){
  //         $('#tipText').val(name)
  //     }
  // })

  // 操作符改变触发的操作
  // 若操作符为判断空或非空时，级联条件不可编辑
  $("#operator").change(function() {
    if ($(this).val() == "null" || $(this).val() == "notNull") {
      $("#showCondition").attr("readonly", true);
    } else {
      $("#showCondition").attr("readonly", false);
    }
  });
  var oNode = null,
    oldPlugins = null;
  //初始化加载之前编辑的数据
  window.onload = function() {
    oldPlugins = thePlugins;
    var metaInfo = null;
    var from = this.location.href.split("?")[1];
    if (AX.plugins[thePlugins].editdom) {
      mode = "edit";
      oNode = AX.plugins[thePlugins].editdom;
      var json = JSON.parse(oNode.getAttribute("attrs"));
      if (!json || json == null) {
        alert("无法识别json！");
        return;
      }
      if (thePlugins === "tagelement") {
        json.name = oNode.innerText;
      }
      if (thePlugins === "diagnose") {
        diagnoseType = json.diagnoseType;
        $("#diagnoseType").val(json.diagnoseType)
      }
      if (thePlugins === "signature") {
        if (json.signtype === "textsign") {
          $(".textshow").show();
          $(".checkshow").hide();
        } else {
          $(".checkshow").show();
          $(".textshow").hide();
        }

      }
      $("#" + formName).fillForm(json);
      if(thePlugins === 'signature') {
        if (json.signtype !== "textsign") {
          for(var i = 0;i< json.signatureLevel.length; i++){
            if(json.signatureLevel[i] === '') continue;
            $('#'+json.signatureLevel[i]).prop('checked', true);
          }
          if (json.sort === 'isVertical') {
            $('.preview').css('display', 'block')
            $('.preview span').hide()
          } else {
              $('.preview').css('display', 'inline-block')
              $('.preview span').show()
          };
          var placeholderArr = json.placeholderTextArr;
          for(var a = 0; a < placeholderArr.length; a++) {
            $("input[name='placeholderTextArr']")[a].value = placeholderArr[a];
          }
        }
      }
      thePlugins = getTransferType(formName, json.transferType);

      if (
        thePlugins == "select" ||
        thePlugins == "selectmulti" ||
        thePlugins == "radio" ||
        thePlugins == "checkbox"
      ) {
        if (json.isRange == 1 || json.isRange == 'isCustRange') {
          $("#isCustRange").prop("checked", true);
        }else{
          $("#isDictRange").prop("checked", true);
        }
        var options = json.options ? JSON.parse(json.options) : [];
        for (var i = 0; i < options.length; i++) {
          fnAddComboTr({
            key: options[i].key,
            value: options[i].value,
            isDefault: options[i].isDefault,
            score: options[i].score,
            printValue: options[i].printValue
          });
        }
      }

      if (thePlugins === "datedomain") {
        var newFormat = $("#dateFormat")
          .find("option:selected")
          .text();

        $("#datePreview").html(insertCurDate(newFormat));
      }

      if (json.metaData) {
        metaInfo = JSON.parse(json.metaData);
        $("#metaData").on("autocompletecreate", function(event, ui) {
          $("#metaData").val(metaInfo.label);
          $("#metaDataId").val(metaInfo.value);
          $("#metaDataInfo").val(json.metaData);
        });
      }

      //更新节点是，记录tabIndex
      tabIndex = $(".ctrl-value", oNode).attr("tabIndex");
    } else {
      $.ajax({
        url: apiUrl + "/element/getUUID",
        type: "get",
        dataType: "json",
        data: {
          Authorization: userInfo.token,
          hospitalId: userInfo.hosId,
          organizationId: userInfo.dept,
          _currRole: userInfo.role
        },
        success: function(data) {
          if (data.code == 1) {
            $("#id").val(data.data);
          } else {
            alert("元素编码获取失败，请刷新重试！");
          }
        },
        error: function(error) {
          alert("元素编码获取失败，请刷新重试！");
          console.log(error);
        }
      });
    }
    initDefaultLogic();
    initMetaData(metaInfo);
    updateBorderTypeElem();
  };

  // 初始化一些通用默认逻辑
  // 1. 元素名称输入后同步到占位文本、提示文本、默认值
  function initDefaultLogic() {
    var nameElem = $("#name");
    var placeholderTextElem = $("#placeholderText");
    var tipTextElem = $("#tipText");
    var defaultValElem = $("#defaultVal");
    if (!nameElem) {
      return;
    }
    nameElem.blur(function(evt) {
      var value = evt.currentTarget.value;
      if (value) {
        if (placeholderTextElem && !placeholderTextElem.val()) {
          placeholderTextElem.val(value);
        }
        if (tipTextElem && !tipTextElem.val()) {
          tipTextElem.val(value);
        }
        // if (defaultValElem && !defaultValElem.val()) {
        //   defaultValElem.val(value);
        // }
      }
    });
  }

  /**
   * 初始化数据元可输可选框
   */
  function initMetaData() {
    if ($("#metaData").length == 0) {
      return;
    }
    var autoElem = $("#metaData")
      .autocomplete({
        focus: function(event, ui) {
          if (!ui.item.definition) {
            hideDetailPanel();
            return;
          }
          showDetailPanel(ui.item.definition, ui.item.metaType, ui.item.value);
        },
        close: function() {
          hideDetailPanel();
        },
        source: function(request, response) {
          $.ajax({
            url: apiUrl + "/contrast/getPageByCondition",
            type: "get",
            dataType: "json",
            data: {
              Authorization: userInfo.token,
              hospitalId: userInfo.hosId,
              organizationId: userInfo.dept,
              _currRole: userInfo.role,
              elementBaseCode: pluginCode, //,pluginCode,
              elementName: request.term,
              pageNo: 1,
              pageSize: pageSize
            },
            success: function(data) {
              if (data.code == 1) {
                if (data.data) {
                  data = data.data;
                  var metaDatas = data.contrastPageContentDto,
                    total = data.total,
                    autoData = [];
                  for (var i = 0; i < metaDatas.length; i++) {
                    autoData.push({
                      id: metaDatas[i].id,
                      idx: i + 1,
                      code: metaDatas[i].dataElementCode,
                      label: metaDatas[i].dataElementName,
                      value: metaDatas[i].valueId,
                      metaType: metaDatas[i].storageType
                        ? metaDatas[i].storageType
                        : "",
                      definition: metaDatas[i].dataElementDefinition
                    });
                  }
                  if (total > pageSize) {
                    autoData.push({
                      label: "查看更多",
                      value: "more",
                      metaType: ""
                    });
                  }
                  if (autoData.length == 0) {
                    $("#metaDataInfo").val('')
                    autoData.push({ label: "无", value: "", metaType: "" });
                  }
                  response(autoData);
                }
              } else {
                alert("数据元获取失败，请刷新重试！");
              }
            },
            error: function(error) {
              alert("数据元获取失败，请刷新重试！");
              console.log(error);
            }
          });
        },
        select: function(event, ui) {
          var data = ui.item,
            label = data.label,
            type = data.metaType,
            val = data.value;
          $("#metaData").val(label);
          $("#metaDataId").val(val);
          $("#metaDataInfo").val(JSON.stringify(data));
          $("#metaData").blur();
          if (typeof getRanges != "undefined") {
            $("#name")
              .val(label)
              .trigger("keyup");

            if (val == "more") {
              showMetasDialog(1);
            } else {
              if (val == "") {
                $("#metaDataId").val("");
              }
              if (type == 1 || type == 2) {
                getRanges(type);
              } else {
                $(".option-tr").remove();
              }
            }
          }
          return false;
        }
      });
      autoElem.autocomplete("instance")._renderItem = function(ul, item) {
      if (!item.code) {
        return $("<li>").append(item.label);
      }
      return $("<li>")
        .append(
          "<div>" + item.idx + " | " + item.code + " | " + item.label + "</div>"
        )
        .appendTo(ul);
    };
  }

  function showDetailPanel(definition, type, value) {
    if (typeof getRanges != "undefined" && (type == 1 || type == 2)) {
      getRanges(type, value, function(error, data) {
        if (error) {
          return;
        }
        updateDetail(definition, data)
      });
    } else {
      updateDetail(definition)
    }
  }

  function updateDetail(definition, items) {
    $("#tooltipDefine").html(definition);
    if (items && items.length) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        $("#tooltipValueDomain").append("<tr><td class='first-td'>" + item.vCode + "</td><td class='second-td'>" + item.vMean + "</td></tr>");
      }
      $("#valueDomain").css("visibility", "visible");
    } else {
      $("#valueDomain").css("visibility", "hidden");
    }
    $("#tooltip").popup({
      type: "tooltip",
      absolute: true,
      vertical: "topedge",
      horizontal: "rightedge",
      autoopen: true,
      tooltipanchor: $("#tooltipPoint"),
      closebutton: false,
      offsetleft: 40,
      offsettop: 50,
      opacity: 0,
      focuselement: false,
      keepfocus: false
    });
  }

  function hideDetailPanel() {
    $("#tooltip").popup("hide");
  }

  /**
   * 下拉、单复选获取转换类型
   * @param {String} formName 表单名称
   * @param {String} transferType 转换后的控件类型
   */
  function getTransferType(formName, transferType) {
    if (
      (formName == "selectForm" ||
        formName == "selectMultiForm" ||
        formName == "radioForm" ||
        formName == "checkboxForm") &&
      !!transferType
    ) {
      return transferType;
    }
    return thePlugins;
  }

  /**
   * 构造控件html
   * @param {Object} json 控件属性json
   * @returns {String} 控件html
   */
  function radselectMakeHtml(json, thePlugins, oNode) {
    var type = thePlugins;
    var labelStr = "";
    var dataList = json.options ? JSON.parse(json.options) : [],
      selectVals =
        mode == "edit" && oNode.getAttribute("selectval")
          ? oNode.getAttribute("selectval").split(",")
          : [];
    $.each(dataList, function(index, item) {
      var checked = "";
      if (mode == "edit" && selectVals.length > 0) {
        //编辑控件时根据已选中的项反显
        if ($.inArray(item.key, selectVals) != -1) {
          checked = "checked";
        }
      } else if (mode == "add" && !!item.isDefault) {
        //新增控件时根据默认项反显
        checked = "checked";
      }
      labelStr +=
        "<input id='" +
        json.id +
        "_" +
        index +
        "' value='" +
        item.key +
        "' name='checkField_" +
        json.id +
        "' valuestr='" +
        item.value +
        "' " +
        checked +
        " type='" +
        type +
        "'/><label for='" +
        json.id +
        "_" +
        index +
        "'>" +
        item.value +
        "</label>&nbsp;";
      if (json.direction == 1 && (index != dataList.length - 1)) {
        labelStr += "<br>";
      }
    });
    var spanHtml =
      '<span title="' +
      json.tipText +
      '" secret-value="' +
      !!json.isSecret +
      '" class="ctrl-value" placeholder="' +
      json.placeholderText +
      '" >' +
      labelStr +
      "</span>";
    return spanHtml;
  }

  /**
   * 构造控件html
   * @param {Object} json 控件属性json
   * @returns {String} 控件html
   */
  function makeHtml(json, thePlugins, oNode) {
    var currText = oNode && $.trim(oNode.innerText).replace(/\u200B/g, ""); //获取text，并删除空白字符&#8203;;
    var defaultVal = json.defaultVal === undefined ? "" : json.defaultVal;
    if (thePlugins === "numberelement") {
      //数字元素插入单位和默认值，与其他元素不一样
      currText = ""; //数字元素编辑回弹窗 不取oNode 的值。
      if (
        json.isPopuInput &&
        $("#numVal", oNode).html() != defaultVal &&
        $("#numVal", oNode).html() != undefined
      ) {
        defaultVal =
          $("#numVal", oNode).html() || oNode.childNodes[0].innerHTML || "";
      }
      if (oNode) {
        defaultVal = oNode.childNodes[0].innerHTML
          ? oNode.childNodes[0].innerHTML
          : defaultVal;
      }
      if ($("#eleUnitContr").is(":checked") && json.elemUnit) {
        var elemUnits = json.elemUnit.split("、"),
          selectedUnitVal = $("#eleUnitVal", oNode).val();
        if (!!json.isPopuInput) {
          defaultVal =
            '<span id="numVal" type="numVal"> ' +
            defaultVal +
            ' </span><span type="eleUnitVal">' +
            (selectedUnitVal ? selectedUnitVal : elemUnits[0]) +
            "</span>";
        }
      }
    }
    var innerText = currText ? currText : defaultVal;
    //针对select 和 selectmulti 元素 显示默认值的情况
    if (thePlugins === "select" || thePlugins === "selectmulti") {
      if (mode == "add") {
        var options = getOptions();
        innerText = getSelectVals(options).selectVals;
      }
    }
    if (
      thePlugins === "numberelement" &&
      !!json.isPopuInput &&
      defaultVal != undefined &&
      $("#eleUnitContr").is(":checked") &&
      json.elemUnit
    ) {
      innerText = defaultVal;
    } else if (oNode && thePlugins === "numberelement" && !!!json.isPopuInput) {
      innerText = oNode.childNodes[0].innerHTML;
    }

    var html =
      "<span " +
      (tabIndex != -1 ? "tabIndex=" + tabIndex : "") +
      ' title="' +
      json.tipText +
      '" secret-value="' +
      !!json.isSecret +
      '" class="ctrl-value" placeholder="' +
      json.placeholderText +
      '">' +
      innerText +
      "</span>";

    if ($("#eleUnitContr").is(":checked") && json.elemUnit) {
      var elemUnits = json.elemUnit.split("、"),
        selectedUnitVal = $("#eleUnitVal", oNode).val();
      if (!!!json.isPopuInput) {
        if (elemUnits.length > 1) {
          html +=
            '<select class="ax-editor-number-select" id="eleUnitVal" type="eleUnitVal">';
          for (var i = 0; i < elemUnits.length; i++) {
            html +=
              '<option value="' +
              elemUnits[i] +
              '"' +
              (selectedUnitVal == elemUnits[i] ? " selected" : "") +
              ">" +
              elemUnits[i] +
              "</option>";
          }
          html += "</select>";
        } else {
          html +=
            '<span id="eleUnitVal" type="eleUnitVal">' +
            json.elemUnit +
            "</span>";
        }
      }
    }

    if (thePlugins == "haveornot") {
      // var showText = /* json.notSuffixName+json.yesSuffixName+ */ json.isShowName
      //   ? json.name
      //   : "";
      var showText = "";
      html =
        "<span " +
        (tabIndex != -1 ? "tabIndex=" + tabIndex : "") +
        ' title="' +
        json.tipText +
        '" secret-value="' +
        !!json.isSecret +
        '" class="ctrl-value" placeholder="' +
        showText +
        '" ' +
        (currText == "" ? 'placeWidth="true"' : "") +
        ">" +
        showText +
        "</span>";
    }

    if (thePlugins == "signature") {
      var signatureStr = innerText;
      // if(json.isCurrDoctor){
      //     var signatureType = editor.options.signatureType;
      //     if(signatureType == 'text'){
      //         signatureStr = editor.options.signatureName;
      //     }else if(signatureType == 'img'){
      //         signatureStr = '<img src="' + editor.options.signatureUrl + '">';
      //     }
      // }
      var placeholderTip = json.placeholderText
        ? json.placeholderText
        : "请签名";
      html =
        "<span " +
        (tabIndex != -1 ? "tabIndex=" + tabIndex : "") +
        ' title="' +
        placeholderTip +
        '" secret-value="' +
        !!json.isSecret +
        '" class="ctrl-value" placeholder="' +
        placeholderTip +
        '" ' +
        (currText == "" ? 'placeWidth="true"' : "") +
        ">" +
        signatureStr +
        "</span>";
    }

    return html;
  }

  /**
   * 获取选中项
   * @param {Array} options
   * @returns {Array} 选中项
   */
  function getSelectVals(options) {
    var selectKeys = [],
      selectVals = [];
    for (var i = 0; i < options.length; i++) {
      if (options[i].isDefault) {
        selectKeys.push(options[i].key);
        selectVals.push(options[i].value);
      }
    }
    return {
      selectKeys: selectKeys.join(","),
      selectVals: selectVals.join(",")
    };
  }

  /**
   * 根据配置的字符串长度限制，判断默认值是否符合要求
   * @param {Object} json 控件属性json
   * @returns {Boolean} true--符合要求，false--不符合要求
   */
  function checkDefaultLen(json) {
    // var currText = oNode && $.trim(oNode.innerText).replace(/\u200B/g,''),//获取text，并删除空白字符&#8203;
    var defaultLen = json.defaultVal ? json.defaultVal.length : "";
    if (defaultLen != "") {
      if (
        (json.minLen != "" && defaultLen < json.minLen) ||
        (json.maxLen != "" && defaultLen > json.maxLen)
      ) {
        alert("默认值长度应在" + json.minLen + " ~ " + json.maxLen + "之间");
        return false;
      }
    }
    return true;
  }

  dialog.oncancel = function() {
    if (oNode) {
      delete AX.plugins[thePlugins].editdom;
    }
  };

  dialog.onok = function() {
    var json = $("#" + formName).serializeJson();
    if (json.cascadeId == json.id) {
      alert("级联id不可为元素本身id");
      return false;
    }
    thePlugins = getTransferType(formName, json.transferType);

    if (formName == "haveornot") {
      json.notSuffixName = $("#notSuffixName")
        .find("option:selected")
        .text();
      json.yesSuffixName = $("#yesSuffixName")
        .find("option:selected")
        .text();
    }
    if (thePlugins === 'diagnose') {
      if ($("#diagnoseType").val() == '') {
        alert("请选择诊断类型");
        return false;
      }
      var diagnose = editor.document.querySelectorAll('.diagnose') || [];
      for(var m = 0; m < diagnose.length; m++) {
        if (diagnose[m].getAttribute('diagnoseType') == json.diagnoseCode && !oNode) {
          alert('已有该类型诊断元素');
          return true;
        }
      }
    }
    if (json.id == "") {
      alert("请输入元素编码");
      return false;
    }
    if (json.name == "") {
      alert("请输入元素名称");
      return false;
    }
    if (thePlugins == "numberelement") {
      //数字元素页面 验证默认值
      if (!isNumber(json.defaultVal) && json.defaultVal != "") {
        alert("数字元素默认值应为数字");
        return false;
      }
    } else {
      //非数字元素页面验证最大最小长度
      if (
        !isNumber(json.minLen) &&
        json.minLen != "" &&
        json.minLen != undefined
      ) {
        alert("最小长度应为数字");
        return false;
      }
      if (
        !isNumber(json.maxLen) &&
        json.maxLen != "" &&
        json.minLen != undefined
      ) {
        alert("最大长度应为数字");
        return false;
      }
    }
    if (thePlugins === 'signature') {
      console.log(json)
      var isOk = false;
      var signs = [];
      if(json.signtype != "textsign") {
        var ctrlvalue = editor.document.querySelectorAll(".ctrl-value");
        for(var m = 0; m < ctrlvalue.length; m++) {
          if(ctrlvalue[m].getAttribute("itemsignture")){
            signs.push(ctrlvalue[m].getAttribute("itemsignture"));
          }
        }
      }
      var oldjson = oNode && JSON.parse(oNode.getAttribute("attrs"));
      for(var j = 0; j < json.signatureLevel.length; j++) {
        if (json.signatureLevel[j] != "") {
          isOk = true;
          if(signs.indexOf(json.signatureLevel[j]) > -1) {
            if(oNode) {
              if(JSON.stringify(oldjson.signatureLevel) != JSON.stringify(oldjson.signatureLevel)) {
                alert('当前文书已有所选审签级别的签名，请修改！');
                return false;
              }
            }else{
              alert('当前文书已有所选审签级别的签名，请修改！');
              return false;
            }
          }
          break;
        }
      }
      if (!isOk){
        alert('请选择审签级别！');
        return false;
      }
    }

    if (
      thePlugins == "select" ||
      thePlugins == "selectmulti" ||
      thePlugins == "radio" ||
      thePlugins == "checkbox"
    ) {
      var options = getOptions();
      json.options = options ? JSON.stringify(options) : "";
    }

    if (thePlugins == "signature") {
      json.readonly = true;
    }

    if (!checkDefaultLen(json)) {
      return false;
    }
    // var html = "";
    // if (thePlugins === "checkbox" || thePlugins === "radio") {
    //   //这两种类型单独做模板
    //   html = radselectMakeHtml(json, thePlugins, oNode);
    // } else {
    //   html = makeHtml(json, thePlugins, oNode);
    // }
    if (!oNode) {
      oNode = AX.mh.base.call(window, json, thePlugins, oNode, tabIndex, mode, editor);
      if (oNode) {
        editor.execCommand(
          "insertHtml",
          oNode.outerHTML, // + (thePlugins === "prescription"?'<span style="display:block;clear:both;"></span>':""),
          false,
          false,
          json.id
        );
      } else {
        editor.execCommand("error");
        return false;
      }
      // try {
      //   oNode = createElement("span", json.id);
      //   oNode.setAttribute("contenteditable", "false");
      //   oNode.setAttribute(
      //     "class",
      //     "ctrl-bg ctrl-field" + (thePlugins == "signature" ? " signature" : "")
      //   );
      //   setAttrs(oNode, json);
      //   oNode.innerHTML = html;

      //   editor.execCommand(
      //     "insertHtml",
      //     oNode.outerHTML,
      //     false,
      //     false,
      //     json.id
      //   );
      // } catch (e) {
      //   try {
      //     console.log(e);
      //     editor.execCommand("error");
      //   } catch (e) {
      //     alert("控件异常，请联系 [安想智慧医疗] 管理员！");
      //   }
      //   return false;
      // }
    } else {
      // oNode.setAttribute("id", json.id);
      // setAttrs(oNode, json);
      // oNode.innerHTML = html;
      oNode = AX.mh.base.call(window, json, thePlugins, oNode, tabIndex, mode, editor);
      delete AX.plugins[oldPlugins].editdom;
    }
    setAttrs(oNode, json)
    editor.execCommand("resettabindex"); // 添加tabindex
  };

  /**
   * 设置dom节点属性
   * @param {DOM} node 节点
   * @param {Object} json json属性
   * @returns {Null} nul
   */
  function setAttrs(node, json) {
    oNode.setAttribute("axPlugins", thePlugins);
    if (
      thePlugins === "checkbox" ||
      thePlugins === "radio" ||
      thePlugins === "select" ||
      thePlugins === "selectmulti"
    ) {
      if (!node.getAttribute("selectVal")) {
        var selectedInfo = getSelectVals(JSON.parse(json.options));
        node.setAttribute("selectValText", selectedInfo.selectedVals);
        node.setAttribute("selectVal", selectedInfo.selectKeys);
      }
    }
    var placeholderTip = json.placeholderText ? json.placeholderText : "请签名";
    node.setAttribute(
      "title",
      thePlugins == "signature" ? placeholderTip : json.tipText
    );
    node.setAttribute("isSecret", !!json.isSecret);

    //组合元素 显示边框是 {} 做个判断
    if (thePlugins === "combine") {
      node.setAttribute("start-stain", json.showBorder ? "{" : "");
      node.setAttribute("end-stain", json.showBorder ? "}" : "");
    } else {
      node.setAttribute("start-stain", json.showBorder ? "[" : "");
      node.setAttribute("end-stain", json.showBorder ? "]" : "");
    }
    var nodeClass = node.getAttribute("class");
    if (json.showBorder) {
      node.setAttribute(
        "class",
        nodeClass ? nodeClass.replace(" no-border", "") : ""
      );
    } else {
      node.setAttribute(
        "class",
        nodeClass ? nodeClass + " no-border" : " no-border"
      );
    }
    node.setAttribute("isRequired", !!!json.isEmpty);
    node.setAttribute("cascadeId", json.cascadeId);
    node.setAttribute("disabledId", json.disabledId);
    node.setAttribute("showCondition", json.showCondition);
    node.setAttribute("attrs", JSON.stringify(json));
  }
})(AX);

/**
 * 把url地址转换成js对象
 * @param {DOM} node 节点
 * @returns {Object} Object
 */
function urlToObject() {
  var urlObject = {};
  var url = window.location.search;
  if (/\?/.test(url)) {
    var urlString = url.substring(url.indexOf("?") + 1);
    var urlArray = urlString.split("&");
    for (var i = 0, len = urlArray.length; i < len; i++) {
      var urlItem = urlArray[i];
      var item = urlItem.split("=");
      urlObject[item[0]] = item[1];
    }
  }
  return urlObject;
}

/**
 * @Description: 是否是数字
 * @date 2019/6/18
 * @param text
 */
function isNumber(nubmer) {
  if (nubmer === null || nubmer === undefined) {
    return false
  }
  if (nubmer.replace) {
    nubmer = nubmer.replace(/\s*/g,"");
  }
  return !isNaN(nubmer - 0);
  // // 判断是不是数字
  // var re = /^[0-9]+.?[0-9]*/; //判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
  // if (re.test(nubmer)) {
  //   return true;
  // }
  // return false;
}
