const year = document.getElementById('y');
if (year) year.textContent = new Date().getFullYear();

// Nearby moving particles form a constantly changing geometric network.
const particleCanvas = document.getElementById('particleCanvas');
const particleContext = particleCanvas?.getContext('2d');
if (particleContext) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let particles = [];
  let frameId = null;
  let previousTime = null;
  let elapsed = 0;

  function resizeParticles() {
    const bounds = particleCanvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = Math.round(width * scale);
    particleCanvas.height = Math.round(height * scale);
    particleContext.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(100, Math.max(26, Math.round(width * height / 18000)));
    particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 14 + Math.random() * 18;
      return {
        x: Math.random() * width, y: Math.random() * height,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 1.6, phase: Math.random() * Math.PI * 2
      };
    });
    drawParticles(0);
  }

  function drawParticles(delta) {
    elapsed += delta;
    particleContext.clearRect(0, 0, width, height);
    const distance = width < 600 ? 135 : 170;
    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      const margin = 10;
      if (particle.x < -margin) particle.x = width + margin;
      if (particle.x > width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = height + margin;
      if (particle.y > height + margin) particle.y = -margin;
    }
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const gap = Math.hypot(a.x - b.x, a.y - b.y);
        if (gap >= distance) continue;
        particleContext.strokeStyle = `rgba(98,170,255,${(1 - gap / distance) * 0.4})`;
        particleContext.lineWidth = 0.8;
        particleContext.beginPath();
        particleContext.moveTo(a.x, a.y);
        particleContext.lineTo(b.x, b.y);
        particleContext.stroke();
      }
      const opacity = 0.3 + (Math.sin(elapsed * 0.8 + a.phase) + 1) * 0.2;
      particleContext.fillStyle = `rgba(125,190,255,${opacity})`;
      particleContext.beginPath();
      particleContext.moveTo(a.x, a.y - a.size);
      particleContext.lineTo(a.x + a.size, a.y + a.size);
      particleContext.lineTo(a.x - a.size, a.y + a.size);
      particleContext.closePath();
      particleContext.fill();
    }
  }

  function animateParticles(time) {
    const delta = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    drawParticles(delta);
    frameId = requestAnimationFrame(animateParticles);
  }

  function updateParticleMotion() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    previousTime = null;
    if (!motionPreference.matches && !document.hidden) {
      frameId = requestAnimationFrame(animateParticles);
    } else {
      drawParticles(0);
    }
  }

  window.addEventListener('resize', resizeParticles);
  document.addEventListener('visibilitychange', updateParticleMotion);
  motionPreference.addEventListener('change', updateParticleMotion);
  resizeParticles();
  updateParticleMotion();
}

const contactButton = document.getElementById('contactBtn');
const modal = document.getElementById('contactModal');
const closeButton = document.getElementById('closeBtn');
const copyButton = document.getElementById('copyBtn');
const copyStatus = document.getElementById('copyStatus');
const mail = document.getElementById('mailText');

if (contactButton && modal && closeButton && copyButton && copyStatus && mail) {
  contactButton.addEventListener('click', () => {
    copyStatus.textContent = '';
    modal.showModal();
  });
  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  });
  modal.addEventListener('close', () => contactButton.focus());

  copyButton.addEventListener('click', async () => {
    const address = mail.textContent.trim();
    let copied = false;
    try {
      await navigator.clipboard.writeText(address);
      copied = true;
    } catch {
      // Keep the fallback inside the dialog so it can receive focus.
      const field = document.createElement('textarea');
      field.value = address;
      field.setAttribute('aria-label', 'コピーするメールアドレス');
      field.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      modal.appendChild(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      field.remove();
      copyButton.focus();
    }
    copyStatus.textContent = copied ? 'メールアドレスをコピーしました。' : 'コピーできませんでした。アドレスを選択してコピーしてください。';
  });
}
