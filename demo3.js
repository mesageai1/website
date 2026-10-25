/**
 * demo3.js
 * Interactive scripts for Workspace Visual Guide & Platform Tour
 * Strictly Indigo, Green & White.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initModalCloseHandlers();
});

/**
 * Open Single Image in Fullscreen Lightbox
 */
function openLightboxModal(imageSrc, title) {
  const modal = document.getElementById('d3Modal');
  const modalImg = document.getElementById('d3ModalImg');
  const modalTitle = document.getElementById('d3ModalTitle');

  if (modalImg) {
    modalImg.style.opacity = '0.35';
    modalImg.src = imageSrc;
    modalImg.alt = title || 'MeSage AI Workspace Feature Preview';
    modalImg.onload = () => {
      modalImg.style.opacity = '1';
    };
  }

  if (modalTitle) {
    modalTitle.textContent = title || 'Workspace Screenshot Preview';
  }

  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

window.openLightboxModal = openLightboxModal;

/**
 * Close Lightbox Modal
 */
function closeLightboxModal() {
  const modal = document.getElementById('d3Modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

window.closeLightboxModal = closeLightboxModal;

/**
 * Initialize Modal Close Event Handlers
 */
function initModalCloseHandlers() {
  const closeBtn = document.getElementById('d3ModalClose');
  const modal = document.getElementById('d3Modal');
  const modalBody = document.getElementById('d3ModalBody');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightboxModal();
    });
  }

  if (modalBody) {
    modalBody.addEventListener('click', (e) => {
      // Close only if clicking the background backdrop, not the image itself
      if (e.target === modalBody) {
        closeLightboxModal();
      }
    });
  }

  // Keyboard Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('d3Modal');
      if (modal && modal.classList.contains('open')) {
        closeLightboxModal();
      }
    }
  });
}

/**
 * Scrollspy & Smooth Jump Navigation
 */
function initScrollSpy() {
  const jumpButtons = document.querySelectorAll('.d3-jump-btn');
  const sections = document.querySelectorAll('.d3-feature-section');

  // Smooth scroll click handler
  jumpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        jumpButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const offset = 140;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active jump button on scroll
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = '#' + section.id;
      }
    });

    if (currentId) {
      jumpButtons.forEach(btn => {
        if (btn.getAttribute('href') === currentId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}
