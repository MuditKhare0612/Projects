let sketch = p => {
    let mainScr;
    let ellipse;
    let pointManager;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        mainScr = p.createGraphics(p.width, p.height);
        pointManager = new PointManager();
        ellipse = new Ellipse(p, p.width / 2, p.height / 2, 300, 200, pointManager);
    }
    p.draw = () => {
        mainScr.background(60);
        ellipse.draw(mainScr);
        pointManager.update(p, mainScr, ellipse);
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        pointManager.add(p);
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

function Ellipse(p, x, y, w, h, pointManager) {
    this.pos = p.createVector(x, y);
    this.size = p.createVector(w, h);
    this.foci = [];
    this.calculateFoci(p, pointManager);
}
Ellipse.prototype.calculateFoci = function(p, pointManager) {
    let dist = (this.size.x ** 2 - this.size.y ** 2) ** (1 / 2);
    let foci1 = this.pos.x - dist / 2;
    let foci2 = this.pos.x + dist / 2;
    this.foci.push(foci1, foci2);
    for (let focus of this.foci) {
        for (let i = 0; i < 1; i++) {
            pointManager.add(p, foci1, this.pos.y);
        }
    }
}
Ellipse.prototype.drawFoci = function(scr) {
    scr.strokeWeight(4);
    for (let focusX of this.foci) {
        scr.point(focusX, this.pos.y);
    }
}
Ellipse.prototype.draw = function(scr) {
    scr.noFill();
    scr.stroke(0);
    scr.strokeWeight(1);
    scr.ellipse(this.pos.x, this.pos.y, this.size.x, this.size.y);
    this.drawFoci(scr);
}

function Point(p, x, y) {
    this.pos = p.createVector(x, y);
    this.maxVel = 5;
    this.vel = p5.Vector.random2D().mult(this.maxVel);
    this.gravity = 0.1;
    this.radius = 2.5;
}
Point.prototype.move = function(p) {
    let dtVal = p.deltaTime * this.TARGET_FRAMERATE / 1000;
    // this.vel.y += this.gravity * dtVal;
    this.pos.add(this.vel);
}
Point.prototype.update = function(p, ellipse) {
    this.move(p);
    this.collideHandle(p, ellipse);
}
Point.prototype.draw = function(scr) {
    scr.strokeWeight(this.radius);
    scr.point(this.pos.x, this.pos.y);
}
Point.prototype.applyImpulse = function(normal) {
    this.vel.sub(normal.mult(2 * this.vel.dot(normal)));
}
Point.prototype.collideHandle = function(p, ellipse) {
    if (!collideEllipsePoint(this.pos.x, this.pos.y, ellipse.pos.x, ellipse.pos.y, ellipse.size.x / 2, ellipse.size.y / 2)) {
        let v1 = [this.pos.x - ellipse.foci[0], this.pos.y - ellipse.pos.y];
        let d1 = p.dist(0, 0, v1[0], v1[1]);
        v1[0] /= d1;
        v1[1] /= d1;
        let v2 = [this.pos.x - ellipse.foci[1], this.pos.y - ellipse.pos.y];
        let d2 = p.dist(0, 0, v2[0], v2[1]);
        v2[0] /= d2;
        v2[1] /= d2;
        let tanNorm = p.createVector(v1[0] + v2[0], v1[1] + v2[1]).normalize();
        this.applyImpulse(tanNorm);
    }
}
Point.prototype.TARGET_FRAMERATE = 60;

function PointManager() {
    this.points = [];
}
PointManager.prototype.update = function(p, scr, ellipse) {
    for (let point of this.points) {
        point.update(p, ellipse);
        point.draw(scr);
    }
}
PointManager.prototype.add = function(p, x = null, y = null) {
    this.points.push(new Point(p, x ? x : p.mouseX, y ? y : p.mouseY));
}

window.addEventListener("pagehide", () => {
    sketchInstance.cleanup();
    sketchInstance.remove();
})