import {
    base64EncodeChars,
    base64DecodeChars,
    base64encode,
    base64decode,
    utf16to8,
    utf8to16,
    CharToHex,
} from './base64.js';

function getXmlHttp() {
    var xmlHttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlHttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    return xmlHttp;
}

var sslEnable = false;


function getHttpObj(actionName) {
    var httpObj = getXmlHttp();
    var URL = "http://127.0.0.1:9528/Service1.asmx";
    if (sslEnable) {
        URL = "https://127.0.0.1:18981/Service1.asmx";
    }
    httpObj.open('POST', URL, false); //同步请求数据,异步是true
    httpObj.setRequestHeader('Content-Type', 'text/xml; charset=utf-8'); //设置请求头类型及编码
    //httpObj.setRequestHeader('Content-Security-Policy', 'upgrade-insecure-requests');
    //httpObj.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpObj.setRequestHeader('SOAPAction', 'http://tempuri.org/' + actionName); //设置Action
    //httpObj.setRequestHeader('If-Modified-Since', '0');
    httpObj.setRequestHeader('Cache-Control', 'no-cache');
    //httpObj.setRequestHeader('Connection', 'keey-alive');
    //httpObj.setRequestHeader('Keep-Alive', '30');
    return httpObj;
}

function getHttpObjImage(actionName) {
    var httpObj = getXmlHttp();
    var URL = "http://localhost:9696/Service1.asmx";
    httpObj.open('POST', URL, false); //同步请求数据,异步是true
    httpObj.setRequestHeader('Content-Type', 'text/xml; charset=utf-8'); //设置请求头类型及编码
    httpObj.setRequestHeader('SOAPAction', 'http://tempuri.org/' + actionName); //设置Action
    httpObj.setRequestHeader('If-Modified-Since', '0');
    return httpObj;
}

function getRequestData(actionName, actionObj) {
    var data = '<?xml version="1.0" encoding="utf-8"?>';

    data += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
    data += '<soap:Body>';


    if (actionObj != null) {
        data += '<' + actionName + ' xmlns="http://tempuri.org">';
        for (let items in actionObj) {
            data += '<' + items + '>' + actionObj[items] + '</' + items + '>';
        }
        data += '</' + actionName + '>';
    } else {
        data += '<' + actionName + ' xmlns="http://tempuri.org" />';
    }
    data += '</soap:Body>';
    data += '</soap:Envelope>';
    return data;
}

