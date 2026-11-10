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

  /* ---- Theme toggle ---------------------------------------------------- */
  var root = document.documentElement;
  var themeBtn = $('.theme-toggle');
  function paintThemeBtn() {
    var light = root.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    $('use', themeBtn).setAttribute('href', light ? '#i-moon' : '#i-sun');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#f4f0e8' : '#0a0909');
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('edunex-theme', next); } catch (e) { /* storage blocked: theme just isn't remembered */ }
      paintThemeBtn();
    });
  }

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
        '<a href="#demo" class="btn ' + (p.popular ? 'btn--gold' : 'btn--ghost') + ' plan__cta" data-plan="' + p.id + '">' + p.cta + '</a>' +
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
