/* ================= Events ================= */
document.addEventListener('click', (e) => {
  const lb = e.target.closest('[data-lang]');
  if (lb) {
    setLang(lb.dataset.lang);
    return;
  }
  const tgt = e.target.closest('[data-act]');
  const menu = $('#umenu');
  if (menu && !e.target.closest('.menu-wrap')) menu.classList.remove('open');
  if (!tgt) return;
  const a = tgt.dataset.act,
    id = tgt.dataset.id;
  switch (a) {
    case 'add':
      e.preventDefault();
      addToCart(+id, tgt.dataset.qty ? pdQty : 1);
      break;
    case 'buynow': {
      const p = prod(id);
      addToCart(+id, pdQty, () => (location.hash = '#/checkout/' + p.seller));
      break;
    }
    case 'pdq': {
      const p = prod(route().p[1]);
      pdQty = Math.max(1, Math.min(p.stock, pdQty + +tgt.dataset.d));
      render(true);
      break;
    }
    case 'tab':
      pdTab = tgt.dataset.tab;
      render(true);
      document.getElementById(pdTab === 'desc' ? 'tb-desc' : 'tb-del')?.focus();
      break;
    case 'cq': {
      const c = S.cart.find((x) => x.id === +id),
        p = prod(id);
      c.qty = Math.max(1, Math.min(p.stock, c.qty + +tgt.dataset.d));
      save();
      render(true);
      break;
    }
    case 'rm':
      S.cart = S.cart.filter((x) => x.id !== +id);
      save();
      render(true);
      toast(t('removed'));
      break;
    case 'login':
      openLogin('login');
      break;
    case 'menu': {
      const m = $('#umenu');
      m.classList.toggle('open');
      tgt.setAttribute('aria-expanded', m.classList.contains('open'));
      break;
    }
    case 'logout':
      S.user = null;
      S.cart = [];
      save();
      location.hash = '#/';
      render();
      toast(t('logged_out'));
      break;
    case 'close':
      closeModal();
      break;
    case 'scrim':
      if (e.target === tgt) closeModal();
      break;
    case 'mback':
      M.step = 'phone';
      M.err = '';
      M.resendAt = null;
      renderModal();
      break;
    case 'resend':
      M.resendAt = Date.now() + 45000;
      startOtpTimer();
      toast(t('new_code'));
      break;
    case 'retry':
      S.pending = id;
      save();
      location.hash = '#/pay/processing';
      break;
    case 'sellerStart':
      if (!S.user) {
        openLogin('seller', () => (location.hash = '#/seller/business'));
        return;
      }
      location.hash = '#/seller/business';
      break;
    case 'merchant':
      toast(t('merchant_toast'));
      break;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && M) closeModal();
  const o = e.target.closest && e.target.closest('[data-otp]');
  if (o && e.key === 'Backspace' && !o.value && o.previousElementSibling)
    o.previousElementSibling.focus();
  const tab = e.target.closest && e.target.closest('[role=tab]');
  if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    pdTab = pdTab === 'desc' ? 'del' : 'desc';
    render(true);
    document.getElementById(pdTab === 'desc' ? 'tb-desc' : 'tb-del')?.focus();
  }
});
document.addEventListener('input', (e) => {
  const o = e.target.closest('[data-otp]');
  if (!o) return;
  const v = o.value.replace(/\D/g, '');
  if (v.length > 1) {
    const ins = [...document.querySelectorAll('[data-otp]')];
    v.slice(0, 6)
      .split('')
      .forEach((d, i) => ins[i] && (ins[i].value = d));
    ins[Math.min(5, v.length - 1)].focus();
    return;
  }
  o.value = v;
  if (v && o.nextElementSibling) o.nextElementSibling.focus();
});

document.addEventListener('submit', (e) => {
  const f = e.target,
    k = f.dataset.form;
  if (!k) return;
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  if (k === 'search') {
    location.hash = '#/products' + (d.q.trim() ? '?q=' + encodeURIComponent(d.q.trim()) : '');
    return;
  }
  if (k === 'lphone') {
    const p = normPhone(d.phone);
    M.phone = p;
    if (!validPhone(p)) {
      M.err = 1;
      renderModal();
      return;
    }
    M.err = '';
    M.step = 'otp';
    M.resendAt = null;
    renderModal();
    return;
  }
  if (k === 'lotp') {
    const code = [...f.querySelectorAll('[data-otp]')].map((i) => i.value).join('');
    if (code.length !== 6) {
      M.err = 1;
      renderModal();
      return;
    }
    clearInterval(otpTimer);
    M.err = '';
    if (S.users[M.phone]) {
      loginDone({ name: S.users[M.phone], phone: M.phone });
      return;
    }
    M.step = 'name';
    renderModal();
    return;
  }
  if (k === 'lname') {
    const n = (d.name || '').trim();
    if (n.length < 2) {
      M.err = 1;
      renderModal();
      return;
    }
    loginDone({ name: n, phone: M.phone });
    return;
  }
  if (k === 'checkout') {
    const phone = normPhone(d.phone);
    const ok = [
      setErr(f, 'name', !d.name.trim()),
      setErr(f, 'phone', !validPhone(phone)),
      setErr(f, 'address', d.address.trim().length < 8),
    ].every(Boolean);
    if (!ok) {
      f.querySelector('.has-err .input').focus();
      return;
    }
    const seller = f.dataset.seller,
      items = cartGroups()[seller];
    // re-check price & stock against the catalog before creating the payment
    const lines = items
      .map((i) => ({ id: i.id, qty: Math.min(i.qty, i.p.stock), price: i.p.price }))
      .filter((i) => i.qty > 0);
    S.addr = { name: d.name.trim(), phone, address: d.address.trim() };
    const o = {
      id: `MK-${stamp()}-${String(S.seq++).padStart(4, '0')}`,
      date: new Date().toISOString(),
      seller,
      items: lines,
      delivery: DELIVERY,
      status: 'verifying',
      ship: 0,
      ref: '',
      ...S.addr,
    };
    S.orders.push(o);
    S.cart = S.cart.filter((c) => prod(c.id).seller !== seller);
    S.pending = o.id;
    save();
    f.querySelector('[type=submit]').disabled = true;
    location.hash = '#/pay/processing';
    return;
  }
  if (k === 'biz') {
    const phone = normPhone(d.phone);
    const ok = [
      setErr(f, 'business', !d.business.trim()),
      setErr(f, 'contact', !d.contact.trim()),
      setErr(f, 'phone', !validPhone(phone)),
    ].every(Boolean);
    if (!ok) {
      f.querySelector('.has-err .input').focus();
      return;
    }
    Object.assign(S.draft, { business: d.business.trim(), contact: d.contact.trim(), phone });
    save();
    location.hash = '#/seller/address';
    return;
  }
  if (k === 'addr') {
    const ok = [
      setErr(f, 'district', d.district === ''),
      setErr(f, 'upazila', !d.upazila.trim()),
      setErr(f, 'address', !d.address.trim()),
    ].every(Boolean);
    if (!ok) {
      f.querySelector('.has-err .input').focus();
      return;
    }
    Object.assign(S.draft, {
      district: +d.district,
      upazila: d.upazila.trim(),
      address: d.address.trim(),
    });
    S.seller = {
      ...S.draft,
      status: 'pending',
      date: new Date().toISOString(),
      appId: 'SA-' + stamp() + '-' + String(Math.floor(Math.random() * 9000) + 1000),
    };
    S.draft = {};
    save();
    location.hash = '#/seller/status';
    return;
  }
});
