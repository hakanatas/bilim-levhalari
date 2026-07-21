/* Bilim Levhaları — hub. Her levha bir FIG. kartı; ikonlar prosedürel SVG. */

const INK = "#22334f", ACCENT = "#b5432c", SOFT = "#51607a", MUT = "#8b8e96";
const P = (d, s = INK, w = 1.6, extra = "") => `<path d="${d}" fill="none" stroke="${s}" stroke-width="${w}" ${extra}/>`;

/* altıgen yardımcı */
function hexAt(cx, cy, r) {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 90);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
  }
  return d + "Z";
}

const ICONS = {
  // Periyodik tablo — altıgen küme
  ptable() {
    let s = "";
    const R = 15, dx = R * 1.72, dy = R * 1.5;
    const cells = [[0,0,1],[1,0],[2,0],[0,1],[1,1],[2,1,1],[-1,0],[-2,0,1]];
    const cx = 100, cy = 48;
    cells.forEach(([gx, gy, hot]) => {
      const x = cx + gx * dx + (gy % 2 ? dx / 2 : 0), y = cy + gy * dy - dy/2;
      s += P(hexAt(x, y, R), hot ? ACCENT : INK, hot ? 2 : 1.4);
    });
    return s;
  },
  // Nüklit — köşegen nokta bandı (kararlılık vadisi)
  nuclide() {
    let s = P("M20,86 L180,10", MUT, 1, 'stroke-dasharray="3 3"');
    for (let i = 0; i < 26; i++) {
      const t = i / 25, x = 24 + t * 152, y = 82 - t * 68;
      const off = Math.sin(i) * 6;
      const hot = i % 7 === 3;
      s += `<circle cx="${(x+off).toFixed(1)}" cy="${(y+off*0.4).toFixed(1)}" r="2.4" fill="${hot ? ACCENT : INK}"/>`;
    }
    return s;
  },
  // Fourier — iç içe çemberler + uç
  fourier() {
    let s = P("M40,48 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0", INK, 1.3);
    s += P("M70,30 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0", INK, 1.1);
    s += P("M40,48 L70,30 L84,22", MUT, 1);
    // kalp izi
    s += P("M84,22 C120,-2 150,20 130,50 C122,64 108,72 100,80 C92,72 78,64 70,50", ACCENT, 2);
    s += `<circle cx="84" cy="22" r="3" fill="${INK}"/>`;
    return s;
  },
  // Yörünge — elips + yıldız + gezegen
  orbit() {
    let s = P("M100,48 m-72,0 a72,26 0 1,0 144,0 a72,26 0 1,0 -144,0", INK, 1.3);
    s += P("M100,48 m-46,0 a46,42 0 1,0 92,0 a46,42 0 1,0 -92,0", MUT, 1, 'transform="rotate(24 100 48)"');
    s += `<circle cx="100" cy="48" r="7" fill="${ACCENT}"/>`;
    s += `<circle cx="28" cy="48" r="4" fill="${INK}"/>`;
    s += `<circle cx="150" cy="26" r="3" fill="${SOFT}"/>`;
    return s;
  },
  // Galton — çan eğrisi + histogram
  galton() {
    const bars = [8, 16, 30, 52, 70, 82, 70, 52, 30, 16, 8];
    let s = "";
    const bw = 13, x0 = 34;
    bars.forEach((h, i) => {
      const x = x0 + i * bw, y = 88 - h;
      s += `<rect x="${x}" y="${y}" width="${bw-2.5}" height="${h}" fill="${INK}" opacity="0.22"/>`;
    });
    let d = "";
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, x = 34 + t * (bars.length * bw - 2.5);
      const g = Math.exp(-Math.pow((t - 0.5) * 5.4, 2));
      const y = 88 - g * 82;
      d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    }
    s += P(d, ACCENT, 2);
    return s;
  },
  // Devre — pil + ampul halkası
  devre() {
    let s = P("M40,68 L40,28 L160,28 L160,68 Z", INK, 1.4);
    // ampul (üstte, haleli)
    s += `<circle cx="100" cy="28" r="18" fill="${ACCENT}22"/>`;
    s += P("M100,28 m-11,0 a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0", ACCENT, 1.6);
    s += P("M94,32 L97,23 L100,32 L103,23 L106,32", ACCENT, 1.3);
    // pil (altta)
    s += P("M82,68 L118,68", "none");
    s += `<rect x="86" y="60" width="28" height="16" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
    s += P("M97,63 L97,73", INK, 1.3) + P("M105,62 L105,74", INK, 2.4);
    // akım noktaları
    for (const t of [0.3, 0.7]) s += `<circle cx="160" cy="${(28 + t * 40).toFixed(0)}" r="2.4" fill="${ACCENT}"/>`;
    return s;
  },
  // Ay Evreleri — beş evre dizisi (hilal→dolunay)
  ay() {
    const R = 15, cx = [40, 70, 100, 130, 160], cy = 48;
    // illum: 0.15, 0.5, 1, 0.5(waning), 0.85(waning)
    const specs = [[0.14, true], [0.5, true], [1, true], [0.5, false], [0.86, false]];
    let s = "";
    specs.forEach(([il, wax], k) => {
      const x = cx[k];
      s += `<circle cx="${x}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
      // aydınlık bölge (terminatör tarama)
      const cosT = 1 - 2 * il, rx = Math.abs(cosT) * R;
      let d = "";
      for (let yy = -R; yy <= R; yy += 2) {
        const w = Math.sqrt(Math.max(0, R * R - yy * yy));
        const xt = w * cosT;
        const [a, b] = wax ? [xt, w] : [-w, -xt];
        if (b > a) d += `M${(x + a).toFixed(1)},${(cy + yy).toFixed(1)}L${(x + b).toFixed(1)},${(cy + yy).toFixed(1)}`;
      }
      s += `<path d="${d}" stroke="${ACCENT}" stroke-width="1.6" fill="none"/>`;
    });
    return s;
  },
  // Harmonograf — sönümlü Lissajous spirali
  harmonograf() {
    let d = "";
    const N = 420;
    for (let i = 0; i <= N; i++) {
      const t = i / N * Math.PI * 2 * 6;
      const env = Math.exp(-0.055 * t);
      const x = 100 + 48 * Math.sin(2.01 * t + Math.PI / 3) * env;
      const y = 48 + 42 * Math.sin(3 * t) * env;
      d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
    }
    return P(d, ACCENT, 1.2);
  },
  // Dalga — iki sinüs + toplam
  wave() {
    const sine = (amp, freq, yc, col, w, ph = 0) => {
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const x = 20 + (i / 60) * 160, y = yc - amp * Math.sin((i / 60) * freq * Math.PI * 2 + ph);
        d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
      }
      return P(d, col, w);
    };
    let s = sine(9, 3, 24, "#2e6f8e", 1.4);
    s += sine(9, 4, 48, "#7d4bb5", 1.4);
    let d = "";
    for (let i = 0; i <= 80; i++) {
      const x = 20 + (i / 80) * 160;
      const v = 8 * Math.sin((i / 80) * 3 * Math.PI * 2) + 8 * Math.sin((i / 80) * 4 * Math.PI * 2);
      d += (i ? "L" : "M") + x.toFixed(1) + "," + (80 - v).toFixed(1);
    }
    s += P(d, ACCENT, 2);
    return s;
  },
};

