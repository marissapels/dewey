$(document).ready(function () {

    $('.modal').modal();
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    $(".showDiscussions").hide();
    var usersGroups;

    getGroups();

    // Get the user's groups and discussions when the page loads
    function getGroups() {
        var queryUrl = "/api/groups/discussions"

        $.get(queryUrl, function (data) {
            usersGroups = data;
            displayGroups(data);
        })
    };

    // Display the user's groups
    function displayGroups(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].name);

            var newItem = $("<li>");

            var itemHeader = $("<div>");
            itemHeader.addClass("collapsible-header");
            itemHeader.html(data[i].name);
            itemHeader.append("<a class='waves-effect waves-light btn-flat groupDiscBtn' group-id="+data[i].id+">See Discussions</a>");
            itemHeader.append("<a href='#member-modal' class='waves-effect waves-light btn-flat view-members' group-id="+data[i].id+">Members</a>")

            newItem.append(itemHeader);
            $("#groupList").append(newItem);

            $('.collapsible').collapsible();
            $('.modal').modal();
        }
    }

    $('#create-group').on("click", function () {
        $('.userInp3').val("");
        $('#new-group-modal').modal('open');
    });

    $('#add-created-group').on("click", function () {
        var nameInput = $('.userInp3').val().trim();

        $.post("/api/groups", { name: nameInput }, function (data) {
            console.log(data);
            var dataArray = [];
            dataArray.push(data);
            displayGroups(dataArray);
            $('.collapsible').collapsible();
        })
    });

    // On-click event to show Disussions Panel and populate tabs --> Initial load.
    $(document).on("click", ".groupDiscBtn", function(){
        $(".addTabs").empty();
        $(".populate-chat").remove();
        var groupId = $(this).attr("group-id");
        $(".showDiscussions").show();

        $.get("/api/groups/"+groupId+"/discussions", function(discussions){
            for (var i=0; i<discussions.length; i++){
                var updateTabs = $("<li>");
                updateTabs.addClass("tab");
                updateTabs.append("<a class='disc-btn' href=#chat-"+discussions[i].id+" data-key=chat"+discussions[i].id+">"+discussions[i].name+"</a>");
                $(".addTabs").append(updateTabs);
            }
        })

        var noDiscussionTab = $("<li>");
        noDiscussionTab.addClass("tab no-discussion");
        noDiscussionTab.attr("group-id", groupId);
        noDiscussionTab.append("<a href=#newDiscussion><i class='tiny material-icons'>add</i></a>");
        $(".addTabs").append(noDiscussionTab);

        var createNewChat = $("<div>");
        createNewChat.attr("id", "newDiscussion");
        createNewChat.addClass("col s12 populate-chat");
        createNewChat.append("<p> Create a New Discussion Here </p><form><div class='input-field'>"+
            "<i class='material-icons prefix'>chat</i><input id='icon_prefix' type='text' class='validate userInp4' placeholder='Discussion Name'>"+
            "<a href='#!' class='waves-effect waves-light btn' id='add-created-discussion'>Create</a></div></form>");
        $(".addChats").append(createNewChat);

        addNewDiscussion(groupId);
    });

    // On-click event for new discussion creation in tabs section --> not initial load
    $(document).on("click", ".no-discussion", function(){
        $(".populate-chat").remove();
        var groupId = $(this).attr("group-id");

        var createNewChat = $("<div>");
        createNewChat.attr("id", "newDiscussion");
        createNewChat.addClass("col s12 populate-chat");
        createNewChat.append("<p> Create a New Discussion Here </p><form><div class='input-field'>"+
            "<i class='material-icons prefix'>chat</i><input id='icon_prefix' type='text' class='validate userInp4' placeholder='Discussion Name'>"+
            "<a href='#!' class='waves-effect waves-light btn' id='add-created-discussion'>Create</a></div></form>");
        $(".addChats").append(createNewChat);

        addNewDiscussion(groupId);
    });

    // On-click event that creates a new discussion
    function addNewDiscussion(groupId){
        $('#add-created-discussion').off("click");
        $('#add-created-discussion').on("click", function () {
            if ($(".userInp4").val() !== ""){
                var nameInput = $('.userInp4').val().trim();
                var queryUrl = "api/groups/" + groupId + "/discussions";
                console.log(queryUrl);

                $.post(queryUrl, { name: nameInput }, function (data) {
                    $(".addTabs").append("<li class='tab'><a class='disc-btn' href=#chat-"+data.id+" data-key=chat"+data.id+">"+data.name+"</a></li>");
                    $('.userInp4').val("");
                }); 
            }
        });    
    }

    var allGroupData;
    var allGroups = {};

    $('#join-groups').on("click", function () {
        $('.userInp2').val("");
        $('#groups-modal').modal('open');

        $.get("/api/groups", function (data) {
            allGroupData = data;

            for (var i = 0; i < data.length; i++) {
                allGroups[data[i].name] = "";
            }

            for (var i = 0; i < usersGroups.length; i++) {
                var newChip = $("<div>");
                newChip.addClass("chip");
                newChip.text(usersGroups[i].name);
                $('#groups').append(newChip);
            }

            $('.chips-autocomplete').material_chip({
                autocompleteOptions: {
                    data: allGroups,
                    limit: 20,
                    minLength: 1
                }
            });
        })
    });

    $('#add-groups').on("click", function () {
        var newGroupArray = [];
        var groupsToAdd = [];
        $('.chips-autocomplete .chip').each(function (index, obj) {
            var trimmedVal = $(this).text().replace(/close/g, '');
            groupsToAdd.push(trimmedVal);
            $(this).remove();
        })

        $('.chips-autocomplete').material_chip({
            autocompleteOptions: {
                data: allGroups,
                limit: 20,
                minLength: 1
            }
        });

        var groupIds = [];

        groupsToAdd.forEach(function (groupName) {
            var index = allGroupData.findIndex(x => x.name == groupName);
            var groupID = allGroupData[index].id;
            groupIds.push(groupID);
        });

        $.post("/api/users/groups", { Ids: groupIds }, function (data) {
            for (var i = 0; i < groupsToAdd.length; i++) {
                var newChip = $("<div>");
                newChip.addClass("chip");
                newChip.text(groupsToAdd[i]);
                $('#groups').append(newChip);

            }
        })
    });

    $('#groups-modal-close').on("click", function () {
        location.reload();
    })

    var allUserData;
    // Object for holding all user info to be displayed in "add a member" modal autocomplete
    var allUsers = {};

    $(document).on("click", ".view-members", function () {
        $('.userInp').val("");
        $('#members').empty();
        $('#member-modal').modal('open');

        var id = $(this).attr("group-id");
        getMembers(id);
    });

    function getMembers(id) {
        var queryUrl = "/api/groups/" + id + "/members";

        $.get(queryUrl, function (data) {
            for (var i = 0; i < data.length; i++) {

                $('#members').attr("group-id", id);

                var newChip = $("<div>");
                newChip.addClass("chip");
                newChip.attr("user-id", data[i].id);
                newChip.text(data[i].name);

                var userImage = $("<img>");
                userImage.attr("src", data[i].photoRef);
                userImage.attr("alt", "User Image")
                newChip.prepend(userImage);

                $('#members').append(newChip);
            }
        });

        $.get("api/users", function (data) {
            allUserData = data;

            for (var i = 0; i < data.length; i++) {
                allUsers[data[i].name] = data[i].photoRef;
            }
            console.log(allUsers);
            $('input.autocomplete').autocomplete({
                data: allUsers,
                limit: 20,
                onAutocomplete: function (val) {
                },
                minLength: 1,
            });
        })
    }

    $("#add-user").on("click", function () {

        var userName = $('.userInp').val().trim();
        var index = allUserData.findIndex(x => x.name == userName);
        var newUserID = allUserData[index].id;
        var newUserPhoto = allUserData[index].photoRef;

        var groupID = $('#members').attr("group-id");
        var queryUrl = "/api/groups/" + groupID + "/members";

        var addedUser = {
            id: newUserID
        }

        $.post(queryUrl, addedUser, function (data) {
            $('.userInp').val("");

            var newChip = $("<div>");
            newChip.addClass("chip");
            newChip.attr("user-id", data.UserId);
            newChip.text(userName);

            var userImage = $("<img>");
            userImage.attr("src", newUserPhoto);
            userImage.attr("alt", "User Image")
            newChip.prepend(userImage);

            $('#members').append(newChip);

        })
    });

});


