let pirilampos = [];
let flores = [];
let nenufares = [];
let ondas = [];
let cadentes = [];
let estrelas = [];
let relva = [];
let cor = [255,230,100];
let corAlvo = [255,230,100];
let modoArco = false;
let vento = 0;
let ventoS=0;
let par = 0;
let fundo
let hz,cx,cy,rx,ry,luaX,luaY;

//============ SETUP ============
function setup() {
  createCanvas(windowWidth, windowHeight);
  construirMundo();
  for (let i = 0; i < 140; i++) {
    pirilampos.push(new Pirilampo());
  }
  pirilampos.sort((a,b)=> a.z - b.z);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  construirMundo();
}

//============ MUNDO ============
function construirMundo() {
  hz = height * 0.5;
  cx = width / 2;
  cy = height * 0.74;
  rx = width * 0.34;
  ry = height * 0.15;
  luaX = width * 0.8;
  luaY = hz * 0.38;

  estrelas = [];
  for (let i = 0; i < 220; i++) {
    estrelas.push({ x: random(width), y: random(hz * 0.95), t: random(0.8,2.4),f:random(100),v:random(0.01,0.04)});
  }

  fundo = createGraphics(width + 200,height);
  let c = fundo.drawingContext;

  //céu
  let g = c.createLinearGradient(0, 0, 0, hz);
  g.addColorStop(0, 'rgb(3,5,20)');
  g.addColorStop(0.6, 'rgb(14,16,48)');
  g.addColorStop(1, 'rgb(60,40,100)');
  c.fillStyle = g;
  c.fillRect(0,0,width + 200,hz + 2);

  //via láctea
  fundo.noStroke();
  fundo.push();
  fundo.translate((width + 200)/2,hz * 0.35);
  fundo.rotate(-0.35);
  for (let i = 0; i < 14; i++) {
    fundo.fill(170, 160, 255, 5);
    fundo.ellipse(random(-width * 0.1, width * 0.1), random(-20,20), width * 0.9 - i * 30, 60 + i * 8);
  }
  fundo.pop();

  //lua
  for (let r = 300; r > 0; r -= 15) {
    fundo.fill(255,250,215,map(r,300,0,2,12));
    fundo.circle(luaX + 100, luaY, r);
  }
  fundo.fill(255,252,235);
  fundo.circle(luaX + 100, luaY, 64);
  fundo.fill(220,215,195,110);
  fundo.circle(luaX+90,luaY-8,12);
  fundo.circle(luaX+112,luaY+10,9);

  //colinas
  noiseSeed(11);
  fundo.fill(24,20,60)
  fundo.beginShape();
  fundo.vertex(0, hz + 4);
  for (let x = 0; x <= width + 200; x += 8)fundo.vertex(x, hz - noise(x * 0.004) * 90);
    fundo.vertex(width+200,hz+4);
    fundo.endShape(CLOSE);

    noiseSeed(23);
    fundo.fill(10,12,34);
    fundo.beginShape();
    fundo.vertex(0,hz+4);
    for (let x = 0; x <= width + 200; x += 8) fundo.vertex(x, hz + 4-noise(x * 0.007) * 55);
    fundo.vertex(width+200,hz + 4);
    fundo.endShape(CLOSE);

  //relva(chão)
  let g2 = c.createLinearGradient(0,hz,0,height);
  g2.addColorStop(0, 'rgb(14,32,36)');
  g2.addColorStop(1, 'rgb(3,10,12)');
  c.fillStyle=g2;
  c.fillRect(0,hz,width + 200, height - hz);

//lâminas de relva à volta do lago
relva = [];
let tent = 0; 
while (relva.length < 900 && tent < 6000) {
  tent++;
  let x =random(-20,width+20);
  let y =random(hz + 6,height + 5);
  if(dentroLago(x,y,1.04))continue;
  relva.push({x: x,y:y,h:random(8,26),f:random(100),g:random(70,130)})
}

//nenufares
nenufares=[];
for(let i=0; i<9; i ++)nenufares.push(new Nenufar());
}

function dentroLago(x,y,m){
  m=m ||1;
  return sq((x-cx) /(rx*m))+sq((y-cy)/(ry*m))<1;
}

function naRelva(x,y){
  return y > hz +12&& !dentroLago(x,y,1);
}

