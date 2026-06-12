/* ====================================================
   Jay Dhamale — neo portfolio · vanilla JS, no deps
   ==================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- mobile nav ---------- */
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

/* ---------- scroll fade-ins + active nav ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in-view")),
  { threshold: 0.15 }
);
document.querySelectorAll(".fade-in, .char-card").forEach((el) => io.observe(el));

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const sectionIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navAnchors.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`)
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => sectionIO.observe(s));

/* ---------- hero terminal typing ---------- */
const typedEls = document.querySelectorAll(".typed");

if (!reduceMotion) {
  // hide outputs initially, type commands one by one
  const rows = [...typedEls].map((cmd) => {
    const out = cmd.closest("p").nextElementSibling;
    if (out) out.style.visibility = "hidden";
    const full = cmd.dataset.type;
    cmd.textContent = "";
    return { cmd, out, full };
  });

  let delay = 600;
  rows.forEach(({ cmd, out, full }) => {
    [...full].forEach((ch, i) => {
      setTimeout(() => (cmd.textContent += ch), delay + i * 45);
    });
    delay += full.length * 45 + 250;
    const reveal = delay;
    setTimeout(() => out && (out.style.visibility = "visible"), reveal);
    delay += 300;
  });
}

/* ---------- particles ---------- */
const canvas = document.getElementById("particles");

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(devicePixelRatio, 2);
  let W, H, pts;

  const resize = () => {
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  };
  resize();
  addEventListener("resize", resize);

  const COUNT = Math.min(70, Math.floor(innerWidth / 18));
  pts = Array.from({ length: COUNT }, () => ({
    x: Math.random() * innerWidth * DPR,
    y: Math.random() * innerHeight * DPR,
    vx: (Math.random() - 0.5) * 0.25 * DPR,
    vy: (Math.random() - 0.5) * 0.25 * DPR,
    r: (Math.random() * 1.6 + 0.5) * DPR,
    cyan: Math.random() < 0.7,
  }));

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    const LINK = 110 * DPR;

    pts.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.cyan ? "rgba(0,240,255,0.5)" : "rgba(255,45,149,0.5)";
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(0,240,255,${0.12 * (1 - d / LINK)})`;
          ctx.lineWidth = DPR * 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  })();
}

/* ---------- subtle parallax on hero kanji ---------- */
const kanji = document.querySelector(".hero-kanji");
if (kanji && !reduceMotion) {
  addEventListener("scroll", () => {
    kanji.style.transform = `translateY(calc(-50% + ${scrollY * 0.18}px))`;
  }, { passive: true });
}

/* ---------- genjutsu (tsukuyomi) mode ---------- */
function castTsukuyomi() {
  document.body.classList.add("genjutsu");
}
function releaseGenjutsu() {
  document.body.classList.remove("genjutsu");
}
addEventListener("keydown", (e) => e.key === "Escape" && releaseGenjutsu());
document.getElementById("tsukuyomi").addEventListener("click", releaseGenjutsu);

/* ---------- konami code ---------- */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kIndex = 0;
addEventListener("keydown", (e) => {
  kIndex = e.key === KONAMI[kIndex] ? kIndex + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (kIndex === KONAMI.length) {
    kIndex = 0;
    castTsukuyomi();
  }
});

/* ---------- hidden terminal ---------- */
const termInput = document.getElementById("termInput");
const termOut = document.getElementById("termOut");

const COMMANDS = {
  help: [
    "available commands:",
    "  whoami · anime · books · skills · socials · vim · clear",
    "  itachi · pain · obito · madara · love",
    "  ...and maybe a forbidden jutsu or two 👁️",
  ],
  whoami: ["jay dhamale — vp of engineering @ atomic loops.", "developer by nature. otaku by choice. reader by night. vim enjoyer always."],
  anime: ["currently: jujutsu kaisen.", "next to watch: frieren, chainsaw man.", "all-time: naruto (11/10), attack on titan.", "hot take: itachi is the best-written character in shonen. fight me."],
  books: ["reading: no rules rules — the netflix culture book.", "shelf: atomic habits, pragmatic programmer, deep work, zero to one."],
  skills: ["python · go · django · flutter · kubernetes · cloud · ai/llms", "large-scale data pipelines — millions of data points and counting", "passive ability: code review jutsu (+15 crit)"],
  socials: ["github.com/jay-dhamale · jay@atomicloops.com"],
  itachi: ['"love is a twisted curse."', '"people live their lives bound by what they accept as correct and true."', "— the GOAT. forever in our hearts. 🌙"],
  love: ['"love is a twisted curse." — itachi', "but it also wins wars. ask naruto. 🍥"],
  vim: ["opening vim...", ":wq — see? exited like a pro.", "real ones know: vim is not an editor, it's a lifestyle."],
  pain: ["SHINRA TENSEI! 💥", '"feel pain. accept pain. know pain."', "the world shall know pain... and good software."],
  obito: ['"those who abandon their friends are worse than scum."', "the man who started a war because of a rock. still iconic."],
  madara: ['"wake up to reality! nothing ever goes as planned in this accursed world."', "one-man army. dropped the hardest speech in shonen history."],
  tsukuyomi: ["casting infinite tsukuyomi... 👁️"],
  konami: ["nice try. use the actual buttons: ↑↑↓↓←→←→BA"],
  release: ["kai! 🙏 genjutsu released."],
  sudo: ["user is not in the akatsuki. this incident will be reported."],
  clear: [],
};

function termPrint(lines, cls = "t-out") {
  lines.forEach((l) => {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = l;
    termOut.appendChild(p);
  });
  termOut.scrollTop = termOut.scrollHeight;
}

termInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const raw = termInput.value.trim().toLowerCase();
  termInput.value = "";
  if (!raw) return;

  const echo = document.createElement("p");
  echo.innerHTML = `<span class="prompt">&gt;</span> `;
  echo.appendChild(document.createTextNode(raw));
  termOut.appendChild(echo);

  if (raw === "clear") {
    termOut.innerHTML = "";
    return;
  }
  if (raw === "tsukuyomi") {
    termPrint(COMMANDS.tsukuyomi);
    setTimeout(castTsukuyomi, 600);
    return;
  }
  if (raw === "release") {
    releaseGenjutsu();
    termPrint(COMMANDS.release);
    return;
  }

  const res = COMMANDS[raw];
  termPrint(res || [`command not found: ${raw} — try "help"`]);
});

/* ---------- contact form -> mailto ---------- */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const email = document.getElementById("fEmail").value.trim();
  const msg = document.getElementById("fMsg").value.trim();
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  location.href = `mailto:jay@atomicloops.com?subject=${encodeURIComponent("Hello from your portfolio")}&body=${body}`;
});
