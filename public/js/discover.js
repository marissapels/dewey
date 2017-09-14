$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.collapsible').collapsible();

  //when a book title is selected, it shows book info on HTML
	$(document).on("click", "#findNewBk", function(){
		
		function googleBook(bookSearch) {
		var apiKey = "AIzaSyBUVyIW2d33WHzArLsdPx3X-X39qV-SZLY";
		var queryURL= "https://www.googleapis.com/books/v1/volumes?q=intitle:"+ bookSearch +"&key=" + apiKey;
		
		$(document).on("click", "#findNewBk", function(){
		event.preventDefault();
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			console.log(response)
			var results = response.items[0].volumeInfo;
			$("#ttl").html(results.title);
			$("#").html("Author: "+results.authors[0]);
			$("#bookOneInfo").html("Summary: "+results.description);
			$("#bookOne").attr("src",results.imageLinks.smallThumbnail);
		});
		});
		}


	$(document).on("click", "#modalButton", function(){
		event.preventDefault();
		
	});

	
	$(document).on("click", "#findBestList", function(){ 
	event.preventDefault();
	
	var url = "https://api.nytimes.com/svc/books/v3/lists.json";
	url += '?' + $.param({
  'api-key': "159c5dc384824c7a96c2bfda77074a6e",
  'list': "hardcover-fiction"
	});
	$.ajax({
  		url: url,
  		method: 'GET',
	}).done(function(result) {
	  console.log(result);
	  document.getElementById("").innerHTML=result.response.docs[?].?.? 
	}).fail(function(err) {
  		throw err;
	});
	
	});
	$(document).on("click", "#findReviewed", function(){ 
	event.preventDefault();
	
	});

});



// 	function bookSearch(){
//     var search = document.getElementById("search").val.trim
//     document.getElementById("findNewBk").innerHTML = ""
//     console.log (search)

//     $ajax({
//       url: "https://www.googleapis.com/books/v1/volumes?q=" + search,
//       dataType: "json",

//       success: function(data) {
// 		  for(i = 0; i < data.item.length; i++){
// 			  results.innerHTML += "<h2>" + data.items[i].volumeInfo.title + "</h2>"
// 				console.log(results.innerHTML += "<h2>" + data.items[i].volumeInfo.title + "</h2>")
// 		  }
//         console.log(data)
//       },
//       type: "GET"
//     });
//   }

// document.getElementById("findNewBk").addEventListener("click", bookSearch, false)





// $(document).ready(function() {
//   //when a book title is selected, it shows book info on HTML
// 	// $(document).on("click", "#findNewBk", function(){
// 	// 	$("#chooseTitle, #chooseComments, #chooseAuthor, #chooseRate, #chooseSummary").html("");
// 	// 	$("#chooseImage").attr("src","");
// 	// 	var clickedTitle = $(this).attr("value");
// 	// 	// var clickedAuthor = $(this).attr("data-author");
// 	// 	console.log(clickedTitle);
// 	// 	googleBook(clickedTitle);
// 	// 	$.get("/api/library", function(data){
// 	// 		for (var i = 0; i<data.length; i++){
// 	// 			if (clickedTitle===data[i].title){
// 	// 				$("#chooseTitle").html("Title: "+data[i].title);
// 	// 				$("#chooseComments").html("My Comments: "+data[i].comments);
// 	// 			}
// 	// 		}
// 	// 	});
// 	// });

// 	function googleBook(bookSearch) {
// 		var apiKey = "AIzaSyBUVyIW2d33WHzArLsdPx3X-X39qV-SZLY";
// 		var queryURL= "https://www.googleapis.com/books/v1/volumes?q=intitle:"+ bookSearch +"&key=" + apiKey;
		
// 		$(document).on("click", "#findNewBk", function(){
// 		$.ajax({
// 			url: queryURL,
// 			method: "GET"
// 		}).done(function(response){
// 			console.log(response)
// 			var results = response.items[0].volumeInfo;
// 			$("#chooseAuthor").html("Author: "+results.authors[0]);
// 			$("#chooseRate").html("Average Rating: "+results.averageRating+"/5.0");
// 			$("#chooseSummary").html("Summary: "+results.description);
// 			$("#chooseImage").attr("src",results.imageLinks.smallThumbnail);
// 		});
// 	};
// });



// //get a list of books

// //get a list of books based on author given by user

// //get a list of recently reviewed books

// //get the current best seller list
