let sketch = p => {
    let mainScr;
    let rectManager;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        mainScr = p.createGraphics(p.width, p.height);
        mainScr.rectMode(p.CENTER);
        rectManager = new RectManager(p, mainScr);
    }
    p.draw = () => {
        mainScr.background(60);
        rectManager.update();
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        rectManager.mousePressed();
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

function RectManager(p, scr) {
    this.p = p;
    this.scr = scr;
    this.rects = [];
}
RectManager.prototype.add = function(pos, size, color) {
    this.rects.push(new Rect(this.p, this.scr, pos, size, color));
}
RectManager.prototype.draw = function() {
    for (let rect of this.rects) {
        rect.draw();
    }
}
RectManager.prototype.mousePressed = function() {
    if (this.p.mouseButton === "left") {
        let hit = false;
        for (let i = this.rects.length - 1; i >= 0; i--) {
            let rect = this.rects[i];
            if (collidePointRect(this.p.mouseX, this.p.mouseY, rect.pos.x, rect.pos.y, rect.size.x, rect.size.y, 0) && !rect.hasDestroyed) {
                rect.destroy(this);
                hit = true;
                break;
            }
        }
        if (!hit) {
            this.add(this.p.createVector(this.p.mouseX, this.p.mouseY), this.p.createVector(this.p.random(50, 100), this.p.random(50, 100)), [this.p.random(100, 255), this.p.random(100, 255), this.p.random(100, 255)])
        }
    }
    
}
RectManager.prototype.update = function() {
    for (let i = this.rects.length - 1; i >= 0; i--) {
        let rect = this.rects[i];
        if (!rect.particles.length && rect.hasDestroyed) {
            rect.dispose();
            this.rects.splice(i, 1);
        } else {
            rect.updateParticles();
        }
    }
    this.draw();
}

function Rect(p, scr, pos, size, color) {
    this.p = p;
    this.scr = scr;
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.hasDestroyed = false;
    this.particles = [];
    this.particleCount = 100;
    this.particleOpacityVel = -5;
    this.particleGravity = 0.2;
}
Rect.prototype.draw = function() {
    if (!this.hasDestroyed) {
        this.scr.stroke(0);
        this.scr.fill(this.color);
        this.scr.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    } else if(this.particles.length) {
        for (let particle of this.particles) {
            this.scr.fill([...this.color, particle.opacity]);
            this.scr.noStroke();
            this.scr.circle(particle.pos.x, particle.pos.y, particle.radius);
        }
    }
}
Rect.prototype.destroy = function() {
    if (this.hasDestroyed) return;
    this.hasDestroyed = true;
    for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
            pos: this.p.createVector(this.p.random(this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2), this.p.random(this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2)),
            radius: 2,
            vel: p5.Vector.fromAngle(this.p.random(this.p.PI * 2)).setMag(this.p.random(1, 5)),
            opacity: 255,
        })
    }
}
Rect.prototype.dispose = function() {
    for (let prop in this) {
        this[prop] = null;
    }
}
Rect.prototype.updateParticles = function() {
    if (this.particles.length && this.hasDestroyed) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.pos.add(particle.vel);
            particle.vel.y += this.particleGravity;
            particle.opacity += this.particleOpacityVel;
            if (particle.opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}
window.addEventListener("pagehide", () => {
    sketchInstance.cleanup();
    sketchInstance.remove();
})