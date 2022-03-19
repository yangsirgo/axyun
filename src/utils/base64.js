const Base64 = {
  encode: str => {
    return window.btoa(unescape(encodeURIComponent(str)));
  },
  decode: str => {
    return decodeURIComponent(escape(window.atob(str)));
  }
};

export default Base64;
