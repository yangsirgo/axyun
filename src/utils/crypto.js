import C from 'crypto-js'
import {getUserId,getUserName} from './auth'

export function getUId(){
    if(getUserId()){
        let base64 = C.enc.Base64.parse(getUserId())
        return C.enc.Utf8.stringify(base64)
    }else{
        return null
    }

}

export function getUN() {
    if(getUserName()){
        let base64 = C.enc.Base64.parse(getUserName())
        return C.enc.Utf8.stringify(base64)
    }else {
        return null
    }

}

