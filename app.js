/* VoltCart - shared data + logic */
const PRODUCTS = [
  {id:1,name:"AirPods Style Wireless Earbuds",cat:"Earbuds",price:3499,old:4999,rating:4.5,reviews:218,emoji:"🎧",g:"g1",desc:"Crystal clear sound with deep bass and touch controls.",specs:["Bluetooth 5.3","24 hours total playtime","Touch controls","Charging case included"]},
  {id:2,name:"Noise Cancelling Earbuds Pro",cat:"Earbuds",price:6999,old:8999,rating:4.7,reviews:164,emoji:"🎧",g:"g5",desc:"Active noise cancellation for calls, music and travel.",specs:["Active Noise Cancellation","30 hours total playtime","IPX5 water resistant","Fast charging"]},
  {id:3,name:"10000mAh Slim Power Bank",cat:"Power Banks",price:2999,old:3799,rating:4.4,reviews:342,emoji:"🔋",g:"g2",desc:"Pocket-size power bank that charges your phone up to 2 times.",specs:["10000mAh capacity","Dual USB output","LED battery indicator","Type-C input"]},
  {id:4,name:"20000mAh Fast Charge Power Bank",cat:"Power Banks",price:5499,old:6999,rating:4.6,reviews:189,emoji:"🔋",g:"g3",desc:"High capacity with 22.5W fast charging for all your devices.",specs:["20000mAh capacity","22.5W fast charging","3 output ports","Digital display"]},
  {id:5,name:"25W Fast Mobile Charger",cat:"Chargers",price:1499,old:1999,rating:4.5,reviews:410,emoji:"🔌",g:"g6",desc:"Compact wall adapter with super fast charging support.",specs:["25W output","USB Type-C port","Overheat protection","Universal compatibility"]},
  {id:6,name:"65W GaN Dual Port Charger",cat:"Chargers",price:3999,old:4999,rating:4.8,reviews:97,emoji:"🔌",g:"g4",desc:"Charge a laptop and phone together with one tiny GaN charger.",specs:["65W total output","2 x Type-C ports","GaN technology","Foldable plug"]},
  {id:7,name:"Type-C Fast Charging Cable 1m",cat:"Cables",price:599,old:899,rating:4.3,reviews:520,emoji:"🔗",g:"g1",desc:"Braided durable cable for fast charging and data transfer.",specs:["1 metre length","Braided nylon","60W support","480Mbps data"]},
  {id:8,name:"3-in-1 Charging Cable",cat:"Cables",price:899,old:1299,rating:4.2,reviews:276,emoji:"🔗",g:"g3",desc:"Lightning, Type-C and Micro USB in a single cable.",specs:["3 connectors","1.2 metre length","2.4A output","Tangle free"]},
  {id:9,name:"Portable Bluetooth Speaker",cat:"Speakers",price:4299,old:5499,rating:4.6,reviews:130,emoji:"🔊",g:"g2",desc:"Powerful 360° sound with waterproof body for outdoor fun.",specs:["10W output","12 hours playtime","IPX6 waterproof","Built-in mic"]},
  {id:10,name:"Smart Watch Active Series",cat:"Wearables",price:7499,old:9999,rating:4.5,reviews:88,emoji:"⌚",g:"g5",desc:"Track steps, heart rate and notifications from your wrist.",specs:["1.8 inch display","Heart rate monitor","7 days battery","Sleep tracking"]},
  {id:11,name:"Wireless Charging Pad 15W",cat:"Chargers",price:2299,old:2999,rating:4.4,reviews:145,emoji:"📱",g:"g4",desc:"Just place your phone and charge, no cables needed.",specs:["15W wireless output","Qi compatible","Anti-slip surface","LED indicator"]},
  {id:12,name:"Phone Stand with Ring Light",cat:"Accessories",price:1799,old:2499,rating:4.3,reviews:76,emoji:"💡",g:"g6",desc:"Adjustable stand with ring light for video calls and content.",specs:["Adjustable height","3 light modes","Rechargeable battery","Fits all phones"]}
];
const CATEGORIES = [
  {name:"Earbuds",ico:"🎧"},{name:"Power Banks",ico:"🔋"},{name:"Chargers",ico:"🔌"},
  {name:"Cables",ico:"🔗"},{name:"Speakers",ico:"🔊"},{name:"Wearables",ico:"⌚"}
];

