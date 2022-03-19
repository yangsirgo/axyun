function isIE() {
  if (window.attachEvent) {
    return true;
  }
  return false;
}

//moveRow在IE支持而在火狐里不支持！以下是扩展火狐下的moveRow
if (!isIE()) {
  function getTRNode(nowTR, sibling) {
    while ((nowTR = nowTR[sibling])) {
      if (nowTR.tagName == "TR") {
        break;
      }
    }
    return nowTR;
  }
  if (typeof Element != "undefined") {
    Element.prototype.moveRow = function(
      sourceRowIndex,
      targetRowIndex //执行扩展操作
    ) {
      if (
        !/^(table|tbody|tfoot|thead)$/i.test(this.tagName) ||
        sourceRowIndex === targetRowIndex
      ) {
        return false;
      }
      var pNode = this;
      if (this.tagName == "TABLE") {
        pNode = this.getElementsByTagName("tbody")[0];
      } //firefox会自动加上tbody标签，所以需要取tbody，直接table.insertBefore会error
      var sourceRow = pNode.rows[sourceRowIndex],
        targetRow = pNode.rows[targetRowIndex];
      if (sourceRow == null || targetRow == null) {
        return false;
      }
      var targetRowNextRow =
        sourceRowIndex > targetRowIndex
          ? false
          : getTRNode(targetRow, "nextSibling");
      if (targetRowNextRow === false) {
        pNode.insertBefore(sourceRow, targetRow);
      } //后面行移动到前面，直接insertBefore即可
      else {
        //移动到当前行的后面位置，则需要判断要移动到的行的后面是否还有行，有则insertBefore，否则appendChild
        if (targetRowNextRow == null) {
          pNode.appendChild(sourceRow);
        } else {
          pNode.insertBefore(sourceRow, targetRowNextRow);
        }
      }
    };
  }
}

/*删除tr*/
function fnDeleteRow(obj) {
  var oTable = document.getElementById("options_table");
  while (obj.tagName != "TR") {
    obj = obj.parentNode;
  }
  oTable.deleteRow(obj.rowIndex);
  reIndex();
}

/*上移*/
function fnMoveUp(obj) {
  var oTable = document.getElementById("options_table");
  while (obj.tagName != "TR") {
    obj = obj.parentNode;
  }
  var minRowIndex = 1;
  var curRowIndex = obj.rowIndex;
  if (curRowIndex - 1 >= minRowIndex) {
    oTable.moveRow(curRowIndex, curRowIndex - 1);
  } else {
    alert("已经是第一行了！");
  }
  reIndex();
}
/*下移*/
function fnMoveDown(obj) {
  var oTable = document.getElementById("options_table");
  while (obj.tagName != "TR") {
    obj = obj.parentNode;
  }
  var maxRowIndex = oTable.rows.length;
  var curRowIndex = obj.rowIndex;
  if (curRowIndex + 1 < maxRowIndex) {
    oTable.moveRow(curRowIndex, curRowIndex + 1);
  } else {
    alert("我是有底线的！");
  }
  reIndex();
}

