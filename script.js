var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $form = $('#input-form');

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
debugger;
  // Create new Idea object
  var newIdea = new Idea(newUniqueID(), getUserTitle(), getUserBody());
  debugger;

  // Add to page
  // new function () Convert to JSON
  // new function () Add to localStorage
});
