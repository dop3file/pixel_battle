const WIDTH = 1280;
const HEIGHT = 720;
const STEP = 10;

const canvas = document.getElementById("layer2");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("layer1");
canvas2.width = WIDTH;
canvas2.height = HEIGHT;
const ctx2 = canvas2.getContext("2d");

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
        ctx2.fillStyle = COLORS[parseInt(pixel.color)];
        ctx2.fillRect(pixel.x, pixel.y, STEP, STEP);
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
    let x = e.clientX - rect.left - ((e.clientX - rect.left) % 10) * (canvas.clientWidth / canvas.width);
    console.log(ctx.heightRatio);
    console.log(canvas.clientWidth)
    let y = e.clientY - rect.top - ((e.clientY - rect.top) % 10);
    ctx.fillStyle = COLORS[localStorage.getItem("select_color")];
    ctx.fillRect(x, y, STEP, STEP);
}

canvas.onclick = function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - ((e.clientX - rect.left) % 10);
    let y = e.clientY - rect.top - ((e.clientY - rect.top) % 10);
    data = JSON.stringify({
        "x": x,
        "y": y,
        "color": localStorage.getItem("select_color"),
    })
    ws.send(data)
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