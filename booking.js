'use strict';

/* ============================================================
   1. ROOM CARD SELECTION
   ============================================================ */
(function initRoomSelection() {

  const roomCards = document.querySelectorAll('.room-select-card');
  const bookingRoomInput = document.getElementById('bookingRoom');
  const summaryRoomEl = document.getElementById('summaryRoom');
  const summaryTotalEl = document.getElementById('summaryTotal');
  const summaryNightsEl = document.getElementById('summaryNights');
  const summaryImg = document.querySelector('.summary-img img');

  if (!roomCards.length) return;

  // Room images for summary sidebar
  const roomImages = {
    'Standard Room':   'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=500&q=80',
    'Deluxe Room':     'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80',
    'Junior Suite':    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80',
    'Luxury Suite':    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
    'Royal Penthouse': 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=500&q=80',
    'Family Room':     'https://images.unsplash.com/photo-1587213811864-4e2a50e6b2c1?w=500&q=80',
  };

  let selectedPrice = 0;

  function getNights() {
    const checkin  = document.getElementById('bookingCheckin');
    const checkout = document.getElementById('bookingCheckout');
    if (!checkin || !checkout || !checkin.value || !checkout.value) return 1;
    const diff = (new Date(checkout.value) - new Date(checkin.value)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  }

  function updateSummary() {
    const nights = getNights();
    const total  = selectedPrice * nights;

    if (summaryNightsEl) {
      summaryNightsEl.textContent = nights === 1 ? '1 Night' : nights + ' Nights';
    }

    if (summaryTotalEl) {
      summaryTotalEl.textContent = selectedPrice > 0
        ? '$' + total.toLocaleString()
        : '—';
    }
  }

  roomCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected from all
      roomCards.forEach(c => c.classList.remove('selected'));

      // Select this card
      card.classList.add('selected');

      const roomName  = card.dataset.room;
      const roomPrice = parseInt(card.dataset.price, 10);

      // Update hidden input
      if (bookingRoomInput) bookingRoomInput.value = roomName;

      // Clear room error if shown
      const roomErr = document.getElementById('bookingRoomError');
      if (roomErr) roomErr.classList.remove('show');

      // Update sidebar room name
      if (summaryRoomEl) summaryRoomEl.textContent = roomName;

      // Update sidebar image
      if (summaryImg && roomImages[roomName]) {
        summaryImg.src = roomImages[roomName];
        summaryImg.alt = roomName;
      }

      selectedPrice = roomPrice;
      updateSummary();

      // Scroll to form section smoothly
      const formSection = document.querySelector('.booking-form-section');
      if (formSection) {
        setTimeout(() => {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  });

  // Update total when dates change
  ['bookingCheckin', 'bookingCheckout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateSummary);
  });

})();


/* ============================================================
   2. BOOKING FORM VALIDATION + SUBMIT (Frontend Only)
   ============================================================ */
(function initBookingForm() {

  const form       = document.getElementById('bookingForm');
  const successMsg = document.getElementById('bookingSuccess');

  if (!form) return;

  /* Validation rules */
  const rules = {
    bookingRoom: {
      required: true,
      message: 'Please select a room type above.'
    },
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
      pattern: /^[\+]?[\d\s\-\(\)]{7,15}$/,
      message: 'Please enter a valid phone number.'
    },
    bookingGuests: {
      required: true,
      message: 'Please select number of guests.'
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
    }
  };

  /* Set min dates */
  const checkinInput  = document.getElementById('bookingCheckin');
  const checkoutInput = document.getElementById('bookingCheckout');
  const today = new Date().toISOString().split('T')[0];

  if (checkinInput)  checkinInput.min  = today;
  if (checkoutInput) checkoutInput.min = today;

  if (checkinInput) {
    checkinInput.addEventListener('change', () => {
      if (!checkoutInput) return;
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = nextDay.toISOString().split('T')[0];
      if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = nextDay.toISOString().split('T')[0];
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
    let valid   = true;
    let message = rule.message;

    if (rule.required && !value) {
      valid = false;
    } else if (rule.minLength && value.length < rule.minLength) {
      valid = false;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      valid = false;
    } else if (rule.afterField) {
      const other = document.getElementById(rule.afterField);
      if (other && value && other.value) {
        if (new Date(value) <= new Date(other.value)) {
          valid   = false;
          message = rule.afterMessage;
        }
      }
    }

    if (!valid) {
      input.classList.add('error');
      if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }

    return valid;
  }

  /* Live validation on blur/input */
  Object.keys(rules).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.addEventListener('blur',  () => validateField(fieldId));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(fieldId); });
    input.addEventListener('change', () => validateField(fieldId));
  });

  /* Generate booking reference */
  function generateRef() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = 'GE-';
    for (let i = 0; i < 8; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
  }

  /* Progress bar steps update */
  function updateSteps(step) {
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.step-line');
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < step)  s.classList.add('done');
      if (i + 1 === step) s.classList.add('active');
    });
    lines.forEach((l, i) => {
      l.classList.toggle('done', i + 1 < step);
    });
  }

  /* ---- SUBMIT ---- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(rules).forEach(fieldId => {
      if (!validateField(fieldId)) allValid = false;
    });

    // Check terms checkbox
    const terms = document.getElementById('bookingTerms');
    if (terms && !terms.checked) {
      alert('Please agree to the Terms & Conditions to continue.');
      terms.focus();
      return;
    }

    if (!allValid) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    /* Show loading state */
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    updateSteps(3);

    /* Simulate processing delay (replaces backend call) */
    await new Promise(resolve => setTimeout(resolve, 1500));

    /* Generate reference */
    const ref = generateRef();
    const bookingRefEl = document.getElementById('bookingRefText');
    if (bookingRefEl) bookingRefEl.textContent = ref;

    /* Hide form, show success */
    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  });

})();


/* ============================================================
   3. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {

  const form       = document.getElementById('contactForm');
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
      message: 'Please enter a subject.'
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
    let valid   = true;

    if (rule.required && !value)                             valid = false;
    else if (rule.minLength && value.length < rule.minLength) valid = false;
    else if (rule.pattern && !rule.pattern.test(value))      valid = false;

    if (!valid) {
      input.classList.add('error');
      if (errEl) { errEl.textContent = rule.message; errEl.classList.add('show'); }
    } else {
      input.classList.remove('error');
      if (errEl) errEl.classList.remove('show');
    }
    return valid;
  }

  Object.keys(rules).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.addEventListener('blur',  () => validateField(fieldId));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(fieldId); });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let allValid = true;
    Object.keys(rules).forEach(id => { if (!validateField(id)) allValid = false; });
    if (!allValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const origText  = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled  = true;

    await new Promise(r => setTimeout(r, 1200));

    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    submitBtn.disabled  = false;
    submitBtn.innerHTML = origText;
  });

})();