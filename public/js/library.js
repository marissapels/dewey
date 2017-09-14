//allows modal to open up
$('.modal').modal();
showBooks();

//edit profile
$(document).on("click","#editProfile", function(){
	$("#personalName").replaceWith("<input type='text' id='editPersonalName' placeholder='Name'>");
	$("#personalFavorite").replaceWith("<input type='text' id='editPersonalFavorite' placeholder='Favorite Book'>");
	$("#personalCurrent").replaceWith("<input type='text' id='editPersonalCurrent' placeholder='Currently Reading'>");
	$("#editProfile").replaceWith("<a id='updateProfile'> Update </a>");
});

$(document).on("click", "#updateProfile",function(){
	var newName=$("#editPersonalName").val().trim();
	$("#editPersonalName").replaceWith("<h2 id='personalName'>"+newName+"</h2>");
	var newFavorite=$("#editPersonalFavorite").val().trim();
	$("#editPersonalFavorite").replaceWith("<p id='personalFavorite'> Favorite Book: "+newFavorite+"</p>");
	var newCurrent=$("#editPersonalCurrent").val().trim();
	$("#editPersonalCurrent").replaceWith("<p id='personalCurrent'> Currently Reading: "+newCurrent+"</p>");
	$("#updateProfile").replaceWith("<a id='editProfile'> Edit </a>");
	var userInfo = {
		name: newName,
		currentlyReading: newCurrent,
		favoriteBook: newFavorite
	};
	$.ajax({
      method: "PUT",
      url: "/api/users",
      data: userInfo
    })
    .done(function(){
    });
})




//When modal button is clicked, it clears out search contents from previous search
$(document).on("click", "#modalButton", function(){
	event.preventDefault();
	$("#title, #author, #comments").val("");
});
//When book submit button is clicked, it retrieves data from search fields and posts info to Library API
$(document).on("click", "#bookSubmit", function(){
	event.preventDefault();
	$("#tableLibrary").empty();
	var newBook = {
		title: $("#title").val().trim(),
		author: $("#author").val().trim(),
		comments: $("#comments").val().trim()
	};
	console.log(newBook);
	addBook(newBook);
	showBooks();
});

$(document).on("click",".book",function(){
	var clickedTitle = $(this).attr("value");
	console.log("clickedTitle: "+clickedTitle);
	googleBookInfo(clickedTitle);
	$.get("api/library", function(data){
		for (var i = 0; i<data.length; i++){
			if (clickedTitle===data[i].title){
				console.log("dataTitle: "+data[i].title)
				$("#chooseComments").html("My Comments: "+data[i].comments);
				$("#chooseTitle").attr("data-id", data[i].id);
			}
		}
	});
});

$(document).on("click","#closeInfo",function(){
	event.preventDefault();
});

$(document).on("click","#deleteBook",function(){
	var bookId=$("$chooseTitle").attr("data-id");
	deleteBook(bookId);
});

//function to add book to Library API
function addBook(data){
	$.post("/api/library", data)
		.done(function(){				
	});
};	

//Retrieves title from Library API and displays on HTML
function showBooks(){
	$.get("/api/library/", function(data){
		for (var i = 0; i < data.length; i++) {
			googleBookImage(data[i].title)
		}
	})
}

function deleteBook(deleteId){
	// var deleteId=$(this).attr("data-id");
	$.ajax({
      method: "DELETE",
      url: "/api/library/"+deleteId
    })
    .done(function() {
    });
}

// **************Google Books API*************************


// Displays book image after it is added
function googleBookImage(titleSearch) {
	var apiKey = "AIzaSyBUVyIW2d33WHzArLsdPx3X-X39qV-SZLY";
	var queryURL= "https://www.googleapis.com/books/v1/volumes?q=intitle:"+ titleSearch +"&key=" + apiKey;

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		console.log(response)
		var results = response.items[0].volumeInfo;
		var newBook=$("<a class='book modal-trigger' href='#modalBookInfo'>");
		var image=$("<img>").attr("src",results.imageLinks.smallThumbnail);
		var title= $("<div>"+results.title+"</div>");
		newBook.attr("value", results.title);
		newBook.append(image);
		newBook.append(title);
		$("#tableLibrary").append(newBook);
	});
};
//when a book title is selected, it shows book info on Modal
function googleBookInfo(titleSearch) {
	var apiKey = "AIzaSyBUVyIW2d33WHzArLsdPx3X-X39qV-SZLY";
	var queryURL= "https://www.googleapis.com/books/v1/volumes?q=intitle:"+ titleSearch +"&key=" + apiKey;

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		console.log(response)
		var results = response.items[0].volumeInfo;
		$("#chooseTitle").html("Title: "+results.title);
		$("#chooseAuthor").html("Author: "+results.authors[0]);
		$("#chooseRating").html("Average Rating: "+results.averageRating+"/5.0");
		$("#chooseSummary").html("Summary: "+results.description);
	});
};
