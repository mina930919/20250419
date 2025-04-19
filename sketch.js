let button1, button2, button3, button4, button5, subButton1, subButton2;
let img1, img2, img3, img4;
let currentImage = null;
let frameWidth = 0, frameHeight = 0, frameCountPerImage = 0;

// 光波背景
let waves = [];
let driftOffset = 100;

// 愛心
let hearts = [];
let heartCount = 0; // 追蹤生成的愛心數量

function preload() {
  img1 = loadImage("連續動作1.png");
  img2 = loadImage("連續動作2.png");
  img3 = loadImage("連續動作3.png");
  img4 = loadImage("連續動作4.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  for (let i = 0; i < 10; i++) {
    waves.push({
      amplitude: random(50, 150),
      frequency: random(0.005, 0.02),
      phase: random(TWO_PI),
      speed: random(0.01, 0.03),
      color: color(random(200, 255), random(100, 255), random(200, 255), random(100, 200)),
      thickness: random(2, 6)
    });
  }

  // 初始愛心
  setInterval(createRandomHeart, 2000); // 每 2 秒隨機生成一個愛心

  button1 = createButton("作品集");
  button1.position(150, 50);
  button1.size(80, 40);
  button1.style("font-size", "16px");
  button1.mouseOver(() => setAnimation(img1, 36, 36, 6));
  button1.mouseOut(() => currentImage = null);
  button1.mousePressed(() => toggleSubButtons());

  button2 = createButton("自我介紹");
  button2.position(250, 50);
  button2.size(80, 40);
  button2.style("font-size", "16px");
  button2.mouseOver(() => setAnimation(img2, 42, 42, 4));
  button2.mouseOut(() => currentImage = null);
  button2.mousePressed(() => showIntroduction());

  button3 = createButton("筆記說明");
  button3.position(350, 50);
  button3.size(80, 40);
  button3.style("font-size", "16px");
  button3.mouseOver(() => setAnimation(img3, 38, 34, 6));
  button3.mouseOut(() => currentImage = null);
  button3.mousePressed(() => embedIframe("https://hackmd.io/@mina0919/HJWckvvAkl"));

  button4 = createButton("測驗卷");
  button4.position(450, 50);
  button4.size(80, 40);
  button4.style("font-size", "16px");
  button4.mouseOver(() => setAnimation(img4, 28, 38, 6));
  button4.mouseOut(() => currentImage = null);
  button4.mousePressed(() => embedIframe(" https://mina930919.github.io/20250418/"));

  button5 = createButton("影片連結");
  button5.position(550, 50);
  button5.size(80, 40);
  button5.style("font-size", "16px");
  button5.mousePressed(() => embedIframe("https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week8/20250407_091922.mp4"));
}

function draw() {
  drawGradientBackground();
  drawWaves();
  drawHearts();

  if (currentImage) {
    displayAnimation(currentImage, frameWidth, frameHeight, frameCountPerImage);
  }
}

// === 愛心功能 ===

function createRandomHeart() {
  if (heartCount >= 20) return; // 如果愛心數量達到 20，停止生成

  hearts.push({
    x: random(50, width - 50),
    y: random(100, height - 50),
    size: random(20, 40),
    color: color(random(255), random(150), random(255), 150), // 半透明顏色
    speedX: random(-1, 1), // 水平移動速度減慢 50%
    speedY: random(-1, 1)  // 垂直移動速度減慢 50%
  });

  heartCount++; // 增加愛心計數
}

function drawHearts() {
  for (let heart of hearts) {
    // 更新愛心位置
    heart.x += heart.speedX;
    heart.y += heart.speedY;

    // 碰到邊界反彈
    if (heart.x < 0 || heart.x > width) heart.speedX *= -1;
    if (heart.y < 0 || heart.y > height) heart.speedY *= -1;

    // 繪製愛心
    drawHeart(heart.x, heart.y, heart.size, heart.color);
  }
}

function drawHeart(x, y, size, c) {
  push();
  fill(c);
  noStroke();
  translate(x, y);
  beginShape();
  for (let t = 0; t < TWO_PI; t += 0.1) {
    let px = size * 16 * pow(sin(t), 3) / 16;
    let py = -size * (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) / 16;
    vertex(px, py);
  }
  endShape(CLOSE);
  pop();
}

function mousePressed() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    let d = dist(mouseX, mouseY, hearts[i].x, hearts[i].y);
    if (d < hearts[i].size) {
      hearts.splice(i, 1);
      return;
    }
  }

 
}

// === 波浪背景 ===

function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color("#FFD1DC"), color("#87CEEB"), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawWaves() {
  noFill();
  driftOffset += 0.5;
  for (let wave of waves) {
    stroke(wave.color);
    strokeWeight(wave.thickness);
    beginShape();
    for (let x = 0; x < width; x++) {
      let baseY = height - x * (height / width);
      let waveEffect = wave.amplitude * sin(wave.frequency * x + wave.phase);
      let naturalEffect = noise((x + driftOffset) * 0.01, frameCount * 0.01) * 10 - 5;
      let y = baseY + waveEffect + naturalEffect;
      curveVertex(x, y);
    }
    endShape();
    wave.phase += wave.speed;
  }
}

// === 按鈕動畫與互動 ===

function setAnimation(img, width, height, count) {
  currentImage = img;
  frameWidth = width;
  frameHeight = height;
  frameCountPerImage = count;
}

function displayAnimation(img, frameWidth, frameHeight, frameCountPerImage) {
  let x = 50;
  let y = 50;
  let index = Math.floor(frameCount / 6) % frameCountPerImage;
  let sx = index * frameWidth;
  let sy = 0;
  image(img, x, y, frameWidth, frameHeight, sx, sy, frameWidth, frameHeight);
}

function embedIframe(url) {
  let iframe = createElement("iframe");
  iframe.attribute("src", url);
  iframe.attribute("width", windowWidth * 0.8);
  iframe.attribute("height", windowHeight * 0.6);
  iframe.position((windowWidth - windowWidth * 0.8) / 2, (windowHeight - windowHeight * 0.6) / 2);
}

function toggleSubButtons() {
  if (!subButton1 && !subButton2) {
    subButton1 = createButton("海草");
    subButton1.position(150, 100);
    subButton1.size(45, 25);
    subButton1.style("font-size", "8px");
    subButton1.mousePressed(() => embedIframe("https://mina930919.github.io/0330/"));

    subButton2 = createButton("文字跳動");
    subButton2.position(200, 100);
    subButton2.size(50, 25);
    subButton2.style("font-size", "8px");
    subButton2.mousePressed(() => embedIframe("https://mina930919.github.io/0303/"));
  } else {
    subButton1.remove();
    subButton2.remove();
    subButton1 = null;
    subButton2 = null;
  }
}

function showIntroduction() {
  let introBox = createDiv("大家好 我是教科的陳思妘");
  introBox.style("font-size", "16px");
  introBox.style("background-color", "#FFF");
  introBox.style("padding", "10px");
  introBox.style("border", "1px solid #000");
  introBox.size(windowWidth * 0.8, windowHeight * 0.6);
  introBox.position((windowWidth - windowWidth * 0.8) / 2, (windowHeight - windowHeight * 0.6) / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
