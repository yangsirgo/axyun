(function (AX) {
  /* 元素 */
  // 模拟数据元数据，后期替换为ajax远程获取
  var metaDatas = [
    {name: '姓名', value: 'name', placeholderText: '请输入姓名', tipText: '姓名'},
    {name: '性别', value: 'sex', placeholderText: '请输入性别', tipText: '性别'}
  ], options = '<option>请选择</option>';
  for (var i = 0; i < metaDatas.length; i++) {
    options += '<option value="' + metaDatas[i].value + '">' + metaDatas[i].name + '</option>'
  }
  $('#metaData').html(options);
  // 数据元发生变化，关联属性随之改变
  // 考虑到提示和占位文本为空时，元素名称变化，上述两项会随之改变，因此需要触发元素名称的keyup事件
  $('#metaData').change(function () {
    var index = $(this).find('option:selected').index() - 1;
    if (index < 0) {
      return;
    }
    var data = metaDatas[index];
    $('#placeholderText').val(data.placeholderText);
    $('#tipText').val(data.tipText);
    $('#name').val(data.name).trigger('keyup');
  })

  // 元素名称改变，若占位和提示文本为空，则随着元素名称而改变
  $('#name').change(function () {
    var name = $.trim($(this).val()),
      placeholderText = $.trim($('#placeholderText').val()),
      tipText = $.trim($('#tipText').val());
    if (placeholderText == '' || placeholderText.substring(3) == name.substring(0, name.length - 1)) {
      $('#placeholderText').val('请输入' + name)
    }
    if (tipText == '' || tipText == name.substring(0, name.length - 1)) {
      $('#tipText').val(name)
    }
  })
  /* 元素 */

  var oNode = null;
  window.onload = function () {
    if (AX.plugins[thePlugins].editdom) {
      oNode = AX.plugins[thePlugins].editdom;
      var json = JSON.parse(oNode.getAttribute('attrs'));
      if (!json || json == null) {
        alert("无法识别json！");
        return;
      }
      $('#' + formName).fillForm(json);

    } else {
      // 后期替换为uuid
      $('#id').val(new Date().getTime());
    }
  }

  dialog.onok = function () {
    var json = $('#' + formName).serializeJson();
    if (json.id == '') {
      alert('请输入元素编码');
      return false;
    }
    if (json.name == '') {
      alert('请输入元素名称');
      return false;
    }
    if (json.isQrcode) {
      /*二维码*/

    } else {
      /*条形码*/
    }

    if (!oNode) {
      try {
        /*数据发送给后台，1.生成二维码src地址;2.提交表单*/
        /*$.ajax({
          type: "get",
          url: '',
          dataType: "json",
          async: false,
          success: function (data) {
            /!*请求src*!/
            var html = '<img src="' + data.src + '" title="' + json.tipText + '" secret-value="' + !!json.isSecret + '" class="ctrl-value" />';
            oNode = createElement('span', json.id);
            setAttrs(oNode, json);
            oNode.setAttribute("contenteditable", 'false');
            oNode.setAttribute('class', 'ctrl-bg ctrl-field');
            oNode.setAttribute('axPlugins', thePlugins);
            oNode.innerHTML = html;
            editor.execCommand('insertHtml', '\u200B' + oNode.outerHTML + '\u200B');
          },
          error: function (e) {
            alert('网络错误，请重试！');
          }
        });*/

      } catch (e) {
        try {
          console.log(e);
          editor.execCommand('error');
        } catch (e) {
          alert('控件异常，请联系 [安想智慧医疗] 管理员！');
        }
        return false;
      }
    } else {
      /*请求后台更新数据*/
      oNode.setAttribute('id', json.id);
      setAttrs(oNode, json);
      // oNode.innerHTML = html;
      delete AX.plugins[thePlugins].editdom;
    }
  };
  dialog.oncancel = function () {
    if (AX.plugins[thePlugins].editdom) {
      delete AX.plugins[thePlugins].editdom;
    }
  };

  /**
   *
   * @param node
   * @param json
   */
  function setAttrs(node, json) {
    node.setAttribute('title', json.tipText);
    node.setAttribute('isSecret', !!json.isSecret);
    node.setAttribute('start-stain', json.showBorder ? '[' : '');
    node.setAttribute('end-stain', json.showBorder ? ']' : '');
    node.setAttribute('cascadeId', json.cascadeId);
    node.setAttribute('showCondition', json.showCondition);
    node.setAttribute('attrs', JSON.stringify(json));
  }
})(AX)
