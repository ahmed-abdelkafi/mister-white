import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base categories with extensive lists
const FOOTBALLERS = [
  { en: ['Lionel Messi', 'Cristiano Ronaldo'], fr: ['Lionel Messi', 'Cristiano Ronaldo'], ar: ['ليونيل ميسي', 'كريستيانو رونالدو'] },
  { en: ['Kylian Mbappé', 'Erling Haaland'], fr: ['Kylian Mbappé', 'Erling Haaland'], ar: ['كيليان مبابي', 'إرلينغ هالاند'] },
  { en: ['Zinedine Zidane', 'Ronaldinho'], fr: ['Zinédine Zidane', 'Ronaldinho'], ar: ['زين الدين زيدان', 'رونالدينيو'] },
  { en: ['Karim Benzema', 'Robert Lewandowski'], fr: ['Karim Benzema', 'Robert Lewandowski'], ar: ['كريم بنزيما', 'روبرت ليفاندوفسكي'] },
  { en: ['Neymar Jr', 'Vinicius Jr'], fr: ['Neymar Jr', 'Vinicius Jr'], ar: ['نيمار جونيور', 'فينيسيوس جونيور'] },
  { en: ['Luka Modric', 'Toni Kroos'], fr: ['Luka Modric', 'Toni Kroos'], ar: ['لوكا مودريتش', 'توني كروس'] },
  { en: ['Mohamed Salah', 'Sadio Mané'], fr: ['Mohamed Salah', 'Sadio Mané'], ar: ['محمد صلاح', 'ساديو ماني'] },
  { en: ['Kevin De Bruyne', 'Bernardo Silva'], fr: ['Kevin De Bruyne', 'Bernardo Silva'], ar: ['كيفين دي بروين', 'برناردو سيلفا'] },
  { en: ['Andrés Iniesta', 'Xavi Hernandez'], fr: ['Andrés Iniesta', 'Xavi Hernandez'], ar: ['أندريس إنييستا', 'تشافي هيرنانديز'] },
  { en: ['Pelé', 'Diego Maradona'], fr: ['Pelé', 'Diego Maradona'], ar: ['بيليه', 'دييغو مارادونا'] },
  { en: ['Gianluigi Buffon', 'Iker Casillas'], fr: ['Gianluigi Buffon', 'Iker Casillas'], ar: ['جانلويجي بوفون', 'إيكر كاسياس'] },
  { en: ['Manuel Neuer', 'Thibaut Courtois'], fr: ['Manuel Neuer', 'Thibaut Courtois'], ar: ['مانويل نوير', 'تيبو كورتوا'] },
  { en: ['Sergio Ramos', 'Virgil van Dijk'], fr: ['Sergio Ramos', 'Virgil van Dijk'], ar: ['سيرجيو راموس', 'فيرجيل فان دايك'] },
  { en: ['Thierry Henry', 'Dennis Bergkamp'], fr: ['Thierry Henry', 'Dennis Bergkamp'], ar: ['Thierry Henry', 'Dennis Bergkamp'], ar: ['تييري هنري', 'دينيس بيركامب'] },
  { en: ['Kaká', 'Andriy Shevchenko'], fr: ['Kaká', 'Andriy Shevchenko'], ar: ['كاكا', 'أندري شيفتشينكو'] },
  { en: ['Zlatan Ibrahimović', 'Edinson Cavani'], fr: ['Zlatan Ibrahimović', 'Edinson Cavani'], ar: ['زلاتان إبراهيموفيتش', 'إدينسون كافاني'] },
  { en: ['Wayne Rooney', 'Harry Kane'], fr: ['Wayne Rooney', 'Harry Kane'], ar: ['واين روني', 'هاري كين'] },
  { en: ['Jude Bellingham', 'Pedri'], fr: ['Jude Bellingham', 'Pedri'], ar: ['جود بيلينغهام', 'بيدري'] },
  { en: ['Lamine Yamal', 'Arda Güler'], fr: ['Lamine Yamal', 'Arda Güler'], ar: ['لامين يامال', 'أردا جولر'] },
  { en: ['Achraf Hakimi', 'João Cancelo'], fr: ['Achraf Hakimi', 'João Cancelo'], ar: ['أشرف حكيمي', 'جواو كانسيلو'] },
  { en: ['Riyad Mahrez', 'Heung-Min Son'], fr: ['Riyad Mahrez', 'Son Heung-min'], ar: ['رياض محرز', 'سون هيونغ مين'] },
  { en: ['Ronaldo Nazário (R9)', 'Romário'], fr: ['Ronaldo (R9)', 'Romário'], ar: ['رونالدو البرازيلي (الظاهرة)', 'روماريو'] },
  { en: ['Antoine Griezmann', 'Ousmane Dembélé'], fr: ['Antoine Griezmann', 'Ousmane Dembélé'], ar: ['أنطوان غريزمان', 'عثمان ديمبيلي'] },
  { en: ['Bukayo Saka', 'Phil Foden'], fr: ['Bukayo Saka', 'Phil Foden'], ar: ['بوكايو ساكا', 'فيل فودين'] },
  { en: ['Rodri', 'Sergio Busquets'], fr: ['Rodri', 'Sergio Busquets'], ar: ['رودري', 'سيرجيو بوسكيتس'] }
];

