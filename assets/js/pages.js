/* =========================================================
   Rory Footwear — page controllers
   Each runs once app.js has booted (RF is the shared API).
   ========================================================= */
window.RF_PAGES = window.RF_PAGES || {};

/* ---------------- HOME ---------------- */
RF_PAGES.home = function (RF) {
  const { $, $$, PRODUCTS } = RF;
  const best = (g) => PRODUCTS.filter((p) => g === "all" || p.gender === g)
    .sort((a, b) => b.tags.includes("bestseller") - a.tags.includes("bestseller") || b.stock - a.stock).slice(0, 4);

  RF.renderGrid($("#bestGrid"), best("all"));
  RF.renderGrid($("#newGrid"), PRODUCTS.filter((p) => p.tags.includes("new")).slice(0, 4));

  $$("[data-tab]").forEach((btn) => btn.addEventListener("click", () => {
    $$("[data-tab]").forEach((b) => { b.setAttribute("aria-pressed", "false"); b.className = "btn btn-sm btn-outline"; });
    btn.setAttribute("aria-pressed", "true"); btn.className = "btn btn-sm btn-soft";
    RF.renderGrid($("#bestGrid"), best(btn.dataset.tab));
    $("#bestAll").href = btn.dataset.tab === "all" ? "shop.html" : "shop.html?g=" + btn.dataset.tab;
  }));

  const d = $("#heroDispatch"); if (d) d.innerHTML = RF.I.truck + " " + RF.dispatchMsg();

  const form = $("#newsForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#newsEmail"), v = input.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) { input.style.borderColor = "#ff5c5c"; input.focus(); setTimeout(() => (input.style.borderColor = ""), 2000); return; }
    RF.store.set("subscriber", v);
    form.innerHTML = `<div class="newsletter-input" style="flex:1;display:flex;align-items:center;gap:.5rem;background:#fff">${RF.I.check} You're in! Use code <b style="color:var(--coral)">WELCOME10</b> for 10% off.</div>`;
  });
};

