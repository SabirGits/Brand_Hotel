/* ============================================================
   GRAND ÉLYSÉE HOTEL - Gallery Page JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   1. GALLERY FILTER
   ============================================================ */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      /* Update active button */
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = '';
          /* Re-trigger reveal animation */
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });
})();

/* ============================================================
   2. LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let currentIndex = 0;
  let images = [];

  /* Collect all gallery images */
  function refreshImages() {
    images = [];
    document.querySelectorAll('.gallery-item:not([style*="display: none"]) img').forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt || 'Gallery Image'
      });
    });
  }

  /* Open lightbox */
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', function () {
      refreshImages();
      /* Find this item in the visible images */
      const imgSrc = this.querySelector('img').src;
      currentIndex = images.findIndex(img => img.src === imgSrc);
      if (currentIndex === -1) currentIndex = 0;
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    if (!images[index]) return;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    animateTransition('right');
    setTimeout(() => {
      lightboxImg.src = images[currentIndex].src;
    }, 150);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    animateTransition('left');
    setTimeout(() => {
      lightboxImg.src = images[currentIndex].src;
    }, 150);
  }

  function animateTransition(direction) {
    const x = direction === 'left' ? '-20px' : '20px';
    lightboxImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `translateX(${x})`;
    setTimeout(() => {
      lightboxImg.style.transform = 'translateX(0)';
      lightboxImg.style.opacity = '1';
    }, 160);
  }

  /* Event Listeners */
  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  prevBtn  && prevBtn.addEventListener('click', showPrev);
  nextBtn  && nextBtn.addEventListener('click', showNext);

  /* Close on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape')     closeLightbox();
  });

  /* Touch/swipe support */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? showNext() : showPrev();
    }
  });
})();