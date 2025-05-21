/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let Ctx;

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    Ctx = canvas.getContext("2d");

    canvas.width = innerWidth;  // Correct property for width
    canvas.height = innerHeight;  // Correct property for height

    Frame();
});

window.addEventListener("resize", () => {
    canvas.width = innerWidth;  // Correct property for width
    canvas.height = innerHeight;  // Correct property for height
});

document.addEventListener("mousemove", (e) => {
    Mouse.X = e.clientX;
    Mouse.Y = e.clientY;
});

document.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        Mouse.LDown = true;
    } else if (e.button == 2) {
        Mouse.RDown = true;
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        Mouse.LDown = false;
    } else if (e.button == 2) {
        Mouse.RDown = false;
    }
});

const keys = new Set();
document.addEventListener("keydown", (e) => {
    keys.add(e.key);
});
document.addEventListener("keyup", (e) => {
    keys.delete(e.key);
});

let Mouse = {
    X: 0,
    Y: 0,
    LDown: false,
    RDown: false
};

let FOV = 30;

function Convert(x, y, z) {
    return {
        x: ((x - Player.x) / (z - Player.z)) * FOV + innerWidth / 2,
        y: ((y - Player.y) / (z - Player.z)) * FOV + innerHeight / 2,
        size: (1 / (z - Player.z)) * FOV
    }
}

function keydown(e) {
    if (keys.has(e.key)) {
        return 1;
    }else{
        return 0;
    }
}

class Cam {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.rx;
        this.ry;
        this.rz;
    }

    Update() {
        this.x;// Button for left right and left right camera
        this.y;// button for forward backward and left right camera
        this.z;// button for up down

        this.rx;// mouse movement
        this.ry;// mouse movement
        this.rz;// mouse movement
    }
}

let Player = new Cam(0, 0, 0);

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.u = 0;
        this.v = 0;
        this.size = 1;
        this.speed = Math.random() * 0.02 + 0.01; // Speed of movement for each point
    }

    Update() {
        this.x += Math.random() * 2 - 1;
        this.y += Math.random() * 2 - 1;
        

        if (this.z <= 0) {
            this.z = 1; // Reset z if it gets too close
        }

        let converted = Convert(this.x, this.y, this.z);
        this.u = converted.x;
        this.v = converted.y;
        this.size = converted.size;
    }

    Draw() {
        Ctx.fillStyle = `rgb(${(15 - this.z) * 255 / 15}, ${(20 - this.z) * 255 / 20}, ${(15 - this.z) * 255 / 15})`; // Color based on z and size
        Ctx.beginPath();
        Ctx.ellipse(this.u, this.v, this.size, this.size, 0, 0, Math.PI * 2);
        Ctx.fill();
    }
}

let points = [];

for (let i = 15; i > 5; i -= 0.5) {
    for (let j = -50; j < 50; j += 5) {
        for (let k = -50; k < 50; k += 5) {
            points.push(new Point(k / Math.random(), j * Math.random(), i)); // Random starting z for depth effect
        }
    }
}

function Frame() {
    Ctx.clearRect(0, 0, innerWidth, innerHeight);  // Corrected canvas dimensions

    Ctx.fillStyle = "black";
    Ctx.fillRect(0, 0, innerWidth, innerHeight);  // Corrected canvas dimensions

    for (let point of points) {
        point.Update();
        point.Draw();
    }

    Ctx.fillStyle = "white"; 
    Ctx.fillText("Mouse X: " + Mouse.X + " Y: " + Mouse.Y, 10, 10);

    requestAnimationFrame(Frame);
}
