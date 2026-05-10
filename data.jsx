// Catalog data + microcopy banks for Сирник
// All product images are placeholder cheese chips (color + texture); real shots TBD.

const PRODUCTS = [
  { id: 'emmental',     name: 'Емменталь',          type: 'твердий',     producer: 'Альпійська коза',  basePrice: 65,  popularity: 98, sale: false, color: '#F2C14E', holes: true,  desc: 'Класичний швейцарський з дірками розміром із чесні наміри.', image: 'assets/emmental.png' },
  { id: 'gouda',        name: 'Гауда молочний',     type: 'твердий',     producer: 'Ферма Хмельник',   basePrice: 55,  popularity: 95, sale: false, color: '#E8B547', holes: false, desc: 'М\u02BCякий, поступливий, як перша зарплата.', image: 'assets/gauda.png' },
  { id: 'kamambert',    name: 'Камамбер',           type: 'м\u02BCякий',  producer: 'Maison du Lait',   basePrice: 63,  popularity: 88, sale: false, color: '#F4E4C1', holes: false, desc: 'Біла плісняв\u02BCяна шуба. Усередині \u2014 сонце.', image: 'assets/kamambert.png' },
  { id: 'bri',          name: 'Брі фермерський',    type: 'м\u02BCякий',  producer: 'Maison du Lait',   basePrice: 72,  popularity: 86, sale: true,  color: '#F6EAC8', holes: false, desc: 'Французький в\u02BCязень холодильника. Тікає при +18°C.', image: 'assets/bri.png' },
  { id: 'parmezan',     name: 'Пармезан витриманий',type: 'твердий',     producer: 'Альпійська коза',  basePrice: 85,  popularity: 92, sale: false, color: '#E8C273', holes: false, desc: 'Старший і мудріший за більшість твоїх рішень.', image: 'assets/parmezan.png' },
  { id: 'cheddar',      name: 'Чедер витриманий',   type: 'твердий',     producer: 'Old Hill',         basePrice: 62,  popularity: 90, sale: false, color: '#D97D2E', holes: false, desc: 'Помаранчевий, упертий, не перепрошує.', image: 'assets/cheddar.png' },
  { id: 'gorgonzola',   name: 'Горгонзола',         type: 'з пліснявою', producer: 'Maison du Lait',   basePrice: 65,  popularity: 71, sale: false, color: '#E8E0C4', holes: false, desc: 'Плісняв\u02BCя як дизайнерська риса характеру.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_58_02.png' },
  { id: 'pesto',        name: 'Песто з базиліком',  type: 'фермерський', producer: 'Ферма Хмельник',   basePrice: 63,  popularity: 74, sale: false, color: '#9CB45A', holes: false, desc: 'Зелений. Не завидує \u2014 він просто такий.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_53_01.png' },
  { id: 'truffle',      name: 'Трюфельний',         type: 'фермерський', producer: 'Ферма Хмельник',   basePrice: 96,  popularity: 80, sale: false, color: '#C9A86A', holes: false, desc: 'Пахне лісом і трохи бухгалтерією.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_40_12.png' },
  { id: 'mocarella',    name: 'Моцарела буфала',    type: 'м\u02BCякий',  producer: 'Bianca',           basePrice: 70,  popularity: 84, sale: false, color: '#F8F1E0', holes: false, desc: 'Пухкенька кулька. Плаває в розсолі і в комплексах.', image: 'assets/mocarella.png' },
  { id: 'maasdam',      name: 'Маасдам',            type: 'твердий',     producer: 'Альпійська коза',  basePrice: 58,  popularity: 89, sale: true,  color: '#F0CC5A', holes: true,  desc: 'Гауда, яка пішла в спортзал.', image: 'assets/maasdam.png' },
  { id: 'rokfor',       name: 'Рокфор',             type: 'з пліснявою', producer: 'Maison du Lait',   basePrice: 110, popularity: 65, sale: false, color: '#E8E4C8', holes: false, desc: 'Сильний характер. Не для першого побачення.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 01_04_04.png' },
  { id: 'mancheho',     name: 'Манчего',            type: 'твердий',     producer: 'Casa Iberico',     basePrice: 92,  popularity: 77, sale: false, color: '#E5BE64', holes: false, desc: 'Іспанський, з овечої атмосфери.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_46_38.png' },
  { id: 'gruyer',       name: 'Грюєр',              type: 'твердий',     producer: 'Альпійська коза',  basePrice: 88,  popularity: 82, sale: false, color: '#E5B954', holes: false, desc: 'Тане. Розмовляє. Закохує.', image: 'assets/gruyer.png' },
  { id: 'feta',         name: 'Фета',               type: 'м\u02BCякий',  producer: 'Bianca',           basePrice: 48,  popularity: 79, sale: true,  color: '#FBF6E8', holes: false, desc: 'Соляна. Як чесна критика.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_43_20.png' },
  { id: 'brynza',       name: 'Бринза карпатська',  type: 'фермерський', producer: 'Карпатська люлька',basePrice: 52,  popularity: 91, sale: false, color: '#FFFAEC', holes: false, desc: 'Прийшла з гір, плаче від щастя.', image: 'assets/brynza.png' },
  { id: 'adyge',        name: 'Адигейський',        type: 'м\u02BCякий',  producer: 'Ферма Хмельник',   basePrice: 45,  popularity: 76, sale: false, color: '#FBF1D6', holes: false, desc: 'Простий. Сумлінний. Як кращий друг.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_51_32.png' },
  { id: 'suluguni',     name: 'Сулугуні',           type: 'м\u02BCякий',  producer: 'Карпатська люлька',basePrice: 50,  popularity: 81, sale: false, color: '#F8EFD2', holes: false, desc: 'Шарувата душа. Розкривається в гарячому.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_36_13.png' },
  { id: 'philadelphia', name: 'Філадельфія крем',   type: 'плавлений',   producer: 'Bianca',           basePrice: 75,  popularity: 87, sale: false, color: '#FFFCEE', holes: false, desc: 'Намазується на все, навіть на проблеми.', image: 'assets/philadelphia.png' },
  { id: 'mascarpone',   name: 'Маскарпоне',         type: 'плавлений',   producer: 'Bianca',           basePrice: 78,  popularity: 73, sale: false, color: '#FFF7DD', holes: false, desc: 'Інгредієнт тірамісу. Сам по собі вже десерт.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_55_03.png' },
  { id: 'kopcheny',     name: 'Копчений косичка',   type: 'копчений',    producer: 'Карпатська люлька',basePrice: 60,  popularity: 85, sale: true,  color: '#D9A24A', holes: false, desc: 'Заплетена косичка. Пахне багаттям і ностальгією.', image: 'assets/kopcheny.png' },
  { id: 'kopch_smoke',  name: 'Сулугуні копчений',  type: 'копчений',    producer: 'Карпатська люлька',basePrice: 64,  popularity: 78, sale: false, color: '#C28A3F', holes: false, desc: 'Курив усе своє дитинство. Тепер це личить.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 00_45_16.png' },
  { id: 'plavl_class',  name: 'Плавлений класичний',type: 'плавлений',   producer: 'Стара звичка',     basePrice: 38,  popularity: 70, sale: false, color: '#FFE9A8', holes: false, desc: 'Той самий. Ностальгія в фользі.', image: 'uploads/ChatGPT Image 10 трав. 2026 р., 01_02_51.png' },
  { id: 'set_french',   name: 'Набір «Французька дилема»', type: 'набори', producer: 'Сирник',          basePrice: 320, popularity: 96, sale: true,  color: '#F2D77A', holes: false, desc: 'Брі + Камамбер + Рокфор. Ти більше не знатимеш, кого любиш найбільше.', image: 'assets/set_french.png' },
  { id: 'set_italian',  name: 'Набір «Італійський романс»', type: 'набори', producer: 'Сирник',          basePrice: 290, popularity: 94, sale: true,  color: '#E8B964', holes: false, desc: 'Пармезан + Моцарела + Маскарпоне. Достатньо, щоб закохатися навіть у понеділок.', image: 'assets/set_italian.png' },
  { id: 'set_alp',      name: 'Набір «Альпійський дзвоник»', type: 'набори', producer: 'Сирник',         basePrice: 360, popularity: 88, sale: false, color: '#E8C065', holes: true,  desc: 'Емменталь + Грюєр + Маасдам. Звучить, як швейцарські гори в роті.', image: 'assets/set_alp.png' },
];

