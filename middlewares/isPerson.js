module.exports = function(req, res, next){
	if (req.params.id == '1') {
		return next();
	}
	else {
		return res.send('Person Not Found');
	}
}
