import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read current generate_massive_words.js content
const scriptPath = path.join(__dirname, 'generate_massive_words.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf-8');

const NEW_PAIRS = [
  // fruits
  ['fruits', ['Grapefruit', 'Pomelo'], ['Pamplemousse', 'Pomélo'], ['جريب فروت', 'بوملي']],
  ['fruits', ['Blackberry', 'Blueberry'], ['Mûre', 'Myrtille'], ['توت أسود', 'توت أزرق']],
  ['fruits', ['Apricot', 'Plum'], ['Abricot', 'Prune'], ['مشمش', 'برقوق']],
  ['fruits', ['Cantaloupe', 'Honeydew'], ['Cantaloup', 'Melon miel'], ['شمام كوز العسل', 'شمام أصفر']],
  ['fruits', ['Raspberry', 'Blackberry'], ['Framboise', 'Mûre'], ['توت العليق', 'توت شوكي']],

  // vegetables
  ['vegetables', ['Sweet Potato', 'Yam'], ['Patate douce', 'Igname'], ['بطاطا حلوة', 'يام']],
  ['vegetables', ['Cauliflower', 'Cabbage'], ['Chou-fleur', 'Chou'], ['قرنبيط', 'ملفوف']],
  ['vegetables', ['Leek', 'Green Onion'], ['Poireau', 'Oignon vert'], ['كراث', 'بصل أخضر']],
  ['vegetables', ['Beetroot', 'Radish'], ['Betterave', 'Radis'], ['شمندر', 'فجل']],
  ['vegetables', ['Pumpkin', 'Butternut Squash'], ['Citrouille', 'Courge doubeurre'], ['يقطين', 'قرع عسلي']],

  // cars
  ['cars', ['Maserati', 'Alfa Romeo'], ['Maserati', 'Alfa Romeo'], ['مازيراتي', 'ألفا روميو']],
  ['cars', ['Bentley', 'Maybach'], ['Bentley', 'Maybach'], ['بنتلي', 'مايباخ']],
  ['cars', ['Jeep', 'Land Rover'], ['Jeep', 'Land Rover'], ['جيب', 'لاند روفر']],
  ['cars', ['Subaru', 'Mitsubishi'], ['Subaru', 'Mitsubishi'], ['سوبارو', 'ميتسوبيشي']],
  ['cars', ['Volvo', 'Saab'], ['Volvo', 'Saab'], ['فولفو', 'ساب']],

  // food
  ['food', ['Hot Dog', 'Corn Dog'], ['Hot-dog', 'Beignet de saucisse'], ['هوت دوغ', 'كورن دوغ']],
  ['food', ['Burrito', 'Quesadilla'], ['Burrito', 'Quesadilla'], ['بوريتو', 'كاساديا']],
  ['food', ['Ramen', 'Udon'], ['Ramen', 'Udon'], ['رامن', 'أودون']],
  ['food', ['Shawarma', 'Gyros'], ['Shawarma', 'Gyros'], ['شاورما', 'جيروس']],
  ['food', ['Crepe', 'Pancake'], ['Crêpe', 'Pancake'], ['كريب', 'بان كيك']],

  // drinks
  ['drinks', ['Matcha', 'Green Tea'], ['Matcha', 'Thé vert'], ['ماتشا', 'شاي أخضر']],
  ['drinks', ['Lemonade', 'Limeade'], ['Limonade', 'Citronnade'], ['ليمونادة', 'عصير ليمون أخضر']],
  ['drinks', ['Apple Cider', 'Apple Juice'], ['Cidre de pomme', 'Jus de pomme'], ['عصير تفاح فوار', 'عصير تفاح']],
  ['drinks', ['Chai Latte', 'Karak Tea'], ['Chaï latte', 'Thé karak'], ['شاي لاتيه', 'شاي كرك']],
  ['drinks', ['Red Bull', 'Monster'], ['Red Bull', 'Monster'], ['ريد بول', 'مونستر']],

  // desserts
  ['desserts', ['Cheesecake', 'Flan'], ['Cheesecake', 'Flan'], ['تشيز كيك', 'فلان']],
  ['desserts', ['Churros', 'Beignet'], ['Churros', 'Beignet'], ['تشوروز', 'بينيه']],
  ['desserts', ['Eclair', 'Profiterole'], ['Éclair', 'Profiterole'], ['إكلير', 'بروفيترول']],
  ['desserts', ['Mousse', 'Pudding'], ['Mousse', 'Pudding'], ['موس شوكولاتة', 'بودينغ']],
  ['desserts', ['Gelato', 'Frozen Yogurt'], ['Gelato', 'Yaourt glacé'], ['جيلاتو', 'زبادي مثلج']],

  // music
  ['music', ['Saxophone', 'Clarinet'], ['Saxophone', 'Clarinette'], ['ساكسفون', 'كلارينيت']],
  ['music', ['Bass Guitar', 'Double Bass'], ['Basse électrique', 'Contrebasse'], ['غيتار باص', 'كونترباص']],
  ['music', ['Acoustic Guitar', 'Electric Guitar'], ['Guitare acoustique', 'Guitare électrique'], ['غيتار صوتي', 'غيتار كهربائي']],
  ['music', ['Techno', 'House Music'], ['Techno', 'House music'], ['تكنو', 'هاوس']],
  ['music', ['Opera', 'Musical'], ['Opéra', 'Comédie musicale'], ['أوبرا', 'مسرحية موسيقية']],

  // clothing
  ['clothing', ['Cardigan', 'Sweater'], ['Cardigan', 'Pull'], ['كارديجان', 'كنزة']],
  ['clothing', ['Loafers', 'Moccasins'], ['Mocassins', 'Chaussures bateau'], ['حذاء لوفر', 'حذاء موكاسين']],
  ['clothing', ['Vest', 'Waistcoat'], ['Gilet', 'Veston'], ['سترة بدون أكمام', 'صدرية']],
  ['clothing', ['Beanie', 'Beret'], ['Bonnet', 'Béret'], ['قبعة شتوية', 'بيريه']],
  ['clothing', ['Trench Coat', 'Parka'], ['Trench-coat', 'Parka'], ['ترنش كوت', 'باركا']],

  // furniture
  ['furniture', ['Bookcase', 'Display Cabinet'], ['Bibliothèque', 'Vitrine'], ['خزانة كتب', 'فاترينة عرض']],
  ['furniture', ['Coffee Table', 'Nightstand'], ['Table basse', 'Table de chevet'], ['طاولة قهوة', 'كومودينو']],
  ['furniture', ['Wardrobe', 'Closet'], ['Penderie', 'Placard'], ['خزانة ملابس', 'دولاب']],
  ['furniture', ['Ottoman', 'Beanbag'], ['Pouf', 'Fauteuil poire'], ['عثمانية (بوف)', 'بين باج']],
  ['furniture', ['Desk Lamp', 'Floor Lamp'], ['Lampe de bureau', 'Lampadaire'], ['مصباح مكتب', 'مصباح أرضي']],

  // animals
  ['animals', ['Cheetah', 'Leopard'], ['Guépard', 'Léopard'], ['فهد صياد', 'نمر مرقط']],
  ['animals', ['Otter', 'Beaver'], ['Loutre', 'Castor'], ['قضاعة', 'قندس']],
  ['animals', ['Alpaca', 'Llama'], ['Alpaga', 'Lama'], ['ألبكة', 'لاما']],
  ['animals', ['Hedgehog', 'Porcupine'], ['Hérisson', 'Porc-épic'], ['قنفذ', 'شيهم (نيص)']],
  ['animals', ['Crow', 'Raven'], ['Corneille', 'Corbeau'], ['غراب', 'غداف']],

  // technology
  ['technology', ['Smart TV', 'Projector'], ['Smart TV', 'Projecteur'], ['تلفزيون ذكي', 'بروجكتور']],
  ['technology', ['Power Bank', 'Wireless Charger'], ['Batterie externe', 'Chargeur sans fil'], ['باور بانك', 'شاحن لاسلكي']],
  ['technology', ['SSD', 'USB Flash Drive'], ['Disque SSD', 'Clé USB'], ['قرص إس إس دي', 'فلاشة ميموري']],
  ['technology', ['Smart Ring', 'Smart Watch'], ['Bague connectée', 'Montre connectée'], ['خاتم ذكي', 'ساعة ذكية']],
  ['technology', ['Mechanical Keyboard', 'Membrane Keyboard'], ['Clavier mécanique', 'Clavier à membrane'], ['كيبورد ميكانيكي', 'كيبورد عادي']],

  // sports
  ['sports', ['Handball', 'Water Polo'], ['Handball', 'Water-polo'], ['كرة اليد', 'كرة الماء']],
  ['sports', ['Skateboarding', 'Rollerblading'], ['Skateboard', 'Roller'], ['لوح تزلج', 'حذاء تزلج بعجلات']],
  ['sports', ['Canoeing', 'Rowing'], ['Canoë', 'Aviron'], ['قارب كاياك', 'تجديف']],
  ['sports', ['Bowling', 'Billiards'], ['Bowling', 'Billard'], ['بولينغ', 'بلياردو']],
  ['sports', ['Triathlon', 'Marathon'], ['Triathlon', 'Marathon'], ['سباق ثلاثي (ترايثلون)', 'ماراثون']],

  // professions
  ['professions', ['Plumber', 'Carpenter'], ['Plombier', 'Charpentier'], ['سباك', 'نجار']],
  ['professions', ['Veterinarian', 'Zoologist'], ['Vétérinaire', 'Zoologiste'], ['طبيب بيطري', 'عالم حيوان']],
  ['professions', ['Civil Engineer', 'Architect'], ['Ingénieur civil', 'Architecte'], ['مهندس مدني', 'مهندس معماري']],
  ['professions', ['Financial Analyst', 'Economist'], ['Analyste financier', 'Économiste'], ['محلل مالي', 'خبير اقتصادي']],
  ['professions', ['DJ', 'Radio Host'], ['DJ', 'Animateur radio'], ['دي جي', 'مذيع راديو']],

  // nature
  ['nature', ['Fog', 'Mist'], ['Brouillard', 'Brume'], ['ضباب كثيف', 'سديم خفيف']],
  ['nature', ['Tornado', 'Hurricane'], ['Tornade', 'Ouragan'], ['إعصار قمعي', 'إعصار استوائي']],
  ['nature', ['Swamp', 'Marsh'], ['Marécage', 'Marais'], ['مستنقع مائي', 'سبخة']],
  ['nature', ['Breeze', 'Gale'], ['Brise', 'Coup de vent'], ['نسيم عليل', 'رياح عاصفة']],
  ['nature', ['Oasis', 'Lagoon'], ['Oasis', 'Lagon'], ['واحة صحراوية', 'بحيرة شاطئية']],

  // movies
  ['movies', ['Gladiator', 'Troy'], ['Gladiator', 'Troie'], ['غلادياتور', 'طروادة']],
  ['movies', ['Pulp Fiction', 'Reservoir Dogs'], ['Pulp Fiction', 'Reservoir Dogs'], ['بلب فيكشن', 'ريزرفوار دوغز']],
  ['movies', ['Joker', 'The Dark Knight'], ['Joker', 'The Dark Knight'], ['الجوكر', 'فارس الظلام']],
  ['movies', ['Forrest Gump', 'The Shawshank Redemption'], ['Forrest Gump', 'Les Évadés'], ['فورست غامب', 'الخلاص من شاوشانك']],
  ['movies', ['Oppenheimer', 'Dunkirk'], ['Oppenheimer', 'Dunkerque'], ['أوبنهايمر', 'دونكيرك']],

  // videogames
  ['videogames', ['Dark Souls', 'Elden Ring'], ['Dark Souls', 'Elden Ring'], ['دارك سولز', 'إلدن رينغ']],
  ['videogames', ['The Witcher 3', 'Skyrim'], ['The Witcher 3', 'Skyrim'], ['ذا ويتشر 3', 'سكايرم']],
  ['videogames', ['Resident Evil', 'Silent Hill'], ['Resident Evil', 'Silent Hill'], ['ريزدنت إيفل', 'سايلنت هيل']],
  ['videogames', ['Animal Crossing', 'Stardew Valley'], ['Animal Crossing', 'Stardew Valley'], ['أنيمال كروسينغ', 'ستاردو فالي']],
  ['videogames', ['Cyberpunk 2077', 'Deus Ex'], ['Cyberpunk 2077', 'Deus Ex'], ['سايبربانك 2077', 'ديوس إكس']],

  // school
  ['school', ['Compass', 'Protractor'], ['Compas', 'Rapporteur'], ['فرجار هندسي', 'منقلة هندسية']],
  ['school', ['Highlighter', 'Marker'], ['Surligneur', 'Feutre'], ['قلم تظليل', 'قلم فلوماستر']],
  ['school', ['Blackboard', 'Whiteboard'], ['Tableau noir', 'Tableau blanc'], ['سبورة طباشير', 'سبورة بيضاء']],
  ['school', ['Diploma', 'Certificate'], ['Diplôme', 'Certificat'], ['شهادة دبلوم', 'شهادة إتمام']],
  ['school', ['Stapler', 'Paperclip'], ['Agrafeuse', 'Trombone'], ['دباسة', 'مشبك ورق']],

  // art
  ['art', ['Canvas', 'Easel'], ['Toile', 'Chevalet'], ['قماش رسم (كانفاس)', 'حامل لوحات']],
  ['art', ['Charcoal', 'Graphite'], ['Fusain', 'Graphite'], ['فحم رسم', 'رصاص جرافيت']],
  ['art', ['Mosaic', 'Stained Glass'], ['Mosaïque', 'Vitrail'], ['فسيفساء', 'زجاج معشق ملون']],
  ['art', ['Pottery', 'Ceramics'], ['Poterie', 'Céramique'], ['فخار يدوي', 'سيراميك']],
  ['art', ['Calligraphy', 'Typography'], ['Calligraphie', 'Typographie'], ['خط عربي', 'طباعة حروف']],

  // landmarks
  ['landmarks', ['Louvre Museum', 'Prado Museum'], ['Musée du Louvre', 'Musée du Prado'], ['متحف اللوفر', 'متحف البرادو']],
  ['landmarks', ['Stonehenge', 'Easter Island Moai'], ['Stonehenge', 'Moaï de l\'île de Pâques'], ['ستونهنج', 'تماثيل جزيرة القيامة']],
  ['landmarks', ['Burj Al Arab', 'Atlantis The Palm'], ['Burj Al Arab', 'Atlantis The Palm'], ['برج العرب', 'أتلانتس النخلة']],
  ['landmarks', ['Palace of Versailles', 'Buckingham Palace'], ['Château de Versailles', 'Palais de Buckingham'], ['قصر فرساي', 'قصر باكنغهام']],
  ['landmarks', ['Brooklyn Bridge', 'Tower Bridge'], ['Pont de Brooklyn', 'Tower Bridge'], ['جسر بروكلين', 'جسر البرج في لندن']],

  // transport
  ['transport', ['Submarine', 'Yacht'], ['Sous-marin', 'Yacht'], ['غواصة بحرية', 'يخت فاخر']],
  ['transport', ['Monorail', 'Cable Car'], ['Monorail', 'Téléphérique'], ['قطار أحادي (مونوريل)', 'تلفريك']],
  ['transport', ['Container Ship', 'Oil Tanker'], ['Porte-conteneurs', 'Pétrolier'], ['سفينة حاويات', 'ناقلة نفط']],
  ['transport', ['Hoverboard', 'Segway'], ['Hoverboard', 'Gyropode'], ['لوح تزلج كهربائي', 'سيجواي']],
  ['transport', ['Paraglider', 'Hot Air Balloon'], ['Parapente', 'Montgolfière'], ['مظلة طيران شراعي', 'منطاد هواء ساخن']],

  // social_media
  ['social_media', ['Threads', 'Bluesky'], ['Threads', 'Bluesky'], ['ثريدز', 'بلوسكاي']],
  ['social_media', ['Twitch', 'Kick'], ['Twitch', 'Kick'], ['تويتش', 'كيك']],
  ['social_media', ['Tinder', 'Bumble'], ['Tinder', 'Bumble'], ['تندر', 'بامبل']],
  ['social_media', ['WeChat', 'WhatsApp'], ['WeChat', 'WhatsApp'], ['وي تشات', 'واتساب']],
  ['social_media', ['Spotify', 'Apple Podcasts'], ['Spotify', 'Apple Podcasts'], ['سبوتيفاي', 'أبل بودكاست']],

  // accessories
  ['accessories', ['Brooch', 'Lapel Pin'], ['Broche', 'Épingle de revers'], ['بروش', 'دبوس طية صدر']],
  ['accessories', ['Cufflinks', 'Tie Clip'], ['Boutons de manchette', 'Pince à cravate'], ['أزرار أكمام بدلة', 'مشبك ربطة عنق']],
  ['accessories', ['Scrunchie', 'Headband'], ['Chouchou', 'Serre-tête'], ['ربطة شعر مطاطية', 'طوق شعر']],
  ['accessories', ['Anklet', 'Toe Ring'], ['Bracelet de cheville', 'Bague d\'orteil'], ['خلخال قدم', 'خاتم إصبع القدم']],
  ['accessories', ['Keyring', 'Carabiner'], ['Porte-clés', 'Mousqueton'], ['ميدالية مفاتيح', 'حلقة تسلق معدنية']],

  // brands
  ['brands', ['Under Armour', 'Reebok'], ['Under Armour', 'Reebok'], ['أندر آرمر', 'ريبوك']],
  ['brands', ['Starbucks', 'Costa Coffee'], ['Starbucks', 'Costa Coffee'], ['ستاربكس', 'كوستا كوفي']],
  ['brands', ['Cartier', 'Tiffany & Co.'], ['Cartier', 'Tiffany & Co.'], ['كارتييه', 'تيفاني آند كو']],
  ['brands', ['Sephora', 'Ulta Beauty'], ['Sephora', 'Ulta Beauty'], ['سيفورا', 'أولتا بيوتي']],
  ['brands', ['Bentley', 'Aston Martin'], ['Bentley', 'Aston Martin'], ['بنتلي', 'أستون مارتن']],

  // flags
  ['flags', ['Netherlands 🇳🇱', 'Luxembourg 🇱🇺'], ['Pays-Bas 🇳🇱', 'Luxembourg 🇱🇺'], ['هولندا 🇳🇱', 'لوكسمبورغ 🇱🇺']],
  ['flags', ['Sweden 🇸🇪', 'Norway 🇳🇴'], ['Suède 🇸🇪', 'Norvège 🇳🇴'], ['السويد 🇸🇪', 'النرويج 🇳🇴']],
  ['flags', ['Australia 🇦🇺', 'New Zealand 🇳🇿'], ['Australie 🇦🇺', 'Nouvelle-Zélande 🇳🇿'], ['أستراليا 🇦🇺', 'نيوزيلندا 🇳🇿']],
  ['flags', ['Poland 🇵🇱', 'Indonesia 🇮🇩'], ['Pologne 🇵🇱', 'Indonésie 🇮🇩'], ['بولندا 🇵🇱', 'إندونيسيا 🇮🇩']],
  ['flags', ['Switzerland 🇨🇭', 'Denmark 🇩🇰'], ['Suisse 🇨🇭', 'Danemark 🇩🇰'], ['سويسرا 🇨🇭', 'الدنمارك 🇩🇰']],

  // footballers
  ['footballers', ['Marco van Basten', 'Ruud Gullit'], ['Marco van Basten', 'Ruud Gullit'], ['ماركو فان باستن', 'رود خوليت']],
  ['footballers', ['Roberto Baggio', 'Alessandro Del Piero'], ['Roberto Baggio', 'Alessandro Del Piero'], ['روبرتو باجيو', 'أليساندرو ديل بييرو']],
  ['footballers', ['Cafu', 'Roberto Carlos'], ['Cafu', 'Roberto Carlos'], ['كافو', 'روبرتو كارلوس']],
  ['footballers', ['Carles Puyol', 'Gerard Piqué'], ['Carles Puyol', 'Gerard Piqué'], ['كارليس بويول', 'جيرارد بيكيه']],
  ['footballers', ['David Beckham', 'Andrea Pirlo'], ['David Beckham', 'Andrea Pirlo'], ['ديفيد بيكهام', 'أندريا بيرلو']],

  // headcoaches
  ['headcoaches', ['Diego Simeone', 'José Mourinho'], ['Diego Simeone', 'José Mourinho'], ['دييغو سيميوني', 'جوزيه مورينيو']],
  ['headcoaches', ['Luis Enrique', 'Xavi Hernandez'], ['Luis Enrique', 'Xavi Hernandez'], ['لويس إنريكي', 'تشافي هيرنانديز']],
  ['headcoaches', ['Unai Emery', 'Julen Lopetegui'], ['Unai Emery', 'Julen Lopetegui'], ['أوناي إيمري', 'جولين لوبيتيغي']],
  ['headcoaches', ['Marcelo Bielsa', 'Jorge Sampaoli'], ['Marcelo Bielsa', 'Jorge Sampaoli'], ['مارسيلو بيلسا', 'خورخي سامباولي']],
  ['headcoaches', ['Vincent Kompany', 'Mikel Arteta'], ['Vincent Kompany', 'Mikel Arteta'], ['فينسينت كومباني', 'ميكيل أرتيتا']],

  // football_clubs
  ['football_clubs', ['Chelsea FC', 'Arsenal FC'], ['Chelsea', 'Arsenal'], ['تشيلسي', 'أرسنال']],
  ['football_clubs', ['Atlético Madrid', 'Sevilla FC'], ['Atlético de Madrid', 'Séville FC'], ['أتلتيكو مدريد', 'إشبيلية']],
  ['football_clubs', ['Juventus', 'Napoli'], ['Juventus', 'Naples'], ['يوفنتوس', 'نابولي']],
  ['football_clubs', ['Tottenham Hotspur', 'West Ham United'], ['Tottenham', 'West Ham'], ['توتنهام هوتسبير', 'وست هام']],
  ['football_clubs', ['Celtic FC', 'Rangers FC'], ['Celtic', 'Rangers'], ['سلتيك غلاسكو', 'رينجرز']],

  // anime_heroes
  ['anime_heroes', ['Tanjiro Kamado', 'Zenitsu Agatsuma'], ['Tanjiro Kamado', 'Zenitsu Agatsuma'], ['تانجيرو كامادو', 'زينيتسو أغاتسوما']],
  ['anime_heroes', ['Saitama (One Punch Man)', 'Genos'], ['Saitama', 'Genos'], ['سايتاما', 'جينوس']],
  ['anime_heroes', ['Ichigo Kurosaki', 'Roronoa Zoro'], ['Ichigo Kurosaki', 'Roronoa Zoro'], ['إيتشيغو كوروساكي', 'رورونوا زورو']],
  ['anime_heroes', ['Thor', 'Loki'], ['Thor', 'Loki'], ['ثور', 'لوكي']],
  ['anime_heroes', ['Wolverine', 'Deadpool'], ['Wolverine', 'Deadpool'], ['وولفرين', 'ديدبول']],

  // cities_countries
  ['cities_countries', ['Milan', 'Madrid'], ['Milan', 'Madrid'], ['ميلانو', 'مدريد']],
  ['cities_countries', ['Sydney', 'Melbourne'], ['Sydney', 'Melbourne'], ['سيدني', 'ملبورن']],
  ['cities_countries', ['Kyoto', 'Osaka'], ['Kyoto', 'Osaka'], ['كيوتو', 'أوساكا']],
  ['cities_countries', ['Toronto', 'Vancouver'], ['Toronto', 'Vancouver'], ['تورونتو', 'فانكوفر']],
  ['cities_countries', ['Barcelona', 'Valencia'], ['Barcelone', 'Valence'], ['برشلونة', 'فالنسيا']],
];

