const cursor = document.querySelector('.cursor')
const inner = cursor.querySelector('.cursor__inner')
const lerp = (x, y, a) => x * (1 - a) + y * a;

let x = -100, 
y = -100, 
mouseY = x, 
mouseX = y
let showHide = false

export const followCursor = () => {
    
    window.requestAnimationFrame(updateCursor)

}


const updateCursor = () => {

    let factor = 0.2

    if(window.mousePos !== undefined){
        
        
        //cursor follows mouse
        mouseX = lerp(mouseX, window.mousePos.x, factor)
        mouseY = lerp(mouseY, window.mousePos.y, factor)
        gsap.to(cursor, {x: mouseX, y: mouseY})

        
        let halfWidth = window.innerWidth / 2

        //control inner
        if(window.popOpen){
            gsap.to(inner, {autoAlpha: 0, duration: 0.5})
        } else if(mouseX < halfWidth){
            gsap.to(inner,{rotation: 90})
            if(window.sketch){
                if(window.sketch.current === 0){
                    gsap.to(inner, {autoAlpha: 0})
                } else {
                    gsap.to(inner, {autoAlpha: 1})
                }
            }
        } else {
            gsap.to(inner,{rotation: -90})
            if(window.sketch){
                if(window.sketch.current > 2){
                    gsap.to(inner, {autoAlpha: 0})
                } else {
                    gsap.to(inner, {autoAlpha: 1})
                }
            }
        }
        
        //control outer
        if(!cursor.classList.contains('active')){
            gsap.to(cursor, {autoAlpha: 1, duration: 2, onComplete: () => { showHide = true }})
            cursor.classList.add('active')
        } else if(showHide && window.mousePos.el && window.mousePos.el.nodeType && window.mousePos.el.hasAttribute('data-hide-cursor')){
            gsap.to(cursor, {autoAlpha: 0, duration: 0.5})
        } else if(showHide) {
            gsap.to(cursor, {autoAlpha: 1, duration: 0.5})
        }
    }

    window.requestAnimationFrame(updateCursor)
}