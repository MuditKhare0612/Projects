let cacti = [];
let tRexImgs = [];
let groundImg;
let ground;
let scl;
let player;
let elapsedTime = 0;
let generateLimit = 1000;
let maxgenLimit = 2000;
window.preload = () => {
    for (let i = 1; i < 5; i++) {
        cacti.push(loadImage(`./assets/t-rex/cactus-${i}.png`));
        if (i < 4) tRexImgs.push(loadImage(`./assets/t-rex/t-rex-${i}.png`));
    }
    tRexImgs.push(loadImage(`./assets/t-rex/t-rex-2.png`));
    tRexImgs.push(loadImage(`./assets/t-rex/t-rex-jump.png`));
    groundImg = loadImage('./assets/t-rex/ground.png')
}
window.setup = () => {
    createCanvas(innerWidth, innerHeight);
    ground = new Ground();
    player = new Player();
    restart();
}

window.draw = () => {
    background(255);
    ground.update()
    player.update();
    generateLimit = max(random(1000, maxgenLimit), 1000);
    elapsedTime += 1 / frameRate() * 1000;
    if (elapsedTime >= generateLimit) {
        ground.newCactus();
        elapsedTime = 0;
    }
    if (!(floor(player.score) % 100) && player.score > 1) {
        ground.speed = min(ground.speed + 0.3, 25);
        maxgenLimit -= 20;
        player.pJumpCount = max(player.pJumpCount - .1, 14);
    }
}

window.windowResized = () => {
    resizeCanvas(innerWidth, innerHeight);
}

window.onbeforeunload = () => {
    remove();
}

window.keyPressed = () => {
    if (key === " ") {
        player.jumping = true;
    }
}
window.mousePressed = () => {
    if (player.hasLost) {
        restart();
        loop();
    }
    else {
        player.jumping = true;
    }
}

function restart() {
    scl = map(width, 256, displayWidth, 1, 2);
    ground.restart();
    player.restart();
}

function Ground() {
    this.img = groundImg;
    this.cactiImgs = cacti;
    this.restart = () => {
        this.pos = createVector(0, height - 200);
        this.width = this.img.width * scl;
        this.height = this.img.height * scl;
        this.speed = 5;
        this.cacti = [];
    }
    this.draw = () => {
        for (let i = 0; i < this.groundCount + 1; i++) {
            let x = this.pos.x + i * this.width;
            image(this.img, x, this.pos.y, this.width, this.height);
        }
        for (let i = this.cacti.length - 1; i >= 0; i--) {
            let cactus = this.cacti[i];
            image(cactus.img, cactus.pos.x, cactus.pos.y, cactus.w, cactus.h);
        }
    }
    this.update = () => {
        this.move();
        this.draw();
        this.disposeCactus();
    }
    this.move = () => {
        this.groundCount = ceil(width / this.width);
        this.pos.x -= this.speed;
        if (this.pos.x < -this.width) {
            this.pos.x = 1;
        }
        for (let i = this.cacti.length - 1; i >= 0; i--) {
            let img = this.cacti[i];
            img.pos.x -= this.speed;
        }
    }
    this.newCactus = () => {
        let img = random(this.cactiImgs);
        let w = img.width * scl;
        let h = img.height * scl;
        let pos = createVector(width + w, this.pos.y - h);
        this.cacti.push({ img, pos, w, h });
    }
    this.disposeCactus = () => {
        for (let i = this.cacti.length - 1; i >= 0; i--) {
            let cactus = this.cacti[i];
            if (cactus.pos.x + cactus.w < 0) {
                this.cacti.splice(i, 1);
            }
        }
    }
}

function Player() {
    this.imgs = tRexImgs;
    this.restart = () => {
        this.pos = createVector(100, height);
        this.imgCount = 0;
        this.currentImg = null;
        this.jumping = false;
        this.scljumpCountRatio = 10;
        this.jumpCount = this.scljumpCountRatio * scl;
        this.pJumpCount = this.jumpCount;
        this.limitJumpCount = this.scljumpCountRatio * scl;
        this.score = 0;
        this.hasLost = false;
    }
    this.draw = () => {
        image(this.currentImg, this.pos.x, this.pos.y, this.width, this.height);
        fill(0);
        textSize(32);
        text(`Score: ${floor(this.score)}`, 0, 32);
    }
    this.update = () => {
        this.move();
        this.draw();
        this.checkCollision();
    }
    this.move = () => {
        this.currentImg = this.imgs[floor(this.imgCount)]
        if (this.jumping) {
            this.pos.y -= this.jumpCount;
            this.currentImg = this.imgs[this.imgs.length - 1];
            this.jumpCount--;
        }
        if (this.jumpCount <= -this.limitJumpCount - 1) {
            this.jumpCount = this.limitJumpCount;
            this.updateJumpCount();
            this.jumping = false;
        }
        this.width = this.currentImg.width * scl;
        this.height = this.currentImg.height * scl;
        this.imgCount += ground.speed / 20;
        this.imgCount = this.imgCount % (this.imgs.length - 1);
        this.pos.y = min(this.pos.y, ground.pos.y - this.height);
        this.score += 0.3;
    }
    this.updateJumpCount = () => {
        this.limitJumpCount = this.pJumpCount;
    }
    this.checkCollision = () => {
        for (let i = 0; i < ground.cacti.length; i++) {
            let cacti = ground.cacti[i];
            if (this.collide(this.pos.x, this.pos.y, this.width, this.height, cacti.pos.x, cacti.pos.y, cacti.w, cacti.h)) {
                displayRestart();
                this.hasLost = true;
                noLoop();
            }
        }
    }
    this.collide = (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) => {
        return (r1x < r2x + r2w && r1x + r1w > r2x && r1y < r2y + r2h && r1y + r1h > r2y);
    }
}

function displayRestart() {
    textSize(map(width, 256, displayWidth, 20, 64));
    let w = textWidth("Click to Restart");
    let h = textAscent() + textDescent();
    text("Click to Restart", width / 2 - w / 2, height / 2 + h / 2);
}