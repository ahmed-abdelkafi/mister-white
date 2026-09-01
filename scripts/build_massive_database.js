import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DATA = {
  footballers: [
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
    { en: ['Thierry Henry', 'Dennis Bergkamp'], fr: ['Thierry Henry', 'Dennis Bergkamp'], ar: ['تييري هنري', 'دينيس بيركامب'] },
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
    { en: ['Rodri', 'Sergio Busquets'], fr: ['Rodri', 'Sergio Busquets'], ar: ['رودري', 'سيرجيو بوسكيتس'] },
    { en: ['Luis Suárez', 'Sergio Agüero'], fr: ['Luis Suárez', 'Sergio Agüero'], ar: ['لويس سواريز', 'سيرجيو أجويرو'] },
    { en: ['Gareth Bale', 'Eden Hazard'], fr: ['Gareth Bale', 'Eden Hazard'], ar: ['غاريث بيل', 'إيدين هازارد'] },
    { en: ['David Beckham', 'Andrea Pirlo'], fr: ['David Beckham', 'Andrea Pirlo'], ar: ['ديفيد بيكهام', 'أندريا بيرلو'] },
    { en: ['Carles Puyol', 'Gerard Piqué'], fr: ['Carles Puyol', 'Gerard Piqué'], ar: ['كارليس بويول', 'جيرارد بيكيه'] },
    { en: ['Paul Pogba', 'N\'Golo Kanté'], fr: ['Paul Pogba', 'N\'Golo Kanté'], ar: ['بول بوغبا', 'نغولو كانتي'] },
    { en: ['Yassine Bounou', 'Emiliano Martínez'], fr: ['Yassine Bounou', 'Emiliano Martínez'], ar: ['ياسين بونو', 'إيميليانو مارتينيز'] },
    { en: ['Victor Osimhen', 'Alexander Isak'], fr: ['Victor Osimhen', 'Alexander Isak'], ar: ['فيكتور أوسيمين', 'ألكسندر إيزاك'] },
    { en: ['Lautaro Martínez', 'Julián Álvarez'], fr: ['Lautaro Martínez', 'Julián Álvarez'], ar: ['لاوتارو مارتينيز', 'جوليان ألفاريز'] },
    { en: ['Declan Rice', 'Moisés Caicedo'], fr: ['Declan Rice', 'Moisés Caicedo'], ar: ['ديكلان رايس', 'مويسيس كايسيدو'] },
    { en: ['Cole Palmer', 'Florian Wirtz'], fr: ['Cole Palmer', 'Florian Wirtz'], ar: ['كول بالمر', 'فلوريان فيرتز'] },
    { en: ['Jamal Musiala', 'Rafael Leão'], fr: ['Jamal Musiala', 'Rafael Leão'], ar: ['جمال موسيالا', 'رافائيل لياو'] }
  ],
  headcoaches: [
    { en: ['Pep Guardiola', 'Jürgen Klopp'], fr: ['Pep Guardiola', 'Jürgen Klopp'], ar: ['بيب غوارديولا', 'يورغن كلوب'] },
    { en: ['Carlo Ancelotti', 'José Mourinho'], fr: ['Carlo Ancelotti', 'José Mourinho'], ar: ['كارلو أنشيلوتي', 'جوزيه مورينيو'] },
    { en: ['Zinedine Zidane (Manager)', 'Diego Simeone'], fr: ['Zinédine Zidane (Entraîneur)', 'Diego Simeone'], ar: ['زين الدين زيدان (مدرب)', 'دييغو سيميوني'] },
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
    { en: ['Roberto Mancini', 'Claudio Ranieri'], fr: ['Roberto Mancini', 'Claudio Ranieri'], ar: ['روبرتو مانشيني', 'كلاوديو رانييري'] },
    { en: ['Simone Inzaghi', 'Thiago Motta'], fr: ['Simone Inzaghi', 'Thiago Motta'], ar: ['سيموني إنزاغي', 'تياغو موتا'] },
    { en: ['Ange Postecoglou', 'Eddie Howe'], fr: ['Ange Postecoglou', 'Eddie Howe'], ar: ['أنجي بوستيكوجلو', 'إيدي هاو'] }
  ],
  football_clubs: [
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
    { en: ['Atlético Madrid', 'Sevilla FC'], fr: ['Atlético de Madrid', 'Séville FC'], ar: ['أتلتيكو مدريد', 'إشبيلية'] },
    { en: ['Wydad Casablanca', 'Raja Casablanca'], fr: ['Wydad Casablanca', 'Raja Casablanca'], ar: ['الوداد البيضاوي', 'الرجاء البيضاوي'] },
    { en: ['Espérance de Tunis', 'Club Africain'], fr: ['Espérance de Tunis', 'Club Africain'], ar: ['الترجي التونسي', 'النادي الإفريقي'] },
    { en: ['Santiago Bernabéu', 'Camp Nou'], fr: ['Santiago Bernabéu', 'Camp Nou'], ar: ['ملعب سانتياغو برنابيو', 'ملعب كامب نو'] },
    { en: ['San Siro', 'Wembley Stadium'], fr: ['San Siro', 'Stade de Wembley'], ar: ['ملعب سان سيرو', 'ملعب ويمبلي'] }
  ],
  anime_movies: [
    { en: ['Goku', 'Vegeta'], fr: ['Goku', 'Vegeta'], ar: ['غوكو', 'فيجيتا'] },
    { en: ['Naruto Uzumaki', 'Sasuke Uchiha'], fr: ['Naruto Uzumaki', 'Sasuke Uchiha'], ar: ['ناروتو أوزوماكي', 'ساسكي أوتشيها'] },
    { en: ['Monkey D. Luffy', 'Roronoa Zoro'], fr: ['Monkey D. Luffy', 'Roronoa Zoro'], ar: ['مونكي دي لوفي', 'رورونوا زورو'] },
    { en: ['Eren Yeager', 'Levi Ackerman'], fr: ['Eren Jäger', 'Livaï Ackerman'], ar: ['إيرين ييغر', 'ليفاي أكرمان'] },
    { en: ['Batman', 'Superman'], fr: ['Batman', 'Superman'], ar: ['باتمان (الرجل الوطواط)', 'سوبرمان (الرجل الخارق)'] },
    { en: ['Iron Man', 'Captain America'], fr: ['Iron Man', 'Captain America'], ar: ['آيرون مان (الرجل الحديدي)', 'كابتن أمريكا'] },
    { en: ['Spider-Man', 'Deadpool'], fr: ['Spider-Man', 'Deadpool'], ar: ['سبايدرمان (الرجل العنكبوت)', 'ديدبول'] },
    { en: ['Joker', 'Thanos'], fr: ['Joker', 'Thanos'], ar: ['الجوكر', 'ثانوس'] },
    { en: ['Harry Potter', 'Lord Voldemort'], fr: ['Harry Potter', 'Lord Voldemort'], ar: ['هاري بوتر', 'فولدمورت'] },
    { en: ['Darth Vader', 'Luke Skywalker'], fr: ['Dark Vador', 'Luke Skywalker'], ar: ['دارث فيدر', 'لوك سكاي ووكر'] },
    { en: ['Light Yagami (Kira)', 'L (Death Note)'], fr: ['Light Yagami', 'L Lawliet'], ar: ['لايت ياغامي (كيرا)', 'إل (ديث نوت)'] },
    { en: ['Tanjiro Kamado', 'Nezuko Kamado'], fr: ['Tanjiro Kamado', 'Nezuko Kamado'], ar: ['تانجيرو كامادو', 'نيزوكو كامادو'] }
  ],
  cities_countries: [
    { en: ['Paris', 'London'], fr: ['Paris', 'Londres'], ar: ['باريس', 'لندن'] },
    { en: ['Tokyo', 'Seoul'], fr: ['Tokyo', 'Séoul'], ar: ['طوكيو', 'سيول'] },
    { en: ['Dubai', 'Doha'], fr: ['Dubaï', 'Doha'], ar: ['دبي', 'الدوحة'] },
    { en: ['Riyadh', 'Cairo'], fr: ['Riyad', 'Le Caire'], ar: ['الرياض', 'القاهرة'] },
    { en: ['New York', 'Los Angeles'], fr: ['New York', 'Los Angeles'], ar: ['نيويورك', 'لوس أنجلوس'] },
    { en: ['Rome', 'Athens'], fr: ['Rome', 'Athènes'], ar: ['روما', 'أثينا'] },
    { en: ['Madrid', 'Barcelona (City)'], fr: ['Madrid', 'Barcelone (Ville)'], ar: ['مدريد', 'برشلونة (مدينة)'] },
    { en: ['Tunis', 'Casablanca'], fr: ['Tunis', 'Casablanca'], ar: ['تونس العاصمة', 'الدار البيضاء'] },
    { en: ['Istanbul', 'Beirut'], fr: ['Istanbul', 'Beyrouth'], ar: ['إسطنبول', 'بيروت'] },
    { en: ['Morocco', 'Algeria'], fr: ['Maroc', 'Algérie'], ar: ['المغرب', 'الجزائر'] },
    { en: ['Saudi Arabia', 'United Arab Emirates'], fr: ['Arabie Saoudite', 'Émirats Arabes Unis'], ar: ['المملكة العربية السعودية', 'الإمارات العربية المتحدة'] },
    { en: ['France', 'Spain'], fr: ['France', 'Espagne'], ar: ['فرنسا', 'إسبانيا'] },
    { en: ['Germany', 'Italy'], fr: ['Allemagne', 'Italie'], ar: ['ألمانيا', 'إيطاليا'] },
    { en: ['Brazil', 'Argentina'], fr: ['Brésil', 'Argentine'], ar: ['البرازيل', 'الأرجنتين'] }
  ]
};

let id = 1;
const allPairs = [];

Object.entries(CATEGORIES_DATA).forEach(([cat, list]) => {
  list.forEach((item) => {
    allPairs.push({
      id: `wp_spec_${id++}`,
      category: cat,
      difficulty: 'medium',
      en: { civilian: item.en[0], undercover: item.en[1] },
      fr: { civilian: item.fr[0], undercover: item.fr[1] },
      ar: { civilian: item.ar[0], undercover: item.ar[1] }
    });
  });
});

fs.writeFileSync(
  path.join(__dirname, '../packages/shared/src/large_word_dataset.json'),
  JSON.stringify(allPairs, null, 2)
);

console.log(`Saved ${allPairs.length} specialized word pairs.`);
