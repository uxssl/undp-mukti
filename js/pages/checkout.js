/* ================= Pages: cart, checkout, payment ================= */
function cartGroups() {
  const g = {};
  S.cart.forEach((c) => {
    const p = prod(c.id);
    (g[p.seller] = g[p.seller] || []).push({ ...c, p });
  });
  return g;
}
V.cart = () => {
  if (!S.user)
    return `<div class="wrap page">${pageHead(t('my_cart'), '#/')}${needLogin(t('cart_login'))}</div>`;
  const g = cartGroups(),
    keys = Object.keys(g);
  if (!keys.length)
    return `<div class="wrap page">${pageHead(t('my_cart'), '#/')}<div class="card empty"><div class="ic">${ic('cart', 34)}</div><h2 class="t-h2">${t('cart_empty')}</h2><p>${t('cart_empty_p')}</p><a class="btn btn-primary" href="#/products">${t('hero_cta')}</a></div></div>`;
  return `<div class="wrap page">${steps(0)}${pageHead(`${t('my_cart')} (${num(cartCount())})`, '#/')}
  <div class="two"><div>${keys
    .map((k) => {
      const s = SELLERS[k],
        items = g[k],
        sub = items.reduce((a, i) => a + i.p.price * i.qty, 0),
        cnt = items.reduce((a, i) => a + i.qty, 0);
      return `<section class="card group"><div class="group-h">${sAvatar(k)}<div><b class="t-label">${tr(s.name)}</b>${stars(s.rating, s.reviews, ' · ' + t('shop_rating'))}</div></div>
    ${items
      .map(
        (i) => `<div class="citem"><a href="#/product/${i.id}"><img src="${i.p.img}" alt=""></a>
      <div><a class="t-label fs-16" href="#/product/${i.id}">${esc(tr(i.p.name))}</a><div class="t-cap muted">${t('per_pc', { x: money(i.p.price) })}</div></div>
      <div><div class="ln">${money(i.p.price * i.qty)}</div><div class="d-flex gap-8 items-center"><div class="stepper sm" role="group" aria-label="${t('qty')}"><button data-act="cq" data-id="${i.id}" data-d="-1" aria-label="${t('dec')}" ${i.qty <= 1 ? 'disabled' : ''}>${ic('minus', 16)}</button><output>${num(i.qty)}</output><button data-act="cq" data-id="${i.id}" data-d="1" aria-label="${t('inc')}" ${i.qty >= i.p.stock ? 'disabled' : ''}>${ic('plus', 16)}</button></div><button class="iconbtn" data-act="rm" data-id="${i.id}" aria-label="${t('remove')}">${ic('trash', 18)}</button></div></div></div>`,
      )
      .join('')}
    <div class="group-f"><div><div class="t-cap muted">${t('subtotal_n', { n: num(cnt) })}</div><div class="price fs-24">${money(sub)}</div></div><a class="btn btn-primary" href="#/checkout/${k}">${t('checkout_btn')} ${ic('arrow', 18)}</a></div></section>`;
    })
    .join('')}</div>
  <aside class="sticky aside-stack"><div class="note note-info p-18">${ic('info', 18)}<span><b>${t('one_seller_t')}</b><br>${t('one_seller_d')}</span></div>
    <div class="note note-ok p-18">${ic('shield', 18)}<span>${t('cart_secure')}</span></div></aside></div></div>`;
};

V.checkout = (r) => {
  if (!S.user)
    return `<div class="wrap page">${pageHead(t('checkout'), '#/cart')}${needLogin(t('checkout_login'))}</div>`;
  const k = r.p[1],
    items = cartGroups()[k] || [];
  if (!items.length) {
    location.hash = '#/cart';
    return '';
  }
  const s = SELLERS[k],
    sub = items.reduce((a, i) => a + i.p.price * i.qty, 0),
    a = S.addr || { name: S.user.name, phone: S.user.phone, address: '' };
  return `<div class="wrap page">${steps(1)}${pageHead(t('checkout'), '#/cart')}
  <form class="two" data-form="checkout" data-seller="${k}" novalidate><div>
    <section class="card pad"><div class="step-h"><span class="step-n">${num(1)}</span><h2 class="t-h3">${t('delivery_info')}</h2></div>
      <div class="row2"><div class="field"><label for="cn">${t('recipient')}</label><input class="input" id="cn" name="name" value="${esc(a.name)}" autocomplete="name" required><span class="errtxt">${t('recipient_err')}</span></div>
      <div class="field"><label for="cp">${t('mobile')}</label><input class="input" id="cp" name="phone" inputmode="numeric" value="${esc(fmtPhone(a.phone))}" autocomplete="tel" required><span class="help">${t('mobile_help')}</span><span class="errtxt">${t('mobile_err')}</span></div></div>
      <div class="field m-0"><label for="ca">${t('address')}</label><textarea class="input" id="ca" name="address" rows="2" placeholder="${t('address_ph')}" autocomplete="street-address" required>${esc(a.address)}</textarea><span class="errtxt">${t('address_err')}</span></div>
    </section>
    <section class="card pad mt-24"><div class="step-h"><span class="step-n">${num(3)}</span><h2 class="t-h3">${t('pay_method')}</h2></div>
      <label class="pm"><input type="radio" name="pm" value="easywallet" checked class="sr"><span class="pmi">${ic('wallet')}</span><span><b class="t-label fs-16">Easy Wallet</b><br><span class="t-cap muted">${t('ew_d')}</span></span><span class="radio"></span></label>
      <div class="note note-ok mt-16">${ic('shield', 16)}<span>${t('recheck')}</span></div>
    </section></div>
    <aside class="card pad sticky"><div class="step-h"><span class="step-n">${num(2)}</span><h2 class="t-h3">${t('summary')}</h2></div>
      <div class="t-label d-flex gap-10 items-center text-n700 mb-6">${sAvatar(k, true)} ${tr(s.name)}</div>
      ${items.map((i) => `<div class="mini"><img src="${i.p.img}" alt=""><div class="flex-1"><div class="t-label">${esc(tr(i.p.name))}</div><div class="t-cap muted">${money(i.p.price)} × ${num(i.qty)}</div></div><b>${money(i.p.price * i.qty)}</b></div>`).join('')}
      <div class="divider"></div>
      <div class="sumrow"><span>${t('subtotal')}</span><span>${money(sub)}</span></div>
      <div class="sumrow"><span>${t('delivery')}</span><span>${money(DELIVERY)}</span></div>
      <div class="divider"></div>
      <div class="sumrow total"><span>${t('total_payable')}</span><span>${money(sub + DELIVERY)}</span></div>
      <button class="btn btn-primary btn-block mt-20" type="submit">${ic('shield', 18)} ${t('pay_x', { x: money(sub + DELIVERY) })}</button>
      <p class="t-cap muted text-center mt-10">${t('terms_note', { l: `<a class="link" href="#/">${t('terms')}</a>` })}</p>
    </aside></form></div>`;
};

