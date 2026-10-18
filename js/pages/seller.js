/* ================= Pages: become a seller (Flow 5) ================= */
V.sellerIntro = () => {
  if (S.user && S.seller) {
    location.hash = '#/seller/status';
    return '';
  }
  return `<div class="wrap narrow page">${pageHead(t('be_seller'), '#/')}
  <div class="sintro">${STITCH()}<div class="intro-ic">${ic('store', 34)}</div><h2>${t('seller_intro_h')}</h2><p>${t('seller_intro_p')}</p></div>
  <div class="card pad mt-16"><h3 class="t-h3">${t('how_works')}</h3><ol class="ol">
    ${[1, 2, 3].map((i) => `<li><span class="n">${num(i)}</span><b class="t-label">${t('s' + i + '_t')}</b><div class="t-cap muted">${t('s' + i + '_d')}</div></li>`).join('')}</ol></div>
  <div class="note note-info mt-16">${ic('shield', 16)}<span>${t('need_note')}</span></div>
  <button class="btn btn-primary btn-block mt-24" data-act="sellerStart">${t('start')} ${ic('arrow', 18)}</button></div>`;
};
V.sellerBiz = () => {
  if (!S.user) return `<div class="wrap page">${needLogin(t('seller_login'))}</div>`;
  const d = S.draft;
  return `<div class="wrap narrow page">${pageHead(t('seller_reg'), '#/seller')}
  <div class="t-label d-flex justify-between"><span>${t('biz_info')}</span><span class="t-cap muted">${t('step_x', { a: num(1), b: num(2) })}</span></div><div class="prog"><i class="on"></i><i></i></div>
  <form class="card pad" data-form="biz" novalidate>
    <div class="field"><label for="bn">${t('biz_name')}</label><input class="input" id="bn" name="business" value="${esc(d.business || '')}" placeholder="${t('biz_ph')}" required><span class="help">${t('biz_help')}</span><span class="errtxt">${t('biz_err')}</span></div>
    <div class="field"><label for="bc">${t('contact')}</label><input class="input" id="bc" name="contact" value="${esc(d.contact || S.user.name)}" required><span class="help">${t('contact_help')}</span><span class="errtxt">${t('name_err')}</span></div>
    <div class="field m-0"><label for="bp">${t('mobile')}</label><input class="input" id="bp" name="phone" inputmode="numeric" value="${esc(fmtPhone(d.phone || S.user.phone))}" required><span class="help">${t('seller_phone_help')}</span><span class="errtxt">${t('mobile_err')}</span></div>
    <button class="btn btn-primary btn-block mt-28" type="submit">${t('next')} ${ic('arrow', 18)}</button></form></div>`;
};
V.sellerAddr = () => {
  if (!S.user) return `<div class="wrap page">${needLogin(t('seller_login'))}</div>`;
  const d = S.draft;
  if (!d.business) {
    location.hash = '#/seller/business';
    return '';
  }
  return `<div class="wrap narrow page">${pageHead(t('seller_reg'), '#/seller/business')}
  <div class="t-label d-flex justify-between"><span>${t('biz_addr')}</span><span class="t-cap muted">${t('step_x', { a: num(2), b: num(2) })}</span></div><div class="prog"><i class="on"></i><i class="on"></i></div>
  <form data-form="addr" novalidate><div class="card pad">
    <div class="row2"><div class="field"><label for="sd">${t('district')}</label><select class="input" id="sd" name="district" required><option value="">${t('pick_district')}</option>${DISTRICTS.map((x, i) => `<option value="${i}" ${String(d.district) === String(i) ? 'selected' : ''}>${x[S.lang === 'en' ? 1 : 0]}</option>`).join('')}</select><span class="errtxt">${t('pick_district')}</span></div>
    <div class="field"><label for="su">${t('upazila')}</label><input class="input" id="su" name="upazila" value="${esc(d.upazila || '')}" placeholder="${t('upazila_ph')}" required><span class="errtxt">${t('upazila_err')}</span></div></div>
    <div class="field m-0"><label for="sa">${t('full_addr')}</label><input class="input" id="sa" name="address" value="${esc(d.address || '')}" placeholder="${t('full_addr_ph')}" required><span class="errtxt">${t('full_addr_err')}</span></div></div>
  <div class="card pad mt-16"><div class="d-flex justify-between items-center mb-8"><h3 class="t-h3">${t('your_info')}</h3><a class="link d-inline-flex gap-6 items-center" href="#/seller/business">${ic('edit', 16)} ${t('edit')}</a></div>
    <div class="sumrow"><span>${t('biz_name')}</span><span>${esc(d.business)}</span></div><div class="sumrow"><span>${t('contact_s')}</span><span>${esc(d.contact)}</span></div><div class="sumrow"><span>${t('mobile_s')}</span><span>${fmtPhone(d.phone)}</span></div></div>
  <div class="note note-info mt-16">${ic('shield', 16)}<span>${t('same_acct')}</span></div>
  <button class="btn btn-primary btn-block mt-24" type="submit">${t('submit_app')}</button></form></div>`;
};
V.sellerStatus = () => {
  if (!S.user) return `<div class="wrap page">${needLogin(t('status_login'))}</div>`;
  const sl = S.seller;
  if (!sl) {
    location.hash = '#/seller';
    return '';
  }
  const ok = sl.status === 'approved';
  return `<div class="wrap narrow page">${pageHead(t('app_status'), '#/account')}
  <div class="status"><div class="halo ${ok ? 'ok' : 'info'}"><span>${ic(ok ? 'check' : 'clock', 36)}</span></div>
    <h1>${ok ? t('approved_h') : t('submitted_h')}</h1><p class="sub">${ok ? t('approved_p', { x: esc(sl.business) }) : t('submitted_p')}</p></div>
  <div class="card pad"><div class="d-flex justify-between items-center mb-16"><b>${sl.appId}</b>${ok ? `<span class="badge b-success">${t('approved')}</span>` : `<span class="badge b-warn">${t('checking')}</span>`}</div>
    <ol class="tl"><li class="done"><span class="dot">${ic('check', 14)}</span><div><b>${t('app_submitted')}</b><span class="t-cap muted">${fmtTime(sl.date)}</span></div></li>
    <li class="${ok ? 'done' : 'cur'}"><span class="dot">${ok ? ic('check', 14) : ''}</span><div><b>${t('info_check')}</b><span class="t-cap muted">${ok ? t('done') : t('ongoing')}</span></div></li>
    <li class="${ok ? 'cur' : 'todo'}"><span class="dot"></span><div><b>${t('s3_t')}</b>${ok ? `<span class="t-cap muted">${t('can_add')}</span>` : ''}</div></li></ol></div>
  ${ok ? '' : `<div class="note note-neutral mt-16">${ic('cart', 16)}<span>${t('shop_while')}</span></div>`}
  <div class="actions">${ok ? `<button class="btn btn-primary" data-act="merchant">${t('go_merchant')}</button><a class="btn btn-ghost" href="#/account">${t('go_profile')}</a>` : `<a class="btn btn-primary" href="#/">${t('back_shopping')}</a><a class="btn btn-ghost" href="#/account">${t('go_profile')}</a>`}</div></div>`;
};