const fmt = n => "Rs. " + n.toLocaleString("en-PK");
const $ = (s, r=document) => r.querySelector(s);
const getP = id => PRODUCTS.find(p => p.id === Number(id));
const disc = p => Math.round((1 - p.price / p.old) * 100);
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* Cart (localStorage) */
const Cart = {
  get(){ try{ return JSON.parse(localStorage.getItem("voltcart_cart")) || []; }catch(e){ return []; } },
  save(c){ localStorage.setItem("voltcart_cart", JSON.stringify(c)); updateBadge(); },
  add(id, qty=1){
    const c = this.get(); const it = c.find(i => i.id === id);
    if(it) it.qty += qty; else c.push({id, qty});
    this.save(c);
  },
  setQty(id, qty){ let c = this.get(); const it = c.find(i => i.id === id); if(it){ it.qty = Math.max(1, Math.min(10, qty)); } this.save(c); },
  remove(id){ this.save(this.get().filter(i => i.id !== id)); },
  clear(){ this.save([]); },
  count(){ return this.get().reduce((s,i) => s + i.qty, 0); },
  subtotal(){ return this.get().reduce((s,i) => s + getP(i.id).price * i.qty, 0); }
};
function getDiscount(){ return localStorage.getItem("voltcart_coupon") === "SAVE10" ? 0.10 : 0; }
function shipping(sub){ return sub === 0 || sub >= 5000 ? 0 : 200; }

function updateBadge(){ const b = $("#cart-badge"); if(b){ const n = Cart.count(); b.textContent = n; b.style.display = n ? "grid" : "none"; } }
function toast(msg){
  let t = $("#toast"); if(!t){ t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2200);
}

/* Header + footer */
function renderLayout(active){
  const links = [["index.html","Home","home"],["products.html","Shop","shop"],["cart.html","Cart","cart"],["login.html","Login","login"]];
  $("#header").outerHTML = `
  <header class="header" role="banner"><div class="container">
    <a class="logo" href="index.html"><span>⚡</span>VoltCart</a>
    <nav class="nav" id="nav" aria-label="Main navigation">
      ${links.map(l => `<a href="${l[0]}" class="${l[2]===active?'active':''}">${l[1]}</a>`).join("")}
    </nav>
    <div class="header-actions">
      <a class="icon-btn" href="products.html" title="Search products" aria-label="Search">🔍</a>
      <a class="icon-btn" href="cart.html" title="View cart" aria-label="Cart">🛒<span class="badge" id="cart-badge">0</span></a>
      <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu">☰</button>
    </div>
  </div></header>`;
  $("#footer").outerHTML = `<footer class="footer"><div class="container"><p><b>⚡ VoltCart</b> – Your trusted electronics accessories store</p><p style="margin-top:6px;font-size:.85rem">HCI Individual Semester Project · Online Shopping Application</p></div></footer>`;
  $("#menu-toggle").onclick = () => $("#nav").classList.toggle("open");
  updateBadge();
}

function productCard(p){
  return `<article class="card">
    <a href="product.html?id=${p.id}" class="card-img ${p.g}" aria-label="${p.name}">${p.emoji}<span class="discount">-${disc(p)}%</span></a>
    <div class="card-body">
      <span class="cat-name">${p.cat}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="stars">${stars(p.rating)} <small>${p.rating} (${p.reviews})</small></div>
      <div class="price"><b>${fmt(p.price)}</b><s>${fmt(p.old)}</s></div>
      <button class="btn btn-primary" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
    </div></article>`;
}
function addToCart(id, qty=1){ Cart.add(id, qty); toast("✅ " + getP(id).name + " added to cart"); }

/* ---------- Page scripts ---------- */
function initHome(){
  renderLayout("home");
  $("#cats").innerHTML = CATEGORIES.map(c => `<a class="cat" href="products.html?cat=${encodeURIComponent(c.name)}"><span class="ico">${c.ico}</span><b>${c.name}</b></a>`).join("");
  $("#featured").innerHTML = PRODUCTS.slice(0,4).map(productCard).join("");
  $("#deals").innerHTML = PRODUCTS.slice(4,8).map(productCard).join("");
}

function initShop(){
  renderLayout("shop");
  const params = new URLSearchParams(location.search);
  let cat = params.get("cat") || "All";
  const cats = ["All", ...CATEGORIES.map(c => c.name), "Accessories"];
  $("#chips").innerHTML = cats.map(c => `<button class="chip" data-c="${c}">${c}</button>`).join("");
  function draw(){
    const q = $("#search").value.trim().toLowerCase(), s = $("#sort").value;
    let list = PRODUCTS.filter(p => (cat === "All" || p.cat === cat) && (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));
    if(s === "low") list.sort((a,b) => a.price - b.price);
    if(s === "high") list.sort((a,b) => b.price - a.price);
    if(s === "rating") list.sort((a,b) => b.rating - a.rating);
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.c === cat));
    $("#count").textContent = list.length + " product" + (list.length===1?"":"s") + " found";
    $("#grid").innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1"><div class="big">🔎</div><h3>No products found</h3><p>Try a different keyword or category.</p></div>`;
  }
  $("#chips").onclick = e => { if(e.target.dataset.c){ cat = e.target.dataset.c; draw(); } };
  $("#search").oninput = draw; $("#sort").onchange = draw; draw();
}

