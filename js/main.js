// Main JavaScript file for AgroVision

document.addEventListener('DOMContentLoaded', function () {
  // Theme management
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update toggle button icon
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('theme') ||
    (prefersDarkScheme.matches ? 'dark' : 'light');
  setTheme(savedTheme);

  // Theme toggle handler
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // System theme change handler
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Header scroll effect
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');

      // Toggle ARIA expanded attribute
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);

      // Prevent body scrolling when menu is open
      document.body.classList.toggle('menu-open');
    });
  }

  // Mobile dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('active');
      }
    });
  });

  // AOS initialization (Animate On Scroll)
  initAOS();

  // Initialize testimonials slider
  initTestimonialsSlider();

  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (validateEmail(email)) {
        // Show success message
        showNotification('success', 'Merci de vous être inscrit à notre newsletter!');
        emailInput.value = '';
      } else {
        // Show error message
        showNotification('error', 'Veuillez entrer une adresse email valide.');
      }
    });
  }
});

// Initialize AOS (Animate On Scroll)
function initAOS() {
  // Check if elements with data-aos exist
  const aosElements = document.querySelectorAll('[data-aos]');

  if (aosElements.length > 0) {
    // Simulate AOS behavior with our own implementation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        } else {
          // Uncomment to reset animation when element is out of view
          // entry.target.classList.remove('aos-animate');
        }
      });
    }, observerOptions);

    aosElements.forEach(element => {
      observer.observe(element);

      // Set delay if data-aos-delay is present
      const delay = element.getAttribute('data-aos-delay');
      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }
    });
  }
}


// Testimonials slider functionality
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');

  if (slider) {
    const cards = Array.from(slider.querySelectorAll('.testimonial-card'));
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);

    // Auto scroll functionality
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      slider.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }, 5000);

    // Clear interval when user interacts with the slider
    slider.addEventListener('mousedown', () => {
      clearInterval(interval);
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', () => {
      clearInterval(interval);
    });
  }
}

// Email validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Notification system
function showNotification(type, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const icon = document.createElement('span');
  icon.className = 'notification-icon';
  icon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';

  const text = document.createElement('span');
  text.className = 'notification-text';
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.addEventListener('click', () => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  notification.appendChild(icon);
  notification.appendChild(text);
  notification.appendChild(closeBtn);

  // Add to the DOM
  if (!document.querySelector('.notifications-container')) {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
  }

  const container = document.querySelector('.notifications-container');
  container.appendChild(notification);

  // Add the visible class after a small delay to trigger animation
  setTimeout(() => {
    notification.classList.add('notification-visible');
  }, 10);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Add styles for notifications to the page
const notificationStyles = `
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
  max-width: 300px;
}

.notification-visible {
  transform: translateX(0);
  opacity: 1;
}

.notification-hiding {
  transform: translateX(100%);
  opacity: 0;
}

.notification-success {
  border-left: 4px solid #5eb331;
}

.notification-error {
  border-left: 4px solid #e51919;
}

.notification-icon {
  font-size: 18px;
}

.notification-success .notification-icon {
  color: #5eb331;
}

.notification-error .notification-icon {
  color: #e51919;
}

.notification-text {
  flex: 1;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  color: #7a7a7a;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: #2e2e2e;
}

@media (max-width: 768px) {
  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    max-width: 100%;
  }
}
`;

// Add the notification styles to the page
const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);