var arrayIdeaIDs = [];
var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $form = $('#input-form');
var $ideaList = $('#idea-list');

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
  // Create new Idea object
  var newIdea = new Idea(newUniqueID(), getUserTitle(), getUserBody());
  // Add to page
  $ideaList.append(
    "<li>"+
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
    debugger;
    pushNewID(newIdea.id);
    debugger;
    return false;
  // new function () Convert to JSON
  // new function () Add to localStorage
});

function ideaStringify(newIdea) {
  return JSON.stringify(newIdea);
}
function ideaToStorage(newIdea) {
  localStorage.setItem(newIdea.id, ideaStringify(newIdea));
}

function pushNewID(id) {
  arrayIdeaIDs.push(id);
}

function retrieveIdea(id) {
  var storedIdea = localStorage.getItem(id);
  return JSON.parse(storedIdea);
}
