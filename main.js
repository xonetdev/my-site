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

  // === Кроппер аватаров ===
  let cropper = null;
  const file1 = document.getElementById('file1');
  const file2 = document.getElementById('file2');
  const avatar1 = document.getElementById('avatar1');
  const avatar2 = document.getElementById('avatar2');

  function openCropper(file, targetId) {
    const modal = document.getElementById('avatar-modal');
    const preview = document.getElementById('image-preview');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img id="crop-img" src="${e.target.result}">`;
      const img = document.getElementById('crop-img');
      
      if (cropper) cropper.destroy();
      cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        cropBoxResizable: true,
      });
      
      modal.style.display = 'flex';
      
      document.getElementById('save-avatar').onclick = () => {
        const canvas = cropper.getCroppedCanvas({ width: 120, height: 120 });
        const dataUrl = canvas.toDataURL('image/png');
        document.getElementById(targetId).src = dataUrl;
        localStorage.setItem(targetId, dataUrl);
        modal.style.display = 'none';
      };
      
      document.getElementById('cancel-avatar').onclick = () => {
        modal.style.display = 'none';
      };
    };
    reader.readAsDataURL(file);
  }

  avatar1.addEventListener('click', () => file1.click());
  avatar2.addEventListener('click', () => file2.click());
  
  file1.onchange = (e) => { if (e.target.files[0]) openCropper(e.target.files[0], 'avatar1'); };
  file2.onchange = (e) => { if (e.target.files[0]) openCropper(e.target.files[0], 'avatar2'); };

  if (localStorage.getItem('avatar1')) avatar1.src = localStorage.getItem('avatar1');
  if (localStorage.getItem('avatar2')) avatar2.src = localStorage.getItem('avatar2');

  // === Имена ===
  const name1 = document.getElementById('name1');
  const name2 = document.getElementById('name2');
  const saveNames = () => {
    localStorage.setItem('name1', name1.innerText);
    localStorage.setItem('name2', name2.innerText);
  };
  name1.addEventListener('input', saveNames);
  name2.addEventListener('input', saveNames);
  if (localStorage.getItem('name1')) name1.innerText = localStorage.getItem('name1');
  if (localStorage.getItem('name2')) name2.innerText = localStorage.getItem('name2');

  // === Дата начала отношений ===
  const startDateInput = document.getElementById('start-date-input');
  const settingsResult = document.getElementById('settings-result');
  const homeResult = document.getElementById('result');
  const today = new Date().toISOString().split('T')[0];
  startDateInput.max = today;

  const getDayForm = (n) => {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return 'дней';
    if (n1 > 1 && n1 < 5) return 'дня';
    if (n1 === 1) return 'день';
    return 'дней';
  };

  const updateResult = () => {
    const startStr = startDateInput.value;
    if (!startStr) {
      homeResult.textContent = settingsResult.textContent = '—';
      return;
    }
    const start = new Date(startStr);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24));
    const text = `Прошло ${diffDays} ${getDayForm(diffDays)}`;
    homeResult.textContent = text;
    settingsResult.textContent = text;
  };

  startDateInput.addEventListener('change', () => {
    localStorage.setItem('startDate', startDateInput.value);
    updateResult();
  });

  const savedDate = localStorage.getItem('startDate');
  if (savedDate) {
    startDateInput.value = savedDate;
  }
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
});