//===================DRAW========================
function draw(){
   par=(mouseX-width/2)*0.03;

  //cor 
  if(modoArco)corAlvo=hsl((frameCount*0.3)%360,100,65);
  for(let i = 0; i < 3; i++) cor[i]=lerp(cor[i],corAlvo[i],0.04);

  //vento
  vento=0;
  if(keyIsDown(LEFT_ARROW))vento=-1;
  if(keyIsDown(RIGHT_ARROW))vento=1;
  ventoS=lerp(ventoS,vento,0.05);


  //fundo
  image(fundo,-100+par*0.5,0);

  //estrelas a piscar
  noStroke();
  for(let e of estrelas){
     fill(255 , 255 , 235 , 80 + 170 * (0.5+0.5*sin(frameCount * e.v + e.f)));
     circle(e.x + par * 0.3 , e.y , e.t)
  }
 
  //estrelas cadente
  if (random()< 0.003) cadentes.push(new Cadente(random(width*0.1,width*0.8),random(0,hz*0.4)));
    for(let s of cadentes) s.desenhar();
    cadentes=cadentes.filter(s=> s.vida>0);
  
  //lago
  desenharLago();

//reflexos dentro do lago
drawingContext.save();
drawingContext.beginPath();
drawingContext.ellipse(cx,cy,rx,ry,0,0,TWO_PI);
drawingContext.clip();

reflexoCeu();

blendMode(ADD);
for(let p of pirilampos)p.refletir();
blendMode(BLEND);

//ONDAS
noFill();
for(let o of ondas) {
   o.r+=1.6
   o.a-=1.5;
   stroke(200,220,255,o.a);
   strokeWeight(1.5);
   ellipse(o.x ,o.y ,o.r * 2 , o.r * 0.55);
   stroke(200,220,255,o.a*0.5);
   ellipse(o.x, o.y, o.r * 1.4, o.r * 0.38);
  }
  ondas=ondas.filter(o=> o.a>0);
  drawingContext.restore();

  //nenúfares
  for(let n of nenufares)n.desenhar();

  //relva a abanar
  for(let b of relva){
    let esc=map(b.y,hz,height,0.4,1.4);
    let sway=sin(frameCount * 0.02+b.f+b.x*0.01)* 3 * esc + ventoS * 8 * esc;
    stroke(20,b.g,60,210);
    strokeWeight(1.2 * esc);
    line(b.x,b.y,b.x +sway, b.y - b.h * esc);
  }

  //flores
  for (let f of flores) f.desenhar();

  //pirilampos * luz do rato
  blendMode(ADD);
  for(let p of pirilampos){
    p.mover();
    p.desenhar();
  }
  let lg= drawingContext.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,220)
  lg.addColorStop(0,'rgba(255,255,200,0.18)');
  lg.addColorStop(1,'rgba(255,255,200,0)');
  drawingContext.fillStyle=lg;
  drawingContext.beginPath();
  drawingContext.arc(mouseX,mouseY,220,0,TWO_PI);
  drawingContext.fill();
  blendMode(BLEND);

  //legenda
  noStroke();
  fill(255,100);
  textSize(12);
  text("clique no lago: onda | na relva: flor(arasta!) | no céu: estrela cadente | 1 2 3 4 : cor| setas: vento| espaço: susto", 10, height-10);
}

function desenharLago(){
  let ctx=drawingContext
  let lg=ctx.createLinearGradient(0,cy-ry,0,cy+ry);
  lg.addColorStop(0,'rgb(40,40,95)');
  lg.addColorStop(1,'rgb(4,10,25)');
  ctx.fillStyle=lg;
  noStroke();
  ellipse(cx,cy,rx * 2, ry * 2);

 //água ganhar a cor dos pirilampos
 let c= Math.round(cor[0])+','+Math.round(cor[1])+','+Math.round(cor[2]);
 let tg = ctx.createRadialGradient(cx,cy,0,cx,cy,rx);
 tg.addColorStop(0,'rgba('+c+',0.16)');
 tg.addColorStop(1,'rgba('+c+',0)');
 ctx.save();
 ctx.beginPath();
 ctx.ellipse(cx,cy,rx,ry,0,0,TWO_PI);
 ctx.clip();
 ctx.fillStyle=tg;
 ctx.fillRect(cx-rx,cy-ry,rx*2,ry*2);
 ctx.restore();

 //margem do lago
 noFill();
 stroke(140,160,210,50);
 strokeWeight(2);
 ellipse(cx,cy,rx*2,ry*2);
}

function reflexoCeu(){
  noStroke();
  let k = rx / (width/2);
  for (let e of estrelas){
    let lx = cx + (e.x - width/2) * k * 0.95 + sin(frameCount * 0.05 + e.f) * 2;
    let ly = cy - ry + (hz - e.y) / hz * 2 * ry;
    fill(255,255,235,90*(0.5+0.5*sin(frameCount * e.v + e.f)));
    circle(lx,ly,e.t);
  }
  //lua
  let lx=cx+(luaX-width/2)*k*0.95;
  let ly=cy-ry+(hz-luaY)/hz*2*ry;
  for(let i = 0; i < 6;i ++){
    fill(255,250,215,50-i*7);
    ellipse(lx+sin(frameCount*0.04+i)*6,ly+i*7,60-i*6,8);
   }
}

