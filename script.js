var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $form = $('#input-form');

function newUniqueID () {
  return Date.now();
}

function Idea(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = quality;
}

function getUserTitle () {
  return $ideaTitleInput.value;
}

function getUserBody () {
  return $inputBodyInput.value;
}

$form.submit( function(){

});
