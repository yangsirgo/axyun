import {get, post, put, del} from '@/utils/request'


export function patientList(data){
  return get(urlC+'/patient/list', data);
}

export function statistics(data){
  return get('/patient/statistics', data);

}