//===============interação=================
function mousePressed(){
  if (dentroLago(mouseX,mouseY,1)){
    ondas.push({ x:mouseX,y:mouseY,r:5,a:200});
    setTimeout(() => ondas.push({ x:mouseX, y:mouseY,r:5,a:150}),200);
    for(let i =0; i<5;i++)pirilampos.push(new Pirilampo(mouseX+random(-20,20),mouseY+random(-30,0)));
    while(pirilampos.length>220)pirilampos.shift();
    pirilampos.sort((a,b)=>a.z-b.z);
  } else if (naRelva(mouseX,mouseY)){
    novaFlor(mouseX,mouseY);
  } else if(mouseY<hz) {
    cadentes.push(new Cadente(mouseX, mouseY));
  } 
} 

function mouseDragged(){
   if (frameCount % 3 === 0 && naRelva(mouseX,mouseY))novaFlor(mouseX,mouseY);
   return false;
} 

function novaFlor(x,y){
  flores.push(new Flor(x,y));
  if (flores.length > 160) flores.shift();
  flores.sort((a,b)=> a.y - b.y);
} 

function KeyPressed (){
  if(key=== '1') {modoArco=false; corAlvo = [255,230,100]; } 
  else if (key === '2') {modoArco=false; corAlvo = [100,230,255]; } 
  else if(key === '3') {modoArco=false; corAlvo = [255,130,200]; } 
  else if(key === '4') {modoArco=true;} 
  else if(key === ' ') {
   for (let p of pirilampos){
     p.sx=random(-4,4);
     p.sy=random(-4,4);
     p.susto=60;
    } 
    ondas.push({x: random( cx-rx * 0.6, cx + rx * 0.6), y: random(cy - ry *0.5, cy + ry * 0.5),r:5,a:200} );
    } 
    return false;
} 

function hsl (h,s,l) {
  s/=100;
  l/=100;
  let k = n => (n + h / 30) % 12;
  let a = s * min(1, 1 - 1);
  let f = n => 1 - a * max(-1,min(k(n) - 3, min(9-k(n),1)));
  return[255*f(0),255*f(8),255*f(4)];
} 

//==========PIRILAMPOS==============
class Pirilampo {
  constructor(x , y) {
    this.z = random(0.3, 1);
    if(x === undefined) {
      if (random() < 0.7) {
        this.x = random(cx - rx, cx + rx);
        this.y = random(cy - ry * 1.6, cy + ry * 0.8);
      } else {
        this.x = random(wdth);
        this.y = random(hz * 0.4, height * 0.95);
      }
    } else {
     this.x = x;
     this.y = y;
    }
    this.ox = random(1000);
    this.oy = random(1000);
    this.tamanho = random(1.5, 3) * this.z;
    this.fase = random(1000);
    this.ritmo = random(0.02, 0.05);
    this.susto = 0;
    this.sx = 0;
    this.sy = 0;
  }

mover() {
  let t = frameCount * 0.004;
  let vx = (noise(this.ox + t)-0.5) * 2.2;
  let vy = (noise(this.oy + t)-0.5) * 1.6;

  if(this.susto > 0) {
    this.x += this.sx * this.z;
    this.y += this.sy * this.z;
    this.sx *= 0.96;
    this.sy *= 0.96;
    this.susto -= 1;
  } else {
    let d = dist (this.x,this.y,mouseX,mouseY);
    if ( d < 180) {
      this.x += (mouseX - this.x) * 0.01 * thiz.z;
      this.y += (mouseY - this.y) * 0.01 * this.z;
    }
    this.x += vx * this.z;
    this.y += vy * this.z;
  } 

  this.x += vento * 2 * this.z;

  if (this.x < -30) this.x = width + 30;
  if (this.y > width + 30) this.x = -30;
  this.y = constrain(this.y, hz * 0.3, height - 8);
} 

 brilho() {
  let b = 0.08 + 0.92 * PeriodicWave(max(0,sin(frameCount * this.ritmo + this.fase)), 6);
  return b * (0.4 + 0.6 + this.z);
} 

halo(x,t,b,squash,k) {
  let ctx = drawingContext;
  let r = this.tamanho * 14;
  let c = Math.round(cor[0]) + ',' + Math.round(cor[1]) + ',' +Math.round(cor[2]);
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(1,squash);
  let g = ctx.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0, 'rgba(' + c + ',' + (0.9 * b * k) + ')');
  g.addColorStop(0.15, 'rgba(' + c + ',' + (0.35 * b * k) + ')');
  g.addColorStop(1, 'rgba(' + c + ',0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0,0,r,0,TWO_PI);
  ctx.fill();
  ctx.restore();
} 

desenhar(){
  let b = this.brilho();
  let px = this.x + par * this.z;
  this.halo(px,this.y,b,1,1);
  noStroke();
  fill(255,255,230,255 * b);
  circle(px,this.y,this.tamanho);
} 

refletir(){
  let py = cy + map(this.z,0.3,1,-0.7,0.9) * ry;
  if (this.y > py - 4)return;
  let b = this.brilho();
  let px = this.x + par * this.z + sin(frameCount * 0.08 + this.fase) * 3 * this.z;
  this.halo(px,2 * py - this.y, b, 1.7, 0.55);
  }
} 

