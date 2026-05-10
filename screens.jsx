// Catalog, product card, product detail, cart, confirm modal, success
const { useState: useS2, useEffect: useE2, useMemo: useM2 } = React;

function ProductCard({ product, onOpen, onAdd, seed = 1 }) {
  const [bump, setBump] = useS2(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd();
    setBump(true);
    setTimeout(() => setBump(false), 400);
  };
  return (
    <article className={`pcard ${bump ? 'bump' : ''}`} onClick={onOpen}>
      <div className={`pcard-photo ${product.image ? 'has-img' : ''}`} style={{ background: `linear-gradient(160deg, ${product.color}, ${product.color}dd)` }}>
        {product.image
          ? <img className="real-photo" src={product.image} alt={product.name} />
          : <CheeseChip color={product.color} holes={product.holes} seed={seed} size={170} />}
        {product.sale && <span className="badge sale">−15%</span>}
        {product.popularity >= 92 && !product.sale && <span className="badge top">★ хіт</span>}
        <button className="quick-add" onClick={handleAdd} aria-label="додати в кошик">+</button>
      </div>
      <div className="pcard-body">
        <div className="pcard-row">
          <h3 className="pcard-name serif">{product.name}</h3>
          <div className="pcard-price">{fmt(priceFor(product, 100))} <span>грн / 100 г</span></div>
        </div>
        <p className="pcard-desc">{product.desc}</p>
        <div className="pcard-foot">
          <span className="chip">{product.type}</span>
          <span className="chip ghost">{product.producer}</span>
        </div>
      </div>
    </article>
  );
}

