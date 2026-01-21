document.addEventListener('DOMContentLoaded', () => {
  // === Навигация ===
  const navBtns = document.querySelectorAll('.nav-btn');
  const pages = document.querySelectorAll('.page');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.page;
      navBtns.forEach(b => b.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`page-${target}`).classList.add('active');
    });
  });

  // === Аватары (только отображение) ===
  const avatar1 = document.getElementById('avatar1');
  const avatar2 = document.getElementById('avatar2');

  if (localStorage.getItem('avatar1')) avatar1.src = localStorage.getItem('avatar1');
  if (localStorage.getItem('avatar2')) avatar2.src = localStorage.getItem('avatar2');

  // === Дата начала отношений (фиксированная) ===
  const homeResult = document.getElementById('result');
  const startDate = new Date(2025, 10, 26); // 26 ноября 2025 (месяцы от 0)

  const getDayForm = (n) => {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return 'дней';
    if (n1 > 1 && n1 < 5) return 'дня';
    if (n1 === 1) return 'день';
    return 'дней';
  };

  const updateResult = () => {
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - startDate) / (1000 * 60 * 60 * 24));
    const text = `Прошло ${diffDays} ${getDayForm(diffDays)}`;
    homeResult.textContent = text;
  };

  updateResult();

  // === Эффекты фона ===
  function clearEffects() {
    document.getElementById('fireflies-container').innerHTML = '';
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('snowflakes-container').innerHTML = '';
  }

  function applyBackgroundEffect(effect) {
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('bg-'))
      .join(' ')
      .trim();
    clearEffects();
    if (effect === 'fireflies') {
      document.body.classList.add('bg-fireflies');
      createFireflies();
    } else if (effect === 'stars') {
      document.body.classList.add('bg-stars');
      createStars();
    } else if (effect === 'snow') {
      document.body.classList.add('bg-snow');
      createSnow();
    }
    localStorage.setItem('bgEffect', effect);
  }

  function createFireflies() {
    const container = document.getElementById('fireflies-container');
    container.innerHTML = '';
    for (let i = 0; i < 100; i++) {
      const item = document.createElement('div');
      item.className = 'ag-fireflies_item';
      item.style.width = (1 + Math.random() * 6) + 'px';
      item.style.height = item.style.width;
      item.style.left = Math.random() * 100 + 'vw';
      item.style.animationDuration = (20 + Math.random() * 30) + 's';
      item.style.animationDelay = Math.random() * 40 + 's';
      item.innerHTML = '<div class="ag-fireflies_inner"></div>';
      container.appendChild(item);
    }
  }

  function createStars() {
    const container = document.getElementById('stars-container');
    container.innerHTML = '';
    const count = 50;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.setProperty('--top-offset', (Math.random() * 100) + 'vh');
      star.style.setProperty('--fall-duration', (6 + Math.random() * 6) + 's');
      star.style.setProperty('--fall-delay', (Math.random() * 10) + 's');
      container.appendChild(star);
    }
  }

  function createSnow() {
    const container = document.getElementById('snowflakes-container');
    container.innerHTML = '';
    const count = 80;
    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = '❄';
      
      const randomLeft = Math.random() * window.innerWidth;
      const randomDelay = Math.random() * 20;
      const randomDuration = 12 + Math.random() * 8;
      const randomSize = 10 + Math.random() * 20;
      
      snowflake.style.left = randomLeft + 'px';
      snowflake.style.top = '-50px';
      snowflake.style.fontSize = randomSize + 'px';
      snowflake.style.animationDuration = randomDuration + 's';
      snowflake.style.animationDelay = randomDelay + 's';
      
      container.appendChild(snowflake);
    }
  }

  // === Winter Scene Toggle (улучшенный) ===
  const winterToggle = document.getElementById('winter-scene-toggle');
  const winterScene = document.getElementById('winter-scene-container');

  winterToggle.addEventListener('change', () => {
    const enabled = winterToggle.checked;
    if (enabled) {
      winterScene.classList.add('visible');
    } else {
      winterScene.classList.remove('visible');
    }
    localStorage.setItem('winterSceneEnabled', enabled);
  });

  const winterEnabled = localStorage.getItem('winterSceneEnabled') === 'true';
  winterToggle.checked = winterEnabled;
  if (winterEnabled) {
    winterScene.classList.add('visible');
  }

  // === Цвет акцента ===
  const colorPicker = document.getElementById('accent-color-picker');
  const colorPreview = document.getElementById('color-preview');

  colorPicker.addEventListener('input', () => {
    const color = colorPicker.value;
    document.documentElement.style.setProperty('--accent-color', color);
    colorPreview.style.background = color;
    localStorage.setItem('accentColor', color);
  });

  const savedColor = localStorage.getItem('accentColor');
  if (savedColor) {
    colorPicker.value = savedColor;
    colorPreview.style.background = savedColor;
    document.documentElement.style.setProperty('--accent-color', savedColor);
  }

  const savedEffect = localStorage.getItem('bgEffect') || 'none';
  document.querySelectorAll('input[name="bg-effect"]').forEach(radio => {
    if (radio.value === savedEffect) radio.checked = true;
  });
  applyBackgroundEffect(savedEffect);

  document.querySelectorAll('input[name="bg-effect"]').forEach(radio => {
    radio.addEventListener('change', (e) => applyBackgroundEffect(e.target.value));
  });

  // === Пасхалки (скрытый счетчик) ===
  let clickCount = 0;
  const madeByElement = document.getElementById('made-by');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const easterEggImage = document.getElementById('easter-egg-image');
  
  const easterEggs = {
    30: 'assets/pashalko.jpg',
    42: 'assets/pashalko1.jpg',
    52: 'assets/pashalko2.jpg',
    66: 'assets/secret.jpg'
  };

  let hideTimeout = null;

  const hideEasterEgg = () => {
    easterEggModal.classList.remove('visible');
    if (hideTimeout) clearTimeout(hideTimeout);
  };

  const showEasterEgg = (imageSrc) => {
    easterEggImage.src = imageSrc;
    easterEggModal.classList.add('visible');
    
    // Для secret.jpg добавляем крестик для закрытия
    if (imageSrc === 'assets/secret.jpg') {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'easter-egg-close';
      closeBtn.innerHTML = '✕';
      closeBtn.addEventListener('click', () => {
        hideEasterEgg();
      });
      easterEggModal.appendChild(closeBtn);
    } else {
      // Для остальных картинок - автозакрытие через 5 секунд
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        hideEasterEgg();
      }, 5000);
    }
  };

  madeByElement.addEventListener('click', () => {
    clickCount++;
    if (easterEggs[clickCount]) {
      showEasterEgg(easterEggs[clickCount]);
    }
  });
});
