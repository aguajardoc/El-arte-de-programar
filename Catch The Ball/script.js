// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar una bola que cae.
// Si la atrapas, ganas puntos. Si no, se reinicia el juego.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔧 Ajustes del lienzo
canvas.width = 400;
canvas.height = 600;

// 🏀 Configuración de la bola
let ball = {
  x: Math.random() * 380 + 10, // Posición aleatoria inicial (evita los bordes)
  y: 0,
  radius: 15,
  vx: Math.random() * 4 - 2, // Velocidad horizontal aleatoria
  vy: 3,
  color: "blue",
};

// 🧍 Control del jugador (la barra)
let catcher = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40, // Centrado al inicio
  y: canvas.height - 40,
  color: "white",
};

let score = 0;
let mouseX = canvas.width / 2;

// 🖱 Evento: mover el mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// Colisión círculo-rectángulo
function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return (dx * dx + dy * dy) < (r * r);
}

// ⚙️ Actualizar posición y lógica
function update() {
  // Mueve la bola con vy/vx
  ball.y += ball.vy;
  ball.x += ball.vx;

  // Rebote en paredes laterales
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.vx = -ball.vx;
  }

  // Rebote en el techo
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy = -ball.vy;
  }

  // Actualiza la posición del catcher
  catcher.x = mouseX - catcher.width / 2;

  // 🧮 Detección de colisión (bola vs catcher)
  if (ball.vy > 0 && circleRectCollision(ball.x, ball.y, ball.radius, catcher.x, catcher.y, catcher.width, catcher.height)) {
    score++;
    // Rebotar: invertir vy y asegurarse que salga hacia arriba
    ball.vy = -Math.abs(ball.vy);

    // Aumentar ligeramente la velocidad para más dificultad
    ball.vy *= 1.05;
    ball.vx *= 1.02;
    
    // reposicionar justo encima para evitar engancharse
    ball.y = catcher.y - ball.radius - 1;

    // Aumenta un poco la dificultad cada 5 puntos (manteniendo signo)
    if (score % 5 === 0) {
      const sign = ball.vy < 0 ? -1 : 1;
      ball.vy += sign * 0.5;
    }
  }

  // 🚫 Si la bola cae fuera del canvas por abajo -> Game Over
  if (ball.y - ball.radius > canvas.height) {
    alert(`💀 Game Over! Score: ${score}`);
    score = 0;
    // reiniciar velocidades
    ball.vx = (Math.random() * 4) - 2;
    ball.vy = 3;
    resetBall();
  }
}

// 🔁 Reinicia la bola desde arriba
function resetBall() {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;
  ball.vx = (Math.random() * 4) - 2;
  ball.vy = 3;
}

// 🎨 Dibujar todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja la bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();

  // Dibuja el catcher
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Dibuja el score
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

// 🌀 Bucle del juego
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