function getResponseData(actionName, response) {
    var parseXml;
    var xmlDoc;
    var ret;
    if (typeof window.DOMParser != "undefined") {
        parseXml = new window.DOMParser();
        xmlDoc = parseXml.parseFromString(response, "text/xml");

        if (actionName == 'SZCAInit') {
            ret = xmlDoc.getElementsByTagName('bInit')[0].textContent;
        } else if (actionName == 'SZCAKeyIsExist') {
            ret = xmlDoc.getElementsByTagName('isExist')[0].textContent;
        } else if (actionName == 'SZCASign') {
            ret = xmlDoc.getElementsByTagName('outData')[0].textContent;
        } else if (actionName == 'SZCAGetCertData') {
            ret = xmlDoc.getElementsByTagName('certData')[0].textContent;
        } else if (actionName == 'SZCAGetCertInfo') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
        } else if (actionName == 'SZCAVerify') {
            ret = xmlDoc.getElementsByTagName('bVerify')[0].textContent;
        } else if (actionName == 'SZCASignMessage') {
            ret = xmlDoc.getElementsByTagName('outData')[0].textContent;
        } else if (actionName == 'SZCAVerifyMessage') {
            ret = xmlDoc.getElementsByTagName('bVerify')[0].textContent;
        } else if (actionName == 'SZCAParseSignMessage') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
        } else if (actionName == 'SZCAParseCertData') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
        } else if (actionName == 'SZCAVerifyUserPin') {
            ret = xmlDoc.getElementsByTagName('bPass')[0].textContent;
        } else if (actionName == 'SZCAGetKeyAlgType') {
            ret = xmlDoc.getElementsByTagName('algType')[0].textContent;
        } else if (actionName == 'SZCAGetKey') {
            ret = xmlDoc.getElementsByTagName('keyData')[0].textContent;
        } else if (actionName == 'SZCASymmEncryptData') {
            ret = xmlDoc.getElementsByTagName('cipherData')[0].textContent;
        } else if (actionName == 'SZCASymmDecryptData') {
            ret = xmlDoc.getElementsByTagName('originalData')[0].textContent;
        } else if (actionName == 'SZCASymmEncryptFile') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        } else if (actionName == 'SZCASymmDecryptFile') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        } else if (actionName == 'SZCAEnvelopData') {
            ret = xmlDoc.getElementsByTagName('cipherData')[0].textContent;
        } else if (actionName == 'SZCADevelopData') {
            ret = xmlDoc.getElementsByTagName('originalData')[0].textContent;
        } else if (actionName == 'SZCASetTimeStamp') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        } else if (actionName == 'SZCASetTimeStampEnable') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        } else if (actionName == 'SZCASetTimeStampFailedReturn') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        } else if (actionName == 'SZCAGetLastErrMsg') {
            ret = xmlDoc.getElementsByTagName('errMsg')[0].textContent;
        } else if (actionName == 'SZCAGetLastErrCode') {
            ret = xmlDoc.getElementsByTagName('errCode')[0].textContent;
        } else if (actionName == 'SZCAClearPINCache') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
        }
        return ret;
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        var loadSucc = xmlDoc.loadXML(response);
        if (actionName == 'SZCAInit') {
            ret = xmlDoc.getElementsByTagName('bInit')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bInit')[0].text;
            }
        } else if (actionName == 'SZCAKeyIsExist') {
            ret = xmlDoc.getElementsByTagName('isExist')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('isExist')[0].text;
            }
        } else if (actionName == 'SZCASign') {
            ret = xmlDoc.getElementsByTagName('outData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('outData')[0].text;
            }
        } else if (actionName == 'SZCAGetCertData') {
            ret = xmlDoc.getElementsByTagName('certData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('certData')[0].text;
            }
        } else if (actionName == 'SZCAGetCertInfo') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('infoData')[0].text;
            }
        } else if (actionName == 'SZCAVerify') {
            ret = xmlDoc.getElementsByTagName('bVerify')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bVerify')[0].text;
            }
        } else if (actionName == 'SZCASignMessage') {
            ret = xmlDoc.getElementsByTagName('outData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('outData')[0].text;
            }
        } else if (actionName == 'SZCAVerifyMessage') {
            ret = xmlDoc.getElementsByTagName('bVerify')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bVerify')[0].text;
            }
        } else if (actionName == 'SZCAParseSignMessage') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('infoData')[0].text;
            }
        } else if (actionName == 'SZCAParseCertData') {
            ret = xmlDoc.getElementsByTagName('infoData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('infoData')[0].text;
            }
        } else if (actionName == 'SZCAVerifyUserPin') {
            ret = xmlDoc.getElementsByTagName('bPass')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bPass')[0].text;
            }
        } else if (actionName == 'SZCAGetKeyAlgType') {
            ret = xmlDoc.getElementsByTagName('algType')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('algType')[0].text;
            }
        } else if (actionName == 'SZCAGetKey') {
            ret = xmlDoc.getElementsByTagName('keyData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('keyData')[0].text;
            }
        } else if (actionName == 'SZCASymmEncryptData') {
            ret = xmlDoc.getElementsByTagName('cipherData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('cipherData')[0].text;
            }
        } else if (actionName == 'SZCASymmDecryptData') {
            ret = xmlDoc.getElementsByTagName('originalData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('originalData')[0].text;
            }
        } else if (actionName == 'SZCASymmEncryptFile') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        } else if (actionName == 'SZCASymmDecryptFile') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        } else if (actionName == 'SZCAEnvelopData') {
            ret = xmlDoc.getElementsByTagName('cipherData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('cipherData')[0].text;
            }
        } else if (actionName == 'SZCADevelopData') {
            ret = xmlDoc.getElementsByTagName('originalData')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('originalData')[0].text;
            }
        } else if (actionName == 'SZCASetTimeStamp') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        } else if (actionName == 'SZCASetTimeStampEnable') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        } else if (actionName == 'SZCASetTimeStampFailedReturn') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        } else if (actionName == 'SZCAGetLastErrMsg') {
            ret = xmlDoc.getElementsByTagName('errMsg')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('errMsg')[0].text;
            }
        } else if (actionName == 'SZCAGetLastErrCode') {
            ret = xmlDoc.getElementsByTagName('errCode')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('errCode')[0].text;
            }
        } else if (actionName == 'SZCAClearPINCache') {
            ret = xmlDoc.getElementsByTagName('bSucc')[0].textContent;
            if (ret == undefined) {
                ret = xmlDoc.getElementsByTagName('bSucc')[0].text;
            }
        }
        return ret;
    } else {
        throw new Error("No XML parser found");
    }
}

