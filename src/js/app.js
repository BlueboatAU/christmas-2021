import './_app/polyfills'
import {waitForFinalEvent, matches} from "./_app/helpers.js"
// import * as THREE from 'three';
// import { gsap } from "gsap";
import { setupMultiCanvas } from './_app/multiCanvas';
import { followCursor } from './_app/cursor';
import { blotterSetup } from './_app/blotter'
import {crapBrowsers} from './_app/crapBrowsers.js'

//run all init scripts
const loadHandler = () => {

  followCursor()
  crapBrowsers()

}

document.addEventListener("DOMContentLoaded", loadHandler)

window.onload = function(){
  setupMultiCanvas()
  blotterSetup()
}


//run all scripts on resize
const resizeHandler = () => waitForFinalEvent(() => {



}, 100, 'dont resize again');
window.addEventListener('resize', resizeHandler)


//event bubbling click handler
const clickHandler = () => {

}
document.addEventListener('click', clickHandler, false);