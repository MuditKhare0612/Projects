let sketch = p => {
    let mainScr;
    let system;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        mainScr = p.createGraphics(p.width, p.height);
        system = new System(p);
    }
    p.draw = () => {
        mainScr.background(255);
        system.update(p);
        system.draw(p, mainScr);
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        system.mousePressed(p);
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

function System(p) {
    this.pointRad = 20;
    this.reset(p);
}
System.prototype.reset = function(p) {
    this.points = [];
    this.currentPos = [p.mouseX, p.mouseY];
    this.pointPos = [...this.currentPos];
    this.selected = false;
    this.start = false;
    this.t = 0;
}
System.prototype.draw = function(p, scr) {
    scr.fill(0, 0, 0, 50);
    scr.stroke(0);
    scr.strokeWeight(2);
    scr.circle(this.pointPos[0], this.pointPos[1], this.pointRad);
    scr.noFill();
    this.drawCurve(scr);
}
System.prototype.drawCurve = function(scr) {
    if (!this.points.length) return;
    scr.beginShape();
    let first = this.points[0];
    let second = this.points[1];
    let third = this.points[2] ? this.points[2] : this.currentPos;


    scr.vertex(first[0], first[1]);
    if (!this.start) {
        if (this.points.length === 1) {
            scr.vertex(this.currentPos[0], this.currentPos[1]);
        }
    }
    if (this.points.length > 1) {
        let cpx = 2 * second[0] - 0.5 * first[0] - 0.5 * third[0];
        let cpy = 2 * second[1] - 0.5 * first[1] - 0.5 * third[1];
        scr.quadraticVertex(cpx, cpy, third[0], third[1]);
    }

    scr.endShape();
}
System.prototype.updatePointPos = function() {
    this.pointPos = [...this.currentPos];
}
System.prototype.update = function(p) {
    this.currentPos = [p.mouseX, p.mouseY];
    if (!this.selected) {
        this.updatePointPos();
    }
    if (this.start) {
        this.t += 0.01;
        this.pointPos = this.calculatePoint();
        if (this.t >= 1) {
            this.reset(p);
        }
    }
}
System.prototype.calculatePoint = function() {
    let px = [this.points[0][0], this.points[1][0], this.points[2][0]];
    let py = [this.points[0][1], this.points[1][1], this.points[2][1]];
    let x = (1 - this.t) ** 2 * px[0] + 2 * (1 - this.t) * this.t * (2 * px[1] - .5 * px[0] - .5 * px[2]) + this.t ** 2 * px[2];
    let y = (1 - this.t) ** 2 * py[0] + 2 * (1 - this.t) * this.t * (2 * py[1] - .5 * py[0] - .5 * py[2]) + this.t ** 2 * py[2];
    return [x, y];
}
System.prototype.mousePressed = function(p) {
    if (p.mouseButton !== "left") return;
    if (!this.selected) {
        this.selected = true;
        this.updatePointPos();
    }
    if (!this.start) {
        this.points.push(this.currentPos);
    }
    if (this.points.length > 2) {
        this.start = true;
    }
}

window.addEventListener("pagehide", () => {
    sketchInstance.cleanup();
    sketchInstance.remove();
})