/*生成tr*/
function fnAddComboTr(obj) {
  var oTable = document.getElementById("options_table"),
    new_tr_node = oTable.insertRow(oTable.rows.length),
    new_td_node0 = new_tr_node.insertCell(0),
    new_td_node1 = new_tr_node.insertCell(1),
    new_td_node2 = new_tr_node.insertCell(2),
    new_td_node3 = new_tr_node.insertCell(3),
    new_td_node4 = new_tr_node.insertCell(4),
    new_td_node5 = new_tr_node.insertCell(5),
    new_td_node6 = new_tr_node.insertCell(6),
    readOnly = false,
    cls = "option-tr";
  if (obj.isMetaRange) {
    readOnly = true;
    cls += " range-option-tr";
  }
  new_tr_node.setAttribute("class", cls);
  new_td_node0.setAttribute("class", "index");

  var isDefault = "";
  if (obj.isDefault) {
    isDefault = 'checked="checked"';
  }
  if (!obj.key) {
    obj.key = "";
  }
  if (!obj.value) {
    obj.value = "";
  }
  new_td_node0.innerHTML =
    "<td>" + ($("#options_table tr").length - 1) + "</td>";
  new_td_node1.innerHTML =
    '<td><input type="text" ' +
    (readOnly ? "readonly" : "") +
    ' autocomplete="off" class="key" value="' +
    obj.key +
    '" placeholder="选项值"></td>';
  new_td_node2.innerHTML =
    '<td><input type="text" ' +
    (readOnly ? "readonly" : "") +
    ' autocomplete="off" class="value" value="' +
    obj.value +
    '" placeholder="选项含义"></td>';
  new_td_node3.innerHTML =
    '<td><input type="text" autocomplete="off" class="score" value="' +
    (obj.score || 0) +
    '" placeholder="分值" name="score"></td>';
  new_td_node4.innerHTML =
    '<td><input type="text" autocomplete="off" class="printValue" value="' +
    (obj.printValue || obj.value) +
    '" placeholder="打印值" name="printValue"></td>';
  new_td_node5.innerHTML =
    '<td><input type="' +
    (formName == "selectForm" || formName == "radioForm"
      ? "radio"
      : "checkbox") +
    '" name="defaultOption" class="isDefault" ' +
    isDefault +
    "></td>";
  new_td_node6.innerHTML =
    '<td><img class="opt-icon" title="上移" onclick="fnMoveUp(this)" src="images/up.png"><img class="opt-icon" title="下移" onclick="fnMoveDown(this)" src="images/down.png"><img class="opt-icon" title="添加" onclick="fnAdd(this)" src="images/add.png"><img class="opt-icon" title="删除" onclick="fnDeleteRow(this)" src="images/del.png"></td>';
  return true;
}
function fnAdd() {
  fnAddComboTr({ key: "", value: "", isDefault: false });
}
/*组合checkbox*/
function fnParseOptions(gChecked) {
  var oTable = document.getElementById("options_table");
  var nTr = oTable.getElementsByTagName("tr"),
    trLength = nTr.length,
    html = "";
  for (var i = 0; i < trLength; i++) {
    var inputs = nTr[i].getElementsByTagName("input");
    if (inputs.length > 0) {
      if (!inputs[1].value) {
        continue;
      }
      var sChecked = "";
      if (inputs[0].checked) {
        sChecked = 'checked="checked"';
      }
      html +=
        '<input name="' +
        inputs[1].name +
        '" value="' +
        inputs[1].value +
        '" ' +
        sChecked +
        ' type="checkbox"/>' +
        inputs[1].value +
        "&nbsp;";
      if (gChecked == "orgchecked1") {
        //竖排
        html += "<br/>";
      }
    }
  }
  return html;
}

function getOptions() {
  var optionTrs = $(".option-tr"),
    options = [],
    keys = {},
    isContinue = false;
  for (var i = 0; i < optionTrs.length; i++) {
    var key = $(optionTrs[i])
        .find(".key")
        .val(),
      val = $(optionTrs[i])
        .find(".value")
        .val(),
      isDefault = $(optionTrs[i])
        .find(".isDefault")
        .is(":checked");
    var score =
      $(optionTrs[i])
        .find(".score")
        .val() || 0;
    var printValue = $(optionTrs[i])
      .find(".printValue")
      .val();
    if (!isContinue && (key == "" || val == "")) {
      if (confirm("选项值或含义为空将会丢失，是否继续保存？")) {
        isContinue = true;
        continue;
      } else {
        return false;
      }
    } else if (key != "" && val != "") {
      options.push({
        index: i + 1,
        key: key,
        value: val,
        isDefault: isDefault,
        score: score,
        printValue: printValue
      });
    }
    if (!keys[key]) {
      keys[key] = true;
    } else if (key != "") {
      alert("选项值不能重复，请修改！");
      return false;
    }
  }

  return options;
}
