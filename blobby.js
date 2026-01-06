let mainScr;
let blobs = [];
window.setup = () => {
    createCanvas(innerWidth, innerHeight);
    mainScr = createGraphics(innerWidth, innerHeight);
}

window.draw = () => {
    mainScr.background(60);
    for (let blob of blobs) {
        blob.draw();
    }
    image(mainScr, 0, 0);
}

window.mouseDragged = () => {
    new Blob(createVector(mouseX, mouseY), random(30, 100));
}

function Blob(pos, radius) {
    this.pos = pos;
    this.radius = radius;
    this.angle = 0;
    this.vertices = [];
    this.factor = 0.1;
    let xoff = random(1000);
    for (this.angle = 0; this.angle < 360; this.angle += 1) {
        let offset = map(noise(xoff), 0, 1, -25, 25);
        let radius = this.radius + offset;
        let x = radius * cos(radians(this.angle));
        let y = radius * sin(radians(this.angle));
        this.vertices.push(createVector(x, y));
        xoff += 0.01;
    }
    this.draw = () => {
        mainScr.push();
        mainScr.translate(this.pos.x, this.pos.y);
        mainScr.beginShape();
        mainScr.fill(255);
        for (let pos of this.vertices) {
            mainScr.vertex(pos.x, pos.y);
        }
        mainScr.endShape();
        mainScr.pop();
    }
    blobs.push(this);
}   