/* ---------------- SHOP ---------------- */
RF_PAGES.shop = function (RF) {
  const { $, $$, PRODUCTS, Wish, esc } = RF;
  const qs = new URLSearchParams(location.search);
  const sizeRanges = { "24-28": [24, 28], "29-32": [29, 32], "36-38": [36, 38], "39-41": [39, 41], "42-44": [42, 44], "45-46": [45, 46] };
  const state = {
    chip: qs.get("c") || "all",
    category: [], group: qs.get("g") ? [qs.get("g")] : [], size: [],
    priceMin: null, priceMax: null, sort: "featured",
    tag: qs.get("tag") || "", q: qs.get("q") || "", wish: qs.get("wish") === "1"
  };

  // Add kids size ranges to the size filter lists
  $$(".filter-group").forEach((g) => {
    if (/Size/i.test(g.querySelector("h3")?.textContent || "")) {
      const opts = g.querySelector(".filter-options");
      const attr = g.closest("#filterDrawer") ? "data-filter-mobile" : "data-filter";
      opts.insertAdjacentHTML("afterbegin", `<label class="filter-option"><input type="checkbox" value="24-28" ${attr}="size"><span>24 – 28 (kids)</span></label><label class="filter-option"><input type="checkbox" value="29-32" ${attr}="size"><span>29 – 32 (kids)</span></label>`);
    }
  });
  // Mobile drawer gets the size group too, if missing
  if (!$("#filterDrawer input[value='36-38']")) {
    $("#filterDrawer .drawer-body").insertAdjacentHTML("beforeend", `<div class="filter-group"><h3>Size (EU)</h3><div class="filter-options">${Object.keys(sizeRanges).map((k) => `<label class="filter-option"><input type="checkbox" value="${k}" data-filter-mobile="size"><span>${k.replace("-", " – ")}${+k.split("-")[0] < 33 ? " (kids)" : ""}</span></label>`).join("")}</div></div>`);
  }

  const titles = { men: "Men's <em>footwear</em>", women: "Women's <em>footwear</em>", kids: "Kids' <em>footwear</em>" };
  const leads = { men: "Slides and sandals built for long days — EU 40 to 46.", women: "Slides, sandals and wedges for every plan — EU 36 to 42.", kids: "Easy straps, grippy soles, made for play — EU 24 to 32." };

  function syncInputs() {
    ["category", "group", "size"].forEach((t) => {
      $$(`input[data-filter="${t}"], input[data-filter-mobile="${t}"]`).forEach((i) => (i.checked = state[t].includes(i.value)));
    });
    ["priceMin", "priceMax"].forEach((k) => { $("#" + k).value = state[k] ?? ""; const m = $("#" + k + "Mobile"); if (m) m.value = state[k] ?? ""; });
    $$("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === state.chip));
    $("#sort").value = state.sort; $("#sortMobile").value = state.sort;
  }

  function apply() {
    let list = PRODUCTS.filter((p) => {
      if (state.wish && !Wish.has(p.id)) return false;
      if (state.chip !== "all" && p.category !== state.chip) return false;
      if (state.category.length && !state.category.includes(p.category)) return false;
      if (state.group.length && !state.group.includes(p.gender)) return false;
      if (state.tag === "new" && !p.tags.includes("new")) return false;
      if (state.tag === "sale" && !p.compareAt) return false;
      if (state.priceMin !== null && p.price < state.priceMin) return false;
      if (state.priceMax !== null && p.price > state.priceMax) return false;
      if (state.size.length && !p.sizes.some((s) => !p.soldOut.includes(s) && state.size.some((r) => { const [a, b] = sizeRanges[r]; return +s >= a && +s <= b; }))) return false;
      return true;
    });
    if (state.q) { const hits = new Set(RF.matches(state.q).map((p) => p.id)); list = list.filter((p) => hits.has(p.id)); }
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "new") list.sort((a, b) => b.tags.includes("new") - a.tags.includes("new"));
    else list.sort((a, b) => b.tags.includes("bestseller") - a.tags.includes("bestseller"));

    // Heading
    const g1 = state.group.length === 1 ? state.group[0] : "";
    const title = state.wish ? "Your <em>wishlist</em>" : state.q ? `Results for <em>“${esc(state.q)}”</em>` : state.tag === "new" ? "New <em>in</em>" : state.tag === "sale" ? "On <em>sale</em>" : g1 ? titles[g1] : state.chip !== "all" ? `Shop <em>${RF.CATS[state.chip].toLowerCase()}</em>` : "Shop <em>all</em>";
    $(".shop-hero h1").innerHTML = title;
    const crumb = $(".shop-hero .crumbs span:last-child"); if (crumb) crumb.textContent = title.replace(/<[^>]+>/g, "");
    const lead = $(".shop-hero .lead"); if (lead) lead.textContent = state.wish ? "Styles you've saved. Tap the heart on any product to add it here." : g1 ? leads[g1] : "Slides, sandals and wedges for the whole family. Free 7-day size exchange.";
    document.title = title.replace(/<[^>]+>/g, "").replace(/[“”]/g, "") + " — Rory Footwear";

    $("#count").textContent = `${list.length} style${list.length !== 1 ? "s" : ""}`;
    const grid = $("#grid"), empty = $("#empty");
    if (!list.length) {
      grid.innerHTML = ""; grid.style.display = "none"; empty.hidden = false;
      empty.querySelector("h3").textContent = state.wish ? "No saved styles yet" : "No styles match";
      empty.querySelector("p").textContent = state.wish ? "Tap the heart on any product to save it here." : "Try adjusting your filters or clearing them to see all products.";
    } else { grid.style.display = ""; empty.hidden = true; RF.renderGrid(grid, list); }

    // Keep the URL shareable
    const u = new URLSearchParams();
    if (g1) u.set("g", g1);
    if (state.chip !== "all") u.set("c", state.chip);
    if (state.tag) u.set("tag", state.tag);
    if (state.q) u.set("q", state.q);
    if (state.wish) u.set("wish", "1");
    history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    const mf = $("#filterDrawer .drawer-foot [data-close]"); if (mf) mf.textContent = `Show ${list.length} result${list.length !== 1 ? "s" : ""}`;
  }

  // Chips
  $$("[data-cat]").forEach((b) => b.addEventListener("click", () => { state.chip = b.dataset.cat; state.category = []; syncInputs(); apply(); }));
  // Checkboxes (desktop + mobile share state)
  document.addEventListener("change", (e) => {
    const t = e.target.dataset.filter || e.target.dataset.filterMobile; if (!t) return;
    const v = e.target.value;
    state[t] = e.target.checked ? [...new Set([...state[t], v])] : state[t].filter((x) => x !== v);
    if (t === "category") state.chip = "all";
    syncInputs(); apply();
  });
  // Price
  ["priceMin", "priceMax", "priceMinMobile", "priceMaxMobile"].forEach((id) => $("#" + id)?.addEventListener("input", (e) => {
    const k = id.replace("Mobile", ""); state[k] = e.target.value ? parseInt(e.target.value, 10) : null; syncInputs(); apply();
  }));
  // Sort
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; syncInputs(); apply(); });
  $("#sortMobile").addEventListener("change", (e) => { state.sort = e.target.value; syncInputs(); apply(); });
  // Clear
  const clear = () => { Object.assign(state, { chip: "all", category: [], group: [], size: [], priceMin: null, priceMax: null, tag: "", q: "", wish: false }); syncInputs(); apply(); };
  $("#clearFilters").addEventListener("click", clear);
  $("#empty .btn")?.removeAttribute("onclick");
  $("#empty .btn")?.addEventListener("click", clear);

  // Mobile filter drawer (page-owned)
  const dr = $("#filterDrawer"), ov = $("#drawerOverlay");
  const openD = () => { dr.classList.add("open"); ov.classList.add("open"); dr.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeD = () => { dr.classList.remove("open"); ov.classList.remove("open"); dr.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  $$('[data-open="filterDrawer"]').forEach((b) => { b.removeAttribute("data-open"); b.addEventListener("click", openD); });
  $$("#filterDrawer [data-close]").forEach((b) => { b.removeAttribute("data-close"); b.addEventListener("click", closeD); });
  ov.addEventListener("click", closeD);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeD(); });

  syncInputs(); apply();
};

