
var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $form = $('#input-form');
var $ideaList = $('#idea-list');
// var arrayIdeaIDs = [];
// localStorage.setItem('ideaArray', JSON.stringify(arrayIdeaIDs));

function newUniqueID () {
  return Date.now();
}

function Idea(id, title, body) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function getUserTitle () {
  return $ideaTitleInput.val();
}

function getUserBody () {
  return $ideaBodyInput.val();
}

$form.submit( function(){
  event.preventDefault();
  // Create new Idea object
  var newIdea = new Idea(newUniqueID(), getUserTitle(), getUserBody());
  // Add to page
  $ideaList.prepend(
    "<li value="+newIdea.id+">"+
      "<div class='idea-header'>"+
        "<h2>"+newIdea.title+"</h2>"+
        "<button type='button' class='delete-btn'>"+
        "<img src='./imgs/delete.svg' /></button>"+
      "</div>"+

    "<div class='idea-body'>"+
      "<p>"+newIdea.body+"</p>"+
    "</div>"+

    "<div class='idea-footer'>"+
      "<button type='button' class='upvote-btn'><img src='./imgs/upvote.svg'/></button>"+
      "<button type='button' class='downvote-btn'><img src='./imgs/downvote.svg' /></button>"+
      "<article class='idea-quality'>"+
        newIdea.quality+
      "</article>"+
    "</div>"+
  "</li>"
  );
    ideaToStorage(newIdea);
    return false;
  // new function () Convert to JSON
  // new function () Add to localStorage
});

function ideaStringify(newIdea) {
  return JSON.stringify(newIdea);
}
function ideaToStorage(newIdea) {
  localStorage.setItem(newIdea.id, ideaStringify(newIdea));
  updateIDArray(newIdea.id);
}

function pushNewID(id) {
  arrayIdeaIDs.push(id);
}

function updateIDArray(id) {
  var arrayIdeaIDs = retrieveIDarray();
  arrayIdeaIDs.push(id);
  localStorage.setItem('ideaArray', JSON.stringify(arrayIdeaIDs));
}

function retrieveIdea(id) {
  var storedIdea = localStorage.getItem(id);
  return JSON.parse(storedIdea);
}

function retrieveIDarray() {
  return JSON.parse(localStorage.getItem('ideaArray'));
}
// on page load
$(window).load(function (){
  var arrayIdeaIDs = retrieveIDarray();
  arrayIdeaIDs.sort();
    for (var i = 0; i < arrayIdeaIDs.length; i++) {
      var existingIdea = retrieveIdea(arrayIdeaIDs[i]);
      $ideaList.prepend(
        "<li value="+existingIdea.id+">"+
          "<div class='idea-header'>"+
            "<h2>"+existingIdea.title+"</h2>"+
            "<button type='button' class='delete-btn'>"+
            "<img src='./imgs/delete.svg' /></button>"+
          "</div>"+

          "<div class='idea-body'>"+
            "<p>"+existingIdea.body+"</p>"+
          "</div>"+

          "<div class='idea-footer'>"+
            "<button type='button' class='upvote-btn'><img src='./imgs/upvote.svg'/></button>"+
            "<button type='button' class='downvote-btn'><img src='./imgs/downvote.svg' /></button>"+
            "<article class='idea-quality'>"+
             existingIdea.quality+
             "</article>"+
          "</div>"+
        "</li>"
     );
   }
});

$ideaList.on('click', '.delete-btn', function(){
  $(this).parent().parent().remove();
  var id = $(this).parent().parent().attr("value");
  removeIdeaStorage(id);
  removeIDfromArray(id);
});

function removeIdeaStorage(id) {
  localStorage.removeItem(id);
}

function removeIDfromArray(id) {
  var arrayIdeaIDs = retrieveIDarray();
  var index = arrayIdeaIDs.indexOf(id);
  arrayIdeaIDs.splice(index, 1);
  localStorage.setItem('ideaArray', JSON.stringify(arrayIdeaIDs));
}
