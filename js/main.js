/**
 * Alfiya Aslam Patil - Modern Pastel Portfolio
 * Main JavaScript Interactions, Filters, Lightbox Modal & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initScrollProgress();
  initTypingRole();
  initHeroTiltEffect();
  initProjectFilters();
  initSkillMetersAnimation();
  initLightboxModal();
  initResumeModal();
  initEmailCopy();
  initContactForm();
  initDirectGmailAction();
  initCardSpotlights();
  initStatCounters();
  initAmbientParticles();
  initButtonRipples();
  initScrollReveal();
  initBackToTop();
  updateInquiryCountBadge();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!mobileToggle || !navLinks) return;

  const toggleMenu = (isOpen) => {
    const willOpen = typeof isOpen === 'boolean' ? isOpen : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', willOpen);
    mobileToggle.classList.toggle('active', willOpen);
    mobileToggle.setAttribute('aria-expanded', String(willOpen));
    document.body.style.overflow = willOpen ? 'hidden' : '';
  };

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy Navigation Highlighting
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-pill, .filter-btn');
  const projectCards = document.querySelectorAll('.project-card-pastel, .project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        const categoryList = categories.split(' ');

        if (filterValue === 'all' || categoryList.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Screenshot Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightboxModal() {
  const modal = document.getElementById('screenshotModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!modal || !modalImg) return;

  const openModal = (src, title) => {
    modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Project Screenshot';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
    }, 250);
  };

  // Attach to all screenshot boxes & preview triggers
  document.querySelectorAll('.project-screenshot-box, .preview-screenshot-trigger').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const img = el.querySelector('img') || el;
      const src = el.getAttribute('data-full-img') || img.getAttribute('src');
      const title = el.getAttribute('data-title') || img.getAttribute('alt') || 'Project Preview';
      openModal(src, title);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Email Copy to Clipboard & Toast
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyButtons = document.querySelectorAll('.copy-email-trigger');
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');

  if (!copyButtons.length) return;

  const showToast = (message = 'Email address copied to clipboard!') => {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'patilalfiya1@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard!`);
      } catch (err) {
        showToast(`Contact: ${email}`);
      }
    });
  });

  const copyPhoneButtons = document.querySelectorAll('.copy-phone-trigger');
  copyPhoneButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-phone') || '+917666617275';
      try {
        await navigator.clipboard.writeText(phone);
        showToast(`Copied ${phone} to clipboard!`);
      } catch (err) {
        showToast(`Phone: ${phone}`);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form Validation, Submission & Interactive States
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successAlert = document.getElementById('formSuccessAlert');
  if (!form) return;

  const nameInput = document.getElementById('clientName');
  const emailInput = document.getElementById('clientEmail');
  const serviceSelect = document.getElementById('projectService');
  const timelineSelect = document.getElementById('projectTimeline');
  const messageInput = document.getElementById('clientMessage');
  const submitBtn = document.getElementById('contactSubmitBtn') || form.querySelector('button[type="submit"]');

  // Clear validation styling when user inputs text
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const parent = input.closest('.form-group');
      if (parent) {
        const feedback = parent.querySelector('.form-feedback');
        if (feedback) {
          feedback.classList.remove('error');
          feedback.textContent = '';
        }
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset feedbacks
    form.querySelectorAll('.form-feedback').forEach((el) => {
      el.classList.remove('error');
      el.textContent = '';
    });
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name.');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please provide a valid email address.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
      showError(messageInput, 'Please describe your project (at least 8 characters).');
      isValid = false;
    }

    if (!isValid) return;

    // Set button loading state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-icon">⏳</span>
      <span>Sending Inquiry...</span>
    `;

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceSelect ? serviceSelect.value : 'Responsive Website',
      timeline: timelineSelect ? timelineSelect.value : '1 - 2 weeks',
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage as offline client-side backup
    try {
      const stored = JSON.parse(localStorage.getItem('alfiya_inquiries') || '[]');
      stored.push(formData);
      localStorage.setItem('alfiya_inquiries', JSON.stringify(stored));
    } catch (_) {}

    try {
      // 1. Dispatch real email to patilalfiya1@gmail.com via FormSubmit AJAX service
      const formSubmitPromise = fetch('https://formsubmit.co/ajax/patilalfiya1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Service: formData.service,
          Timeline: formData.timeline,
          Message: formData.message,
          _subject: `New Portfolio Inquiry from ${formData.name} (${formData.service})`,
          _captcha: 'false',
          _template: 'table'
        })
      }).catch(err => console.log('FormSubmit notice:', err));

      // 2. Also record to local Flask backend inquiries.json
      const localBackendPromise = fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => null);

      await Promise.allSettled([formSubmitPromise, localBackendPromise]);

      // Prepare 1-click email links
      const emailSubject = encodeURIComponent(`Project Inquiry: ${formData.service}`);
      const emailBody = encodeURIComponent(`Hi Alfiya,\n\nMy name is ${formData.name}.\nEmail: ${formData.email}\nService: ${formData.service}\nTimeline: ${formData.timeline}\n\nProject Details:\n${formData.message}`);
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=patilalfiya1@gmail.com&su=${emailSubject}&body=${emailBody}`;
      const mailtoUrl = `mailto:patilalfiya1@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Display Success Alert
      if (successAlert) {
        successAlert.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.85rem;">
            <span style="font-size: 1.8rem; line-height: 1;">🎉</span>
            <div style="flex: 1;">
              <strong style="color: #15803d; font-size: 1.05rem;">Thank you, ${escapeHtml(formData.name)}!</strong>
              <p style="margin-top: 0.35rem; color: #1e293b; font-size: 0.92rem; line-height: 1.5;">
                Your inquiry for <strong>"${escapeHtml(formData.service)}"</strong> has been submitted and dispatched to 
                <span style="color: #6366f1; font-weight: 700;">patilalfiya1@gmail.com</span>!
              </p>
              <div style="margin-top: 0.85rem; display: flex; gap: 0.65rem; flex-wrap: wrap;">
                <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" 
                   class="btn btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  <span>Open in Gmail Web ↗</span>
                </a>
                <a href="${mailtoUrl}" 
                   class="btn btn-secondary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  <span>Open in Email App ✉️</span>
                </a>
              </div>
              <p style="font-size: 0.78rem; color: #64748b; margin-top: 0.65rem;">
                💡 <em>Note: If this is the first submission, check your Gmail inbox (or Spam) for a one-time activation click from FormSubmit.</em>
              </p>
            </div>
          </div>
        `;
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Show Toast Notification
      const toast = document.getElementById('toastNotification');
      const toastText = document.getElementById('toastMessage');
      if (toast && toastText) {
        toastText.textContent = `Inquiry sent! Thank you, ${formData.name}.`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }

      form.reset();
    } catch (err) {
      console.error('Contact form submission error:', err);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  function showError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const parent = inputElement.closest('.form-group');
    if (!parent) return;
    let feedback = parent.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      parent.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.classList.add('error');
    inputElement.focus();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* --------------------------------------------------------------------------
   8. Scroll Reveal Animation (Staggered Waterfall Across Entire Page)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealGroups = [
    { selector: '.section-header', stagger: 0 },
    { selector: '.project-card-pastel', stagger: 0.08 },
    { selector: '.service-card-white', stagger: 0.08 },
    { selector: '.contact-hub-card', stagger: 0.12 },
    { selector: '.secondary-connect-item', stagger: 0.08 },
    { selector: '.about-card-frame, .skills-card-frame', stagger: 0.1 },
    { selector: '.hero-stats-strip', stagger: 0 }
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealGroups.forEach(({ selector, stagger }) => {
    const items = document.querySelectorAll(selector);
    items.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px) scale(0.985)';
      el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * stagger}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * stagger}s`;
      observer.observe(el);
    });
  });
}

/* --------------------------------------------------------------------------
   9. Floating Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   10. Top Reading Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   11. Interactive Resume & Credentials Modal
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const openBtn = document.getElementById('openResumeBtn');
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('resumeCloseBtn');
  const printBtn = document.getElementById('printResumeBtn');

  if (!modal) return;

  const openResume = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeResume = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn) {
    openBtn.addEventListener('click', openResume);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeResume);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeResume();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* --------------------------------------------------------------------------
   12. Interactive 3D Tilt on Hero Portrait Card
   -------------------------------------------------------------------------- */
