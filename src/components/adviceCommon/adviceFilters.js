let filters = {
  roundingAmt(value) {
    value = isNaN(value) ? "0" : new Number(value);
    return new Number(value).rewToFixed(2);
  },
  roundingPrice(value) {
    value = isNaN(value) ? "0" : new Number(value);
    return new Number(value).rewToFixed(4);
  }
};
export default filters;
