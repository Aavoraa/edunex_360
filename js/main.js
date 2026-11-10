(function () {
  'use strict';

  /* ======================================================================
     PRICING — the single place to edit plans, prices and features.
     Prices are ₹ per active student per year, before GST.
     These prices are SAMPLE values: replace them with your real prices,
     then remove the "Sample prices" flag in index.html (#pricing .sample-flag).
     Each feature is [name, short description shown as a tooltip].
     ====================================================================== */
  var PRICING = {
    plans: [
      {
        id: 'starter', name: 'Starter', price: 300,
        cta: 'Book a demo',
        tagline: 'Small school, getting started',
        features: [
          ['Student 360 records', 'One profile per student: details, guardians, class, documents and history.'],
          ['Enquiries & admissions', 'Log enquiries, follow up and turn applications into enrolled students.'],
          ['Daily attendance', 'Mark class attendance from any device and see the day at a glance.'],
          ['Classes, subjects & timetable', 'Set up classes, sections, subjects and the weekly timetable.'],
          ['Fee structures & collection', 'Class-wise fee structures, counter collection and student accounts.'],
          ['Receipts & payments', 'Printable receipts and a full payment history for every family.'],
          ['Circulars, events & notifications', 'Send school notices and event updates to staff and parents.'],
          ['Parent & student portal', 'Families see their own child’s attendance, fees, notices and results.'],
          ['Data import & export', 'Bring records in from Excel/CSV and export them any time.'],
          ['Standard reports', 'Ready-made reports for admissions, attendance and fees.']
        ]
      },
      {
        id: 'standard', name: 'Standard', price: 500,
        cta: 'Book a demo',
        tagline: 'Growing school, running the day online',
        includes: 'Everything in Starter, plus:',
        features: [
          ['Homework & lesson plans', 'Teachers plan lessons and share homework with each class.'],
          ['Assessments & report cards', 'Mark entry, grading and printable report cards.'],
          ['Board syllabus & grading', 'CBSE, ICSE, Cambridge IGCSE, IB, NIOS and Matric syllabus, outcomes and grading.'],
          ['Staff directory, leave & attendance', 'Teaching and non-teaching staff records, leave requests and attendance.'],
          ['Payroll & payslips', 'Monthly salaries, allowances, deductions and payslips.'],
          ['Concessions & scholarships', 'Apply fee concessions and track scholarships per student.'],
          ['PTM & parent communication', 'Schedule parent–teacher meetings and keep a parent contact log.'],
          ['Certificates with QR verification', 'Issue certificates anyone can verify by scanning a QR code.'],
          ['Android app', 'A native Android app for staff, parents and students.'],
          ['Staff self-service', 'Staff see their own attendance, leave, payslips and tasks.']
        ]
      },
      {
        id: 'professional', name: 'Professional', price: 800, popular: true,
        cta: 'Book a demo',
        tagline: 'Busy campus, needs AI and safety',
        includes: 'Everything in Standard, plus:',
        features: [
          ['AI paper correction', 'AI reads handwritten answer sheets and suggests marks; teachers approve every mark.', true],
          ['AI Teacher Co-Pilot', 'An AI assistant that helps teachers plan, explain and prepare.', true],
          ['GPS bus & student tracking', 'Live maps, routes and location history; parents see only their own child.'],
          ['Smart gate & pickup authorisation', 'Gate entry/exit logs and approved adults for student pickup.'],
          ['Visitor management', 'Register, badge and track every visitor on campus.'],
          ['Admissions CRM & analytics', 'Leads, counselling pipeline, campus visits, referrals and conversion analytics.'],
          ['Behaviour, wellbeing & early warning', 'Spot students who need support before small issues grow.'],
          ['Health, infirmary & counselling', 'Medical visits, health records and counselling notes.'],
          ['Expenses, budgets & reconciliation', 'Track spending against budgets and reconcile accounts.'],
          ['Facilities, assets & job cards', 'Maintenance requests, assets and inventory, tracked to closure.'],
          ['Command Center dashboards', 'Live leadership dashboards across admissions, academics, fees and safety.']
        ]
      },
      {
        id: 'enterprise', name: 'Enterprise', price: 1100,
        cta: 'Talk to us',
        tagline: 'School groups and multi-campus',
        includes: 'Everything in Professional, plus:',
        features: [
          ['Multi-campus management', 'Run every campus from one platform with shared settings.'],
          ['Group dashboard & campus comparison', 'Compare campuses side by side on the numbers that matter.'],
          ['Transfers between campuses', 'Move students and staff between campuses with their full records.'],
          ['Group policies', 'Set policies once and apply them across the group.'],
          ['School Knowledge AI', 'Ask questions of your school’s own policies and documents.', true],
          ['Innovation lab & talent discovery', 'Student ideas, projects, mentors, competitions and achievements.'],
          ['Compliance calendar & audit trail', 'Statutory deadlines plus a record of who changed what, and when.'],
          ['Custom roles & approvals', 'Your own roles, permissions and multi-step approval flows.'],
          ['REST API access', 'Connect your own tools to the same API the web and mobile apps use.'],
          ['Priority support', 'A named contact and faster response times.']
        ]
      }
    ],
    addons: { website: 12000, app: 18000 }
  };

  var inr = function (n) { return '₹' + Math.round(Number(n)).toLocaleString('en-IN'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Year ------------------------------------------------------------ */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Mobile menu ----------------------------------------------------- */
  var menuBtn = $('.nav__menu');
  var links = $('#nav-links');
  function setMenu(open) {
    links.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.nav')) setMenu(false); });
  }

  /* ---- Tabs (ARIA tablist with arrow keys) ----------------------------- */
  $$('[data-tabs]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---- Pricing cards --------------------------------------------------- */
  var plansEl = $('[data-plans]');
  var check = '<svg class="ico plan__tick" aria-hidden="true"><use href="#i-check"/></svg>';
  var spark = '<svg class="ico plan__ai" aria-label="AI feature" role="img"><use href="#i-sparkle"/></svg>';

  if (plansEl) {
    plansEl.innerHTML = PRICING.plans.map(function (p) {
      var feats = p.features.map(function (f, i) {
        var tipId = 'tip-' + p.id + '-' + i;
        return '<li tabindex="0" aria-describedby="' + tipId + '">' + check +
          '<span class="plan__feat">' + esc(f[0]) + (f[2] ? spark : '') + '</span>' +
          '<span class="tip" role="tooltip" id="' + tipId + '">' + esc(f[1]) + '</span></li>';
      }).join('');
      return '<article class="plan' + (p.popular ? ' plan--best' : '') + '" aria-labelledby="plan-' + p.id + '">' +
        (p.popular ? '<span class="plan__badge">Most popular</span>' : '') +
        '<h3 class="plan__name" id="plan-' + p.id + '">' + p.name + '</h3>' +
        '<div class="plan__price"><span class="plan__cur">₹</span>' + Number(p.price).toLocaleString('en-IN') + '</div>' +
        '<div class="plan__unit">/student/year</div>' +
        '<a href="#demo" class="btn ' + (p.popular ? 'btn--accent' : 'btn--ghost') + ' plan__cta" data-plan="' + p.id + '">' + p.cta + '</a>' +
        '<p class="plan__tagline">' + esc(p.tagline) + '</p>' +
        (p.includes ? '<p class="plan__includes">' + esc(p.includes) + '</p>' : '') +
        '<ul class="plan__list">' + feats + '</ul>' +
      '</article>';
    }).join('');
  }

  // Lowest price in the hero, add-on prices
  var from = $('[data-from-price]');
  if (from) from.textContent = inr(Math.min.apply(null, PRICING.plans.map(function (p) { return p.price; })));
  $$('[data-addon-price]').forEach(function (el) { el.textContent = inr(PRICING.addons[el.getAttribute('data-addon-price')]); });
  $$('[data-addon-label]').forEach(function (el) { el.textContent = '+' + inr(PRICING.addons[el.getAttribute('data-addon-label')]); });

  /* ---- Estimator ------------------------------------------------------- */
  var planSel = $('[data-est="plan"]');
  var studentsIn = $('[data-est="students"]');
  var formPlans = $('[data-form-plans]');
  PRICING.plans.forEach(function (p) {
    if (planSel) planSel.add(new Option(p.name + ' · ' + inr(p.price) + '/student', p.id, false, !!p.popular));
    if (formPlans) formPlans.add(new Option(p.name, p.name));
  });

  function estimate() {
    if (!planSel) return;
    var plan = PRICING.plans.filter(function (p) { return p.id === planSel.value; })[0] || PRICING.plans[0];
    var n = Math.max(0, Math.floor(Number(studentsIn.value) || 0));
    var soft = plan.price * n;
    var addons = $$('[data-est-addon]').reduce(function (sum, c) { return sum + (c.checked ? PRICING.addons[c.getAttribute('data-est-addon')] : 0); }, 0);

    $('[data-est-total]').textContent = inr(soft + addons);
    $('[data-est-sub]').textContent = 'First year · before GST';
    $('[data-est-soft-label]').textContent = plan.name + ' · ' + n.toLocaleString('en-IN') + ' students';
    $('[data-est-soft]').textContent = inr(soft) + '/year';
    $('[data-est-rate]').textContent = inr(plan.price) + ' per student';
    $('[data-est-add]').textContent = inr(addons);
    $('[data-est-after]').textContent = inr(soft) + '/year';
  }
  $$('#estimate select, #estimate input').forEach(function (el) {
    el.addEventListener('change', estimate);
    el.addEventListener('input', estimate);
  });
  estimate();

  // Carry the chosen plan into the demo form
  function presetForm(planId) {
    var p = PRICING.plans.filter(function (x) { return x.id === planId; })[0];
    if (p && formPlans) formPlans.value = p.name;
  }
  document.addEventListener('click', function (e) {
    var plan = e.target.closest('[data-plan]');
    if (plan) presetForm(plan.getAttribute('data-plan'));
    if (e.target.closest('[data-est-cta]') && planSel) presetForm(planSel.value);
  });

  /* ---- Reveal on scroll ------------------------------------------------ */
  var items = $$('.card, .journey li, .addon, .value, .faq details');
  items.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Chalk doodles: a stick of chalk draws each one, stroke by stroke ---------
     Each doodle's <use> is swapped for real copies of its symbol's shapes,
     so the script can measure every stroke and move the chalk along it.
     When a doodle is finished it gets .is-floating (idle motion in CSS).
     ---------------------------------------------------------------------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  // Inline each doodle's symbol so its strokes are real, measurable elements.
  var doodles = $$('.chalk-art, .doodle');   // the hero classroom art first, then the doodles
  doodles.forEach(function (svg) {
    var use = $('use', svg);
    var sym = use && document.getElementById((use.getAttribute('href') || '').slice(1));
    if (!sym) return;
    svg.setAttribute('viewBox', sym.getAttribute('viewBox'));
    Array.prototype.slice.call(sym.childNodes).forEach(function (n) {
      var c = n.cloneNode(true);
      if (c.removeAttribute) c.removeAttribute('pathLength');
      svg.appendChild(c);
    });
    svg.removeChild(use);
  });

  function strokesOf(svg) {
    return $$('path, rect, circle, ellipse, line, polyline', svg).filter(function (el) {
      return typeof el.getTotalLength === 'function';
    });
  }
  function finish(svg) {
    if (svg._scribble) {                       // classroom: drop the mask and the scribble marks
      svg._scribble.wrap.removeAttribute('mask');
      if (svg._scribble.line.parentNode) svg._scribble.line.parentNode.removeChild(svg._scribble.line);
      svg._scribble = null;
    } else {
      strokesOf(svg).forEach(function (el) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; el.style.opacity = ''; });
    }
    svg.style.clipPath = 'none';
    svg.classList.add('is-drawn', 'is-floating');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    doodles.forEach(function (svg) { svg.classList.add('is-ready'); finish(svg); });
  } else {
    /* The hero picture is revealed by a scribble: a zig-zag chalk path that sweeps
       diagonally from the top-left corner to the bottom-right. A wide copy of it is a
       mask that uncovers the picture; a thin, visible copy shows the chalk marks, which
       fade once the picture is complete. */
    function setupScribble(svg, idx) {
      var vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
      var rnd = function (a, b) { return a + Math.random() * (b - a); };
      // Work in rotated coordinates: u runs along the diagonal (top-left -> bottom-right),
      // v runs across it. Each scribble stroke goes back and forth along v.
      var cx0 = W / 2, cy0 = H / 2, R = Math.SQRT1_2, S2 = Math.SQRT2;
      var toXY = function (u, v) { return ((cx0 + (u - v) * R).toFixed(1)) + ' ' + ((cy0 + (u + v) * R).toFixed(1)); };
      // The span of v at a given u that stays inside the picture (plus a small margin m),
      // so the chalk never wanders off over the page text.
      var vRange = function (u, m) {
        var lo = Math.max(u - S2 * (W + m - cx0), S2 * (-m - cy0) - u);
        var hi = Math.min(u + S2 * (cx0 + m), S2 * (H + m - cy0) - u);
        return lo <= hi ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2];
      };
      var uEnd = (W + H) / (2 * S2) + 12;
      var u = -uEnd, up = true, step = 0;
      var r0 = vRange(u, 8), v = r0[1];
      var d = 'M ' + toXY(u, v);
      // Uneven strokes: varied spacing, bowed curves, ends that overshoot by different amounts,
      // and now and then a step back, like a hand scribbling quickly.
      while (u < uEnd) {
        step = rnd(9, 19);
        var u2 = u + (Math.random() < 0.12 ? -step * 0.5 : step);
        var r = vRange(u2, 8);
        var v2 = up ? r[0] - rnd(0, 14) : r[1] + rnd(0, 14);
        var c1 = toXY(u + rnd(-14, 14), v + (v2 - v) * rnd(0.25, 0.4));
        var c2 = toXY(u2 + rnd(-14, 14), v + (v2 - v) * rnd(0.6, 0.75));
        d += ' C ' + c1 + ' ' + c2 + ' ' + toXY(u2, v2);
        u = Math.max(u, u2); v = v2; up = !up;
      }
      step = 19;
      var id = 'chalk-reveal-' + idx;
      var defs = document.createElementNS(SVGNS, 'defs');
      var mask = document.createElementNS(SVGNS, 'mask');
      mask.setAttribute('id', id);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      mask.setAttribute('x', -120); mask.setAttribute('y', -240);
      mask.setAttribute('width', W + 240); mask.setAttribute('height', H + 480);
      var wide = document.createElementNS(SVGNS, 'path');
      wide.setAttribute('d', d);
      wide.setAttribute('stroke', '#fff');
      wide.setAttribute('stroke-width', String(step * 2.6));
      mask.appendChild(wide);
      defs.appendChild(mask);
      var wrap = document.createElementNS(SVGNS, 'g');
      wrap.setAttribute('mask', 'url(#' + id + ')');
      Array.prototype.slice.call(svg.childNodes).forEach(function (n) { wrap.appendChild(n); });
      var line = document.createElementNS(SVGNS, 'path');
      line.setAttribute('d', d);
      line.setAttribute('class', 'scribble');
      svg.appendChild(defs);
      svg.appendChild(wrap);
      svg.appendChild(line);
      var len = line.getTotalLength();
      [wide, line].forEach(function (p) { p.style.strokeDasharray = len + ' ' + len; p.style.strokeDashoffset = String(len); });
      svg._scribble = { wide: wide, line: line, wrap: wrap, len: len };
    }

    // Hide every stroke until its turn.
    doodles.forEach(function (svg, i) {
      if (svg.classList.contains('chalk-art')) { setupScribble(svg, i); svg.classList.add('is-ready'); return; }
      strokesOf(svg).forEach(function (el) {
        if (el.getAttribute('stroke-dasharray')) { el.style.opacity = '0'; return; } // dotted trails fade in
        var len = el.getTotalLength();
        el._len = len;
        el.style.strokeDasharray = len + ' ' + len;
        el.style.strokeDashoffset = String(len);
      });
      svg.classList.add('is-ready');
    });

    // A stick of chalk; its tip sits at (6,74) in a 80x80 box.
    var hand = document.createElement('div');
    hand.className = 'chalk-hand';
    hand.setAttribute('aria-hidden', 'true');
    hand.innerHTML = '<svg viewBox="0 0 80 80" width="80" height="80">' +
      '<path d="M7 73 33 47" stroke="#d9d6cb" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M7 73 33 47" stroke="#f4f2ea" stroke-width="6.5" stroke-linecap="round"/>' +
      '<path d="M12 65 30 47" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>' +
      '<ellipse cx="33" cy="47" rx="4.5" ry="3.2" transform="rotate(-45 33 47)" fill="#e7e4d8" stroke="#c9c6bb" stroke-width=".8"/>' +
      '<circle cx="6" cy="74" r="3.2" fill="#ffffff"/>' +
      '</svg>';
    document.body.appendChild(hand);
    var TIP_X = 6, TIP_Y = 74;
    var handAt = { x: 0, y: 0 }, handShown = false;

    function placeHand(x, y) {
      handAt.x = x; handAt.y = y;
      hand.style.transform = 'translate(' + (x - TIP_X) + 'px,' + (y - TIP_Y) + 'px)';
    }
    function showHand(on) {
      if (on === handShown) return;
      handShown = on;
      hand.classList.toggle('is-on', on);
    }
    // Point on a stroke, in page coordinates.
    function pagePoint(el, at) {
      var pt = el.getPointAtLength(at);
      var m = el.getScreenCTM();
      return { x: m.a * pt.x + m.c * pt.y + m.e + window.scrollX, y: m.b * pt.x + m.d * pt.y + m.f + window.scrollY };
    }
    function tween(ms, step) {
      return new Promise(function (resolve) {
        var t0 = null;
        function frame(now) {
          if (t0 === null) t0 = now;
          var t = Math.min(1, (now - t0) / ms);
          step(t);
          if (t < 1) requestAnimationFrame(frame); else resolve();
        }
        requestAnimationFrame(frame);
      });
    }
    function moveHandTo(x, y, ms) {
      var sx = handAt.x, sy = handAt.y;
      if (!handShown) { placeHand(x, y); showHand(true); return Promise.resolve(); }
      return tween(ms, function (t) { var e = t * (2 - t); placeHand(sx + (x - sx) * e, sy + (y - sy) * e); });
    }
    function onScreen(svg) {
      var r = svg.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }

    // speed: screen pixels per millisecond; lift: ms to move the chalk to the next stroke;
    // shortest: the minimum time for one stroke
    function drawStroke(el, speed, lift, shortest) {
      var dotted = el.getAttribute('stroke-dasharray');
      var len = dotted ? el.getTotalLength() : el._len;
      var start = pagePoint(el, 0);
      var scale = Math.abs(el.getScreenCTM().a) || 1;
      var ms = Math.max(shortest, Math.min(900, (len * scale) / speed));
      return moveHandTo(start.x, start.y, lift).then(function () {
        return tween(ms, function (t) {
          var at = len * t;
          if (dotted) el.style.opacity = String(t);
          else el.style.strokeDashoffset = String(len - at);
          var p = pagePoint(el, at);
          placeHand(p.x, p.y);
        });
      });
    }
    function writeText(svg) {
      var r = svg.getBoundingClientRect();
      var y = r.top + window.scrollY + r.height * 0.72;
      var x0 = r.left + window.scrollX + 4, x1 = r.right + window.scrollX - 4;
      return moveHandTo(x0, y, 160).then(function () {
        return tween(Math.max(700, (x1 - x0) * 6), function (t) {
          svg.style.clipPath = 'inset(0 ' + ((1 - t) * 100).toFixed(1) + '% 0 0)';
          placeHand(x0 + (x1 - x0) * t, y + Math.sin(t * 40) * 3);
        });
      });
    }
    // Sweep the chalk from top-left to bottom-right, uncovering the picture behind it.
    // The path it follows is invisible (no scribble marks); only the chalk shows.
    function scribbleReveal(svg) {
      var sc = svg._scribble, len = sc.len;
      var start = pagePoint(sc.line, 0);
      return moveHandTo(start.x, start.y, 160).then(function () {
        return tween(4600, function (t) {
          sc.wide.style.strokeDashoffset = String(len * (1 - t));
          var p = pagePoint(sc.line, len * t);
          placeHand(p.x, p.y);
        });
      }).then(function () { showHand(false); });
    }
    function drawDoodle(svg) {
      if (!onScreen(svg)) { finish(svg); return Promise.resolve(); } // scrolled away: just show it
      svg.classList.add('is-drawing');
      var job = svg._scribble
        ? scribbleReveal(svg)
        : svg.classList.contains('doodle--text')
          ? writeText(svg)
          : strokesOf(svg).reduce(function (chain, el) { return chain.then(function () { return drawStroke(el, 0.42, 160, 110); }); }, Promise.resolve());
      return job.then(function () { svg.classList.remove('is-drawing'); finish(svg); });
    }

    // One piece of chalk, so doodles are drawn one after another as they come into view.
    var queue = [], busy = false;
    function next() {
      if (busy) return;
      var svg = queue.shift();
      if (!svg) { showHand(false); return; }
      busy = true;
      drawDoodle(svg).then(function () { busy = false; setTimeout(next, 120); });
    }
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.classList.contains('chalk-art')) queue.unshift(en.target); else queue.push(en.target);
        dio.unobserve(en.target);
      });
      next();
    }, { rootMargin: '0px 0px -12% 0px' });
    doodles.forEach(function (d) { dio.observe(d); });

    /* Scroll depth for the classroom: each layer drifts up at its own speed
       (board slowest, bubble/bulb/stars fastest), with a slight tilt. */
    var layers = $$('.chalk-art .layer');
    var hero = $('.hero');
    var ticking = false;
    function parallax() {
      ticking = false;
      var y = window.scrollY;
      if (!hero || y > hero.offsetHeight + 200) return;
      layers.forEach(function (g) {
        var depth = parseFloat(g.getAttribute('data-depth')) || 0;
        g.style.transform = 'translate(0px,' + (-y * depth).toFixed(1) + 'px) rotate(' + (y * depth * 0.02).toFixed(2) + 'deg)';
      });
    }
    if (layers.length) {
      layers.forEach(function (g) { g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center'; });
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
      }, { passive: true });
      parallax();
    }
  }

  /* ---- Demo form --------------------------------------------------------
     No backend is connected yet: the form checks the phone number and shows
     a thank-you message. To receive enquiries, send `data` to your form
     endpoint (or email service) where marked below.
     ---------------------------------------------------------------------- */
  var form = $('#enquiry');
  if (form) {
    var error = $('.form__error', form);
    var done = $('.form__done', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = form.elements.phone;
      var digits = phone.value.replace(/\D/g, '');
      var ok = digits.length >= 10 && digits.length <= 13;
      phone.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) {
        error.textContent = 'Please enter a valid mobile or WhatsApp number.';
        error.hidden = false;
        phone.focus();
        return;
      }
      error.hidden = true;
      var data = Object.fromEntries(new FormData(form).entries()); // eslint-disable-line no-unused-vars
      // TODO: send `data` to your enquiry endpoint here.
      $('button[type="submit"]', form).hidden = true;
      done.hidden = false;
    });
  }
})();
