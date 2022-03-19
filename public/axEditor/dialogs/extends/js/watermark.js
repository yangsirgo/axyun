(function(AX) {
  var oNode = null;
  var imgSrc;

  // 文字转图片编码数据
  function textBecomeImg(text, fontsize, fontcolor, spaceX, spaceY) {
    spaceX = spaceX || 80;
    spaceY = spaceY || 20;
    var canvas = document.createElement("canvas");
    //小于32字加1  小于60字加2  小于80字加4    小于100字加6
    $buHeight = 0;
    if (fontsize <= 32) {
      $buHeight = 1;
    } else if (fontsize > 32 && fontsize <= 60) {
      $buHeight = 2;
    } else if (fontsize > 60 && fontsize <= 80) {
      $buHeight = 4;
    } else if (fontsize > 80 && fontsize <= 100) {
      $buHeight = 6;
    } else if (fontsize > 100) {
      $buHeight = 10;
    }
    //对于g j 等有时会有遮挡，这里增加一些高度
    canvas.height = fontsize + $buHeight;
    var context = canvas.getContext("2d");
    // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = fontcolor;
    context.font = fontsize + "px Arial";
    //top（顶部对齐） hanging（悬挂） middle（中间对齐） bottom（底部对齐） alphabetic是默认值
    context.textBaseline = "middle";
    context.fillText(text, 0, fontsize / 2);

    //如果在这里直接设置宽度和高度会造成内容丢失 , 暂时未找到原因 , 可以用以下方案临时解决
    //canvas.width = context.measureText(text).width;

    //方案一：可以先复制内容  然后设置宽度 最后再黏贴
    //方案二：创建新的canvas,把旧的canvas内容黏贴过去
    //方案三： 上边设置完宽度后，再设置一遍文字

    //方案一： 这个经过测试有问题，字体变大后，显示不全,原因是canvas默认的宽度不够，
    //如果一开始就给canvas一个很大的宽度的话，这个是可以的。
    //var imgData = context.getImageData(0,0,canvas.width,canvas.height);  //这里先复制原来的canvas里的内容
    //canvas.width = context.measureText(text).width;  //然后设置宽和高
    //context.putImageData(imgData,0,0); //最后黏贴复制的内容

    //方案三：改变大小后，重新设置一次文字
    var rotate = 15;
    var heightBuf = 0.258; // sin15度所带来的高度上需要增加的值
    twidth = context.measureText(text).width;
    canvas.width = twidth + spaceX;
    canvas.height = canvas.height + spaceY + twidth * heightBuf;
    context.fillStyle = fontcolor;
    context.font = fontsize + "px Arial";
    context.textBaseline = "middle";
    // 增加一些透明度
    context.globalAlpha = 0.1;
    // 旋转文字
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(((360 - rotate) * Math.PI) / 180);
    context.fillText(text, -twidth / 2, 0);
    context.translate(-canvas.width / 2, -canvas.height / 2);

    var dataUrl = canvas.toDataURL("image/png"); //注意这里背景透明的话，需要使用png
    return dataUrl;
  }

  function imageToUrl(img, spaceX, spaceY) {
    spaceX = spaceX || 80;
    spaceY = spaceY || 20;
    var canvas = document.createElement("canvas");
    canvas.width = img.width + spaceX;
    canvas.height = img.height + spaceY;
    var context = canvas.getContext("2d");

    var rotate = 15;
    var heightBuf = 0.258;
    canvas.height = canvas.height + img.width * heightBuf;
    // 增加一些透明度
    context.globalAlpha = 0.1;
    // 旋转画图
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(((360 - rotate) * Math.PI) / 180);
    context.drawImage(
      img,
      -img.width / 2,
      -img.height / 2,
      img.width,
      img.height
    );
    context.translate(-canvas.width / 2, -canvas.height / 2);
    var dataUrl = canvas.toDataURL("image/png"); //注意这里背景透明的话，需要使用png
    return dataUrl;
  }

  //初始化加载之前编辑的数据
  window.onload = function() {
    imgSrc = editor.queryCommandValue("watermarksetting");
    if (imgSrc) {
      updatePreview(imgSrc)
    }
  };

  function updatePreview(url) {
    $("#preview").css({
      "background-image": "url(" + url + ")"
    });
  }

  // 输入文字后将文字保存成编码图用于背景展示
  $("#text").blur(function(evt) {
    var value = evt.target.value;
    imgSrc = textBecomeImg(value, 30, "#bdbdbd");
    updatePreview(imgSrc)
  });

  $("#image").change(function(evt) {
    var file = evt.target.files[0];
    if (!file) {
      return;
    }

    if (!FileReader) {
      alert("当前使用浏览器版本过低，不支持图片水印功能，推荐使用chrome浏览器");
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      var img = new Image();
      img.src = reader.result;
      img.onload = function() {
        imgSrc = imageToUrl(img);
        updatePreview(imgSrc)
      };
    };
  });

  //确定按钮事件
  dialog.onok = function() {
    editor.execCommand("watermarksetting", imgSrc);
    delete AX.plugins[thePlugins].editdom;
  };

  //取消按钮事件
  dialog.oncancel = function() {
    if (oNode) {
      delete AX.plugins[thePlugins].editdom;
    }
  };
})(AX);
