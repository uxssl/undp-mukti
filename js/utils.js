/* ================= Helpers ================= */
const BN = '০১২৩৪৫৬৭৮৯';
const num = (v) => (S.lang === 'bn' ? String(v).replace(/\d/g, (d) => BN[d]) : String(v));
const money = (n) => '৳' + num(Number(n).toLocaleString('en-IN'));
const MON = {
  bn: [
    'জানু',
    'ফেব্রু',
    'মার্চ',
    'এপ্রি',
    'মে',
    'জুন',
    'জুলা',
    'আগ',
    'সেপ্টে',
    'অক্টো',
    'নভে',
    'ডিসে',
  ],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const fmtDate = (iso) => {
  const d = new Date(iso);
  return num(d.getDate()) + ' ' + MON[S.lang][d.getMonth()] + ' ' + num(d.getFullYear());
};
const fmtTime = (iso) => {
  const d = new Date(iso);
  const h = d.getHours(),
    m = String(d.getMinutes()).padStart(2, '0');
  if (S.lang === 'en')
    return `${d.getDate()} ${MON.en[d.getMonth()]}, ${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  const part = h < 12 ? 'সকাল' : h < 16 ? 'দুপুর' : h < 18 ? 'বিকাল' : 'রাত';
  return (
    num(d.getDate()) +
    ' ' +
    MON.bn[d.getMonth()] +
    ', ' +
    part +
    ' ' +
    num((h % 12 || 12) + ':' + m)
  );
};
const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const fmtPhone = (p) => (p ? p.slice(0, 5) + ' ' + p.slice(5) : '');
const normPhone = (v) => v.replace(/[^\d]/g, '').replace(/^88/, '');
const validPhone = (p) => /^01[3-9]\d{8}$/.test(p);
const rand = (n) => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    b = new Uint32Array(n);
  crypto.getRandomValues(b);
  return [...b].map((x) => a[x % a.length]).join('');
};
const $ = (s) => document.querySelector(s);

function setErr(form, name, bad) {
  const f = form.querySelector(`[name="${name}"]`).closest('.field');
  f.classList.toggle('has-err', !!bad);
  return !bad;
}
const stamp = () => {
  const n = new Date();
  return (
    String(n.getFullYear()).slice(2) +
    String(n.getMonth() + 1).padStart(2, '0') +
    String(n.getDate()).padStart(2, '0')
  );
};
