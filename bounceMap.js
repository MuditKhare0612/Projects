let sketch = p => {
    let mainScr;
    let lineManager;
    let ball;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        mainScr = p.createGraphics(p.width, p.height);
        lineManager = new LineManager(p, mainScr);
        ball = new Ball(p, mainScr, lineManager, p.createVector(p.width / 2, 100), 20);
        p.ball = ball;
    }
    p.draw = () => {
        mainScr.background(0);
        ball.update();
        lineManager.update();
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        lineManager.mousePressed(ball);
        if (p.mouseButton === "center") lineManager.endDeveloping();
    }
    p.mouseMoved = () => {
        lineManager.mouseMoved(ball);
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

function LineManager(p, scr) {
    this.p = p;
    this.scr = scr;
    this.currentLineStart = null;
    this.currentLineEnd = null;
    this.isDeveloping = true;
    this.lines = [];
}
LineManager.prototype.add = function(start, end) {
    this.lines.push(new Line(this.p, this.scr, start, end));
}
LineManager.prototype.drawCurrentLine = function() {
    if (this.currentLineStart && this.currentLineEnd) {
        this.scr.stroke(255);
        this.scr.line(this.currentLineStart.x, this.currentLineStart.y, this.currentLineEnd.x, this.currentLineEnd.y);
    }
}
LineManager.prototype.update = function() {
    this.drawCurrentLine();
    for (let line of this.lines) {
        line.draw();
    }
}
LineManager.prototype.mousePressed = function(ball) {
    if (!ball.enabled && this.isDeveloping) {
        if (this.currentLineStart) {
            this.add(this.currentLineStart.copy(), this.currentLineEnd.copy());
        }
        this.currentLineStart = this.p.createVector();
        this.currentLineEnd = this.p.createVector();
        this.currentLineStart.x = this.p.mouseX;
        this.currentLineStart.y = this.p.mouseY;
        this.currentLineEnd.x = this.p.mouseX;
        this.currentLineEnd.y = this.p.mouseY;
    }
}
LineManager.prototype.mouseMoved = function(ball) {
    if (!ball.enabled && this.currentLineStart && this.isDeveloping) {
        if (!this.currentLineEnd) this.currentLineEnd = this.p.createVector();
        this.currentLineEnd.x = this.p.mouseX;
        this.currentLineEnd.y = this.p.mouseY;
    }
}
LineManager.prototype.endDeveloping = function() {
    this.isDeveloping = false;
}
function Line(p, scr, start, end) {
    this.p = p;
    this.scr = scr;
    this.start = start;
    this.end = end;
    this.dir = p5.Vector.sub(this.end, this.start);
    this.normal1 = this.p.createVector(-this.dir.y, this.dir.x).normalize();
    this.normal2 = this.p.createVector(this.dir.y, -this.dir.x).normalize();
}
Line.prototype.draw = function() {
    this.scr.stroke(255);
    this.scr.strokeWeight(2);
    this.scr.line(this.start.x, this.start.y, this.end.x, this.end.y);
    this.scr.stroke(255, 0, 0);
}

function Ball(p, scr, lineManager, pos, radius) {
    this.p = p;
    this.scr = scr;
    this.lineManager = lineManager;
    this.pos = pos
    this.radius = radius;
    this.maxVel = 5;
    this.vel = p5.Vector.fromAngle(this.p.PI / 2).setMag(this.maxVel);
    this.targetFrameRate = 60;
    this.gravity = 0.2;
    this.enabled = false;
    this.restitution = 1.005;
}
Ball.prototype.move = function() {
    if (!this.enabled) return;
    this.vel.y += this.gravity;
    let dtFactor = this.p.deltaTime / 1000 * this.targetFrameRate
    this.pos.x += this.vel.x * dtFactor;
    this.pos.y += this.vel.y * dtFactor;
}
Ball.prototype.draw = function() {
    this.scr.fill(0, 255, 0);
    this.scr.noStroke();
    this.scr.circle(this.pos.x, this.pos.y, this.radius * 2);  
}
Ball.prototype.checkCollision = function() {
    if (!this.enabled) return;
    for (let line of this.lineManager.lines) {
        let collision = collideLineCircle(line.start.x, line.start.y, line.end.x, line.end.y, this.pos.x + this.vel.x, this.pos.y + this.vel.y, this.radius);
        if (collision) {
            let velNorm = this.vel.copy();
            let normal;
            if (line.normal1.copy().dot(velNorm.normalize()) < 0) {
                normal = line.normal1;
            } else {
                normal = line.normal2;
            }
            let vel = this.vel.copy();
            normal = normal.copy().normalize();
            let dot = p5.Vector.dot(vel, normal);
            this.vel = p5.Vector.sub(
                vel,
                normal.mult(2 * dot)
            ).mult(this.restitution);
            if (this.vel.mag() < this.maxVel) {
                this.vel.setMag(this.maxVel);
            }
            if (this.vel.mag() > 3 * this.maxVel) {
                this.vel.setMag(3 * this.maxVel);
            }
        }
    }
}
Ball.prototype.start = function() {
    this.enabled = true;
}
Ball.prototype.update = function() {
    this.move();
    for (let i = 0; i < 5; i++) {
        this.checkCollision();
    }
    this.draw();
}
window.addEventListener("pagehide", () => {
    sketchInstance.cleanup();
    sketchInstance.remove();
})
let enableButton = document.getElementsByClassName("enableButton")[0];
enableButton.addEventListener("click", () => {
    sketchInstance.ball.start();
})