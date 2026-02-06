const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const stage  = document.getElementById("stage");
const logBox = document.getElementById("log");

const messages = [
  "Emin misin? 🙂",
  "Nasıl yani 😌",
  "Bir daha düşün… 😄",
  "Bak kaçıyorum… 🏃‍♀️",
  "Eren… lütfen 🥺",
  "Artık 'Evet' desen mi??????? 😌",
];

let yesScale = 1;
let floatingStarted = false;

function addLog(text) {
  if (!logBox) return;
  const p = document.createElement("p");
  p.textContent = text;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}

function growYes() {
  yesScale = Math.min(yesScale * 1.15, 1.9);
  yesBtn.style.transform = `scale(${yesScale})`;
}

function moveNoRandomlyNoOverlap() {
  const stageRect = stage.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const padding = 10;
  const buffer = 26;

  const maxX = stageRect.width - noRect.width - padding;
  const maxY = stageRect.height - noRect.height - padding;

  let x = padding, y = padding;
  let safe = false;
  let tries = 0;

  while (!safe && tries < 400) {
    x = Math.random() * maxX;
    y = Math.random() * maxY;

    const noArea = {
      left: stageRect.left + x,
      right: stageRect.left + x + noRect.width,
      top: stageRect.top + y,
      bottom: stageRect.top + y + noRect.height
    };

    const yesArea = {
      left: yesRect.left - buffer,
      right: yesRect.right + buffer,
      top: yesRect.top - buffer,
      bottom: yesRect.bottom + buffer
    };

    const overlap =
      noArea.right > yesArea.left &&
      noArea.left < yesArea.right &&
      noArea.bottom > yesArea.top &&
      noArea.top < yesArea.bottom;

    safe = !overlap;
    tries++;
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function nextMessage() {
  const current = noBtn.textContent.trim();
  const idx = messages.indexOf(current);
  const nextIdx = (idx === -1) ? 0 : (idx + 1) % messages.length;
  return messages[nextIdx];
}

function onNoClick(e) {
  e.preventDefault();

  // ✅ İlk tıkta: hayırı "floating" moda geçir (yan yanadan absolute'a geçiş)
  if (!floatingStarted) {
    floatingStarted = true;
    noBtn.classList.add("floating");

    // yan yana konumdan absolute'a geçerken aynı yerde kalması için:
    const stageRect = stage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    noBtn.style.left = `${noRect.left - stageRect.left}px`;
    noBtn.style.top  = `${noRect.top - stageRect.top}px`;
  }

  const msg = nextMessage();
  noBtn.textContent = msg;
  addLog(`Hayır’a bastın: ${msg}`);

  growYes();
  moveNoRandomlyNoOverlap();
}

noBtn.addEventListener("click", onNoClick);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  onNoClick(e);
}, { passive: false });

yesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addLog("EVET! 💖");
  window.location.href = "yes.html";
});

window.addEventListener("load", () => {
  // ✅ başlangıç: yan yana dursun
  noBtn.classList.remove("floating");
  noBtn.textContent = "Hayır";
});
