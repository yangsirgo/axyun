import {
  MessageBox
} from "element-ui";

export default function confirmBox({
  // 标题
  titleText = '提示',
  // 需要注意的内容
  contentText = '您确定要进行此操作吗?',
  // 询问文本
  askText = '你要继续吗?',
  // 是否显示取消按钮
  showCancelButton = true,
  // 是否显示右上角关闭按钮
  showClose = false,
  // 确认按钮文本
  confirmButtonText = '确定',
  // 取消按钮文本
  cancelButtonText = '取消',
  // 确认回调
  confirm = () => {},
  // 取消回调
  cancel = () => {}
}) {
  const h = this.$createElement;
  MessageBox({
    title: '',
    message: h('div', {
      class: 'l-confirm-box'
    }, [
      h('p', {
        class: 'confirm-title-box'
      }, [
        h('i', {
          class: 'el-icon-warning'
        }, null),
        h('span', {
          class: 'confirm-title'
        }, titleText)
      ]),
      h('p', {
        class: 'confirm-content'
      }, contentText),
      h('p', {
        class: 'confirm-bottom-text'
      }, askText)
    ]),
    showCancelButton,
    showClose,
    confirmButtonText,
    cancelButtonText,
    customClass: 'custom-confirm',
    cancelButtonClass: 'confirm-cancel',
    beforeClose: (action, instance, done) => {
      /**
       * 调用done()关闭提示框
       */
      if (action === 'confirm') {
        confirm(action, instance, done);
      } else {
        cancel();
        done();
      }
    }
  }).then(() => {}).catch(() => {})
}
