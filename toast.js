// Minimal toast notifier: notify(message[, durationMs])
(function () {
  if (typeof window === 'undefined') return;

  function container() {
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      c.style.position = 'fixed';
      c.style.top = '20px';
      c.style.left = '50%';
      c.style.transform = 'translateX(-50%)';
      c.style.right = 'auto';
      c.style.bottom = 'auto';
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      c.style.gap = '10px';
      c.style.zIndex = '9999';
      c.style.alignItems = 'center';
      document.body.appendChild(c);
    } else {
      // Ensure container is positioned top-center if it already existed
      c.style.top = '20px';
      c.style.left = '50%';
      c.style.transform = 'translateX(-50%)';
      c.style.right = 'auto';
      c.style.bottom = 'auto';
      c.style.alignItems = 'center';
    }
    return c;
  }

  function notify(message, duration) {
    const c = container();
    const d = typeof duration === 'number' ? duration : 2500;
    const t = document.createElement('div');
    t.textContent = String(message || '');
    t.style.padding = '16px 20px';
    t.style.maxWidth = '520px';
    t.style.borderRadius = '12px';
    t.style.border = '1px solid #e9ecef';
    t.style.background = 'rgba(255,255,255,0.9)';
    t.style.color = '#2b2d42';
    t.style.fontSize = '1rem';
    t.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
    t.style.backdropFilter = 'blur(4px)';
    t.style.transition = 'opacity .2s ease, transform .2s ease';
    t.style.opacity = '0';
    t.style.transform = 'translateY(-6px) scale(0.98)';
    t.style.textAlign = 'center';

    c.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0) scale(1)';
    });

    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-6px) scale(0.98)';
      setTimeout(() => t.remove(), 220);
    }, Math.max(1000, d));
  }

  window.notify = notify;
})();