/* ---------------- PRODUCT ---------------- */
RF_PAGES.product = function (RF) {
  const { $, $$, byId, money, esc, img, PRODUCTS, CFG, Wish, I, waLink, G, CATS } = RF;
  const p = byId(new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
  const images = (p.images || [p.image]).map((f) => "assets/img/products/" + f);
  const sel = { color: p.colors[0].name, size: null, qty: 1 };
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const badgeTxt = off ? `−${off}%` : p.tags.includes("new") ? "New" : p.tags.includes("bestseller") ? "Bestseller" : "";
  const badgeCls = off ? "hot" : p.tags.includes("new") ? "new" : "hot";
  const fit = p.gender === "kids" ? "Little feet grow fast — leave about 1cm of room." : "Fits true to size. Between sizes? Go up.";

  document.title = `${p.name} — ${G[p.gender]}'s ${CATS[p.category]} | Rory Footwear`;
  $('meta[name="description"]')?.setAttribute("content", p.blurb);

  $("#pdpRoot").innerHTML = `
    <nav class="pdp-breadcrumbs" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span>/</span><a href="shop.html?g=${p.gender}">${G[p.gender]}</a><span>/</span><a href="shop.html?g=${p.gender}&c=${p.category}">${CATS[p.category]}</a><span>/</span><span aria-current="page">${esc(p.name)}</span>
    </nav>
    <div class="pdp-grid">
      <div class="pdp-gallery">
        <div class="pdp-main-image">
          <img src="${images[0]}" alt="${esc(p.name)} in ${esc(sel.color)}" id="mainImage" width="800" height="1000">
          ${badgeTxt ? `<span class="pdp-badge ${badgeCls}">${badgeTxt}</span>` : ""}
        </div>
        ${images.length > 1 ? `<div class="pdp-thumbs">${images.map((src, i) => `<div class="pdp-thumb ${i ? "" : "active"}" data-img="${src}" role="button" tabindex="0" aria-label="View image ${i + 1}"><img src="${src}" alt=""></div>`).join("")}</div>` : ""}
      </div>

      <div class="pdp-info">
        <div class="pdp-title-group">
          <p class="eyebrow">${G[p.gender]} · ${CATS[p.category]}</p>
          <h1 class="pdp-title">${esc(p.name)}</h1>
        </div>
        <div class="pdp-price-row">
          <span class="pdp-price">${money(p.price)}</span>
          ${p.compareAt ? `<span class="pdp-compare">${money(p.compareAt)}</span><span class="pdp-save">Save ${money(p.compareAt - p.price)}</span>` : ""}
        </div>
        <p class="pdp-desc">${esc(p.blurb)}</p>

        <div class="pdp-option-group">
          <div class="pdp-option-header"><span class="pdp-option-label">Colour</span><span class="pdp-option-value" id="colorValue">${esc(sel.color)}</span></div>
          <div class="pdp-swatches">${p.colors.map((c, i) => `<button class="pdp-swatch ${i ? "" : "active"}" data-color="${esc(c.name)}" style="background:${c.hex}" aria-label="${esc(c.name)}" aria-pressed="${!i}"></button>`).join("")}</div>
        </div>

        <div class="pdp-option-group">
          <div class="pdp-option-header"><span class="pdp-option-label">Size (EU) <span class="pdp-option-value" id="sizeValue" style="margin-left:.35rem">— select</span></span>
            <button class="btn btn-soft" style="padding:.35rem .85rem;font-size:.75rem" data-sizeguide>Size guide</button></div>
          <div class="pdp-sizes">${p.sizes.map((s) => `<button class="pdp-size ${p.soldOut.includes(s) ? "disabled" : ""}" data-size="${s}" ${p.soldOut.includes(s) ? `disabled aria-label="${s} sold out"` : ""}>${s}</button>`).join("")}</div>
          <p id="sizeErr" style="display:none;color:#d63c2f;font-size:.82rem;font-weight:600;margin-top:.6rem">Please choose your size to continue.</p>
          <p style="font-size:.8rem;color:var(--ink-muted);margin-top:.6rem">${fit}</p>
        </div>

        <div class="pdp-option-group">
          <div class="pdp-option-header"><span class="pdp-option-label">Quantity</span></div>
          <div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap">
            <div class="pdp-qty">
              <button id="qtyMinus" aria-label="Decrease quantity"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
              <span id="qtyValue">1</span>
              <button id="qtyPlus" aria-label="Increase quantity"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>
            <span style="font-size:.85rem;font-weight:600;color:${p.stock <= 5 ? "var(--coral)" : "#0d9b6c"}">${p.stock <= 5 ? `● Only ${p.stock} pairs left` : "✓ In stock, ready to ship"}</span>
          </div>
        </div>

        <div class="pdp-cta-row">
          <button class="btn btn-accent btn-lg" id="addToCartBtn">${I.bag} <span id="atcLabel">Add to cart — ${money(p.price)}</span></button>
          <button class="pdp-wish-btn" data-wish="${p.id}" aria-label="Save to wishlist" aria-pressed="${Wish.has(p.id)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.4 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z"/></svg></button>
        </div>
        <a class="btn btn-outline btn-lg" id="waBtn" target="_blank" rel="noopener" style="width:100%;border-color:#25d366;color:#128c4a">${I.wa} Order on WhatsApp</a>
        <p class="hero-dispatch" style="margin-top:-.25rem">${I.truck} ${RF.dispatchMsg()}</p>

        <div class="pdp-trust">
          <div class="pdp-trust-item">${I.swap} Free 7-day exchange</div>
          <div class="pdp-trust-item">${I.cash} Pay on delivery · Lagos</div>
          <div class="pdp-trust-item">${I.truck} Nationwide delivery</div>
          <div class="pdp-trust-item">${I.lock} Secure checkout via Paystack</div>
        </div>

        <div class="pdp-accordion">
          <details class="pdp-acc-item" open><summary>Details<span class="plus">+</span></summary>
            <div class="pdp-acc-content"><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></details>
          <details class="pdp-acc-item"><summary>Delivery & returns<span class="plus">+</span></summary>
            <div class="pdp-acc-content">
              ${CFG.delivery.map((d) => `<p style="margin-top:.4rem"><strong>${esc(d.label)}:</strong> ${d.fee ? money(d.fee) : "Free"} · ${esc(d.eta)}</p>`).join("")}
              <p style="margin-top:.4rem"><strong>Free delivery</strong> on orders over ${money(CFG.freeDeliveryThreshold)}.</p>
              <p style="margin-top:.4rem"><strong>Exchanges:</strong> free size swap within 7 days — unworn, in original packaging. <a href="policies.html#returns" style="color:var(--accent);font-weight:600">Read policy</a></p>
            </div></details>
          <details class="pdp-acc-item"><summary>Care<span class="plus">+</span></summary>
            <div class="pdp-acc-content"><p>Wipe with a soft, damp cloth. Air-dry away from direct heat and sunlight. Store in the dust bag to keep the shape.</p></div></details>
        </div>
      </div>
    </div>`;

  // Related: same department first
  RF.renderGrid($("#related"), PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (b.gender === p.gender) - (a.gender === p.gender) || (b.category === p.category) - (a.category === p.category)).slice(0, 4));

  // Sticky bar
  $(".sticky-atc-thumb img").src = images[0];
  $(".sticky-atc-thumb img").alt = p.name;
  $(".sticky-atc-name").textContent = p.name;
  $(".sticky-atc-price").textContent = money(p.price);
  const stickyBtn = $(".sticky-atc .btn"); stickyBtn.removeAttribute("onclick");

  // SEO structured data
  const ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, image: new URL(images[0], location.href).href, description: p.blurb, brand: { "@type": "Brand", name: CFG.brand }, offers: { "@type": "Offer", priceCurrency: "NGN", price: p.price, availability: "https://schema.org/InStock", url: location.href } });
  document.head.appendChild(ld);

  const sync = () => {
    $("#qtyValue").textContent = sel.qty;
    $("#atcLabel").textContent = `Add to cart — ${money(p.price * sel.qty)}`;
    $("#sizeValue").textContent = sel.size ? "EU " + sel.size : "— select";
    $(".sticky-atc-meta").textContent = `${sel.color} · ${sel.size ? "EU " + sel.size : "Select size"}`;
    $("#waBtn").href = waLink(`Hi Rory Footwear! I'd like to order:\n• ${p.name} (${sel.color})\n• Size: EU ${sel.size || "?"}\n• Qty: ${sel.qty}\n• Price: ${money(p.price * sel.qty)}\n${location.href}`);
  };
  const tryAdd = () => {
    if (!sel.size) {
      const err = $("#sizeErr"); err.style.display = "block";
      $(".pdp-sizes").scrollIntoView({ behavior: "smooth", block: "center" });
      $(".pdp-sizes").animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 300 });
      return;
    }
    RF.addAndOpen(p.id, sel.size, sel.color, sel.qty);
  };
  $("#addToCartBtn").addEventListener("click", tryAdd);
  stickyBtn.addEventListener("click", tryAdd);
  $("#qtyMinus").addEventListener("click", () => { sel.qty = Math.max(1, sel.qty - 1); sync(); });
  $("#qtyPlus").addEventListener("click", () => { sel.qty = Math.min(10, sel.qty + 1); sync(); });
  $$(".pdp-size").forEach((b) => b.addEventListener("click", () => {
    if (b.disabled) return;
    $$(".pdp-size").forEach((x) => x.classList.toggle("active", x === b));
    sel.size = b.dataset.size; $("#sizeErr").style.display = "none"; sync();
  }));
  $$(".pdp-swatch").forEach((b) => b.addEventListener("click", () => {
    $$(".pdp-swatch").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
    sel.color = b.dataset.color; $("#colorValue").textContent = sel.color; sync();
  }));
  $$(".pdp-thumb").forEach((t) => t.addEventListener("click", () => {
    $$(".pdp-thumb").forEach((x) => x.classList.toggle("active", x === t)); $("#mainImage").src = t.dataset.img;
  }));
  const sticky = $("#stickyAtc");
  new IntersectionObserver(([en]) => sticky.classList.toggle("visible", !en.isIntersecting && en.boundingClientRect.top < 0)).observe($(".pdp-cta-row"));
  sync(); RF.Wish.sync();
};

