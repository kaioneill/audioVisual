window.onload = function() {

  var squares = document.querySelectorAll('.square');
  console.log(squares);

  for (let s of squares) {
    s.style.backgroundColor = Math.floor(Math.random()*16777215).toString(16);
    s.onclick = s.onclick = () => {
      clickBounce(s);
    }
  }




  // var thing = document.querySelector('#thing');
  // thing.onclick = () => {
  //   clickBounce(thing);
  // }
  // var thing1 = document.querySelector('#thing1');
  // thing1.onclick = () => {
  //   clickBounce(thing1);
  // }

}


clickBounce = function(clickedItem) {
  var tl = new TimelineLite();
  tl.to(clickedItem, .1, {height: '60px', width: '60px'})
  .to(clickedItem, .2, {height: '50px', width: '50px'});
}
