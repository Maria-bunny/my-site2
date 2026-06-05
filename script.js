(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var page = document.body.getAttribute('data-page');
  if (page) {
    var active = document.querySelector('.nav__link[data-page="' + page + '"]');
    if (active) active.classList.add('active');
  }

  if (page === 'home') {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  var track = document.getElementById('carouselTrack');
  if (track) {
    var dots = document.getElementById('carouselDots');
    var prev = document.getElementById('carouselPrev');
    var next = document.getElementById('carouselNext');
    var slides = track.querySelectorAll('.carousel__slide');
    var current = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Шаг ' + (i + 1));
      dot.addEventListener('click', function () { go(i); reset(); });
      dots.appendChild(dot);
    });

    function go(n) {
      current = ((n % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.querySelectorAll('.carousel__dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function reset() { clearInterval(timer); timer = setInterval(function () { go(current + 1); }, 6000); }

    if (prev) prev.addEventListener('click', function () { go(current - 1); reset(); });
    if (next) next.addEventListener('click', function () { go(current + 1); reset(); });
    reset();
  }

  var productDetails = {
    'Рассвет': 'Дневной крем с экстрактом ромашки и маслом ши. Объём: 50 мл.',
    'Вечерняя роса': 'Ночной крем с маслом жожоба и витамином E. Объём: 50 мл.',
    'Лунный нектар': 'Ночная сыворотка с растительной гиалуроновой кислотой. Объём: 30 мл.',
    'Травяной бриз': 'Шампунь без сульфатов с экстрактами крапивы и алоэ. Объём: 250 мл.',
    'Земляная глина': 'Очищающая маска на основе голубой глины. Объём: 75 мл.',
    'Медовый цвет': 'Бальзам для губ с пчелиным воском. Объём: 15 мл.'
  };

  var modal = document.getElementById('productModal');
  if (modal) {
    var backdrop = document.getElementById('modalBackdrop');
    var closeBtn = document.getElementById('modalClose');
    var modalTitle = document.getElementById('modalTitle');
    var modalText = document.getElementById('modalText');

    document.querySelectorAll('.product-card__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-product');
        modalTitle.textContent = name;
        modalText.textContent = productDetails[name] || '';
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var success = document.getElementById('formSuccess');

      function setErr(id, errId, msg) {
        document.getElementById(id).classList.add('error');
        document.getElementById(errId).textContent = msg;
        ok = false;
      }

      if (!name.value.trim()) setErr('name', 'nameError', 'Введите имя');
      else { name.classList.remove('error'); document.getElementById('nameError').textContent = ''; }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) setErr('email', 'emailError', 'Введите email');
      else { email.classList.remove('error'); document.getElementById('emailError').textContent = ''; }

      if (!message.value.trim()) setErr('message', 'messageError', 'Напишите сообщение');
      else { message.classList.remove('error'); document.getElementById('messageError').textContent = ''; }

      if (ok) {
        success.hidden = false;
        form.reset();
        setTimeout(function () { success.hidden = true; }, 5000);
      }
    });
  }

  var downloadBtn = document.getElementById('downloadBrandbook');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = 'PureBloom Brandbook\n\nСлоган: Природа в каждой капле\nЦвета: #5C7A56, #A8C5A0, #F5F0E8\nШрифты: Cormorant Garamond, Nunito Sans\n\n© 2025 PureBloom';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      a.download = 'PureBloom-Brandbook.txt';
      a.click();
    });
  }
})();
