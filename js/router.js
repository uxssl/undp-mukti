/* ================= Router ================= */
function route() {
  const h = location.hash.slice(1) || '/';
  const [path, qs] = h.split('?');
  return {
    path,
    p: path.split('/').filter(Boolean),
    q: Object.fromEntries(new URLSearchParams(qs || '')),
  };
}
const ROUTES = [
  [/^\/?$/, V.home, 'W01'],
  [/^\/products$/, V.products, 'W01-B'],
  [/^\/product\/\d+$/, V.product, 'W02'],
  [/^\/cart$/, V.cart, 'W03'],
  [/^\/checkout\/\w+$/, V.checkout, 'W04'],
  [/^\/pay\/processing$/, V.processing, 'W05'],
  [/^\/pay\/success\/[\w-]+$/, V.success, 'W06'],
  [/^\/pay\/failed\/[\w-]+$/, V.failed, 'W07'],
  [/^\/orders$/, V.orders, 'W08'],
  [/^\/order\/[\w-]+$/, V.order, 'W09'],
  [/^\/account$/, V.account, 'W10'],
  [/^\/seller$/, V.sellerIntro, 'W11'],
  [/^\/seller\/business$/, V.sellerBiz, 'W12'],
  [/^\/seller\/address$/, V.sellerAddr, 'W13'],
  [/^\/seller\/status$/, V.sellerStatus, 'W14'],
];
let lastPath;
function render(keepScroll) {
  const r = route();
  if (r.path !== '/pay/processing') clearTimeout(payTimer);
  const hit = ROUTES.find(([re]) => re.test(r.path));
  if (r.path.startsWith('/product/') && lastPath !== r.path) {
    pdQty = 1;
    pdTab = 'desc';
  }
  const html = hit ? hit[1](r) : V.notfound();
  if (location.hash && location.hash.slice(1).split('?')[0] !== r.path) return; // view redirected
  document.documentElement.lang = S.lang;
  document.title =
    S.lang === 'en' ? 'Mukti — Products by women entrepreneurs' : 'মুক্তি — নারী উদ্যোক্তাদের পণ্য';
  const m = $('#main');
  m.innerHTML = html;
  m.className = r.path.startsWith('/pay/success')
    ? 'tint-ok'
    : r.path.startsWith('/pay/failed')
      ? 'tint-bad'
      : r.path === '/pay/processing' || r.path === '/seller/status'
        ? 'tint-info'
        : '';
  if (keepScroll) m.querySelector('.page')?.classList.add('no-anim');
  renderHeader();
  renderFooter();
  renderPanel(hit?.[2]);
  if (lastPath !== r.path && !keepScroll) window.scrollTo(0, 0);
  lastPath = r.path;
}
window.addEventListener('hashchange', () => render());
function setLang(l) {
  if (l === S.lang) return;
  S.lang = l;
  save();
  // keep typed-but-unsaved form values across the re-render
  const vals = {};
  document.querySelectorAll('#main form [name]').forEach((el) => {
    if (el.type !== 'radio') vals[el.name] = el.value;
  });
  render(true);
  document.querySelectorAll('#main form [name]').forEach((el) => {
    if (el.name in vals && el.type !== 'radio') el.value = vals[el.name];
  });
  if (M) renderModal();
}