function initProduct(){
  renderLayout("shop");
  const p = getP(new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
  document.title = p.name + " | VoltCart";
  let qty = 1;
  $("#detail").innerHTML = `
    <div class="detail-img ${p.g}">${p.emoji}</div>
    <div>
      <span class="cat-name" style="color:var(--muted)">${p.cat}</span>
      <h1>${p.name}</h1>
      <div class="stars">${stars(p.rating)} <small>${p.rating} · ${p.reviews} reviews</small></div>
      <div class="price" style="margin:10px 0"><b>${fmt(p.price)}</b><s>${fmt(p.old)}</s><span class="discount" style="position:static">-${disc(p)}%</span></div>
      <p style="color:var(--muted)">${p.desc}</p>
      <ul>${p.specs.map(s => `<li>${s}</li>`).join("")}</ul>
      <p class="stock">● In stock – ships in 24 hours</p>
      <div class="buy-row">
        <div class="qty"><button id="minus" aria-label="Decrease">−</button><span id="q">1</span><button id="plus" aria-label="Increase">+</button></div>
        <button class="btn btn-primary" id="add">🛒 Add to Cart</button>
        <button class="btn btn-outline" id="buy">Buy Now</button>
      </div>
    </div>`;
  $("#bc").textContent = p.name;
  $("#minus").onclick = () => { qty = Math.max(1, qty-1); $("#q").textContent = qty; };
  $("#plus").onclick = () => { qty = Math.min(10, qty+1); $("#q").textContent = qty; };
  $("#add").onclick = () => addToCart(p.id, qty);
  $("#buy").onclick = () => { Cart.add(p.id, qty); location.href = "cart.html"; };
  $("#related").innerHTML = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0,4).map(productCard).join("");
}

function summaryHTML(){
  const sub = Cart.subtotal(), d = Math.round(sub * getDiscount()), sh = shipping(sub);
  return `<div class="summary-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    ${d ? `<div class="summary-row" style="color:var(--success)"><span>Discount (SAVE10)</span><span>- ${fmt(d)}</span></div>` : ""}
    <div class="summary-row"><span>Shipping</span><span>${sh ? fmt(sh) : "FREE"}</span></div>
    <div class="summary-row total"><span>Total</span><span>${fmt(sub - d + sh)}</span></div>`;
}

function initCart(){
  renderLayout("cart");
  function draw(){
    const c = Cart.get();
    if(!c.length){
      $("#cart-area").innerHTML = `<div class="panel empty"><div class="big">🛒</div><h3>Your cart is empty</h3><p style="margin:8px 0 18px">Looks like you haven't added anything yet.</p><a class="btn btn-primary" href="products.html">Start Shopping</a></div>`;
      return;
    }
    $("#cart-area").innerHTML = `<div class="layout">
      <div class="panel">${c.map(i => { const p = getP(i.id); return `<div class="cart-item">
        <div class="cart-thumb ${p.g}">${p.emoji}</div>
        <div><h4>${p.name}</h4><small style="color:var(--muted)">${fmt(p.price)} each</small><br>
          <div class="qty" style="margin-top:8px"><button onclick="chg(${p.id},-1)" aria-label="Decrease">−</button><span>${i.qty}</span><button onclick="chg(${p.id},1)" aria-label="Increase">+</button></div>
          <br><button class="remove" onclick="rem(${p.id})">🗑 Remove</button></div>
        <div class="line-total">${fmt(p.price * i.qty)}</div></div>`; }).join("")}
        <div style="margin-top:14px"><a href="products.html" style="color:var(--primary);font-weight:600">← Continue shopping</a></div></div>
      <aside class="panel"><h3 style="margin-bottom:10px">Order Summary</h3>
        <div class="coupon"><input id="coupon" placeholder="Coupon code (try SAVE10)" value="${getDiscount() ? 'SAVE10' : ''}"><button class="btn btn-outline" style="padding:10px 16px" onclick="applyCoupon()">Apply</button></div>
        <div id="sum">${summaryHTML()}</div>
        <p style="font-size:.82rem;color:var(--muted);margin:8px 0 14px">Free delivery on orders above Rs. 5,000</p>
        <a class="btn btn-primary btn-block" href="checkout.html">Proceed to Checkout →</a></aside></div>`;
  }
  window.chg = (id, d) => { const it = Cart.get().find(i => i.id === id); Cart.setQty(id, it.qty + d); draw(); };
  window.rem = id => { Cart.remove(id); draw(); toast("🗑 Item removed from cart"); };
  window.applyCoupon = () => {
    const v = $("#coupon").value.trim().toUpperCase();
    if(v === "SAVE10"){ localStorage.setItem("voltcart_coupon", "SAVE10"); toast("🎉 Coupon applied: 10% off"); }
    else { localStorage.removeItem("voltcart_coupon"); toast("❌ Invalid coupon code"); }
    draw();
  };
  draw();
}

