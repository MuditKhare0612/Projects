let objects = [];
window.setup = () => {
    createCanvas(innerWidth, innerHeight - 4);
};
window.draw = () => {
    background(0);
    stroke(255);
    strokeWeight(2);
    noFill();
    for (let i = objects.length - 1; i >= 0; i--) {
        let object = objects[i];
        beginShape();
        for (let k = 0; k < object.length; k++) {
            let pos = object[k];
            vertex(pos.x, pos.y);
        }
        endShape();
    }
};

window.windowResized = () => {
    resizeCanvas(innerWidth, innerHeight - 4);
};

window.mousePressed = () => {
    if (mouseButton === LEFT) {
        objects.push([{ x: mouseX, y: mouseY }]);
    }
};

window.mouseDragged = () => {
    if (mouseButton === LEFT) {
        objects[objects.length - 1].push({ x: mouseX, y: mouseY });
    }
};
window.mouseReleased = () => {
    if (mouseButton === LEFT) {
        objects.push([]);
    }
}
window.onbeforeunload = () => {
    remove();
};

