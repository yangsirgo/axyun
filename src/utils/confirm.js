import { MessageBox } from "element-ui";
import { createElement, $createElement } from "vue";

export function confirmBox({
  component = null,
  componentName = "",
  confirmData = {},
  confirmValidate = () => {},
  ...rest
}) {
  const h = this.$createElement;
  return new Promise((resolve, reject) => {
    MessageBox({
      message: h(component, {
        props: { ...confirmData }
      }),
      beforeClose: (action, instance, done) => {
        const cptInstance = instance.$children.find(child => {
          return child.$options.name === componentName;
        });
        confirmValidate(action, cptInstance, done);
      },
      ...rest
    })
      .then(resolve)
      .catch(reject);
  });
}
