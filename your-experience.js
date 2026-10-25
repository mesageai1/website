/**
 * your-experience.js
 * Interactive scripts for "How It Works" MeSage AI Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initModalCloseHandlers();
});

const inboxScreens = [
  {
    src: 'assets/realestate.png',
    title: 'Omnichannel Team Inbox'
  },
  {
    src: 'assets/clinic.png',
    title: 'Omnichannel Team Inbox'
  }
];

let currentInboxIndex = 0;
let isGalleryActive = false;

/**
 * Open Big Box Modal from Inbox Screen (Section 1)
 */
function openInboxGallery(startIndex = 0) {
  isGalleryActive = true;
  currentInboxIndex = startIndex;
  renderGalleryState();

  const modal = document.getElementById('yeModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

window.openInboxGallery = openInboxGallery;

/**
 * Update the big box display when stepping through inbox screens
 */
function renderGalleryState() {
  const item = inboxScreens[currentInboxIndex];
  const modalImg = document.getElementById('yeModalImg');
  const modalTitle = document.getElementById('yeModalTitle');
  const nextBtn = document.getElementById('yeModalNext');

  if (modalImg) {
    modalImg.style.opacity = '0.35';
    setTimeout(() => {
      modalImg.src = item.src;
      modalImg.alt = item.title;
      modalImg.style.opacity = '1';
    }, 100);
  }

  if (modalTitle) modalTitle.textContent = item.title;

  // Single toggle arrow button: ONLY ONCE, ONLY FOR 1ST SECTION
  if (nextBtn) {
    nextBtn.style.display = 'flex';
    nextBtn.textContent = currentInboxIndex === 0 ? '→' : '←';
    nextBtn.setAttribute('title', currentInboxIndex === 0 ? 'Next' : 'Previous');
  }
}

/**
 * Step between images in the Big Box
 */
function stepLightboxImage(direction) {
  if (!isGalleryActive) return;

  if (direction === 1) {
    currentInboxIndex = currentInboxIndex === 0 ? 1 : 0;
  } else {
    currentInboxIndex = currentInboxIndex === 1 ? 0 : 1;
  }

  renderGalleryState();
}

window.stepLightboxImage = stepLightboxImage;

/**
 * Click on modal body / image steps forward
 */
function handleModalBodyClick() {
  if (isGalleryActive) {
    stepLightboxImage(1);
  }
}

window.handleModalBodyClick = handleModalBodyClick;

/**
 * Open Single Image in Big Box (Contact Directory & Smart Labels)
 * Next button is hidden - single image only!
 */
function openSingleImageModal(src, title) {
  isGalleryActive = false;
  const modal = document.getElementById('yeModal');
  const modalImg = document.getElementById('yeModalImg');
  const modalTitle = document.getElementById('yeModalTitle');
  const nextBtn = document.getElementById('yeModalNext');

  if (modalImg) {
    modalImg.src = src;
    modalImg.alt = title;
  }
  if (modalTitle) modalTitle.textContent = title;

  // Next button is HIDDEN for Section 2 and Section 3
  if (nextBtn) {
    nextBtn.style.display = 'none';
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

window.openSingleImageModal = openSingleImageModal;

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('yeModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  isGalleryActive = false;
}

window.closeModal = closeModal;

function initModalCloseHandlers() {
  const modal = document.getElementById('yeModal');
  const closeBtn = document.getElementById('yeModalClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
    // Arrow keys navigation in big box
    if (isGalleryActive && modal && modal.classList.contains('open')) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' ') {
        e.preventDefault();
        stepLightboxImage(1);
      }
    }
  });
}

/**
 * ScrollSpy & Jump Navigation
 */
function initScrollSpy() {
  const jumpButtons = document.querySelectorAll('.ye-jump-btn');
  const sections = document.querySelectorAll('.ye-feature-section');

  if (!jumpButtons.length || !sections.length) return;

  jumpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        jumpButtons.forEach(btn => {
          if (btn.getAttribute('href') === id) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}
