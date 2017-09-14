var db = require("../models");

module.exports = function (app) {

    // When the page loads, get all the groups and discussions associated with the user
    app.get("/api/groups/discussions", function (req, res) {

        db.User.findById(req.user.id)
            .then(function (user) {
                if (typeof user.getGroups === 'function') {
                    user.getGroups({
                        include: [db.Discussion]
                    })
                        .then(function (groups) {
                            res.json(groups);
                        });
                }
            });
    });

    // Add a new group and associate the user to that group
    app.post("/api/groups", function (req, res) {
        var ID = req.user.id;
        db.Group.create({
            name: req.body.name
        })
            .then(function (group) {
                var groupID = group.id;
                db.User.findById(ID).then(function (user) {
                    user.addGroup(groupID)
                })
                res.json(group)
            })
    });

    // Create new discussion in database and associate it with a group
    app.post("/api/groups/:group/discussions", function (req, res) {
        db.Discussion.create({
            name: req.body.name,
            GroupId: req.params.group
        }).then(function (results) {
            res.json(results)
        });
    });


    // Get all Groups so they can be populated in the "Join a Group" autocomplete
    app.get("/api/groups", function (req, res) {
        db.Group.findAll({})
            .then(function (groups) {
                res.json(groups);
            })
    });

    // Add user to an already exsiting group/groups
    app.post("/api/users/groups", function (req, res) {
        db.User.findById(req.user.id)
            .then(function (user) {
                user.addGroup(req.body.Ids)
                    .then(function (result) {
                        res.json(result);
                    })
            })
    });

    // Get all members of a group to display in "Members" modal
    app.get("/api/groups/:id/members", function (req, res) {
        db.Group.findById(req.params.id)
            .then(function (group) {
                group.getUsers()
                    .then(function (members) {
                        res.json(members);
                    })
            })
    });

    // Add a user to a user's group
    app.post("/api/groups/:id/members", function (req, res) {
        db.Group.findById(req.params.id)
            .then(function (group) {
                group.addUser(req.body.id)
                    .then(function (result) {
                        res.json(result);
                    })
            })
    });


}


