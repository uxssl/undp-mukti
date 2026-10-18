/* ================= Pages: account & orders ================= */
function acctShell(active, body) {
  const u = S.user;
  return `<div class="wrap page"><div class="acct"><aside class="card side">
    <div class="prof"><span class="avatar">${esc(u.name[0])}</span><div><b class="t-label fs-16">${esc(u.name)}</b><div class="t-cap muted">${fmtPhone(u.phone)}</div></div></div>
    <nav aria-label="${t('my_profile')}">
      <a href="#/account" class="${active === 'account' ? 'on' : ''}">${ic('user')} ${t('profile')}</a>
      <a href="#/orders" class="${active === 'orders' ? 'on' : ''}">${ic('receipt')} ${t('my_orders')}</a>
      <a href="${S.seller ? '#/seller/status' : '#/seller'}">${ic('store')} ${S.seller?.status === 'approved' ? t('seller_acct') : t('be_seller')}</a>
      <a href="#/account">${ic('help')} ${t('help')}</a>
      <button data-act="logout">${ic('logout')} ${t('logout')}</button>
    </nav></aside><div>${body}</div></div></div>`;
}
V.account = () => {
  if (!S.user) return `<div class="wrap page">${needLogin(t('profile_login'))}</div>`;
  const sl = S.seller;
  const sellerBlock = !sl
    ? `<div class="seller-cta"><span class="si">${ic('store', 26)}</span><div class="grow"><h2 class="t-h3">${t('you_seller_h')}</h2><p class="muted">${t('you_seller_p')}</p></div><a class="btn btn-primary" href="#/seller">${t('register_seller')}</a></div>`
    : sl.status === 'pending'
      ? `<div class="seller-cta"><span class="si">${ic('clock', 26)}</span><div class="grow"><h2 class="t-h3">${esc(sl.business)}</h2><span class="badge b-warn">${t('checking')}</span><p class="muted mt-6">${t('checking_p')}</p></div><a class="btn btn-outline" href="#/seller/status">${t('app_status')}</a></div>`
      : `<div class="seller-cta"><span class="si">${ic('store', 26)}</span><div class="grow"><h2 class="t-h3">${esc(sl.business)}</h2><span class="badge b-success">${t('seller_active')}</span><p class="muted mt-6">${t('seller_active_p')}</p></div><button class="btn btn-primary" data-act="merchant">${t('go_merchant')}</button></div>`;
  const a = S.addr;
  return acctShell(
    'account',
    `<h1 class="t-h1 mb-24">${t('profile')}</h1>${sellerBlock}
    <div class="card pad mt-24"><h2 class="t-h3 mb-12">${t('personal')}</h2>
      <div class="sumrow"><span>${t('name')}</span><span>${esc(S.user.name)}</span></div><div class="sumrow"><span>${t('mobile_s')}</span><span>${fmtPhone(S.user.phone)} <span class="badge b-success ml-6">${t('verified')}</span></span></div></div>
    <div class="card pad mt-16"><h2 class="t-h3 mb-12">${t('address')}</h2>
      ${a?.address ? `<div class="d-flex gap-10">${ic('pin')}<div><b class="t-label">${esc(a.name)} · ${fmtPhone(a.phone)}</b><div class="muted">${esc(a.address)}</div></div></div>` : `<p class="muted">${t('no_addr')}</p>`}</div>
    <div class="card pad mt-16 d-flex items-center gap-14"><span class="avatar rounded-12">${ic('wallet', 18)}</span><div class="flex-1"><b class="t-label">Easy Wallet</b><div class="t-cap muted">${t('ew_method', { x: fmtPhone(S.user.phone) })}</div></div><span class="badge b-success">${t('linked')}</span></div>`,
  );
};
V.orders = (r) => {
  if (!S.user)
    return `<div class="wrap page">${pageHead(t('my_orders'))}${needLogin(t('orders_login'))}</div>`;
  const tab = r.q.tab || 'all';
  const list = [...S.orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((o) => tab === 'all' || (tab === 'done' ? o.ship === 4 : o.ship !== 4));
  return acctShell(
    'orders',
    `<h1 class="t-h1 mb-20">${t('my_orders')}</h1>
    <nav class="tabs" aria-label="${t('my_orders')}">${['all', 'active', 'done'].map((k) => `<a class="fchip ${tab === k ? 'on' : ''}" ${tab === k ? 'aria-current="page"' : ''} href="#/orders?tab=${k}">${t('tab_' + k)}</a>`).join('')}</nav>
    ${
      list.length
        ? list
            .map((o) => {
              const f = prod(o.items[0].id),
                more = o.items.length - 1;
              return `<article class="card ocard"><div class="ocard-h"><b>${o.id}</b><span>${fmtDate(o.date)}</span></div>
      <div class="ocard-m"><img src="${f.img}" alt=""><div class="grow"><div class="t-label">${esc(tr(f.name))}${more ? t('plus_more', { n: num(more) }) : ''}</div><div class="t-cap muted">${tr(SELLERS[o.seller].name)}</div></div><b class="t-h3">${money(orderTotal(o))}</b></div>
      <div class="badges">${orderBadges(o)}</div>
      <div class="ocard-f">${o.status === 'failed' ? `<button class="link text-e600" data-act="retry" data-id="${o.id}">${t('repay')}</button>` : `<a class="link" href="#/order/${o.id}">${o.status === 'verifying' ? t('view_status') : t('view_details')}</a>`}<a href="#/order/${o.id}" aria-label="${t('view_details')}" class="text-p600">${ic('right')}</a></div></article>`;
            })
            .join('')
        : `<div class="card empty"><div class="ic">${ic('receipt', 34)}</div><h2 class="t-h2">${t('no_orders')}</h2><p>${t('no_orders_p')}</p><a class="btn btn-primary" href="#/products">${t('hero_cta')}</a></div>`
    }`,
  );
};
V.order = (r) => {
  if (!S.user) return `<div class="wrap page">${needLogin(t('orders_login'))}</div>`;
  const o = S.orders.find((x) => x.id === r.p[1]);
  if (!o) return V.notfound();
  const sub = o.items.reduce((a, i) => a + i.price * i.qty, 0);
  const tl =
    o.status !== 'paid'
      ? ''
      : `<section class="card pad"><h2 class="t-h3 mb-16">${t('delivery_status')}</h2><ol class="tl">${[
          0, 1, 2, 3, 4,
        ]
          .map((i) => {
            const done = i < o.ship || o.ship === 4,
              cls = done ? 'done' : i === o.ship ? 'cur' : 'todo';
            return `<li class="${cls}"><span class="dot">${done ? ic('check', 14) : ''}</span><div><b>${t('ship' + i)}</b>${i === 0 ? `<span class="t-cap muted">${fmtTime(o.paidAt || o.date)}</span>` : i === o.ship ? `<span class="t-cap muted">${t('current')}</span>` : ''}</div></li>`;
          })
          .join('')}</ol></section>`;
  const statusCard =
    o.status === 'paid'
      ? ''
      : `<section class="card pad">${o.status === 'failed' ? `<div class="note note-warn">${ic('alert', 18)}<span>${t('unpaid_note')}</span></div><button class="btn btn-primary mt-16" data-act="retry" data-id="${o.id}">${t('repay_x', { x: money(orderTotal(o)) })}</button>` : `<div class="note note-warn">${ic('clock', 18)}<span>${t('verifying_note')}</span></div>`}</section>`;
  return `<div class="wrap page">${pageHead(t('order_detail'), '#/orders')}
  <div class="two"><div class="d-flex flex-col gap-24">
    <section class="card pad"><div class="ocard-h"><b class="fs-18">${o.id}</b><span>${fmtDate(o.date)}</span></div><div class="badges mt-12">${orderBadges(o)}</div></section>
    ${tl}${statusCard}
    <section class="card pad"><h2 class="t-h3 mb-12">${t('items')}</h2><div class="t-label d-flex gap-10 items-center text-n700">${sAvatar(o.seller, true)} ${tr(SELLERS[o.seller].name)}</div>
      ${o.items
        .map((i) => {
          const p = prod(i.id);
          return `<div class="mini"><img src="${p.img}" alt=""><div class="flex-1"><a class="t-label" href="#/product/${p.id}">${esc(tr(p.name))}</a><div class="t-cap muted">${money(i.price)} × ${num(i.qty)}</div></div><b>${money(i.price * i.qty)}</b></div>`;
        })
        .join('')}
      <div class="divider"></div><div class="sumrow"><span>${t('subtotal')}</span><span>${money(sub)}</span></div><div class="sumrow"><span>${t('delivery')}</span><span>${money(o.delivery)}</span></div><div class="divider"></div><div class="sumrow total"><span>${t('total')}</span><span>${money(sub + o.delivery)}</span></div></section>
  </div>
  <aside class="sticky aside-stack gap-24">
    <section class="card pad"><h2 class="t-h3 mb-8">${t('payment')}</h2><div class="sumrow"><span>${t('method')}</span><span>Easy Wallet</span></div>${o.ref ? `<div class="sumrow"><span>${t('reference')}</span><span>${o.ref}</span></div><div class="sumrow"><span>${t('time')}</span><span>${fmtTime(o.paidAt || o.date)}</span></div>` : `<div class="sumrow"><span>${t('status')}</span><span>${o.status === 'failed' ? `<span class="badge b-error">${t('failed')}</span>` : `<span class="badge b-warn">${t('pay_verifying')}</span>`}</span></div>`}</section>
    <section class="card pad"><h2 class="t-h3 mb-8">${t('address')}</h2><div class="d-flex gap-10 text-n700">${ic('pin')}<div><b class="t-label">${esc(o.name)} · ${fmtPhone(o.phone)}</b><div class="muted">${esc(o.address)}</div></div></div></section>
    <section class="card pad"><h2 class="t-h3 mb-8">${t('need_help')}</h2><p class="muted">${t('need_help_p')}</p><a class="btn btn-outline btn-sm mt-12" href="#/account">${ic('help', 18)} ${t('support')}</a></section>
  </aside></div></div>`;
};
