window.addEventListener(
  "message",
  function(e) {
    console.log("-------", e)
    if (e.data.act == "timeline") {
      if (window.root) {
        window.root.update(e.data.msg);
      } else {
        start(e.data.msg);
      }
    } else if (e.data.act == "threeMeasure") {
      if (window.root) {
        window.root.draw(e.data.msg);
      } else {
        start(e.data.msg);
      }
    } else {
      alert("未定义的消息: " + e.data.act);
    }
  },
  false
);