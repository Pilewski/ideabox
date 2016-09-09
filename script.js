
var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $ideaTagInput = $('#idea-tag-input');
var $form = $('#input-form');
var $ideaList = $('#idea-list');
var $search = $('#search-input');
var $submit = $('#submit-button');
var $ideaSection = $('#idea-section');

var IdeaBox = {
  ideas: [],

  add: function(){
    var newIdea = new Idea(getUserTitle(), getUserBody(), getTags());
    this.ideas.push(newIdea);
    this.store();
    $ideaList.prepend(generateListHTML(newIdea));
  },
  remove: function(id){
    // var idea = find(id);
    var index;
    for (var i = 0; i < this.ideas.length; i++){
      if(this.ideas[i].id === id){
        index = i;
      }
    }
    this.ideas.splice(index, 1);
    this.store();
  },

  find: function(id){
    var ideas = this.retrieve();
    for (var i = 0; i < ideas.length; i++){
      if(ideas[i].id === id){
        return ideas[i];
      }
    }
  },
  render: function(){
    $ideaList.html('');
    this.retrieve();
    for (var j = 0; j < this.ideas.length; j++){
      $ideaList.prepend(generateListHTML(this.ideas[j]));
    }
  },

  showOrHideIdeas: function(searchString){
    for (var i = 0; i < this.ideas.length; i++) {
      var existingIdea = this.ideas[i];

      if(!(this.ideas[i].title.includes(searchString)) && !(this.ideas[i].body.includes(searchString))){
          $search.siblings().children("[value="+this.ideas[i].id+"]").hide();
      } else {
          $search.siblings().children("[value="+this.ideas[i].id+"]").show();
      }
    }
  },
  store: function(){
    localStorage.setItem('ideas', ideaStringify(this.ideas));
  },
  retrieve: function(){
    var ideasFromStorage = JSON.parse(localStorage.getItem('ideas'));
    for (var i = 0; i < ideasFromStorage.length; i++){
      this.ideas[i] = new Idea(ideasFromStorage[i].title, ideasFromStorage[i].body, ideasFromStorage[i].tags, ideasFromStorage[i].id, ideasFromStorage[i].quality);
    }
    return this.ideas;
  },
};

function Idea(title, body, tags, id, quality) {
  this.title = title;
  this.body = body;
  this.tags = tags;
  this.id = id || Date.now();
  this.quality = quality || 'swill';
}

Idea.prototype.upvote = function(){
  this.quality = qualityUp(this.quality);
};

Idea.prototype.downvote = function(){
 this.quality = qualityDown(this.quality);
};


function checkIdeaFieldsEmpty(){
  if ($ideaTitleInput.val()==='' || $ideaBodyInput.val()===''){
    return true;
  }else{
    return false;
  }
}

function toggleSubmitDisable(){
  if (checkIdeaFieldsEmpty()){
    $submit.attr('disabled', true);
  }else {
    $submit.attr('disabled', false);
  }
}


function getUserTitle () {
  return $ideaTitleInput.val();
}

function getUserBody () {
  return $ideaBodyInput.val();
}

function getTags(){
  return $ideaTagInput.val().split(',');
}

function retrieveTagArray(){
  if (JSON.parse(localStorage.getItem('tagArray')) === null){
    return [];
  } else{
    return JSON.parse(localStorage.getItem('tagArray'));
  }
}

function addTagsToStorage(idea){
  var tagArray = retrieveTagArray();

  for (var i = 0; i < idea.tags.length; i++){
  if ( $.inArray(idea.tags[i], tagArray) === -1 ) {
      tagArray.push(idea.tags[i]);
    }
  }
  localStorage.setItem('tagArray', JSON.stringify(tagArray));
}

function ideaStringify(ideas) {
  return JSON.stringify(ideas);
}

function ideaToStorage(newIdea) {
  localStorage.setItem(newIdea.id, ideaStringify(newIdea));
  addTagsToStorage(newIdea);
  addIdToArray(newIdea.id);
}

function addIdToArray(id) {
  var IdeaIDArray = retrieveIDArray();

  IdeaIDArray.push(id);
  localStorage.setItem('idArray', JSON.stringify(IdeaIDArray));
}

function retrieveIdea(id) {
  return JSON.parse(localStorage.getItem(id));
}

function retrieveIDArray() {

  if (JSON.parse(localStorage.getItem('idArray')) === null){
    return [];
  } else{
    return JSON.parse(localStorage.getItem('idArray'));
  }
}

function generateListHTML(idea){
  return   "<li value="+idea.id+">"+
      "<div class='idea-header'>"+
        "<h2>"+idea.title+"</h2>"+
        "<button type='button' class='delete-btn'>"+
        "<img src='./imgs/delete.svg' /></button>"+
      "</div>"+
      "<div class='idea-body'>"+
        "<p>"+idea.body+"</p>"+
      "</div>"+
      "<div class='idea-footer'>"+
        "<button type='button' class='upvote-btn'><img src='./imgs/upvote.svg'/></button>"+
        "<button type='button' class='downvote-btn'><img src='./imgs/downvote.svg' /></button>"+
        "<span>quality: </span>"+
        "<article class='idea-quality'>"+
          idea.quality+
        "</article>"+
      "</div>"+
    "</li>";
}

function generateTagButtonHTML(tag){
  return "<button class='tag-button'>"+tag+"</button>";
}

