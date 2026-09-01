import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read large_word_dataset
const specialized = JSON.parse(fs.readFileSync(path.join(__dirname, '../packages/shared/src/large_word_dataset.json'), 'utf-8'));

// Base existing categories
const BASE_WORDS = [
  { cat: 'food', en: ['Pizza', 'Burger'], fr: ['Pizza', 'Burger'], ar: ['بيتزا', 'برجر'] },
  { cat: 'food', en: ['Coffee', 'Tea'], fr: ['Café', 'Thé'], ar: ['قهوة', 'شاي'] },
  { cat: 'food', en: ['Ice Cream', 'Frozen Yogurt'], fr: ['Glace', 'Yaourt glacé'], ar: ['مثلجات (آيس كريم)', 'زبادي مثلج'] },
  { cat: 'food', en: ['Sushi', 'Ramen'], fr: ['Sushi', 'Ramen'], ar: ['سوشي', 'رامن'] },
  { cat: 'food', en: ['Chocolate', 'Vanilla'], fr: ['Chocolat', 'Vanille'], ar: ['شوكولاتة', 'فانيليا'] },
  { cat: 'food', en: ['Croissant', 'Baguette'], fr: ['Croissant', 'Baguette'], ar: ['كرواسون', 'خبز باجيت'] },
  { cat: 'food', en: ['Pasta', 'Lasagna'], fr: ['Pâtes', 'Lasagne'], ar: ['معكرونة', 'لازانيا'] },
  { cat: 'food', en: ['Apple', 'Pear'], fr: ['Pomme', 'Poire'], ar: ['تفاح', 'إجاص (كمثرى)'] },
  { cat: 'food', en: ['Orange Juice', 'Lemonade'], fr: ['Jus d\'orange', 'Limonade'], ar: ['عصير برتقال', 'عصير ليموناضة'] },
  { cat: 'food', en: ['Butter', 'Cheese'], fr: ['Beurre', 'Fromage'], ar: ['زبدة', 'جبن'] },
  { cat: 'food', en: ['Tacos', 'Burrito'], fr: ['Tacos', 'Burrito'], ar: ['تاكو', 'بوريتو'] },
  { cat: 'food', en: ['Milk', 'Yogurt'], fr: ['Lait', 'Yaourt'], ar: ['حليب', 'زبادي (لبن)'] },
  { cat: 'places', en: ['Eiffel Tower', 'Big Ben'], fr: ['Tour Eiffel', 'Big Ben'], ar: ['برج إيفل', 'ساعة بيغ بن'] },
  { cat: 'places', en: ['Pyramids of Giza', 'Great Wall of China'], fr: ['Pyramides de Gizeh', 'Grande Muraille de Chine'], ar: ['أهرامات الجيزة', 'سور الصين العظيم'] },
  { cat: 'places', en: ['Airport', 'Train Station'], fr: ['Aéroport', 'Gare ferroviaire'], ar: ['مطار', 'محطة قطار'] },
  { cat: 'places', en: ['Hospital', 'Clinic'], fr: ['Hôpital', 'Clinique'], ar: ['مستشفى', 'عيادة'] },
  { cat: 'places', en: ['Museum', 'Art Gallery'], fr: ['Musée', 'Galerie d\'art'], ar: ['متحف', 'معرض فني'] },
  { cat: 'places', en: ['Supermarket', 'Bakery'], fr: ['Supermarché', 'Boulangerie'], ar: ['سوبرماركت', 'مخبز'] },
  { cat: 'places', en: ['Colosseum', 'Taj Mahal'], fr: ['Colisée', 'Taj Mahal'], ar: ['الكولوسيوم', 'تاج محل'] },
  { cat: 'places', en: ['Beach', 'Swimming Pool'], fr: ['Plage', 'Piscine'], ar: ['شاطئ البحر', 'مسبح'] },
  { cat: 'animals', en: ['Lion', 'Tiger'], fr: ['Lion', 'Tigre'], ar: ['أسد', 'نمر'] },
  { cat: 'animals', en: ['Dolphin', 'Whale'], fr: ['Dauphin', 'Baleine'], ar: ['دولفين', 'حوت'] },
  { cat: 'animals', en: ['Cat', 'Dog'], fr: ['Chat', 'Chien'], ar: ['قطة', 'كلب'] },
  { cat: 'animals', en: ['Eagle', 'Hawk'], fr: ['Aigle', 'Faucon'], ar: ['نسر', 'صقر'] },
  { cat: 'animals', en: ['Elephant', 'Rhinoceros'], fr: ['Éléphant', 'Rhinocéros'], ar: ['فيل', 'وحيد القرن'] },
  { cat: 'animals', en: ['Horse', 'Camel'], fr: ['Cheval', 'Chameau'], ar: ['حصان', 'جمل'] },
  { cat: 'animals', en: ['Wolf', 'Fox'], fr: ['Loup', 'Renard'], ar: ['ذئب', 'ثعلب'] },
  { cat: 'animals', en: ['Shark', 'Crocodile'], fr: ['Requin', 'Crocodile'], ar: ['قرش', 'تمساح'] },
  { cat: 'technology', en: ['Smartphone', 'Tablet'], fr: ['Smartphone', 'Tablette'], ar: ['هاتف ذكي', 'جهاز لوحي'] },
  { cat: 'technology', en: ['Laptop', 'Desktop Computer'], fr: ['Ordinateur portable', 'Ordinateur de bureau'], ar: ['كمبيوتر محمول', 'كمبيوتر مكتبي'] },
  { cat: 'technology', en: ['WiFi', 'Bluetooth'], fr: ['Wi-Fi', 'Bluetooth'], ar: ['واي فاي', 'بلوتوث'] },
  { cat: 'technology', en: ['Smartwatch', 'Fitness Tracker'], fr: ['Montre connectée', 'Bracelet connecté'], ar: ['ساعة ذكية', 'سوار لياقة'] },
  { cat: 'technology', en: ['Headphones', 'Earbuds'], fr: ['Casque audio', 'Écouteurs'], ar: ['سماعات رأس', 'سماعات أذن'] },
  { cat: 'technology', en: ['Keyboard', 'Mouse'], fr: ['Clavier', 'Souris d\'ordinateur'], ar: ['لوحة مفاتيح', 'فأرة كمبيوتر'] },
  { cat: 'technology', en: ['Camera', 'Camcorder'], fr: ['Appareil photo', 'Caméscope'], ar: ['كاميرا تصوير', 'كاميرا فيديو'] },
  { cat: 'objects', en: ['Glasses', 'Sunglasses'], fr: ['Lunettes', 'Lunettes de soleil'], ar: ['نظارات', 'نظارات شمسية'] },
  { cat: 'objects', en: ['Backpack', 'Handbag'], fr: ['Sac à dos', 'Sac à main'], ar: ['حقيبة ظهر', 'حقيبة يد'] },
  { cat: 'objects', en: ['Pen', 'Pencil'], fr: ['Stylo', 'Crayon'], ar: ['قلم جاف', 'قلم رصاص'] },
  { cat: 'objects', en: ['Umbrella', 'Raincoat'], fr: ['Parapluie', 'Imperméable'], ar: ['مظلة مطر', 'معطف واق من المطر'] },
  { cat: 'sports', en: ['Football (Soccer)', 'Basketball'], fr: ['Football', 'Basketball'], ar: ['كرة القدم', 'كرة السلة'] },
  { cat: 'sports', en: ['Tennis', 'Badminton'], fr: ['Tennis', 'Badminton'], ar: ['تنس', 'ريشة طائرة'] },
  { cat: 'sports', en: ['Swimming', 'Diving'], fr: ['Natation', 'Plongée'], ar: ['سباحة', 'غوص'] },
  { cat: 'nature', en: ['Sun', 'Moon'], fr: ['Soleil', 'Lune'], ar: ['شمس', 'قمر'] },
  { cat: 'nature', en: ['Sea', 'Lake'], fr: ['Mer', 'Lac'], ar: ['بحر', 'بحيرة'] },
  { cat: 'professions', en: ['Doctor', 'Nurse'], fr: ['Médecin', 'Infirmier'], ar: ['طبيب', 'ممرض'] },
  { cat: 'professions', en: ['Pilot', 'Flight Attendant'], fr: ['Pilote de ligne', 'Hôtesse de l\'air'], ar: ['طيار', 'مضيف طيران'] },
  { cat: 'transport', en: ['Airplane', 'Helicopter'], fr: ['Avion', 'Hélicoptère'], ar: ['طائرة', 'طائرة مروحية (هيلوكوبتر)'] },
  { cat: 'arts', en: ['Guitar', 'Violin'], fr: ['Guitare', 'Violon'], ar: ['غيتار', 'كمان'] }
];

