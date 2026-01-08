let mainScr;
let mainRect;
let balls = [];
let rectSize = [400, 400];
window.setup = () => {
    createCanvas(innerWidth, innerHeight);
    mainScr = createGraphics(innerWidth, innerHeight);
    if (width < rectSize[0]) rectSize[0] = width;
    if (height < rectSize[1]) rectSize[1] = height;
    mainRect = new Rect([width / 2 - rectSize[0] / 2, height / 2 - rectSize[1] / 2], rectSize)
    for (let i = 0; i < 5; i++) {
        new Ball([random(mainRect.pos.x + 30, mainRect.pos.x + mainRect.size.x - 30), random(mainRect.pos.y + 30, mainRect.pos.y + mainRect.size.y - 30)], 30, [random(50, 255), random(50, 255), random(50, 255)]);
    }
}

window.draw = () => {
    mainScr.background(60);
    mainRect.draw();
    for (let ball of balls) {
        ball.update();
    }
    image(mainScr, 0, 0);
}

window.windowResized = () => {
    resizeCanvas(innerWidth, innerHeight);
    if (width < rectSize[0]) rectSize[0] = width;
    else rectSize[0] = 400;
    if (height < rectSize[1]) rectSize[1] = height;
    else rectSize[1] = 400;
    mainRect.pos.x = width / 2 - rectSize[0] / 2;
    mainRect.pos.y = height / 2 - rectSize[1] / 2;
    mainRect.size.x = rectSize[0];
    mainRect.size.y = rectSize[1];
}

function Rect(pos, size) {
    this.pos = createVector(pos[0], pos[1]);
    this.size = createVector(size[0], size[1]);
    this.draw = () => {
        mainScr.stroke(255);
        mainScr.strokeWeight(3);
        mainScr.noFill();
        mainScr.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}

function Ball(pos, radius, color) {
    this.pos = createVector(pos[0], pos[1]);
    this.radius = radius;
    this.color = color;
    this.maxVel = 4;
    this.trail = [];
    this.vel = p5.Vector.fromAngle(random(2 * PI)).mult(this.maxVel);
    this.targetFrameRate = 60;
    this.draw = () => {
        mainScr.noStroke()
        mainScr.fill(color);
        this.drawTrail();
        mainScr.stroke(0);
        mainScr.circle(this.pos.x, this.pos.y, this.radius * 2);
    }
    this.move = () => {
        this.vel.mult(deltaTime * this.targetFrameRate / 1000);
        this.pos.add(this.vel);
        if (this.pos.x + this.vel.x < mainRect.pos.x + this.radius || this.pos.x + this.vel.x > mainRect.pos.x + mainRect.size.x - this.radius) {
            this.vel.x *= -1;
        }
        if (this.pos.y + this.vel.y < mainRect.pos.y + this.radius || this.pos.y + this.vel.y > mainRect.pos.y + mainRect.size.y - this.radius) {
            this.vel.y *= -1;
        }
    }
    this.spawnTrail = () => {
        this.trail.push({
            pos: this.pos.copy(),
            radius: this.radius,
        })
    }
    this.drawTrail = () => {
        for (let trailBall of this.trail) {
            mainScr.circle(trailBall.pos.x, trailBall.pos.y, trailBall.radius * 2);
        }
    }
    this.updateTrail = () => {
        for (let i = this.trail.length - 1; i >= 0; i--) {
            let trailBall = this.trail[i];
            trailBall.radius--;
            if (trailBall.radius <= 0) this.trail.splice(i, 1);
        }
    }
    this.handleCollision = () => {
        for (let ball of balls) {
            if (ball === this) continue;
            let diff = p5.Vector.sub(this.pos, ball.pos);
            let distance = diff.mag();
            let mindistance = this.radius + ball.radius;
            if (distance <= mindistance) {
                let normal = diff.normalize();
                let overlap = mindistance - distance;
                let correction = normal.copy().mult(overlap / 2);
                this.pos.add(correction);
                ball.pos.sub(correction);
                let relVel = p5.Vector.sub(this.vel, ball.vel);
                let speed = relVel.dot(normal);
                if (speed > 0) continue;
                let impulse = normal.copy().mult(speed);
                this.vel.sub(impulse).setMag(this.maxVel);
                ball.vel.add(impulse).setMag(ball.maxVel);
            }
        }
    }
    this.update = () => {
        this.move();
        this.handleCollision();
        this.spawnTrail();
        this.updateTrail();
        this.draw();
    }
    balls.push(this);
}