function getResponseDataImage(actionName, response) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response, 'text/xml');
    var ret;
    if (actionName == 'szpdf-GetFileStream') {
        ret = xmlDoc.getElementsByTagName('strFileStream')[0].textContent;
    } else if (actionName == 'szpdf-GetSealCount') {
        ret = xmlDoc.getElementsByTagName('pCount')[0].textContent;
    } else if (actionName == 'szpdf-GetReturnCode') {
        ret = xmlDoc.getElementsByTagName('nRet')[0].textContent;
    }

    return ret;
}



function SZCA_PdfSign_GetSealImage() {
    var xmlHttp = getHttpObjImage('szpdf-GetSealImageFormKey');
    var data = getRequestData('szpdf-GetSealImageFormKey', null);
    var retValue = "";
    var retCode = ''
    try {
        xmlHttp.send(data);
    } catch (e) {
        return "";
    }

    if (xmlHttp.status == 200) {
        retCode = getResponseDataImage('szpdf-GetReturnCode', xmlHttp.response);
        retValue = getResponseDataImage('szpdf-GetFileStream', xmlHttp.response);
    }

    return retValue;
}

function NotifyClient() {
    alert("您没有安装SZCA客户端软件或您的客户端软件版本较低！");
}

function SZCASSLEnable(bEnable) {
    sslEnable = bEnable;
}

