/* =========================================================
   AATMIKX — SMOOTH INTERACTIONS
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


/* =========================================================
   NAVBAR
========================================================= */

const navbar = $('#navbar');

function updateNavbar(){
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateNavbar, {passive:true});
updateNavbar();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
const mobileLinks = $$('.mobile-menu a');

function closeMobileMenu(){
  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.remove('active');
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

function openMobileMenu(){
  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.add('active');
  mobileMenu.classList.add('open');
  menuToggle.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}

menuToggle?.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor = $('#cursor');
const ring = $('#cursor-ring');

if (
  cursor &&
  ring &&
  window.matchMedia('(pointer:fine)').matches
) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }, {passive:true});

  function animateCursor(){
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  const cursorTargets = $$(
    'a,button,.skill-card,.game-card,.stat-box,.role-pill'
  );

  cursorTargets.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform =
        'translate(-50%,-50%) scale(1.7)';

      ring.style.transform =
        'translate(-50%,-50%) scale(1.4)';

      ring.style.opacity = '1';
    });

    element.addEventListener('mouseleave', () => {
      cursor.style.transform =
        'translate(-50%,-50%) scale(1)';

      ring.style.transform =
        'translate(-50%,-50%) scale(1)';

      ring.style.opacity = '.55';
    });
  });
}


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements = $$('.reveal,.reveal-left,.reveal-right');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});


/* =========================================================
   SKILL BARS
========================================================= */

const bars = $$('.bar-fill');
let barsAnimated = false;

function animateBars(){
  if (barsAnimated) return;

  barsAnimated = true;

  bars.forEach(bar => {
    const width = bar.dataset.w;

    if (width) {
      requestAnimationFrame(() => {
        bar.style.width = `${width}%`;
      });
    }
  });
}

const skillBars = $('#skillBars');

if (skillBars) {
  const barObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        animateBars();
        barObserver.disconnect();
      }
    },
    {threshold:0.25}
  );

  barObserver.observe(skillBars);
}


/* =========================================================
   HERO PARALLAX
========================================================= */

const hero = $('#hero');
const heroGrid = $('.hero-grid');
const heroDeco = $('.hero-deco');

let parallaxTicking = false;

function updateParallax(){
  if (!hero || window.innerWidth < 900) {
    parallaxTicking = false;
    return;
  }

  const y = Math.min(window.scrollY, hero.offsetHeight);

  if (heroGrid) {
    heroGrid.style.transform = `translate3d(0,${y * 0.18}px,0)`;
  }

  if (heroDeco) {
    heroDeco.style.transform =
      `translate3d(0,calc(-50% + ${y * 0.10}px),0)`;
  }

  parallaxTicking = false;
}

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
}, {passive:true});


/* =========================================================
   HERO VIDEO
========================================================= */

const heroVideo = $('#hero-video');

if (heroVideo) {
  heroVideo.muted = true;

  const playHeroVideo = async () => {
    try {
      await heroVideo.play();
    } catch (error) {
      // Browser may block autoplay. Nothing to do.
    }
  };

  playHeroVideo();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      heroVideo.pause();
    } else {
      playHeroVideo();
    }
  });
}


/* =========================================================
   ABOUT VIDEO SLIDER
========================================================= */

const slides = $$('.slide');

if (slides.length) {
  let currentSlide = 0;

  const playSlide = async video => {
    try {
      video.currentTime = 0;
      await video.play();
    } catch (error) {
      // Autoplay can be blocked by some browsers.
    }
  };

  const nextSlide = () => {
    const current = slides[currentSlide];

    current.classList.remove('active');
    current.pause();

    currentSlide =
      (currentSlide + 1) % slides.length;

    const next = slides[currentSlide];

    next.classList.add('active');
    playSlide(next);
  };

  slides.forEach(video => {
    video.addEventListener('ended', nextSlide);
  });

  playSlide(slides[0]);
}


/* =========================================================
   COPY GAME IDS
========================================================= */

$$('.copy-btn').forEach(button => {
  button.addEventListener('click', async () => {

    const value = button.dataset.copy;

    if (!value) return;

    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(value);

      button.textContent = 'Copied!';

      setTimeout(() => {
        button.textContent = original;
      }, 1200);

    } catch (error) {

      // Fallback for older browsers.
      const textarea = document.createElement('textarea');

      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);

      textarea.select();

      try {
        document.execCommand('copy');
        button.textContent = 'Copied!';

        setTimeout(() => {
          button.textContent = original;
        }, 1200);

      } catch (fallbackError) {
        button.textContent = 'Copy failed';

        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      }

      textarea.remove();
    }
  });
});


/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */

$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {

    const id = link.getAttribute('href');

    if (!id || id === '#') return;

    const target = document.querySelector(id);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});
