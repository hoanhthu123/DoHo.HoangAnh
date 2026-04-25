// app.js — Hoàng Anh Watch Repair App (v2 redesign)

const COLORS = {
  bg:         '#FFFFFF',
  bgSoft:     '#FAFAF9',
  bgSunken:   '#F3F4F6',
  border:     '#D4D4D0',
  borderSoft: '#E5E5E2',
  text:       '#111111',
  textMuted:  '#525252',
  textSubtle: '#737373',
  accent:     '#1E40AF',
  accentSoft: '#DBEAFE',
  danger:     '#B91C1C',
};

const STATUS = {
  received:  { label: 'Mới nhận',  fg: '#92400E', bg: '#FEF3C7', dot: '#D97706' },
  repairing: { label: 'Đang sửa',  fg: '#1E40AF', bg: '#DBEAFE', dot: '#2563EB' },
  ready:     { label: 'Xong rồi',  fg: '#14532D', bg: '#BBF7D0', dot: '#15803D' },
  picked:    { label: 'Đã giao',   fg: '#3F3F46', bg: '#E4E4E7', dot: '#71717A' },
};

const ICON_PATHS = {
  home:     '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  list:     '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  chart:    '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="13" y="8" width="3" height="10"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  back:     '<path d="M15 18l-6-6 6-6"/>',
  phone:    '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/>',
  message:  '<path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 8h8M8 12h5"/>',
  user:     '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:    '<path d="M20 6L9 17l-5-5"/>',
  edit:     '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  x:        '<path d="M18 6L6 18M6 6l12 12"/>',
  alert:    '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.3 18a2 2 0 001.7 3h16a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
  chevron:  '<path d="M9 6l6 6-6 6"/>',
  trash:    '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  camera:   '<path d="M4 7h3l2-2h6l2 2h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.5"/>',
};

function icon(name, size = 24, color = 'currentColor', sw = 2.2) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${ICON_PATHS[name] || ''}</svg>`;
}

function formatVND(n) {
  if (n == null) return '—';
  return n.toLocaleString('vi-VN') + '₫';
}
function formatDate(d) {
  const date = new Date(d);
  return String(date.getDate()).padStart(2,'0') + '/' + String(date.getMonth()+1).padStart(2,'0');
}
function formatDateTime(d) {
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2,'0');
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const yy = String(date.getFullYear()).slice(2);
  const hh = String(date.getHours()).padStart(2,'0');
  const mn = String(date.getMinutes()).padStart(2,'0');
  return `${dd}/${mm}/${yy}  ${hh}:${mn}`;
}

const NOW       = new Date();

function ago(days, h = 10, m = 0) {
  const t = new Date(NOW);
  t.setDate(t.getDate() - days);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
}

const SEED_TICKETS = [
  { id:'P-247', customer:'Nguyễn Văn Hùng',  phone:'0903 284 156', brand:'Rolex',    model:'Submariner',    issue:'Thay pin, đánh bóng',      status:'repairing', price:850000,  received:ago(2,9,15),  promised:ago(-1,17), finished:null,         note:'Khách quen' },
  { id:'P-246', customer:'Trần Thị Mai',      phone:'0987 112 340', brand:'Omega',    model:'Seamaster',     issue:'Thay kính bị nứt',         status:'ready',     price:1200000, received:ago(4,14),    promised:ago(0,16),  finished:ago(0,11,20), note:'' },
  { id:'P-245', customer:'Lê Quang Dũng',     phone:'0912 654 788', brand:'Seiko',    model:'Presage',       issue:'Máy chạy sai giờ',         status:'received',  price:450000,  received:ago(0,10,5),  promised:ago(-2,17), finished:null,         note:'' },
  { id:'P-244', customer:'Phạm Thu Hằng',     phone:'0934 001 228', brand:'Casio',    model:'G-Shock',       issue:'Thay dây',                 status:'ready',     price:320000,  received:ago(1,11,30), promised:ago(0,12),  finished:ago(0,9,45),  note:'' },
  { id:'P-243', customer:'Hoàng Minh Tuấn',   phone:'0908 776 512', brand:'Tissot',   model:'PRX',           issue:'Thay gioăng chống nước',   status:'repairing', price:680000,  received:ago(3,15,20), promised:ago(-1,17), finished:null,         note:'' },
  { id:'P-242', customer:'Võ Thị Lan',        phone:'0976 334 901', brand:'Longines', model:'Master',        issue:'Vệ sinh máy, tra dầu',     status:'repairing', price:1500000, received:ago(5,10),    promised:ago(-3,17), finished:null,         note:'' },
  { id:'P-241', customer:'Đỗ Văn Thành',      phone:'0931 445 667', brand:'Citizen',  model:'Eco-Drive',     issue:'Thay pin',                 status:'picked',    price:380000,  received:ago(7,14),    promised:ago(5,17),  finished:ago(6,10,30), note:'' },
  { id:'P-240', customer:'Nguyễn Văn Hùng',   phone:'0903 284 156', brand:'Rolex',    model:'Datejust',      issue:'Thay dây da',              status:'picked',    price:2100000, received:ago(10,11),   promised:ago(8,17),  finished:ago(8,15),    note:'Khách quen' },
  { id:'P-239', customer:'Trương Thị Hoa',    phone:'0917 882 445', brand:'Orient',   model:'Bambino',       issue:'Thay kính',                status:'picked',    price:420000,  received:ago(12,9),    promised:ago(10,17), finished:ago(10,14),   note:'' },
  { id:'P-238', customer:'Lê Quang Dũng',     phone:'0912 654 788', brand:'Seiko',    model:'Prospex',       issue:'Đánh bóng vỏ',             status:'picked',    price:750000,  received:ago(15,10),   promised:ago(12,17), finished:ago(12,16,20),note:'' },
  { id:'P-237', customer:'Bùi Thanh Tùng',    phone:'0945 223 908', brand:'Hamilton', model:'Khaki',         issue:'Thay pin, thay dây',       status:'picked',    price:290000,  received:ago(18,13),   promised:ago(16,17), finished:ago(16,11,10),note:'' },
  { id:'P-236', customer:'Phan Văn Khoa',     phone:'0968 551 779', brand:'Omega',    model:'Speedmaster',   issue:'Cân chỉnh máy cơ',         status:'picked',    price:1800000, received:ago(22,10),   promised:ago(19,17), finished:ago(19,17),   note:'' },
  { id:'P-235', customer:'Trần Thị Mai',      phone:'0987 112 340', brand:'Cartier',  model:'Tank',          issue:'Thay pin',                 status:'picked',    price:250000,  received:ago(25,11),   promised:ago(24,17), finished:ago(24,14),   note:'' },
  { id:'P-220', customer:'Nguyễn An',         phone:'0901 111 222', brand:'Seiko',    model:'5 Sports',      issue:'Thay pin',                 status:'picked',    price:180000,  received:ago(35,10),   promised:ago(34,17), finished:ago(34,14),   note:'' },
  { id:'P-219', customer:'Lê Hoa',            phone:'0902 222 333', brand:'Rolex',    model:'Oyster',        issue:'Đánh bóng',                status:'picked',    price:950000,  received:ago(38,10),   promised:ago(36,17), finished:ago(36,14),   note:'' },
  { id:'P-218', customer:'Trần Bình',         phone:'0903 333 444', brand:'Casio',    model:'Edifice',       issue:'Thay pin',                 status:'picked',    price:220000,  received:ago(42,10),   promised:ago(41,17), finished:ago(41,14),   note:'' },
  { id:'P-217', customer:'Phạm Cường',        phone:'0904 444 555', brand:'Tissot',   model:'Le Locle',      issue:'Vệ sinh máy',              status:'picked',    price:1100000, received:ago(45,10),   promised:ago(42,17), finished:ago(42,14),   note:'' },
  { id:'P-216', customer:'Đinh Dũng',         phone:'0905 555 666', brand:'Omega',    model:'Constellation', issue:'Thay kính',                status:'picked',    price:1400000, received:ago(48,10),   promised:ago(46,17), finished:ago(46,14),   note:'' },
];

const STORAGE_KEY = 'wr_shop_settings_v1';
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
const CONVEX_HTTP_BASE = 'https://outgoing-buzzard-116.convex.site';

const state = {
  tickets:   [],
  route:     { name: 'dashboard' },
  shopName:  'ĐH Hoàng Anh',
  ownerName: 'Anh Hoàng',
  filter:       'all',
  query:        '',
  analyticsMonth: 0,
};

let ocrScriptPromise = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.shopName  = saved.shopName  || state.shopName;
      state.ownerName = saved.ownerName || state.ownerName;
    }
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      shopName: state.shopName, ownerName: state.ownerName,
    }));
  } catch(e) {}
}

function getTicketCode(ticket) {
  return ticket.ticketCode || ticket.id;
}

function normalizeTicket(raw) {
  return {
    ...raw,
    id: raw.ticketCode || raw.id,
    ticketCode: raw.ticketCode || raw.id,
    model: raw.model || '',
    note: raw.note || '',
    watchImage: raw.watchImage || '',
    price: typeof raw.price === 'number' ? raw.price : 0,
    finished: raw.finished || null,
  };
}

function patchTicketLocal(ticketCode, patch) {
  state.tickets = state.tickets.map(t => (getTicketCode(t) === ticketCode ? { ...t, ...patch } : t));
}

function finishedByStatus(nextStatus, currentFinished) {
  if (nextStatus === 'ready' || nextStatus === 'picked') {
    return currentFinished || new Date().toISOString();
  }
  return null;
}

async function convexRequest(path, method = 'GET', body = null) {
  const opts = { method, headers: {} };
  if (body != null) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${CONVEX_HTTP_BASE}${path}`, opts);
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    throw new Error(data.error || 'Lỗi gọi API Convex');
  }
  return data;
}