const HEAD_COACHES = [
  { en: ['Pep Guardiola', 'Jürgen Klopp'], fr: ['Pep Guardiola', 'Jürgen Klopp'], ar: ['بيب غوارديولا', 'يورغن كلوب'] },
  { en: ['Carlo Ancelotti', 'José Mourinho'], fr: ['Carlo Ancelotti', 'José Mourinho'], ar: ['كارلو أنشيلوتي', 'جوزيه مورينيو'] },
  { en: ['Zinedine Zidane', 'Diego Simeone'], fr: ['Zinédine Zidane', 'Diego Simeone'], ar: ['زين الدين زيدان (مدرب)', 'دييغو سيميوني'] },
  { en: ['Sir Alex Ferguson', 'Arsène Wenger'], fr: ['Sir Alex Ferguson', 'Arsène Wenger'], ar: ['سير أليكس فيرغسون', 'أرسين فينغر'] },
  { en: ['Mikel Arteta', 'Xabi Alonso'], fr: ['Mikel Arteta', 'Xabi Alonso'], ar: ['ميكيل أرتيتا', 'تشابي ألونسو'] },
  { en: ['Hansi Flick', 'Julian Nagelsmann'], fr: ['Hansi Flick', 'Julian Nagelsmann'], ar: ['هانز فليك', 'يوليان ناغلسمان'] },
  { en: ['Thomas Tuchel', 'Antonio Conte'], fr: ['Thomas Tuchel', 'Antonio Conte'], ar: ['توماس توخيل', 'أنطونيو كونتي'] },
  { en: ['Luis Enrique', 'Unai Emery'], fr: ['Luis Enrique', 'Unai Emery'], ar: ['لويس إنريكي', 'أوناي إيمري'] },
  { en: ['Walid Regragui', 'Djamel Belmadi'], fr: ['Walid Regragui', 'Djamel Belmadi'], ar: ['وليد الركراكي', 'جمال بلماضي'] },
  { en: ['Didier Deschamps', 'Lionel Scaloni'], fr: ['Didier Deschamps', 'Lionel Scaloni'], ar: ['ديدييه ديشان', 'ليونيل سكالوني'] },
  { en: ['Marcelo Bielsa', 'Mauricio Pochettino'], fr: ['Marcelo Bielsa', 'Mauricio Pochettino'], ar: ['مارسيلو بيلسا', 'ماوريسيو بوكيتينو'] },
  { en: ['Erik ten Hag', 'Ruben Amorim'], fr: ['Erik ten Hag', 'Ruben Amorim'], ar: ['إريك تين هاج', 'روبين أموريم'] },
  { en: ['Fabio Capello', 'Marcello Lippi'], fr: ['Fabio Capello', 'Marcello Lippi'], ar: ['فابيو كابيلو', 'مارتشيلو ليبي'] },
  { en: ['Massimiliano Allegri', 'Luciano Spalletti'], fr: ['Massimiliano Allegri', 'Luciano Spalletti'], ar: ['ماسيميليانو أليغري', 'لوتشيانو سباليتي'] },
  { en: ['Roberto Mancini', 'Claudio Ranieri'], fr: ['Roberto Mancini', 'Claudio Ranieri'], ar: ['روبرتو مانشيني', 'كلاوديو رانييري'] }
];

const FOOTBALL_CLUBS = [
  { en: ['Real Madrid', 'FC Barcelona'], fr: ['Real Madrid', 'FC Barcelone'], ar: ['ريال مدريد', 'برشلونة'] },
  { en: ['Manchester City', 'Liverpool FC'], fr: ['Manchester City', 'Liverpool'], ar: ['مانشستر سيتي', 'ليفربول'] },
  { en: ['Manchester United', 'Arsenal'], fr: ['Manchester United', 'Arsenal'], ar: ['مانشستر يونايتد', 'أرسنال'] },
  { en: ['Paris Saint-Germain', 'Olympique de Marseille'], fr: ['Paris Saint-Germain', 'Olympique de Marseille'], ar: ['باريس سان جيرمان', 'أولمبيك مارسيليا'] },
  { en: ['Bayern Munich', 'Borussia Dortmund'], fr: ['Bayern Munich', 'Borussia Dortmund'], ar: ['بايرن ميونخ', 'بوروسيا دورتموند'] },
  { en: ['Inter Milan', 'AC Milan'], fr: ['Inter Milan', 'AC Milan'], ar: ['إنتر ميلان', 'إيه سي ميلان'] },
  { en: ['Juventus', 'AS Roma'], fr: ['Juventus', 'AS Rome'], ar: ['يوفنتوس', 'روما'] },
  { en: ['Al Hilal', 'Al Nassr'], fr: ['Al-Hilal', 'Al-Nassr'], ar: ['الهلال السعودي', 'النصر السعودي'] },
  { en: ['Al Ahly', 'Zamalek'], fr: ['Al Ahly', 'Zamalek'], ar: ['الأهلي المصري', 'الزمالك'] },
  { en: ['Chelsea FC', 'Tottenham Hotspur'], fr: ['Chelsea', 'Tottenham'], ar: ['تشيلسي', 'توتنهام'] },
  { en: ['Atlético Madrid', 'Sevilla FC'], fr: ['Atlético de Madrid', 'Séville FC'], ar: ['أتلتيكو مدريد', 'إشبيلية'] }
];

// Generate thousands of structured word combinations
const wordPairs = [];
let idCounter = 1;

function addList(list, category, difficulty = 'medium') {
  list.forEach((item) => {
    wordPairs.push({
      id: `wp_${idCounter++}`,
      category,
      difficulty,
      en: { civilian: item.en[0], undercover: item.en[1] },
      fr: { civilian: item.fr[0], undercover: item.fr[1] },
      ar: { civilian: item.ar[0], undercover: item.ar[1] }
    });
  });
}

addList(FOOTBALLERS, 'footballers', 'easy');
addList(HEAD_COACHES, 'headcoaches', 'medium');
addList(FOOTBALL_CLUBS, 'football_clubs', 'easy');

console.log(`Generated ${wordPairs.length} initial specialized sports word pairs.`);

// Export SQL & JSON
export { FOOTBALLERS, HEAD_COACHES, FOOTBALL_CLUBS, wordPairs };
