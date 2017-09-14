var db = require("../models");

module.exports = function(app){
	app.get("/api/library/", function (req,res){
		var useId = req.user.id;
		db.Library.findAll({where: {
			UserId: useId
		}})
		.then(function(results){
			res.json(results);
		});
	});

	app.post("/api/library", function(req,res){
		var useId = req.user.id;
		db.Library.create({
			title: req.body.title,
			author: req.body.author,
			comments: req.body.comments,
			UserId: useId
		}).then(function(results){
			results.userInfo = req.user;
			res.json(results);
		});
	});

	app.delete("/api/library/:id", function(req,res){
		db.Library.destroy({
			where: {
				id: req.params.id
			}
		}).then(function(results){
			res.json(results);
		});
	});
};