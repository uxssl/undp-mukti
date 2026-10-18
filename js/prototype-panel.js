/* ================= Prototype flow panel ================= */
const DEMO_USER = { name: 'রাশিদা বেগম', phone: '01712345678' };
const SCREENS = [
  [
    'flow4',
    [
      ['W01', ['হোম', 'Home'], '#/'],
      ['W01-B', ['সব পণ্য / ক্যাটাগরি', 'All products / category'], '#/products'],
      ['W02', ['পণ্যের বিস্তারিত', 'Product detail'], '#/product/1'],
      ['W02-A', ['লগইন → কোড যাচাই → নাম', 'Login → OTP → name'], 'login'],
      ['W03', ['কার্ট', 'Cart'], '#/cart', 'cart'],
      ['W04', ['চেকআউট', 'Checkout'], '#/checkout/rahima', 'cart'],
      ['W05', ['পেমেন্ট যাচাই', 'Payment verifying'], 'pay'],
      ['W06', ['পেমেন্ট সফল', 'Payment success'], 'success'],
      ['W07', ['পেমেন্ট ব্যর্থ', 'Payment failed'], 'failed'],
      ['W08', ['আমার অর্ডার', 'My orders'], '#/orders', 'user'],
      ['W09', ['অর্ডারের বিস্তারিত', 'Order detail'], 'detail'],
    ],
  ],
  [
    'flow5',
    [
      ['W10', ['প্রোফাইল (এন্ট্রি পয়েন্ট)', 'Profile (entry point)'], '#/account', 'user'],
      ['W11', ['বিক্রেতা পরিচিতি', 'Seller intro'], '#/seller', 'noseller'],
      [
        'W12',
        ['ব্যবসার তথ্য · ধাপ ১', 'Business details · step 1'],
        '#/seller/business',
        'noseller',
      ],
      ['W13', ['ঠিকানা ও জমা · ধাপ ২', 'Address & submit · step 2'], '#/seller/address', 'draft'],
      ['W14', ['যাচাই চলছে', 'Under review'], 'pending'],
      ['W14-B', ['অনুমোদিত', 'Approved'], 'approved'],
    ],
  ],
];
function ensureUser() {
  if (!S.user) {
    S.user = { ...DEMO_USER };
    S.users[DEMO_USER.phone] = DEMO_USER.name;
  }
}
function ensureCart() {
  ensureUser();
  if (!S.cart.some((c) => prod(c.id).seller === 'rahima')) {
    S.cart.push({ id: 1, qty: 1 }, { id: 4, qty: 2 });
  }
}
function demoOrder(status) {
  ensureUser();
  const now = new Date().toISOString();
  const o = {
    id: `MK-${stamp()}-${String(S.seq++).padStart(4, '0')}`,
    date: now,
    seller: 'rahima',
    items: [
      { id: 1, qty: 1, price: 1250 },
      { id: 4, qty: 2, price: 450 },
    ],
    delivery: DELIVERY,
    status,
    ship: status === 'paid' ? 2 : 0,
    ref: status === 'paid' ? 'EW-' + rand(8) : '',
    paidAt: now,
    name: DEMO_USER.name,
    phone: DEMO_USER.phone,
    address: 'চাঁদপুর, ঝিকরগাছা, যশোর',
  };
  S.orders.push(o);
  return o;
}
const demoBiz = () => (S.lang === 'en' ? 'Rahima Handicrafts' : 'রহিমা হস্তশিল্প');
function sellerDemo(status) {
  ensureUser();
  S.seller = {
    business: demoBiz(),
    contact: DEMO_USER.name,
    phone: DEMO_USER.phone,
    district: 0,
    upazila: 'ঝিকরগাছা',
    address: 'চাঁদপুর বাজার, দোকান নং ১২',
    status,
    date: new Date().toISOString(),
    appId: 'SA-261017-0009',
  };
}
function jump(code) {
  const [, , target, need] = SCREENS.flatMap((g) => g[1]).find((x) => x[0] === code);
  closeModal();
  if (need === 'cart') ensureCart();
  if (need === 'user') ensureUser();
  if (need === 'noseller') {
    ensureUser();
    S.seller = null;
  }
  if (need === 'draft') {
    ensureUser();
    S.seller = null;
    S.draft = { business: demoBiz(), contact: DEMO_USER.name, phone: DEMO_USER.phone };
  }
  let hash = target;
  if (target === 'login') {
    S.user = null;
    S.cart = [];
    save();
    location.hash = '#/product/1';
    setTimeout(() => openLogin('cart', () => addToCart(1, 1)), 60);
    return;
  }
  if (target === 'pay') {
    const o = demoOrder('verifying');
    S.pending = o.id;
    hash = '#/pay/processing';
  }
  if (target === 'success') hash = '#/pay/success/' + demoOrder('paid').id;
  if (target === 'failed') hash = '#/pay/failed/' + demoOrder('failed').id;
  if (target === 'detail') hash = '#/order/' + demoOrder('paid').id;
  if (target === 'pending') {
    sellerDemo('pending');
    hash = '#/seller/status';
  }
  if (target === 'approved') {
    sellerDemo('approved');
    hash = '#/seller/status';
  }
  save();
  if (location.hash === hash) render();
  else location.hash = hash;
}
$('#fpBtn').onclick = () => {
  const o = $('#fp').classList.toggle('open');
  $('#fpBtn').setAttribute('aria-expanded', o);
};
function renderPanel(cur) {
  $('#fpBtn').innerHTML = ic('flow', 18) + ' ' + t('proto_flow');
  $('#fp').setAttribute('aria-label', t('proto_flow'));
  $('#fp').innerHTML =
    SCREENS.map(
      ([g, list]) =>
        `<h5>${t(g)}</h5>${list.map(([c, n]) => `<a href="#" data-jump="${c}" class="${c === cur ? 'on' : ''}"><code>${c}</code>${n[S.lang === 'en' ? 1 : 0]}</a>`).join('')}`,
    ).join('') +
    `<h5>${t('sim')}</h5><label><input type="checkbox" id="failNext" ${S.failNext ? 'checked' : ''}> ${t('fail_next')}</label>
   <div class="fp-ctl">${S.user && S.seller?.status === 'pending' ? `<button data-sim="approve">${t('approve_sim')}</button>` : ''}${S.user ? '' : `<button data-sim="login">${t('demo_login')}</button>`}<button data-sim="reset">${t('reset')}</button></div>`;
}
$('#fp').addEventListener('click', (e) => {
  const j = e.target.closest('[data-jump]');
  if (j) {
    e.preventDefault();
    jump(j.dataset.jump);
    return;
  }
  const s = e.target.closest('[data-sim]');
  if (!s) return;
  if (s.dataset.sim === 'approve') {
    S.seller.status = 'approved';
    save();
    render(true);
    toast(t('approved_toast'));
  }
  if (s.dataset.sim === 'login') {
    ensureUser();
    save();
    render(true);
  }
  if (s.dataset.sim === 'reset') {
    const l = S.lang;
    S = fresh();
    S.lang = l;
    save();
    closeModal();
    location.hash = '#/';
    render();
  }
});
$('#fp').addEventListener('change', (e) => {
  if (e.target.id === 'failNext') {
    S.failNext = e.target.checked;
    save();
  }
});
