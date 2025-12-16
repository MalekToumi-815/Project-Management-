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

  // Wrapper function for showToast with type support
  function showToast(message, type = 'info') {
    const bgColor = {
      'success': 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
      'error': 'linear-gradient(135deg, #fee2e2, #fecaca)',
      'info': 'rgba(255,255,255,0.9)',
      'warning': 'linear-gradient(135deg, #fef3c7, #fde68a)'
    };
    
    const borderColor = {
      'success': '#10b981',
      'error': '#ef4444',
      'info': '#e9ecef',
      'warning': '#f59e0b'
    };
    
    const textColor = {
      'success': '#065f46',
      'error': '#7f1d1d',
      'info': '#2b2d42',
      'warning': '#92400e'
    };
    
    const c = container();
    const t = document.createElement('div');
    t.textContent = String(message || '');
    t.style.padding = '16px 20px';
    t.style.maxWidth = '520px';
    t.style.borderRadius = '12px';
    t.style.border = `1px solid ${borderColor[type] || '#e9ecef'}`;
    t.style.background = bgColor[type] || 'rgba(255,255,255,0.9)';
    t.style.color = textColor[type] || '#2b2d42';
    t.style.fontSize = '1rem';
    t.style.fontWeight = '500';
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
    }, Math.max(2500, 3000));
  }

  window.showToast = showToast;

  // Custom success toast for profile update
  function showSuccessToast(message) {
    const c = container();
    const t = document.createElement('div');
    t.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    t.style.padding = '16px 20px';
    t.style.maxWidth = '520px';
    t.style.borderRadius = '12px';
    t.style.border = '1px solid #10b981';
    t.style.background = 'linear-gradient(135deg, #ecfdf5, #d1fae5)';
    t.style.color = '#065f46';
    t.style.fontSize = '1rem';
    t.style.fontWeight = '500';
    t.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.15)';
    t.style.backdropFilter = 'blur(4px)';
    t.style.transition = 'opacity .2s ease, transform .2s ease';
    t.style.opacity = '0';
    t.style.transform = 'translateY(-6px) scale(0.98)';
    t.style.textAlign = 'center';
    t.style.display = 'flex';
    t.style.alignItems = 'center';
    t.style.justifyContent = 'center';
    t.style.gap = '8px';

    c.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0) scale(1)';
    });

    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-6px) scale(0.98)';
      setTimeout(() => t.remove(), 220);
    }, 3000);
  }

  window.showSuccessToast = showSuccessToast;
})();