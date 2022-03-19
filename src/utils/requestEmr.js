import { service } from "@/utils/request";
import { check_IP } from "axcommon/src/utils/util";
import qs from "qs";
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */

const timeout_num = '15000';
const commonUrl = () => {
  let url = check_IP() ? process.env.VUE_APP_EMR_BASE_API_IP : process.env.VUE_APP_EMR_BASE_API;
  return url
};

export function get(url, params, loading) {
  return new Promise((resolve, reject) => {
    service
      .get(commonUrl() + url, {
        params: params,
        loading: loading,
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */
export function post(url, data, loading) {
  return new Promise((resolve, reject) => {
    service
      .post(commonUrl() + url, data, { loading: loading })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */
export function put(url, data, loading) {
  return new Promise((resolve, reject) => {
    service
      .put(commonUrl() + url, data, loading)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */

export function del(url, data, loading) {
  return new Promise((resolve, reject) => {
    service
      .delete(commonUrl() + url, {
        data: data,
        loading: loading
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * patch方法，对应patch请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Boolean} loading [请求时loading]
 */

export function patch(url, data, loading, timeout = timeout_num) {
  return new Promise((resolve, reject) => {
    service
      .patch(commonUrl() + url, data, {
        loading: loading,
        timeout: timeout
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response ? err.response.data : err);
      });
  });
}
