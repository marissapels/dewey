// Initialize Firebase
var config = {
  apiKey: "AIzaSyBUVyIW2d33WHzArLsdPx3X-X39qV-SZLY",
  authDomain: "bookclub-ed08b.firebaseapp.com",
  databaseURL: "https://bookclub-ed08b.firebaseio.com",
  projectId: "bookclub-ed08b",
  storageBucket: "bookclub-ed08b.appspot.com",
  messagingSenderId: "874403788158"
};
firebase.initializeApp(config);
var database = firebase.database();

// Global variables
var chatName, username;

/****************** Firebase Chat Functions *******************/
// On-click event to open and post to specific discussions in Firebase
$(document).on("click", ".disc-btn", function(){
  $(".addChats").empty();
  getUser();
  // Create chat directories with unique names in Firebase
  chatName = $(this).attr("data-key");
  var chatData = database.ref("/chat/" + chatName);

  // Clears previous chat messages when appending
  // Render message to page. Update chat on screen when new message detected - ordered by 'time' value
  $(".chat-messages").html("");
  chatData.orderByChild("time").off("child_added");
  chatData.orderByChild("time").on("child_added", function(snapshot) {
    // $(".chat-messages").append("<p class=chatMessages><span>"+ snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
    if (snapshot.val().name === username) {
      $(".chat-messages").append("<p class=chatMessages style='text-align:right;'>" + snapshot.val().message + 
        "</p><p class=chatMessages style='font-size:.5em;text-align:right;margin-bottom:5px'>"+
        moment(snapshot.val().time).format("dddd, MMMM Do YYYY, h:mm a")+"</p>");
    }
    else {
      $(".chat-messages").append("<div class=chatMessages><span class='chat-name'>" +snapshot.val().name +
        ": </span><span class=chatMessages>"+ snapshot.val().message + "</span><p class=chatMessages style='font-size:.5em;margin-bottom:12px;'>"+
        moment(snapshot.val().time).format("dddd, MMMM Do YYYY, h:mm a")+"</p></div>");
    }
    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight); 
  });

  var populateChats = $("<div>");
  populateChats.addClass("col s12 populate-chat");
  populateChats.attr("id", "chat-"+chatName);
  populateChats.append("<div class='chat-messages'></div><div class='modal-footer'><input type='text' class='chat-input' "+
    "placeholder='Add to the conversation!'><a class='modal-action btn-flat chat-send'>Send</a></div>");
  $(".addChats").append(populateChats);

  // Unbind chat when clicked off of modal. Prevent multiple messages.
  // Chat send button listener, grabs input and pushes to firebase.
  $(".chat-send").off('click');
  $(".chat-send").click(function() {
    if ($(".chat-input").val() !== "") {
      var message = $(".chat-input").val();
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP
      });
      $(".chat-input").val("");
    }
  });
    
  // Unbind chat when clicked off of modal. Prevent multiple messages.
  // Chat send keypress listener, grabs input and pushes to firebase.
  $(".chat-input").off('keypress');
  $(".chat-input").keypress(function(e) {
    if (e.keyCode === 13 && $(".chat-input").val() !== "") {
      var message = $(".chat-input").val();
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP
      });
      $(".chat-input").val("");
    }
  });
})

