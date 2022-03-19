let directives = {
    //focus 当前input 框
    focus: {
      inserted(el, vDir, vNode) {
        let targetInput = el.querySelector(".el-input__inner");
        // console.log("targetInput", targetInput);
        // console.log("v-focus 指令执行 日志");
        targetInput.focus();
        targetInput.select();
      }
    },
    //选中文本指令
    selectInner: {
      inserted(el, vDir, vNode) {
        // console.log(el);
        let targetInput = el.querySelector(".el-input__inner");
        // console.log("targetInput", targetInput);
        targetInput.addEventListener("focus", event => {
          // console.log(event, event.target);
          // setTimeout(() => {
            // console.log("选中了 selectInner  日志");
            targetInput.select();
          // }, 50);
        });
      }
    }
  }

export default directives;