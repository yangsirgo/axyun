<template>
  <div></div>
</template>
<script>
import {
  setPatoken,
  setPartoken,
  removePatoken,
  removePartoken,
  getPamars,
  setPamars,
} from "@/utils/auth";

import qs from "qs";
import { param } from "jquery";
export default {
  data() {
    return {};
  },
  methods: {
    handRedirect(data, url) {
      this.$store
        .dispatch("sso/getRredirectInfo", data)
        .then((res) => {
          if (res.code == 1) {
            this.$router.push({ path: url });
            
            if (this.$route.matched.length == 0) {
              this.$message({
                type: "error",
                message: "您没有权限查看此模块！！"
              });
            }
            //TODO 以后删掉
            let pamars = JSON.parse(getPamars());
            console.log("redirect index组件", pamars);
            pamars.hosIdNum = pamars.hosId;
            pamars.orgId = "T0000000000000000000000000000066";
            setPamars(pamars);
          }
          // else {
          //   this.$message({
          //     type: "error",
          //     message: res.msg || "参数错误",
          //   });
          // }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    },

    redirectMount() {
      this.$store.dispatch("user/resetToken");
      removePatoken();
      removePartoken();
      this.$store.dispatch("sso/setPartoken", "");
      this.$store.dispatch("sso/setPatoken", "");
      if (
        !this.$route.query.accesstoken ||
        !this.$route.query.url ||
        !this.$route.query.patoken ||
        !this.$route.query.partoken
      ) {
        this.$message({
          type: "error",
          message: "参数错误",
        });
      } else {
        let parameter = JSON.parse(JSON.stringify(this.$route.query));
        delete parameter.accesstoken;
        delete parameter.patoken;
        delete parameter.partoken;
        delete parameter.url;
        let urlparam = qs.stringify(parameter);
        let ul = {
          cis: "/cisOne/cisThree",
        };
        let url = this.$route.query.url;
        if (!ul[url]) {
          this.$message({
            type: "error",
            message: "参数错误",
          });
        } else {
          let data = {
            accesstoken: this.$route.query.accesstoken,
            //accesstoken: "%2BcNGS4gWVKYdgecBLy7Bs5iYKaG8Fv0mqDuGCMaX1bwVC8Oz1DJp0ip4R7ItL/Z%2B08Up8US2fhxOhixjsyH5p0I/x4KY2LxX9HRdxbIHdvbjHAdKcvKwhYHbNCpMhKFzcRJ%2Bc8O4yQCVTsXn/CZL9ZiP685juwdpO8wnZlFyIuu9AbhqP0JycVGLLhLmtPI//d5CvTW4zFU3F0kGD6Q5IPv07RywPeM3uRPRymtulV0bhyLvN340waPfZCIuFcpX3x2TedQ0mBqHblSfpeRXISZUDyXkQW8iZpjFS8HzK9CtcIyo%2BOpiaKjjeHq5gb6gtFw6AEULYQs6WLUrUdCMsZe2NWrlSo9pNRjjzJ91ZezEws87vEPkbFzxxTfBv/uRgomnkxBUJNslktj%2BPzukRS5Fq8OgzoK1o8MDDsr07b6FUi8W6qC95ps8zkydb3Z7ZxRxTvpjLaT9odClcaaRPA==",
            patoken: this.$route.query.patoken,
            partoken: this.$route.query.partoken,
          };
          localStorage.setItem("accesstoken",this.$route.query.accesstoken || "")
          this.$store.dispatch("sso/setPartoken", this.$route.query.partoken);
          this.$store.dispatch("sso/setPatoken", this.$route.query.patoken);
          setPatoken(this.$route.query.patoken);
          setPartoken(this.$route.query.partoken);
          let urlData = ul[url] + "?" + urlparam;
          this.handRedirect(data, urlData);
        }
      }
    },
  },

  mounted() {
    this.redirectMount();
  },

  watch: {
    $route: {
      handler(val) {
        console.log("val", val);
        this.redirectMount();
      },
    },
  },
};
</script>