function SZCAInit() {
    var xmlHttp = getHttpObj('SZCAInit');
    var data = getRequestData('SZCAInit', null);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAInit', xmlHttp.response);
            if (parseInt(retValue) != 0) {
                return true;
            }
        } catch (e) {
            var retValue = getResponseData('SZCAInit', xmlHttp.responseText);
            if (parseInt(retValue) != 0) {
                return true;
            }
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCAKeyIsExist() {
    var xmlHttp = getHttpObj('SZCAKeyIsExist');
    var data = getRequestData('SZCAKeyIsExist', null);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAKeyIsExist', xmlHttp.response);
            if (parseInt(retValue) != 0) {
                return true;
            }
        } catch (e) {
            var retValue = getResponseData('SZCAKeyIsExist', xmlHttp.responseText);
            if (parseInt(retValue) != 0) {
                return true;
            }
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCASign(inData) {
    var xmlHttp = getHttpObj('SZCASign');
    var obj = new Object();
    var inDataB64 = base64encode(utf16to8(inData));
    obj.inData = inDataB64;
    var data = getRequestData('SZCASign', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASign', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCASign', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAVerify(signedData, certData, srcData) {
    var xmlHttp = getHttpObj('SZCAVerify');
    var obj = new Object();
    var signedDataB64 = base64encode(utf16to8(signedData));
    var certDataB64 = base64encode(utf16to8(certData));
    var srcDataB64 = base64encode(utf16to8(srcData));
    obj.signedData = signedDataB64;
    obj.certData = certDataB64;
    obj.srcData = srcDataB64;
    var data = getRequestData('SZCAVerify', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAVerify', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAVerify', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCASignMessage(inData, bDetach) {
    var xmlHttp = getHttpObj('SZCASignMessage');
    var obj = new Object();
    var inDataB64 = base64encode(utf16to8(inData));
    obj.inData = inDataB64;
    obj.bDetach = bDetach;
    var data = getRequestData('SZCASignMessage', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASignMessage', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCASignMessage', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAVerifyMessage(signedData, srcData) {
    var xmlHttp = getHttpObj('SZCAVerifyMessage');
    var obj = new Object();
    var signedDataB64 = base64encode(utf16to8(signedData));
    var srcDataB64 = base64encode(utf16to8(srcData));
    obj.signedData = signedDataB64;
    obj.srcData = srcDataB64;
    var data = getRequestData('SZCAVerifyMessage', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAVerifyMessage', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAVerifyMessage', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAGetCertData(certType, dataType) {
    var xmlHttp = getHttpObj('SZCAGetCertData');
    var obj = new Object();
    obj.certType = certType;
    obj.dataType = dataType;
    var data = getRequestData('SZCAGetCertData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAGetCertData', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAGetCertData', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAGetCertInfo(infoType, infoKey) {
    var xmlHttp = getHttpObj('SZCAGetCertInfo');
    var obj = new Object();
    obj.infoType = infoType;
    obj.infoKey = infoKey;
    var data = getRequestData('SZCAGetCertInfo', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCAGetCertInfo', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCAGetCertInfo', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAParseSignMessage(signedData, nType) {
    var xmlHttp = getHttpObj('SZCAParseSignMessage');
    var obj = new Object();
    var signedDataB64 = base64encode(utf16to8(signedData));
    obj.signedData = signedDataB64;
    obj.nType = nType;
    var data = getRequestData('SZCAParseSignMessage', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCAParseSignMessage', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCAParseSignMessage', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAParseCertData(certData, nType) {
    var xmlHttp = getHttpObj('SZCAParseCertData');
    var obj = new Object();
    var certDataB64 = base64encode(utf16to8(certData));
    obj.certData = certDataB64;
    obj.nType = nType;
    var data = getRequestData('SZCAParseCertData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCAParseCertData', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCAParseCertData', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCAVerifyUserPin(userPin) {
    var xmlHttp = getHttpObj('SZCAVerifyUserPin');
    var obj = new Object();
    var userPinB64 = base64encode(utf16to8(userPin));
    obj.userPin = userPinB64;
    var data = getRequestData('SZCAVerifyUserPin', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAVerifyUserPin', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAVerifyUserPin', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}


function SZCAGetKeyAlgType() {
    var xmlHttp = getHttpObj('SZCAGetKeyAlgType');
    var data = getRequestData('SZCAGetKeyAlgType', null);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAGetKeyAlgType', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCAGetKeyAlgType', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}


function SZCAGetKey() {
    var xmlHttp = getHttpObj('SZCAGetKey');
    var data = getRequestData('SZCAGetKey', null);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAGetKey', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAGetKey', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}


function SZCASymmEncryptData(keyData, originalData) {
    var xmlHttp = getHttpObj('SZCASymmEncryptData');
    var obj = new Object();
    var originalDataB64 = base64encode(utf16to8(originalData));
    obj.originalData = originalDataB64;
    var keyDataB64 = base64encode(utf16to8(keyData));
    obj.keyData = keyDataB64;
    var data = getRequestData('SZCASymmEncryptData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASymmEncryptData', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCASymmEncryptData', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCASymmDecryptData(keyData, cipherData) {
    var xmlHttp = getHttpObj('SZCASymmDecryptData');
    var obj = new Object();
    var cipherDataB64 = base64encode(utf16to8(cipherData));
    obj.cipherData = cipherDataB64;
    var keyDataB64 = base64encode(utf16to8(keyData));
    obj.keyData = keyDataB64;
    var data = getRequestData('SZCASymmDecryptData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCASymmDecryptData', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCASymmDecryptData', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCASymmEncryptFile(keyData, originalFile, cipherFile) {
    var xmlHttp = getHttpObj('SZCASymmEncryptFile');
    var obj = new Object();
    var originalFileB64 = base64encode(utf16to8(originalFile));
    obj.originalFile = originalFileB64;
    var cipherFileB64 = base64encode(utf16to8(cipherFile));
    obj.cipherFile = cipherFileB64;
    var keyDataB64 = base64encode(utf16to8(keyData));
    obj.keyData = keyDataB64;
    var data = getRequestData('SZCASymmEncryptFile', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASymmEncryptFile', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCASymmEncryptFile', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCASymmDecryptFile(keyData, cipherFile, originalFile) {
    var xmlHttp = getHttpObj('SZCASymmDecryptFile');
    var obj = new Object();
    var originalFileB64 = base64encode(utf16to8(originalFile));
    obj.originalFile = originalFileB64;
    var cipherFileB64 = base64encode(utf16to8(cipherFile));
    obj.cipherFile = cipherFileB64;
    var keyDataB64 = base64encode(utf16to8(keyData));
    obj.keyData = keyDataB64;
    var data = getRequestData('SZCASymmDecryptFile', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASymmDecryptFile', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCASymmDecryptFile', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCAEnvelopData(pubKeyData, originalData) {
    var xmlHttp = getHttpObj('SZCAEnvelopData');
    var obj = new Object();
    var originalDataB64 = base64encode(utf16to8(originalData));
    obj.originalData = originalDataB64;
    var pubKeyDataB64 = base64encode(utf16to8(pubKeyData));
    obj.pubKeyData = pubKeyDataB64;
    var data = getRequestData('SZCAEnvelopData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAEnvelopData', xmlHttp.response);
            return retValue;
        } catch (e) {
            var retValue = getResponseData('SZCAEnvelopData', xmlHttp.responseText);
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCADevelopData(cipherData) {
    var xmlHttp = getHttpObj('SZCADevelopData');
    var obj = new Object();
    var cipherDataB64 = base64encode(utf16to8(cipherData));
    obj.cipherData = cipherDataB64;
    var data = getRequestData('SZCADevelopData', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCADevelopData', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCADevelopData', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }

    } else {
        NotifyClient();
    }
    return "";
}

function SZCASetTimeStamp(tsURL, tsUserName, tsPassword) {
    var xmlHttp = getHttpObj('SZCASetTimeStamp');
    var obj = new Object();
    var tsURLB64 = base64encode(utf16to8(tsURL));
    obj.tsURL = tsURLB64;
    var tsUserNameB64 = base64encode(utf16to8(tsUserName));
    obj.tsUserName = tsUserNameB64;
    var tsPasswordB64 = base64encode(utf16to8(tsPassword));
    obj.tsPassword = tsPasswordB64;
    var data = getRequestData('SZCASetTimeStamp', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASetTimeStamp', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCASetTimeStamp', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCASetTimeStampEnable(bEnable) {
    var xmlHttp = getHttpObj('SZCASetTimeStampEnable');
    var obj = new Object();
    obj.bEnable = bEnable;
    var data = getRequestData('SZCASetTimeStampEnable', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASetTimeStampEnable', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCASetTimeStampEnable', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCASetTimeStampFailedReturn(bReturn) {
    var xmlHttp = getHttpObj('SZCASetTimeStampFailedReturn');
    var obj = new Object();
    obj.bReturn = bReturn;
    var data = getRequestData('SZCASetTimeStampFailedReturn', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCASetTimeStampFailedReturn', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCASetTimeStampFailedReturn', xmlHttp.responseText);
            return parseInt(retValue);
        }

    } else {
        NotifyClient();
    }
    return false;
}

function SZCAGetLastErrMsg() {
    var xmlHttp = getHttpObj('SZCAGetLastErrMsg');
    var obj = new Object();
    var data = getRequestData('SZCAGetLastErrMsg', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValueB64 = getResponseData('SZCAGetLastErrMsg', xmlHttp.response);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        } catch (e) {
            var retValueB64 = getResponseData('SZCAGetLastErrMsg', xmlHttp.responseText);
            var retValue = utf8to16(base64decode(retValueB64));
            return retValue;
        }
    } else {
        NotifyClient();
    }
    return "";
}

function SZCAGetLastErrCode() {
    var xmlHttp = getHttpObj('SZCAGetLastErrCode');
    var obj = new Object();
    var data = getRequestData('SZCAGetLastErrCode', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAGetLastErrCode', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCAGetLastErrCode', xmlHttp.responseText);
            return parseInt(retValue);
        }
    } else {
        NotifyClient();
    }
    return false;
}

function SZCAClearPINCache() {
    var xmlHttp = getHttpObj('SZCAClearPINCache');
    var obj = new Object();
    var data = getRequestData('SZCAClearPINCache', obj);
    try {
        xmlHttp.send(data);
    } catch (e) {
        NotifyClient();
        return false;
    }
    if (xmlHttp.status == 200) {
        try {
            var retValue = getResponseData('SZCAClearPINCache', xmlHttp.response);
            return parseInt(retValue);
        } catch (e) {
            var retValue = getResponseData('SZCAClearPINCache', xmlHttp.responseText);
            return parseInt(retValue);
        }
    } else {
        NotifyClient();
    }
    return false;
}

export {
    getXmlHttp,
    sslEnable,
    getHttpObj,
    getRequestData,
    getResponseData,
    NotifyClient,
    SZCASSLEnable,
    SZCAInit,
    SZCAKeyIsExist,
    SZCASign,
    SZCAVerify,
    SZCASignMessage,
    SZCAVerifyMessage,
    SZCAGetCertData,
    SZCAGetCertInfo,
    SZCAParseSignMessage,
    SZCAParseCertData,
    SZCAVerifyUserPin,
    SZCAGetKeyAlgType,
    SZCAGetKey,
    SZCASymmEncryptData,
    SZCASymmDecryptData,
    SZCASymmEncryptFile,
    SZCASymmDecryptFile,
    SZCAEnvelopData,
    SZCADevelopData,
    SZCASetTimeStamp,
    SZCASetTimeStampEnable,
    SZCASetTimeStampFailedReturn,
    SZCAGetLastErrMsg,
    SZCAGetLastErrCode,
    SZCAClearPINCache,
    SZCA_PdfSign_GetSealImage
}