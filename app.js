// UI-only interactions for the redesign concept: nothing is sent anywhere.
(function () {
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Single-choice groups: clicking an item makes it the only active one.
  const groups = ['.cat-pick > div', '.seg > span', '.methods > .method', '.tu-side > .tu-svc',
    '.amounts > .fchip', '.chips-row > .fchip', '.tabs > a', '.view > button', '.thumbs > div', '.dlg-list > .dlg'];
  groups.forEach(sel => $$(sel).forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', e => {
      e.preventDefault();
      [...el.parentElement.children].forEach(s => s.classList.remove('on'));
      el.classList.add('on');
    });
  }));

  // Toggles
  $$('.check, .toggle').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    el.classList.toggle('on');
  }));
  $$('.fav').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    el.classList.toggle('on');
  }));

  // Preset amounts fill the amount field next to them
  $$('.amounts > .fchip').forEach(chip => chip.addEventListener('click', () => {
    const input = chip.closest('.field').querySelector('.inp');
    if (input) input.value = chip.textContent.replace(' ₽', '');
  }));

  // Top-up service switcher
  $$('.tu-side > .tu-svc').forEach(svc => svc.addEventListener('click', () => {
    const name = svc.querySelector('div').firstChild.textContent.trim();
    const box = svc.closest('.tu');
    box.querySelector('.tu-main h3').textContent = 'Пополнение ' + name;
    const btn = box.querySelector('.tu-total .btn');
    btn.lastChild.textContent = 'Пополнить ' + name;
    const login = box.querySelectorAll('.field label')[1];
    login.textContent = name === 'Telegram' ? 'Username в Telegram' : name === 'Steam' ? 'Логин Steam' : 'Email аккаунта ' + name;
  }));

  // Quantity steppers
  $$('.qty').forEach(q => {
    const [minus, plus] = q.querySelectorAll('button');
    const out = q.querySelector('span');
    minus.addEventListener('click', () => { out.textContent = Math.max(1, +out.textContent - 1); });
    plus.addEventListener('click', () => { out.textContent = +out.textContent + 1; });
  });

  // Category from the URL: highlight the nav item and, on the catalog, update the page
  const CATS = {
    all: { name: 'Все товары', count: '69 214', card: null, chips: ['Steam', 'PlayStation', 'Xbox', 'Telegram', 'Spotify', 'Windows'] },
    accounts: { name: 'Аккаунты', count: '12 418', card: 'Аккаунты', chips: ['Steam', 'Epic Games', 'Battle.net', 'PlayStation', 'Xbox', 'Telegram', 'Discord', 'ChatGPT'] },
    games: { name: 'Игровые ценности', count: '38 902', card: 'Игровые ценности', chips: ['Battlefield 6', 'CS2', 'Dota 2', 'Genshin Impact', 'Roblox', 'Fortnite'] },
    keys: { name: 'Подписки и ключи', count: '9 106', card: 'Подписки и ключи', chips: ['Steam Gift', 'Spotify', 'YouTube Premium', 'Game Pass', 'PS Plus', 'Discord Nitro'] },
    services: { name: 'Цифровые услуги', count: '4 731', card: 'Цифровые услуги', chips: ['Смена региона', 'Прокачка', 'Буст рейтинга', 'Настройка', 'Дизайн'] },
    soft: { name: 'Софт', count: '2 305', card: 'Софт', chips: ['Windows', 'Office', 'Антивирусы', 'VPN', 'Adobe'] },
    other: { name: 'Другое', count: '1 812', card: 'Пополнение', chips: ['Пополнения', 'Подарочные карты', 'Промокоды'] },
    sale: { name: 'Скидки дня', count: '348', card: 'sale', chips: ['До −30%', 'До −50%', 'Последний шанс'] },
  };
  const key = new URLSearchParams(location.search).get('c');
  if (key && CATS[key]) {
    $$('.nav a[data-cat]').forEach(a => a.classList.toggle('active', a.dataset.cat === key));
    const cat = CATS[key];
    const name = document.getElementById('cat-name');
    if (name) {
      name.textContent = cat.name;
      document.getElementById('crumb-cat').textContent = cat.name;
      document.getElementById('cat-count').textContent = cat.count + ' предложений';
      document.title = cat.name + ' — EscrowHub';
      const chips = document.getElementById('cat-chips');
      chips.innerHTML = '<a class="fchip on">Все</a>' + cat.chips.map(c => `<a class="fchip">${c}</a>`).join('');
      $$('.fchip', chips).forEach(el => el.addEventListener('click', () => {
        $$('.fchip', chips).forEach(s => s.classList.remove('on'));
        el.classList.add('on');
      }));
      if (cat.card) {
        const cards = $$('.catalog .card');
        const match = c => cat.card === 'sale' ? !!c.querySelector('.price s') : c.querySelector('.card-cat').textContent.trim() === cat.card;
        if (cards.some(match)) cards.forEach(c => { c.style.display = match(c) ? '' : 'none'; });
      }
    }
  } else if (document.getElementById('cat-name')) {
    $$('.nav a[data-cat]').forEach(a => a.classList.toggle('active', a.dataset.cat === 'accounts'));
  }
})();
