/* ================= Toast ================= */
let toastT;
function toast(msg, link) {
  clearTimeout(toastT);
  $('#toast-root').innerHTML =
    `<div class="toast" role="status"><span class="ok">${ic('check', 18)}</span><span>${msg}</span>${link ? `<a href="${link[1]}">${link[0]}</a>` : ''}</div>`;
  toastT = setTimeout(() => ($('#toast-root').innerHTML = ''), 3800);
}

/* ================= Shell: header, footer ================= */
const langToggle = () =>
  `<div class="lang" role="group" aria-label="${t('lang_label')} / Language"><button data-lang="bn" aria-pressed="${S.lang === 'bn'}" lang="bn">বাংলা</button><button data-lang="en" aria-pressed="${S.lang === 'en'}" lang="en">English</button></div>`;
const logo = () =>
  `<a href="#/" class="logo" aria-label="${t('brand')} — ${t('home')}"><img class="mark" src="assets/logo-mark.svg" alt="" width="40" height="40"><span><b>${t('brand')}</b><small>${t('tagline')}</small></span></a>`;
function renderHeader() {
  const u = S.user,
    n = u ? cartCount() : 0,
    sl = u ? S.seller : null,
    r = route();
  const sellerHref = sl ? (sl.status === 'approved' ? '#/account' : '#/seller/status') : '#/seller';
  const curCat =
    r.path === '/products'
      ? r.q.cat || 'all'
      : r.path.startsWith('/product/')
        ? prod(r.p[1])?.cat
        : '';
  $('#hdr').innerHTML =
    `<div class="util"><div class="wrap util-in"><span>${ic('truck', 16)} ${t('util_delivery')}</span>
    <div class="util-r"><a href="${sellerHref}">${t('util_seller')}</a><a href="#/account">${t('util_help')}</a>${langToggle()}</div></div></div>
  <header class="hdr"><div class="wrap hdr-in">${logo()}
    <form class="search" role="search" data-form="search">${ic('search')}<input name="q" type="search" placeholder="${t('search_ph')}" aria-label="${t('search_ph')}" value="${esc(r.q.q || '')}"><button type="submit">${t('search_btn')}</button></form>
    <nav class="hdr-act" aria-label="${t('my_profile')}">
      <a class="seller-link" href="${sellerHref}">${ic('store')}<span>${sl?.status === 'approved' ? t('seller_acct') : t('be_seller')}</span></a>
      <a class="cart-btn" id="cartBtn" href="#/cart" aria-label="${t('cart_aria', { n: num(n) })}">${ic('cart')}${n ? `<span class="cnt">${num(n)}</span>` : ''}</a>
      ${
        u
          ? `<div class="menu-wrap"><button class="chip" data-act="menu" aria-haspopup="true" aria-expanded="false"><span class="avatar">${esc(u.name[0])}</span><span class="nm">${esc(u.name.split(' ')[0])}</span></button>
        <div class="menu" id="umenu"><a href="#/account">${ic('user', 18)} ${t('my_profile')}</a><a href="#/orders">${ic('receipt', 18)} ${t('my_orders')}</a><button data-act="logout">${ic('logout', 18)} ${t('logout')}</button></div></div>`
          : `<button class="btn btn-primary btn-sm btn-login" data-act="login">${t('login')}</button>`
      }
    </nav></div>
    <nav class="catnav" aria-label="${t('categories')}"><div class="wrap catnav-in">
      <a href="#/products" ${curCat === 'all' ? 'aria-current="page"' : ''}>${t('all_products')}</a>
      ${CATS.map((c) => `<a href="#/products?cat=${c.id}" ${curCat === c.id ? 'aria-current="page"' : ''}><img src="${c.img}" alt="">${tr(c.name)}</a>`).join('')}
    </div></nav></header>`;
}
function renderFooter() {
  $('#ftr').innerHTML =
    `<footer class="ftr">${STITCH('rgba(159,201,235,.08)')}<div class="wrap rel">
    <div class="ftr-top">
      <div>${logo()}<p>${t('f_about')}</p>
        <div class="ftr-meta"><div><span class="lbl">${t('f_pay')}</span><span class="paypill">Easy Wallet</span><span class="paypill">SSLCOMMERZ</span></div>
        <div><span class="lbl">${t('lang_label')}</span>${langToggle()}</div></div></div>
      <div><h4>${t('f_shop')}</h4><ul><li><a href="#/products">${t('all_products')}</a></li><li><a href="#/products">${t('categories')}</a></li><li><a href="#/orders">${t('my_orders')}</a></li></ul></div>
      <div><h4>${t('f_seller')}</h4><ul><li><a href="#/seller">${t('be_seller')}</a></li><li><a href="#/seller">${t('f_seller_login')}</a></li><li><a href="#/seller">${t('f_seller_help')}</a></li></ul></div>
      <div><h4>${t('f_help')}</h4><ul><li><a href="#/">${t('f_contact')}</a></li><li><a href="#/">${t('f_returns')}</a></li><li><a href="#/">${t('f_terms')}</a></li><li><a href="#/">${t('f_privacy')}</a></li></ul></div>
    </div>
    <div class="ftr-bot"><span>${t('f_copy')}</span><span>${ic('shield', 16)} ${t('f_secure')}</span></div></div></footer>`;
}

