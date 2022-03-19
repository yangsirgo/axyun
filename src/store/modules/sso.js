import { urlConfig } from "axcommon/src/utils";
import { uclogin, ucredirect } from "@/api/sso/sso"
import {
  setToken,
  setPamars,
  setIsTenant,
  setUserId,
  setUserName,
  setRoles,
  setRole
} from "@/utils/auth";
import {
  asyncRoutes
} from "@/router";
import axcommon from "axcommon";

import {
  Message
} from "element-ui";

const state = {
  partoken: "",
  patoken: ""

};

const mutations = {
  SET_PARTOKEN: (state, partoken) => {
    state.partoken = partoken;
  },
  SET_PATOKEN: (state, patoken) => {
    state.patoken = patoken;
  },


};

const actions = {

  getSSOInfo({
    commit, dispatch
  }, data) {
    const {
      verifyCode
    } = data;

    return new Promise((resolve, reject) => {
      uclogin({
        verifyCode: verifyCode
      })
        .then(response => {
          const { data, code, msg } = response;
          if (code === 1) {
            let pamars = {
              hosId: data._current.hosId,
              hosIdNum: data._current.hosId,
              hosName: data._current.hosName,
              // hosCd: data.hosCd,
              // orgId: data.orgId,
              // orgName: data.orgName,
              // orgCd: data.orgCd,
              // workType: data.workType
            };
            let roles = data._current.roles;

            let role = {
              roleId: data._current.roleId,
              deptId: data._current.deptId,
              rtype: data._current.rtype,
              roleName: data._current.roleName,
              deptName: data._current.deptName,
              roleCode: roles.length ? roles[0].roleCode : ''
            };

            dispatch("user/setToken", data._current.token, { root: true });
            dispatch("user/setIsTenant", false, { root: true });
            setToken(data._current.token);
            setIsTenant({ isTenant: false });

            console.log("pamars", pamars);
            setPamars(pamars);
            setRole(role);
            setRoles(roles);
            dispatch("user/setRole", role, { root: true });
            dispatch("user/setRoles", roles, { root: true });
            dispatch("user/setName", data._current.name, { root: true });
            setUserId(data._current.userId);
            setUserName(data._current.name);
            // debugger
            let assginRoutes = urlConfig(data.menuTree, asyncRoutes);
            let accessedRoutes;
            accessedRoutes = assginRoutes || [];
            dispatch("permission/setMainPage", data.mainPage, { root: true });
            // dispatch("permission/setMainPage", "cisThree", { root: true });
            dispatch("permission/setRouters", accessedRoutes, { root: true });
            dispatch(
              "permission/setButtons",
              data.resIdentifier, { root: true }
            );
            axcommon.router().addRoutes(accessedRoutes);
            resolve(response);
          } else {
            Message({
              type: "error",
              message: msg || "参数错误"
            });
            // resolve(code);
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getRredirectInfo({
    commit, dispatch
  }, data) {
    const {
      accesstoken,
      partoken,
      patoken
    } = data;
    return new Promise((resolve, reject) => {
      ucredirect(
        {
          accesstoken: accesstoken,
          partoken: partoken,
          patoken: patoken
        }
      )
        .then(response => {
          const { data, code, msg } = response;
          if (code === 1) {
            let pamars = {
              hosId: data._current.hosId,
              hosName: data._current.hosName,
              // hosCd: data.hosCd,
              // orgId: data.orgId,
              // orgName: data.orgName,
              // orgCd: data.orgCd,
              // workType: data.workType
            };
            let roles = data._current.roles;

            let role = {
              roleId: data._current.roleId,
              deptId: data._current.deptId,
              rtype: data._current.rtype,
              roleName: data._current.roleName,
              deptName: data._current.deptName,
              roleCode: roles.length ? roles[0].roleCode : ''
            };

            dispatch("user/setToken", data._current.token, { root: true });
            dispatch("user/setIsTenant", false, { root: true });
            setToken(data._current.token);
            setIsTenant({ isTenant: false });
            setPamars(pamars);
            setRole(role);
            setRoles(roles);
            dispatch("user/setRole", role, { root: true });
            dispatch("user/setRoles", roles, { root: true });
            dispatch("user/setName", data._current.name, { root: true });
            setUserId(data._current.userId);
            setUserName(data._current.name);
            let assginRoutes = urlConfig(data.menuTree, asyncRoutes);
            let accessedRoutes;
            accessedRoutes = assginRoutes || [];
            dispatch("permission/setRouters", accessedRoutes, { root: true });
            dispatch(
              "permission/setButtons",
              data.resIdentifier, { root: true }
            );
            axcommon.router().addRoutes(accessedRoutes);
            resolve(response);
          } else {
            Message({
              type: "error",
              message: msg || "出现错误"
            });
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  setPartoken({ commit }, partoken) {
    commit("SET_PARTOKEN", partoken)
  },
  setPatoken({ commit }, patoken) {
    commit("SET_PATOKEN", patoken)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
