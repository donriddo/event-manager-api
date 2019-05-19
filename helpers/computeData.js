module.exports = {
	sum: function (first) {
		return function(second){
			return first + second;
		}
	}
};
