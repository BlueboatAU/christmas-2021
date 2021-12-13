export class Sketch {
  constructor(opts) {
    this.scene = new THREE.Scene();
    this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
    this.fragment = opts.fragment;
    this.uniforms = opts.uniforms;
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.duration = opts.duration || 1;
    this.debug = opts.debug || false
    this.easing = opts.easing || 'power2.inOut'

    this.clicker = document.querySelector(".clicker");


    this.container = document.querySelector(".slider");
    this.containerWrap = this.container.querySelector(".slider__canvas")
    this.images = JSON.parse(this.container.getAttribute('data-images'));
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.containerWrap.appendChild(this.renderer.domElement);
    this.slides = this.container.querySelectorAll('.slider__title')
    this.nav = document.querySelectorAll('.nav__item')
    this.popover = document.querySelector('.popover')
    this.about = document.querySelector('.about')

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);
    this.time = 0;
    this.current = 0;
    this.textures = [];

    this.paused = true;
    this.initiate(()=>{
      // console.log(this.textures);
      this.setupResize();
      this.settings();
      this.addObjects();
      this.resize();
      this.clickEvent();
      this.play();
      document.querySelector('body').classList.add('loaded');
    })
    


  }

  initiate(cb){
    const promises = [];
    let that = this;
    this.images.forEach((url,i)=>{
      let promise = new Promise(resolve => {
        that.textures[i] = new THREE.TextureLoader().load( url, resolve );
      });
      promises.push(promise);
    })

    Promise.all(promises).then(() => {
      cb();
    });
  }

  clickEvent(){
    let that = this

    //mouse clicker
    this.clicker.addEventListener('click', (event)=>{
      let pos = event.clientX
      let halfWidth = window.innerWidth / 2
      if(pos > halfWidth){
        if(this.current < this.slides.length - 1){
          this.next();
        } else if (this.current == 3) {
          this.openPopover()
        }
      } else {
        if(this.current > 0){
          this.prev();
        }
      }
    })

    //nav clicker
    this.nav.forEach(function(navItem, index){
      navItem.addEventListener('click', (event) =>{
        event.stopPropagation()
        that.goToSlide(index)
      })
    })

    //other links
    document.querySelectorAll('[data-hide-cursor]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    })

    //open popover
    document.querySelectorAll('[data-open-popover]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        this.openPopover()
      })
    })

    //close popover
    document.querySelectorAll('[data-close-popover]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        this.closePopover()
        let attr = event.target.getAttribute('data-close-popover')
        if(attr.length > 0) {
          this.goToSlide(parseInt(attr))
        }
      })
    })

    document.querySelectorAll('[data-open-about]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        this.openAbout()
      })
    })

    document.querySelectorAll('[data-close-about]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        this.closeAbout()
      })
    })

  }

  settings() {
    let that = this;
    if(this.debug) this.gui = new dat.GUI();
    this.settings = {progress:0.5};
    // if(this.debug) this.gui.add(this.settings, "progress", 0, 1, 0.01);

    Object.keys(this.uniforms).forEach((item)=> {
      this.settings[item] = this.uniforms[item].value;
      if(this.debug) this.gui.add(this.settings, item, this.uniforms[item].min, this.uniforms[item].max, 0.01);
    })
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    

    // image cover
    this.imageAspect = this.textures[0].image.height/this.textures[0].image.width;
    let a1; let a2;
    if(this.height/this.width>this.imageAspect) {
      a1 = (this.width/this.height) * this.imageAspect ;
      a2 = 1;
    } else{
      a1 = 1;
      a2 = (this.height/this.width) / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist  = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    this.plane.scale.x = this.camera.aspect;
    this.plane.scale.y = 1;

    this.camera.updateProjectionMatrix();


  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        border: { type: "f", value: 0 },
        intensity: { type: "f", value: 0 },
        scaleX: { type: "f", value: 40 },
        scaleY: { type: "f", value: 40 },
        transition: { type: "f", value: 40 },
        swipe: { type: "f", value: 0 },
        width: { type: "f", value: 0 },
        radius: { type: "f", value: 0 },
        texture1: { type: "f", value: this.textures[0] },
        texture2: { type: "f", value: this.textures[1] },
        displacement: { type: "f", value: new THREE.TextureLoader().load('disp1.jpg') },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // wireframe: true,
      vertexShader: this.vertex,
      fragmentShader: this.fragment
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  next(){
    let len = this.textures.length;
    this.goToSlide((this.current +1)%len)
  }

  prev(){
    let len = this.textures.length;
    this.goToSlide((this.current+len-1)%len)
  }

  goToSlide(slideNumber) {
    if(this.isRunning || window.popOpen || this.current == slideNumber) return;
    if(slideNumber < 0 || slideNumber > this.textures.length - 1) return;
    this.isRunning = true;
    let nextTexture = this.textures[slideNumber];
    this.material.uniforms.texture2.value = nextTexture;
    let tl = gsap.timeline();
    tl.to(this.material.uniforms.progress,{
      value:1,
      ease: this.easing,
      duration: this.duration,
      onStart: () => {
        this.current = slideNumber;
        this.hideSlides()
      },
      onComplete:()=>{
        this.material.uniforms.texture1.value = nextTexture;
        this.material.uniforms.progress.value = 0;
    }})
  }

  hideSlides(){
    let that = this;
    this.slides.forEach(function(slide, index) {
      slide.classList.add('hidden')
    })
    // console.log('hide')
    setTimeout(function(){
      that.setSlide()
    }, 350)
  }

  setSlide() {
    let that = this
    this.slides.forEach(function(slide, index) {
      if(index == that.current){
        slide.classList.add('slider__title--current')
        let newBG = decodeURIComponent(slide.getAttribute('data-background'))
        gsap.to(that.clicker, {background: newBG})
      } else {
        slide.classList.remove('slider__title--current')
      }
    })
    this.nav.forEach(function(nav, index) {
      if(index == that.current){
        nav.classList.add('current')
      } else {
        nav.classList.remove('current')
      }
    })
    setTimeout(function(){
      that.showSlides()
    }, 100)
  }

  showSlides(){
    this.slides.forEach(function(slide, index) {
      slide.classList.remove('hidden')
    })
    this.isRunning = false;
  }

  openPopover(){
    window.popOpen = true
    gsap.to(this.popover, {autoAlpha: 1, duration: 0.5})
  }

  closePopover(){
    window.popOpen = false
    gsap.to(this.popover, {autoAlpha: 0, duration: 0.5})
  }

  openAbout(){
    window.popOpen = true
    gsap.to(this.about, {autoAlpha: 1, duration: 0.5})
  }

  closeAbout(){
    window.popOpen = false
    gsap.to(this.about, {autoAlpha: 0, duration: 0.5})
  }
  
  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    // this.material.uniforms.progress.value = this.settings.progress;

    Object.keys(this.uniforms).forEach((item)=> {
      this.material.uniforms[item].value = this.settings[item];
    });

    // this.camera.position.z = 3;
    // this.plane.rotation.y = 0.4*Math.sin(this.time)
    // this.plane.rotation.x = 0.5*Math.sin(0.4*this.time)

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
