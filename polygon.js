let sketch = p => {
    let mainScr;
    let polygon;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.angleMode(p.DEGREES);
        mainScr = p.createGraphics(p.width, p.height);
        polygon = new PolygonSystem(p, mainScr, p.createVector(p.width / 2, p.height / 2), 100);
    }
    p.draw = () => {
        mainScr.background(127);
        polygon.draw();
        p.image(mainScr, 0, 0);
    }
    p.mousePressed = () => {
        polygon.vertexCount++;
    }
    p.remove = () => {
        mainScr.remove();
        mainScr = null;
    }
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        mainScr.resizeCanvas(p.width, p.height);
    }
}

let sketchInstance = new p5(sketch);

function PolygonSystem(p, scr, center, radius) {
    this.p = p;
    this.scr = scr;
    this.center = center;
    this.radius = radius;
    this.vertexCount = 3;
    this.color = [0, 255, 0];
}
PolygonSystem.prototype.draw = function() {
    this.scr.fill(this.color);
    this.scr.beginShape();
    let dAngle = 360 / this.vertexCount;
    for (let i = 0; i < this.vertexCount; i++) {
        let x = this.radius * this.p.cos(dAngle * i) + this.center.x;
        let y = this.radius * this.p.sin(dAngle * i) + this.center.y;
        this.scr.vertex(x, y);
    }
    this.scr.endShape(this.p.CLOSE);
}
window.addEventListener("pagehide", () => {
    sketchInstance.remove();
})