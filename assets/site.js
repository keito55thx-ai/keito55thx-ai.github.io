/* KEITO 公式サイトの動き（2026-11-18）: ⓪日付で切り替える所を出し分ける ①画面に入った節をふわっと出す ②トップのロゴの後ろで光の筋を流す。動きを減らす設定の端末では ⓪ だけ */
(() => {
  const d = document, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 日付で切り替える所（募集の締切・会期の終わり）。日本時間の今日で比べる
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  d.querySelectorAll('[data-until]').forEach(el => { if (today > el.dataset.until) el.hidden = true; });
  d.querySelectorAll('[data-after]').forEach(el => { if (today > el.dataset.after) el.hidden = false; });
  if (calm) return;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.06 });
    d.querySelectorAll('main > section:not(.khero):not(.zhero):not(.ahero):not(.pagehead) .inner').forEach(el => { el.classList.add('rv'); io.observe(el); });
  }
  const c = d.querySelector('canvas.warp');
  if (!c) return;
  const x = c.getContext('2d'), col = c.dataset.color || '255,255,255', cy = parseFloat(c.dataset.cy || '0.3');
  let w = 0, h = 0;
  const fit = () => { const b = c.getBoundingClientRect(), p = Math.min(window.devicePixelRatio || 1, 2); w = c.width = b.width * p; h = c.height = b.height * p; };
  fit();
  const S = Array.from({ length: 150 }, () => ({ a: Math.random() * 6.283, r: Math.random(), v: 0.4 + Math.random() }));
  const t0 = performance.now(), LIFE = 2.0;
  (function frame(now) {
    const t = (now - t0) / 1000, k = Math.max(0, 1 - t / LIFE);
    x.clearRect(0, 0, w, h);
    if (k <= 0) return;
    const R = Math.hypot(w, h) * 0.62;
    for (const s of S) {
      s.r += s.v * 0.03 * (0.3 + k * 1.7);
      if (s.r > 1) s.r -= 1;
      const r1 = s.r * R, r2 = r1 + R * 0.14 * k * s.v + 2, cs = Math.cos(s.a), sn = Math.sin(s.a);
      x.strokeStyle = 'rgba(' + col + ',' + ((0.12 + 0.6 * s.r) * k).toFixed(3) + ')';
      x.lineWidth = 1 + s.r * 1.6;
      x.beginPath(); x.moveTo(w / 2 + cs * r1, h * cy + sn * r1); x.lineTo(w / 2 + cs * r2, h * cy + sn * r2); x.stroke();
    }
    requestAnimationFrame(frame);
  })(t0);
})();