function initHeroTiltEffect() {
  const card = document.getElementById('heroPortraitCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 10;
    const rotateY = (x / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* --------------------------------------------------------------------------
   13. Dynamic Typing Subrole Animation
   -------------------------------------------------------------------------- */
function initTypingRole() {
  const roleEl = document.getElementById('typingRoleText');
  if (!roleEl) return;

  const roles = [
    'Aspiring Software Engineer',
    'Full-Stack Web Developer',
    'AI & Machine Learning Builder',
    'Python & Backend Developer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingDelay = 80;

  function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingDelay = 40;
    } else {
      roleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingDelay = 80;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingDelay = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingDelay = 400; // Pause before typing next word
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* --------------------------------------------------------------------------
   14. Animated Skill Proficiency Progress Meters
   -------------------------------------------------------------------------- */
function initSkillMetersAnimation() {
  const container = document.querySelector('.skills-meters-container');
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        container.querySelectorAll('.skill-meter-fill').forEach((bar) => {
          const targetWidth = bar.getAttribute('data-width') || '85%';
          bar.style.width = targetWidth;
        });
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(container);
}

/* --------------------------------------------------------------------------
   15. Interactive Card Spotlight Light Follower
   -------------------------------------------------------------------------- */
function initCardSpotlights() {
  const cards = document.querySelectorAll(
    '.project-card-pastel, .service-card-white, .about-card-frame, .skills-card-frame, .contact-form-box'
  );

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   16. Animated Rolling Stat Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter-val');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => observer.observe(c));
}

/* --------------------------------------------------------------------------
   17. Ambient Floating Particle Constellation Canvas (Modern 60fps Physics)
   -------------------------------------------------------------------------- */
function initAmbientParticles() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const colors = [
    'rgba(99, 102, 241, ',   // Indigo
    'rgba(168, 85, 247, ',  // Purple
    'rgba(236, 72, 153, ',  // Pink
    'rgba(6, 182, 212, '    // Cyan
  ];

  const particleCount = Math.min(Math.floor(width / 32), 40);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.2 + 1.2;
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.45 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor}${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${this.baseColor}0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles with delicate faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const lineAlpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  render();
}

/* --------------------------------------------------------------------------
   18. Button Ripple Wave Click Animation
   -------------------------------------------------------------------------- */
function initButtonRipples() {
  const buttons = document.querySelectorAll(
    '.btn, .btn-primary, .btn-secondary, .btn-resume, .btn-gmail-direct, .social-circle-btn, .copy-pill-btn'
  );

  buttons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('click-ripple');

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });
}

/* --------------------------------------------------------------------------
   19. Direct 1-Click Gmail Action (Guaranteed Zero-Delay Delivery)
   -------------------------------------------------------------------------- */
function initDirectGmailAction() {
  const btn = document.getElementById('directGmailBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nameVal = document.getElementById('clientName')?.value.trim() || 'Prospective Client / Recruiter';
    const emailVal = document.getElementById('clientEmail')?.value.trim() || '';
    const serviceVal = document.getElementById('projectService')?.value || 'Project Inquiry';
    const timelineVal = document.getElementById('projectTimeline')?.value || '1 - 2 weeks';
    const messageVal = document.getElementById('clientMessage')?.value.trim() || 'Hi Alfiya, I would like to discuss a project with you.';

    const subject = encodeURIComponent(`Project Inquiry: ${serviceVal} from ${nameVal}`);
    const body = encodeURIComponent(
      `Hi Alfiya,\n\nMy name is ${nameVal}.\n` +
      (emailVal ? `My email is: ${emailVal}\n` : '') +
      `Service Needed: ${serviceVal}\n` +
      `Estimated Timeline: ${timelineVal}\n\n` +
      `Project Details:\n${messageVal}\n\n` +
      `Looking forward to connecting!`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=patilalfiya1@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  });
}

/* --------------------------------------------------------------------------
   20. Live Inquiry Count Badge Updater
   -------------------------------------------------------------------------- */
function updateInquiryCountBadge() {
  const navBadge = document.getElementById('navInboxCount');
  const formBadge = document.getElementById('inquiryCountBadge');

  fetch('/api/inquiries')
    .then((res) => res.json())
    .then((data) => {
      if (data && typeof data.count === 'number') {
        if (navBadge) navBadge.textContent = data.count;
        if (formBadge) formBadge.textContent = `${data.count}`;
      }
    })
    .catch(() => {
      try {
        const local = JSON.parse(localStorage.getItem('alfiya_inquiries') || '[]');
        if (navBadge) navBadge.textContent = local.length || '4';
        if (formBadge) formBadge.textContent = `${local.length || '4'}`;
      } catch (_) {}
    });
}



