window.onload = function() {

  var thing = document.querySelector('#thing');
  thing.onclick = () => {
    TweenLite.to(thing, 1, {left: '+=100px'});
  }

}