// On-click event to show Disussions Panel and populate tabs --> Initial load.
$(document).on("click", ".groupDiscBtn", function(){
  $(".addTabs").empty();
  $(".populate-chat").remove();
  $(".chat-title").empty();
  var groupId = $(this).attr("group-id");
  $(".showDiscussions").show();

  $.get("/api/groups/"+groupId+"/discussions", function(discussions){
    for (var i=0; i<discussions.length; i++){
      var updateTabs = $("<li>");
      updateTabs.addClass("tab");
      updateTabs.append("<a class='disc-btn' href=#chat-"+discussions[i].id+" data-key=chat"+discussions[i].id
          +" data-group="+groupId+" data-discussion="+discussions[i].id+">"+discussions[i].name+"</a>");
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
  $(".chat-title").empty();
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

/****************** Chat click events - Edit Update Delete *******************/
$(document).on("click", ".disc-btn", function(){
  $(".chat-title").empty();
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  var dataKey = $(this).attr("data-key");
  $.get("/api/groups/"+groupId+"/discussions/"+discussionId, function(oneDiscussion){
      $(".chat-title").append("<li><div class='collapsible-header chatNameTitle'>"+oneDiscussion[0].name+
        "<span><a><i class='material-icons right'>more_vert</i></a></span></div><div class=collapsible-body><a class='btn-flat editChat' data-group="+
        groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Edit</a><a class='btn-flat deleteChat' data-group="+
        groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Delete</a></div></li>");
  });
});

$(document).on("click",".editChat", function(){
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  var dataKey = $(this).attr("data-key");
  $(".chatNameTitle").replaceWith("<input type='text' class='editChatName' placeholder='Enter New Name'>");
  $(".editChat").replaceWith("<a class='btn-flat updateChatName' data-group="+groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Update</a>");
  $(".deleteChat").replaceWith("<a class='btn-flat chatCancel' data-group="+groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Cancel</a>")
});

$(document).on("click", ".updateChatName", function(){
  if ($(".editChatName").val() !== ""){
    var newChatName = $(".editChatName").val().trim();
    var groupId = $(this).attr("data-group");
    var discussionId = $(this).attr("data-discussion");
    var dataKey = $(this).attr("data-key");
    $(".chat-title").html("<li><div class='collapsible-header chatNameTitle'>"+newChatName+
      "</div><div class=collapsible-body><a class='btn-flat editChat' data-group="+groupId+
      " data-discussion="+discussionId+" data-key="+dataKey+">Edit</a><a class='btn-flat deleteChat' data-group="+groupId+
      " data-discussion="+discussionId+" data-key="+dataKey+">Delete</a></div></li>");
    updateDiscussion(groupId, discussionId, newChatName);
  };
});

$(document).on("click", ".chatCancel", function(){
  $(".chat-title").empty();
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  var dataKey = $(this).attr("data-key");
  $.get("/api/groups/"+groupId+"/discussions/"+discussionId, function(oneDiscussion){
      $(".chat-title").append("<li><div class='collapsible-header chatNameTitle'>"+oneDiscussion[0].name+
        "<span><a><i class='material-icons right'>more_vert</i></a></span></div><div class=collapsible-body><a class='btn-flat editChat' data-group="+
        groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Edit</a><a class='btn-flat deleteChat' data-group="+
        groupId+" data-discussion="+discussionId+" data-key="+dataKey+">Delete</a></div></li>");
  });
});

$(document).on("click", ".deleteChat", function(){
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  var dataKey = $(this).attr("data-key");

  swal({
    title: 'Are you sure?',
    text: "You won't be able to get this chat back!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function () {
    deleteDiscussion(groupId, discussionId);
    database.ref("/chat").child(dataKey).remove();

    swal(
      'Deleted!',
      'Your chat has been deleted.',
      'success'
    )
  })
});

/****************** FUNCTIONS *******************/
function getUser(){
  $.get("/api/user", function(user){
    username = user[0].name;
  });
};

// Function to create a new discussion in database
function addNewDiscussion(groupId){
  $('#add-created-discussion').off("click");
  $('#add-created-discussion').on("click", function () {
    if ($(".userInp4").val() !== ""){
      var nameInput = $('.userInp4').val().trim();
      var queryUrl = "api/groups/" + groupId + "/discussions";
      console.log(queryUrl);

      $.post(queryUrl, { name: nameInput }, function (data) {
        $(".addTabs").append("<li class='tab'><a class='disc-btn' href=#chat-"+data.id+" data-key=chat"+data.id
            +" data-group="+groupId+" data-discussion="+data.id+">"+data.name+"</a></li>");
        $('.userInp4').val("");
      }); 
    }
  });    
}

// Function to update discussion name
function updateDiscussion(groupId, discussionId, newChatName){
  var chatInfo = {
    name: newChatName,
  };
  $.ajax({
      method: "PUT",
      url: "/api/groups/"+groupId+"/discussions/"+discussionId,
      data: chatInfo
    }).done(function(){
      $(".addTabs").empty();
      $.get("/api/groups/"+groupId+"/discussions", function(discussions){
        for (var i=0; i<discussions.length; i++){
          var updateTabs = $("<li>");
          updateTabs.addClass("tab");
          updateTabs.append("<a class='disc-btn' href=#chat-"+discussions[i].id+" data-key=chat"+discussions[i].id
              +" data-group="+groupId+" data-discussion="+discussions[i].id+">"+discussions[i].name+"</a>");
          $(".addTabs").append(updateTabs);
        }
      });
      var noDiscussionTab = $("<li>");
      noDiscussionTab.addClass("tab no-discussion");
      noDiscussionTab.attr("group-id", groupId);
      noDiscussionTab.append("<a href=#newDiscussion><i class='tiny material-icons'>add</i></a>");
      $(".addTabs").append(noDiscussionTab);
    });
};

// Function to delete discussion
function deleteDiscussion(groupId, discussionId){
  $.ajax({
    method: "DELETE",
    url: "/api/groups/"+groupId+"/discussions/"+discussionId
  }).done(function(){
    $(".addTabs").empty();
    $(".chat-title").empty();
    $(".populate-chat").remove();
    $.get("/api/groups/"+groupId+"/discussions", function(discussions){
      for (var i=0; i<discussions.length; i++){
        var updateTabs = $("<li>");
        updateTabs.addClass("tab");
        updateTabs.append("<a class='disc-btn' href=#chat-"+discussions[i].id+" data-key=chat"+discussions[i].id
            +" data-group="+groupId+" data-discussion="+discussions[i].id+">"+discussions[i].name+"</a>");
        $(".addTabs").append(updateTabs);
      }
    });
    var noDiscussionTab = $("<li>");
    noDiscussionTab.addClass("tab no-discussion");
    noDiscussionTab.attr("group-id", groupId);
    noDiscussionTab.append("<a href=#newDiscussion><i class='tiny material-icons'>add</i></a>");
    $(".addTabs").append(noDiscussionTab);
  });
}

// General functions for Materialize and display features
$(document).ready(function() {
  $('ul.tabs').tabs();
  $(".showDiscussions").hide();
  $('.collapsible').collapsible();
});