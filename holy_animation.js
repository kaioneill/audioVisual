window.onload = function() {

  var thing = document.querySelector('#thing');
  thing.onclick = () => {
    TweenLite.to(thing, 1, {left: '+=100px'});
  }
  var thing1 = document.querySelector('#thing1');
  thing1.onclick = () => {
    TweenLite.to(thing1, 1, {height: '+=20px', width: '+=20px'});
  }

}