function populateTagsToPage(){
  var tagArray = retrieveTagArray();
  for (var i = 0; i < tagArray.length; i++) {
    $ideaSection.prepend(generateTagButtonHTML(tagArray[i]));
  }
}

$form.submit( function(){
  event.preventDefault();
  IdeaBox.add();
  return false;
});

$(document).ready(function (){
  toggleSubmitDisable();
  IdeaBox.render();
});

$form.on('keyup', function(){
  toggleSubmitDisable();
});

function getSearchString(){
  return $search.val();
}

function showOrHideIdeas(searchString, ideaIDArray){
  for (var i = 0; i < ideaIDArray.length; i++) {
    var existingIdea = retrieveIdea(ideaIDArray[i]);

    if(!(existingIdea.title.includes(searchString)) && !(existingIdea.body.includes(searchString))){
        $search.siblings().children("[value="+existingIdea.id+"]").hide();
    } else {
        $search.siblings().children("[value="+existingIdea.id+"]").show();
    }
  }
}

$search.on('keyup', function(){
  var searchString = getSearchString();
  IdeaBox.showOrHideIdeas(searchString);
});

function showOrHideIdeasByTags(filterTags, ideaIDArray){
  if(filterTags.length !==0){
    for (var i = 0; i < ideaIDArray.length; i++) {
      var existingIdea = retrieveIdea(ideaIDArray[i]);

      if(_.intersection(filterTags, existingIdea.tags).length > 0){
        $search.siblings().children("[value="+existingIdea.id+"]").show();
      } else {
        $search.siblings().children("[value="+existingIdea.id+"]").hide();
      }
    }
  }
  else{
    for (var j = 0; j < ideaIDArray.length; j++) {
      var existingIdea2 = retrieveIdea(ideaIDArray[j]);
      $search.siblings().children("[value="+existingIdea2.id+"]").show();
    }
    }
}

function addTagButtonsToPage(){

}

$ideaList.on('click', '.delete-btn', function(){
  var id = $(this).closest('li').attr("value");
  $(this).closest('li').remove();
  IdeaBox.remove(id);

  // removeIdeaStorage(id);
  // removeIDfromArray(id);
});

function replaceImage(target, imageURL){
  target.children('img').attr('src', imageURL);
}

$ideaList.on('mouseover', '.delete-btn', function(){
  replaceImage($(this),'./imgs/delete-hover.svg');
});

$ideaList.on('mouseleave', '.delete-btn', function(){
  replaceImage($(this),'./imgs/delete.svg');
});

$ideaList.on('mouseover', '.upvote-btn', function(){
  replaceImage($(this),'./imgs/upvote-hover.svg');
});

$ideaList.on('mouseleave', '.upvote-btn', function(){
  replaceImage($(this), './imgs/upvote.svg');
});

$ideaList.on('mouseover', '.downvote-btn', function(){
  replaceImage($(this), './imgs/downvote-hover.svg');
});

$ideaList.on('mouseleave', '.downvote-btn', function(){
  replaceImage($(this), './imgs/downvote.svg');
});

function removeIdeaStorage(id) {
  localStorage.removeItem(id);
}

function removeIDfromArray(id) {
  var IdeaIDArray = retrieveIDArray();
  var index = IdeaIDArray.indexOf(id);
  IdeaIDArray.splice(index, 1);
  localStorage.setItem('idArray', JSON.stringify(IdeaIDArray));
}

function saveQuality(target, newQuality){

  var id = parseInt(target.closest('li').attr("value"));
  var editedIdea = retrieveIdea(id);

  removeIdeaStorage(id);
  removeIDfromArray(id);
  editedIdea.quality = newQuality;
  ideaToStorage(editedIdea);
}

$ideaList.on('click', '.upvote-btn', function(){
  var id = parseInt($(this).closest('li').attr("value"));
  IdeaBox.find(id).upvote();
  IdeaBox.store();
  IdeaBox.render();
});

$ideaList.on('click', '.downvote-btn', function(){
  var id = parseInt($(this).closest('li').attr("value"));
  IdeaBox.find(id).downvote();
  IdeaBox.store();
  IdeaBox.render();
});

function qualityUp(status) {
  if (status === 'swill') {
    return 'plausible';
  } else {
    return 'genius';
  }
}
function qualityDown(status) {
  if (status === 'genius') {
    return 'plausible';
  } else {
    return 'swill';
  }
}

$ideaList.on('click', 'h2', function(){
  var text = $(this).text();
  $(this).replaceWith('<textarea class="titleField">'+text+'</textarea>');
});

$ideaList.on('click', 'p', function(){
  var text = $(this).text();
  $(this).replaceWith('<textarea class="bodyField">'+text+'</textarea>');
});

function storeEditedIdea(target, property, text){
  var id = parseInt(target.closest('li').attr("value"));
  var editedIdea = retrieveIdea(id);

  removeIdeaStorage(id);
  removeIDfromArray(id);
  editedIdea[property] = text;
  ideaToStorage(editedIdea);
}

$ideaList.on('blur', '.titleField', function(){
  var text = $(this).val();

  if(text===''){
    text = 'Title';
  }
  storeEditedIdea($(this), 'title', text);
  $(this).replaceWith('<h2>'+text+'</h2>');
});

$ideaList.on('blur', '.bodyField', function(){
  var text = $(this).val();

  if(text===''){
    text = 'Body';
  }
  storeEditedIdea($(this), 'body', text);
  $(this).replaceWith('<p>'+text+'</p>');
});

$ideaList.on('mouseover', 'textarea', function(){
  $(this).focus();
});
