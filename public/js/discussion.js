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
      $(".chat-messages").append("<p class=chatMessages style='text-align:right;'>" + snapshot.val().message + "</p><p class=chatMessages style='font-size:.5em;text-align:right;margin-bottom:5px'>"+moment(snapshot.val().time).format("dddd, MMMM Do YYYY, h:mm:ss a")+"</p>");
    }
    else {
      $(".chat-messages").append("<div class=chatMessages><span class='chat-name'>" +snapshot.val().name +": </span><span class=chatMessages>"+ snapshot.val().message + "</span><p class=chatMessages style='font-size:.5em;margin-bottom:12px;'>"+moment(snapshot.val().time).format("dddd, MMMM Do YYYY, h:mm:ss a")+"</p></div>");
    }
    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight); 
  });

  var populateChats = $("<div>");
  populateChats.addClass("col s12 populate-chat");
  populateChats.attr("id", "chat-"+chatName);
  populateChats.append("<div class='chat-messages'></div><div class='modal-footer'><input type='text' class='chat-input' placeholder='Add to the conversation!'>"+
      "<a class='modal-action btn-flat chat-send'>Send</a></div>");
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

/****************** Chat Title - Edit and Update Functions *******************/
$(document).on("click", ".disc-btn", function(){
  $(".chat-title").empty();
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  $.get("/api/groups/"+groupId+"/discussions/"+discussionId, function(oneDiscussion){
      $(".chat-title").append("<div><h5 class='chatNameTitle'>"+oneDiscussion[0].name+"</h5><a class='btn-flat editChat' data-group="+groupId
        +" data-discussion="+discussionId+">Edit</a><a class='btn-flat deleteChat'>Delete</a></div>");
  })
})

$(document).on("click",".editChat", function(){
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  $(".chatNameTitle").replaceWith("<input type='text' class='editChatName' placeholder='Enter New Name'>");
  $(".editChat").replaceWith("<a class='btn-flat updateChatName' data-group="+groupId+" data-discussion="+discussionId+">Update</a>");
});

$(document).on("click", ".updateChatName", function(){
  var newChatName = $(".editChatName").val().trim();
  var groupId = $(this).attr("data-group");
  var discussionId = $(this).attr("data-discussion");
  $(".chat-title").html("<div><h5 class='chatNameTitle'>"+newChatName+"</h5><a class='btn-flat editChat' data-group="+groupId
    +" data-discussion="+discussionId+">Edit</a><a class='btn-flat deleteChat'>Delete</a></div>");
  updateDiscussion(groupId, discussionId, newChatName);
})


/****************** FUNCTIONS *******************/
function getUser(){
  $.get("/api/user", function(user){
    username = user[0].name;
    // console.log("Username is " + username);
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
    })
    .done(function(){
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

// General functions for Materialize and display features
$(document).ready(function() {
  $('ul.tabs').tabs();
  $(".showDiscussions").hide();
});


      // var dropdownMenu = $("<ul>");
      // dropdownMenu.addClass("dropdown-content");
      // dropdownMenu.attr("id", "dropdown1")
      // dropdownMenu.append("<li><a href='#!'>one</a></li><li><a href='#!'>two</a></li>"+
      //   "<li class='divider'></li><li><a href='#!'>three</a></li><li><a href='#!'><i class='material-icons'>view_module</i>four</a></li>"+
      //   "<li><a href='#!'><i class='material-icons'>cloud</i>five</a></li>");

      // $(".addDiscussion").append("<a class='dropdown-button right' data-beloworigin='true' href='#' "+
      // "data-activates='dropdown1'><i class='material-icons'>more_vert</i>EDIT</a>")
      // $("#dropDown").append("<a class='dropdown-button btn' data-beloworigin='true' data-activates='dropdown1'>Drop Me!</a>");
      // $("#dropDown").append("<ul id='dropdown1' class='dropdown-content'><li><a href='#!'>one</a></li><li><a href='#!'>two</a></li><li class='divider'></li>"+"<li><a href'#!'>three</a></li><li><a href='#!'><i class='material-icons'>view_module</i>four</a></li><li><a href='#!'><i class='material-icons'>cloud</i>five</a></li></ul>");
      // $(".addDiscussion").append(dropdownMenu);