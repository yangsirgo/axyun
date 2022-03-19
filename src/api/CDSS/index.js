import { post, get, put, del } from "@/utils/request";

export function listDrugHistroy(patientId) {
  return get(`/outpatient/outpatientOrder/listDrugHistroy/${patientId}`);
}
