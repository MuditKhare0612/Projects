
let rectangle;

function setup() {
    createCanvas(innerWidth, innerHeight - 4);
    rectangle = new Rect();
}

function draw() {
    background(0);
    rectangle.update();
}

function Rect() {
    this.pos = createVector(width / 2, height / 2);
    this.size = createVector(100, 100);
    this.gravityDir = createVector(0, 1);
    this.vel = createVector(0, 0);
    this.move = () => {
        let signRotY = rotationY / abs(rotationY) || 1;
        let gScalarX = abs(rotationX - Math.PI / 2) * signRotY;
        this.gravityDir.x = map(gScalarX, -Math.PI / 2, Math.PI / 2, -1, 1);
        this.gravityDir.y = map(rotationX, -Math.PI / 2, Math.PI / 2, -1, 1);
        this.gravity = 9.8/frameRate();
        this.vel.x += this.gravityDir.x * this.gravity;
        this.vel.y += this.gravityDir.y * this.gravity;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.x = constrain(this.pos.x, 0, width - this.size.x);
        this.pos.y = constrain(this.pos.y, 0, height - this.size.y);
        if (this.pos.x === 0 || this.pos.x === width - this.size.x) {
            this.vel.x = 0;
        }
        if (this.pos.y <= 0 || this.pos.y >= height - this.size.y){
            this.vel.y = 0;
        }
    }
    this.draw = () => {
        fill([0, 255, 0]);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
    this.update = () => {
        this.move();
        this.draw();
    }
}
