const cursor = document.querySelector('.cursor')
const inner = cursor.querySelector('.cursor__inner')
const lerp = (x, y, a) => x * (1 - a) + y * a;

let x = -100, 
y = -100, 
mouseY = y, 
mouseX = x

export const followCursor = () => {

    //throttle cursor event
    let enableCall = true;
    document.addEventListener('mousemove', e => {
        if (!enableCall) return

        enableCall = false
        x = e.clientX
        y = e.clientY

        setTimeout(() => enableCall = true, 15)
    })
    
    window.requestAnimationFrame(updateCursor)

}


const updateCursor = () => {

    let factor = 0.2

    mouseX = lerp(mouseX, x, factor)
    mouseY = lerp(mouseY, y, factor)

    gsap.to(cursor, {x: mouseX, y: mouseY})

    let halfHeight = window.innerHeight / 2

    if(mouseY < halfHeight){
        gsap.to(inner,{rotation: 180})
    } else {
        gsap.to(inner,{rotation: 0})
    }
    
    window.requestAnimationFrame(updateCursor)
}