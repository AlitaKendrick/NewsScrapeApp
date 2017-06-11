// pulls the articles in as  json
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {

  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the Comment information to the page
    .done(function(data) {
      $("#comments").append("<h2>" + data.title + "</h2>");
      $("#comments").append("<input id='titleinput' name='title' >");
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");
      $("#comments").append("<button data-id='" + data._id + "' id='deleteComment'>Delete Comment</button>");

    });
});

// When you click the saveComment button
$(document).on("click", "#saveComment", function() {

//use id associated with the article
  var thisId = $(this).attr("data-id");

// use post request to add comment data
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).done(function(data) {
      console.log(data);
      // $("#comments").empty();
      data.title.append("#saveComment");
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});