function initCheckout(){
  renderLayout("cart");
  if(!Cart.get().length){ location.replace("cart.html"); return; }
  $("#sum").innerHTML = Cart.get().map(i => { const p = getP(i.id); return `<div class="summary-row"><span>${p.emoji} ${p.name} × ${i.qty}</span><span>${fmt(p.price*i.qty)}</span></div>`; }).join("") + summaryHTML();
  const rules = {
    name: v => v.trim().length >= 3,
    phone: v => /^(\+92|0)?3\d{9}$/.test(v.replace(/[\s-]/g,"")),
    email: v => /^\S+@\S+\.\S+$/.test(v),
    city: v => v.trim().length >= 2,
    address: v => v.trim().length >= 8
  };
  Object.keys(rules).forEach(k => { const el = $("#" + k); el.addEventListener("blur", () => el.closest(".field").classList.toggle("invalid", !rules[k](el.value))); el.addEventListener("input", () => el.closest(".field").classList.remove("invalid")); });
  $("#checkout-form").onsubmit = e => {
    e.preventDefault(); let ok = true;
    Object.keys(rules).forEach(k => { const el = $("#" + k), good = rules[k](el.value); el.closest(".field").classList.toggle("invalid", !good); if(!good) ok = false; });
    if(!ok){ toast("⚠️ Please fix the highlighted fields"); return; }
    const sub = Cart.subtotal(), d = Math.round(sub * getDiscount()), total = sub - d + shipping(sub);
    const order = {no: "VC-" + Math.floor(100000 + Math.random()*900000), total, name: $("#name").value.trim(), city: $("#city").value.trim(), pay: document.querySelector("input[name=pay]:checked").value, items: Cart.count()};
    sessionStorage.setItem("voltcart_order", JSON.stringify(order));
    Cart.clear(); localStorage.removeItem("voltcart_coupon");
    location.href = "success.html";
  };
}

function initSuccess(){
  renderLayout("cart");
  let o = null; try{ o = JSON.parse(sessionStorage.getItem("voltcart_order")); }catch(e){}
  if(!o){ location.replace("index.html"); return; }
  $("#order-info").innerHTML = `<div class="order-no">Order # ${o.no}</div>
    <p>Thank you, <b>${o.name}</b>! Your order of <b>${o.items} item(s)</b> totaling <b>${fmt(o.total)}</b> will be delivered to <b>${o.city}</b> in 2–4 working days.</p>
    <p style="color:var(--muted);margin-top:6px">Payment method: ${o.pay}</p>`;
}

function initLogin(){
  renderLayout("login");
  let mode = "login";
  const setMode = m => {
    mode = m;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.m === m));
    $("#name-field").style.display = m === "signup" ? "block" : "none";
    $("#auth-btn").textContent = m === "signup" ? "Create Account" : "Login";
    $("#auth-title").textContent = m === "signup" ? "Create your account" : "Welcome back 👋";
  };
  document.querySelectorAll(".tab").forEach(t => t.onclick = () => setMode(t.dataset.m));
  $("#auth-form").onsubmit = e => {
    e.preventDefault();
    const em = $("#a-email"), pw = $("#a-pass"); let ok = true;
    const eOk = /^\S+@\S+\.\S+$/.test(em.value), pOk = pw.value.length >= 6;
    em.closest(".field").classList.toggle("invalid", !eOk); pw.closest(".field").classList.toggle("invalid", !pOk);
    if(!eOk || !pOk) return;
    toast(mode === "signup" ? "🎉 Account created successfully!" : "✅ Logged in successfully!");
    setTimeout(() => location.href = "index.html", 1200);
  };
  setMode("login");
}
