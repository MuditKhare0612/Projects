let sketch = p => {
    let mainScr;
    let bgManager;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        mainScr = p.createGraphics(p.width, p.height);
        bgManager = new BackgroundManager(p, mainScr);
        bgManager.add();
    }
    p.draw = () => {
        bgManager.update();
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        bgManager.mousePressed();
    }
    p.cleanup = () => {
        if (mainScr) {
            mainScr.remove();
            mainScr = null;
        }
    }
    p.windowResized = () => {
        if (!mainScr) return;
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        mainScr.resizeCanvas(p.width, p.height);
    }
}

let sketchInstance = new p5(sketch);

function BackgroundManager(p, scr) {
    this.p = p;
    this.scr = scr;
    this.backgrounds = [];
    this.colorCounter = 0;
}
BackgroundManager.prototype.update = function(){
    for (let i = this.backgrounds.length - 1; i >= 0; i--) {
        let background = this.backgrounds[i];
        if (background.update()) this.backgrounds.splice(i, 1);
        background.draw();
    }
}
BackgroundManager.prototype.add = function() {
    if (this.backgrounds.length > 1) return;
    this.backgrounds.push(new Background(this.p, this.scr, this.colorCounter % 2 ? 0 : 255));
    if (this.backgrounds.length > 1) this.backgrounds[this.backgrounds.length - 2].destroy();
    this.colorCounter++;
}
BackgroundManager.prototype.mousePressed = function() {
    if (this.p.mouseButton === "left") this.add();
}
function Background(p, scr, color) {
    this.p = p;
    this.scr = scr;
    this.color = color;
    this.destroyed = false;
    this.scl = 50;
    this.rectSize = this.p.createVector(this.p.ceil(this.p.width / this.scl), this.p.ceil(this.p.height / this.scl));
    this.rects = [];
    this.shrinkVel = 3;
    this.dtFactor = 0;
    this.targetFrameRate = 60;
}
Background.prototype.draw = function() {
    if (!this.destroyed) {
        this.scr.background(this.color);
    } else {
        for (let i = 0; i < this.rects.length; i++) {
            let rect = this.rects[i];
            for (let j = 0; j < this.rectSize.y; j++) {
                this.scr.rectMode(this.p.CENTER);
                this.scr.noStroke();
                this.scr.fill(this.color);
                this.scr.rect(rect.index * this.scl + this.scl / 2, j * this.scl + this.scl / 2, rect.size, rect.size);
            }
        }
    }
}
Background.prototype.update = function() {
    this.dtFactor = this.p.deltaTime * this.targetFrameRate / 1000;
    if (this.destroyed) {
        for (let i = 0; i < this.rects.length; i++) {
            let rect = this.rects[i];
            if (i === 0 ||  (i - 1 >= 0 ? this.rects[i - 1].size < this.scl / 2 : true)) {
                rect.size -= this.shrinkVel * this.dtFactor;
            }
            if (rect.size < 0) {
                this.rects.splice(i, 1);
            }
        }
        if (!this.rects.length) {
            return true;
        }
    }
}
Background.prototype.destroy = function() {
    this.destroyed = true;
    for (let i = 0; i < this.rectSize.x; i++) {
        this.rects.push({
            x: i * this.scl,
            size: this.scl,
            index: i,
        })
    }
}
window.addEventListener("pagehide", () => {
    sketchInstance.cleanup();
    sketchInstance.remove();
})