export function initIframeMessage() {
  // iframe 通信
  window.addEventListener(
    "message",
    function (e) {
      if (e.data && e.data.type == "router-go" && e.data.projectName == 'yun' && e.data.path) {
        window.root.$router.push(e.data.path)
      }
    },
    false
  );
}