// Extract ALL_PAIRS from generate_massive_words.js by reading the array text
const match = scriptContent.match(/const ALL_PAIRS = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error('Could not find ALL_PAIRS in generate_massive_words.js');
  process.exit(1);
}

// Convert new pairs to string
const newPairsFormatted = NEW_PAIRS.map(p => {
  return `  ['${p[0]}', [${JSON.stringify(p[1][0])}, ${JSON.stringify(p[1][1])}], [${JSON.stringify(p[2][0])}, ${JSON.stringify(p[2][1])}], [${JSON.stringify(p[3][0])}, ${JSON.stringify(p[3][1])}]],`;
}).join('\n');

// Insert new pairs before the end of ALL_PAIRS
const oldArrayStr = match[1];
const newArrayStr = oldArrayStr.replace(/\n\];$/, `,\n\n  // ───────────── ✨ EXPANDED WORDS FOR ALL CATEGORIES ─────────────\n${newPairsFormatted}\n];`);

scriptContent = scriptContent.replace(oldArrayStr, newArrayStr);

// Update template generation in generate_massive_words.js to include AVATARS, DEFAULT_GAME_SETTINGS, and INITIAL_WORDS
const oldTsTemplate = `import type { WordPair } from './types';\n\nexport const WORD_PAIRS: WordPair[] = [\n`;
const newTsTemplate = `import type { WordPair, GameSettings } from './types';

export const AVATARS = [
  '🕵️', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐨',
  '🦉', '🦅', '🦄', '🐲', '🐙', '🦈', '🐺', '🦝',
  '👑', '🧙', '🥷', '🦸', '🦹', '🤖', '👽', '👻',
  '⚽', '🏆', '🔥', '⚡', '🌟', '💎', '🚀', '🎯'
];

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  mrWhiteCount: 1,
  undercoverCount: 1,
  discussionTimeSeconds: 90,
  votingTimeSeconds: 30,
  categories: [],
  allowMrWhiteGuess: true,
  language: 'en',
};

export const WORD_PAIRS: WordPair[] = [\n`;

if (scriptContent.includes(oldTsTemplate)) {
  scriptContent = scriptContent.replace(oldTsTemplate, newTsTemplate);
}

const oldEnd = `};\n\nconst constantsPath`;
const newEnd = `};\n\nexport const INITIAL_WORDS: WordPair[] = WORD_PAIRS;\n\nconst constantsPath`;
if (scriptContent.includes(oldEnd)) {
  scriptContent = scriptContent.replace(oldEnd, newEnd);
}

fs.writeFileSync(scriptPath, scriptContent);
console.log('✅ Updated generate_massive_words.js with new words and full exports!');
