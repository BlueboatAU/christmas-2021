import './_app/polyfills'
import {waitForFinalEvent, matches} from "./_app/helpers.js"
// import "smooth-scroll";

//run all init scripts
const loadHandler = () => {

  // //smooths scrollings
  // new SmoothScroll('a[href*="#"]', {
  //   speed: 1000,
  //   offset: 50,
  //   easing: 'easeInOutCubic',
  // });

  document.querySelector('body').classList.add('loaded');

}

document.addEventListener("DOMContentLoaded", loadHandler)


//run all scripts on resize
const resizeHandler = () => waitForFinalEvent(() => {



}, 100, 'dont resize again');
window.addEventListener('resize', resizeHandler)


//event bubbling click handler
const clickHandler = () => {

}
document.addEventListener('click', clickHandler, false);