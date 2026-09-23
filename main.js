/**
 * LUGGAGE PASS - Main Application Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCardTilt();
  initPricingSync();
  initVoucherSimulator();
  initBackToTop();
});

/* 1. Navbar Scroll Effect & Mobile Menu */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        navMenu.classList.remove('is-open');
      });
    });
  }
}

/* 2. Scroll-triggered IntersectionObserver Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || 0, 10);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => {
    el.classList.add('will-animate');
    observer.observe(el);
  });
}

/* 3. 3D Tilt Effect on Feature Cards (Desktop Only) */
function initCardTilt() {
  if (window.innerWidth <= 1024) return;

  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* 4. Pricing Buttons ↔ Apply Plan Auto-selection */
function initPricingSync() {
  const planButtons = document.querySelectorAll('.pricing-card__btn');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planValue = btn.getAttribute('data-plan');
      if (planValue) {
        const targetRadio = document.querySelector(`input[name="plan"][value="${planValue}"]`);
        if (targetRadio) {
          targetRadio.checked = true;
          updatePriceDisplay(planValue);
        }
      }
    });
  });
}

/* 5. Pre-Voucher Simulator & Modal */
const planMeta = {
  DAY: { price: '₩20,000', title: 'DAY PASS (당일권)', validity: '1 Day Pass' },
  STAY: { price: '₩35,000', title: 'STAY PASS (3일권 · 추천)', validity: 'Up to 3 Days' },
  PREMIUM: { price: '₩50,000', title: 'PREMIUM VIP PASS (전일정)', validity: 'Up to 7 Days' }
};

function updatePriceDisplay(planKey) {
  const priceEl = document.getElementById('summary-price');
  if (priceEl && planMeta[planKey]) {
    priceEl.textContent = planMeta[planKey].price;
  }
}

function initVoucherSimulator() {
  const radios = document.querySelectorAll('input[name="plan"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updatePriceDisplay(e.target.value);
    });
  });
}

window.showVoucherModal = function() {
  const checkedRadio = document.querySelector('input[name="plan"]:checked');
  const planKey = checkedRadio ? checkedRadio.value : 'STAY';
  const meta = planMeta[planKey];

  const modal = document.getElementById('voucher-modal');
  const planTitle = document.getElementById('voucher-plan-title');
  const planPrice = document.getElementById('voucher-plan-price');
  const planCode = document.getElementById('voucher-code');

  if (planTitle) planTitle.textContent = meta.title;
  if (planPrice) planPrice.textContent = meta.price;
  if (planCode) {
    const randomCode = 'SSG-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    planCode.textContent = randomCode;
  }

  if (modal) {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeVoucherModal = function() {
  const modal = document.getElementById('voucher-modal');
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
};

// Close modal on backdrop click or ESC
window.addEventListener('click', (e) => {
  const modal = document.getElementById('voucher-modal');
  if (e.target === modal) {
    closeVoucherModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVoucherModal();
  }
});

/* 6. Back to Top Button */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('is-visible');
    } else {
      topBtn.classList.remove('is-visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
