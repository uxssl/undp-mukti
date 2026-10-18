/* ================= Login modal (02-A / 02-B / 02-C) ================= */
let M = null,
  otpTimer;
function openLogin(reason, after) {
  M = { step: 'phone', reason, after, phone: '', err: '' };
  renderModal();
}
function closeModal() {
  M = null;
  clearInterval(otpTimer);
  $('#modal-root').innerHTML = '';
}
function renderModal() {
  if (!M) return;
  let body = '';
  if (M.step === 'phone') {
    body = `<div class="mh"><span class="si">${ic(M.reason === 'cart' ? 'cart' : M.reason === 'seller' ? 'store' : 'user', 22)}</span><div><h2 class="t-h3" id="mt">${M.reason === 'cart' ? t('login_cart') : M.reason === 'seller' ? t('login_seller') : t('login_h')}</h2><p class="t-cap muted">${t('login_sub')}</p></div></div>
    <form data-form="lphone" novalidate><div class="field ${M.err ? 'has-err' : ''}"><label for="lp">${t('mobile')}</label><input class="input" id="lp" name="phone" inputmode="numeric" autocomplete="tel" placeholder="01XXX XXXXXX" value="${esc(fmtPhone(M.phone))}" maxlength="14"><span class="help">${t('code_help')}</span><span class="errtxt">${t('phone_err')}</span></div>
    <button class="btn btn-primary btn-block" type="submit">${t('send_code')}</button><button type="button" class="btn btn-ghost btn-block mt-8" data-act="close">${t('not_now')}</button></form>`;
  } else if (M.step === 'otp') {
    body = `<div class="mh"><button class="back shadow-none bg-n100" data-act="mback" aria-label="${t('back')}">${ic('left')}</button><h2 class="t-h3" id="mt">${t('verify_number')}</h2></div>
    <h3 class="t-h1">${t('enter_code')}</h3><p class="muted">${t('code_sent', { x: fmtPhone(M.phone) })}</p><button class="link" data-act="mback">${t('change_number')}</button>
    <form data-form="lotp" novalidate><div class="otp ${M.err ? 'bad' : ''}" role="group" aria-label="${t('otp_group')}">${[0, 1, 2, 3, 4, 5].map((i) => `<input inputmode="numeric" maxlength="1" aria-label="${t('digit', { n: num(i + 1) })}" data-otp="${i}" ${i === 0 ? 'autocomplete="one-time-code"' : ''}>`).join('')}</div>
    ${M.err ? `<p class="errtxt d-block mb-8">${t('otp_err')}</p>` : ''}
    <p class="t-cap muted d-flex items-center gap-6" id="resend">${ic('clock', 16)} <span>${t('resend')} <b id="otpT"></b></span></p>
    <p class="t-cap mt-8 text-w600">${t('proto_otp')}</p>
    <button class="btn btn-primary btn-block mt-20" type="submit">${t('verify')}</button></form>`;
  } else {
    body = `<div class="mh"><span class="si">${ic('user', 22)}</span><h2 class="t-h3" id="mt">${t('create_acct')}</h2></div>
    <span class="verified">${ic('check', 16)} ${fmtPhone(M.phone)} · ${t('verified')}</span>
    <h3 class="t-h1">${t('enter_name')}</h3><p class="muted mb-16">${t('name_use')}</p>
    <form data-form="lname" novalidate><div class="field ${M.err ? 'has-err' : ''}"><label for="ln">${t('your_name')}</label><input class="input" id="ln" name="name" autocomplete="name" placeholder="${t('name_ph')}"><span class="errtxt">${t('name_err')}</span></div>
    <button class="btn btn-primary btn-block" type="submit">${t('create_btn')}</button></form>`;
  }
  $('#modal-root').innerHTML =
    `<div class="scrim" data-act="scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><button class="x" data-act="close" aria-label="${t('close')}">${ic('x')}</button>${body}</div></div>`;
  const f = $('#modal-root input');
  f && f.focus();
  if (M.step === 'otp') startOtpTimer();
}
function startOtpTimer() {
  clearInterval(otpTimer);
  if (!M.resendAt) M.resendAt = Date.now() + 45000;
  const tick = () => {
    const el = $('#otpT'),
      rs = $('#resend');
    if (!el || !M) {
      clearInterval(otpTimer);
      return;
    }
    const s = Math.max(0, Math.round((M.resendAt - Date.now()) / 1000));
    if (s <= 0) {
      clearInterval(otpTimer);
      rs.innerHTML = `${ic('refresh', 16)} <button class="link" data-act="resend">${t('resend')}</button>`;
      return;
    }
    el.textContent = num(Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'));
  };
  tick();
  otpTimer = setInterval(tick, 1000);
}
function loginDone(user) {
  S.user = user;
  S.users[user.phone] = user.name;
  save();
  const after = M && M.after;
  closeModal();
  render(true);
  if (after) after();
  else toast(t('welcome', { x: esc(user.name) }));
}
