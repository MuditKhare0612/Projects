let texts = [];
let userText = "";
let inputEl = document.getElementById("animatetext");
inputEl.addEventListener("input", () => {
    texts.forEach(txt => {
        txt.dispose();
    });
    texts = [];
    userText = inputEl.value
    DrawText(userText);
})
let size = 30;
let sizeEl = document.getElementById("size");
sizeEl.addEventListener("input", () => {
    size = parseInt(sizeEl.value);
    texts.forEach(txt => {
        txt.dispose();
    });
    texts = [];
    DrawText(userText);
})
function setup() {
    createCanvas(window.innerWidth, window.innerHeight - 4);
    DrawText(userText);
}
function draw() {
    background(60);
    for (let i = 0; i < texts.length; i++) {
        let txt = texts[i];
        txt.update();
    }
}

function DrawText(txt, pos = null) {
    let textArray = txt.split(" ");
    let options = {
        size: size,
        amplitude: 100,
        speed: 0.03,
        start: 0,
    }
    push();
    textSize(32);
    let spaceWidth = textWidth("  ");
    pop();
    let totalWidth = 0, h;
    if (!pos) {
        for (let i = 0; i < textArray.length; i++) {
            let word = textArray[i];
            push();
            textSize(options.size);
            let w = textWidth(word);
            h = textAscent() + textDescent();
            pop();
            totalWidth += w;
        }
    }
    else {
        x = pos.x;
    }
    let y = height / 2 - h / 2;
    totalWidth += (textArray.length-1) * spaceWidth;
    let x = width / 2 - totalWidth / 2;
    let angle = 0;
    let angleChange = Math.PI * 2 / textArray.length;
    
    for (let i = 0; i < textArray.length; i++) {
        let word = textArray[i];
        push();
        textSize(options.size);
        let w = textWidth(word);
        pop();
        options.start = angle;
        texts.push(new AnimatedText(createVector(x, y), word, options));
        x += w + spaceWidth;
        angle += angleChange;
    }
}

function Animated(pos, amplitude = 50, speed = .01, start = 0) {
    this.pos = pos;
    this.startPos = pos.copy();
    this.amplitude = amplitude;
    this.speed = speed;
    this.angle = start;

    this.move = () => {
        this.pos.y = this.startPos.y + Math.sin(this.angle) * this.amplitude;
        this.angle += this.speed;
    }
}

function AnimatedText(pos, txt = "", options = {}) {
    this.options = options;
    Animated.call(this, pos, this.options.amplitude ?? 50, this.options.speed ?? .01, this.options.start ?? 0);
    this.txt = txt;
    this.draw = () => {
        push();
        fill(this.options.color ?? 255);
        this.options.isStroke ?? noStroke();
        strokeWeight(this.options.thickness ?? 1);
        textSize(this.options.size ?? 12);
        text(this.txt, this.pos.x, this.pos.y, this.options.maxWidth ?? Infinity, this.options.maxHeight ?? Infinity);
        pop();
    }
    this.update = () => {
        this.move();
        this.draw();
    }
    this.dispose = () => {
        for (let prop in this){
            if (this.hasOwnProperty(prop)) this[prop] = null;
        }
    }
}