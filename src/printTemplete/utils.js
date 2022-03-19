//打印 模板渲染
function compile(template) {
    const evalExpr = /<%=(.+?)%>/g;
    const expr = /<%([\s\S]+?)%>/g;


    template = template
        .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
        .replace(expr, '`); \n $1 \n  echo(`');

    template = 'echo(`' + template + '`);';

    let script =
        `(function parse(data){
      let output = "";
  
  
      //调用函数
      function filterUndefined(a) {
        return a ? a : "";
      }
  
      function echo(html){
        output += html;
      }
  
      ${template}
  
      return output;
    })`;

    return script;
}

export function compileToHtml(tpl, tplData) {
    console.log(tpl, tplData);
    let parseFunc = eval(compile(tpl));
    return parseFunc(tplData);
}

export { compile }
