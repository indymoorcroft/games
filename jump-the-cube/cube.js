const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawBackgroundLine() {
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(600, 400);
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackgroundLine();
}

animate();