async function refreshTickets() {
  const data = await convexRequest('/tickets');
  const rows = Array.isArray(data.tickets) ? data.tickets : [];
  state.tickets = rows.map(normalizeTicket);
}

function nav(name, params = {}) {
  state.route = { name, ...params };
  state.filter = params.filter || 'all';
  state.query  = '';
  if (name !== 'analytics') state.analyticsMonth = 0;
  render();
}

function loadOcrEngine() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (ocrScriptPromise) return ocrScriptPromise;

  ocrScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TESSERACT_CDN;
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) resolve(window.Tesseract);
      else reject(new Error('Không tải được thư viện OCR.'));
    };
    script.onerror = () => reject(new Error('Lỗi tải thư viện OCR.'));
    document.head.appendChild(script);
  });

  return ocrScriptPromise;
}

function foldVietnamese(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function extractPhoneFromOcr(text) {
  const chunks = (text.match(/(?:\+?\d[\d\s().-]{8,}\d)/g) || [])
    .map(s => s.replace(/[^\d+]/g, ''));

  for (const raw of chunks) {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('84') && digits.length >= 11) {
      digits = '0' + digits.slice(2);
    }
    if (/^0\d{9,10}$/.test(digits)) {
      return digits.length === 10
        ? `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}`
        : `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7,11)}`;
    }
  }
  return '';
}

