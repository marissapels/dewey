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
  // Variables to store information for Firebase
  chatName = $(this).attr("data-key");
  console.log(chatName)
  // Create chat directories with unique names
  var chatData = database.ref("/chat/" + chatName);

  // Clears previous chat messages when appending
  $(".chat-messages").html("");
  chatData.orderByChild("time").off("child_added");

  // Render message to page. Update chat on screen when new message detected - ordered by 'time' value
  chatData.orderByChild("time").on("child_added", function(snapshot) {
    $(".chat-messages").append("<p class=chatMessages><span>"+ snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
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

/****************** Get User's Name for chats *******************/
function getUser(){
  $.get("/api/user", function(user){
    username = user[0].name;
    console.log("Username is " + username);
  });
};

// Function to update discussion name
// Add breadcrumbs for Groups > Discussion (http://materializecss.com/breadcrumbs.html)
function updateDiscussion(){
  var groupId = "";
  var discussionId = "";
}