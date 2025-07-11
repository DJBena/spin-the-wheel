
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const generateButton = document.getElementById("generate");
const numSectorsInput = document.getElementById("numSectors");
const sectorsListDiv = document.getElementById("sectorsList");
const sound = document.getElementById("spinSound");

let sectors = ["Prvi", "Drugi", "Treći", "Četvrti", "Peti", "Šesti"];
let angle = 0;
let spinning = false;
let lastAngle = 0;

function drawWheel() {
  const radius = canvas.width / 2;
  const step = (2 * Math.PI) / sectors.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sectors.length; i++) {
    const start = i * step;
    const end = start + step;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#000000" : "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + step / 2);
    ctx.fillStyle = i % 2 === 0 ? "#FFFFFF" : "#000000";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(sectors[i], radius - 10, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const extraDegrees = Math.floor(Math.random() * 360);
  const totalRotation = 360 * (Math.floor(Math.random() * 3) + 10) + extraDegrees;

  const targetAngle = lastAngle + totalRotation;
  const duration = 5000;
  const start = performance.now();

  sound.currentTime = 0;
  sound.play();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    angle = lastAngle + (totalRotation * easedProgress);

    canvas.style.transform = `rotate(${angle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      lastAngle = targetAngle % 360;
      spinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function generateInputs() {
  const count = parseInt(numSectorsInput.value);
  sectorsListDiv.innerHTML = "";
  sectors = [];

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Sektor ${i + 1}`;
    input.addEventListener("input", updateSectors);
    sectorsListDiv.appendChild(input);
    sectors.push(`Sektor ${i + 1}`);
  }

  drawWheel();
}

function updateSectors() {
  const inputs = sectorsListDiv.querySelectorAll("input");
  sectors = Array.from(inputs).map(input => input.value || "Prazno");
  drawWheel();
}

generateButton.addEventListener("click", generateInputs);
spinButton.addEventListener("click", spinWheel);
drawWheel();
