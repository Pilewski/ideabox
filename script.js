
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
  selectedTags: [],
  tagList: [],


  add: function(){
    var newIdea = new Idea(getUserTitle(), getUserBody(), getTags());
    this.ideas.push(newIdea);
    //get only new tags
    for (var i = 0; i < newIdea.tags.length; i++){
      if ( $.inArray(newIdea.tags[i], this.tagList) === -1 ) {
          this.tagList.push(newIdea.tags[i]);
        }
    }
    //
    this.store();
    this.renderTags();
    $ideaList.prepend(generateListHTML(newIdea));
  },
  remove: function(id){
    var index;
    for (var i = 0; i < this.ideas.length; i++){
      if(this.ideas[i].id === parseInt(id)){
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

  renderTags: function(){
    $ideaSection.children('.tag-buttons').html('');
    for (var i = 0; i < this.tagList.length; i++) {
      $ideaSection.children('.tag-buttons').prepend(generateTagButtonHTML(this.tagList[i]));
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
  store: function(idea){
    localStorage.setItem('ideas', ideaStringify(this.ideas));
    localStorage.setItem('tagList', JSON.stringify(this.tagList));
  },
  retrieve: function(){
    var ideasFromStorage = JSON.parse(localStorage.getItem('ideas'));
    this.tagList = JSON.parse(localStorage.getItem('tagList'));
    if(this.tagList === null) {this.tagList = [];}
    if(ideasFromStorage!==null){
      for (var i = 0; i < ideasFromStorage.length; i++){
        this.ideas[i] = new Idea(ideasFromStorage[i].title, ideasFromStorage[i].body, ideasFromStorage[i].tags, ideasFromStorage[i].id, ideasFromStorage[i].quality);
      }
    return this.ideas;
    }
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

Idea.prototype.changeTitle = function(text){
  this.title = text;
};

Idea.prototype.changeBody = function(text){
  this.body = text;
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


function populateTagsToPage(){
  var tagArray = retrieveTagArray();
  for (var i = 0; i < tagArray.length; i++) {
    $ideaSection.prepend(generateTagButtonHTML(tagArray[i]));
  }
}

function ideaStringify(ideas) {
  return JSON.stringify(ideas);
}

function generateListHTML(idea){
  return   "<li value="+idea.id+">"+
      "<div class='idea-header'>"+
        "<h2 class='title-field'>"+idea.title+"</h2>"+
        "<button type='button' class='delete-btn'>"+
        "<img src='./imgs/delete.svg' /></button>"+
      "</div>"+
      "<div class='idea-body'>"+
        "<p class='body-field'>"+idea.body+"</p>"+
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
  IdeaBox.renderTags();
});

$form.on('keyup', function(){
  toggleSubmitDisable();
});

function getSearchString(){
  return $search.val();
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
  $(this).replaceWith('<textarea class="title-field">'+text+'</textarea>');
});

$ideaList.on('click', 'p', function(){
  var text = $(this).text();
  $(this).replaceWith('<textarea class="body-field">'+text+'</textarea>');
});

$ideaList.on('blur','.title-field', function(){
  var id = parseInt($(this).closest('li').attr("value"));
  var text = $(this).val();

  if(text===''){
    text = 'Title';
  }
  IdeaBox.find(id).changeTitle(text);
  IdeaBox.store();

  $(this).replaceWith('<h2>'+text+'</h2>');
});

$ideaList.on('blur','.body-field', function(){
  var id = parseInt($(this).closest('li').attr("value"));
  var text = $(this).val();

  if(text===''){
    text = 'Body';
  }
  IdeaBox.find(id).changeBody(text);
  IdeaBox.store();

  $(this).replaceWith('<p>'+text+'</p>');
});

$ideaList.on('mouseover', 'textarea', function(){
  $(this).focus();
});
