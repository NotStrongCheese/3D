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

let Mouse = {
    X: 0,
    Y: 0,
    LDown: false,
    RDown: false
};

let FOV = Math.PI / 4; // Field of view in radians

class Camera {
    constructor(x, y, z, xrot, yrot, zrot) {
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.XRot = xrot;
        this.YRot = yrot;
        this.ZRot = zrot;
        this.rx = (1 / Math.tan(FOV / 2)) * (innerWidth / innerHeight);
        this.ry = (1 / Math.tan(FOV / 2));
        this.rz = 1;
    }

    Move(x, y, z) {
        this.X += x;
        this.Y += y;
        this.Z += z;
    }

    Rotate(x, y, z) {
        this.XRot += x;
        this.YRot += y;
        this.ZRot += z;
    }
    
}

class Dot {
    constructor(x, y, z) {
        this.X = x;
        this.Y = y;
        this.Z = z;
        
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;

        this.rx = (1 / Math.tan(FOV / 2)) * (innerWidth / innerHeight);
        this.ry = (1 / Math.tan(FOV / 2));
        this.rz = 1;

        this.u = 0;
        this.v = 0;

    }

    Convert() {
        this.dx = Math.cos(this.y) * (Math.sin(this.z) * this.y + Math.cos(this.z) * this.x) - Math.sin(this.y) * this.z;
        this.dy = Math.sin(this.x) * (Math.cos(this.y) * this.z + Math.sin(this.y) * (Math.sin(this.z) * this.y + Math.cos(this.z) * this.x)) + Math.cos(this.x) * (Math.cos(this.z) * this.y - Math.sin(this.z) * this.x);
        this.dz = Math.cos(this.x) * (Math.cos(this.y) * this.z + Math.sin(this.y) * (Math.sin(this.z) * this.y + Math.cos(this.z) * this.x)) - Math.sin(this.x) * (Math.cos(this.z) * this.y - Math.sin(this.z) * this.x);
    
        this.u = (this.dx * innerWidth) / (this.dz * this.rx) * this.rz;
        this.v = (this.dy * innerHeight) / (this.dz * this.ry) * this.rz;

    }
    Draw() {
        Ctx.fillStyle = "white";
        Ctx.ellipse(this.x, this.y, 5, 5, 0, 0, Math.PI * 2);
    }
}

function Frame() {
    Ctx.clearRect(0, 0, innerWidth, innerHeight);  // Corrected canvas dimensions

    Ctx.fillStyle = "black";
    Ctx.fillRect(0, 0, innerWidth, innerHeight);  // Corrected canvas dimensions

    Ctx.fillStyle = "white"; 
    Ctx.fillText("Mouse X: " + Mouse.X + " Y: " + Mouse.Y, 10, 10);

    new Dot(5, 0, 5) {
        this.Convert();
        this.Draw();
    };

    requestAnimationFrame(Frame);
}
