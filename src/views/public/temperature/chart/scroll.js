function ScrollView(width, height, direction) {
  PIXI.Container.call(this);

  this.mousedowned = false;
  this.lastPos = {};
  this.scrollTween = null;
  this.screenWidth = width;
  this.screenHeight = height;
  this.direction = direction || "all";

  // 内容容器
  this.scrollContainer = new PIXI.DisplayObjectContainer();
  this.addChild(this.scrollContainer);

  // 遮罩层
  this.mask = new PIXI.Graphics();
  this.mask
    .beginFill(0xFFFFFF)
    .drawRect(0, 0, width, height)
    .endFill();

  this.addChild(this.mask);
  this.scrollContainer.mask = this.mask;

  // 触控事件Handler
  this.interactive = true;
  this.mousemove = this.onmousemove;
  this.mousedown = this.onmousedown;
  this.mouseup = this.onmouseup;
  this.mouseout = this.onmouseout;
  this.touchmove = this.onmousemove;
  this.touchstart = this.onmousedown;
  this.touchend = this.onmouseup;
}

ScrollView.prototype = new PIXI.Container();
ScrollView.prototype.constructor = ScrollView;

ScrollView.prototype.scrollOffset = function (ox, oy) {

  var maxOffsetX = this.scrollContainer.width - this.screenWidth;
  if (this.scrollContainer.x >= -maxOffsetX && (this.direction === "x" || this.direction === "all")) {
    this.scrollContainer.x += ox;
    // 到尾就不能继续
    if (this.scrollContainer.x < -maxOffsetX) {
      this.scrollContainer.x = -maxOffsetX;
    }
    // 到头就不能继续
    if (this.scrollContainer.x > 0) {
      this.scrollContainer.x = 0;
    }
    
  }

  var maxOffsetY = this.scrollContainer.height - this.screenHeight;
  if (this.scrollContainer.y >= -maxOffsetY && (this.direction === "y" || this.direction === "all")) {
    this.scrollContainer.y += oy;
    // 到尾就不能继续
    if (this.scrollContainer.y < -maxOffsetY) {
      this.scrollContainer.y = -maxOffsetY;
    }
    // 到头就不能继续
    if (this.scrollContainer.y > 0) {
      this.scrollContainer.y = 0;
    }
  }
}

ScrollView.prototype.onmousemove = function (event) {
  var data = event.data;
  var clientX = !data.originalEvent.touches ? data.originalEvent.clientX : data.originalEvent.touches[0].clientX;
  var clientY = !data.originalEvent.touches ? data.originalEvent.clientY : data.originalEvent.touches[0].clientY;

  if (this.mousedowned) {
    var oldScrollContainerX = this.scrollContainer.x;
    var oldScrollContainerY = this.scrollContainer.y;

    var offsetX = clientX - this.lastPos.x;
    this.lastPos.x = clientX;
    var offsetY = clientY - this.lastPos.y;
    this.lastPos.y = clientY;
    this.scrollOffset(offsetX, offsetY);
    
    // 如果位置有变化就告知外界
    if (oldScrollContainerX != this.scrollContainer.x ||
      oldScrollContainerY != this.scrollContainer.y) {
      this.moveHandler && this.moveHandler(this.scrollContainer.x - oldScrollContainerX, this.scrollContainer.y - oldScrollContainerY);
    }
  }
}

ScrollView.prototype.onmousedown = function (event) {
  var data = event.data;
  var clientX = !data.originalEvent.touches ? data.originalEvent.clientX : data.originalEvent.touches[0].clientX;
  var clientY = !data.originalEvent.touches ? data.originalEvent.clientY : data.originalEvent.touches[0].clientY;
  this.lastPos = {
    x: clientX,
    y: clientY
  };
  this.mousedowned = true;
}
ScrollView.prototype.onmouseup = function () {
  this.mousedowned = false;
}
ScrollView.prototype.onmouseout = function () {
  this.mousedowned = false;
}