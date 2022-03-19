export default function formatNum(num, decleng = 2) {
  let newNum = num || 0;
  let numStr; //先转为字符串，再分开整数和小数部分
  let less = false;
  if (newNum < 0) {
    less = true;
    numStr = newNum.toString().substring(1).split('.');
  } else {
    numStr = newNum.toString().split('.');
  }

  let numInt = numStr[0]; // 整数部分
  let numDec = numStr.length > 1 ? '.' + numStr[1] : '';
  let len =  numStr.length > 1 ? numStr[1].length : 0;
  if(len > decleng){
    let newNumDec = `0.${numStr[1]}`;
    numDec = Number(newNumDec).toFixed(decleng).slice(1);
  }else{
    if(len > 0 ){
      let decL = decleng - len;
      for(let i = 0; i < decL; i++){
        numDec += '0'
      }
    }else{
      numDec += '.';
      for(let i = 0; i < decleng; i++){
        numDec += '0'
      }
    }
  }

/*  if (numDec.length === 2) {
    numDec += '0'
  } else if (numDec.length === 0) {
    numDec += '.0000'
  }*/
  // 小数部分，只有原数字存在小数点的时候，分割完长度才会大于1，才需要存储小数，记得前面加小数点
  let resultInt = ''; //存储整数部分处理结果
  while (numInt.length > 3) { //当剩余整数部分长度大于3时继续处理
    resultInt = ',' + numInt.slice(-3) + resultInt; //把后三位截出来，和处理结果拼在一起，前面加逗号
    numInt = numInt.slice(0, -3); // 剩下的部分是除去刚刚截掉的3位的部分
  }
  if (less) {
    return '-' + numInt + resultInt + numDec;
  }
  return numInt + resultInt + numDec; //结果是“剩余的不足3位的整数”+“处理好的整数结果”+“小数部分”
}
