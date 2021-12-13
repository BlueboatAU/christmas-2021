export const blotterSetup = () => {

const body = document.body;
const docEl = document.documentElement;

const MathUtils = {
    lineEq: (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    },
    lerp: (a, b, n) =>  (1 - n) * a + n * b,
    distance: (x1, x2, y1, y2) => {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.hypot(a,b);
    }
};

    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);


    const getMousePos = (ev) => {

        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        }
        else if (ev.clientX || ev.clientY) 	{
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }

        let elementMouseIsOver = document.elementFromPoint(posx, posy)

        window.mousePos = {x: posx, y: posy, el: elementMouseIsOver};
    }

    window.mousePos = {x: winsize.width/2, y: winsize.height/2};
    window.addEventListener('mousemove', ev => { getMousePos(ev) });

    const canvas = document.querySelector('.slider__canvas')
    const allTitles = document.querySelectorAll('.slider__title')
    let imgTranslations = {x: 0, y: 0};

    const elem = document.querySelectorAll('.blotter');
    const blotters = []

    let smText = 50, mdText = 80, lgText = 100;
    
    const createBlotterText = () => {


        //create each blotter
        elem.forEach(function(el){
            let textEl = el.querySelector('.blotter__inner');
            let textElStyle = window.getComputedStyle(textEl);

            let textSize = lgText

            if(window.innerWidth < 370){
                textSize = smText
            } else if (window.innerWidth < 768){ 
                textSize = mdText
            } else {
                textSize = lgText
            }

            let text = new Blotter.Text(textEl.innerHTML.toUpperCase(), {
                family : "'Days One', sans-serif",
                weight: 900,
                size : textSize,
                paddingLeft: 100,
                paddingRight: 100,
                paddingTop: 100,
                paddingBottom: 100,
                fill : textElStyle.getPropertyValue('color'),
                needsUpdate: true
            });
        
            const material = new Blotter.LiquidDistortMaterial();
            material.uniforms.uSpeed.value = 1;
            material.uniforms.uVolatility.value = 0;
            material.uniforms.uSeed.value = 0.1;
            const blotter = new Blotter(material, {texts: text});
            blotters.push(blotter)
            const scope = blotter.forText(text);
            textEl.innerHTML = '';
            scope.appendTo(textEl);

        })
        
        let lastMousePosition = {x: winsize.width/2, y: winsize.height/2};
        let volatility = 0;
        
        const render = () => {
            const docScrolls = {left : body.scrollLeft + docEl.scrollLeft, top : body.scrollTop + docEl.scrollTop};
            const relmousepos = {x : window.mousePos.x - docScrolls.left, y : window.mousePos.y - docScrolls.top };
            const mouseDistance = MathUtils.distance(lastMousePosition.x, relmousepos.x, lastMousePosition.y, relmousepos.y);
            
            //set volitility
            if(window.innerWidth > 768){
                volatility = MathUtils.lerp(volatility, Math.min(MathUtils.lineEq(0.9, 0, 100, 0, mouseDistance),0.9), 0.05);
            } else {
                volatility = 0.005
            }

            //find current slide
            let currentBlotterIndex = Array.prototype.indexOf.call(allTitles, document.querySelector('.slider__title--current'));

            blotters.forEach(function(blotter, index){

                //volitility only for current
                if(currentBlotterIndex >= 0 && index === currentBlotterIndex){
                    blotter.material.uniforms.uVolatility.value = volatility;
                } else {
                    blotter.material.uniforms.uVolatility.value = 0;
                }

                //update text size
                let textSize = lgText

                if(window.innerWidth < 370){
                    textSize = smText
                } else if (window.innerWidth < 768){ 
                    textSize = mdText
                } else {
                    textSize = lgText
                }
                
                if(textSize != blotter.texts[0].properties.size){
                    blotter.texts[0].needsUpdate = true           
                    blotter.texts[0].properties.size = textSize
                }

            })

            //transform image mask
            if(window.innerWidth > 992){
                imgTranslations.x = MathUtils.lerp(imgTranslations.x, MathUtils.lineEq(40, -40, winsize.width, 0, relmousepos.x), 0.02);
                imgTranslations.y = MathUtils.lerp(imgTranslations.y, MathUtils.lineEq(40, -40, winsize.height, 0, relmousepos.y), 0.02);
                canvas.style.transform = `translateX(${(imgTranslations.x)}px) translateY(${imgTranslations.y}px)`;
            } else {
                canvas.style.transform = `translateX(0px) translateY(0px)`;
            }
    
            lastMousePosition = {x: relmousepos.x, y: relmousepos.y};
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    };

WebFont.load({
    google: {
        families: ['Playfair+Display:900']
    },
    active: () => createBlotterText()
});

}