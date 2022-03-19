(function (AX) {
  var oNode = null;
  window.onload = function () {
    if (AX.plugins[thePlugins].editdom) {
      oNode = AX.plugins[thePlugins].editdom;
      var json = JSON.parse(oNode.getAttribute('attrs'));
    }
  }

  dialog.onok = function () {
    if ($G('orgname').value == '') {
      alert('控件名称不能为空');
      return false;
    }
    var gValue = $G('orgvalue').value.replace(/\"/g, "&quot;"), gTitle = $G('orgname').value.replace(/\"/g, "&quot;"),
      gFontSize, gWidth = $G('orgwidth').value, gHeight = $G('orgheight').value, gType = $G('orgtype').value;

    if (!oNode) {
      try {
        /*start 前台生成条形码*/
        /*oNode = document.getElementsByClassName('axNewField')[0];
        oNode.setAttribute('title', gTitle);
        oNode.setAttribute('name', 'axNewField');
        oNode.setAttribute('value', gValue);
        oNode.setAttribute('orgtype', gType);
        oNode.setAttribute('axPlugins', thePlugins);
        oNode.setAttribute('orgwidth', gWidth);
        oNode.setAttribute('orgheight', gHeight);

        JsBarcode(oNode, $G('orgvalue').value, options = {
          format: "CODE128",
          displayValue: true,
          fontSize: 18,
          height: 100
        });

        setTimeout(function () {
          editor.execCommand('insertHtml', oNode.outerHTML);
          delete AX.plugins[thePlugins].editdom;
          dialog.close(true);
        }, 1000);

        return false;*/
        /*end 前台生成条形码*/

        /*start 前台生成二维码*/
        oNode = document.getElementsByClassName('axNewField')[0];;
        var qrcode = new QRCode(oNode, {
          width: 40,
          height: 40
        });
        qrcode.makeCode($G('orgvalue').value);
        setTimeout(function () {
          var htmlStr = oNode.innerHTML;
          var htmlStrNew = htmlStr.slice(htmlStr.indexOf('<img'), htmlStr.indexOf('<img') + 4) + ' attrs=' + JSON.stringify(json) + ' axPlugins=' + thePlugins + ' class="ctrl-value qrcode" title="' + json.isShow + '"' + htmlStr.slice(htmlStr.indexOf('<img') + 4);
          editor.execCommand('insertHtml', htmlStrNew);
          delete AX.plugins[thePlugins].editdom;
          dialog.close(true);
        }, 1000);
        return false;
        /*end 前台生成二维码*/

      } catch (e) {
        return false;
      }
    } else {
      oNode.setAttribute('title', gTitle);
      oNode.setAttribute('orgtype', gType);
      oNode.setAttribute('value', gValue);
      if (gWidth != '') {
        oNode.style.width = gWidth + 'px';
      } else {
        oNode.style.width = '';
      }
      oNode.setAttribute('orgwidth', gWidth);
      if (gHeight != '') {
        oNode.style.height = gHeight + 'px';
      } else {
        oNode.style.height = '';
      }
      oNode.setAttribute('orgheight', gHeight);

      delete AX.plugins[thePlugins].editdom;
      return true;
    }
  };
  dialog.oncancel = function () {
    if (AX.plugins[thePlugins].editdom) {
      delete AX.plugins[thePlugins].editdom;
    }
  };
})(AX)
