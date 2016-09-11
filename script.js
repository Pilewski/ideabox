
var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $ideaTagInput = $('#idea-tag-input');
var $form = $('#input-form');
var $ideaList = $('#idea-list');
var $search = $('#search-input');
var $submit = $('#submit-button');
var $ideaSection = $('#idea-section');
var $tagButtons = $('#tag-buttons');
var $sortByQuality = $('#sort-by-quality');

var IdeaBox = {

  ideas: [],
  selectedTags: [],
  tagList: [],


  add: function(){
    var newIdea = new Idea(getUserTitle(), getUserBody(), getTags());
    this.ideas.push(newIdea);
    clearInputFields();
    //get only new tags
    for (var i = 0; i < newIdea.tags.length; i++){
      if ( $.inArray(newIdea.tags[i], this.tagList) === -1 ) {
          this.tagList.push(newIdea.tags[i]);
        }
    }

    this.store();
    this.renderTags();
    $ideaList.prepend(generateListHTML(newIdea));
  },
  addSelectedTag: function(tag){
    this.selectedTags.push(tag);
  },
  remove: function(id){
    var index;
    for (var i = 0; i < this.ideas.length; i++){
      if(this.ideas[i].id === parseInt(id)){
        index = i;
      }
    }
    var tagsToDelete = this.ideas[index].tags;//get tags from tag to be deleted
    this.ideas.splice(index, 1);//remove idea from list
    this.parseTagsOnPage(tagsToDelete);
    this.store();
    this.renderTags();
  },
  parseTagsOnPage: function(tagsToDelete){
    for(var j = 0; j<tagsToDelete.length; j++){//loop through each tag to be deleted
      var tagUnique = true;
      for(var k = 0; k<this.ideas.length; k++){//loop through existing ideas
          if(this.ideas[k].tags.indexOf(tagsToDelete[j]) !== -1){//check if tag to be deleted is present in idea
            tagUnique = false;
          }
      }
      if(tagUnique === true){//if tag is unique
        tagIndex = this.tagList.indexOf(tagsToDelete[j]);//find tag index in tagList array
        this.tagList.splice(tagIndex,1);//delete tag from array
      }
    }
  },
  unselectTag: function(tag){
    var index = this.selectedTags.indexOf(tag);
    this.selectedTags.splice(index, 1);
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
    $ideaSection.children('#tag-buttons').html('');
    for (var i = 0; i < this.tagList.length; i++) {
      $ideaSection.children('#tag-buttons').prepend(generateTagButtonHTML(this.tagList[i]));
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
  showOrHideIdeasByTags: function(){
    if(this.selectedTags.length !==0){
      for (var i = 0; i < this.ideas.length; i++) {
        if(_.intersection(this.selectedTags, this.ideas[i].tags).length >= this.selectedTags.length){
          $search.siblings().children("[value="+this.ideas[i].id+"]").show();
        } else {
          $search.siblings().children("[value="+this.ideas[i].id+"]").hide();
        }
      }
    }
    else{
      for (var j = 0; j < this.ideas.length; j++) {
        $search.siblings().children("[value="+this.ideas[j].id+"]").show();
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
  sortByQuality: function(direction){
    var sortedIdeas = [];
    var quality;

    if(direction === 'descending'){
      quality = 'swill';
    }else{
      quality = 'genius';
    }

    for(var i = 0; i < 3; i++){//loop through once for each quality
      for (var j = 0; j < this.ideas.length; j++) {
        if(this.ideas[j].quality === quality){
          sortedIdeas.push(this.ideas[j]);
        }
      }
      //change quality check
      if(direction === 'descending'){
        quality = qualityUp(quality);
      }else{
        quality = qualityDown(quality);
      }
    }
    this.ideas = sortedIdeas;

    $ideaList.html('');
    for (var k = 0; k < this.ideas.length; k++){
      $ideaList.prepend(generateListHTML(this.ideas[k]));
    }
  }
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

function clearInputFields(){
  $ideaTitleInput.val('');
  $ideaBodyInput.val('');
  $ideaTagInput.val('');
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
  var tagArray = $ideaTagInput.val().split(',');
  for (var i = 0; i < tagArray.length; i++) {
    if ( tagArray[i] == " " || "") {
      tagArray[i].pop();
    }
    tagArray[i] = tagArray[i].trim();
  }
  return tagArray;
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
        "<span id='tag-list'>"+idea.tags+"</span>"+
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

$tagButtons.on('click', '.tag-button', function(){
  var tag = $(this).text();

  if($(this).hasClass('selected')){
    IdeaBox.unselectTag(tag);
  }else{
    IdeaBox.addSelectedTag(tag);
  }

  $(this).toggleClass('selected');
  IdeaBox.showOrHideIdeasByTags();
});


var sortDirection = 'descending';//default

$sortByQuality.on('click', function(){
  IdeaBox.sortByQuality(sortDirection);
  if(sortDirection === 'descending'){
    sortDirection = 'ascending';
  }else{
    sortDirection = 'descending';
  }
});

function getSearchString(){
  return $search.val();
}

$search.on('keyup', function(){
  var searchString = getSearchString();
  IdeaBox.showOrHideIdeas(searchString);
});

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