/* ================= Components ================= */
const stars = (r, c, suffix = '') =>
  `<div class="rating">${ic('star', 14)} ${num(r)} <span>(${num(c)})${suffix}</span></div>`;
const sAvatar = (k, small) => {
  const s = SELLERS[k];
  return `<span class="avatar${small ? ' avatar-sm' : ''}" style="background:${s.tone[0]};color:${s.tone[1]}">${esc(tr(s.name)[0])}</span>`;
};
function card(p) {
  const s = SELLERS[p.seller];
  return `<article class="pcard ${p.stock ? '' : 'oos'}">
    <a class="pimg" href="#/product/${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" loading="lazy">${p.stock ? (p.hand ? `<span class="tag">${ic('hand', 14)} ${t('handmade')}</span>` : '') : `<span class="tag oos">${t('oos')}</span>`}</a>
    <div class="pbody">
      <span class="pseller">${ic('store', 14)} ${tr(s.name)} · ${tr(s.loc)}</span>
      <a class="pname" href="#/product/${p.id}">${esc(tr(p.name))}</a>
      ${stars(p.rating, p.reviews)}
      <div class="prow"><span class="price">${money(p.price)}</span>
      ${p.stock ? `<button class="addbtn" data-act="add" data-id="${p.id}" aria-label="${esc(t('add_aria', { x: tr(p.name) }))}">${ic('plus', 20)}</button>` : `<span class="oos-tag">${t('oos')}</span>`}</div>
    </div></article>`;
}
const secHead = (eyebrow, title, link) =>
  `<div class="sec-h"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${link ? `<a class="more" href="${link}">${t('see_all')} ${ic('arrow', 16)}</a>` : ''}</div>`;
const pageHead = (title, back) =>
  `<div class="page-h">${back ? `<a class="back" href="${back}" aria-label="${t('back')}">${ic('left')}</a>` : ''}<h1 class="t-h1">${title}</h1></div>`;
const needLogin = (msg) =>
  `<div class="card empty narrow"><div class="ic">${ic('user', 34)}</div><h2 class="t-h2">${t('login_h')}</h2><p>${msg}</p><button class="btn btn-primary" data-act="login">${t('login_with_mobile')}</button></div>`;
const STEPS = ['st_cart', 'st_details', 'st_pay', 'st_done'];
const steps = (cur, bad) =>
  `<ol class="steps" aria-label="${t('checkout')}">${STEPS.map((k, i) => `<li class="${i < cur ? 'done' : i === cur ? (bad ? 'bad' : 'cur') : ''}" ${i === cur ? 'aria-current="step"' : ''}><span>${i < cur ? ic('check', 14) : bad && i === cur ? '!' : num(i + 1)}</span>${t(k)}</li>`).join('')}</ol>`;
const orderTotal = (o) => o.items.reduce((a, i) => a + i.price * i.qty, 0) + o.delivery;
function orderBadges(o) {
  if (o.status === 'failed') return `<span class="badge b-error">${t('pay_failed')}</span>`;
  if (o.status === 'verifying') return `<span class="badge b-warn">${t('pay_verifying')}</span>`;
  return `<span class="badge b-success">${t('paid')}</span><span class="badge ${o.ship === 4 ? 'b-success' : 'b-info'}">${o.ship === 0 ? t('confirmed') : t('ship' + o.ship)}</span>`;
}
