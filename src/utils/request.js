import Base64 from "@/utils/base64.js";
let service = null;
let get;
let post;
let put;
let del;
let patch;
const yucun_user_ids = [
  '4028b881799d1f8101799d1f81910000',
  '4028b881799d1f8101799d1f81910001',
  '4028b881799d1f8101799d1f81910002',
  '4028b881799d1f8101799d1f81910003',
  '4028b881799d1f8101799d1f81910004',
  '4028b881799d1f8101799d1f81910005',
  '4028b881799d1f8101799d1f81910006',
  '4028b881799d1f8101799d1f81910007',
  '4028b881799d1f8101799d1f81910008',
  '4028b881799d1f8101799d1f81910009',
  '4028b881799d1f8101799d1f81910010',
  '4028b881799d1f8101799d1f81910011',
  '4028b881799d1f8101799d1f81910012',
  '4028b881799d1f8101799d1f81910013',
  '4028b881799d1f8101799d1f81910014',
  '4028b881799d1f8101799d1f81910015',
  '4028b881799d1f8101799d1f81910016',
  '4028b881799d1f8101799d1f81910017',
  '4028b881799d1f8101799d1f81910018',
  '4028b881799d1f8101799d1f81910019',
  '4028b881799d1f8101799d1f81910020',
  '4028b881799d1f8101799d1f81910021',
  '4028b881799d1f8101799d1f81910022',
  '4028b881799d1f8101799d1f81910023',
  '4028b881799d1f8101799d1f81910024'
];

export function initRequest(data) {
  service = data.service;
  /******************************* 为了渔村社康演示添加 *********************************************/
  // service.interceptors.request.use(
  //   (config) => {console.info(config.url);return config;}
  // );
  // service.interceptors.response.use(
  //   (data) => {
  //     let userId = localStorage.getItem("userId");
  //     if(data.data && data.data.hoss && data.data.userId){//login
  //       userId = data.data.userId;
  //     }
  //     if(!userId) return Promise.resolve(data);
  //     userId = Base64.decode(userId);
  //     let exist = yucun_user_ids.includes(userId);
  //     if(exist){
  //       let res = JSON.stringify(data);
  //       // res = res.replace(/长岭/g,"渔村").replace(/6ZW\/5bKt/g,"5riU5p2R")
  //       let newData = JSON.parse(res);
  //       return Promise.resolve(newData);
  //     }else{
  //       return Promise.resolve(data);
  //     }
  //   }
  // );
  /******************************************************************************************** */
  get = data.get;
  post = data.post;
  // put = data.put;
  put = data.post;
  //del = data.del;
  del = data.patch;
  patch = data.patch;
}

export { get, post, put, del, patch, service };
