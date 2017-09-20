var db = require("../models");

// CRUD routes for discussions that affect MySQL database
module.exports = function(app){
	// Read all current discussions in database and display on discussions.html
	app.get("/api/group/discussions", function(req, res){
		db.Group.findAll({
			include: [db.Discussion]
		}).then(function(results){
			res.json(results);
		});
	});

	// Get current user information
	app.get("/api/user", function (req,res){
		var useId = req.user.id;
		db.User.findAll({where: {
			id: useId
		}})
		.then(function(results){
			res.json(results);
		});
	});

  // Get a specific Group's discussions
	app.get("/api/groups/:group/discussions", function(req, res){
		db.Group.findById(req.params.group)
			.then(function(group){
				group.getDiscussions()
					.then(function(discussions){
						res.json(discussions)
					})
			});
	})

  // Get a specific discussion from a group
	app.get("/api/groups/:group/discussions/:discussion", function(req, res){
		db.Group.findById(req.params.group)
			.then(function(group){
				group.getDiscussions({where: {
					id: req.params.discussion
				}})
					.then(function(oneDiscussion){
						res.json(oneDiscussion)
					})
			});
	})

  // Update discussion name
  app.put("/api/groups/:group/discussions/:discussion", function(req, res){
    db.Discussion.update(
    {
    	name: req.body.name
    },
    {
      where: {
        id: req.params.discussion
      }
    }).then(function(results){
      res.json(results)
    });
  });

	// Delete discussion in database whenever a group member deletes it (don't focus on this too much. make others work first.)
	app.delete("/api/groups/:group/discussions/:discussion", function(req, res){
		db.Discussion.destroy({
      where: {
        id: req.params.discussion
      }
		}).then(function(results){
			res.json(results);
		});
	});
}