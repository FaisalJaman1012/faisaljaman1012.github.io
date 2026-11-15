/* ==========================================================================
   Md Faisal Jaman — Portfolio 2.0
   Vanilla JS (ES2020). No dependencies, no build step.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------- Config: edit these ---------- */
  const EMAIL = 'faisaljaman.infosec@gmail.com';
  const ROLES = ['Security Engineer', 'Penetration Tester', 'CTF Player', 'Cyber Instructor', 'Cyber Enthusiast'];
  const LINKS = {
    github: 'https://github.com/FaisalJaman1012',
    linkedin: 'https://www.linkedin.com/in/faisaljaman1012/',
    medium: 'https://medium.com/@faisaljaman.infosec',
    twitter: 'https://twitter.com/Jaman_1210',
    cv: 'Md_Faisal_Jaman_CV.pdf',
  };
  // Add or remove photos here. cat: photo | cert | back
  const GALLERY = [
    ['workshop1', 'photo', 'Workshop'], ['studio', 'photo', 'Studio session'], ['1st-image', 'photo', 'Event photo'],
    ['portfolio-2', 'photo', 'Event photo'], ['expert', 'photo', 'Expert session'], ['lecturer', 'photo', 'Lecture'],
    ['nirjon', 'photo', 'Event photo'], ['portfolio-5', 'photo', 'Event photo'], ['portfolio-6', 'photo', 'Event photo'],
    ['portfolio-7', 'photo', 'Event photo'], ['lecturer2', 'photo', 'Lecture'], ['new1', 'photo', 'Event photo'],
    ['lecturer3', 'photo', 'Lecture'], ['portfolio-8', 'photo', 'Event photo'], ['prize', 'photo', 'Prize'],
    ['prize2', 'photo', 'Prize'], ['workshop2', 'photo', 'Workshop'], ['workshop3', 'photo', 'Workshop'],
    ['comptia', 'cert', 'CompTIA'], ['comptia2', 'cert', 'CompTIA'], ['certificate', 'cert', 'Certificate'],
    ['certificate2', 'cert', 'Certificate'], ['certificates3', 'cert', 'Certificate'], ['certificates4', 'cert', 'Certificate'],
    ['certificates5', 'cert', 'Certificate'], ['certificates6', 'cert', 'Certificate'],
    ['portfolio-4', 'back', 'Background'], ['background', 'back', 'Background'], ['panther', 'back', 'Panther'], ['portfolio-9', 'back', 'Background'],
  ].map(([id, cat, label]) => ({
    cat, label,
    thumb: `img/gallery/thumb/${id}.webp`,
    full: `img/gallery/full/${id}.webp`,
    alt: `${label} — gallery photo`,
  }));
  const CATS = { all: 'All', photo: 'Photos', cert: 'Certifications', back: 'Backgrounds' };

  /* ---------- Helpers ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };
  const copy = async (text, msg = 'Copied to clipboard') => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { toast('Copy failed — select it manually'); }
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Accent theme ---------- */
  const setAccent = (name) => {
    root.dataset.accent = name;
    store.set('fj-accent', name);
    $$('.accent-dot').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.accent === name)));
    window.dispatchEvent(new Event('accentchange'));
  };
  setAccent(root.dataset.accent || 'cyan');
  $$('.accent-dot').forEach((b) => b.addEventListener('click', () => setAccent(b.dataset.accent)));

  /* ---------- Canvas: neural network backdrop ---------- */
  const bg = (() => {
    const c = $('#bg');
    const ctx = c.getContext('2d');
    let w = 0, h = 0, dpr = 1, pts = [], rgb = '0,229,255', raf = 0;
    let enabled = store.get('fj-fx') !== 'off' && !reduceMotion;
    const mouse = { x: -9999, y: -9999 };

    const readColor = () => {
      const v = getComputedStyle(root).getPropertyValue('--accent-rgb').trim().split(/\s+/);
      if (v.length === 3) rgb = v.join(',');
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = Math.floor(innerWidth * dpr);
      h = c.height = Math.floor(innerHeight * dpr);
      const n = Math.round(Math.min(120, (innerWidth * innerHeight) / 13000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32 * dpr, vy: (Math.random() - 0.5) * 0.32 * dpr,
        r: (Math.random() * 1.3 + 0.6) * dpr,
      }));
      if (!enabled) paintStatic();
    };
    const paintStatic = () => { ctx.clearRect(0, 0, w, h); };
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const link = 150 * dpr, mlink = 190 * dpr;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.hypot(mx, my);
        if (md < 120 * dpr) { p.x += (mx / md) * 0.8; p.y += (my / md) * 0.8; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = `rgba(${rgb},0.75)`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / link) * 0.22})`;
            ctx.lineWidth = dpr * 0.8;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        if (md < mlink) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - md / mlink) * 0.5})`;
          ctx.lineWidth = dpr;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(step);
    };
    const start = () => { cancelAnimationFrame(raf); if (enabled && !document.hidden) raf = requestAnimationFrame(step); };
    const set = (on) => { enabled = on; store.set('fj-fx', on ? 'on' : 'off'); if (on) start(); else { cancelAnimationFrame(raf); paintStatic(); } };

    readColor(); resize(); start();
    addEventListener('resize', () => { resize(); start(); });
    addEventListener('pointermove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
    document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    document.addEventListener('visibilitychange', start);
    window.addEventListener('accentchange', readColor);
    return { toggle: () => { set(!enabled); return enabled; }, get on() { return enabled; } };
  })();

  /* ---------- Cursor glow ---------- */
  if (finePointer && !reduceMotion) {
    const glow = $('#glow');
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add('on'); }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('on'));
    (function loop() {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Card spotlight + 3D tilt ---------- */
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('.spot');
    if (el) {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  }, { passive: true });

  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Text scramble (“decrypt”) ---------- */
  const GLYPHS = '!<>-_\\/[]{}—=+*^?#0123456789';
  const scramble = (el) => {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    el.setAttribute('aria-label', final);
    if (reduceMotion) { el.textContent = final; return; }
    const total = 26;
    let frame = 0;
    const tick = () => {
      const reveal = (frame / total) * final.length;
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const ch = final[i];
        out += ch === ' ' || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame++ < total) requestAnimationFrame(tick); else el.textContent = final;
    };
    tick();
  };

  /* ---------- Reveal on scroll, counters, meters ---------- */
  const countUp = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const percent = (el) => {
    const target = +el.dataset.pct;
    if (reduceMotion) { el.textContent = target + '%'; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%';
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      if (el.hasAttribute('data-scramble')) scramble(el);
      if (!el.matches('.meter')) $$('[data-count]', el).forEach(countUp);
      if (el.matches('.meter')) $$('[data-pct]', el).forEach(percent);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .meter, [data-scramble]').forEach((el) => io.observe(el));

  // Stagger siblings inside grids
  $$('.skills-grid, .cert-grid, .rank-list, .facts, .timeline, .proj-grid').forEach((g) => {
    $$('.reveal, .meter', g).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 8) * 70}ms`));
  });

  /* ---------- Nav: scroll state, active link, mobile menu, progress ---------- */
  const nav = $('#nav'), toTop = $('#to-top');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    toTop.classList.toggle('show', scrollY > 700);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if (!CSS.supports('animation-timeline: scroll()')) {
    const bar = $('#progress');
    addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    }, { passive: true });
  }
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const links = $$('.nav-links a');
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.dataset.sec === en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach((s) => secIO.observe(s));

  const menuBtn = $('#menu-btn');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Hero: role typewriter ---------- */
  (async () => {
    const el = $('#role');
    if (reduceMotion) { el.textContent = ROLES[0]; return; }
    let i = 0;
    for (;;) {
      const word = ROLES[i % ROLES.length];
      for (let k = 1; k <= word.length; k++) { el.textContent = word.slice(0, k); await sleep(70); }
      await sleep(1700);
      for (let k = word.length; k >= 0; k--) { el.textContent = word.slice(0, k); await sleep(35); }
      await sleep(300);
      i++;
    }
  })();

  /* ---------- Hero: terminal boot sequence ---------- */
  (async () => {
    const term = $('#term');
    const prompt = 'faisal@sec-lab';
    const script = [
      { cmd: 'whoami' },
      { out: 'md_faisal_jaman', cls: 't-out' },
      { cmd: 'cat /etc/role' },
      { out: 'Security Engineer @ Mutual Trust Bank PLC', cls: 't-out' },
      { out: 'Adj. Assistant Professor @ Eastern University', cls: 't-out' },
      { cmd: 'ls ./focus' },
      { out: 'pentest/  vapt-reports/  web-app-sec/  ctf/  teaching/', cls: 't-out' },
      { cmd: 'certs --list' },
      { out: '[ OK ] PenTest+   [ OK ] Security+   [ OK ] Network+', cls: 't-out t-ok' },
      { out: '[ OK ] Linux+     [ OK ] CNVP        [ OK ] CLNP', cls: 't-out t-ok' },
      { cmd: 'status --freelance' },
      { out: '● available for new engagements', cls: 't-out t-ok' },
    ];
    const mkLine = () => { const d = document.createElement('span'); d.className = 't-line'; term.appendChild(d); return d; };
    const caret = document.createElement('span'); caret.className = 'caret';
    for (const s of script) {
      const line = mkLine();
      if (s.cmd) {
        line.innerHTML = `<span class="t-prompt">${prompt}</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$ </span>`;
        const txt = document.createElement('span'); line.appendChild(txt); line.appendChild(caret);
        if (reduceMotion) { txt.textContent = s.cmd; }
        else { for (let k = 1; k <= s.cmd.length; k++) { txt.textContent = s.cmd.slice(0, k); await sleep(38 + Math.random() * 40); } await sleep(260); }
      } else {
        line.className += ' ' + s.cls; line.textContent = s.out;
        if (!reduceMotion) await sleep(180);
      }
    }
    const last = mkLine();
    last.innerHTML = `<span class="t-prompt">${prompt}</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$ </span>`;
    last.appendChild(caret);
  })();

  // Occasional glitch on the name
  if (!reduceMotion) {
    const g = $('#glitch-1');
    setInterval(() => { g.classList.add('glitching'); setTimeout(() => g.classList.remove('glitching'), 950); }, 7000);
  }

  /* ---------- Gallery: filters (View Transitions) + lightbox ---------- */
  const grid = $('#gallery-grid'), filtersEl = $('#filters');
  let activeCat = 'all';
  grid.innerHTML = GALLERY.map((g, i) =>
    `<button class="g-item" data-i="${i}" data-cat="${g.cat}" style="view-transition-name:g${i}" aria-label="Open image: ${g.label}">
       <img src="${g.thumb}" alt="${g.alt}" loading="lazy" decoding="async"><span>${g.label}</span>
     </button>`).join('');
  filtersEl.innerHTML = Object.entries(CATS).map(([k, label]) => {
    const n = k === 'all' ? GALLERY.length : GALLERY.filter((g) => g.cat === k).length;
    return `<button class="filter" data-cat="${k}" aria-pressed="${k === 'all'}">${label}<small>${n}</small></button>`;
  }).join('');

  const applyFilter = (cat) => {
    activeCat = cat;
    $$('.filter', filtersEl).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    $$('.g-item', grid).forEach((it) => { it.hidden = !(cat === 'all' || it.dataset.cat === cat); });
  };
  filtersEl.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (!b || b.dataset.cat === activeCat) return;
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(() => applyFilter(b.dataset.cat));
    else applyFilter(b.dataset.cat);
  });

  const lb = $('#lightbox'), lbImg = $('#lb-img'), lbCount = $('#lb-count');
  let lbList = [], lbPos = 0;
  const showLb = () => {
    const g = GALLERY[lbList[lbPos]];
    lbImg.src = g.full; lbImg.alt = g.alt;
    lbCount.textContent = `${lbPos + 1} / ${lbList.length} · ${g.label}`;
    [1, -1].forEach((d) => { const n = GALLERY[lbList[(lbPos + d + lbList.length) % lbList.length]]; new Image().src = n.full; });
  };
  const stepLb = (d) => { lbPos = (lbPos + d + lbList.length) % lbList.length; showLb(); };
  grid.addEventListener('click', (e) => {
    const it = e.target.closest('.g-item');
    if (!it) return;
    lbList = $$('.g-item', grid).filter((x) => !x.hidden).map((x) => +x.dataset.i);
    lbPos = lbList.indexOf(+it.dataset.i);
    showLb(); lb.showModal();
  });
  $('#lb-close').addEventListener('click', () => lb.close());
  $('#lb-prev').addEventListener('click', () => stepLb(-1));
  $('#lb-next').addEventListener('click', () => stepLb(1));
  lb.addEventListener('click', (e) => { if (e.target.id === 'lb' || e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') stepLb(-1);
    if (e.key === 'ArrowRight') stepLb(1);
  });
  let touchX = 0;
  lb.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) stepLb(dx > 0 ? -1 : 1);
  });

  /* ---------- Copy buttons (certificate codes) ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (b) copy(b.dataset.copy, 'Verification code copied');
  });

  /* ---------- Contact form ---------- */
  const form = $('#contact-form'), statusEl = $('#form-status');
  const setStatus = (msg, cls = '') => { statusEl.textContent = msg; statusEl.className = 'form-status ' + cls; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // honeypot
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      setStatus('transmitting…');
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset(); setStatus('✔ message delivered — thank you!', 'ok');
      } catch {
        setStatus('✖ could not send — please email me directly.', 'err');
      }
    } else {
      const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
      setStatus('opening your mail app…', 'ok');
    }
  });

  /* ---------- Command palette ---------- */
  const pal = $('#palette'), palQ = $('#pal-q'), palList = $('#pal-list');
  const go = (id) => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const open = (url) => () => window.open(url, '_blank', 'noopener');
  const COMMANDS = [
    { g: 'Navigate', t: 'Home', h: '#hero', run: go('hero') },
    { g: 'Navigate', t: 'About', h: '#about', run: go('about') },
    { g: 'Navigate', t: 'Skills', h: '#skills', run: go('skills') },
    { g: 'Navigate', t: 'Experience', h: '#experience', run: go('experience') },
    { g: 'Navigate', t: 'Projects', h: '#projects', run: go('projects') },
    { g: 'Navigate', t: 'Credentials', h: '#credentials', run: go('credentials') },
    { g: 'Navigate', t: 'Gallery', h: '#gallery', run: go('gallery') },
    { g: 'Navigate', t: 'Contact', h: '#contact', run: go('contact') },
    { g: 'Actions', t: 'Download CV', h: '.pdf', run: () => { const a = document.createElement('a'); a.href = LINKS.cv; a.download = ''; a.click(); } },
    { g: 'Actions', t: 'Copy email address', h: 'clipboard', run: () => copy(EMAIL, 'Email copied') },
    { g: 'Actions', t: 'Send me an email', h: 'mailto', run: () => { location.href = `mailto:${EMAIL}`; } },
    { g: 'Links', t: 'GitHub', h: '↗', run: open(LINKS.github) },
    { g: 'Links', t: 'LinkedIn', h: '↗', run: open(LINKS.linkedin) },
    { g: 'Links', t: 'Medium', h: '↗', run: open(LINKS.medium) },
    { g: 'Links', t: 'Twitter / X', h: '↗', run: open(LINKS.twitter) },
    { g: 'Theme', t: 'Accent: Cyan', h: 'default', run: () => setAccent('cyan') },
    { g: 'Theme', t: 'Accent: Matrix Green', h: 'green', run: () => setAccent('green') },
    { g: 'Theme', t: 'Accent: Violet', h: 'violet', run: () => setAccent('violet') },
    { g: 'Theme', t: 'Accent: Red Team', h: 'red', run: () => setAccent('red') },
    { g: 'Theme', t: 'Toggle background animation', h: 'fx', run: () => toast(bg.toggle() ? 'Background animation on' : 'Background animation off') },
  ];
  let palItems = [], palSel = 0;
  const renderPal = () => {
    const q = palQ.value.trim().toLowerCase();
    palItems = COMMANDS.filter((c) => !q || `${c.g} ${c.t}`.toLowerCase().includes(q));
    palSel = 0;
    let lastG = '';
    palList.innerHTML = palItems.length
      ? palItems.map((c, i) => {
          const head = c.g !== lastG ? `<div class="pal-group">${c.g}</div>` : '';
          lastG = c.g;
          return `${head}<button class="pal-item" role="option" data-i="${i}" aria-selected="${i === 0}"><span>${c.t}</span><small>${c.h}</small></button>`;
        }).join('')
      : '<div class="pal-empty">No matching command</div>';
  };
  const selectPal = (i) => {
    if (!palItems.length) return;
    palSel = (i + palItems.length) % palItems.length;
    $$('.pal-item', palList).forEach((el, k) => el.setAttribute('aria-selected', String(k === palSel)));
    $$('.pal-item', palList)[palSel].scrollIntoView({ block: 'nearest' });
  };
  const runPal = (i) => { const c = palItems[i]; if (!c) return; pal.close(); setTimeout(c.run, 60); };
  const openPal = () => { palQ.value = ''; renderPal(); pal.showModal(); palQ.focus(); };
  $('#open-palette').addEventListener('click', openPal);
  palQ.addEventListener('input', renderPal);
  palQ.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectPal(palSel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectPal(palSel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
  });
  palList.addEventListener('click', (e) => { const b = e.target.closest('.pal-item'); if (b) runPal(+b.dataset.i); });
  palList.addEventListener('pointermove', (e) => { const b = e.target.closest('.pal-item'); if (b && +b.dataset.i !== palSel) selectPal(+b.dataset.i); });
  pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
  addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); }
    else if (e.key === '/' && !typing && !pal.open) { e.preventDefault(); openPal(); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) $('.kbd-text').textContent = '⌘ K';

  /* ---------- Console easter egg ---------- */
  console.log('%c> faisaljaman.com', 'color:#00e5ff;font:700 16px monospace');
  console.log('%cLooking under the hood? Good instincts. Say hi → ' + EMAIL, 'color:#8d9ab1;font:12px monospace');
})();
