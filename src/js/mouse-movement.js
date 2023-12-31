let mouseDown = false;
let startX, startY;
const slider = document.querySelector('#container');

const startDragging = (e) => {
  const target = e.srcElement.className || e.srcElement.id;
  if(isPopup(e.srcElement) || isRoot(e.srcElement)) return;
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  startY = e.pageY - slider.offsetTop;
  
  document.getElementById("inner-container").style.cursor = "grabbing";

}

const stopDragging = (e) => {
  mouseDown = false;
  document.getElementById("inner-container").style.cursor = "grab";
}

const move = (e) => {
  e.preventDefault();
  if(!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const y = e.pageY - slider.offsetTop;
  const scrollX = x - startX;
  const scrollY = y - startY;
  window.scrollTo(window.scrollX - scrollX, window.scrollY - scrollY);
}

// Add the event listeners
slider.addEventListener('mousemove', move, false);
slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);


function isRoot(element){
  if(!element){
    return false;
  }
  return element.className == 'root' || isRoot(element.parentElement);
}

function isPopup(element) {
  if(!element){
    return false;
  }
  const target = element.className || element.id || "";

  return target.match(/popup/) || isPopup(element.parentElement);
}