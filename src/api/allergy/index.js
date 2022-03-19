import {
  post,
  get,
  put,
  del
} from '@/utils/request';

const url = '/common';

export function getTree(data) {
  return post(url+'/allergyPatientInfo/getPatientAllergyInfoTree', data, false);
}
export function submitForm(data) {
  return post(url+'/allergyPatientInfo/add', data, true);
}
export function cancelSubmitForm(data) {
  return post(url+'/allergyPatientInfo/cancellationAllergyPatientInfo', data, true);
}