const WEIGHT_OPTIONS = [
  { id: 100, label: '100 г', mult: 1 },
  { id: 250, label: '250 г', mult: 2.4 },
  { id: 500, label: '500 г', mult: 4.6 },
  { id: 1000, label: '1 кг',  mult: 8.8 },
];

const TYPES = ['твердий', 'м\u02BCякий', 'плавлений', 'копчений', 'з пліснявою', 'фермерський', 'набори'];
const PRODUCERS = ['Альпійська коза', 'Ферма Хмельник', 'Maison du Lait', 'Old Hill', 'Bianca', 'Casa Iberico', 'Карпатська люлька', 'Стара звичка', 'Сирник'];

// Microcopy bank — chosen by tone
const COPY = {
  // tone: 'mild' | 'absurd'
  hero: {
    eyebrow: { mild: 'Сирна крамниця', absurd: 'Сектор підвищеного сирного тиску' },
    title:   { mild: 'Сир, який дивиться тобі прямо в душу.',
               absurd: 'Сир, який дивиться тобі прямо в душу.\u2009І трохи в холодильник.' },
    subtitle:{ mild: 'Обери свій шмат щастя.',
               absurd: 'Обери свій шмат щастя. Ми загорнемо його у крафт і добрі наміри.' },
    cta1:    { mild: 'Перейти до каталогу', absurd: 'Зайти в шмат справи' },
    cta2:    { mild: 'Подивитись акції',     absurd: 'Що тут зі знижками, людино' },
  },
  catalog: {
    banner:  { mild: 'Занурся в сир. Спочатку додай у кошик.',
               absurd: 'Занурся в сир. Але спочатку додай його в кошик \u2014 ми ж не дикуни.' },
    sub:     { mild: 'Понад 24 сорти. Усі реальні. Майже.',
               absurd: 'Понад 24 сорти. Усі реальні. Один з них, кажуть, вміє слухати.' },
  },
  confirm: {
    title:   { mild: 'Перевір замовлення',
               absurd: 'Ти точно готовий до цього сирного рішення?' },
    sub:     { mild: 'Сир уже майже твій.',
               absurd: 'Сир уже майже твій, але бюрократія, як завжди, хоче кнопку.' },
    yes:     { mild: 'Так, підтвердити', absurd: 'Так, я обраний' },
    no:      { mild: 'Ні, повернутись',  absurd: 'Ні, я ще подумаю над своїм життям' },
  },
  success: {
    title:   { mild: 'Замовлення прийнято.',
               absurd: 'Замовлення прийнято. Сирна машина долі вже запущена.' },
  },
};

// Tiny absurd footnotes scattered as easter eggs
const FOOTNOTES = [
  '* сир не ображається, якщо ви оберете інший',
  '* кожен 7-й клієнт отримує мовчазне схвалення сировара',
  '* ціни округлені згідно з настроєм пармезану',
  '* доставка пахне як надія',
  '* ми не приймаємо повернень, але приймаємо вибачення',
];

window.PRODUCTS = PRODUCTS;
window.WEIGHT_OPTIONS = WEIGHT_OPTIONS;
window.TYPES = TYPES;
window.PRODUCERS = PRODUCERS;
window.COPY = COPY;
window.FOOTNOTES = FOOTNOTES;
