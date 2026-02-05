(function () {
  'use strict';

  var BASE_URL = 'https://cdn.jsdelivr.net/gh/tarekeldeeb/madina_images@w1024';
  var TOTAL = window.MUSHAF_TOTAL || 604;
  var pageInput = document.getElementById('page-input');
  var pageImage = document.getElementById('page-image');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var viewer = document.getElementById('viewer');
  var optBg = document.getElementById('opt-bg');
  var optBorder = document.getElementById('opt-border');
  var mushafFrame = document.getElementById('mushaf-frame');
  var bodyEl = document.body;
  var BG_PREFIX = 'opts-bg-';
  var BORDER_PREFIX = 'opts-border-';
  var STORAGE_BG = 'mushaf-light-bg';
  var STORAGE_BORDER = 'mushaf-light-border';
  var BORDER_VALUES = ['none', 'madani', 'classic', 'luxury'];

  function applyBackground(value) {
    bodyEl.classList.remove(BG_PREFIX + 'default', BG_PREFIX + 'white', BG_PREFIX + 'cream', BG_PREFIX + 'gray', BG_PREFIX + 'green', BG_PREFIX + 'dark');
    bodyEl.classList.add(BG_PREFIX + value);
    try { localStorage.setItem(STORAGE_BG, value); } catch (e) {}
  }

  function applyBorder(value) {
    if (!mushafFrame) return;
    BORDER_VALUES.forEach(function (v) { mushafFrame.classList.remove(BORDER_PREFIX + v); });
    mushafFrame.classList.add(BORDER_PREFIX + value);
    try { localStorage.setItem(STORAGE_BORDER, value); } catch (e) {}
  }

  function initOpts() {
    var savedBg = '';
    var savedBorder = '';
    try {
      savedBg = localStorage.getItem(STORAGE_BG) || 'default';
      savedBorder = localStorage.getItem(STORAGE_BORDER) || 'none';
      if (savedBorder === 'thin' || savedBorder === 'normal') savedBorder = 'classic';
      if (savedBorder === 'thick') savedBorder = 'luxury';
    } catch (e) {}
    if (optBg) {
      optBg.value = savedBg;
      applyBackground(savedBg);
      optBg.addEventListener('change', function () { applyBackground(optBg.value); });
    }
    if (optBorder) {
      optBorder.value = savedBorder;
      applyBorder(savedBorder);
      optBorder.addEventListener('change', function () { applyBorder(optBorder.value); });
    }
  }

  function padPage(n) {
    var s = String(n);
    return s.length >= 3 ? s : ('000').slice(0, 3 - s.length) + s;
  }

  function getPageUrl(page) {
    return BASE_URL + '/w1024_page' + padPage(page) + '.png';
  }

  function getPage() {
    var p = parseInt(pageInput.value, 10);
    if (isNaN(p) || p < 1) return 1;
    if (p > TOTAL) return TOTAL;
    return p;
  }

  function setPage(p) {
    p = Math.max(1, Math.min(TOTAL, p));
    pageInput.value = p;
    pageImage.src = getPageUrl(p);
    pageImage.alt = 'صفحة المصحف ' + p;
    if (typeof history !== 'undefined' && history.replaceState) {
      var url = window.location.pathname + '?p=' + p;
      history.replaceState({ page: p }, '', url);
    }
    prefetchNeighbors(p);
    return p;
  }

  function prefetchNeighbors(current) {
    if (current > 1) {
      var imgPrev = new Image();
      imgPrev.src = getPageUrl(current - 1);
    }
    if (current < TOTAL) {
      var imgNext = new Image();
      imgNext.src = getPageUrl(current + 1);
    }
  }

  function goPrev() {
    var p = getPage();
    if (p > 1) setPage(p - 1);
  }

  function goNext() {
    var p = getPage();
    if (p < TOTAL) setPage(p + 1);
  }

  btnPrev.addEventListener('click', goPrev);
  btnNext.addEventListener('click', goNext);

  pageInput.addEventListener('change', function () {
    setPage(getPage());
  });

  pageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') setPage(getPage());
  });

  document.addEventListener('keydown', function (e) {
    if (e.target === pageInput) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goNext();
    }
  });

  var swipeStartX = 0;
  var swipeEndX = 0;

  viewer.addEventListener('pointerdown', function (e) {
    swipeStartX = e.clientX;
    swipeEndX = e.clientX;
  }, { passive: true });

  viewer.addEventListener('pointermove', function (e) {
    swipeEndX = e.clientX;
  }, { passive: true });

  viewer.addEventListener('pointerup', function (e) {
    var diff = swipeEndX - swipeStartX;
    var threshold = 50;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
  }, { passive: true });

  var initialPage = window.MUSHAF_PAGE || 1;
  setPage(initialPage);
  initOpts();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
  }
})();