const PLATES = [
  { fig: "Levha I", key: "ptable", title: "Periyodik Tablo",
    desc: "118 elementin canlı tablosu; sıcaklıkla faz değiştir, ısı haritaları, Bohr modeli.",
    href: "https://hakanatas.github.io/interactive-periodic-table/" },
  { fig: "Levha II", key: "nuclide", title: "Nüklit Haritası",
    desc: "3386 izotopun Segrè diyagramı; zaman kaydırıcısıyla radyoaktif bozunmayı izle.",
    href: "https://hakanatas.github.io/interactive-periodic-table/nuclides.html" },
  { fig: "Levha III", key: "fourier", title: "Fourier Çizim Makinesi",
    desc: "Çizdiğin şekli dönen çemberlerle yeniden çizer; Fourier serisini gör.",
    href: "https://hakanatas.github.io/fourier-cizim-makinesi/" },
  { fig: "Levha IV", key: "orbit", title: "Yörünge Kurucu",
    desc: "Gezegen fırlat, yörünge kur; Kepler yasalarını kendi gözünle doğrula.",
    href: "https://hakanatas.github.io/yorunge-kurucu/" },
  { fig: "Levha V", key: "galton", title: "Galton Tahtası",
    desc: "Düşen toplardan çan eğrisi doğar; Merkezi Limit Teoremi'ni izle.",
    href: "https://hakanatas.github.io/galton-tahtasi/" },
  { fig: "Levha VI", key: "wave", title: "Dalga Laboratuvarı",
    desc: "Dalga girişimi ve vuru — hem gözle gör hem sesi aç, kulağınla duy.",
    href: "https://hakanatas.github.io/dalga-laboratuvari/" },
  { fig: "Levha VII", key: "harmonograf", title: "Harmonograf",
    desc: "Sarkaç salınımlarının izi — Lissajous eğrileri ve harmonograf desenleri.",
    href: "https://hakanatas.github.io/harmonograf/" },
  { fig: "Levha VIII", key: "devre", title: "Devre Kurucu",
    desc: "Ortaokul için: sürükle-bırak elektrik devresi, gerçek fizikle yanan ampuller.",
    href: "https://hakanatas.github.io/devre-kurucu/" },
  { fig: "Levha IX", key: "ay", title: "Ay Evreleri",
    desc: "Ortaokul için: Güneş–Dünya–Ay'ı döndür; evreleri kuşbakışı ve gökyüzü görünümüyle gör.",
    href: "https://hakanatas.github.io/ay-evreleri/" },
];

