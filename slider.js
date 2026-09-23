/**
 * LUGGAGE PASS - Pure Vanilla JS Card News Slider
 */

function initCardNewsSlider() {
  const container = document.getElementById('cardnews-slider');
  const track = document.getElementById('slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const total = slides.length;
  let autoPlayTimer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  // Build dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot ${index === 0 ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + total) % total;
    updateSlider();
    resetAutoPlay();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Keyboard navigation when focused
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  // Touch Swipe Support
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 40;
    if (touchEndX < touchStartX - threshold) {
      goToSlide(currentIndex + 1); // Swipe Left -> Next
    } else if (touchEndX > touchStartX + threshold) {
      goToSlide(currentIndex - 1); // Swipe Right -> Prev
    }
  }

  // Auto-play
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  container.addEventListener('mouseleave', startAutoPlay);
}

document.addEventListener('DOMContentLoaded', initCardNewsSlider);
