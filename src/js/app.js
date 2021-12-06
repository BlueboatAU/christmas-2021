import './_app/polyfills'
import {waitForFinalEvent, matches} from "./_app/helpers.js"
import {setupCanvas} from "./_app/canvas.js"

//run all init scripts
const loadHandler = () => {

  

  document.querySelector('body').classList.add('loaded');

}

document.addEventListener("DOMContentLoaded", loadHandler)

window.onload = function(){
  setupCanvas()
}


//run all scripts on resize
const resizeHandler = () => waitForFinalEvent(() => {



}, 100, 'dont resize again');
window.addEventListener('resize', resizeHandler)


//event bubbling click handler
const clickHandler = () => {

}
document.addEventListener('click', clickHandler, false);