/* =========================================================
   Rory Footwear — shared storefront engine
   Cart, wishlist, search, size guide, nav, product cards.
   Loaded on every page AFTER data.js and pages.js.
   ========================================================= */
(function () {
  "use strict";
  const CFG = window.RW_CONFIG;
  const PRODUCTS = window.RW_PRODUCTS;
  const CATS = window.RW_CATEGORIES;
  const IMG = "assets/img/products/";

  /* ---------- Icons ---------- */
  const I = {
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.4 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    truck: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
    swap: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    cash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.7-.6-3-1.3-5-4.3-5.2-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5.3.7.9 2.3 1 2.4.1.2.1.4 0 .6-.3.5-.6.8-.8 1-.2.2-.4.4-.2.7.2.3 1 1.6 2.1 2.6 1.4 1.2 2.6 1.6 3 1.8.4.1.6.1.8-.1.2-.2 1-1.1 1.2-1.5.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.5.3.6.4 0 .2 0 .8-.3 1.2Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.3v13.1a2.6 2.6 0 0 1-2.6 2.6 2.6 2.6 0 0 1 0-5.2c.3 0 .5 0 .8.1V10a5.9 5.9 0 0 0-.8-.1 5.9 5.9 0 1 0 5.9 5.9V9.5a7.6 7.6 0 0 0 4.4 1.4V7.6a4.3 4.3 0 0 1-3.4-1.8Z"/></svg>'
  };

  /* ---------- Utils ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const nf = new Intl.NumberFormat("en-NG");
  const money = (n) => "₦" + nf.format(Math.round(n));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("rf_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("rf_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const img = (p) => IMG + p.image;
  const url = (p) => "product.html?id=" + encodeURIComponent(p.id);
  const waLink = (text) => "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(text);
  const tiktokUrl = "https://www.tiktok.com/@" + CFG.tiktok;
  const G = { men: "Men", women: "Women", kids: "Kids" };

  /* ---------- Cart ---------- */
  const Cart = {
    items: store.get("cart", []).filter((i) => byId(i.id)),
    discount: store.get("discount", null),
    save() { store.set("cart", this.items); store.set("discount", this.discount); document.dispatchEvent(new CustomEvent("cart:change")); },
    key: (i) => i.id + "|" + i.size + "|" + i.color,
    add(id, size, color, qty = 1) {
      const p = byId(id); if (!p) return;
      color = color || p.colors[0].name;
      const ex = this.items.find((i) => i.id === id && i.size === size && i.color === color);
      if (ex) ex.qty = Math.min(ex.qty + qty, 10); else this.items.push({ id, size, color, qty });
      this.save();
    },
    setQty(key, qty) {
      const it = this.items.find((i) => this.key(i) === key); if (!it) return;
      if (qty <= 0) this.items = this.items.filter((i) => i !== it); else it.qty = Math.min(qty, 10);
      this.save();
    },
    remove(key) { this.items = this.items.filter((i) => this.key(i) !== key); this.save(); },
    clear() { this.items = []; this.discount = null; this.save(); },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    subtotal() { return this.items.reduce((a, i) => a + (byId(i.id)?.price || 0) * i.qty, 0); },
    discountAmount() { return this.discount ? Math.round(this.subtotal() * (CFG.discountCodes[this.discount] || 0)) : 0; },
    applyCode(code) {
      code = (code || "").trim().toUpperCase();
      if (CFG.discountCodes[code]) { this.discount = code; this.save(); return true; }
      return false;
    }
  };

  const Wish = {
    ids: store.get("wish", []),
    has(id) { return this.ids.includes(id); },
    toggle(id) { this.ids = this.has(id) ? this.ids.filter((x) => x !== id) : [...this.ids, id]; store.set("wish", this.ids); this.sync(); return this.has(id); },
    sync() {
      $$("[data-wish]").forEach((b) => { const on = this.has(b.dataset.wish); b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
      const c = $("#wishCount"); if (c) { c.textContent = this.ids.length; c.hidden = !this.ids.length; }
    }
  };

  /* ---------- Dispatch countdown (Lagos time) ---------- */
  function dispatchMsg() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
    const cutoff = new Date(now); cutoff.setHours(CFG.dispatchCutoffHour, 0, 0, 0);
    if (now.getDay() !== 0 && now < cutoff) {
      const mins = Math.round((cutoff - now) / 60000), h = Math.floor(mins / 60), m = mins % 60;
      return `Order within <b>${h ? h + "h " : ""}${m}m</b> for same-day dispatch in Lagos`;
    }
    return `Order now — dispatched <b>next working day</b>`;
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#rfToast");
    t.innerHTML = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Product card (matches .product-card design) ---------- */
  function badge(p) {
    if (p.compareAt) return `<span class="product-tag hot">−${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`;
    if (p.tags.includes("new")) return `<span class="product-tag new">New</span>`;
    if (p.tags.includes("bestseller")) return `<span class="product-tag">Bestseller</span>`;
    return "";
  }
  function card(p) {
    const meta = `${G[p.gender]} · ${CATS[p.category]} · EU ${p.sizes[0]}–${p.sizes[p.sizes.length - 1]}`;
    return `
    <article class="product-card" data-href="${url(p)}">
      <div class="product-media">
        <a href="${url(p)}" tabindex="-1" aria-hidden="true"><img src="${img(p)}" alt="${esc(p.name)}" loading="lazy" width="800" height="1000"></a>
        ${badge(p)}
        <button class="product-wish" data-wish="${p.id}" aria-pressed="${Wish.has(p.id)}" aria-label="Save ${esc(p.name)} to wishlist">${I.heart}</button>
        <div class="qa-pop" role="dialog" aria-label="Choose your size">
          <div class="qa-head"><span>Select size (EU)</span><button class="qa-x" data-qa-close aria-label="Close">×</button></div>
          <div class="qa-sizes">${p.sizes.map((s) => `<button data-add="${p.id}" data-size="${s}" ${p.soldOut.includes(s) ? `disabled aria-label="${s} sold out"` : ""}>${s}</button>`).join("")}</div>
        </div>
      </div>
      <div class="product-info">
        <a class="product-name" href="${url(p)}">${esc(p.name)}</a>
        <span class="product-meta">${meta}</span>
        ${p.colors.length > 1 ? `<span class="product-swatches">${p.colors.map((c) => `<i style="background:${c.hex}" title="${esc(c.name)}"></i>`).join("")}</span>` : ""}
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}</span>
          <button class="product-add" data-qa aria-label="Quick add ${esc(p.name)}">${I.plus}</button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Standard nav & footer pieces ---------- */
  function navActive() {
    const qs = new URLSearchParams(location.search);
    const page = document.body.dataset.page;
    let target = page === "home" ? "" : page === "shop" ? (qs.get("g") ? "shop.html?g=" + qs.get("g") : qs.get("tag") === "new" ? "shop.html?tag=new" : "shop.html") : "";
    if (page === "product") { const p = byId(qs.get("id")); if (p) target = "shop.html?g=" + p.gender; }
    $$(".nav-links .nav-link, .nav-mobile .nav-link").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === target));
  }

  /* ---------- Injected UI (drawer, search, modal, toast, WA) ---------- */
  function injectUI() {
    const sizeRows = [["36","3","5","22.5"],["37","4","6","23.5"],["38","5","7","24"],["39","6","8","25"],["40","6.5","7 M / 9 W","25.5"],["41","7","8 M","26"],["42","8","9 M","27"],["43","9","10 M","27.5"],["44","9.5","10.5 M","28.5"],["45","10.5","11.5 M","29"],["46","11","12 M","30"]];
    const html = `
    <div class="rf-overlay" id="rfOverlay"></div>
    <aside class="rf-drawer" id="cartDrawer" aria-label="Your cart" aria-hidden="true">
      <div class="rf-drawer-head"><h2>Your cart <span id="cartHeadCount"></span></h2><button class="rf-icon" data-close aria-label="Close cart">${I.close}</button></div>
      <div class="rf-drawer-body" id="cartBody"></div>
      <div class="rf-drawer-foot" id="cartFoot"></div>
    </aside>
    <div class="rf-search" id="searchPanel" role="dialog" aria-label="Search" aria-hidden="true">
      <div class="container">
        <div class="rf-search-field">${I.search}<input id="searchInput" type="search" placeholder="Search slides, sandals, kids…" autocomplete="off" aria-label="Search products"><button class="rf-icon" data-close aria-label="Close search">${I.close}</button></div>
        <div class="rf-search-tags">${["Slides", "Sandals", "Wedges", "Men", "Women", "Kids"].map((s) => `<button data-q="${s}">${s}</button>`).join("")}</div>
        <p class="rf-search-label" id="searchLabel">Popular right now</p>
        <div class="rf-search-results" id="searchResults"></div>
      </div>
    </div>
    <div class="rf-modal" id="sizeGuide" role="dialog" aria-modal="true" aria-labelledby="sgTitle" aria-hidden="true">
      <div class="rf-modal-card">
        <div class="rf-modal-head"><h2 id="sgTitle">Size guide</h2><button class="rf-icon" data-close aria-label="Close">${I.close}</button></div>
        <p class="rf-muted">Stand on paper, mark your heel and longest toe, then measure in cm. Between sizes? Go up — exchanges are free within 7 days.</p>
        <table class="rf-table"><thead><tr><th>EU</th><th>UK</th><th>US</th><th>Foot (cm)</th></tr></thead><tbody>${sizeRows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
        <p class="rf-muted" style="margin-top:12px"><b>Kids:</b> EU 24 ≈ 15cm · 26 ≈ 16.5cm · 28 ≈ 17.5cm · 30 ≈ 19cm · 32 ≈ 20cm</p>
        <a class="btn btn-soft" style="margin-top:16px" target="_blank" rel="noopener" href="${waLink("Hi Rory Footwear, please help me pick my size.")}">${I.wa} Not sure? Ask us on WhatsApp</a>
      </div>
    </div>
    <div class="rf-toast" id="rfToast" role="status" aria-live="polite"></div>
    ${document.body.dataset.page === "checkout" ? "" : `<a class="rf-wa-float" href="${waLink("Hi Rory Footwear! I'd like to make an enquiry.")}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${I.wa}<span>Chat with us</span></a>`}`;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ---------- Cart drawer render ---------- */
  function renderCart() {
    const count = Cart.count();
    $$(".nav-cart-badge").forEach((b) => {
      const prev = +b.textContent || 0;
      b.textContent = count; b.hidden = !count;
      if (count > prev) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    });
    const body = $("#cartBody"), foot = $("#cartFoot");
    if (!body) return;
    $("#cartHeadCount").textContent = count ? `(${count})` : "";
    if (!count) {
      body.innerHTML = `<div class="rf-empty"><div class="rf-empty-ico">${I.bag}</div><h3>Your cart is empty</h3><p>Let's find you something comfy.</p>
        <div class="rf-empty-links"><a class="btn btn-sm btn-soft" href="shop.html?g=men">Men</a><a class="btn btn-sm btn-soft" href="shop.html?g=women">Women</a><a class="btn btn-sm btn-soft" href="shop.html?g=kids">Kids</a></div></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;
    const sub = Cart.subtotal(), left = CFG.freeDeliveryThreshold - sub;
    const pct = Math.min(100, (sub / CFG.freeDeliveryThreshold) * 100);
    const progress = `<div class="rf-ship ${left <= 0 ? "done" : ""}">${left > 0 ? `You're <b>${money(left)}</b> away from <b>free delivery</b>` : `${I.check} You've unlocked <b>free delivery</b>`}<div class="rf-bar"><i style="width:${pct}%"></i></div></div>`;
    const lines = Cart.items.map((i) => {
      const p = byId(i.id), k = Cart.key(i);
      return `<div class="rf-line">
        <a href="${url(p)}" class="rf-line-img"><img src="${img(p)}" alt="${esc(p.name)}"></a>
        <div class="rf-line-body">
          <div class="rf-line-top"><a href="${url(p)}">${esc(p.name)}</a><span>${money(p.price * i.qty)}</span></div>
          <div class="rf-line-meta">${esc(i.color)} · EU ${i.size}</div>
          <div class="rf-line-actions">
            <div class="rf-qty"><button data-qty="${k}" data-d="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="${k}" data-d="1" aria-label="Increase quantity">+</button></div>
            <button class="rf-remove" data-remove="${k}">Remove</button>
          </div>
        </div></div>`;
    }).join("");
    const inCart = new Set(Cart.items.map((i) => i.id));
    const gs = new Set(Cart.items.map((i) => byId(i.id).gender));
    const ups = PRODUCTS.filter((p) => !inCart.has(p.id)).sort((a, b) => (gs.has(b.gender) - gs.has(a.gender)) || a.price - b.price).slice(0, 4);
    body.innerHTML = progress + lines + (ups.length ? `<div class="rf-upsell"><h3>You might also like</h3><div class="rf-upsell-row">${ups.map((p) => `<a href="${url(p)}"><img src="${img(p)}" alt="" loading="lazy"><span>${esc(p.name)}</span><b>${money(p.price)}</b></a>`).join("")}</div></div>` : "");
    const disc = Cart.discountAmount();
    foot.innerHTML = `
      <div class="rf-totals">
        <div><span>Subtotal</span><span>${money(sub)}</span></div>
        ${disc ? `<div class="rf-good"><span>Discount (${Cart.discount})</span><span>−${money(disc)}</span></div>` : ""}
        <div class="rf-muted"><span>Delivery</span><span>${left <= 0 ? "Free" : "Calculated at checkout"}</span></div>
        <div class="rf-grand"><span>Total</span><span>${money(sub - disc)}</span></div>
      </div>
      <a href="checkout.html" class="btn btn-accent btn-lg btn-block">${I.lock} Checkout securely</a>
      <a class="rf-wa-order" target="_blank" rel="noopener" href="${waLink(orderText())}">${I.wa} Or order this cart on WhatsApp</a>
      <div class="rf-trust"><span>${I.cash} Pay on delivery (Lagos)</span><span>${I.swap} 7-day exchange</span></div>`;
  }
  function orderText(extra) {
    const lines = Cart.items.map((i) => { const p = byId(i.id); return `• ${p.name} (${i.color}, EU ${i.size}) × ${i.qty} — ${money(p.price * i.qty)}`; }).join("\n");
    return `Hi Rory Footwear! I'd like to order:\n${lines}\nSubtotal: ${money(Cart.subtotal() - Cart.discountAmount())}${extra ? "\n" + extra : ""}`;
  }

  /* ---------- Open / close ---------- */
  let lastFocus = null;
  function open(id) {
    closeAll(true);
    const el = document.getElementById(id); if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add("open"); el.setAttribute("aria-hidden", "false");
    if (el.classList.contains("rf-drawer") || el.classList.contains("rf-search")) $("#rfOverlay").classList.add("open");
    document.body.classList.add("rf-lock");
    setTimeout(() => (id === "searchPanel" ? $("#searchInput") : el.querySelector("[data-close]"))?.focus(), 60);
  }
  function closeAll(silent) {
    $$(".rf-drawer.open, .rf-search.open, .rf-modal.open").forEach((el) => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); });
    $("#rfOverlay")?.classList.remove("open");
    document.body.classList.remove("rf-lock");
    $$(".qa-pop.open").forEach((q) => q.classList.remove("open"));
    if (!silent && lastFocus) lastFocus.focus?.();
  }

  /* ---------- Search ---------- */
  const haystack = (p) => [p.name, G[p.gender], p.gender, p.category, CATS[p.category], p.blurb, ...p.colors.map((c) => c.name), p.gender === "kids" ? "children child boy girl baby" : ""].join(" ").toLowerCase();
  function matches(q) { q = q.trim().toLowerCase().replace(/s$/, ""); return q ? PRODUCTS.filter((p) => haystack(p).includes(q)) : []; }
  function search(q) {
    const res = $("#searchResults"), label = $("#searchLabel");
    const hit = (p) => `<a class="rf-hit" href="${url(p)}"><img src="${img(p)}" alt="" loading="lazy"><span>${esc(p.name)}</span><b>${money(p.price)}</b></a>`;
    if (!q.trim()) { label.textContent = "Popular right now"; res.innerHTML = PRODUCTS.filter((p) => p.tags.includes("bestseller")).slice(0, 6).map(hit).join(""); return; }
    const hits = matches(q);
    label.innerHTML = hits.length ? `${hits.length} result${hits.length > 1 ? "s" : ""} · <a href="shop.html?q=${encodeURIComponent(q.trim())}">See all in shop →</a>` : "";
    res.innerHTML = hits.length ? hits.map(hit).join("") : `<p class="rf-muted">No matches for “${esc(q)}”. Try “slides” or “kids” — or <a href="${waLink(`Hi Rory Footwear, do you have: ${q}?`)}" target="_blank" rel="noopener">ask us on WhatsApp</a>.</p>`;
  }

  /* ---------- Events ---------- */
  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open],[data-close],[data-qa],[data-qa-close],[data-add],[data-wish],[data-qty],[data-remove],[data-q],[data-sizeguide]");
      if (!t) {
        if (!e.target.closest(".qa-pop")) $$(".qa-pop.open").forEach((q) => q.classList.remove("open"));
        const c = e.target.closest(".product-card[data-href]");
        if (c && !e.target.closest("a,button")) location.href = c.dataset.href;
        return;
      }
      if (t.dataset.open) { e.preventDefault(); open(t.dataset.open); }
      else if (t.hasAttribute("data-close")) { if (t.closest(".rf-drawer,.rf-search,.rf-modal")) closeAll(); }
      else if (t.hasAttribute("data-sizeguide")) { e.preventDefault(); open("sizeGuide"); }
      else if (t.hasAttribute("data-qa")) { e.preventDefault(); const pop = t.closest(".product-card").querySelector(".qa-pop"); const was = pop.classList.contains("open"); $$(".qa-pop.open").forEach((q) => q.classList.remove("open")); if (!was) pop.classList.add("open"); }
      else if (t.hasAttribute("data-qa-close")) t.closest(".qa-pop").classList.remove("open");
      else if (t.dataset.add) { t.closest(".qa-pop")?.classList.remove("open"); RF.addAndOpen(t.dataset.add, t.dataset.size); }
      else if (t.dataset.wish) { e.preventDefault(); const on = Wish.toggle(t.dataset.wish); toast(on ? `${I.heart} Saved to your wishlist · <a href="shop.html?wish=1">View</a>` : "Removed from wishlist"); }
      else if (t.dataset.qty) { const it = Cart.items.find((i) => Cart.key(i) === t.dataset.qty); if (it) Cart.setQty(t.dataset.qty, it.qty + +t.dataset.d); }
      else if (t.dataset.remove) Cart.remove(t.dataset.remove);
      else if (t.dataset.q) { $("#searchInput").value = t.dataset.q; search(t.dataset.q); }
    });
    $("#rfOverlay").addEventListener("click", () => closeAll());
    $$(".rf-modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeAll(); }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
    const si = $("#searchInput");
    si.addEventListener("input", () => search(si.value));
    si.addEventListener("keydown", (e) => { if (e.key === "Enter" && si.value.trim()) location.href = "shop.html?q=" + encodeURIComponent(si.value.trim()); });
    search("");
    document.addEventListener("cart:change", renderCart);
    window.addEventListener("storage", (e) => { if (e.key === "rf_cart") { Cart.items = store.get("cart", []); renderCart(); } if (e.key === "rf_wish") { Wish.ids = store.get("wish", []); Wish.sync(); } });

    // Navbar
    const nav = $("#navbar");
    if (nav) { const f = () => nav.classList.toggle("scrolled", scrollY > 10); f(); addEventListener("scroll", f, { passive: true }); }
    const tb = $("#toolbar");
    if (tb) addEventListener("scroll", () => tb.classList.toggle("scrolled", scrollY > 80), { passive: true });
    const hb = $("#navHamburger"), mn = $("#navMobile");
    if (hb && mn) {
      hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-controls", "navMobile");
      hb.addEventListener("click", () => { const o = mn.classList.toggle("open"); hb.setAttribute("aria-expanded", o); });
      mn.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { mn.classList.remove("open"); hb.setAttribute("aria-expanded", "false"); }));
      document.addEventListener("click", (e) => { if (mn.classList.contains("open") && !e.target.closest("#navMobile,#navHamburger")) { mn.classList.remove("open"); hb.setAttribute("aria-expanded", "false"); } });
    }
    // Smooth in-page anchors
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const id = a.getAttribute("href"); if (id.length > 1) { const el = $(id); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); } } }));
    // Year
    $$("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));
  }

  /* ---------- Public API ---------- */
  const RF = window.RF = {
    I, $, $$, money, esc, byId, img, url, card, Cart, Wish, toast, open, closeAll, dispatchMsg, waLink, tiktokUrl, store, matches, orderText, G, PRODUCTS, CFG, CATS,
    addAndOpen(id, size, color, qty) {
      Cart.add(id, size, color, qty);
      open("cartDrawer");
      const p = byId(id);
      window.dataLayer && window.dataLayer.push({ event: "add_to_cart", item_id: id, value: p.price * (qty || 1), currency: "NGN" });
    },
    renderGrid(el, list) { if (!el) return; el.innerHTML = list.map(card).join(""); Wish.sync(); }
  };

  function boot() {
    injectUI(); bind(); navActive(); renderCart(); Wish.sync();
    const page = document.body.dataset.page;
    if (window.RF_PAGES && window.RF_PAGES[page]) window.RF_PAGES[page](RF);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
