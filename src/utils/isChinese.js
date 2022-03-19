export default function isChinese(val) {
    if (val) {
        let isChinese = false;
        for (let i = 0; i < val.toString().length; i++) {
            if (val.toString().charCodeAt(i) > 255) {
                // 含中文
                isChinese = true;
                break;
            }
        }
        //不含中文
        return isChinese;
    } else {
        //无值
        return true;
    }
}