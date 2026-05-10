// Main app for Сирник — interactive cheese shop prototype
const { useState, useEffect, useMemo, useRef } = React;

// ---------- styles ----------
const sirnykStyles = {
  page: {
    minHeight: '100vh',
    background: 'var(--cream)',
    color: 'var(--ink)',
    fontFamily: 'Manrope, system-ui, sans-serif',
  },
};

// ---------- helpers ----------
const fmt = (n) => new Intl.NumberFormat('uk-UA').format(Math.round(n));
const priceFor = (product, weightId) => {
  const w = WEIGHT_OPTIONS.find(x => x.id === weightId) || WEIGHT_OPTIONS[0];
  let p = product.basePrice * w.mult;
  if (product.sale) p *= 0.85;
  return p;
};

// ---------- Cheese chip placeholder (SVG with holes) ----------
function CheeseChip({ color = '#F2C14E', holes = true, accent = '#C7942A', size = 220, seed = 1 }) {
  // deterministic pseudo-random holes
  const rng = (i) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  };
  const holeData = [];
  if (holes) {
    for (let i = 0; i < 9; i++) {
      holeData.push({
        cx: 18 + rng(i) * 184,
        cy: 18 + rng(i + 100) * 184,
        r: 6 + rng(i + 200) * 14,
      });
    }
  }
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`g${seed}`} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.55" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={accent} />
        </radialGradient>
      </defs>
      <polygon points="20,200 200,200 110,30" fill={`url(#g${seed})`} stroke="#7a4a14" strokeWidth="2" strokeLinejoin="round" />
      {holeData.map((h, i) => (
        <g key={i}>
          <circle cx={h.cx} cy={h.cy} r={h.r} fill="#000" opacity="0.18" />
          <circle cx={h.cx - h.r * 0.25} cy={h.cy - h.r * 0.25} r={h.r * 0.85} fill={accent} opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

// Decorative cheese wedge logo
function Wedge({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <polygon points="3,28 29,28 16,5" fill="#F2C14E" stroke="#1a1410" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="13" cy="20" r="2" fill="#1a1410" />
      <circle cx="20" cy="22" r="1.4" fill="#1a1410" />
      <circle cx="17" cy="14" r="1.2" fill="#1a1410" />
    </svg>
  );
}

// ---------- Top nav ----------
function TopNav({ route, go, cartCount, search, setSearch, tone }) {
  return (
    <header className="topnav">
      <button className="brand" onClick={() => go('home')}>
        <Wedge size={32} />
        <div>
          <div className="brand-name">СИРНИК</div>
          <div className="brand-sub">{tone === 'absurd' ? 'крамниця обробленого молока' : 'крамниця сиру'}</div>
        </div>
      </button>
      <nav className="topnav-links">
        <button className={route === 'home' ? 'active' : ''} onClick={() => go('home')}>Головна</button>
        <button className={route === 'catalog' ? 'active' : ''} onClick={() => go('catalog')}>Каталог</button>
        <button onClick={() => { go('catalog'); setTimeout(() => window.dispatchEvent(new CustomEvent('sirnyk:filter-sale')), 30); }}>Акції</button>
        <button className={route === 'about' ? 'active' : ''} onClick={() => go('about')}>Про нас</button>
      </nav>
      <div className="topnav-right">
        <div className="search">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="шукати сир…" />
        </div>
        <button className="cart-btn" onClick={() => go('cart')}>
          <span>Кошик</span>
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

// ---------- Home ----------
function HomePage({ go, tone, addToCart }) {
  const t = (key) => COPY.hero[key][tone];
  const featured = PRODUCTS.filter(p => p.popularity >= 90).slice(0, 4);
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {t('eyebrow')}
          </div>
          <h1 className="display">{t('title')}</h1>
          <p className="lede">{t('subtitle')}</p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => go('catalog')}>{t('cta1')} →</button>
            <button className="btn-ghost" onClick={() => { go('catalog'); setTimeout(() => window.dispatchEvent(new CustomEvent('sirnyk:filter-sale')), 30); }}>{t('cta2')}</button>
          </div>
          <div className="hero-meta">
            <div><strong>24+</strong><span>сортів зрілого щастя</span></div>
            <div><strong>1–2 дні</strong><span>{tone === 'absurd' ? 'довезе кур\u02BCєр з пристрастю' : 'доставка по Україні'}</span></div>
            <div><strong>0</strong><span>{tone === 'absurd' ? 'причин відмовлятись' : 'консервантів'}</span></div>
          </div>
        </div>
        <div className="hero-photo">
          <img src="assets/hero.jpg" alt="модель тримає шматок сиру" />
          <div className="price-tag">
            <div className="pt-name">Сир Емменталь</div>
            <div className="pt-price">100 г · 65 грн</div>
            <div className="pt-heart">♡</div>
          </div>
          <div className="sticker sticker-1">сир, що дивиться у душу</div>
          <div className="sticker sticker-2">★ keep calm · eat cheese</div>
        </div>
      </section>

      <section className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="ticker-row" key={k}>
              {['свіжий завіз з ферми', 'плісняв\u02BCя \u2014 це фіча', 'вино знайдеться поруч', 'крафт-папір · крафт-почуття', 'безкоштовна дегустація поглядом', 'сирна машина долі·запущена'].map((t, i) => (
                <span key={i}><Wedge size={18} />{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="featured">
        <div className="section-head">
          <h2 className="serif">Сьогодні в улюбленцях</h2>
          <p>{tone === 'absurd' ? 'Алгоритм щастя за погодою настрою.' : 'Те, що беруть найчастіше цього тижня.'}</p>
        </div>
        <div className="cards">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} onOpen={() => { window.__openProduct(p.id); }} onAdd={() => addToCart(p, 250)} seed={i + 7} />
          ))}
        </div>
      </section>

      <section className="story">
        <div className="story-card story-1">
          <div className="story-num">01</div>
          <h3 className="serif">Молоко знайомиться з часом.</h3>
          <p>{tone === 'absurd' ? 'Чекає, дозріває, читає Камю.' : 'Ферми відбираємо вручну. Від корови до сирної кімнати — без посередників.'}</p>
        </div>
        <div className="story-card story-2">
          <div className="story-num">02</div>
          <h3 className="serif">Сировари роблять усе руками.</h3>
          <p>{tone === 'absurd' ? 'Іноді розмовляють із сиром. Сир мовчить, але уважно.' : 'Кожна голова — окремий характер. Маркуємо датою і фермером.'}</p>
        </div>
        <div className="story-card story-3">
          <div className="story-num">03</div>
          <h3 className="serif">Кур\u02BCєр везе тобі шмат настрою.</h3>
          <p>{tone === 'absurd' ? 'У холодній сумці і теплих почуттях.' : 'У термопакуванні, з льодом, у крафт-папері.'}</p>
        </div>
      </section>

      <section className="footnote-strip">
        <span>{FOOTNOTES[0]}</span>
        <span>{FOOTNOTES[3]}</span>
      </section>
    </main>
  );
}

// ---------- About Page ----------
const _img = n => `uploads/ChatGPT Image 10 трав. 2026 р., ${n}.png`;
const ABOUT_IMGS = {
  hero:    _img('01_15_36'),
  egypt:   _img('01_20_47'),
  greece:  _img('01_24_48'),
  italy:   _img('01_30_26'),
  england: _img('01_34_45'),
  home:    _img('02_27_27'),
};

function AboutSplit({ img, alt, tag, title, children, reverse }) {
  return (
    <section className={`about-split${reverse ? ' about-split-rev' : ''}`}>
      <div className="about-split-img">
        <img src={img} alt={alt} />
      </div>
      <div className="about-split-text">
        <div className="about-country-tag">{tag}</div>
        <h3 className="serif about-country-title">{title}</h3>
        {children}
      </div>
    </section>
  );
}

function AboutPage({ go, tone }) {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-img">
          <img src={ABOUT_IMGS.hero} alt="Сирник вирушає в подорож" />
        </div>
        <div className="about-hero-text">
          <span className="eyebrow"><span className="eyebrow-dot" />Про нас</span>
          <h1 className="serif display-md">Сирник.</h1>
          <p className="about-lead">
            Колись давно, ще тоді, коли рецепти передавали не в чатах, а пошепки біля вогню, у древньому Дрогобичі жив собі чоловік на ім'я Сирник.
            Так, саме Сирник. І ні, це не прізвисько. Це, можна сказати, покликання.
          </p>
          <p className="about-text">Ще змалку він ставив запитання, які лякали дорослих і дивували худобу:</p>
          <div className="about-questions">
            <span className="about-q">«Чому один сир ніжний, як весняний ранок, а інший пахне так, ніби має власну думку?»</span>
            <span className="about-q">«Хто першим вирішив, що молоко — це ще не фінальна версія?»</span>
            <span className="about-q">«І головне: скільки дірок у сирі — це вже повага, а скільки — шахрайство?»</span>
          </div>
          <p className="about-text">
            Коли зрозумів, що відповіді в Дрогобичі закінчилися швидше, ніж бринза на доброму застіллі, Сирник вирушив у велику подорож Європою — вивчати найкращі традиції сироваріння, збирати рецепти, сперечатися з мудрецями та, подейкують, дегустувати буквально все, що можна було намазати, нарізати або урочисто подати на дерев'яній дошці.
          </p>
        </div>
      </section>

      {/* Expedition divider */}
      <section className="about-divider">
        <span className="about-chapter-label">Велика сирна одіссея</span>
        <p className="serif about-chapter-title">
          Сирник побував усюди, де до сиру ставилися серйозно, але не без пристрасті.
        </p>
      </section>

      {/* Egypt */}
      <AboutSplit
        img={ABOUT_IMGS.egypt}
        alt="Єгипет — Сирник у стилі фрески"
        tag="Єгипет"
        title="«Де зберігали молочне, там знали, що таке час.»"
      >
        <p>У Єгипті він, за легендою, намагався дослідити давні способи зберігання молочних продуктів. Настільки вразив місцевих своїми розмовами про витримку, текстуру й правильну скоринку, що ті увічнили його на стіні.</p>
        <p className="about-italic">Ми не стверджуємо, що саме біля пірамід можна знайти фреску з людиною, яка тримає колесо сиру. Але ми й не заперечуємо.</p>
      </AboutSplit>

      {/* Greece */}
      <AboutSplit
        img={ABOUT_IMGS.greece}
        alt="Греція — Сирник і Піфагор"
        tag="Греція"
        title="«Усе в світі є число. Але деякі речі ще й чудово смакують із вином.»"
        reverse
      >
        <p>У Греції Сирник зустрівся з Піфагором. Вони довго сперечалися, чи існує ідеальна форма сиру.</p>
        <div className="about-dialogue">
          <div className="about-q-line"><strong>Піфагор:</strong> — Усе в світі є число.</div>
          <div className="about-q-line"><strong>Сирник:</strong> — Можливо. Але деякі речі ще й чудово смакують із вином.</div>
        </div>
        <p>Саме там, десь між трикутниками, гармонією й тарілкою фети, народилася одна з найважливіших думок нашого бренду: <em>сир має бути не просто їжею — а маленькою філософією щодня.</em></p>
      </AboutSplit>

      {/* Italy */}
      <AboutSplit
        img={ABOUT_IMGS.italy}
        alt="Італія — Сирник і Макіавеллі"
        tag="Італія"
        title="«Справжній сир не потребує зайвої політики — він і так завойовує серця.»"
      >
        <p>В Італії він нібито мав бесіду з Макіавеллі. Говорили, звісно, про владу. Але дуже швидко перейшли до важливішого: хто насправді керує столом — той, хто приносить головну страву, чи той, хто ставить правильний сир наприкінці?</p>
        <p className="about-italic">Кажуть, саме після цієї розмови Сирник усвідомив: справжній сир не потребує зайвої політики — він і так завойовує серця.</p>
      </AboutSplit>

      {/* England */}
      <AboutSplit
        img={ABOUT_IMGS.england}
        alt="Англія — Сирник і Шекспір"
        tag="Англія"
        title="«Бути чи не бути... брі?»"
        reverse
      >
        <p>А в Англії він обговорював із Шекспіром питання, яке розділяє людство століттями: «Чи бути сиру з пліснявою на столі — чи не бути?»</p>
        <p>Після довгих дискусій, театральних пауз і, можливо, однієї дуже драматичної дегустації, відповідь знайшлася сама собою:</p>
        <div className="about-bigquote serif">якщо сир добрий, то навіть пліснява звучить шляхетно.</div>
      </AboutSplit>

      {/* Return home */}
      <section className="about-return">
        <div className="about-return-img">
          <img src={ABOUT_IMGS.home} alt="Крамниця Сирник у Дрогобичі після повернення" />
          <div className="about-return-stamp">
            <span className="serif">Після<br/>експедиції</span>
            <small>Дрогобич · 1912</small>
          </div>
        </div>
        <div className="about-return-text">
          <span className="eyebrow"><span className="eyebrow-dot" />Повернення додому</span>
          <h2 className="serif display-sm">Так з'явилася наша справа.</h2>
          <p>Минали роки. Європейські ринки шуміли, льохи дозрівали, рецепти шліфувалися, а Сирник усе шукав. Не просто хороший сир. Не просто цікавий сир. А ідеальний сир для своїх людей.</p>
          <p>І ось тепер, після довгої мандрівки, він нарешті повернувся додому — щоб привезти з собою найкраще, що побачив, скуштував і вистраждав у чесних сирних пошуках.</p>
          <p>Ми взяли європейські традиції, дрібку легенд, здорову любов до хорошої їжі та дуже серйозне ставлення до смаку — і створили місце, де сир не просто продається, а має <strong>історію, характер і настрій.</strong></p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-head">
          <span className="eyebrow"><span className="eyebrow-dot" />У що ми віримо</span>
          <h2 className="serif">Три речі, без яких сир — це просто їжа.</h2>
        </div>
        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-icon">◐</div>
            <h4 className="serif">Терпіння</h4>
            <p>Хороший сир — це не випадковість. Це терпіння, майстерність і цікавість. Лише легка впертість людини, яка поїхала через пів світу — і привезла результат.</p>
          </div>
          <div className="about-value-card about-value-card-dark">
            <div className="about-value-icon">✦</div>
            <h4 className="serif">Емоція</h4>
            <p>Один — для тихого вечора. Інший — для гостей. Ще інший — для моменту, коли хочеться сказати: «О, оце вже серйозний сир.»</p>
          </div>
          <div className="about-value-card about-value-card-warm">
            <div className="about-value-icon">♨</div>
            <h4 className="serif">Традиція</h4>
            <p>Сир — це привід зібратися разом. Маленьке свято без зайвого пафосу. Традиція, яку можна скуштувати. Якщо Сирник витратив стільки часу на пошуки — нечемно не поділитися результатом.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <p className="about-cta-pre">Ласкаво просимо до нас.</p>
        <h2 className="serif display-sm">Тут є сир із характером, сир із історією й сир, який, можливо, обговорювали ще з філософами.</h2>
        <p className="about-cta-sub">А якщо ні — то мав би.</p>
        <button className="btn-primary" onClick={() => go('catalog')}>Переглянути каталог →</button>
      </section>

    </main>
  );
}

window.HomePage = HomePage;
window.AboutPage = AboutPage;
window.CheeseChip = CheeseChip;
window.Wedge = Wedge;
window.TopNav = TopNav;
window.fmt = fmt;
window.priceFor = priceFor;