// ---------- Catalog ----------
function Catalog({ go, tone, addToCart, search }) {
  const [filters, setFilters] = useS2({
    types: [],
    producers: [],
    weight: 'any',
    sortBy: 'popular',
    onlySale: false,
    priceMax: 400,
  });

  useE2(() => {
    const onSale = () => setFilters(f => ({ ...f, onlySale: true }));
    window.addEventListener('sirnyk:filter-sale', onSale);
    return () => window.removeEventListener('sirnyk:filter-sale', onSale);
  }, []);

  const toggleArr = (key, val) => setFilters(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
  }));

  const clearAll = () => setFilters({ types: [], producers: [], weight: 'any', sortBy: 'popular', onlySale: false, priceMax: 400 });

  const visible = useM2(() => {
    let list = PRODUCTS.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.type.includes(q));
    }
    if (filters.types.length) list = list.filter(p => filters.types.includes(p.type));
    if (filters.producers.length) list = list.filter(p => filters.producers.includes(p.producer));
    if (filters.onlySale) list = list.filter(p => p.sale);
    list = list.filter(p => priceFor(p, 100) <= filters.priceMax);
    if (filters.sortBy === 'popular') list.sort((a, b) => b.popularity - a.popularity);
    if (filters.sortBy === 'price-asc') list.sort((a, b) => priceFor(a, 100) - priceFor(b, 100));
    if (filters.sortBy === 'price-desc') list.sort((a, b) => priceFor(b, 100) - priceFor(a, 100));
    if (filters.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    return list;
  }, [filters, search]);

  return (
    <main className="catalog">
      <section className="cat-banner">
        <div className="cat-banner-photo" ref={(el) => {
          if (el && !el.__pInit) {
            el.__pInit = true;
            const onScroll = () => {
              const r = el.getBoundingClientRect();
              const vh = window.innerHeight || 800;
              const center = r.top + r.height / 2;
              const t = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
              const img = el.querySelector('img');
              if (img) img.style.transform = `translateY(${t * -28}px) scale(1.08)`;
              el.style.setProperty('--steam-y', `${t * -10}px`);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          }
        }}>
          <div className="cat-banner-frame">
            <img src="assets/bath.jpg" alt="модель у ванні з сиром" />
            <span className="cb-steam cb-steam-1">♨</span>
            <span className="cb-steam cb-steam-2">♨</span>
            <span className="cb-steam cb-steam-3">♨</span>
          </div>
          {/* Sticker overlays */}
          <div className="cb-sticker cb-sticker-room">
            <span className="cb-st-small">кімната №7</span>
            <span className="cb-st-big serif">не стукати</span>
          </div>
          <div className="cb-sticker cb-sticker-spa">
            <span className="cb-st-small">cheese spa · паспорт процедури</span>
            <span className="cb-st-line"><b>pH</b> розсолу <i>6.8</i></span>
            <span className="cb-st-line"><b>t°</b> ванни <i>36.6°</i></span>
            <span className="cb-st-line"><b>сорт</b> <i>Емменталь, тертий</i></span>
          </div>
          <div className="cb-sticker cb-sticker-price">
            <span className="cb-st-small">прайс</span>
            <span className="cb-st-big serif">2400 <small>грн / 40 хв</small></span>
            <span className="cb-st-strike">−15% за бронь з понеділка</span>
          </div>
          <div className="cb-arrow cb-arrow-1">
            <svg viewBox="0 0 90 60" width="90" height="60"><path d="M5 40 Q 30 5, 80 25" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M75 18 L 82 26 L 72 30" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>це для дегустації, не їсти з води</span>
          </div>
          <div className="cb-arrow cb-arrow-2">
            <span>вино за окрему плату</span>
            <svg viewBox="0 0 90 60" width="90" height="60"><path d="M85 50 Q 50 60, 15 25" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M22 18 L 12 24 L 18 32" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
          </div>
        </div>
        <div className="cat-banner-text">
          <span className="eyebrow"><span className="eyebrow-dot" />Каталог · {visible.length} позицій</span>
          <h1 className="serif display-md">{COPY.catalog.banner[tone]}</h1>
          <p className="lede-sm">{COPY.catalog.sub[tone]}</p>
          <div className="cat-banner-marks">
            <span>♨ свіжий завіз щочетверга</span>
            <span>✦ 7 ферм</span>
            <span>◐ {tone === 'absurd' ? 'плісняв\u02BCя як стиль життя' : 'витримка від 30 днів'}</span>
          </div>
        </div>
      </section>

      <section className="cat-shell">
        <aside className="filters">
          <div className="filter-head">
            <h3 className="serif">Фільтри</h3>
            <button className="link-btn" onClick={clearAll}>скинути</button>
          </div>

          <div className="filter-group">
            <div className="filter-label">Тип сиру</div>
            <div className="filter-chips">
              {TYPES.map(t => (
                <button key={t} className={`fchip ${filters.types.includes(t) ? 'on' : ''}`} onClick={() => toggleArr('types', t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-label">Виробник</div>
            <div className="filter-list">
              {PRODUCERS.map(p => (
                <label key={p} className="fcheck">
                  <input type="checkbox" checked={filters.producers.includes(p)} onChange={() => toggleArr('producers', p)} />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-label">Ціна (за 100 г) — до {filters.priceMax} грн</div>
            <input type="range" min="35" max="400" step="5" value={filters.priceMax} onChange={(e) => setFilters(f => ({ ...f, priceMax: +e.target.value }))} />
          </div>

          <div className="filter-group">
            <label className="fcheck big">
              <input type="checkbox" checked={filters.onlySale} onChange={(e) => setFilters(f => ({ ...f, onlySale: e.target.checked }))} />
              <span>Лише акції</span>
            </label>
          </div>

          <div className="filter-foot">{tone === 'absurd' ? '* фільтри працюють. чесно.' : '* фільтри активні'}</div>
        </aside>

        <section className="cat-main">
          <div className="cat-toolbar">
            <div className="cat-count">{visible.length} <span>сортів</span></div>
            <div className="cat-sort">
              <span>сортувати:</span>
              {[['popular', 'популярні'], ['price-asc', 'ціна ↑'], ['price-desc', 'ціна ↓'], ['name', 'А–Я']].map(([k, l]) => (
                <button key={k} className={filters.sortBy === k ? 'on' : ''} onClick={() => setFilters(f => ({ ...f, sortBy: k }))}>{l}</button>
              ))}
            </div>
          </div>
          {visible.length === 0 ? (
            <div className="empty">
              <CheeseChip seed={11} size={140} />
              <h3 className="serif">Сир сховався.</h3>
              <p>{tone === 'absurd' ? 'Ймовірно, образився на фільтри. Скинь їх — він повернеться.' : 'Спробуй скинути частину фільтрів.'}</p>
              <button className="btn-primary sm" onClick={clearAll}>Скинути фільтри</button>
            </div>
          ) : (
            <div className="cards">
              {visible.map((p, i) => (
                <ProductCard key={p.id} product={p} seed={i + 3}
                  onOpen={() => window.__openProduct(p.id)}
                  onAdd={() => addToCart(p, 250)} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

// ---------- Product detail ----------
function ProductDetail({ product, go, addToCart, tone, close }) {
  const [weight, setWeight] = useS2(250);
  const [qty, setQty] = useS2(1);
  const total = priceFor(product, weight) * qty;

  const related = PRODUCTS.filter(p => p.id !== product.id && (p.type === product.type || p.producer === product.producer)).slice(0, 4);

  return (
    <div className="modal-shell" onClick={close}>
      <div className="modal product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>×</button>
        <div className="pdetail">
          <div className={`pdetail-photo ${product.image ? 'has-img' : ''}`} style={{ background: `linear-gradient(160deg, ${product.color}, ${product.color}cc)` }}>
            {product.image
              ? <img className="real-photo" src={product.image} alt={product.name} />
              : <CheeseChip color={product.color} holes={product.holes} size={300} seed={42} />}
            {product.sale && <span className="badge sale big">−15%</span>}
            <div className="pd-tags">
              <span>{product.type}</span>
              <span>{product.producer}</span>
            </div>
          </div>
          <div className="pdetail-body">
            <div className="eyebrow"><span className="eyebrow-dot" />картка сиру</div>
            <h2 className="serif display-sm">{product.name}</h2>
            <p className="pd-desc">{product.desc}</p>

            <div className="pd-row">
              <div className="pd-row-label">Фасування</div>
              <div className="pd-options">
                {WEIGHT_OPTIONS.map(w => (
                  <button key={w.id} className={`opt ${weight === w.id ? 'on' : ''}`} onClick={() => setWeight(w.id)}>
                    <span>{w.label}</span>
                    <small>{fmt(priceFor(product, w.id))} грн</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="pd-row">
              <div className="pd-row-label">Кількість</div>
              <div className="qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="pd-meta">
              <div><strong>Зрілість</strong><span>{product.popularity > 85 ? 'популярний' : 'нішевий'}</span></div>
              <div><strong>Молоко</strong><span>{product.type === 'твердий' ? 'коров\u02BCяче' : product.type === 'м\u02BCякий' ? 'буфала / коз.' : 'зміш.'}</span></div>
              <div><strong>Спосіб</strong><span>{product.type === 'копчений' ? 'холодне коптіння' : 'визрівання'}</span></div>
            </div>

            <div className="pd-foot">
              <div className="pd-total">
                <span>Разом</span>
                <strong>{fmt(total)} грн</strong>
              </div>
              <button className="btn-primary" onClick={() => { addToCart(product, weight, qty); close(); }}>
                В кошик →
              </button>
            </div>

            <p className="pd-note">{tone === 'absurd' ? FOOTNOTES[1] : '* доставка від 1 дня по Києву, 1–2 дні Україною'}</p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related">
            <h4 className="serif">З цим обирають</h4>
            <div className="related-row">
              {related.map((r, i) => (
                <button key={r.id} className="related-card" onClick={() => window.__openProduct(r.id)}>
                  <div className={`related-photo ${r.image ? 'has-img' : ''}`} style={{ background: r.color }}>
                    {r.image
                      ? <img className="real-photo" src={r.image} alt={r.name} />
                      : <CheeseChip color={r.color} holes={r.holes} seed={i + 50} size={100} />}
                  </div>
                  <div>
                    <div className="serif">{r.name}</div>
                    <small>{fmt(priceFor(r, 100))} грн / 100 г</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Cart ----------
function Cart({ go, items, setItems, tone, openConfirm }) {
  const updateQty = (idx, delta) => setItems(arr => arr.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  const removeItem = (idx) => setItems(arr => arr.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, it) => s + priceFor(it.product, it.weight) * it.qty, 0);
  const delivery = subtotal > 800 ? 0 : 80;
  const total = subtotal + delivery;

  return (
    <main className="cart-page">
      <div className="cart-head">
        <span className="eyebrow"><span className="eyebrow-dot" />Кошик</span>
        <h1 className="serif display-md">Усе, що ти {tone === 'absurd' ? 'зміг втримати' : 'обрав'}.</h1>
      </div>
      {items.length === 0 ? (
        <div className="cart-empty">
          <CheeseChip seed={31} size={180} />
          <h3 className="serif">Тут поки тільки повітря.</h3>
          <p>{tone === 'absurd' ? 'Сир чекає у каталозі. Дуже терпляче. З легким сумом.' : 'Додай щось — і повертайся сюди.'}</p>
          <button className="btn-primary" onClick={() => go('catalog')}>До каталогу →</button>
        </div>
      ) : (
        <div className="cart-shell">
          <div className="cart-items">
            {items.map((it, i) => {
              const p = it.product;
              const w = WEIGHT_OPTIONS.find(x => x.id === it.weight);
              const line = priceFor(p, it.weight) * it.qty;
              return (
                <div key={i} className="cart-row">
                  <div className={`cart-thumb ${p.image ? 'has-img' : ''}`} style={{ background: p.color }}>
                    {p.image
                      ? <img className="real-photo" src={p.image} alt={p.name} />
                      : <CheeseChip color={p.color} holes={p.holes} seed={i + 60} size={80} />}
                  </div>
                  <div className="cart-info">
                    <div className="serif cart-name">{p.name}</div>
                    <div className="cart-meta">
                      <span>{w.label}</span>
                      <span>·</span>
                      <span>{p.producer}</span>
                      {p.sale && <span className="mini-sale">акція −15%</span>}
                    </div>
                  </div>
                  <div className="qty">
                    <button onClick={() => updateQty(i, -1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => updateQty(i, +1)}>+</button>
                  </div>
                  <div className="cart-line">{fmt(line)} грн</div>
                  <button className="cart-remove" onClick={() => removeItem(i)} aria-label="видалити">×</button>
                </div>
              );
            })}
          </div>
          <aside className="cart-summary">
            <h4 className="serif">Підсумок</h4>
            <div className="sum-row"><span>Товари</span><span>{fmt(subtotal)} грн</span></div>
            <div className="sum-row"><span>Доставка</span><span>{delivery === 0 ? 'безкоштовно' : `${delivery} грн`}</span></div>
            {delivery > 0 && <div className="sum-hint">{tone === 'absurd' ? `Ще ${fmt(800 - subtotal)} грн \u2014 і кур\u02BCєр обійме безкоштовно` : `Ще ${fmt(800 - subtotal)} грн до безкоштовної доставки`}</div>}
            <div className="sum-total"><span>Разом</span><strong>{fmt(total)} грн</strong></div>
            <button className="btn-primary big" onClick={openConfirm}>Оформити замовлення →</button>
            <p className="sum-note">{tone === 'absurd' ? FOOTNOTES[2] : '* остаточну ціну побачиш на оформленні'}</p>
          </aside>
        </div>
      )}
    </main>
  );
}

// ---------- Confirm modal (with photo 3) ----------
function ConfirmModal({ items, total, tone, onConfirm, onCancel }) {
  return (
    <div className="modal-shell" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-photo">
          <img src="assets/shop.jpg" alt="модель у магазині в костюмі сиру" />
          <div className="confirm-stamp">
            <span>FINAL</span>
            <small>{tone === 'absurd' ? 'до сирної комірки' : 'перевірка'}</small>
          </div>
        </div>
        <div className="confirm-body">
          <div className="eyebrow"><span className="eyebrow-dot" />останній крок</div>
          <h2 className="serif display-sm">{COPY.confirm.title[tone]}</h2>
          <p className="lede-sm">{COPY.confirm.sub[tone]}</p>

          <div className="confirm-items">
            {items.slice(0, 4).map((it, i) => {
              const w = WEIGHT_OPTIONS.find(x => x.id === it.weight);
              return (
                <div key={i} className="confirm-row">
                  <span className="dot" style={{ background: it.product.color }} />
                  <span className="serif">{it.product.name}</span>
                  <span className="thin">{w.label} × {it.qty}</span>
                  <span className="thin">{fmt(priceFor(it.product, it.weight) * it.qty)} грн</span>
                </div>
              );
            })}
            {items.length > 4 && <div className="confirm-row more">…і ще {items.length - 4} позицій</div>}
          </div>

          <div className="confirm-total">
            <span>До сплати</span>
            <strong>{fmt(total)} грн</strong>
          </div>

          <div className="confirm-ctas">
            <button className="btn-primary" onClick={onConfirm}>{COPY.confirm.yes[tone]} →</button>
            <button className="btn-ghost" onClick={onCancel}>{COPY.confirm.no[tone]}</button>
          </div>
          <p className="confirm-note">{tone === 'absurd' ? '* після цієї кнопки сир уже психологічно твій' : '* після підтвердження — переходимо до даних доставки'}</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Checkout form (after confirm) ----------
function Checkout({ go, items, total, tone, onPlace }) {
  const [form, setForm] = useS2({ name: '', phone: '', city: 'Київ', address: '', delivery: 'courier', payment: 'card', comment: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length >= 2 && form.phone.replace(/\D/g, '').length >= 9 && form.address.trim().length >= 3;

  return (
    <main className="checkout">
      <div className="cart-head">
        <span className="eyebrow"><span className="eyebrow-dot" />оформлення</span>
        <h1 className="serif display-md">{tone === 'absurd' ? 'Декілька полів — і сир в дорозі.' : 'Контактні дані та доставка.'}</h1>
      </div>
      <div className="checkout-shell">
        <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); if (valid) onPlace(form); }}>
          <div className="form-row two">
            <label><span>Ім\u02BCя</span><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Тарас" /></label>
            <label><span>Телефон</span><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+380 …" /></label>
          </div>
          <div className="form-row two">
            <label><span>Місто</span><input value={form.city} onChange={e => set('city', e.target.value)} /></label>
            <label><span>Адреса / відділення</span><input value={form.address} onChange={e => set('address', e.target.value)} placeholder="вул. Сирна, 7" /></label>
          </div>

          <div className="form-group">
            <div className="form-label">Доставка</div>
            <div className="seg">
              {[['courier', 'кур\u02BCєр'], ['pickup', 'самовивіз'], ['novaposhta', 'Нова пошта'], ['ukrposhta', 'Укрпошта']].map(([k, l]) => (
                <button type="button" key={k} className={form.delivery === k ? 'on' : ''} onClick={() => set('delivery', k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Оплата</div>
            <div className="seg">
              {[['card', 'картка онлайн'], ['cash', 'готівка'], ['onget', 'при отриманні']].map(([k, l]) => (
                <button type="button" key={k} className={form.payment === k ? 'on' : ''} onClick={() => set('payment', k)}>{l}</button>
              ))}
            </div>
          </div>

          <label className="full">
            <span>Коментар {tone === 'absurd' ? '(побажання сиру)' : '(не обов\u02BCязково)'}</span>
            <textarea value={form.comment} onChange={e => set('comment', e.target.value)} rows="3" placeholder={tone === 'absurd' ? 'хочу, щоб сир був смутний, але впевнений у собі' : 'час доставки, побажання…'} />
          </label>

          <button type="submit" className="btn-primary big" disabled={!valid}>Підтвердити замовлення · {fmt(total)} грн →</button>
        </form>

        <aside className="checkout-summary">
          <h4 className="serif">Замовлення</h4>
          {items.map((it, i) => {
            const w = WEIGHT_OPTIONS.find(x => x.id === it.weight);
            return (
              <div key={i} className="cs-row">
                <span className="dot" style={{ background: it.product.color }} />
                <span>{it.product.name}</span>
                <span className="thin">{w.label} × {it.qty}</span>
                <span className="thin r">{fmt(priceFor(it.product, it.weight) * it.qty)}</span>
              </div>
            );
          })}
          <div className="cs-total"><span>Разом</span><strong>{fmt(total)} грн</strong></div>
          <p className="cs-note">{tone === 'absurd' ? FOOTNOTES[4] : '* перевір ще раз — потім сир уже не повернеться'}</p>
        </aside>
      </div>
    </main>
  );
}

// ---------- Success ----------
function Success({ go, orderNo, items, total, tone, reset }) {
  return (
    <main className="success">
      <div className="success-card">
        <div className="success-stars">★ ★ ★</div>
        <h1 className="serif display">{COPY.success.title[tone]}</h1>
        <p className="lede">{tone === 'absurd' ? 'Кур\u02BCєр уже одягає шапку рішучості.' : 'Менеджер передзвонить упродовж 30 хвилин.'}</p>

        <div className="success-grid">
          <div><strong>Номер</strong><span>#СР-{orderNo}</span></div>
          <div><strong>Сума</strong><span>{fmt(total)} грн</span></div>
          <div><strong>Дзвінок</strong><span>{tone === 'absurd' ? 'за 30 хв або раніше' : 'у межах 30 хв'}</span></div>
          <div><strong>Доставка</strong><span>1–2 дні</span></div>
        </div>

        <div className="success-items">
          {items.slice(0, 5).map((it, i) => {
            const w = WEIGHT_OPTIONS.find(x => x.id === it.weight);
            return (
              <div key={i} className="cs-row">
                <span className="dot" style={{ background: it.product.color }} />
                <span>{it.product.name}</span>
                <span className="thin">{w.label} × {it.qty}</span>
              </div>
            );
          })}
          {items.length > 5 && <div className="cs-row more">…і ще {items.length - 5}</div>}
        </div>

        <div className="success-ctas">
          <button className="btn-primary" onClick={() => { reset(); go('home'); }}>На головну</button>
          <button className="btn-ghost" onClick={() => { reset(); go('catalog'); }}>Ще трохи сиру</button>
        </div>

        <div className="success-eggs">
          <span>{FOOTNOTES[1]}</span>
          <span>{FOOTNOTES[3]}</span>
        </div>
      </div>
    </main>
  );
}

window.ProductCard = ProductCard;
window.Catalog = Catalog;
window.ProductDetail = ProductDetail;
window.Cart = Cart;
window.ConfirmModal = ConfirmModal;
window.Checkout = Checkout;
window.Success = Success;