function normalizeName(name) {
  return name
    .replace(/[^\p{L}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractNameFromOcr(text) {
  const lines = text
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);

  const keywordPriority = [];
  const otherCandidates = [];

  for (const line of lines) {
    const plain = foldVietnamese(line).toLowerCase();
    if (plain.length < 5 || plain.length > 48) continue;
    if (/\d/.test(plain)) continue;

    const pieces = line
      .replace(/[:|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = pieces.split(' ').filter(Boolean).length;
    if (wordCount < 2 || wordCount > 5) continue;

    const normalized = normalizeName(pieces);
    if (!normalized) continue;

    if (/(ten|ho ten|khach hang)/.test(plain)) {
      const droppedPrefix = normalized
        .replace(/^(Ten|Ho Ten|Khach Hang)\s+/i, '')
        .trim();
      if (droppedPrefix) keywordPriority.push(droppedPrefix);
      continue;
    }

    otherCandidates.push(normalized);
  }

  return keywordPriority[0] || otherCandidates[0] || '';
}

function parseCustomerFromOcr(text) {
  return {
    phone: extractPhoneFromOcr(text),
    name: extractNameFromOcr(text),
  };
}

function imageFileToDataUrl(file, maxSize = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không thể xử lý ảnh.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Ảnh không hợp lệ.'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
    reader.readAsDataURL(file);
  });
}

// ── Status badge (inline style — consistent with design tokens) ──
function statusBadge(status) {
  const s = STATUS[status];
  return `<span class="status-badge" style="color:${s.fg};background:${s.bg}"><span class="status-dot" style="background:${s.dot}"></span>${s.label}</span>`;
}

// ── Ticket card ──────────────────────────────────────────────────
function ticketCard(ticket) {
  const overdue = ticket.status !== 'picked' && ticket.status !== 'ready' && new Date(ticket.promised) < NOW;
  const ticketCode = getTicketCode(ticket);
  return `
    <div class="ticket-card card" data-ticket-id="${ticketCode}" role="button" tabindex="0">
      <div class="tc-top">
        ${statusBadge(ticket.status)}
        <span class="tc-id">${ticketCode}</span>
      </div>
      <div class="tc-customer">${ticket.customer}</div>
      <div class="tc-watch">${ticket.brand} ${ticket.model} — ${ticket.issue}</div>
      <div class="tc-footer">
        <span class="tc-due${overdue ? ' overdue' : ''}">
          ${icon('clock', 15, overdue ? COLORS.danger : COLORS.textMuted, 2.2)}
          Hẹn ${formatDate(ticket.promised)}${overdue ? ' · TRỄ' : ''}
        </span>
        <span class="tc-price">${formatVND(ticket.price)}</span>
      </div>
    </div>`;
}

// ── Tab bar (4 tabs) ─────────────────────────────────────────────
function tabBar(active) {
  const tabs = [
    { key: 'dashboard', ic: 'home',  label: 'Trang chủ' },
    { key: 'tickets',   ic: 'list',  label: 'Phiếu' },
    { key: 'analytics', ic: 'chart', label: 'Thống kê' },
    { key: 'settings',  ic: 'user',  label: 'Cài đặt' },
  ];
  return `<nav class="tab-bar">${tabs.map(t => {
    const on = active === t.key;
    return `<button class="tab-btn${on ? ' active' : ''}" data-nav="${t.key}">${icon(t.ic, 24, on ? COLORS.accent : COLORS.textMuted, on ? 2.4 : 2)}<span>${t.label}</span></button>`;
  }).join('')}</nav>`;
}

// ── Dashboard ────────────────────────────────────────────────────
function renderDashboard() {
  const tix       = state.tickets;
  const received  = tix.filter(t => t.status === 'received');
  const repairing = tix.filter(t => t.status === 'repairing');
  const ready     = tix.filter(t => t.status === 'ready');
  const overdue   = tix.filter(t => t.status !== 'picked' && t.status !== 'ready' && new Date(t.promised) < NOW);

  const statusRow = (key, label, count, s) => `
    <button class="status-row-btn" data-nav-filter="${key}">
      <div class="sri" style="background:${s.bg}">
        <span style="font-size:22px;font-weight:700;color:${s.dot}">${count}</span>
      </div>
      <span class="srl">${label}</span>
      ${icon('chevron', 20, COLORS.textSubtle)}
    </button>`;

  return `<div class="screen">
    <div class="shop-header">
      <div class="shop-date">Thứ sáu, 24/04/2026</div>
      <div class="shop-name">${state.shopName}</div>
    </div>

    <button class="btn-big-primary" data-nav="create">
      ${icon('plus', 26, '#fff', 2.5)} Nhận đồng hồ mới
    </button>

    ${overdue.length > 0 ? `<div class="overdue-alert">
      <div class="overdue-icon">${icon('alert', 24, COLORS.danger, 2.5)}</div>
      <div>
        <div class="overdue-title">${overdue.length} phiếu trễ hẹn</div>
        <div class="overdue-body">Cần gọi khách báo</div>
      </div>
    </div>` : ''}

    <div class="status-rows">
      ${statusRow('received',  'Mới nhận',               received.length,  STATUS.received)}
      ${statusRow('repairing', 'Đang sửa',               repairing.length, STATUS.repairing)}
      ${statusRow('ready',     'Xong — chờ khách đến lấy', ready.length,   STATUS.ready)}
    </div>

    ${ready.length > 0 ? `
      <div class="section-title">Đồng hồ xong — chờ lấy</div>
      <div class="card-list">${ready.slice(0,4).map(ticketCard).join('')}</div>
    ` : ''}
  </div>`;
}

// ── Ticket list ──────────────────────────────────────────────────
function renderTicketList() {
  const tix = state.tickets;
  const counts = {
    all:       tix.length,
    received:  tix.filter(t => t.status === 'received').length,
    repairing: tix.filter(t => t.status === 'repairing').length,
    ready:     tix.filter(t => t.status === 'ready').length,
    picked:    tix.filter(t => t.status === 'picked').length,
  };
  let list = state.filter !== 'all' ? tix.filter(t => t.status === state.filter) : tix.slice();
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(t =>
      t.customer.toLowerCase().includes(q) || t.phone.includes(q) ||
      getTicketCode(t).toLowerCase().includes(q) || t.brand.toLowerCase().includes(q)
    );
  }
  list.sort((a,b) => new Date(b.received) - new Date(a.received));

  const filters = [
    { key:'all',       label:'Tất cả' },
    { key:'received',  label:'Mới nhận' },
    { key:'repairing', label:'Đang sửa' },
    { key:'ready',     label:'Xong rồi' },
    { key:'picked',    label:'Đã giao' },
  ];

  return `<div style="padding-bottom:110px">
    <div class="list-header">
      <div class="screen-title">Danh sách phiếu</div>
      <div class="screen-subtitle">${counts.all} phiếu</div>
    </div>
    <div class="search-wrap">
      <div class="search-bar">
        ${icon('search', 20, COLORS.textMuted)}
        <input id="search-input" class="search-input" placeholder="Tìm tên hoặc SĐT" value="${state.query.replace(/"/g,'&quot;')}">
        ${state.query ? `<button class="search-clear" id="search-clear">${icon('x', 18)}</button>` : ''}
      </div>
    </div>
    <div class="filter-chips">
      ${filters.map(f => `<button class="filter-chip${state.filter===f.key?' active':''}" data-filter="${f.key}">${f.label} · ${counts[f.key]}</button>`).join('')}
    </div>
    <div class="list-body">
      ${list.length === 0
        ? `<div class="empty-state">Chưa có phiếu nào</div>`
        : list.map(ticketCard).join('')}
    </div>
  </div>`;
}

// ── Ticket detail ────────────────────────────────────────────────
function renderTicketDetail(id) {
  const ticket = state.tickets.find(t => getTicketCode(t) === id);
  if (!ticket) return '<div class="screen">Không tìm thấy phiếu.</div>';
  const ticketCode = getTicketCode(ticket);
  const phoneHref = ticket.phone.replace(/\s/g, '');

  const overdue   = ticket.status !== 'picked' && ticket.status !== 'ready' && new Date(ticket.promised) < NOW;
  const nextLabel = { received:'Bắt đầu sửa', repairing:'Đã sửa xong', ready:'Khách đã lấy', picked:null }[ticket.status];

  const infoRow = (label, val, danger = false) => `
    <div class="info-line">
      <span class="info-label">${label}</span>
      <span class="info-value${danger ? ' danger' : ''}">${val}</span>
    </div>`;

  const statusChoices = [
    { key: 'received', label: 'Mới nhận' },
    { key: 'repairing', label: 'Đang sửa' },
    { key: 'ready', label: 'Xong rồi' },
    { key: 'picked', label: 'Đã giao' },
  ];

  return `<div style="padding-bottom:120px">
    <div class="back-bar">
      <button class="btn-back" data-nav="tickets">
        ${icon('back', 22, COLORS.accent)} Quay lại
      </button>
    </div>

    <div class="detail-head">
      <div class="detail-badges">
        ${statusBadge(ticket.status)}
        <span class="detail-id">${ticketCode}</span>
      </div>
      <div class="detail-name-row">
        <div class="detail-customer">${ticket.customer}</div>
        <button class="btn-edit-ticket" data-nav-edit-ticket="${ticketCode}">
          ${icon('edit', 16, COLORS.accent, 2.1)} Sửa
        </button>
      </div>
      <div class="detail-watch">${ticket.brand} ${ticket.model}</div>
    </div>

    ${nextLabel ? `<div class="detail-action">
      <button class="btn-advance" data-action="advance" data-ticket-id="${ticketCode}">
        ${icon('check', 22, '#fff', 2.5)} ${nextLabel}
      </button>
    </div>` : ''}

    <div class="detail-section">
      <div class="card status-edit-card">
        <div class="status-edit-title">CHỈNH TRẠNG THÁI</div>
        <div class="status-edit-grid">
          ${statusChoices.map(s => `<button class="status-edit-btn${ticket.status===s.key?' active':''}" data-action="set-status" data-ticket-id="${ticketCode}" data-status="${s.key}">${s.label}</button>`).join('')}
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="card phone-card">
        <div class="phone-info">
          <div class="phone-label">SỐ ĐIỆN THOẠI</div>
          <div class="phone-number">${ticket.phone}</div>
        </div>
        <div class="phone-actions">
          <a href="sms:${phoneHref}" class="sms-btn-lg" aria-label="Nhắn tin khách hàng">
            ${icon('message', 23, '#fff', 2.1)}
          </a>
          <a href="tel:${phoneHref}" class="call-btn-lg" aria-label="Gọi khách hàng">
            ${icon('phone', 24, '#fff', 2.2)}
          </a>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="card">
        <div class="block-pad">
          <div class="block-label">HƯ HỎNG</div>
          <div class="block-value">${ticket.issue}</div>
        </div>
      </div>
    </div>

    ${ticket.watchImage ? `<div class="detail-section">
      <div class="card block-pad">
        <div class="block-label">ẢNH ĐỒNG HỒ</div>
        <img class="watch-photo-view" src="${ticket.watchImage}" alt="Ảnh đồng hồ ${ticketCode}">
      </div>
    </div>` : ''}

    <div class="detail-section">
      <div class="card">
        ${infoRow('Nhận máy', formatDateTime(ticket.received))}
        <div class="line-div"></div>
        ${infoRow('Hẹn trả', formatDateTime(ticket.promised) + (overdue ? ' <strong>· TRỄ</strong>' : ''), overdue)}
        ${ticket.finished ? `<div class="line-div"></div>${infoRow('Sửa xong', formatDateTime(ticket.finished))}` : ''}
        <div class="line-div"></div>
        <div class="price-line">
          <span>Tiền công</span>
          <span class="price-amount">${formatVND(ticket.price)}</span>
        </div>
      </div>
    </div>

    ${ticket.note ? `<div class="detail-section">
      <div class="card">
        <div class="block-pad">
          <div class="block-label">GHI CHÚ</div>
          <div class="block-value italic">${ticket.note}</div>
        </div>
      </div>
    </div>` : ''}

    <div class="detail-section">
      <button class="btn-delete" data-action="delete" data-ticket-id="${ticketCode}">
        ${icon('trash', 20, COLORS.danger, 2)} Xoá phiếu
      </button>
    </div>
  </div>`;
}

function renderEditTicket(id) {
  const ticket = state.tickets.find(t => getTicketCode(t) === id);
  if (!ticket) return '<div class="screen">Không tìm thấy phiếu.</div>';
  const ticketCode = getTicketCode(ticket);

  const fb = (title, inner) => `<div class="form-block">
    <div class="fb-title">${title}</div>
    <div class="card fb-card">${inner}</div>
  </div>`;

  const bf = (label, req, inner) => `<div class="big-field">
    <div class="bf-label">${label}${req ? '<span class="req"> *</span>' : ''}</div>
    ${inner}
  </div>`;

  const esc = s => String(s || '').replace(/"/g, '&quot;');

  return `<div style="padding-bottom:140px">
    <div class="create-hdr">
      <button class="btn-cancel" data-nav="ticket" data-ticket-id="${ticketCode}">Huỷ</button>
      <div style="width:60px"></div>
    </div>
    <div class="create-title-block">
      <div class="create-main-title">Sửa phiếu</div>
      <div class="create-id-line">Mã phiếu: <span class="mono">${ticketCode}</span></div>
    </div>

    ${fb('Khách hàng', `
      ${bf('Tên khách', true, `<input id="e-customer" class="bf-input" value="${esc(ticket.customer)}">`)}
      <div class="field-div"></div>
      ${bf('Số điện thoại', true, `<input id="e-phone" class="bf-input mono" value="${esc(ticket.phone)}" inputmode="tel">`)}
    `)}

    ${fb('Đồng hồ', `
      ${bf('Hãng', true, `<input id="e-brand" class="bf-input" value="${esc(ticket.brand)}">`)}
      <div class="field-div"></div>
      ${bf('Model (không bắt buộc)', false, `<input id="e-model" class="bf-input" value="${esc(ticket.model)}">`)}
      <div class="field-div"></div>
      ${bf('Hỏng gì?', true, `<textarea id="e-issue" class="bf-input" rows="2">${esc(ticket.issue)}</textarea>`)}
    `)}

    ${fb('Ghi chú (không bắt buộc)', `
      ${bf('', false, `<textarea id="e-note" class="bf-input" rows="2">${esc(ticket.note)}</textarea>`)}
    `)}

    <div class="create-submit-bar">
      <button class="btn-submit" id="edit-submit-btn" data-ticket-id="${ticketCode}">Lưu thay đổi</button>
    </div>
  </div>`;
}

// ── Create ticket ────────────────────────────────────────────────
function renderCreateTicket() {
  const nums   = state.tickets.map(t => parseInt(getTicketCode(t).replace(/[^\d]/g,''),10)).filter(n => !isNaN(n));
  const nextId = `P-${(nums.length ? Math.max(...nums) : 0) + 1}`;
  const BRANDS = ['Rolex','Omega','Seiko','Casio','Tissot','Citizen','Longines','Cartier','Hamilton','Orient'];

  const fb = (title, inner) => `<div class="form-block">
    <div class="fb-title">${title}</div>
    <div class="card fb-card">${inner}</div>
  </div>`;

  const bf = (label, req, inner) => `<div class="big-field">
    <div class="bf-label">${label}${req ? '<span class="req"> *</span>' : ''}</div>
    ${inner}
  </div>`;

  return `<div style="padding-bottom:140px">
    <div class="create-hdr">
      <button class="btn-cancel" data-nav="dashboard">Huỷ</button>
      <div style="width:60px"></div>
    </div>
    <div class="create-title-block">
      <div class="create-main-title">Phiếu mới</div>
      <div class="create-id-line">Mã phiếu: <span class="mono">${nextId}</span></div>
    </div>

    ${fb('Khách hàng', `
      <div class="scan-tools">
        <button class="btn-scan-image" id="btn-scan-image" type="button">
          ${icon('camera', 18, COLORS.accent, 2.1)} Chụp/scan ảnh lấy tên + SĐT
        </button>
        <input id="ocr-image-input" type="file" accept="image/*" capture="environment" hidden>
        <div class="ocr-status" id="ocr-status"></div>
      </div>
      ${bf('Tên khách', true, `<input id="f-customer" class="bf-input" placeholder="Nguyễn Văn A">`)}
      <div class="field-div"></div>
      ${bf('Số điện thoại', true, `<input id="f-phone" class="bf-input mono" placeholder="0900 000 000" inputmode="tel">`)}
    `)}

    ${fb('Đồng hồ', `
      <div class="watch-photo-tools">
        <button class="btn-watch-photo" id="btn-watch-photo" type="button">
          ${icon('camera', 18, COLORS.accent, 2.1)} Chụp hình đồng hồ
        </button>
        <input id="watch-photo-input" type="file" accept="image/*" capture="environment" hidden>
        <input id="f-watch-image" type="hidden" value="">
        <div class="watch-photo-preview" id="watch-photo-preview-wrap" hidden>
          <img id="watch-photo-preview" alt="Ảnh đồng hồ vừa chụp">
          <button type="button" id="clear-watch-photo">Xoá ảnh</button>
        </div>
      </div>
      ${bf('Hãng', true, `<input id="f-brand" class="bf-input" placeholder="Rolex, Seiko..." list="brand-list"><datalist id="brand-list">${BRANDS.map(b=>`<option value="${b}">`).join('')}</datalist>`)}
      <div class="field-div"></div>
      ${bf('Model (không bắt buộc)', false, `<input id="f-model" class="bf-input" placeholder="Submariner">`)}
      <div class="field-div"></div>
      ${bf('Hỏng gì?', true, `<textarea id="f-issue" class="bf-input" rows="2" placeholder="Thay pin, đánh bóng..."></textarea>`)}
    `)}

    ${fb('Ghi chú (không bắt buộc)', `
      ${bf('', false, `<textarea id="f-note" class="bf-input" rows="2" placeholder="Khách quen, giảm 10%..."></textarea>`)}
    `)}

    <div class="create-submit-bar">
      <button class="btn-submit" id="create-submit-btn" data-next-id="${nextId}">Lưu phiếu</button>
    </div>
  </div>`;
}

// ── Analytics ────────────────────────────────────────────────────
function renderAnalytics() {
  const tix    = state.tickets;
  const months = {};
  tix.forEach(t => {
    const d   = new Date(t.received);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!months[key]) months[key] = { key, revenue:0, inCount:0, outCount:0 };
    months[key].inCount++;
    if (t.status==='picked') { months[key].revenue += t.price; months[key].outCount++; }
  });
  const monthData = Object.values(months).sort((a,b) => b.key.localeCompare(a.key));
  const idx  = Math.min(state.analyticsMonth, Math.max(0, monthData.length - 1));
  const cur  = monthData[idx]  || { revenue:0, inCount:0, outCount:0, key:'2026-04' };
  const prev = monthData[idx+1] || { revenue:0, inCount:0, outCount:0 };
  const revChg = prev.revenue ? Math.round(((cur.revenue-prev.revenue)/prev.revenue)*100) : 0;
  const canPrev = idx < monthData.length - 1;
  const canNext = idx > 0;

  const KW = [
    { kw:['pin'],                 label:'Thay pin' },
    { kw:['kính'],                label:'Thay kính' },
    { kw:['dây'],                 label:'Thay dây' },
    { kw:['bóng'],                label:'Đánh bóng' },
    { kw:['vệ sinh','tra dầu'],   label:'Vệ sinh máy' },
    { kw:['chỉnh','sai giờ'],     label:'Cân chỉnh' },
    { kw:['gioăng','chống nước'], label:'Chống nước' },
  ];
  const issues = KW.map(k => ({
    label: k.label,
    count: tix.filter(t => k.kw.some(w => t.issue.toLowerCase().includes(w))).length,
  })).filter(i => i.count>0).sort((a,b) => b.count-a.count);
  const maxIssue = Math.max(...issues.map(i=>i.count), 1);

  const vnMonth = key => { const [y,m] = key.split('-'); return `Tháng ${parseInt(m)}/${y}`; };

  const bigStat = (label, val, prevVal) => {
    const diff = val - prevVal;
    return `<div class="big-stat-tile">
      <div class="bst-label">${label}</div>
      <div class="bst-value">${val}</div>
      ${prevVal > 0 ? `<div class="bst-compare">${diff>=0?'+':''}${diff} vs trước</div>` : ''}
    </div>`;
  };

  return `<div style="padding-bottom:110px">
    <div class="an-hdr">
      <div class="an-sub">Thống kê</div>
      <div class="an-month-nav">
        <button class="an-nav-btn" id="an-prev" ${!canPrev ? 'disabled' : ''}>
          ${icon('back', 22, canPrev ? COLORS.accent : COLORS.textSubtle)}
        </button>
        <div class="an-title">${vnMonth(cur.key)}</div>
        <button class="an-nav-btn" id="an-next" ${!canNext ? 'disabled' : ''}>
          ${icon('chevron', 22, canNext ? COLORS.accent : COLORS.textSubtle)}
        </button>
      </div>
    </div>

    <div class="an-sec">
      <div class="card rev-card">
        <div class="rev-label">DOANH THU THÁNG NÀY</div>
        <div class="rev-amount">${formatVND(cur.revenue)}</div>
        ${prev.revenue>0 ? `<div class="rev-change">
          <span class="${revChg>=0?'rev-up':'rev-dn'}">${revChg>=0?'▲':'▼'} ${Math.abs(revChg)}%</span>
          &nbsp;so với tháng trước
        </div>` : ''}
      </div>
    </div>

    <div class="an-sec big-stat-grid">
      ${bigStat('Nhận vào',   cur.inCount,  prev.inCount)}
      ${bigStat('Giao khách', cur.outCount, prev.outCount)}
    </div>

    <div class="an-sec">
      <div class="an-sec-title">Sửa gì nhiều nhất</div>
      <div class="card" style="padding:6px 16px">
        ${issues.map((item,i) => `<div class="iss-row${i<issues.length-1?' bb':''}">
          <div class="iss-top"><span>${item.label}</span><span class="mono">${item.count} lần</span></div>
          <div class="iss-bar-bg"><div class="iss-bar" style="width:${(item.count/maxIssue)*100}%"></div></div>
        </div>`).join('')}
      </div>
    </div>

  </div>`;
}

// ── Settings ─────────────────────────────────────────────────────
function renderSettings() {
  return `<div style="padding-bottom:110px">
    <div class="settings-hdr">
      <div class="screen-title">Cài đặt</div>
    </div>

    <div class="an-sec">
      <div class="an-sec-title">Cửa hàng</div>
      <div class="card">
        <div class="setting-field">
          <div class="setting-label">Tên cửa hàng</div>
          <input id="s-shopname" class="setting-input" value="${state.shopName}">
        </div>
        <div class="line-div" style="margin-left:16px"></div>
        <div class="setting-field">
          <div class="setting-label">Chủ cửa hàng</div>
          <input id="s-owner" class="setting-input" value="${state.ownerName}">
        </div>
      </div>
    </div>

    <div class="an-sec">
      <div class="an-sec-title">Ứng dụng</div>
      <div class="card">
        <div class="setting-row"><span>Phiên bản</span><span class="setting-val">1.0</span></div>
        <div class="line-div" style="margin-left:16px"></div>
        <div class="setting-row"><span>Tiền tệ</span><span class="setting-val">VND ₫</span></div>
        <div class="line-div" style="margin-left:16px"></div>
        <div class="setting-row"><span>Ngôn ngữ</span><span class="setting-val">Tiếng Việt</span></div>
      </div>
    </div>

    <div class="an-sec">
      <div class="card">
        <button class="btn-ghost-danger" id="reset-btn">Đặt lại dữ liệu mẫu</button>
      </div>
    </div>
  </div>`;
}

// ── Render ───────────────────────────────────────────────────────
function render() {
  const route   = state.route;
  const hideTab = route.name === 'ticket' || route.name === 'create' || route.name === 'edit';
  const active  = route.name === 'ticket' ? 'tickets' : route.name;

  let screen = '';
  if      (route.name === 'dashboard') screen = renderDashboard();
  else if (route.name === 'tickets')   screen = renderTicketList();
  else if (route.name === 'ticket')    screen = renderTicketDetail(route.id);
  else if (route.name === 'create')    screen = renderCreateTicket();
  else if (route.name === 'edit')      screen = renderEditTicket(route.id);
  else if (route.name === 'analytics') screen = renderAnalytics();
  else if (route.name === 'settings')  screen = renderSettings();

  document.getElementById('app').innerHTML =
    `<div class="app-wrapper"><div class="screen-wrapper${hideTab?'':' has-tab'}">${screen}</div>${hideTab ? '' : tabBar(active)}</div>`;

  attachListeners();
}

// ── Event listeners ──────────────────────────────────────────────
function attachListeners() {
  const app = document.getElementById('app');

  app.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      if (el.dataset.nav === 'ticket' && el.dataset.ticketId) {
        nav('ticket', { id: el.dataset.ticketId });
        return;
      }
      nav(el.dataset.nav);
    });
  });

  app.querySelectorAll('[data-nav-edit-ticket]').forEach(el => {
    el.addEventListener('click', () => nav('edit', { id: el.dataset.navEditTicket }));
  });

  app.querySelectorAll('[data-nav-filter]').forEach(el => {
    el.addEventListener('click', () => nav('tickets', { filter: el.dataset.navFilter }));
  });

  app.querySelectorAll('.ticket-card').forEach(el => {
    el.addEventListener('click', () => nav('ticket', { id: el.dataset.ticketId }));
    el.addEventListener('keydown', e => { if (e.key==='Enter') nav('ticket', { id: el.dataset.ticketId }); });
  });

  const advBtn = app.querySelector('[data-action="advance"]');
  if (advBtn) {
    advBtn.addEventListener('click', async () => {
      const id     = advBtn.dataset.ticketId;
      if (!id) return;

      const ticket = state.tickets.find(t => getTicketCode(t) === id);
      if (!ticket) return;
      const flow = ['received', 'repairing', 'ready', 'picked'];
      const next = flow[flow.indexOf(ticket.status) + 1];
      if (!next) return;

      patchTicketLocal(id, {
        status: next,
        finished: finishedByStatus(next, ticket.finished),
      });
      nav('ticket', { id });

      try {
        await convexRequest('/tickets/advance', 'POST', { ticketCode: id });
        await refreshTickets();
        nav('ticket', { id });
      } catch (err) {
        await refreshTickets();
        nav('ticket', { id });
        alert('Không cập nhật được trạng thái phiếu.');
      }
    });
  }

  const delBtn = app.querySelector('[data-action="delete"]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      if (!confirm('Xoá phiếu này?')) return;
      try {
        await convexRequest('/tickets/delete', 'POST', { ticketCode: delBtn.dataset.ticketId });
        await refreshTickets();
        nav('tickets');
      } catch (err) {
        alert('Không xoá được phiếu.');
      }
    });
  }

  app.querySelectorAll('[data-action="set-status"]').forEach(el => {
    el.addEventListener('click', async () => {
      const ticketCode = el.dataset.ticketId;
      const status = el.dataset.status;
      if (!ticketCode || !status) return;

      const ticket = state.tickets.find(t => getTicketCode(t) === ticketCode);
      if (!ticket || ticket.status === status) return;

      patchTicketLocal(ticketCode, {
        status,
        finished: finishedByStatus(status, ticket.finished),
      });
      nav('ticket', { id: ticketCode });

      try {
        await convexRequest('/tickets/status', 'POST', { ticketCode, status });
        await refreshTickets();
        nav('ticket', { id: ticketCode });
      } catch (err) {
        await refreshTickets();
        nav('ticket', { id: ticketCode });
        alert('Không đổi được trạng thái phiếu.');
      }
    });
  });

  app.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => { state.filter = el.dataset.filter; render(); });
  });

  const searchInput = app.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => { state.query = e.target.value; render(); });
  }
  const searchClear = app.querySelector('#search-clear');
  if (searchClear) {
    searchClear.addEventListener('click', () => { state.query = ''; render(); });
  }

  const createBtn = app.querySelector('#create-submit-btn');
  if (createBtn) {
    const scanBtn = app.querySelector('#btn-scan-image');
    const imageInput = app.querySelector('#ocr-image-input');
    const ocrStatus = app.querySelector('#ocr-status');
    const customerInput = app.querySelector('#f-customer');
    const phoneInput = app.querySelector('#f-phone');

    const setOcrStatus = (msg, isError = false) => {
      if (!ocrStatus) return;
      ocrStatus.textContent = msg || '';
      ocrStatus.classList.toggle('error', !!isError);
    };

    if (scanBtn && imageInput) {
      scanBtn.addEventListener('click', () => imageInput.click());
      imageInput.addEventListener('change', async () => {
        const file = imageInput.files?.[0];
        if (!file) return;

        scanBtn.disabled = true;
        setOcrStatus('Đang chuẩn bị OCR...');

        try {
          const Tesseract = await loadOcrEngine();
          const result = await Tesseract.recognize(file, 'vie+eng', {
            logger: m => {
              if (!m || m.status !== 'recognizing text') return;
              const percent = Math.round((m.progress || 0) * 100);
              setOcrStatus(`Đang đọc ảnh... ${percent}%`);
            },
          });

          const parsed = parseCustomerFromOcr(result?.data?.text || '');
          if (parsed.name && customerInput && !customerInput.value.trim()) {
            customerInput.value = parsed.name;
          }
          if (parsed.phone && phoneInput && !phoneInput.value.trim()) {
            phoneInput.value = parsed.phone;
          }

          if (parsed.name || parsed.phone) {
            setOcrStatus('Đã nhận diện xong. Bạn kiểm tra lại trước khi lưu phiếu.');
          } else {
            setOcrStatus('Không nhận diện rõ tên/SĐT. Vui lòng chụp ảnh rõ hơn.', true);
          }
        } catch (err) {
          setOcrStatus('OCR lỗi. Vui lòng thử lại bằng ảnh sáng, rõ nét.', true);
        } finally {
          imageInput.value = '';
          scanBtn.disabled = false;
        }
      });
    }

    const watchPhotoBtn = app.querySelector('#btn-watch-photo');
    const watchPhotoInput = app.querySelector('#watch-photo-input');
    const watchImageField = app.querySelector('#f-watch-image');
    const watchPreviewWrap = app.querySelector('#watch-photo-preview-wrap');
    const watchPreview = app.querySelector('#watch-photo-preview');
    const clearWatchPhotoBtn = app.querySelector('#clear-watch-photo');

    if (watchPhotoBtn && watchPhotoInput && watchImageField && watchPreviewWrap && watchPreview) {
      watchPhotoBtn.addEventListener('click', () => watchPhotoInput.click());

      watchPhotoInput.addEventListener('change', async () => {
        const file = watchPhotoInput.files?.[0];
        if (!file) return;

        watchPhotoBtn.disabled = true;
        watchPhotoBtn.textContent = 'Đang xử lý ảnh...';
        try {
          const imageDataUrl = await imageFileToDataUrl(file);
          watchImageField.value = imageDataUrl;
          watchPreview.src = imageDataUrl;
          watchPreviewWrap.hidden = false;
        } catch (err) {
          alert('Không xử lý được ảnh. Vui lòng thử lại.');
        } finally {
          watchPhotoInput.value = '';
          watchPhotoBtn.disabled = false;
          watchPhotoBtn.innerHTML = `${icon('camera', 18, COLORS.accent, 2.1)} Chụp hình đồng hồ`;
        }
      });
    }

    if (clearWatchPhotoBtn && watchImageField && watchPreviewWrap && watchPreview) {
      clearWatchPhotoBtn.addEventListener('click', () => {
        watchImageField.value = '';
        watchPreview.src = '';
        watchPreviewWrap.hidden = true;
      });
    }

    createBtn.addEventListener('click', async () => {
      const val = id => (document.getElementById(id)?.value || '').trim();
      const required = ['f-customer','f-phone','f-brand','f-issue'];
      let ok = true;
      required.forEach(fid => {
        const el = document.getElementById(fid);
        const empty = !el?.value.trim();
        if (el) el.classList.toggle('field-error', empty);
        if (empty) ok = false;
      });
      if (!ok) return;
      const nextId   = createBtn.dataset.nextId;
      const receivedAt = new Date();
      const promisedAt = new Date(receivedAt);
      promisedAt.setDate(promisedAt.getDate() + 3);
      promisedAt.setHours(17, 0, 0, 0);

      const payload = {
        ticketCode: nextId, customer: val('f-customer'), phone: val('f-phone'),
        brand: val('f-brand'), model: val('f-model'), issue: val('f-issue'),
        watchImage: val('f-watch-image'),
        note: val('f-note'), price: 0,
        status: 'received', received: receivedAt.toISOString(),
        promised: promisedAt.toISOString(),
        finished: null,
      };

      createBtn.disabled = true;
      try {
        await convexRequest('/tickets', 'POST', payload);
        await refreshTickets();
        nav('ticket', { id: nextId });
      } catch (err) {
        alert('Không tạo được phiếu. Vui lòng thử lại.');
      } finally {
        createBtn.disabled = false;
      }
    });
  }

  const editBtn = app.querySelector('#edit-submit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', async () => {
      const ticketCode = editBtn.dataset.ticketId;
      if (!ticketCode) return;

      const val = id => (document.getElementById(id)?.value || '').trim();
      const required = ['e-customer', 'e-phone', 'e-brand', 'e-issue'];
      let ok = true;
      required.forEach(fid => {
        const el = document.getElementById(fid);
        const empty = !el?.value.trim();
        if (el) el.classList.toggle('field-error', empty);
        if (empty) ok = false;
      });
      if (!ok) return;

      const patch = {
        customer: val('e-customer'),
        phone: val('e-phone'),
        brand: val('e-brand'),
        model: val('e-model'),
        issue: val('e-issue'),
        note: val('e-note'),
      };

      patchTicketLocal(ticketCode, patch);
      nav('ticket', { id: ticketCode });

      try {
        await convexRequest('/tickets/update', 'POST', { ticketCode, ...patch });
        await refreshTickets();
        nav('ticket', { id: ticketCode });
      } catch (err) {
        await refreshTickets();
        nav('ticket', { id: ticketCode });
        alert('Không lưu được chỉnh sửa phiếu.');
      }
    });
  }

  const shopInput = app.querySelector('#s-shopname');
  if (shopInput) {
    shopInput.addEventListener('change', () => { state.shopName = shopInput.value || state.shopName; saveState(); });
  }
  const ownerInput = app.querySelector('#s-owner');
  if (ownerInput) {
    ownerInput.addEventListener('change', () => { state.ownerName = ownerInput.value || state.ownerName; saveState(); });
  }

  const anPrev = app.querySelector('#an-prev');
  if (anPrev) {
    anPrev.addEventListener('click', () => { state.analyticsMonth++; render(); });
  }
  const anNext = app.querySelector('#an-next');
  if (anNext) {
    anNext.addEventListener('click', () => { state.analyticsMonth = Math.max(0, state.analyticsMonth - 1); render(); });
  }

  const resetBtn = app.querySelector('#reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Đặt lại tên cửa hàng trên máy này?')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }
}

async function initApp() {
  loadState();
  try {
    await refreshTickets();
  } catch (err) {
    state.tickets = SEED_TICKETS.slice();
    alert('Không kết nối được Convex, đang hiển thị dữ liệu mẫu cục bộ.');
  }
  render();
}

initApp();
