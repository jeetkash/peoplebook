import { getRelationships } from "./relationships.js";

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let draggingNode = null;

// 🎨 COLORS
const colorMap = {
  // 💘 Romantic
  "Talking Stage": "#FFD966",
  "Situationship": "#FFA500",
  "Dating": "#FF5E5E",
  "Relationship": "#00FF88",
  "Breakup": "#FF2E2E",

  // 🧑‍🤝‍🧑 Social
  "Acquaintance": "#888888",
  "Friend": "#66CCFF",
  "Close Friend": "#4169E1",
  "Best Friend": "#00CCFF",
  "Enemy": "#FF0000",

  // ⚡ Other
  "Casual": "#CCCCCC",
  "FWB": "#FF99CC",
  "Complicated": "#CC66FF"
};

function getColor(status) {
  return colorMap[status] || "#AAAAAA"; // safer fallback
}

// 🔥 INIT GRAPH
async function initGraph() {
  const data = await getRelationships();

  const people = Array.from(new Set(
    data.flatMap(r => [r.personA, r.personB])
  ));

  // 🧱 GRID LAYOUT (CLEAN)
  const cols = Math.ceil(Math.sqrt(people.length));
  const spacingX = canvas.width / (cols + 1);
  const spacingY = canvas.height / (cols + 1);

  nodes = people.map((name, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    return {
      name,
      x: spacingX * (col + 1),
      y: spacingY * (row + 1),
      radius: 25
    };
  });

  // 🔗 EDGES
  edges = data.map(rel => ({
    from: rel.personA,
    to: rel.personB,
    status: rel.status
  }));

  draw();
}

// 🎨 DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔗 EDGES + LABELS
  edges.forEach(edge => {
    const a = nodes.find(n => n.name === edge.from);
    const b = nodes.find(n => n.name === edge.to);
    if (!a || !b) return;

    // line
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = getColor(edge.status);
    ctx.lineWidth = 2;
    ctx.stroke();

    // label offset
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const offsetX = -dy / len * 15;
    const offsetY = dx / len * 15;

    const lx = midX + offsetX;
    const ly = midY + offsetY;

    // background
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(lx - 40, ly - 10, 80, 20);

    // text
    ctx.fillStyle = getColor(edge.status);
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(edge.status, lx, ly + 4);
  });

  // 🟡 NODES
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFD700";
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(node.name, node.x, node.y + 4);
  });
}

// 🖱 DRAG SYSTEM
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  nodes.forEach(node => {
    const dx = x - node.x;
    const dy = y - node.y;

    if (Math.sqrt(dx * dx + dy * dy) < node.radius) {
      draggingNode = node;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (!draggingNode) return;

  const rect = canvas.getBoundingClientRect();
  draggingNode.x = e.clientX - rect.left;
  draggingNode.y = e.clientY - rect.top;

  draw();
});

canvas.addEventListener("mouseup", () => {
  draggingNode = null;
});

canvas.addEventListener("mouseleave", () => {
  draggingNode = null;
});

// 🚀 START
initGraph();