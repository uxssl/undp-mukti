/* ================= State (browser storage is a per-viewer convenience only) ================= */
const KEY = 'mukti-web-proto-v2';
let S;

const seedOrders = () => [
  {
    id: 'MK-261016-0031',
    date: '2026-10-16T11:20:00',
    seller: 'nurjahan',
    items: [{ id: 3, qty: 1, price: 290 }],
    delivery: DELIVERY,
    status: 'verifying',
    ship: 0,
    ref: '',
    name: 'রাশিদা বেগম',
    phone: '01712345678',
    address: 'চাঁদপুর, ঝিকরগাছা, যশোর',
  },
  {
    id: 'MK-261015-0018',
    date: '2026-10-15T16:05:00',
    seller: 'salma',
    items: [{ id: 2, qty: 1, price: 480 }],
    delivery: DELIVERY,
    status: 'failed',
    ship: 0,
    ref: '',
    name: 'রাশিদা বেগম',
    phone: '01712345678',
    address: 'চাঁদপুর, ঝিকরগাছা, যশোর',
  },
];
const fresh = () => ({
  lang: 'bn',
  user: null,
  users: {},
  cart: [],
  orders: seedOrders(),
  seq: 42,
  addr: null,
  seller: null,
  draft: {},
  failNext: false,
  pending: null,
});
try {
  S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}'));
} catch (e) {
  S = fresh();
}
if (S.lang !== 'en') S.lang = 'bn';
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
};
const cartCount = () => S.cart.reduce((a, c) => a + c.qty, 0);