const grid = document.getElementById("grid");
grid.innerHTML = PLATES.map((p) => `
  <a class="card page-link" href="${p.href}">
    <span class="fig">${p.fig}</span>
    <svg viewBox="0 0 200 96" xmlns="http://www.w3.org/2000/svg">${ICONS[p.key]()}</svg>
    <h2>${p.title}</h2>
    <p>${p.desc}</p>
    <span class="go">Levhayı aç →</span>
  </a>`).join("");

/* yumuşak sayfa geçişi */
document.addEventListener("click", (ev) => {
  const a = ev.target.closest("a.page-link");
  if (!a) return;
  ev.preventDefault();
  document.body.style.transition = "opacity 0.25s, transform 0.25s";
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(-10px)";
  setTimeout(() => (location.href = a.href), 240);
});

/* =========================================================
   DİNAMİK ARKA PLAN — soluk, yavaş animasyonlu bilim motifleri
   (her levhaya bir gönderme; dikkat dağıtmadan hareket eder)
   ========================================================= */
(() => {
  const cv = document.getElementById("bg");
  if (!cv) return;
  const g = cv.getContext("2d");
  let W = 0, Hh = 0, DPR = 1, S = 1;
  const INKA = (a) => `rgba(34,51,79,${a})`;
  const ACCA = (a) => `rgba(181,67,44,${a})`;
  const TAU = Math.PI * 2;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth; Hh = window.innerHeight;
    cv.width = W * DPR; cv.height = Hh * DPR;
    S = Math.min(W, Hh);
  }
  window.addEventListener("resize", resize);

  const stroke = (a, col, w) => { g.strokeStyle = col; g.lineWidth = w; g.stroke(); };

  // 1) dönen atom (Levha I/II göndermesi)
  function atom(cx, cy, r, t) {
    for (let i = 0; i < 3; i++) {
      g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 3 + t * 0.15);
      g.beginPath(); g.ellipse(0, 0, r, r * 0.4, 0, 0, TAU); stroke(1, INKA(0.05), 1.2);
      const a = t * 0.9 + i * 2.1;
      g.beginPath(); g.arc(r * Math.cos(a), r * 0.4 * Math.sin(a), 3, 0, TAU);
      g.fillStyle = i === 1 ? ACCA(0.10) : INKA(0.09); g.fill();
      g.restore();
    }
    g.beginPath(); g.arc(cx, cy, 4, 0, TAU); g.fillStyle = ACCA(0.10); g.fill();
  }

  // 2) akan Lissajous (Levha VII)
  function lissajous(cx, cy, r, t) {
    g.beginPath();
    for (let i = 0; i <= 240; i++) {
      const u = i / 240 * TAU;
      const x = cx + r * Math.sin(3 * u + t * 0.4), y = cy + r * 0.82 * Math.sin(2 * u);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath(); stroke(1, ACCA(0.06), 1.2);
  }

  // 3) akan dalgalar (Levha VI)
  function waves(cx, cy, w, t) {
    for (let k = 0; k < 2; k++) {
      g.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = cx - w / 2 + (i / 80) * w;
        const y = cy + k * 20 + 12 * Math.sin(i / 80 * (3 + k) * TAU - t + k);
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      stroke(1, k ? INKA(0.055) : ACCA(0.05), 1.2);
    }
  }

  // 4) yörünge (Levha IV)
  function orbit(cx, cy, r, t) {
    g.save(); g.translate(cx, cy); g.rotate(-0.3);
    g.beginPath(); g.ellipse(0, 0, r, r * 0.5, 0, 0, TAU); stroke(1, INKA(0.05), 1.2);
    const a = t * 0.6;
    g.beginPath(); g.arc(r * Math.cos(a), r * 0.5 * Math.sin(a), 3.5, 0, TAU); g.fillStyle = INKA(0.10); g.fill();
    g.beginPath(); g.arc(0, 0, 4, 0, TAU); g.fillStyle = ACCA(0.10); g.fill();
    g.restore();
  }

  // 5) çan eğrisi (Levha V)
  function bell(cx, cy, w, t) {
    g.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = (i / 60 - 0.5) * 5.2, x = cx - w / 2 + (i / 60) * w;
      const y = cy - Math.exp(-u * u) * 46 * (0.9 + 0.1 * Math.sin(t));
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    stroke(1, ACCA(0.06), 1.4);
  }

  let t = 0;
  function frame() {
    t += 0.01;
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.clearRect(0, 0, W, Hh);
    atom(W * 0.13, Hh * 0.22, S * 0.11, t);
    lissajous(W * 0.87, Hh * 0.2, S * 0.1, t);
    orbit(W * 0.84, Hh * 0.78, S * 0.12, t);
    bell(W * 0.16, Hh * 0.76, S * 0.22, t);
    waves(W * 0.5, Hh * 0.9, S * 0.42, t);
    requestAnimationFrame(frame);
  }
  resize();
  frame();
})();
