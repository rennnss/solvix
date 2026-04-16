/* ============================================
   Solvix — University Complaint Tracker
   Frontend Application Logic (Desktop-First)
   ============================================ */

// ─── Mock Data ────────────────────────────────
let complaints = [];

// ─── Page Detection ───────────────────────────
function isLoginPage() {
    return !!document.getElementById('loginForm');
}

function isDashboardPage() {
    return !!document.getElementById('dashboardPage') || !!document.getElementById('complaintsList');
}

// ─── SVG Icons ────────────────────────────────
const icons = {
    trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    searchMinus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`
};

function getStatusIcon(status) {
    switch (status) {
        case 'in progress': return icons.trendUp;
        case 'pending': return icons.clock;
        case 'resolved': return icons.checkCircle;
        default: return icons.clock;
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'in progress': return 'in-progress';
        case 'pending': return 'pending';
        case 'resolved': return 'resolved';
        default: return 'pending';
    }
}

// ─── Toast ────────────────────────────────────
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============================================
//  LOGIN PAGE
// ============================================

function initLogin() {
    const form = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    toggleBtn.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        eyeIcon.innerHTML = isHidden
            ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
            : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginBtn');
        btn.textContent = 'Signing in...';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';

        const regNumber = document.getElementById('regNumber').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNumber, email, password })
            });
            const data = await response.json();

            if (data.success) {
                window.location.href = 'dashboard.html';
            } else {
                showToast(data.message || 'Login failed');
                btn.textContent = 'Login';
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            }
        } catch (error) {
            showToast('Error connecting to server');
            btn.textContent = 'Login';
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    });
}

// ============================================
//  DASHBOARD PAGE
// ============================================

let currentFilter = 'all';
let searchQuery = '';

function renderComplaints() {
    const list = document.getElementById('complaintsList');
    if (!list) return;

    let filtered = complaints;

    if (currentFilter !== 'all') {
        filtered = filtered.filter(c => c.status === currentFilter);
    }

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `
      <div class="empty-state">
        ${icons.searchMinus}
        <h3>No complaints found</h3>
        <p>Try adjusting your search or filter</p>
      </div>`;
        return;
    }

    list.innerHTML = filtered.map(c => `
    <article class="complaint-card" data-id="${c.id}" role="button" tabindex="0">
      <div class="complaint-icon ${getStatusClass(c.status)}">
        ${getStatusIcon(c.status)}
      </div>
      <div class="complaint-content">
        <h3>${c.title}</h3>
        <p>${c.description}</p>
      </div>
      <div class="complaint-badges">
        <span class="badge badge-${c.priority}">${c.priority}</span>
        <span class="badge badge-${getStatusClass(c.status)}">${c.status}</span>
      </div>
      <div class="complaint-meta-desktop">
        <span>${icons.folder} ${c.category}</span>
        <span>${icons.calendar} ${c.date}</span>
      </div>
      <div class="complaint-arrow">${icons.chevronRight}</div>
    </article>
  `).join('');

    // Click handlers
    list.querySelectorAll('.complaint-card').forEach(card => {
        card.addEventListener('click', () => openDetailModal(parseInt(card.dataset.id)));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDetailModal(parseInt(card.dataset.id));
            }
        });
    });
}

function updateStats() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;

    animateCounter('statTotal', total);
    animateCounter('statPending', pending);
    animateCounter('statInProgress', inProgress);
    animateCounter('statResolved', resolved);
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 12));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current;
    }, 50);
}

// ─── Detail Modal ─────────────────────────────
function openDetailModal(id) {
    const c = complaints.find(x => x.id === id);
    if (!c) return;

    const body = document.getElementById('detailBody');
    body.innerHTML = `
    <div class="detail-status-bar">
      <span class="badge badge-${c.priority}">${c.priority}</span>
      <span class="badge badge-${getStatusClass(c.status)}">${c.status}</span>
    </div>
    <h3 class="detail-title">${c.title}</h3>
    <p class="detail-description">${c.description}</p>
    <div class="detail-info-grid">
      <div class="detail-info-item">
        <div class="info-label">Category</div>
        <div class="info-value">${c.category}</div>
      </div>
      <div class="detail-info-item">
        <div class="info-label">Date</div>
        <div class="info-value">${c.date}</div>
      </div>
      <div class="detail-info-item">
        <div class="info-label">Priority</div>
        <div class="info-value" style="text-transform:capitalize">${c.priority}</div>
      </div>
      <div class="detail-info-item">
        <div class="info-label">Status</div>
        <div class="info-value" style="text-transform:capitalize">${c.status}</div>
      </div>
    </div>
    <div class="detail-info-item" style="margin-bottom:0">
      <div class="info-label">Submitted By</div>
      <div class="info-value">${c.submittedBy}</div>
    </div>
  `;

    toggleModal('detailModal', true);
}

// ─── New Complaint Form ───────────────────────
function initNewComplaintForm() {
    const form = document.getElementById('newComplaintForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('complaintTitle').value.trim();
        const desc = document.getElementById('complaintDesc').value.trim();
        const category = document.getElementById('complaintCategory').value;
        const priority = document.getElementById('complaintPriority').value;

        if (!title || !desc || !category || !priority) return;

        const btn = form.querySelector('.btn-submit');
        const ogText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: desc, category, priority })
            });
            const data = await response.json();

            if (data.success) {
                complaints.unshift(data.complaint);
                form.reset();
                toggleModal('newModal', false);
                renderComplaints();
                updateStats();
                showToast('✓ Complaint submitted successfully');
            } else {
                showToast('Failed to submit complaint');
            }
        } catch (error) {
            showToast('Error connecting to server');
        } finally {
            btn.textContent = ogText;
            btn.disabled = false;
        }
    });
}

// ─── Modal Toggle ─────────────────────────────
function toggleModal(id, show) {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    if (show) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initModals() {
    document.getElementById('detailClose')?.addEventListener('click', () => toggleModal('detailModal', false));
    document.getElementById('newClose')?.addEventListener('click', () => toggleModal('newModal', false));

    ['detailModal', 'newModal'].forEach(id => {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleModal(id, false);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleModal('detailModal', false);
            toggleModal('newModal', false);
        }
    });

    document.getElementById('btnNewComplaint')?.addEventListener('click', () => {
        toggleModal('newModal', true);
    });
}

// ─── Tabs ─────────────────────────────────────
function initTabs() {
    const nav = document.getElementById('tabsNav');
    if (!nav) return;

    nav.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderComplaints();
    });
}

// ─── Search ───────────────────────────────────
function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = input.value;
            renderComplaints();
        }, 200);
    });
}

// ─── Sidebar Toggle (Mobile) ──────────────────
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('btnSidebarToggle');

    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('active');
    });

    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (isLoginPage()) {
        initLogin();
    }

    if (isDashboardPage()) {
        fetch('/api/complaints')
            .then(res => res.json())
            .then(data => {
                complaints = data;
                renderComplaints();
                updateStats();
                initTabs();
                initSearch();
                initModals();
                initNewComplaintForm();
                initSidebar();
            })
            .catch(err => {
                showToast('Failed to load complaints');
            });
    }
});
