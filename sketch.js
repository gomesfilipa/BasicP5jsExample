let pirilampos = [];
let flores = [];
let cor = [255,230,100];
let vento = 0;

function setup() {
  createCanvas(800, 600);
  background(10, 10, 30);
  for (let i = 0; i < 60; i++) {
    pirilampos.push(new Pirilampo());

  }
}

function draw() {
  //céu que muda de cor devagar
  background(20+20*sin(frameCount*0.001),10,50+30*sin(frameCount*0.0007),40);
  
  //setas=vento
  vento=0;
  if(keyIsDown(LEFT_ARROW)) {
    vento=-1;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    vento=1;
  }

  //flores
  for (let f of flores) {
    f.desenhar();
  }

  //pirilampos
  for (let p of pirilampos) {
    p.mover();
    p.desenhar();
  }

  //luz do rato
  noStroke();
  fill(255,255,200,25);
  circle(mouseX,mouseY,300);

  //legenda
  fill(255,90);
  textSize(12);
  text("rato:luz|clique:for|123:cor|setas:vento|espaço:susto",10,height-10);
}

class pirilampo {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.tamanho = random(4, 10);
    this.fase = random(100);

  }
  desenhar() {
    let brilho=150+105*sin(frameCount*0.05+this.fase);
    noStroke();
    fill(255,230,100,brilho/4);
    circle(this.x,this.y,this.tamanho*4);
    fill(255,230,100,brilho);
    circle(this.x,this.y,this.tamanho);
  }
  }

  mover() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    if (this.x < 0 ){ 
      this.vel.x = -this.vel.x;
    }
    if (this.x > width ){ 
      this.vel.x = -this.vel.x;
    }
    if (this.y < 0 ){
      this.vel.y = -this.vel.y;
    }
    if (this.y > height ){
      this.vel.y = -this.vel.y;
    }
  }

  noStroke();
  fill(255,255,200,25);
  circle(mouseX,mouseY,300);
  text(20+20*sin(frameCount*0.01),10,50+30*sin(frameCount*0.0007),40);

  function mousePressed() {
    flores.push(new Flor(mouseX,mouseY));
  }

  function keyPressed() {
    if (key == '1') {
      cor = [255,230,100];
    }else if (key === '2') {
      cor=[100,230,255];
    }else if (key === '3') {
      cor=[255,130,200];
    }else if (key === ' ') {
      for (let p of pirilampos) {
        p.vel.x=crateVector(random(-1,1),random(-1,1));
        p.susto= 60;
      }
    }
    return false;
  }

  class Pirilampo {
    constructor() {
      this.x = random(width);
      this.y = random(height);
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.tamanho = random(4, 10);
      this.fase = random(100);
      this.susto=0;
    }
    mover() {
      let d= dist(this.x,this.y,mouseX,mouseY);
      if (this.susto>0) {
        this.x+=(mouseX-this.x)*0.02;
        this.y+=(mouseY-this.y)*0.02;
        this.susto -=1;
      }else if (d<150) {
      this.x += (mouseX-this.x)*0.02;
      this.y += (mouseY-this.y)*0.02;
      }else {
        this.x += this.vel.x;
        this.y += this.vel.y;
  
      }
      this.x += vento*2;
      if (this.x < 0 ){ 
        this.vel.x = abs(this.vel.x);
      }
      if (this.x > width ){
        this.vel.x = -abs(this.vel.x);
      }
      if (this.y < 0 ){
        this.vel.y = abs(this.vel.y);
      }
      if (this.y > height ){
        this.vel.y = -abs(this.vel.y);
      }
    }

    desenhar() {
      let brilho=150+105*sin(frameCount*0.05+this.fase);
      noStroke();
      fill(cor[0],cor[1],cor[2],brilho/4);
      circle(this.x,this.y,this.tamanho*4);
      fill(cor[0],cor[1],cor[2],brilho);
      circle(this.x,this.y,this.tamanho);
    }
  }

  class Flor {
    constructor(x,y) {
      this.x=x;
      this.y=y;
      this.idade=0;
    }
    desenhar() {
      if (this.idade<60) {
        this.idade+=1;
      }
      noStroke();
      fill(255,120,200,180);
      for(let i=0;i<6;i++) {
        let a =i * 1.05;
        circle(this.x,this.y,this.idade*4);
       }
       fill(255,230,100);
        circle(this.x,this.y,this.idade*0.4);
      }
    }