let payTimer;
V.processing = () => {
  const o = S.orders.find((x) => x.id === S.pending);
  if (!o) {
    location.hash = '#/orders';
    return '';
  }
  clearTimeout(payTimer);
  payTimer = setTimeout(() => finishPayment(o.id), 2800);
  return `<div class="wrap page">${steps(2)}<div class="status">
    <div class="spinner" role="progressbar" aria-label="${t('verifying_h')}"></div>
    <h1>${t('verifying_h')}</h1><p class="sub">${t('verifying_p')}</p>
    <div class="card pad kv"><div class="sumrow"><span>${t('order_no')}</span><span>${o.id}</span></div><div class="sumrow"><span>${t('amount')}</span><span class="price">${money(orderTotal(o))}</span></div><div class="sumrow"><span>${t('status')}</span><span class="badge b-warn">${t('pending')}</span></div></div>
    <div class="note note-warn mt-16 text-left">${ic('alert', 18)}<span>${t('dont_close')}</span></div>
  </div></div>`;
};
function finishPayment(id) {
  const o = S.orders.find((x) => x.id === id);
  if (!o || S.pending !== id) return;
  S.pending = null;
  if (S.failNext) {
    o.status = 'failed';
    S.failNext = false;
    save();
    location.hash = '#/pay/failed/' + id;
    return;
  }
  o.status = 'paid';
  o.ship = 0;
  o.ref = 'EW-' + rand(8);
  o.paidAt = new Date().toISOString();
  save();
  location.hash = '#/pay/success/' + id;
}
V.success = (r) => {
  const o = S.orders.find((x) => x.id === r.p[2]);
  if (!o) return V.notfound();
  return `<div class="wrap page">${steps(4)}<div class="status">
    <div class="halo ok"><span>${ic('check', 36)}</span></div>
    <h1>${t('success_h')}</h1><p class="sub">${t('success_p')}</p>
    <div class="card pad kv"><div class="sumrow"><span>${t('order_no')}</span><span>${o.id}</span></div><div class="sumrow"><span>${t('paid_amount')}</span><span class="price">${money(orderTotal(o))}</span></div><div class="sumrow"><span>${t('pay_ref')}</span><span>${o.ref}</span></div><div class="sumrow"><span>${t('address')}</span><span>${esc(o.address)}</span></div><div class="divider"></div><div class="sumrow"><span>${t('payment')}</span><span class="badge b-success">${t('paid')}</span></div><div class="sumrow"><span>${t('order')}</span><span class="badge b-info">${t('confirmed')}</span></div></div>
    <div class="actions"><a class="btn btn-primary" href="#/order/${o.id}">${t('view_order')}</a><a class="btn btn-outline" href="#/">${t('keep_shopping')}</a></div>
  </div></div>`;
};
V.failed = (r) => {
  const o = S.orders.find((x) => x.id === r.p[2]);
  if (!o) return V.notfound();
  return `<div class="wrap page">${steps(2, true)}<div class="status">
    <div class="halo bad"><span>${ic('alert', 36)}</span></div>
    <h1>${t('failed_h')}</h1><p class="sub">${t('failed_p')}</p>
    <div class="card pad kv"><div class="sumrow"><span>${t('order_no')}</span><span>${o.id}</span></div><div class="sumrow"><span>${t('amount')}</span><span class="price">${money(orderTotal(o))}</span></div><div class="divider"></div><div class="sumrow"><span>${t('payment')}</span><span class="badge b-error">${t('failed')}</span></div></div>
    <div class="note note-neutral mt-16 text-left">${ic('wallet', 18)}<span>${t('failed_note')}</span></div>
    <div class="actions"><button class="btn btn-primary" data-act="retry" data-id="${o.id}">${t('try_again')}</button><a class="btn btn-ghost" href="#/orders">${t('go_orders')}</a></div>
  </div></div>`;
};
