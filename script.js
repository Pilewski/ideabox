

function newUniqueID () {
  return Date.now();
}

function Idea(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = quality;
}
