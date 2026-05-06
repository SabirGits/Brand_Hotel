/* ============================================================
   GRAND ÉLYSÉE HOTEL - Booking & Forms JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   1. BOOKING FORM VALIDATION
   ============================================================ */
(function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const successMsg = document.getElementById('bookingSuccess');

  /* Validation rules */
  const rules = {
    bookingName: {
      required: true,
      minLength: 3,
      message: 'Please enter your full name (min. 3 characters).'
    },
    bookingEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.'
    },
    bookingPhone: {
      required: true,
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      message: 'Please enter a valid phone number.'
    },
    bookingCheckin: {
      required: true,
      message: 'Please select a check-in date.'
    },
    bookingCheckout: {
      required: true,
      message: 'Please select a check-out date.',
      afterField: 'bookingCheckin',
      afterMessage: 'Check-out must be after check-in.'
    },
    bookingGuests: {
      required: true,
      message: 'Please select number of guests.'
    },
    bookingRoom: {
      required: true,
      message: 'Please select a room type.'
    }
  };

  /* Set min date for check-in */
  const checkinInput  = document.getElementById('bookingCheckin');
  const checkoutInput = document.getElementById('bookingCheckout');
  const today = new Date().toISOString().split('T')[0];

  if (checkinInput)  checkinInput.min  = today;
  if (checkoutInput) checkoutInput.min = today;

  if (checkinInput) {
    checkinInput.addEventListener('change', () => {
      if (checkoutInput) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.min = nextDay.toISOString().split('T')[0];
        if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
          checkoutInput.value = nextDay.toISOString().split('T')[0];
        }
      }
    });
  }

  /* Validate single field */
  function validateField(fieldId) {
    const rule  = rules[fieldId];
    if (!rule) return true;

    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + 'Error');
    if (!input) return true;

    const value = input.value.trim();
    let valid = true;
    let message = rule.message;

    if (rule.required && !value) {
      valid = false;
    } else if (rule.minLength && value.length < rule.minLength) {
      valid = false;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      valid = false;
    } else if (rule.afterField) {
      const otherInput = document.getElementById(rule.afterField);
      if (otherInput && value && otherInput.value) {
        if (new Date(value) <= new Date(otherInput.value)) {
          valid   = false;
          message = rule.afterMessage;
        }
      }
    }

    if (!valid) {
      input.classList.add('error');
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('show');
      }
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }

    return valid;
  }

  /* Live validation on blur */
  Object.keys(rules).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(fieldId);
      });
    }
  });

  /* Form submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(rules).forEach(fieldId => {
      if (!validateField(fieldId)) allValid = false;
    });

    if (!allValid) {
      /* Scroll to first error */
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    /* Simulate submission */
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled  = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
      /* Scroll to success message */
      successMsg && successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1800);
  });
})();

/* ============================================================
   2. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('contactSuccess');

  const rules = {
    contactName: {
      required: true,
      minLength: 2,
      message: 'Please enter your name.'
    },
    contactEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.'
    },
    contactSubject: {
      required: true,
      minLength: 4,
      message: 'Please enter a subject (min. 4 characters).'
    },
    contactMessage: {
      required: true,
      minLength: 20,
      message: 'Please write a message (min. 20 characters).'
    }
  };

  function validateField(fieldId) {
    const rule  = rules[fieldId];
    if (!rule) return true;

    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + 'Error');
    if (!input) return true;

    const value = input.value.trim();
    let valid = true;

    if (rule.required && !value) {
      valid = false;
    } else if (rule.minLength && value.length < rule.minLength) {
      valid = false;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      valid = false;
    }

    if (!valid) {
      input.classList.add('error');
      if (errEl) {
        errEl.textContent = rule.message;
        errEl.classList.add('show');
      }
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }

    return valid;
  }

  Object.keys(rules).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(fieldId);
      });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(rules).forEach(fieldId => {
      if (!validateField(fieldId)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.error');
      firstError && firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled  = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
      successMsg && successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1600);
  });
})();

/* ============================================================
   3. ROOM DETAILS - IMAGE GALLERY SWITCHER
   ============================================================ */
(function initRoomGallery() {
  const mainImg  = document.getElementById('roomMainImg');
  const thumbs   = document.querySelectorAll('.gallery-thumb');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function () {
      /* Animate swap */
      mainImg.style.transition = 'opacity 0.3s ease';
      mainImg.style.opacity = '0';

      setTimeout(() => {
        mainImg.src = this.src;
        mainImg.alt = this.alt;
        mainImg.style.opacity = '1';
      }, 280);

      /* Update active thumb */
      thumbs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();

/* ============================================================
   4. ROOM SELECTOR (Booking Page)
   ============================================================ */
(function initRoomSelector() {
  const cards = document.querySelectorAll('.room-select-card');
  const hiddenInput = document.getElementById('bookingRoom');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', function () {
      cards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      if (hiddenInput) {
        hiddenInput.value = this.getAttribute('data-room');
        /* Clear error if present */
        hiddenInput.classList.remove('error');
        const errEl = document.getElementById('bookingRoomError');
        if (errEl) errEl.classList.remove('show');
      }
    });
  });
})();

/* ============================================================
   5. PRICE SUMMARY (Booking Page)
   ============================================================ */
(function initPriceSummary() {
  const checkinInput  = document.getElementById('bookingCheckin');
  const checkoutInput = document.getElementById('bookingCheckout');
  const guestsInput   = document.getElementById('bookingGuests');
  const nightsEl      = document.getElementById('summaryNights');
  const roomEl        = document.getElementById('summaryRoom');
  const totalEl       = document.getElementById('summaryTotal');
  const cards         = document.querySelectorAll('.room-select-card');

  if (!nightsEl) return;

  const roomPrices = {
    'Standard Room':  180,
    'Deluxe Room':    280,
    'Junior Suite':   420,
    'Luxury Suite':   580,
    'Royal Penthouse': 950,
    'Family Room':    320
  };

  let selectedRoom  = '';
  let selectedPrice = 0;

  function updateSummary() {
    const checkin  = checkinInput  ? new Date(checkinInput.value)  : null;
    const checkout = checkoutInput ? new Date(checkoutInput.value) : null;

    let nights = 1;
    if (checkin && checkout && checkout > checkin) {
      nights = Math.round((checkout - checkin) / (1000 * 60 * 60 * 24));
    }

    if (nightsEl) nightsEl.textContent = nights + (nights === 1 ? ' Night' : ' Nights');
    if (roomEl)   roomEl.textContent   = selectedRoom || '—';

    const total = selectedPrice * nights;
    if (totalEl) totalEl.textContent = total > 0 ? '$' + total.toLocaleString() : '—';
  }

  cards.forEach(card => {
    card.addEventListener('click', function () {
      selectedRoom  = this.getAttribute('data-room') || '';
      selectedPrice = parseInt(this.getAttribute('data-price')) || 0;
      updateSummary();
    });
  });

  checkinInput  && checkinInput.addEventListener('change', updateSummary);
  checkoutInput && checkoutInput.addEventListener('change', updateSummary);
  guestsInput   && guestsInput.addEventListener('change', updateSummary);

  updateSummary();
})();

/* ============================================================
   6. ROOMS PAGE - FILTER
   ============================================================ */
(function initRoomsFilter() {
  const filterBtns = document.querySelectorAll('.rooms-filter .filter-btn');
  const roomCards  = document.querySelectorAll('.room-card');

  if (!filterBtns.length || !roomCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.transition = 'opacity 0.3s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
})();