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

let mouseSensitivity = 0.002;

let Mouse = {
    X: 0,
    Y: 0,
    LDown: false,
    RDown: false
};

document.addEventListener("mousemove", (e) => {
    Player.ry -= e.movementX * mouseSensitivity;
    Player.rx -= e.movementY * mouseSensitivity;

    // Optional: clamp vertical rotation to prevent gimbal lock
    Player.rx = Math.max(Math.min(Player.rx, Math.PI / 2), -Math.PI / 2);
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

const Keys = new Set();
document.addEventListener("keydown", (e) => {
    Keys.add(e.key); // Correct property 'key'
});
document.addEventListener("keyup", (e) => {
    Keys.delete(e.key); // Correct property 'key'
});

let FOV = 360;

function Convert(x, y, z) {
    // Translate world position relative to camera
    let dx = x - Player.x;
    let dy = y - Player.y;
    let dz = z - Player.z;

    // Rotation using combined matrix (yaw, pitch)
    let cosY = Math.cos(Player.ry), sinY = Math.sin(Player.ry);
    let cosX = Math.cos(Player.rx), sinX = Math.sin(Player.rx);

    // Rotate around Y axis (yaw)
    let x1 = dx * cosY - dz * sinY;
    let z1 = dx * sinY + dz * cosY;

    // Rotate around X axis (pitch)
    let y1 = dy * cosX - z1 * sinX;
    let z2 = dy * sinX + z1 * cosX;

    // Prevent near-zero z-values (camera clipping)
    if (z2 <= 0.1) z2 = 0.1;

    // Perspective projection
    return {
        x: (-x1 / z2) * FOV + innerWidth / 2,
        y: (-y1 / z2) * FOV + innerHeight / 2,
        size: (1 / z2) * FOV
    };
}


function GetKey(e) {
    return Keys.has(e.key) ? 1 : 0;
}

class Cam {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.rx = 0;
        this.ry = 0;
        this.rz = 0;
    }

    Update() {
        const speed = 0.5;

        // Movement direction vectors
        let forwardX = Math.sin(this.ry);
        let forwardZ = Math.cos(this.ry);
        let rightX = Math.cos(this.ry);
        let rightZ = -Math.sin(this.ry);

        // Forward / Backward
        if (Keys.has("w")) {
            this.x += forwardX * speed;
            this.z += forwardZ * speed;
        }
        if (Keys.has("s")) {
            this.x -= forwardX * speed;
            this.z -= forwardZ * speed;
        }

        // Left / Right
        if (Keys.has("a")) {
            this.x += rightX * speed;
            this.z += rightZ * speed;
        }
        if (Keys.has("d")) {
            this.x -= rightX * speed;
            this.z -= rightZ * speed;
        }

        // Up / Down
        if (Keys.has("q")) this.y -= speed;
        if (Keys.has("e")) this.y += speed;
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
        //this.x += Math.random() * 20 - 10;
        //this.y += Math.random() * 20 - 10;
        
        if (this.z <= 0) {
            this.z = 0.1; // Reset z if it gets too close
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
            points.push(new Point(k, j, i)); // Fix: Directly use k for x, and j for y (avoid division)
        }
    }
}

function Frame() {
    Ctx.clearRect(0, 0, innerWidth, innerHeight);
    Ctx.fillStyle = "black";
    Ctx.fillRect(0, 0, innerWidth, innerHeight);

    Player.Update(); // Movement

    points.sort((a, b) => {
        const distA = (a.x - Player.x) ** 2 + (a.y - Player.y) ** 2 + (a.z - Player.z) ** 2;
        const distB = (b.x - Player.x) ** 2 + (b.y - Player.y) ** 2 + (b.z - Player.z) ** 2;
    
        return distB - distA; // Sort ascending: closest first
    });
    
    for (let point of points) {
        point.Update();
        point.Draw();
    }

    Ctx.fillStyle = "white";
    Ctx.fillText(`Mouse X: ${Mouse.X} Y: ${Mouse.Y}`, 10, 20);

    requestAnimationFrame(Frame);
}
