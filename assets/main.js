const heroProjectsButton = document.querySelector('#Main-section .Button');
const hoverColors = ['#f2ca24', '#65b8d0', '#83c98a', '#d96ba7'];
let previousHoverColor = '';

const projectCards = document.querySelectorAll('.homepage-project-card');
const heroStars = document.querySelectorAll('.hero-star');
let starFlightActive = false;

heroStars.forEach((star) => {
  star.addEventListener('click', () => {
    if (starFlightActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    starFlightActive = true;

    const originalVisibility = star.style.visibility;
    const originalAnimationPlayState = star.style.animationPlayState;
    const startRect = star.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    let animationFrame;
    const flight = document.createElement('span');
    const particles = [];
    let returnTimeout;

    flight.className = 'star-flight';
    flight.textContent = star.querySelector('span').textContent;
    flight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flight);

    star.style.visibility = 'hidden';
    star.style.animationPlayState = 'paused';

    const cleanup = () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(returnTimeout);
      star.style.visibility = originalVisibility;
      star.style.animationPlayState = originalAnimationPlayState;
      flight.remove();
      particles.forEach((particle) => particle.remove());
      starFlightActive = false;
    };

    const positionFlight = (x, y, rotation, scale) => {
      flight.style.left = `${x}px`;
      flight.style.top = `${y}px`;
      flight.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
    };

    const makeBurst = () => {
      for (let index = 0; index < 8; index += 1) {
        const angle = (Math.PI * 2 * index) / 8;
        const distance = 16 + Math.random() * 22;
        const particle = document.createElement('span');

        particle.className = 'star-burst-particle';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
        document.body.appendChild(particle);
        particles.push(particle);
      }
    };

    const finishFlight = () => {
      const flightStartX = window.innerWidth * (0.68 + (Math.random() * 0.28));
      const flightStartY = window.innerHeight * (Math.random() * 0.2);
      const targetX = (window.innerWidth * Math.random() * 0.18) - 40;
      const targetY = window.innerHeight * (0.72 + (Math.random() * 0.28));
      const beganAt = performance.now();
      const duration = 420;

      flight.style.transition = 'none';
      positionFlight(flightStartX, flightStartY, 0, 1);
      flight.style.opacity = '1';

      const flyAcrossScreen = (now) => {
        const progress = Math.min((now - beganAt) / duration, 1);
        const eased = progress * progress;
        const x = flightStartX + ((targetX - flightStartX) * eased);
        const y = flightStartY + ((targetY - flightStartY) * eased);

        positionFlight(x, y, 0, 1 - (eased * .2));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(flyAcrossScreen);
        } else {
          cleanup();
        }
      };

      animationFrame = window.requestAnimationFrame(flyAcrossScreen);
    };

    positionFlight(startX, startY, 0, 1);
    makeBurst();
    flight.style.opacity = '0';
    returnTimeout = window.setTimeout(finishFlight, 180);
  });
});

if (projectCards.length) {
  let projectCardUpdatePending = false;

  function updateProjectCards() {
    const viewportCenter = window.innerHeight / 2;
    const revealRange = window.innerHeight * 0.8;

    projectCards.forEach((card) => {
      const cardCenter = card.getBoundingClientRect().top + (card.offsetHeight / 2);
      const distance = Math.abs(cardCenter - viewportCenter);
      const progress = Math.max(0, 1 - (distance / revealRange));

      card.style.setProperty('--reveal-progress', progress.toFixed(3));
      card.classList.toggle('is-interactive', progress >= 0.55);
    });

    projectCardUpdatePending = false;
  }

  function scheduleProjectCardUpdate() {
    if (!projectCardUpdatePending) {
      window.requestAnimationFrame(updateProjectCards);
      projectCardUpdatePending = true;
    }
  }

  window.addEventListener('scroll', scheduleProjectCardUpdate, { passive: true });
  window.addEventListener('resize', scheduleProjectCardUpdate);
  updateProjectCards();
}

document.querySelectorAll('[data-project-info-toggle]').forEach((toggle) => {
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  const closeButton = panel?.querySelector('[data-project-info-close]');

  if (!panel || !closeButton) return;

  document.body.append(panel);

  toggle.addEventListener('click', () => {
    panel.showModal();
    toggle.setAttribute('aria-expanded', 'true');
  });

  closeButton.addEventListener('click', () => {
    panel.close();
  });

  panel.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
  });
});

if (heroProjectsButton) {
  heroProjectsButton.addEventListener('pointerenter', () => {
    const availableColors = hoverColors.filter((color) => color !== previousHoverColor);
    const nextColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    heroProjectsButton.style.setProperty('--button-hover-color', nextColor);
    previousHoverColor = nextColor;
  });
}

