let canvas = document.getElementById("canvas");
// import { io } from "socket.io-client";
canvas.width = 0.98 * window.innerWidth;
canvas.height = 0.98 * window.innerHeight;
let ctx = canvas.getContext("2d");
let lineWidth=2;
ctx.lineWidth = lineWidth;
ctx.lineCap = "round";
ctx.strokeStyle = "black";
let x;
let y;
let strokeColor = "black";
let mouseDown = false;
const eraseButton = document.getElementById("erase-button");
const eraserCursor = document.getElementById("eraser-cursor");
let isErasing = false;
eraseButton.addEventListener("click", () => {
  isErasing = !isErasing;
  eraseButton.classList.toggle("selected", isErasing);
  eraserCursor.style.display = isErasing ? "block" : "none";
  canvas.style.cursor = isErasing ? "none" : "default";
});

var io = io.connect("http://localhost:8000");

window.onmousedown = (e) => {
  io.emit("down", { x, y });
  ctx.moveTo(x, y);
  mouseDown = true;
  ctx.beginPath();
  ctx.lineWidth=lineWidth;
};
window.onmouseup = (e) => {
  mouseDown = false;
};
io.on("ondraw", ({ x, y }) => {
  ctx.lineTo(x, y);
  ctx.stroke();
});
io.on("move", ({ x, y }) => {
  ctx.moveTo(x, y);
});
io.on("onerase", ({ x, y }) => {
  ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
});
const eraserSize = 10;
window.onmousemove = (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (isErasing) {
    eraserCursor.style.left = `${e.clientX - eraserSize / 2}px`;
    eraserCursor.style.top = `${e.clientY - eraserSize / 2}px`;
  }

  if (mouseDown && !isErasing) {
    console.log("Drawing")
   
  //  console.log({ x, y });
    io.emit("draw", { x, y });
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (mouseDown && isErasing) {
    console.log("Eraser")
    io.emit("erase", { x, y });
   // console.log("erassing");

    ctx.clearRect(
      x - eraserSize / 2,
      y - eraserSize / 2,
      eraserSize,
      eraserSize
    );
  }
};
// ctx.moveTo(100, 100);
// ctx.lineTo(200, 200);
// ctx.stroke();
