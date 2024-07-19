const WIDTH = 1280;
const HEIGHT = 720;
const STEP = 10;


const canvas = document.getElementById("layer2");
heightRatio = 0.5
canvas.height = canvas.width * heightRatio;
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("layer1");
canvas2.height = canvas2.width * heightRatio;
const ctx2 = canvas2.getContext("2d");

const COL = 99
const ROW = 50
const COLORS = ["orange", "red", "purple", "green", "yellow", "white", "black"]

HOST = "localhost"
PORT = 8000

let ws = new WebSocket(`ws://${HOST}:${PORT}/ws`)

ws.onopen = function(event) {
    ws.send("open")
}

ws.onmessage = function(event) {
    console.log("Message from server ", event.data)
    data = JSON.parse(event.data)

    for (const pixel of data) {
        select_pixel = document.getElementById(`pixel_${pixel.y}_${pixel.x}`)
        select_pixel.style.background = COLORS[parseInt(pixel.color)]
    }
}


function spawnPixels() {
    field = document.getElementById("field");
    for (let i = 0; i <= ROW; i++) {
        for (let j = 0; j <= COL; j++) {
            new_pixel = document.createElement("div")
            new_pixel.className = `pixel`
            new_pixel.id = `pixel_${i}_${j}`
            new_pixel.addEventListener('click', function() {
                fill_pixel(this);
              });
            field.appendChild(new_pixel)
        }
    }
}

function spawPalette() {
    palette = document.getElementById("palette");
    for (const color in COLORS) {
        new_color = document.createElement("div")
        new_color.className = "palette_color"
        new_color.id = `palette_color_${color}`
        console.log(color)
        new_color.style.background = COLORS[color]
        new_color.onclick = function() {
            localStorage.setItem("select_color", color)
        }
        palette.appendChild(new_color)
    }
}



function draw() {
    ctx2.fillStyle = "rgb(220 220 220)";

    for (let i = 0; i < WIDTH; i+=STEP) {
        for (let j = 0; j < HEIGHT; j+=STEP) {
            ctx2.fillRect(i, j, STEP, STEP);
        }
        
    }
}

canvas.onmousemove = function(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - ((e.clientX - rect.left) % 10);
    let y = e.clientY - rect.top - ((e.clientY - rect.top) % 10);
    ctx.fillStyle = "rgba(169 150 150 0)";
    ctx.fillRect(x, y, STEP, STEP);
}

canvas.onclick = function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - ((e.clientX - rect.left) % 10);
    let y = e.clientY - rect.top - ((e.clientY - rect.top) % 10);
}


function spawPalette() {
    palette = document.getElementById("palette");
    for (const color in COLORS) {
        new_color = document.createElement("div")
        new_color.className = "palette_color"
        new_color.id = `palette_color_${color}`
        new_color.style.background = COLORS[color]
        new_color.onclick = function() {
            localStorage.setItem("select_color", color)
        }
        palette.appendChild(new_color)
    }
}


draw()
spawPalette()