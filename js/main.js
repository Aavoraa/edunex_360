(function () {
  'use strict';

  /* ======================================================================
     PRICING — the single place to edit prices (₹, before GST).
     These are SAMPLE values: replace them with your real prices, then
     remove the "Sample prices" flag in index.html (#pricing .sample-flag).
     ====================================================================== */
  var PRICING = {
    tiers: [
      { id: 't1', size: 'Up to 300',   yearly: 12000, once: 40000 },
      { id: 't2', size: '301 – 750',   yearly: 20000, once: 65000, best: true },
      { id: 't3', size: '751 – 1,500', yearly: 30000, once: 95000 },
      { id: 't4', size: '1,501 – 3,000', yearly: 45000, once: 140000 }
    ],
    addons: { website: 12000, app: 18000 },
    // Yearly cost after year one for a one-time licence (support & updates), or 0 if none.
    onceRenewal: 0
  };

  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
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
  var note = $('[data-model-note]');
  var NOTES = {
    yearly: 'Lower upfront cost. Pay each year for the software, with support and updates while subscribed.',
    once: 'One payment for the agreed version of the software. Ongoing support and future upgrades are quoted separately.'
  };
  var check = '<svg class="ico"><use href="#i-check"/></svg>';

  function renderPlans(model) {
    if (!plansEl) return;
    plansEl.innerHTML = PRICING.tiers.map(function (t) {
      var price = model === 'yearly' ? t.yearly : t.once;
      var renew = model === 'yearly'
        ? 'Renews at ' + inr(t.yearly) + '/year for the same size.'
        : (PRICING.onceRenewal ? 'Optional support from ' + inr(PRICING.onceRenewal) + '/year.' : 'Support after setup is quoted separately.');
      return '<article class="plan' + (t.best ? ' plan--best' : '') + '">' +
        (t.best ? '<span class="plan__badge">Most chosen</span>' : '') +
        '<div class="plan__size">' + t.size + '</div>' +
        '<div class="plan__unit">active students · one campus</div>' +
        '<div class="plan__price">' + inr(price) + (model === 'yearly' ? ' <small>/ year</small>' : ' <small>one-time</small>') + '</div>' +
        '<div class="plan__gst">GST extra</div>' +
        '<ul>' +
          '<li>' + check + 'All core school modules</li>' +
          '<li>' + check + 'Setup and remote staff training</li>' +
          '<li>' + check + (model === 'yearly' ? 'Support and updates while subscribed' : 'Licence for the agreed version') + '</li>' +
        '</ul>' +
        '<p class="plan__renew">' + renew + '</p>' +
        '<a href="#demo" class="btn ' + (t.best ? 'btn--gold' : 'btn--ghost') + '" data-plan="' + t.id + '">Discuss this plan</a>' +
      '</article>';
    }).join('');
    if (note) note.textContent = NOTES[model];
  }

  var switchBtns = $$('.switch [data-model]');
  switchBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      switchBtns.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
      renderPlans(b.getAttribute('data-model'));
    });
  });
  renderPlans('yearly');

  // Lowest yearly price in the hero, add-on prices
  var from = $('[data-from-price]');
  if (from) from.textContent = inr(Math.min.apply(null, PRICING.tiers.map(function (t) { return t.yearly; })));
  $$('[data-addon-price]').forEach(function (el) { el.textContent = inr(PRICING.addons[el.getAttribute('data-addon-price')]); });
  $$('[data-addon-label]').forEach(function (el) { el.textContent = '+' + inr(PRICING.addons[el.getAttribute('data-addon-label')]); });

  /* ---- Estimator ------------------------------------------------------- */
  var tierSel = $('[data-est="tier"]');
  var formTiers = $('[data-form-tiers]');
  PRICING.tiers.forEach(function (t) {
    if (tierSel) tierSel.add(new Option(t.size + ' students', t.id, false, !!t.best));
    if (formTiers) formTiers.add(new Option(t.size, t.size));
  });
  if (formTiers) formTiers.add(new Option('More than 3,000 / several campuses', 'More than 3,000'));

  function estimate() {
    if (!tierSel) return;
    var tier = PRICING.tiers.filter(function (t) { return t.id === tierSel.value; })[0] || PRICING.tiers[0];
    var model = ($('input[name="est-model"]:checked') || {}).value || 'yearly';
    var addons = $$('[data-est-addon]').reduce(function (sum, c) { return sum + (c.checked ? PRICING.addons[c.getAttribute('data-est-addon')] : 0); }, 0);
    var soft = model === 'yearly' ? tier.yearly : tier.once;
    var after = model === 'yearly' ? tier.yearly : PRICING.onceRenewal;

    $('[data-est-total]').textContent = inr(soft + addons);
    $('[data-est-sub]').textContent = model === 'yearly' ? 'First year · before GST' : 'One-time · before GST';
    $('[data-est-soft-label]').textContent = model === 'yearly' ? 'Software subscription' : 'One-time licence';
    $('[data-est-soft]').textContent = inr(soft) + (model === 'yearly' ? '/year' : '');
    $('[data-est-add]').textContent = inr(addons);
    $('[data-est-after]').textContent = after ? inr(after) + '/year' : 'Quoted separately';
  }
  $$('#estimate select, #estimate input').forEach(function (el) { el.addEventListener('change', estimate); });
  estimate();

  // Carry the chosen size into the demo form
  function presetForm(tierId) {
    var t = PRICING.tiers.filter(function (x) { return x.id === tierId; })[0];
    if (t && formTiers) formTiers.value = t.size;
  }
  document.addEventListener('click', function (e) {
    var plan = e.target.closest('[data-plan]');
    if (plan) presetForm(plan.getAttribute('data-plan'));
    if (e.target.closest('[data-est-cta]') && tierSel) presetForm(tierSel.value);
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
