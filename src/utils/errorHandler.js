import { post } from "@/utils/request";

export default function(err, vm, info) {
  let {
    message, // 异常信息
    name, // 异常名称
    script, // 异常脚本url
    line, // 异常行号
    column, // 异常列号
    stack // 异常堆栈信息
  } = err;
  let errorMsg = `Error: [name: ${name}][message: ${message}][script: ${script}][stack: ${stack}][line: ${line}][column: ${column}][info: ${info}]`;
//   console.log("自定义错误处理：" + errorMsg);
  console.error(stack)
  
}
