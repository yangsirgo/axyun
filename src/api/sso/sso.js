import {post,get,put,del} from '@/utils/request'

export function uclogin(data){
    return get(`/sso/uclogin/code/${data.verifyCode}`,{},true);
}
export function ucredirect(data){
    return get(`/sso/ucredirect`,data,true);
}