//============NENÚFARES========================
class Nenufar {
  constructor(){
    let a = random(TWO_PI);
    let d = sqrt(random(0.08,0.8));
    this.x = cx + cos(a) * rx * d * 0.9;
    this.y = cy + sin(a) * ry * d * 0.9;
    this.r = random(16,30);
    this.fase = random(100);
    this.rot = random(TWO_PI);
    this.fLOR = random() < 0.55;
    this.cf = random([[255,170,210], [255,255,235],[220,180,255]]);
  } 

desenhar(){
  let esc = map(this.y, cy - ry, cy * ry, 0.55,1.15);
  let bx = this.x + sin(frameCount * 0.01 + this.fase) * 3 + ventoS * 4;
  let by = this.y + sin(frameCount * 0.025 + this.fase) * 1.5;
  let w = this.r * 2 * esc;
  let h = w * 0.42;

  noStroke();
  fill(0, 0, 0, 50);
  ellipse(bx + 2, by + 3, w, h);
  fill(22,70,55);
  arc(bx, by, w, h, this.rot, this.rot + TWO_PI - 0.5, PIE);
  fill(40,110,80,200);
  arc(bx,by,w * 0.8, h * 0.8, this.rot, this.rot + TWO_PI - 0.5, PIE);

  if(this.flor){
    push();
    translate(bx, by - h * 0.15);
    scale(1, 0.6);
    fill(this.cf[0],this.cf[1], this.cf[2],40);
    circle(0, 0, w * 0.9);
    for (let i = 0; i < 8; i++) {
      rotate(TWO_PI/8);
      fill(this.cf[0],this.cf[1],this.cf[2], 230 );
      ellipse(0, -w * 0.14, w * 0.16, w * 0.3);
    } 
    fill(cor[0],cor[1],cor[2]);
    circle(0,0,w*0.14);
    pop();
  } 
} 

} 

//================FLORES=================
class Flor{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.idade = 0;
    this.esc = map(y, hz, height, 0.5, 1.3);
    this.altura = random(40,80) * this.esc;
    this.cor = random([[255,150,200], [200,160,255], [255,255,230], [255,200,120], [150,200,255]]);
    this.fase = random(100);
    this.n = floor(random(5,8));
  }

  desenhar() {
    if (this.idade < 90) this.idade += 1;
    let k = 1 - pow (1 - this.idade / 90,3);
    let h = this.altura * k;
    let sway = sin(frameCount * 0.03 + this.fase) * 4 * this.esc + ventoS * 12 * k;
    let hx = this.x + sway;
    let hy = this.y - h;

    noFill();
    stroke(40,110,70);
    strokeWeight(2 * this.esc);
    bezier(this.x, this.y,this.x, this.y - h * 0.5, this.x + sway * 0.6, this.y - h * 0.8, hx, hy);
   
    let pr = 14 * this.esc * k;
    noStroke();
    fill(this.cor[0],this.cor[1],this.cor[2],30);
    circle(hx, hy, pr * 4);
    push();
    translate(hx,hy);
    rotate(sway * 0.02);
    fill(this.cor[0],this.cor[1],this.cor[2], 255);
    for (let i = 0; i < this.n; i++) {
      rotate(TWO_PI / this.n);
      ellipse(0, -pr * 0.6, pr * 0.7, pr * 1.2);
    }
    fill(cor[0],cor[1],cor[2])  ;
    circle(0, 0, pr * 0.7);
    pop();
  }
}

//====================ESTRELAS CADENTES===================
class Cadente {
  constructor(X,Y) {
    this.x = X;
    this.y = Y;
    let a = random(0.3,0.7);
    this.vx = cos(a) * 9;
    this.vy = sin(a) * 9;
    this.vida = 60;
  }
  
  desenhar() {
    this.x += this.vx;
    this.y += this.vy;
    this.vida -= 1;
    stroke(255, 255, 230, (this.vida/ 60) * 255);
    strokeWeight(2);
    line(this.x, this.y, this.x - this.vx * 6, this.y - this.vy * 6);
    noStroke();
  }
} 
  