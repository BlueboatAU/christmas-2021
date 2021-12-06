import hoverEffect from './hover-effect'

export const setupCanvas = () => {

    var myAnimation = new hoverEffect({
        parent: document.querySelector('.canvas-parent'),
        intensity: 0.3,
        image1: '/image-1.jpg',
        image2: '/image-2.jpg',
        displacementImage: '/6.jpeg',
        hover: false
    });

    setTimeout(function(){
        myAnimation.next()
    }, 5000)
}