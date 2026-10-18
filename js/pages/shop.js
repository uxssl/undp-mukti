/* ================= Pages: view registry, home, listing, product ================= */
const V = {};
V.home = () => {
  const k = prod(1),
    rs = SELLERS.rahima;
  return `<div class="wrap page">
  <section class="hero">${STITCH()}
    <div class="hero-in"><span class="pill">${ic('globe', 16)} ${t('hero_pill')}</span>
      <h1>${t('hero_h')}</h1><p>${t('hero_p')}</p>
      <div class="hero-cta"><a class="btn btn-white" href="#/products">${t('hero_cta')} ${ic('arrow', 18)}</a><a class="btn btn-glass" href="#/seller">${t('be_seller')}</a></div>
      <div class="hero-trust"><span>${ic('check', 18)} ${t('hero_t1')}</span><span>${ic('check', 18)} ${t('hero_t2')}</span><span>${ic('check', 18)} ${t('hero_t3')}</span></div></div>
    <div class="collage" aria-hidden="true">
      <figure class="c1"><img src="${k.img}" alt=""></figure><figure><img src="assets/p-oil.jpg" alt=""></figure><figure><img src="assets/p-basket.jpg" alt=""></figure>
      <div class="float f1">${sAvatar('rahima')}<div><div class="t-cap muted">${t('featured_maker')}</div><b class="t-label">${tr(rs.name)}</b>${stars(rs.rating, rs.reviews, ' · ' + tr(rs.loc))}</div></div>
      <div class="float f2"><div><div class="t-cap muted">${esc(tr(k.name))}</div><b class="price fs-18">${money(k.price)}</b></div></div>
    </div></section>
  <section class="vp">${[
    ['hand', 'vp1'],
    ['shield', 'vp2'],
    ['truck', 'vp3'],
    ['heart', 'vp4'],
  ]
    .map(
      ([i, x]) =>
        `<div><span class="vi">${ic(i, 22)}</span><span><b>${t(x + '_t')}</b><span class="d">${t(x + '_d')}</span></span></div>`,
    )
    .join('')}</section>
  <section class="sec">${secHead(t('cat_eyebrow'), t('categories'), '#/products')}
    <div class="cats">${CATS.map((c) => `<a class="cat" href="#/products?cat=${c.id}"><span class="ci"><img src="${c.img}" alt=""></span><b>${tr(c.name)}</b><span>${t('n_products', { n: num(PRODUCTS.filter((p) => p.cat === c.id).length) })}</span></a>`).join('')}</div></section>
  <section class="sec">${secHead(t('pop_eyebrow'), t('popular'), '#/products')}<div class="grid">${PRODUCTS.slice(0, 4).map(card).join('')}</div></section>
  <section class="sec makers"><div class="mimg">${STITCH('rgba(4,104,177,.18)')}<img src="assets/seller.png" alt=""></div>
    <div class="mtxt"><span class="eyebrow">${t('makers_eyebrow')}</span><h2>${t('makers_h')}</h2><p class="lead">${t('makers_p')}</p>
      <div class="mlist">${Object.keys(SELLERS)
        .map((x) => {
          const s = SELLERS[x];
          return `<a class="maker" href="#/products?q=${encodeURIComponent(tr(s.name))}">${sAvatar(x)}<div><b>${tr(s.name)}</b><span>${tr(s.loc)} · ★ ${num(s.rating)} · ${t('n_products', { n: num(PRODUCTS.filter((p) => p.seller === x).length) })}</span></div></a>`;
        })
        .join('')}</div></div></section>
  <section class="sec">${secHead(t('more_eyebrow'), t('more'), '#/products')}<div class="grid">${PRODUCTS.slice(4).map(card).join('')}</div></section>
  <section class="sec">${secHead(t('how_eyebrow'), t('how_h'))}
    <div class="how">${[
      ['cart', 'how1'],
      ['user', 'how2'],
      ['wallet', 'how3'],
    ]
      .map(
        ([i, x], n) =>
          `<div class="how-s"><span class="k">${num('0' + (n + 1))}</span><span class="n">${ic(i, 22)}</span><b>${t(x + '_t')}</b><p>${t(x + '_d')}</p></div>`,
      )
      .join('')}</div></section>
  <section class="sec sellband">${STITCH('rgba(159,201,235,.12)')}<div class="rel"><span class="eyebrow text-p200">${t('f_seller')}</span><h2 class="mt-6">${t('promo_h')}</h2><p>${t('promo_p')}</p><a class="btn btn-white" href="#/seller">${t('be_seller')} ${ic('arrow', 18)}</a></div>
    <ul>${['pb1', 'pb2', 'pb3'].map((x) => `<li>${ic('check', 20)} ${t(x)}</li>`).join('')}</ul></section>
  </div>`;
};

