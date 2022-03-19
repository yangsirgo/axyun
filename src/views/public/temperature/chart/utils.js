(function (window) {

	window.utils = {
		getFormatDate: function (timestamp) {
			var t = new Date(timestamp);
			var year = t.getFullYear();
			var month = t.getMonth() + 1;
			var date = t.getDate();
			return year + "-" + month + "-" + date;
		},
		isNumber: function (obj) {
			return obj === +obj
		},
		isString: function (obj) {
			return obj === obj + ''
		},
		isBoolean: function (obj) {
			return obj === !!obj
		}
	}


})(window);