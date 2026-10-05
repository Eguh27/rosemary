/**
 * Modul Checklist Perawatan Mingguan Rosemary
 * Mendukung interaksi klik, penyimpanan status di localStorage, dan update progress bar dinamis.
 */
export function initChecklist() {
  const container = document.querySelector('[data-checklist-container]');
  if (!container) return;

  const items = container.querySelectorAll('.checklist__item');
  const countEl = container.querySelector('[data-checklist-count]');
  const barEl = container.querySelector('[data-checklist-bar]');
  const messageEl = container.querySelector('[data-checklist-message]');
  const resetBtn = container.querySelector('[data-checklist-reset]');

  const STORAGE_KEY = 'rosemary_care_checklist_state';

  // Muat status tersimpan
  let state = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = JSON.parse(saved);
  } catch (e) {
    state = {};
  }

  function updateUI() {
    let completedCount = 0;
    items.forEach((item, index) => {
      const isChecked = !!state[index];
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = isChecked;
      item.classList.toggle('is-done', isChecked);
      if (isChecked) completedCount++;
    });

    const total = items.length;
    const percent = total > 0 ? (completedCount / total) * 100 : 0;

    if (countEl) {
      countEl.textContent = `${completedCount} / ${total} Tugas Selesai`;
    }
    if (barEl) {
      barEl.style.width = `${percent}%`;
    }
    if (messageEl) {
      if (completedCount === 0) {
        messageEl.textContent = 'Mulai perawatan minggu ini untuk menjaga rosemary Anda tetap prima.';
      } else if (completedCount < total) {
        messageEl.textContent = 'Bagus sekali! Lanjutkan langkah berikutnya untuk rosemary yang rimbun.';
      } else {
        messageEl.innerHTML = '✨ <strong>Luar biasa!</strong> Seluruh perawatan minggu ini selesai. Tanaman Anda sehat & segar!';
      }
    }
  }

  // Pasang event listener tiap checkbox / item
  items.forEach((item, index) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
      state[index] = checkbox.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {}
      updateUI();
    });

    // Klik seluruh baris juga bisa toggle
    item.addEventListener('click', (e) => {
      if (e.target !== checkbox && !e.target.closest('label')) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      updateUI();
    });
  }

  // Inisialisasi awal
  updateUI();
}