const combined = [];
let idCounter = 1;

// 1. Add base words
BASE_WORDS.forEach((item) => {
  combined.push({
    id: `wp_${idCounter++}`,
    category: item.cat,
    difficulty: 'easy',
    en: { civilian: item.en[0], undercover: item.en[1] },
    fr: { civilian: item.fr[0], undercover: item.fr[1] },
    ar: { civilian: item.ar[0], undercover: item.ar[1] }
  });
});

// 2. Add specialized words (Footballers, Head Coaches, Clubs, Anime, etc.)
specialized.forEach((item) => {
  combined.push({
    id: `wp_${idCounter++}`,
    category: item.category,
    difficulty: item.difficulty || 'medium',
    en: item.en,
    fr: item.fr,
    ar: item.ar
  });
});

console.log(`Total word pairs compiled: ${combined.length}`);

// Generate SQL Insert statements
let sql = `-- Seed comprehensive word bank including Footballers, Head Coaches, and Clubs\n\n`;
sql += `INSERT OR REPLACE INTO word_pairs (id, category, difficulty, word_en_civilian, word_en_undercover, word_fr_civilian, word_fr_undercover, word_ar_civilian, word_ar_undercover) VALUES\n`;

const rows = combined.map((p) => {
  const esc = (s) => (s ? s.replace(/'/g, "''") : '');
  return `('${esc(p.id)}', '${esc(p.category)}', '${esc(p.difficulty)}', '${esc(p.en.civilian)}', '${esc(p.en.undercover)}', '${esc(p.fr.civilian)}', '${esc(p.fr.undercover)}', '${esc(p.ar.civilian)}', '${esc(p.ar.undercover)}')`;
});

sql += rows.join(',\n') + ';\n';

fs.writeFileSync(path.join(__dirname, '../apps/worker/populate_all.sql'), sql);
console.log(`Generated SQL file with ${rows.length} records in apps/worker/populate_all.sql`);

// Also update packages/shared/src/constants.ts
const tsContent = `import { GameSettings, Role, WordPair } from './types';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  mrWhiteCount: 1,
  undercoverCount: 0,
  discussionTimeSeconds: 90,
  votingTimeSeconds: 45,
  categories: ['footballers', 'headcoaches', 'football_clubs', 'anime_movies', 'food', 'places', 'objects', 'technology', 'animals', 'sports', 'nature', 'professions', 'transport', 'arts'],
  allowMrWhiteGuess: true,
  language: 'en',
};

export const AVATARS = [
  '🕵️', '🎩', '🕶️', '🎭', '🔍', '🦊', '🦉', '🐱',
  '🦁', '🐼', '🤖', '👑', '🧙', '👽', '🦄', '👻',
  '⚽', '🏆', '👟', '🏟️', '🐯', '🐨', '🦖', '🚀'
];

export const INITIAL_WORDS: WordPair[] = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../packages/shared/src/constants.ts'), tsContent);
console.log(`Updated packages/shared/src/constants.ts with ${combined.length} word pairs.`);
