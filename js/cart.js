/* ================= Cart actions ================= */
function addToCart(id, qty, then) {
  const p = prod(id);
  if (!p || !p.stock) return;
  const go = () => {
    const c = S.cart.find((x) => x.id === p.id);
    if (c) c.qty = Math.min(p.stock, c.qty + qty);
    else S.cart.push({ id: p.id, qty: Math.min(qty, p.stock) });
    save();
    if (then) {
      then();
      return;
    }
    renderHeader();
    const b = $('#cartBtn');
    b && b.classList.add('bump');
    toast(t('added'), [t('view_cart'), '#/cart']);
  };
  if (!S.user) {
    openLogin('cart', go);
    return;
  }
  go();
}