V.products = (r) => {
  const cat = r.q.cat || '',
    raw = (r.q.q || '').trim(),
    q = raw.toLowerCase();
  let list = PRODUCTS.filter((p) => !cat || p.cat === cat);
  if (q)
    list = list.filter((p) =>
      [p.name.bn, p.name.en, SELLERS[p.seller].name.bn, SELLERS[p.seller].name.en]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  const c = CATS.find((x) => x.id === cat),
    qs = raw ? '&q=' + encodeURIComponent(raw) : '';
  return `<div class="wrap page">
    <div class="crumb"><a href="#/">${t('home')}</a>${ic('right', 14)}<span>${c ? tr(c.name) : t('all_products')}</span></div>
    <div class="listhead">${STITCH('rgba(4,104,177,.12)')}<div class="rel"><h1>${raw ? t('results_for', { q: esc(raw) }) : c ? tr(c.name) : t('all_products')}</h1><p class="muted">${t('n_products', { n: num(list.length) })} · ${t('list_sub')}</p></div>${c ? `<img src="${c.img}" alt="">` : ''}</div>
    <nav class="chips" aria-label="${t('categories')}"><a class="fchip ${!cat ? 'on' : ''}" href="#/products${raw ? '?q=' + encodeURIComponent(raw) : ''}" ${!cat ? 'aria-current="page"' : ''}>${t('all')}</a>
      ${CATS.map((x) => `<a class="fchip ${cat === x.id ? 'on' : ''}" href="#/products?cat=${x.id}${qs}" ${cat === x.id ? 'aria-current="page"' : ''}><img src="${x.img}" alt="">${tr(x.name)}</a>`).join('')}</nav>
    ${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : `<div class="card empty"><div class="ic">${ic('search', 34)}</div><h2 class="t-h2">${t('none_found')}</h2><p>${t('none_found_p')}</p><a class="btn btn-outline" href="#/products">${t('see_all_products')}</a></div>`}
  </div>`;
};

let pdQty = 1,
  pdTab = 'desc';
V.product = (r) => {
  const p = prod(r.p[1]);
  if (!p) return V.notfound();
  const s = SELLERS[p.seller],
    c = CATS.find((x) => x.id === p.cat);
  const more = PRODUCTS.filter((x) => x.seller === p.seller && x.id !== p.id);
  return `<div class="wrap page">
  <div class="crumb"><a href="#/">${t('home')}</a>${ic('right', 14)}<a href="#/products?cat=${c.id}">${tr(c.name)}</a>${ic('right', 14)}<span>${esc(tr(p.name))}</span></div>
  <div class="pd">
    <div class="pd-img"><img src="${p.img}" alt="${esc(tr(p.name))}">${p.hand && p.stock ? `<span class="tag">${ic('hand', 14)} ${t('handmade')}</span>` : ''}</div>
    <div class="pd-info">
      <span class="eyebrow">${tr(c.name)}</span>
      <h1>${esc(tr(p.name))}</h1>
      <div class="rating">${ic('star', 16)} ${num(p.rating)} <span>· ${t('reviews_n', { n: num(p.reviews) })}</span></div>
      <div class="buybox">
        <div class="pd-price"><span class="price">${money(p.price)}</span>${p.stock ? `<span class="badge b-success">${t('in_stock', { n: num(p.stock) })}</span>` : `<span class="badge b-error">${t('oos')}</span>`}</div>
        ${
          p.stock
            ? `<div class="buy"><div class="stepper" role="group" aria-label="${t('qty')}"><button data-act="pdq" data-d="-1" aria-label="${t('dec')}" ${pdQty <= 1 ? 'disabled' : ''}>${ic('minus', 18)}</button><output aria-live="polite">${num(pdQty)}</output><button data-act="pdq" data-d="1" aria-label="${t('inc')}" ${pdQty >= p.stock ? 'disabled' : ''}>${ic('plus', 18)}</button></div>
          <button class="btn btn-primary" data-act="add" data-id="${p.id}" data-qty="1">${ic('cart')} ${t('add_cart')}</button>
          <button class="btn btn-outline" data-act="buynow" data-id="${p.id}">${t('buy_now')}</button></div>`
            : `<div class="note note-warn mt-20">${ic('alert', 16)} ${t('oos_note')}</div>`
        }
        <div class="facts"><div class="fact"><span class="fi">${ic('truck', 18)}</span><span><b>${t('f_delivery', { x: money(DELIVERY) })}</b>${t('f_delivery_d')}</span></div><div class="fact"><span class="fi">${ic('shield', 18)}</span><span><b>${t('vp2_t')}</b>${t('f_secure_d')}</span></div><div class="fact"><span class="fi">${ic('hand', 18)}</span><span><b>${t('handmade')}</b>${t('f_hand_d')}</span></div></div>
      </div>
      <a class="seller-card" href="#/products?q=${encodeURIComponent(tr(s.name))}">${sAvatar(p.seller)}<span class="grow"><span class="t-cap muted">${t('seller_from', { x: tr(s.loc) })}</span><b class="t-label d-block fs-16">${tr(s.name)}</b>${stars(s.rating, s.reviews, ' · ' + t('shop_rating'))}</span>${ic('right')}</a>
      <div class="ptabs"><div role="tablist" aria-label="${t('description')}"><button role="tab" id="tb-desc" aria-controls="tp" aria-selected="${pdTab === 'desc'}" tabindex="${pdTab === 'desc' ? 0 : -1}" data-act="tab" data-tab="desc">${t('description')}</button><button role="tab" id="tb-del" aria-controls="tp" aria-selected="${pdTab === 'del'}" tabindex="${pdTab === 'del' ? 0 : -1}" data-act="tab" data-tab="del">${t('delivery_info_t')}</button></div>
        <div role="tabpanel" id="tp" aria-labelledby="${pdTab === 'desc' ? 'tb-desc' : 'tb-del'}">${pdTab === 'desc' ? tr(p.desc) : t('delivery_info_p', { x: money(DELIVERY) })}</div></div>
    </div>
  </div>
  ${more.length ? `<section class="sec">${secHead(t('from_shop'), t('more_from', { x: tr(s.name) }))}<div class="grid">${more.map(card).join('')}</div></section>` : ''}
  </div>`;
};

V.notfound = () =>
  `<div class="wrap page"><div class="card empty"><div class="ic">${ic('search', 34)}</div><h2 class="t-h2">${t('notfound_h')}</h2><p>${t('notfound_p')}</p><a class="btn btn-primary" href="#/">${t('go_home')}</a></div></div>`;