/* ---------------- CHECKOUT ---------------- */
RF_PAGES.checkout = function (RF) {
  const { $, $$, money, esc, img, byId, Cart, CFG, I, waLink, store } = RF;
  const STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
  const saved = store.get("customer", {});
  const st = { delivery: saved.delivery || "lagos", payment: "paystack" };

  // Empty cart → friendly state
  if (!Cart.items.length) {
    $("#checkoutWrap .checkout-grid").innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius-lg)">
      <div style="width:72px;height:72px;border-radius:50%;background:var(--peach-soft);color:var(--coral);display:grid;place-items:center;margin:0 auto 1rem">${I.bag}</div>
      <h2 style="font-family:var(--font-display);font-weight:800;font-size:1.5rem">Your cart is empty</h2>
      <p style="color:var(--ink-soft);margin:.5rem 0 1.5rem">Add a pair or two and come back — we'll keep your details ready.</p>
      <a href="shop.html" class="btn btn-accent btn-lg">Start shopping</a></div>`;
    $("#checkoutWrap h1").innerHTML = "Nothing to <em>checkout</em> yet";
    return;
  }

  // States list
  $("#state").innerHTML = `<option value="">Select state</option>` + STATES.map((s) => `<option ${s === (saved.state || "") ? "selected" : ""}>${s}</option>`).join("");
  ["firstName", "lastName", "email", "phone", "address", "city"].forEach((k) => { if (saved[k]) $("#" + k).value = saved[k]; });

  const isLagos = () => $("#state").value === "Lagos" || !$("#state").value;
  const methods = () => CFG.delivery.filter((d) => !d.lagosOnly || isLagos());
  const method = () => CFG.delivery.find((d) => d.id === st.delivery) || CFG.delivery[0];
  const fee = () => (method().fee && Cart.subtotal() - Cart.discountAmount() >= CFG.freeDeliveryThreshold ? 0 : method().fee);
  const total = () => Cart.subtotal() - Cart.discountAmount() + fee();

  function renderDelivery() {
    const list = methods();
    if (!list.find((d) => d.id === st.delivery)) st.delivery = list[0].id;
    const freeOk = Cart.subtotal() - Cart.discountAmount() >= CFG.freeDeliveryThreshold;
    $("#deliveryOptions").innerHTML = list.map((d) => `
      <label class="delivery-option ${d.id === st.delivery ? "selected" : ""}" data-delivery="${d.id}">
        <input type="radio" name="delivery" value="${d.id}" ${d.id === st.delivery ? "checked" : ""}>
        <span class="delivery-radio"></span>
        <div class="delivery-info"><span class="name">${esc(d.label)}</span><span class="desc">${esc(d.desc)}</span></div>
        <span class="delivery-price ${!d.fee || freeOk ? "free" : ""}">${!d.fee || freeOk ? "Free" : money(d.fee)}</span>
      </label>`).join("");
    const pod = $('[data-payment="pod"]');
    pod.style.opacity = isLagos() ? "1" : ".5"; pod.style.pointerEvents = isLagos() ? "auto" : "none";
    pod.querySelector(".desc").textContent = isLagos() ? "Cash or transfer at your door — Lagos only" : "Only available for Lagos addresses";
    if (!isLagos() && st.payment === "pod") selectPayment("paystack");
  }
  function selectPayment(v) {
    st.payment = v;
    $$(".payment-option").forEach((o) => { const on = o.dataset.payment === v; o.classList.toggle("selected", on); o.querySelector("input").checked = on; });
    renderTotals();
  }
  function renderItems() {
    $("#orderItems").innerHTML = Cart.items.map((i) => { const p = byId(i.id); return `
      <div class="order-item">
        <div class="order-item-thumb"><img src="${img(p)}" alt="${esc(p.name)}"><span class="order-item-qty">${i.qty}</span></div>
        <div class="order-item-info"><span class="order-item-name">${esc(p.name)}</span><span class="order-item-meta">${esc(i.color)} · EU ${i.size}</span></div>
        <span class="order-item-price">${money(p.price * i.qty)}</span>
      </div>`; }).join("");
  }
  function renderTotals() {
    const disc = Cart.discountAmount(), f = fee();
    $("#subtotal").textContent = money(Cart.subtotal());
    $("#deliveryFee").textContent = f ? money(f) : "Free";
    $("#discountRow").style.display = disc ? "flex" : "none";
    $("#discountAmount").textContent = `−${money(disc)}`;
    if (disc) $("#discountRow span").textContent = `Discount (${Cart.discount})`;
    $("#grandTotal").textContent = money(total());
    $("#placeOrderBtn").innerHTML = st.payment === "pod" ? `Place order — ${money(total())}` : `${I.lock} Pay ${money(total())} securely`;
    const tr = $$(".order-trust-item")[2]; if (tr) tr.lastChild.textContent = " Estimated delivery: " + method().eta;
  }

  $("#deliveryOptions").addEventListener("click", (e) => { const o = e.target.closest(".delivery-option"); if (!o) return; st.delivery = o.dataset.delivery; renderDelivery(); renderTotals(); });
  $$(".payment-option").forEach((o) => o.addEventListener("click", (e) => { e.preventDefault(); selectPayment(o.dataset.payment); }));
  $("#state").addEventListener("change", () => { renderDelivery(); renderTotals(); });

  // Promo
  if (Cart.discount) { $("#promoCode").value = Cart.discount; }
  $("#applyPromo").addEventListener("click", () => {
    const btn = $("#applyPromo"), code = $("#promoCode").value;
    if (Cart.applyCode(code)) { btn.textContent = "✓ Applied"; btn.style.background = "#0d9b6c"; renderDelivery(); renderTotals(); RF.toast("Discount applied — nice!"); }
    else if (code.trim()) { RF.toast("That code isn't valid. Try WELCOME10."); $("#promoCode").focus(); }
  });

  // Validation
  const rules = {
    firstName: (v) => v.trim().length > 1, lastName: (v) => v.trim().length > 1,
    email: (v) => /^\S+@\S+\.\S+$/.test(v.trim()),
    phone: (v) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, "")),
    address: (v) => v.trim().length > 4, city: (v) => v.trim().length > 1, state: (v) => !!v
  };
  $("#phone").closest(".form-field").querySelector(".error-msg").textContent = "Enter a valid Nigerian number, e.g. 0801 234 5678";
  const check = (el) => { const ok = rules[el.id](el.value); el.closest(".form-field").classList.toggle("has-error", !ok); el.classList.toggle("error", !ok); return ok; };
  Object.keys(rules).forEach((k) => { const el = $("#" + k); el.addEventListener("blur", () => el.value && check(el)); el.addEventListener("input", () => el.classList.contains("error") && check(el)); el.addEventListener("change", () => el.classList.contains("error") && check(el)); });
  $$(".step-edit").forEach((a) => a.remove());

  // Place order
  $("#placeOrderBtn").addEventListener("click", () => {
    const bad = Object.keys(rules).map((k) => $("#" + k)).filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); bad[0].scrollIntoView({ behavior: "smooth", block: "center" }); RF.toast("Please complete the highlighted fields"); return; }
    const v = (k) => $("#" + k).value.trim();
    const customer = { firstName: v("firstName"), lastName: v("lastName"), email: v("email"), phone: v("phone"), address: v("address"), city: v("city"), state: v("state"), delivery: st.delivery };
    store.set("customer", customer);
    const ref = "RF-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 4).toUpperCase();
    const order = { ref, customer, method: method().label, eta: method().eta, payment: st.payment, items: Cart.items.map((i) => ({ ...i, name: byId(i.id).name, price: byId(i.id).price })), subtotal: Cart.subtotal(), discount: Cart.discountAmount(), delivery: fee(), total: total(), date: new Date().toISOString() };
    const finish = (status) => { order.status = status; store.set("lastOrder", order); Cart.clear(); showSuccess(order); };

    if (st.payment === "pod") return finish("Pay on delivery");
    const btn = $("#placeOrderBtn"); btn.disabled = true; btn.textContent = "Opening secure payment…";
    const demo = /x{10}/.test(CFG.paystackPublicKey) || !/^pk_(live|test)_/.test(CFG.paystackPublicKey);
    if (demo || !window.PaystackPop) { setTimeout(() => finish(demo ? "Paid (demo mode)" : "Paid"), 900); return; }
    PaystackPop.setup({
      key: CFG.paystackPublicKey, email: customer.email, amount: order.total * 100, currency: "NGN", ref,
      metadata: { custom_fields: [{ display_name: "Phone", variable_name: "phone", value: customer.phone }, { display_name: "Items", variable_name: "items", value: order.items.map((i) => `${i.name} EU${i.size} x${i.qty}`).join(", ") }] },
      callback: (r) => finish("Paid · " + r.reference),
      onClose: () => { btn.disabled = false; renderTotals(); RF.toast("Payment window closed — your cart is saved."); }
    }).openIframe();
  });

  function showSuccess(o) {
    $("#checkoutWrap").style.display = "none";
    const s = $("#checkoutSuccess");
    s.classList.add("visible");
    $("#orderIdDisplay").textContent = `Order #${o.ref}`;
    s.querySelector("h2").textContent = `Thank you, ${o.customer.firstName}!`;
    s.querySelector("p").innerHTML = `We've received your order and will confirm it on WhatsApp (<b>${esc(o.customer.phone)}</b>) shortly. ${o.payment === "pod" ? "Please have cash or transfer ready on delivery." : ""}`;
    const lines = o.items.map((i) => `• ${i.name} (${i.color}, EU ${i.size}) × ${i.qty}`).join("\n");
    const msg = `Hi Rory Footwear! I just placed order ${o.ref}.\n${lines}\nTotal: ${money(o.total)} (${o.status})\nDelivery: ${o.method} — ${o.customer.address}, ${o.customer.city}, ${o.customer.state}\nName: ${o.customer.firstName} ${o.customer.lastName}`;
    s.querySelector("div[style*='flex']").insertAdjacentHTML("beforebegin", `
      <div style="text-align:left;background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1.1rem 1.25rem;margin:0 auto 1.25rem;max-width:460px;font-size:.9rem">
        ${o.items.map((i) => `<div style="display:flex;justify-content:space-between;gap:1rem;padding:.25rem 0"><span>${esc(i.name)} · EU ${i.size} × ${i.qty}</span><b>${money(i.price * i.qty)}</b></div>`).join("")}
        <div style="display:flex;justify-content:space-between;padding:.25rem 0;color:var(--ink-soft)"><span>Delivery · ${esc(o.method)}</span><span>${o.delivery ? money(o.delivery) : "Free"}</span></div>
        ${o.discount ? `<div style="display:flex;justify-content:space-between;padding:.25rem 0;color:#0d9b6c"><span>Discount</span><span>−${money(o.discount)}</span></div>` : ""}
        <div style="display:flex;justify-content:space-between;padding-top:.5rem;margin-top:.35rem;border-top:1px dashed var(--rule-strong);font-family:var(--font-display);font-weight:800"><span>Total</span><span>${money(o.total)}</span></div>
        <p style="color:var(--ink-muted);font-size:.8rem;margin-top:.5rem">${esc(o.status)} · Est. delivery: ${esc(o.eta)}</p>
      </div>
      <a class="btn btn-lg" style="background:#25d366;color:#fff;margin-bottom:.9rem" target="_blank" rel="noopener" href="${waLink(msg)}">${I.wa} Send order to us on WhatsApp</a>`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderItems(); renderDelivery(); selectPayment("paystack");
};
