import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive dictionary categories
const RAW_CATEGORIES = {
  footballers: [
    [['Lionel Messi', 'Cristiano Ronaldo'], ['Lionel Messi', 'Cristiano Ronaldo'], ['ليونيل ميسي', 'كريستيانو رونالدو']],
    [['Kylian Mbappé', 'Erling Haaland'], ['Kylian Mbappé', 'Erling Haaland'], ['كيليان مبابي', 'إرلينغ هالاند']],
    [['Zinedine Zidane', 'Ronaldinho'], ['Zinédine Zidane', 'Ronaldinho'], ['زين الدين زيدان', 'رونالدينيو']],
    [['Karim Benzema', 'Robert Lewandowski'], ['Karim Benzema', 'Robert Lewandowski'], ['كريم بنزيما', 'روبرت ليفاندوفسكي']],
    [['Neymar Jr', 'Vinicius Jr'], ['Neymar Jr', 'Vinicius Jr'], ['نيمار جونيور', 'فينيسيوس جونيور']],
    [['Luka Modric', 'Toni Kroos'], ['Luka Modric', 'Toni Kroos'], ['لوكا مودريتش', 'توني كروس']],
    [['Mohamed Salah', 'Sadio Mané'], ['Mohamed Salah', 'Sadio Mané'], ['محمد صلاح', 'ساديو ماني']],
    [['Kevin De Bruyne', 'Bernardo Silva'], ['Kevin De Bruyne', 'Bernardo Silva'], ['كيفين دي بروين', 'برناردو سيلفا']],
    [['Andrés Iniesta', 'Xavi Hernandez'], ['Andrés Iniesta', 'Xavi Hernandez'], ['أندريس إنييستا', 'تشافي هيرنانديز']],
    [['Pelé', 'Diego Maradona'], ['Pelé', 'Diego Maradona'], ['بيليه', 'دييغو مارادونا']],
    [['Gianluigi Buffon', 'Iker Casillas'], ['Gianluigi Buffon', 'Iker Casillas'], ['جانلويجي بوفون', 'إيكر كاسياس']],
    [['Manuel Neuer', 'Thibaut Courtois'], ['Manuel Neuer', 'Thibaut Courtois'], ['مانويل نوير', 'تيبو كورتوا']],
    [['Sergio Ramos', 'Virgil van Dijk'], ['Sergio Ramos', 'Virgil van Dijk'], ['سيرجيو راموس', 'فيرجيل فان دايك']],
    [['Thierry Henry', 'Dennis Bergkamp'], ['Thierry Henry', 'Dennis Bergkamp'], ['تييري هنري', 'دينيس بيركامب']],
    [['Kaká', 'Andriy Shevchenko'], ['Kaká', 'Andriy Shevchenko'], ['كاكا', 'أندري شيفتشينكو']],
    [['Zlatan Ibrahimović', 'Edinson Cavani'], ['Zlatan Ibrahimović', 'Edinson Cavani'], ['زلاتان إبراهيموفيتش', 'إدينسون كافاني']],
    [['Wayne Rooney', 'Harry Kane'], ['Wayne Rooney', 'Harry Kane'], ['واين روني', 'هاري كين']],
    [['Jude Bellingham', 'Pedri'], ['Jude Bellingham', 'Pedri'], ['جود بيلينغهام', 'بيدري']],
    [['Lamine Yamal', 'Arda Güler'], ['Lamine Yamal', 'Arda Güler'], ['لامين يامال', 'أردا جولر']],
    [['Achraf Hakimi', 'João Cancelo'], ['Achraf Hakimi', 'João Cancelo'], ['أشرف حكيمي', 'جواو كانسيلو']],
    [['Riyad Mahrez', 'Heung-Min Son'], ['Riyad Mahrez', 'Son Heung-min'], ['رياض محرز', 'سون هيونغ مين']],
    [['Ronaldo Nazário (R9)', 'Romário'], ['Ronaldo (R9)', 'Romário'], ['رونالدو البرازيلي (الظاهرة)', 'روماريو']],
    [['Antoine Griezmann', 'Ousmane Dembélé'], ['Antoine Griezmann', 'Ousmane Dembélé'], ['أنطوان غريزمان', 'عثمان ديمبيلي']],
    [['Bukayo Saka', 'Phil Foden'], ['Bukayo Saka', 'Phil Foden'], ['بوكايو ساكا', 'فيل فودين']],
    [['Rodri', 'Sergio Busquets'], ['Rodri', 'Sergio Busquets'], ['رودري', 'سيرجيو بوسكيتس']],
    [['Luis Suárez', 'Sergio Agüero'], ['Luis Suárez', 'Sergio Agüero'], ['لويس سواريز', 'سيرجيو أجويرو']],
    [['Gareth Bale', 'Eden Hazard'], ['Gareth Bale', 'Eden Hazard'], ['غاريث بيل', 'إيدين هازارد']],
    [['David Beckham', 'Andrea Pirlo'], ['David Beckham', 'Andrea Pirlo'], ['ديفيد بيكهام', 'أندريا بيرلو']],
    [['Carles Puyol', 'Gerard Piqué'], ['Carles Puyol', 'Gerard Piqué'], ['كارليس بويول', 'جيرارد بيكيه']],
    [['Paul Pogba', 'N\'Golo Kanté'], ['Paul Pogba', 'N\'Golo Kanté'], ['بول بوغبا', 'نغولو كانتي']],
    [['Yassine Bounou', 'Emiliano Martínez'], ['Yassine Bounou', 'Emiliano Martínez'], ['ياسين بونو', 'إيميليانو مارتينيز']],
    [['Victor Osimhen', 'Alexander Isak'], ['Victor Osimhen', 'Alexander Isak'], ['فيكتور أوسيمين', 'ألكسندر إيزاك']],
    [['Lautaro Martínez', 'Julián Álvarez'], ['Lautaro Martínez', 'Julián Álvarez'], ['لاوتارو مارتينيز', 'جوليان ألفاريز']],
    [['Declan Rice', 'Moisés Caicedo'], ['Declan Rice', 'Moisés Caicedo'], ['ديكلان رايس', 'مويسيس كايسيدو']],
    [['Cole Palmer', 'Florian Wirtz'], ['Cole Palmer', 'Florian Wirtz'], ['كول بالمر', 'فلوريان فيرتز']],
    [['Jamal Musiala', 'Rafael Leão'], ['Jamal Musiala', 'Rafael Leão'], ['جمال موسيالا', 'رافائيل لياو']],
    [['Federico Valverde', 'Eduardo Camavinga'], ['Federico Valverde', 'Eduardo Camavinga'], ['فيديريكو فالفيردي', 'إدواردو كامافينجا']],
    [['Alisson Becker', 'Ederson Moraes'], ['Alisson Becker', 'Ederson Moraes'], ['أليسون بيكر', 'إيدرسون مورايس']],
    [['Jan Oblak', 'Marc-André ter Stegen'], ['Jan Oblak', 'Marc-André ter Stegen'], ['يان أوبلاك', 'مارك أندريه تير شتيغن']],
    [['Didier Drogba', 'Samuel Eto\'o'], ['Didier Drogba', 'Samuel Eto\'o'], ['ديدييه دروغبا', 'صامويل إيتو']],
    [['Yaya Touré', 'Michael Essien'], ['Yaya Touré', 'Michael Essien'], ['يايا توريه', 'مايكل إيسيان']],
    [['Paolo Maldini', 'Franco Baresi'], ['Paolo Maldini', 'Franco Baresi'], ['باولو مالديني', 'فرانكو باريزي']],
    [['Alessandro Nesta', 'Fabio Cannavaro'], ['Alessandro Nesta', 'Fabio Cannavaro'], ['أليساندرو نيستا', 'فابيو كانافارو']],
    [['Gennaro Gattuso', 'Roy Keane'], ['Gennaro Gattuso', 'Roy Keane'], ['جينارو غاتوزو', 'روي كين']],
    [['Clarence Seedorf', 'Edgar Davids'], ['Clarence Seedorf', 'Edgar Davids'], ['كلارنس سيدورف', 'إدغار دافيدز']],
    [['Ruud van Nistelrooy', 'Robin van Persie'], ['Ruud van Nistelrooy', 'Robin van Persie'], ['رود فان نيستلروي', 'روبين فان بيرسي']],
    [['Franck Ribéry', 'Arjen Robben'], ['Franck Ribéry', 'Arjen Robben'], ['فرانك ريبيري', 'آريين روبن']],
    [['Trent Alexander-Arnold', 'Andy Robertson'], ['Trent Alexander-Arnold', 'Andy Robertson'], ['ترينت ألكسندر أرنولد', 'أندي روبرتسون']],
    [['Alphonso Davies', 'Theo Hernandez'], ['Alphonso Davies', 'Theo Hernandez'], ['ألفونسو ديفيز', 'ثيو هيرنانديز']],
    [['Gavi', 'Warren Zaïre-Emery'], ['Gavi', 'Warren Zaïre-Emery'], ['غافي', 'وارن زائير إيمري']]
  ],

  headcoaches: [
    [['Pep Guardiola', 'Jürgen Klopp'], ['Pep Guardiola', 'Jürgen Klopp'], ['بيب غوارديولا', 'يورغن كلوب']],
    [['Carlo Ancelotti', 'José Mourinho'], ['Carlo Ancelotti', 'José Mourinho'], ['كارلو أنشيلوتي', 'جوزيه مورينيو']],
    [['Zinedine Zidane (Manager)', 'Diego Simeone'], ['Zinédine Zidane (Entraîneur)', 'Diego Simeone'], ['زين الدين زيدان (مدرب)', 'دييغو سيميوني']],
    [['Sir Alex Ferguson', 'Arsène Wenger'], ['Sir Alex Ferguson', 'Arsène Wenger'], ['سير أليكس فيرغسون', 'أرسين فينغر']],
    [['Mikel Arteta', 'Xabi Alonso'], ['Mikel Arteta', 'Xabi Alonso'], ['ميكيل أرتيتا', 'تشابي ألونسو']],
    [['Hansi Flick', 'Julian Nagelsmann'], ['Hansi Flick', 'Julian Nagelsmann'], ['هانز فليك', 'يوليان ناغلسمان']],
    [['Thomas Tuchel', 'Antonio Conte'], ['Thomas Tuchel', 'Antonio Conte'], ['توماس توخيل', 'أنطونيو كونتي']],
    [['Luis Enrique', 'Unai Emery'], ['Luis Enrique', 'Unai Emery'], ['لويس إنريكي', 'أوناي إيمري']],
    [['Walid Regragui', 'Djamel Belmadi'], ['Walid Regragui', 'Djamel Belmadi'], ['وليد الركراكي', 'جمال بلماضي']],
    [['Didier Deschamps', 'Lionel Scaloni'], ['Didier Deschamps', 'Lionel Scaloni'], ['ديدييه ديشان', 'ليونيل سكالوني']],
    [['Marcelo Bielsa', 'Mauricio Pochettino'], ['Marcelo Bielsa', 'Mauricio Pochettino'], ['مارسيلو بيلسا', 'ماوريسيو بوكيتينو']],
    [['Erik ten Hag', 'Ruben Amorim'], ['Erik ten Hag', 'Ruben Amorim'], ['إريك تين هاج', 'روبين أموريم']],
    [['Fabio Capello', 'Marcello Lippi'], ['Fabio Capello', 'Marcello Lippi'], ['فابيو كابيلو', 'مارتشيلو ليبي']],
    [['Massimiliano Allegri', 'Luciano Spalletti'], ['Massimiliano Allegri', 'Luciano Spalletti'], ['ماسيميليانو أليغري', 'لوتشيانو سباليتي']],
    [['Roberto Mancini', 'Claudio Ranieri'], ['Roberto Mancini', 'Claudio Ranieri'], ['روبرتو مانشيني', 'كلاوديو رانييري']],
    [['Simone Inzaghi', 'Thiago Motta'], ['Simone Inzaghi', 'Thiago Motta'], ['سيموني إنزاغي', 'تياغو موتا']],
    [['Ange Postecoglou', 'Eddie Howe'], ['Ange Postecoglou', 'Eddie Howe'], ['أنجي بوستيكوجلو', 'إيدي هاو']],
    [['Roberto De Zerbi', 'Arne Slot'], ['Roberto De Zerbi', 'Arne Slot'], ['روبرتو دي زيربي', 'أرني سلوت']],
    [['Enzo Maresca', 'Gian Piero Gasperini'], ['Enzo Maresca', 'Gian Piero Gasperini'], ['إنزو ماريسكا', 'جان بييرو غاسبيريني']],
    [['Rafa Benitez', 'Louis van Gaal'], ['Rafa Benitez', 'Louis van Gaal'], ['رافا بينيتيز', 'لويس فان غال']],
    [['Guus Hiddink', 'Vicente del Bosque'], ['Guus Hiddink', 'Vicente del Bosque'], ['غوس هيدينك', 'فيسنتي ديل بوسكي']],
    [['Jupp Heynckes', 'Joachim Löw'], ['Jupp Heynckes', 'Joachim Löw'], ['يوب هاينكس', 'يواكيم لوف']]
  ],

  football_clubs: [
    [['Real Madrid', 'FC Barcelona'], ['Real Madrid', 'FC Barcelone'], ['ريال مدريد', 'برشلونة']],
    [['Manchester City', 'Liverpool FC'], ['Manchester City', 'Liverpool'], ['مانشستر سيتي', 'ليفربول']],
    [['Manchester United', 'Arsenal'], ['Manchester United', 'Arsenal'], ['مانشستر يونايتد', 'أرسنال']],
    [['Paris Saint-Germain', 'Olympique de Marseille'], ['Paris Saint-Germain', 'Olympique de Marseille'], ['باريس سان جيرمان', 'أولمبيك مارسيليا']],
    [['Bayern Munich', 'Borussia Dortmund'], ['Bayern Munich', 'Borussia Dortmund'], ['بايرن ميونخ', 'بوروسيا دورتموند']],
    [['Inter Milan', 'AC Milan'], ['Inter Milan', 'AC Milan'], ['إنتر ميلان', 'إيه سي ميلان']],
    [['Juventus', 'AS Roma'], ['Juventus', 'AS Rome'], ['يوفنتوس', 'روما']],
    [['Al Hilal', 'Al Nassr'], ['Al-Hilal', 'Al-Nassr'], ['الهلال السعودي', 'النصر السعودي']],
    [['Al Ahly', 'Zamalek'], ['Al Ahly', 'Zamalek'], ['الأهلي المصري', 'الزمالك']],
    [['Chelsea FC', 'Tottenham Hotspur'], ['Chelsea', 'Tottenham'], ['تشيلسي', 'توتنهام']],
    [['Atlético Madrid', 'Sevilla FC'], ['Atlético de Madrid', 'Séville FC'], ['أتلتيكو مدريد', 'إشبيلية']],
    [['Wydad Casablanca', 'Raja Casablanca'], ['Wydad Casablanca', 'Raja Casablanca'], ['الوداد البيضاوي', 'الرجاء البيضاوي']],
    [['Espérance de Tunis', 'Club Africain'], ['Espérance de Tunis', 'Club Africain'], ['الترجي التونسي', 'النادي الإفريقي']],
    [['Étoile du Sahel', 'CS Sfaxien'], ['Étoile du Sahel', 'CS Sfaxien'], ['النجم الساحلي', 'النادي الصفاقسي']],
    [['Boca Juniors', 'River Plate'], ['Boca Juniors', 'River Plate'], ['بوكا جونيورز', 'ريفر بليت']],
    [['Flamengo', 'Palmeiras'], ['Flamengo', 'Palmeiras'], ['فلامنغو', 'بالميراس']],
    [['Ajax Amsterdam', 'PSV Eindhoven'], ['Ajax Amsterdam', 'PSV Eindhoven'], ['أياكس أمستردام', 'بي إس في آيندهوفن']],
    [['Benfica', 'FC Porto'], ['Benfica', 'FC Porto'], ['بنفيكا', 'بورتو']],
    [['Celtic FC', 'Rangers FC'], ['Celtic Glasgow', 'Rangers FC'], ['سيلتيك', 'رينجرز']],
    [['Santiago Bernabéu', 'Camp Nou'], ['Santiago Bernabéu', 'Camp Nou'], ['ملعب سانتياغو برنابيو', 'ملعب كامب نو']],
    [['San Siro', 'Wembley Stadium'], ['San Siro', 'Stade de Wembley'], ['ملعب سان سيرو', 'ملعب ويمبلي']],
    [['Old Trafford', 'Anfield'], ['Old Trafford', 'Anfield'], ['ملعب أولد ترافورد', 'ملعب أنفيلد']],
    [['Allianz Arena', 'Signal Iduna Park'], ['Allianz Arena', 'Signal Iduna Park'], ['أليانز أرينا', 'سيغنال إيدونا بارك']],
    [['Stade de France', 'Maracanã'], ['Stade de France', 'Maracanã'], ['ستاد دو فرانس', 'ملعب ماراكانا']]
  ],

  anime_movies: [
    [['Goku', 'Vegeta'], ['Goku', 'Vegeta'], ['غوكو', 'فيجيتا']],
    [['Naruto Uzumaki', 'Sasuke Uchiha'], ['Naruto Uzumaki', 'Sasuke Uchiha'], ['ناروتو أوزوماكي', 'ساسكي أوتشيها']],
    [['Monkey D. Luffy', 'Roronoa Zoro'], ['Monkey D. Luffy', 'Roronoa Zoro'], ['مونكي دي لوفي', 'رورونوا زورو']],
    [['Eren Yeager', 'Levi Ackerman'], ['Eren Jäger', 'Livaï Ackerman'], ['إيرين ييغر', 'ليفاي أكرمان']],
    [['Batman', 'Superman'], ['Batman', 'Superman'], ['باتمان (الرجل الوطواط)', 'سوبرمان (الرجل الخارق)']],
    [['Iron Man', 'Captain America'], ['Iron Man', 'Captain America'], ['آيرون مان (الرجل الحديدي)', 'كابتن أمريكا']],
    [['Spider-Man', 'Deadpool'], ['Spider-Man', 'Deadpool'], ['سبايدرمان (الرجل العنكبوت)', 'ديدبول']],
    [['Joker', 'Thanos'], ['Joker', 'Thanos'], ['الجوكر', 'ثانوس']],
    [['Harry Potter', 'Lord Voldemort'], ['Harry Potter', 'Lord Voldemort'], ['هاري بوتر', 'فولدمورت']],
    [['Darth Vader', 'Luke Skywalker'], ['Dark Vador', 'Luke Skywalker'], ['دارث فيدر', 'لوك سكاي ووكر']],
    [['Light Yagami (Kira)', 'L (Death Note)'], ['Light Yagami', 'L Lawliet'], ['لايت ياغامي (كيرا)', 'إل (ديث نوت)']],
    [['Tanjiro Kamado', 'Nezuko Kamado'], ['Tanjiro Kamado', 'Nezuko Kamado'], ['تانجيرو كامادو', 'نيزوكو كامادو']],
    [['Gojo Satoru', 'Ryomen Sukuna'], ['Satoru Gojo', 'Ryomen Sukuna'], ['ساتورو غوجو', 'ريومين سوكونا']],
    [['Edward Elric', 'Alphonse Elric'], ['Edward Elric', 'Alphonse Elric'], ['إدوارد إلريك', 'ألفونس إلريك']],
    [['Thor', 'Loki'], ['Thor', 'Loki'], ['ثور', 'لوكي']],
    [['Wolverine', 'Magneto'], ['Wolverine', 'Magnéto'], ['وولفرين', 'ماغنيتو']],
    [['Sherlock Holmes', 'Professor Moriarty'], ['Sherlock Holmes', 'Professeur Moriarty'], ['شارلوك هولمز', 'البروفيسور موريارتي']],
    [['Gandalf', 'Sauron'], ['Gandalf', 'Sauron'], ['غاندالف', 'ساورون']],
    [['Frodo Baggins', 'Samwise Gamgee'], ['Frodon Sacquet', 'Samsagace Gamegie'], ['فرودو باجنز', 'ساموايز غامجي']],
    [['Jack Sparrow', 'Captain Barbossa'], ['Jack Sparrow', 'Capitaine Barbossa'], ['جاك سبارو', 'الكابتن باربوسا']]
  ],

  cities_countries: [
    [['Paris', 'London'], ['Paris', 'Londres'], ['باريس', 'لندن']],
    [['Tokyo', 'Seoul'], ['Tokyo', 'Séoul'], ['طوكيو', 'سيول']],
    [['Dubai', 'Doha'], ['Dubaï', 'Doha'], ['دبي', 'الدوحة']],
    [['Riyadh', 'Cairo'], ['Riyad', 'Le Caire'], ['الرياض', 'القاهرة']],
    [['New York', 'Los Angeles'], ['New York', 'Los Angeles'], ['نيويورك', 'لوس أنجلوس']],
    [['Rome', 'Athens'], ['Rome', 'Athènes'], ['روما', 'أثينا']],
    [['Madrid', 'Barcelona (City)'], ['Madrid', 'Barcelone (Ville)'], ['مدريد', 'برشلونة (مدينة)']],
    [['Tunis', 'Casablanca'], ['Tunis', 'Casablanca'], ['تونس العاصمة', 'الدار البيضاء']],
    [['Istanbul', 'Beirut'], ['Istanbul', 'Beyrouth'], ['إسطنبول', 'بيروت']],
    [['Morocco', 'Algeria'], ['Maroc', 'Algérie'], ['المغرب', 'الجزائر']],
    [['Saudi Arabia', 'United Arab Emirates'], ['Arabie Saoudite', 'Émirats Arabes Unis'], ['المملكة العربية السعودية', 'الإمارات العربية المتحدة']],
    [['France', 'Spain'], ['France', 'Espagne'], ['فرنسا', 'إسبانيا']],
    [['Germany', 'Italy'], ['Allemagne', 'Italie'], ['ألمانيا', 'إيطاليا']],
    [['Brazil', 'Argentina'], ['Brésil', 'Argentine'], ['البرازيل', 'الأرجنتين']],
    [['Canada', 'Australia'], ['Canada', 'Australie'], ['كندا', 'أستراليا']],
    [['Japan', 'China'], ['Japon', 'Chine'], ['اليابان', 'الصين']],
    [['United Kingdom', 'United States'], ['Royaume-Uni', 'États-Unis'], ['المملكة المتحدة', 'الولايات المتحدة الأمريكية']],
    [['Egypt', 'Iraq'], ['Égypte', 'Irak'], ['مصر', 'العراق']],
    [['Kuwait', 'Bahrain'], ['Koweït', 'Bahreïn'], ['الكويت', 'البحرين']],
    [['Oman', 'Jordan'], ['Oman', 'Jordanie'], ['سلطنة عمان', 'الأردن']]
  ]
};

// Build massive array
const allWordPairs = [];
let idCount = 1;

// 1. Add curated specialized categories
Object.entries(RAW_CATEGORIES).forEach(([cat, list]) => {
  list.forEach((item) => {
    allWordPairs.push({
      id: `wp_${idCount++}`,
      category: cat,
      difficulty: 'medium',
      en: { civilian: item[0][0], undercover: item[0][1] },
      fr: { civilian: item[1][0], undercover: item[1][1] },
      ar: { civilian: item[2][0], undercover: item[2][1] }
    });
  });
});

console.log(`Compiled ${allWordPairs.length} curated word pairs.`);

// Export as JSON and generate full SQL insert
fs.writeFileSync(
  path.join(__dirname, '../packages/shared/src/large_word_dataset.json'),
  JSON.stringify(allWordPairs, null, 2)
);

export { allWordPairs };
