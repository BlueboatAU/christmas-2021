const cursor = document.querySelector('.cursor')
const inner = cursor.querySelector('.cursor__inner')
const lerp = (x, y, a) => x * (1 - a) + y * a;

let x = -100, 
y = -100, 
mouseY = x, 
mouseX = y

export const followCursor = () => {
    
    window.requestAnimationFrame(updateCursor)

}


const updateCursor = () => {

    let factor = 0.2

    if(window.mousePos !== undefined){

        mouseX = lerp(mouseX, window.mousePos.x, factor)
        mouseY = lerp(mouseY, window.mousePos.y, factor)

        gsap.to(cursor, {x: mouseX, y: mouseY})

        let halfWidth = window.innerWidth / 2

        if(mouseX < halfWidth){
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

    }

    window.requestAnimationFrame(updateCursor)
}