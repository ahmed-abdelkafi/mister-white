// Massive trilingual word pair generator for Mister White
// Generates populate_all.sql and updates constants.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════
// COMPLETE WORD PAIRS DATABASE — EN / FR / AR
// Format: [category, [en_civilian, en_undercover], [fr_civilian, fr_undercover], [ar_civilian, ar_undercover]]
// ═══════════════════════════════════════════════════════════

const ALL_PAIRS = [

  // ───────────── 🍎 FRUITS (15) ─────────────
  ['fruits', ['Apple', 'Pear'], ['Pomme', 'Poire'], ['تفاحة', 'إجاصة']],
  ['fruits', ['Banana', 'Plantain'], ['Banane', 'Banane plantain'], ['موزة', 'موز الجنة']],
  ['fruits', ['Orange', 'Tangerine'], ['Orange', 'Mandarine'], ['برتقالة', 'يوسفي']],
  ['fruits', ['Strawberry', 'Raspberry'], ['Fraise', 'Framboise'], ['فراولة', 'توت العليق']],
  ['fruits', ['Watermelon', 'Melon'], ['Pastèque', 'Melon'], ['بطيخ أحمر', 'شمام']],
  ['fruits', ['Grape', 'Blueberry'], ['Raisin', 'Myrtille'], ['عنب', 'توت أزرق']],
  ['fruits', ['Mango', 'Papaya'], ['Mangue', 'Papaye'], ['مانجو', 'بابايا']],
  ['fruits', ['Peach', 'Apricot'], ['Pêche', 'Abricot'], ['خوخ', 'مشمش']],
  ['fruits', ['Pineapple', 'Coconut'], ['Ananas', 'Noix de coco'], ['أناناس', 'جوز الهند']],
  ['fruits', ['Cherry', 'Cranberry'], ['Cerise', 'Canneberge'], ['كرز', 'توت بري']],
  ['fruits', ['Lemon', 'Lime'], ['Citron', 'Citron vert'], ['ليمون', 'ليمون أخضر']],
  ['fruits', ['Kiwi', 'Fig'], ['Kiwi', 'Figue'], ['كيوي', 'تين']],
  ['fruits', ['Pomegranate', 'Passion Fruit'], ['Grenade', 'Fruit de la passion'], ['رمان', 'فاكهة العاطفة']],
  ['fruits', ['Date', 'Prune'], ['Datte', 'Pruneau'], ['تمر', 'برقوق مجفف']],
  ['fruits', ['Avocado', 'Guava'], ['Avocat', 'Goyave'], ['أفوكادو', 'جوافة']],

  // ───────────── 🥕 VEGETABLES (15) ─────────────
  ['vegetables', ['Carrot', 'Parsnip'], ['Carotte', 'Panais'], ['جزر', 'جزر أبيض']],
  ['vegetables', ['Potato', 'Sweet Potato'], ['Pomme de terre', 'Patate douce'], ['بطاطس', 'بطاطا حلوة']],
  ['vegetables', ['Tomato', 'Bell Pepper'], ['Tomate', 'Poivron'], ['طماطم', 'فلفل حلو']],
  ['vegetables', ['Onion', 'Garlic'], ['Oignon', 'Ail'], ['بصل', 'ثوم']],
  ['vegetables', ['Cucumber', 'Zucchini'], ['Concombre', 'Courgette'], ['خيار', 'كوسة']],
  ['vegetables', ['Lettuce', 'Cabbage'], ['Laitue', 'Chou'], ['خس', 'ملفوف']],
  ['vegetables', ['Broccoli', 'Cauliflower'], ['Brocoli', 'Chou-fleur'], ['بروكلي', 'قرنبيط']],
  ['vegetables', ['Spinach', 'Kale'], ['Épinards', 'Chou frisé'], ['سبانخ', 'كرنب أجعد']],
  ['vegetables', ['Eggplant', 'Squash'], ['Aubergine', 'Courge'], ['باذنجان', 'قرع']],
  ['vegetables', ['Corn', 'Peas'], ['Maïs', 'Petits pois'], ['ذرة', 'بازلاء']],
  ['vegetables', ['Celery', 'Asparagus'], ['Céleri', 'Asperge'], ['كرفس', 'هليون']],
  ['vegetables', ['Radish', 'Turnip'], ['Radis', 'Navet'], ['فجل', 'لفت']],
  ['vegetables', ['Mushroom', 'Truffle'], ['Champignon', 'Truffe'], ['فطر', 'كمأ']],
  ['vegetables', ['Artichoke', 'Fennel'], ['Artichaut', 'Fenouil'], ['خرشوف', 'شمر']],
  ['vegetables', ['Bean', 'Lentil'], ['Haricot', 'Lentille'], ['فاصوليا', 'عدس']],

  // ───────────── 🚗 CARS (15) ─────────────
  ['cars', ['BMW', 'Mercedes-Benz'], ['BMW', 'Mercedes-Benz'], ['بي إم دبليو', 'مرسيدس بنز']],
  ['cars', ['Ferrari', 'Lamborghini'], ['Ferrari', 'Lamborghini'], ['فيراري', 'لامبورغيني']],
  ['cars', ['Toyota', 'Honda'], ['Toyota', 'Honda'], ['تويوتا', 'هوندا']],
  ['cars', ['Audi', 'Porsche'], ['Audi', 'Porsche'], ['أودي', 'بورشه']],
  ['cars', ['Ford', 'Chevrolet'], ['Ford', 'Chevrolet'], ['فورد', 'شيفروليه']],
  ['cars', ['Tesla', 'Rivian'], ['Tesla', 'Rivian'], ['تسلا', 'ريفيان']],
  ['cars', ['Volkswagen', 'Peugeot'], ['Volkswagen', 'Peugeot'], ['فولكسفاغن', 'بيجو']],
  ['cars', ['Range Rover', 'Land Cruiser'], ['Range Rover', 'Land Cruiser'], ['رينج روفر', 'لاند كروزر']],
  ['cars', ['Rolls Royce', 'Bentley'], ['Rolls Royce', 'Bentley'], ['رولز رويس', 'بنتلي']],
  ['cars', ['McLaren', 'Bugatti'], ['McLaren', 'Bugatti'], ['ماكلارين', 'بوغاتي']],
  ['cars', ['Nissan', 'Mazda'], ['Nissan', 'Mazda'], ['نيسان', 'مازدا']],
  ['cars', ['Renault', 'Citroën'], ['Renault', 'Citroën'], ['رينو', 'ستروين']],
  ['cars', ['Hyundai', 'Kia'], ['Hyundai', 'Kia'], ['هيونداي', 'كيا']],
  ['cars', ['Jaguar', 'Aston Martin'], ['Jaguar', 'Aston Martin'], ['جاكوار', 'أستون مارتن']],
  ['cars', ['Fiat', 'Alfa Romeo'], ['Fiat', 'Alfa Romeo'], ['فيات', 'ألفا روميو']],

  // ───────────── 🍔 FOOD & DISHES (15) ─────────────
  ['food', ['Pizza', 'Burger'], ['Pizza', 'Burger'], ['بيتزا', 'برغر']],
  ['food', ['Sushi', 'Sashimi'], ['Sushi', 'Sashimi'], ['سوشي', 'ساشيمي']],
  ['food', ['Pasta', 'Noodles'], ['Pâtes', 'Nouilles'], ['معكرونة', 'نودلز']],
  ['food', ['Couscous', 'Rice'], ['Couscous', 'Riz'], ['كسكس', 'أرز']],
  ['food', ['Croissant', 'Brioche'], ['Croissant', 'Brioche'], ['كرواسون', 'بريوش']],
  ['food', ['Tacos', 'Burrito'], ['Tacos', 'Burrito'], ['تاكوس', 'بوريتو']],
  ['food', ['Kebab', 'Shawarma'], ['Kebab', 'Shawarma'], ['كباب', 'شاورما']],
  ['food', ['Steak', 'Ribs'], ['Steak', 'Côtes'], ['ستيك', 'ريش']],
  ['food', ['Soup', 'Stew'], ['Soupe', 'Ragoût'], ['شوربة', 'يخنة']],
  ['food', ['Pancake', 'Waffle'], ['Crêpe', 'Gaufre'], ['بان كيك', 'وافل']],
  ['food', ['Falafel', 'Hummus'], ['Falafel', 'Houmous'], ['فلافل', 'حمص']],
  ['food', ['Bread', 'Baguette'], ['Pain', 'Baguette'], ['خبز', 'باكيت']],
  ['food', ['Omelette', 'Scrambled Eggs'], ['Omelette', 'Œufs brouillés'], ['أومليت', 'بيض مخفوق']],
  ['food', ['Lasagna', 'Moussaka'], ['Lasagne', 'Moussaka'], ['لازانيا', 'مسقعة']],
  ['food', ['Paella', 'Risotto'], ['Paëlla', 'Risotto'], ['بايلا', 'ريزوتو']],

  // ───────────── ☕ DRINKS & BEVERAGES (12) ─────────────
  ['drinks', ['Coffee', 'Tea'], ['Café', 'Thé'], ['قهوة', 'شاي']],
  ['drinks', ['Coca-Cola', 'Pepsi'], ['Coca-Cola', 'Pepsi'], ['كوكاكولا', 'بيبسي']],
  ['drinks', ['Orange Juice', 'Lemonade'], ['Jus d\'orange', 'Limonade'], ['عصير برتقال', 'ليمونادة']],
  ['drinks', ['Milk', 'Yogurt'], ['Lait', 'Yaourt'], ['حليب', 'زبادي']],
  ['drinks', ['Water', 'Sparkling Water'], ['Eau', 'Eau gazeuse'], ['ماء', 'ماء فوار']],
  ['drinks', ['Hot Chocolate', 'Cappuccino'], ['Chocolat chaud', 'Cappuccino'], ['شوكولاتة ساخنة', 'كابتشينو']],
  ['drinks', ['Espresso', 'Americano'], ['Espresso', 'Americano'], ['إسبريسو', 'أمريكانو']],
  ['drinks', ['Smoothie', 'Milkshake'], ['Smoothie', 'Milkshake'], ['سموذي', 'ميلك شيك']],
  ['drinks', ['Latte', 'Mocha'], ['Latte', 'Mocha'], ['لاتيه', 'موكا']],
  ['drinks', ['Mint Tea', 'Green Tea'], ['Thé à la menthe', 'Thé vert'], ['شاي بالنعناع', 'شاي أخضر']],
  ['drinks', ['Iced Tea', 'Iced Coffee'], ['Thé glacé', 'Café glacé'], ['شاي مثلج', 'قهوة مثلجة']],
  ['drinks', ['Energy Drink', 'Sports Drink'], ['Boisson énergisante', 'Boisson sportive'], ['مشروب طاقة', 'مشروب رياضي']],

  // ───────────── 🍰 DESSERTS & SWEETS (10) ─────────────
  ['desserts', ['Ice Cream', 'Sorbet'], ['Glace', 'Sorbet'], ['آيس كريم', 'سوربيه']],
  ['desserts', ['Chocolate', 'Caramel'], ['Chocolat', 'Caramel'], ['شوكولاتة', 'كراميل']],
  ['desserts', ['Cake', 'Pie'], ['Gâteau', 'Tarte'], ['كعكة', 'فطيرة']],
  ['desserts', ['Cookie', 'Biscuit'], ['Cookie', 'Biscuit'], ['كوكيز', 'بسكويت']],
  ['desserts', ['Donut', 'Muffin'], ['Beignet', 'Muffin'], ['دونات', 'مافن']],
  ['desserts', ['Brownie', 'Fudge'], ['Brownie', 'Fudge'], ['براوني', 'فدج']],
  ['desserts', ['Macarons', 'Meringue'], ['Macarons', 'Meringue'], ['ماكرون', 'ميرانغ']],
  ['desserts', ['Tiramisu', 'Panna Cotta'], ['Tiramisu', 'Panna cotta'], ['تيراميسو', 'بانا كوتا']],
  ['desserts', ['Baklava', 'Kunafa'], ['Baklava', 'Kunafa'], ['بقلاوة', 'كنافة']],
  ['desserts', ['Crème Brûlée', 'Flan'], ['Crème brûlée', 'Flan'], ['كريم بروليه', 'فلان']],

  // ───────────── 🎵 MUSIC & INSTRUMENTS (15) ─────────────
  ['music', ['Guitar', 'Ukulele'], ['Guitare', 'Ukulélé'], ['غيتار', 'يوكيليلي']],
  ['music', ['Piano', 'Organ'], ['Piano', 'Orgue'], ['بيانو', 'أرغن']],
  ['music', ['Violin', 'Cello'], ['Violon', 'Violoncelle'], ['كمان', 'تشيلو']],
  ['music', ['Drums', 'Tambourine'], ['Batterie', 'Tambourin'], ['طبول', 'دف']],
  ['music', ['Trumpet', 'Saxophone'], ['Trompette', 'Saxophone'], ['بوق', 'ساكسفون']],
  ['music', ['Flute', 'Clarinet'], ['Flûte', 'Clarinette'], ['ناي', 'كلارينيت']],
  ['music', ['Rap', 'Hip-Hop'], ['Rap', 'Hip-Hop'], ['راب', 'هيب هوب']],
  ['music', ['Rock', 'Metal'], ['Rock', 'Métal'], ['روك', 'ميتال']],
  ['music', ['Jazz', 'Blues'], ['Jazz', 'Blues'], ['جاز', 'بلوز']],
  ['music', ['Pop', 'R&B'], ['Pop', 'R&B'], ['بوب', 'آر أند بي']],
  ['music', ['DJ', 'Producer'], ['DJ', 'Producteur'], ['دي جي', 'منتج موسيقي']],
  ['music', ['Concert', 'Festival'], ['Concert', 'Festival'], ['حفلة موسيقية', 'مهرجان']],
  ['music', ['Microphone', 'Speaker'], ['Microphone', 'Haut-parleur'], ['ميكروفون', 'مكبر صوت']],
  ['music', ['Headphones', 'Earbuds'], ['Casque', 'Écouteurs'], ['سماعات رأس', 'سماعات أذن']],
  ['music', ['Spotify', 'Apple Music'], ['Spotify', 'Apple Music'], ['سبوتيفاي', 'أبل ميوزك']],

  // ───────────── 👕 CLOTHING (15) ─────────────
  ['clothing', ['T-Shirt', 'Polo'], ['T-shirt', 'Polo'], ['تي شيرت', 'بولو']],
  ['clothing', ['Jeans', 'Chinos'], ['Jean', 'Chino'], ['جينز', 'تشينو']],
  ['clothing', ['Sneakers', 'Boots'], ['Baskets', 'Bottes'], ['أحذية رياضية', 'أحذية طويلة']],
  ['clothing', ['Jacket', 'Coat'], ['Veste', 'Manteau'], ['جاكيت', 'معطف']],
  ['clothing', ['Hat', 'Cap'], ['Chapeau', 'Casquette'], ['قبعة', 'طاقية']],
  ['clothing', ['Scarf', 'Tie'], ['Écharpe', 'Cravate'], ['وشاح', 'ربطة عنق']],
  ['clothing', ['Dress', 'Skirt'], ['Robe', 'Jupe'], ['فستان', 'تنورة']],
  ['clothing', ['Socks', 'Stockings'], ['Chaussettes', 'Bas'], ['جوارب قصيرة', 'جوارب طويلة']],
  ['clothing', ['Sweater', 'Hoodie'], ['Pull', 'Sweat à capuche'], ['كنزة', 'هودي']],
  ['clothing', ['Suit', 'Tuxedo'], ['Costume', 'Smoking'], ['بدلة', 'توكسيدو']],
  ['clothing', ['Sandals', 'Flip-flops'], ['Sandales', 'Tongs'], ['صندل', 'شبشب']],
  ['clothing', ['Gloves', 'Mittens'], ['Gants', 'Moufles'], ['قفازات', 'قفازات بدون أصابع']],
  ['clothing', ['Belt', 'Suspenders'], ['Ceinture', 'Bretelles'], ['حزام', 'حمالات']],
  ['clothing', ['Sunglasses', 'Glasses'], ['Lunettes de soleil', 'Lunettes de vue'], ['نظارات شمسية', 'نظارات طبية']],
  ['clothing', ['Watch', 'Bracelet'], ['Montre', 'Bracelet'], ['ساعة يد', 'سوار']],

  // ───────────── 🏠 HOME & FURNITURE (15) ─────────────
  ['furniture', ['Sofa', 'Armchair'], ['Canapé', 'Fauteuil'], ['أريكة', 'كرسي بذراعين']],
  ['furniture', ['Bed', 'Mattress'], ['Lit', 'Matelas'], ['سرير', 'فرشة']],
  ['furniture', ['Table', 'Desk'], ['Table', 'Bureau'], ['طاولة', 'مكتب']],
  ['furniture', ['Chair', 'Stool'], ['Chaise', 'Tabouret'], ['كرسي', 'مقعد']],
  ['furniture', ['Lamp', 'Chandelier'], ['Lampe', 'Lustre'], ['مصباح', 'ثريا']],
  ['furniture', ['Mirror', 'Window'], ['Miroir', 'Fenêtre'], ['مرآة', 'نافذة']],
  ['furniture', ['Door', 'Gate'], ['Porte', 'Portail'], ['باب', 'بوابة']],
  ['furniture', ['Kitchen', 'Bathroom'], ['Cuisine', 'Salle de bain'], ['مطبخ', 'حمام']],
  ['furniture', ['Oven', 'Microwave'], ['Four', 'Micro-ondes'], ['فرن', 'ميكروويف']],
  ['furniture', ['Refrigerator', 'Freezer'], ['Réfrigérateur', 'Congélateur'], ['ثلاجة', 'فريزر']],
  ['furniture', ['Washing Machine', 'Dryer'], ['Machine à laver', 'Sèche-linge'], ['غسالة', 'مجففة']],
  ['furniture', ['Carpet', 'Rug'], ['Moquette', 'Tapis'], ['سجادة كبيرة', 'سجادة صغيرة']],
  ['furniture', ['Curtain', 'Blinds'], ['Rideau', 'Store'], ['ستارة', 'ستائر شرائح']],
  ['furniture', ['Pillow', 'Cushion'], ['Oreiller', 'Coussin'], ['وسادة', 'مخدة']],
  ['furniture', ['Shelf', 'Cabinet'], ['Étagère', 'Armoire'], ['رف', 'خزانة']],

  // ───────────── 🐾 ANIMALS (20) ─────────────
  ['animals', ['Cat', 'Dog'], ['Chat', 'Chien'], ['قطة', 'كلب']],
  ['animals', ['Lion', 'Tiger'], ['Lion', 'Tigre'], ['أسد', 'نمر']],
  ['animals', ['Eagle', 'Hawk'], ['Aigle', 'Faucon'], ['نسر', 'صقر']],
  ['animals', ['Dolphin', 'Whale'], ['Dauphin', 'Baleine'], ['دلفين', 'حوت']],
  ['animals', ['Horse', 'Donkey'], ['Cheval', 'Âne'], ['حصان', 'حمار']],
  ['animals', ['Monkey', 'Gorilla'], ['Singe', 'Gorille'], ['قرد', 'غوريلا']],
  ['animals', ['Rabbit', 'Hamster'], ['Lapin', 'Hamster'], ['أرنب', 'هامستر']],
  ['animals', ['Snake', 'Lizard'], ['Serpent', 'Lézard'], ['ثعبان', 'سحلية']],
  ['animals', ['Bear', 'Panda'], ['Ours', 'Panda'], ['دب', 'باندا']],
  ['animals', ['Fox', 'Wolf'], ['Renard', 'Loup'], ['ثعلب', 'ذئب']],
  ['animals', ['Shark', 'Crocodile'], ['Requin', 'Crocodile'], ['قرش', 'تمساح']],
  ['animals', ['Elephant', 'Rhinoceros'], ['Éléphant', 'Rhinocéros'], ['فيل', 'وحيد القرن']],
  ['animals', ['Giraffe', 'Zebra'], ['Girafe', 'Zèbre'], ['زرافة', 'حمار وحشي']],
  ['animals', ['Penguin', 'Seal'], ['Pingouin', 'Phoque'], ['بطريق', 'فقمة']],
  ['animals', ['Butterfly', 'Bee'], ['Papillon', 'Abeille'], ['فراشة', 'نحلة']],
  ['animals', ['Camel', 'Llama'], ['Chameau', 'Lama'], ['جمل', 'لاما']],
  ['animals', ['Parrot', 'Toucan'], ['Perroquet', 'Toucan'], ['ببغاء', 'طوقان']],
  ['animals', ['Owl', 'Bat'], ['Hibou', 'Chauve-souris'], ['بومة', 'خفاش']],
  ['animals', ['Frog', 'Toad'], ['Grenouille', 'Crapaud'], ['ضفدع', 'علجوم']],
  ['animals', ['Chicken', 'Duck'], ['Poule', 'Canard'], ['دجاجة', 'بطة']],

  // ───────────── 💻 TECHNOLOGY & GADGETS (15) ─────────────
  ['technology', ['iPhone', 'Samsung Galaxy'], ['iPhone', 'Samsung Galaxy'], ['آيفون', 'سامسونج جالكسي']],
  ['technology', ['Laptop', 'Tablet'], ['Ordinateur portable', 'Tablette'], ['لابتوب', 'تابلت']],
  ['technology', ['PlayStation', 'Xbox'], ['PlayStation', 'Xbox'], ['بلايستيشن', 'إكس بوكس']],
  ['technology', ['Instagram', 'TikTok'], ['Instagram', 'TikTok'], ['إنستغرام', 'تيك توك']],
  ['technology', ['YouTube', 'Twitch'], ['YouTube', 'Twitch'], ['يوتيوب', 'تويتش']],
  ['technology', ['Google', 'Bing'], ['Google', 'Bing'], ['جوجل', 'بينغ']],
  ['technology', ['WhatsApp', 'Telegram'], ['WhatsApp', 'Telegram'], ['واتساب', 'تيليغرام']],
  ['technology', ['Netflix', 'Disney+'], ['Netflix', 'Disney+'], ['نتفليكس', 'ديزني بلس']],
  ['technology', ['Amazon', 'eBay'], ['Amazon', 'eBay'], ['أمازون', 'إيباي']],
  ['technology', ['Wi-Fi', 'Bluetooth'], ['Wi-Fi', 'Bluetooth'], ['واي فاي', 'بلوتوث']],
  ['technology', ['USB', 'HDMI'], ['USB', 'HDMI'], ['يو إس بي', 'إتش دي إم آي']],
  ['technology', ['Robot', 'Drone'], ['Robot', 'Drone'], ['روبوت', 'درون']],
  ['technology', ['VR Headset', 'AR Glasses'], ['Casque VR', 'Lunettes AR'], ['نظارة واقع افتراضي', 'نظارة واقع معزز']],
  ['technology', ['ChatGPT', 'Gemini'], ['ChatGPT', 'Gemini'], ['تشات جي بي تي', 'جيميني']],
  ['technology', ['AirPods', 'Galaxy Buds'], ['AirPods', 'Galaxy Buds'], ['إيربودز', 'جالكسي بودز']],

  // ───────────── 🏀 SPORTS NON-FOOTBALL (15) ─────────────
  ['sports', ['Basketball', 'Volleyball'], ['Basketball', 'Volley-ball'], ['كرة السلة', 'كرة الطائرة']],
  ['sports', ['Tennis', 'Badminton'], ['Tennis', 'Badminton'], ['تنس', 'ريشة طائرة']],
  ['sports', ['Swimming', 'Diving'], ['Natation', 'Plongée'], ['سباحة', 'غوص']],
  ['sports', ['Boxing', 'MMA'], ['Boxe', 'MMA'], ['ملاكمة', 'فنون قتالية مختلطة']],
  ['sports', ['Golf', 'Cricket'], ['Golf', 'Cricket'], ['غولف', 'كريكيت']],
  ['sports', ['Skiing', 'Snowboarding'], ['Ski', 'Snowboard'], ['تزلج', 'تزلج على اللوح']],
  ['sports', ['Cycling', 'Running'], ['Cyclisme', 'Course à pied'], ['ركوب الدراجات', 'جري']],
  ['sports', ['Gymnastics', 'Figure Skating'], ['Gymnastique', 'Patinage artistique'], ['جمباز', 'تزلج فني']],
  ['sports', ['Surfing', 'Kayaking'], ['Surf', 'Kayak'], ['ركوب الأمواج', 'تجديف']],
  ['sports', ['Archery', 'Fencing'], ['Tir à l\'arc', 'Escrime'], ['رماية بالقوس', 'مبارزة']],
  ['sports', ['Wrestling', 'Judo'], ['Lutte', 'Judo'], ['مصارعة', 'جودو']],
  ['sports', ['Table Tennis', 'Squash'], ['Tennis de table', 'Squash'], ['تنس الطاولة', 'سكواش']],
  ['sports', ['Rugby', 'American Football'], ['Rugby', 'Football américain'], ['رغبي', 'كرة قدم أمريكية']],
  ['sports', ['Baseball', 'Softball'], ['Baseball', 'Softball'], ['بيسبول', 'سوفتبول']],
  ['sports', ['Formula 1', 'MotoGP'], ['Formule 1', 'MotoGP'], ['فورمولا 1', 'موتو جي بي']],

  // ───────────── 🏢 PROFESSIONS (15) ─────────────
  ['professions', ['Doctor', 'Nurse'], ['Médecin', 'Infirmier'], ['طبيب', 'ممرض']],
  ['professions', ['Teacher', 'Professor'], ['Enseignant', 'Professeur'], ['معلم', 'أستاذ جامعي']],
  ['professions', ['Lawyer', 'Judge'], ['Avocat', 'Juge'], ['محامي', 'قاضي']],
  ['professions', ['Engineer', 'Architect'], ['Ingénieur', 'Architecte'], ['مهندس', 'مهندس معماري']],
  ['professions', ['Chef', 'Baker'], ['Chef cuisinier', 'Boulanger'], ['طاهي', 'خباز']],
  ['professions', ['Pilot', 'Flight Attendant'], ['Pilote', 'Hôtesse de l\'air'], ['طيار', 'مضيف طيران']],
  ['professions', ['Police Officer', 'Detective'], ['Policier', 'Détective'], ['شرطي', 'محقق']],
  ['professions', ['Firefighter', 'Paramedic'], ['Pompier', 'Ambulancier'], ['رجل إطفاء', 'مسعف']],
  ['professions', ['Dentist', 'Pharmacist'], ['Dentiste', 'Pharmacien'], ['طبيب أسنان', 'صيدلي']],
  ['professions', ['Journalist', 'Writer'], ['Journaliste', 'Écrivain'], ['صحفي', 'كاتب']],
  ['professions', ['Photographer', 'Filmmaker'], ['Photographe', 'Cinéaste'], ['مصور', 'مخرج أفلام']],
  ['professions', ['Accountant', 'Banker'], ['Comptable', 'Banquier'], ['محاسب', 'مصرفي']],
  ['professions', ['Scientist', 'Researcher'], ['Scientifique', 'Chercheur'], ['عالم', 'باحث']],
  ['professions', ['Mechanic', 'Electrician'], ['Mécanicien', 'Électricien'], ['ميكانيكي', 'كهربائي']],
  ['professions', ['Barber', 'Hairstylist'], ['Barbier', 'Coiffeur'], ['حلاق', 'مصفف شعر']],

  // ───────────── 🌍 NATURE & GEOGRAPHY (15) ─────────────
  ['nature', ['Mountain', 'Hill'], ['Montagne', 'Colline'], ['جبل', 'تلة']],
  ['nature', ['Ocean', 'Sea'], ['Océan', 'Mer'], ['محيط', 'بحر']],
  ['nature', ['River', 'Lake'], ['Rivière', 'Lac'], ['نهر', 'بحيرة']],
  ['nature', ['Forest', 'Jungle'], ['Forêt', 'Jungle'], ['غابة', 'أدغال']],
  ['nature', ['Desert', 'Savanna'], ['Désert', 'Savane'], ['صحراء', 'سافانا']],
  ['nature', ['Volcano', 'Earthquake'], ['Volcan', 'Tremblement de terre'], ['بركان', 'زلزال']],
  ['nature', ['Island', 'Peninsula'], ['Île', 'Péninsule'], ['جزيرة', 'شبه جزيرة']],
  ['nature', ['Beach', 'Coast'], ['Plage', 'Côte'], ['شاطئ', 'ساحل']],
  ['nature', ['Waterfall', 'Geyser'], ['Cascade', 'Geyser'], ['شلال', 'نبع حار']],
  ['nature', ['Cave', 'Canyon'], ['Grotte', 'Canyon'], ['كهف', 'وادي']],
  ['nature', ['Glacier', 'Iceberg'], ['Glacier', 'Iceberg'], ['نهر جليدي', 'جبل جليدي']],
  ['nature', ['Rain', 'Snow'], ['Pluie', 'Neige'], ['مطر', 'ثلج']],
  ['nature', ['Thunder', 'Lightning'], ['Tonnerre', 'Éclair'], ['رعد', 'برق']],
  ['nature', ['Sunrise', 'Sunset'], ['Lever du soleil', 'Coucher du soleil'], ['شروق الشمس', 'غروب الشمس']],
  ['nature', ['Moon', 'Stars'], ['Lune', 'Étoiles'], ['قمر', 'نجوم']],

  // ───────────── 🎬 MOVIES & TV (15) ─────────────
  ['movies', ['Breaking Bad', 'Better Call Saul'], ['Breaking Bad', 'Better Call Saul'], ['بريكنغ باد', 'بيتر كول سول']],
  ['movies', ['Game of Thrones', 'Lord of the Rings'], ['Game of Thrones', 'Le Seigneur des anneaux'], ['صراع العروش', 'سيد الخواتم']],
  ['movies', ['Friends', 'How I Met Your Mother'], ['Friends', 'How I Met Your Mother'], ['فريندز', 'كيف قابلت أمكم']],
  ['movies', ['The Avengers', 'Justice League'], ['Les Avengers', 'La Ligue des Justiciers'], ['المنتقمون', 'فرقة العدالة']],
  ['movies', ['Titanic', 'Avatar'], ['Titanic', 'Avatar'], ['تايتانك', 'أفاتار']],
  ['movies', ['The Matrix', 'Inception'], ['Matrix', 'Inception'], ['ماتريكس', 'إنسبشن']],
  ['movies', ['Star Wars', 'Star Trek'], ['Star Wars', 'Star Trek'], ['حرب النجوم', 'ستار تريك']],
  ['movies', ['Stranger Things', 'Dark'], ['Stranger Things', 'Dark'], ['أشياء غريبة', 'دارك']],
  ['movies', ['Money Heist', 'Squid Game'], ['La Casa de Papel', 'Squid Game'], ['لا كاسا دي بابيل', 'لعبة الحبار']],
  ['movies', ['The Lion King', 'Finding Nemo'], ['Le Roi Lion', 'Le Monde de Nemo'], ['الأسد الملك', 'البحث عن نيمو']],
  ['movies', ['Toy Story', 'Shrek'], ['Toy Story', 'Shrek'], ['حكاية لعبة', 'شريك']],
  ['movies', ['Fast & Furious', 'Mission Impossible'], ['Fast & Furious', 'Mission Impossible'], ['سريع وغاضب', 'المهمة المستحيلة']],
  ['movies', ['John Wick', 'James Bond'], ['John Wick', 'James Bond'], ['جون ويك', 'جيمس بوند']],
  ['movies', ['Interstellar', 'Gravity'], ['Interstellar', 'Gravity'], ['إنترستيلر', 'جرافيتي']],
  ['movies', ['Frozen', 'Moana'], ['La Reine des neiges', 'Vaiana'], ['ملكة الثلج', 'موانا']],

  // ───────────── 🎮 VIDEO GAMES (15) ─────────────
  ['videogames', ['Fortnite', 'PUBG'], ['Fortnite', 'PUBG'], ['فورتنايت', 'ببجي']],
  ['videogames', ['FIFA (EA FC)', 'eFootball (PES)'], ['FIFA (EA FC)', 'eFootball (PES)'], ['فيفا (إي أيه إف سي)', 'إي فوتبول (بيس)']],
  ['videogames', ['GTA', 'Red Dead Redemption'], ['GTA', 'Red Dead Redemption'], ['جي تي إيه', 'ريد ديد ريدمبشن']],
  ['videogames', ['Minecraft', 'Roblox'], ['Minecraft', 'Roblox'], ['ماينكرافت', 'روبلوكس']],
  ['videogames', ['Call of Duty', 'Battlefield'], ['Call of Duty', 'Battlefield'], ['كول أوف ديوتي', 'باتلفيلد']],
  ['videogames', ['League of Legends', 'Dota 2'], ['League of Legends', 'Dota 2'], ['ليغ أوف ليجندز', 'دوتا 2']],
  ['videogames', ['Mario', 'Sonic'], ['Mario', 'Sonic'], ['ماريو', 'سونيك']],
  ['videogames', ['Zelda', 'Pokémon'], ['Zelda', 'Pokémon'], ['زيلدا', 'بوكيمون']],
  ['videogames', ['Valorant', 'Counter-Strike'], ['Valorant', 'Counter-Strike'], ['فالورانت', 'كاونتر سترايك']],
  ['videogames', ['Apex Legends', 'Overwatch'], ['Apex Legends', 'Overwatch'], ['أبيكس ليجندز', 'أوفرواتش']],
  ['videogames', ['God of War', 'Devil May Cry'], ['God of War', 'Devil May Cry'], ['إله الحرب', 'ديفل ماي كراي']],
  ['videogames', ['Assassin\'s Creed', 'Uncharted'], ['Assassin\'s Creed', 'Uncharted'], ['أساسنز كريد', 'أنتشارتد']],
  ['videogames', ['Among Us', 'Fall Guys'], ['Among Us', 'Fall Guys'], ['أمونغ أس', 'فول غايز']],
  ['videogames', ['Clash of Clans', 'Clash Royale'], ['Clash of Clans', 'Clash Royale'], ['كلاش أوف كلانز', 'كلاش رويال']],
  ['videogames', ['Need for Speed', 'Gran Turismo'], ['Need for Speed', 'Gran Turismo'], ['نيد فور سبيد', 'غران توريزمو']],

  // ───────────── 🏫 SCHOOL & EDUCATION (12) ─────────────
  ['school', ['Pencil', 'Pen'], ['Crayon', 'Stylo'], ['قلم رصاص', 'قلم حبر']],
  ['school', ['Notebook', 'Textbook'], ['Cahier', 'Manuel scolaire'], ['دفتر', 'كتاب مدرسي']],
  ['school', ['Backpack', 'Suitcase'], ['Sac à dos', 'Valise'], ['حقيبة ظهر', 'حقيبة سفر']],
  ['school', ['Eraser', 'Ruler'], ['Gomme', 'Règle'], ['ممحاة', 'مسطرة']],
  ['school', ['Chalk', 'Marker'], ['Craie', 'Marqueur'], ['طباشير', 'قلم تحديد']],
  ['school', ['Exam', 'Quiz'], ['Examen', 'Quiz'], ['امتحان', 'اختبار قصير']],
  ['school', ['Math', 'Physics'], ['Mathématiques', 'Physique'], ['رياضيات', 'فيزياء']],
  ['school', ['History', 'Geography'], ['Histoire', 'Géographie'], ['تاريخ', 'جغرافيا']],
  ['school', ['Biology', 'Chemistry'], ['Biologie', 'Chimie'], ['أحياء', 'كيمياء']],
  ['school', ['Homework', 'Project'], ['Devoirs', 'Projet'], ['واجب منزلي', 'مشروع']],
  ['school', ['Classroom', 'Library'], ['Salle de classe', 'Bibliothèque'], ['فصل دراسي', 'مكتبة']],
  ['school', ['University', 'College'], ['Université', 'École supérieure'], ['جامعة', 'كلية']],

  // ───────────── 🎨 COLORS & ART (12) ─────────────
  ['art', ['Red', 'Orange'], ['Rouge', 'Orange'], ['أحمر', 'برتقالي']],
  ['art', ['Blue', 'Purple'], ['Bleu', 'Violet'], ['أزرق', 'بنفسجي']],
  ['art', ['Green', 'Turquoise'], ['Vert', 'Turquoise'], ['أخضر', 'فيروزي']],
  ['art', ['Black', 'Dark Gray'], ['Noir', 'Gris foncé'], ['أسود', 'رمادي غامق']],
  ['art', ['White', 'Beige'], ['Blanc', 'Beige'], ['أبيض', 'بيج']],
  ['art', ['Pink', 'Magenta'], ['Rose', 'Magenta'], ['وردي', 'ماجنتا']],
  ['art', ['Gold', 'Silver'], ['Or', 'Argent'], ['ذهبي', 'فضي']],
  ['art', ['Painting', 'Drawing'], ['Peinture', 'Dessin'], ['لوحة', 'رسم']],
  ['art', ['Sculpture', 'Statue'], ['Sculpture', 'Statue'], ['منحوتة', 'تمثال']],
  ['art', ['Museum', 'Gallery'], ['Musée', 'Galerie'], ['متحف', 'معرض']],
  ['art', ['Oil Paint', 'Watercolor'], ['Peinture à l\'huile', 'Aquarelle'], ['ألوان زيتية', 'ألوان مائية']],
  ['art', ['Graffiti', 'Mural'], ['Graffiti', 'Murale'], ['غرافيتي', 'جدارية']],

  // ───────────── 🏛️ LANDMARKS & MONUMENTS (10) ─────────────
  ['landmarks', ['Eiffel Tower', 'Statue of Liberty'], ['Tour Eiffel', 'Statue de la Liberté'], ['برج إيفل', 'تمثال الحرية']],
  ['landmarks', ['Pyramids of Giza', 'Colosseum'], ['Pyramides de Gizeh', 'Colisée'], ['أهرامات الجيزة', 'الكولوسيوم']],
  ['landmarks', ['Taj Mahal', 'Great Wall of China'], ['Taj Mahal', 'Grande Muraille de Chine'], ['تاج محل', 'سور الصين العظيم']],
  ['landmarks', ['Big Ben', 'Tower of London'], ['Big Ben', 'Tour de Londres'], ['بيغ بن', 'برج لندن']],
  ['landmarks', ['Burj Khalifa', 'Empire State Building'], ['Burj Khalifa', 'Empire State Building'], ['برج خليفة', 'مبنى إمباير ستيت']],
  ['landmarks', ['Leaning Tower of Pisa', 'Sagrada Familia'], ['Tour de Pise', 'Sagrada Familia'], ['برج بيزا المائل', 'ساغرادا فاميليا']],
  ['landmarks', ['Acropolis', 'Petra'], ['Acropole', 'Pétra'], ['أكروبوليس', 'البتراء']],
  ['landmarks', ['Christ the Redeemer', 'Mount Rushmore'], ['Christ Rédempteur', 'Mont Rushmore'], ['تمثال المسيح الفادي', 'جبل رشمور']],
  ['landmarks', ['Sydney Opera House', 'Golden Gate Bridge'], ['Opéra de Sydney', 'Pont du Golden Gate'], ['دار أوبرا سيدني', 'جسر البوابة الذهبية']],
  ['landmarks', ['Machu Picchu', 'Chichen Itza'], ['Machu Picchu', 'Chichen Itza'], ['ماتشو بيتشو', 'تشيتشن إيتزا']],

  // ───────────── ✈️ TRANSPORT (12) ─────────────
  ['transport', ['Car', 'Bus'], ['Voiture', 'Bus'], ['سيارة', 'حافلة']],
  ['transport', ['Train', 'Metro'], ['Train', 'Métro'], ['قطار', 'مترو']],
  ['transport', ['Airplane', 'Helicopter'], ['Avion', 'Hélicoptère'], ['طائرة', 'هليكوبتر']],
  ['transport', ['Bicycle', 'Motorcycle'], ['Vélo', 'Moto'], ['دراجة هوائية', 'دراجة نارية']],
  ['transport', ['Boat', 'Ship'], ['Bateau', 'Navire'], ['قارب', 'سفينة']],
  ['transport', ['Taxi', 'Uber'], ['Taxi', 'Uber'], ['تاكسي', 'أوبر']],
  ['transport', ['Tram', 'Trolleybus'], ['Tramway', 'Trolleybus'], ['ترام', 'حافلة كهربائية']],
  ['transport', ['Scooter', 'Skateboard'], ['Trottinette', 'Skateboard'], ['سكوتر', 'لوح تزلج']],
  ['transport', ['Jet Ski', 'Speedboat'], ['Jet ski', 'Hors-bord'], ['جت سكي', 'زورق سريع']],
  ['transport', ['Rocket', 'Satellite'], ['Fusée', 'Satellite'], ['صاروخ', 'قمر صناعي']],
  ['transport', ['Ambulance', 'Fire Truck'], ['Ambulance', 'Camion de pompiers'], ['إسعاف', 'سيارة إطفاء']],
  ['transport', ['Ferry', 'Cruise Ship'], ['Ferry', 'Paquebot de croisière'], ['عبّارة', 'سفينة سياحية']],

  // ───────────── 📱 SOCIAL MEDIA & APPS (12) ─────────────
  ['social_media', ['Facebook', 'Twitter (X)'], ['Facebook', 'Twitter (X)'], ['فيسبوك', 'تويتر (إكس)']],
  ['social_media', ['Snapchat', 'BeReal'], ['Snapchat', 'BeReal'], ['سناب شات', 'بي ريال']],
  ['social_media', ['LinkedIn', 'Indeed'], ['LinkedIn', 'Indeed'], ['لينكد إن', 'إنديد']],
  ['social_media', ['Pinterest', 'Tumblr'], ['Pinterest', 'Tumblr'], ['بنترست', 'تمبلر']],
  ['social_media', ['Reddit', 'Quora'], ['Reddit', 'Quora'], ['ريديت', 'كورا']],
  ['social_media', ['Uber', 'Lyft'], ['Uber', 'Lyft'], ['أوبر', 'ليفت']],
  ['social_media', ['Airbnb', 'Booking.com'], ['Airbnb', 'Booking.com'], ['إير بي إن بي', 'بوكينغ']],
  ['social_media', ['Google Maps', 'Waze'], ['Google Maps', 'Waze'], ['خرائط جوجل', 'ويز']],
  ['social_media', ['Shazam', 'SoundCloud'], ['Shazam', 'SoundCloud'], ['شازام', 'ساوند كلاود']],
  ['social_media', ['Zoom', 'Microsoft Teams'], ['Zoom', 'Microsoft Teams'], ['زووم', 'مايكروسوفت تيمز']],
  ['social_media', ['Slack', 'Discord'], ['Slack', 'Discord'], ['سلاك', 'ديسكورد']],
  ['social_media', ['Gmail', 'Outlook'], ['Gmail', 'Outlook'], ['جيميل', 'أوتلوك']],

  // ───────────── 💍 ACCESSORIES & BEAUTY (10) ─────────────
  ['accessories', ['Ring', 'Bracelet'], ['Bague', 'Bracelet'], ['خاتم', 'سوار']],
  ['accessories', ['Necklace', 'Pendant'], ['Collier', 'Pendentif'], ['قلادة', 'تعليقة']],
  ['accessories', ['Earring', 'Piercing'], ['Boucle d\'oreille', 'Piercing'], ['حلق', 'ثقب']],
  ['accessories', ['Diamond', 'Ruby'], ['Diamant', 'Rubis'], ['ألماس', 'ياقوت']],
  ['accessories', ['Wallet', 'Purse'], ['Portefeuille', 'Sac à main'], ['محفظة', 'حقيبة يد']],
  ['accessories', ['Perfume', 'Cologne'], ['Parfum', 'Eau de Cologne'], ['عطر', 'كولونيا']],
  ['accessories', ['Lipstick', 'Mascara'], ['Rouge à lèvres', 'Mascara'], ['أحمر شفاه', 'ماسكارا']],
  ['accessories', ['Foundation', 'Concealer'], ['Fond de teint', 'Correcteur'], ['كريم أساس', 'كونسيلر']],
  ['accessories', ['Bag', 'Backpack'], ['Sac', 'Sac à dos'], ['حقيبة', 'حقيبة ظهر']],
  ['accessories', ['Tattoo', 'Henna'], ['Tatouage', 'Henné'], ['وشم', 'حناء']],

  // ───────────── 🏷️ BRANDS (15) — NEW! ─────────────
  ['brands', ['Nike', 'Adidas'], ['Nike', 'Adidas'], ['نايكي', 'أديداس']],
  ['brands', ['Apple', 'Samsung'], ['Apple', 'Samsung'], ['أبل', 'سامسونج']],
  ['brands', ['Gucci', 'Louis Vuitton'], ['Gucci', 'Louis Vuitton'], ['غوتشي', 'لويس فويتون']],
  ['brands', ['McDonald\'s', 'Burger King'], ['McDonald\'s', 'Burger King'], ['ماكدونالدز', 'برغر كينغ']],
  ['brands', ['Zara', 'H&M'], ['Zara', 'H&M'], ['زارا', 'إتش آند إم']],
  ['brands', ['Coca-Cola', 'PepsiCo'], ['Coca-Cola', 'PepsiCo'], ['كوكاكولا', 'بيبسيكو']],
  ['brands', ['Google', 'Microsoft'], ['Google', 'Microsoft'], ['جوجل', 'مايكروسوفت']],
  ['brands', ['Rolex', 'Omega'], ['Rolex', 'Omega'], ['رولكس', 'أوميغا']],
  ['brands', ['Prada', 'Versace'], ['Prada', 'Versace'], ['برادا', 'فرساتشي']],
  ['brands', ['IKEA', 'Maisons du Monde'], ['IKEA', 'Maisons du Monde'], ['إيكيا', 'ميزون دو موند']],
  ['brands', ['Chanel', 'Dior'], ['Chanel', 'Dior'], ['شانيل', 'ديور']],
  ['brands', ['Puma', 'New Balance'], ['Puma', 'New Balance'], ['بوما', 'نيو بالانس']],
  ['brands', ['Red Bull', 'Monster'], ['Red Bull', 'Monster'], ['ريد بول', 'مونستر']],
  ['brands', ['Sony', 'LG'], ['Sony', 'LG'], ['سوني', 'إل جي']],
  ['brands', ['Hermès', 'Balenciaga'], ['Hermès', 'Balenciaga'], ['هيرميس', 'بالنسياغا']],

  // ───────────── 🏳️ COUNTRIES & FLAGS (15) — NEW! ─────────────
  ['flags', ['Morocco 🇲🇦', 'Tunisia 🇹🇳'], ['Maroc 🇲🇦', 'Tunisie 🇹🇳'], ['المغرب 🇲🇦', 'تونس 🇹🇳']],
  ['flags', ['Algeria 🇩🇿', 'Libya 🇱🇾'], ['Algérie 🇩🇿', 'Libye 🇱🇾'], ['الجزائر 🇩🇿', 'ليبيا 🇱🇾']],
  ['flags', ['Egypt 🇪🇬', 'Sudan 🇸🇩'], ['Égypte 🇪🇬', 'Soudan 🇸🇩'], ['مصر 🇪🇬', 'السودان 🇸🇩']],
  ['flags', ['Saudi Arabia 🇸🇦', 'Qatar 🇶🇦'], ['Arabie Saoudite 🇸🇦', 'Qatar 🇶🇦'], ['السعودية 🇸🇦', 'قطر 🇶🇦']],
  ['flags', ['UAE 🇦🇪', 'Kuwait 🇰🇼'], ['Émirats Arabes Unis 🇦🇪', 'Koweït 🇰🇼'], ['الإمارات 🇦🇪', 'الكويت 🇰🇼']],
  ['flags', ['France 🇫🇷', 'Belgium 🇧🇪'], ['France 🇫🇷', 'Belgique 🇧🇪'], ['فرنسا 🇫🇷', 'بلجيكا 🇧🇪']],
  ['flags', ['Germany 🇩🇪', 'Austria 🇦🇹'], ['Allemagne 🇩🇪', 'Autriche 🇦🇹'], ['ألمانيا 🇩🇪', 'النمسا 🇦🇹']],
  ['flags', ['Spain 🇪🇸', 'Portugal 🇵🇹'], ['Espagne 🇪🇸', 'Portugal 🇵🇹'], ['إسبانيا 🇪🇸', 'البرتغال 🇵🇹']],
  ['flags', ['Italy 🇮🇹', 'Greece 🇬🇷'], ['Italie 🇮🇹', 'Grèce 🇬🇷'], ['إيطاليا 🇮🇹', 'اليونان 🇬🇷']],
  ['flags', ['UK 🇬🇧', 'Ireland 🇮🇪'], ['Royaume-Uni 🇬🇧', 'Irlande 🇮🇪'], ['المملكة المتحدة 🇬🇧', 'أيرلندا 🇮🇪']],
  ['flags', ['USA 🇺🇸', 'Canada 🇨🇦'], ['États-Unis 🇺🇸', 'Canada 🇨🇦'], ['الولايات المتحدة 🇺🇸', 'كندا 🇨🇦']],
  ['flags', ['Brazil 🇧🇷', 'Argentina 🇦🇷'], ['Brésil 🇧🇷', 'Argentine 🇦🇷'], ['البرازيل 🇧🇷', 'الأرجنتين 🇦🇷']],
  ['flags', ['Japan 🇯🇵', 'South Korea 🇰🇷'], ['Japon 🇯🇵', 'Corée du Sud 🇰🇷'], ['اليابان 🇯🇵', 'كوريا الجنوبية 🇰🇷']],
  ['flags', ['Turkey 🇹🇷', 'Iran 🇮🇷'], ['Turquie 🇹🇷', 'Iran 🇮🇷'], ['تركيا 🇹🇷', 'إيران 🇮🇷']],
  ['flags', ['Mexico 🇲🇽', 'Colombia 🇨🇴'], ['Mexique 🇲🇽', 'Colombie 🇨🇴'], ['المكسيك 🇲🇽', 'كولومبيا 🇨🇴']],

  // ───────────── ⚽ FOOTBALLERS (50) — EXISTING EXPANDED ─────────────
  ['footballers', ['Lionel Messi', 'Cristiano Ronaldo'], ['Lionel Messi', 'Cristiano Ronaldo'], ['ليونيل ميسي', 'كريستيانو رونالدو']],
  ['footballers', ['Kylian Mbappé', 'Erling Haaland'], ['Kylian Mbappé', 'Erling Haaland'], ['كيليان مبابي', 'إرلينغ هالاند']],
  ['footballers', ['Zinedine Zidane', 'Ronaldinho'], ['Zinédine Zidane', 'Ronaldinho'], ['زين الدين زيدان', 'رونالدينيو']],
  ['footballers', ['Karim Benzema', 'Robert Lewandowski'], ['Karim Benzema', 'Robert Lewandowski'], ['كريم بنزيما', 'روبرت ليفاندوفسكي']],
  ['footballers', ['Neymar Jr', 'Vinicius Jr'], ['Neymar Jr', 'Vinicius Jr'], ['نيمار جونيور', 'فينيسيوس جونيور']],
  ['footballers', ['Luka Modric', 'Toni Kroos'], ['Luka Modric', 'Toni Kroos'], ['لوكا مودريتش', 'توني كروس']],
  ['footballers', ['Mohamed Salah', 'Sadio Mané'], ['Mohamed Salah', 'Sadio Mané'], ['محمد صلاح', 'ساديو ماني']],
  ['footballers', ['Kevin De Bruyne', 'Bernardo Silva'], ['Kevin De Bruyne', 'Bernardo Silva'], ['كيفين دي بروين', 'برناردو سيلفا']],
  ['footballers', ['Andrés Iniesta', 'Xavi Hernandez'], ['Andrés Iniesta', 'Xavi Hernandez'], ['أندريس إنييستا', 'تشافي هيرنانديز']],
  ['footballers', ['Pelé', 'Diego Maradona'], ['Pelé', 'Diego Maradona'], ['بيليه', 'دييغو مارادونا']],
  ['footballers', ['Gianluigi Buffon', 'Iker Casillas'], ['Gianluigi Buffon', 'Iker Casillas'], ['جانلويجي بوفون', 'إيكر كاسياس']],
  ['footballers', ['Manuel Neuer', 'Thibaut Courtois'], ['Manuel Neuer', 'Thibaut Courtois'], ['مانويل نوير', 'تيبو كورتوا']],
  ['footballers', ['Sergio Ramos', 'Virgil van Dijk'], ['Sergio Ramos', 'Virgil van Dijk'], ['سيرجيو راموس', 'فيرجيل فان دايك']],
  ['footballers', ['Thierry Henry', 'Dennis Bergkamp'], ['Thierry Henry', 'Dennis Bergkamp'], ['تييري هنري', 'دينيس بيركامب']],
  ['footballers', ['Zlatan Ibrahimović', 'Edinson Cavani'], ['Zlatan Ibrahimović', 'Edinson Cavani'], ['زلاتان إبراهيموفيتش', 'إدينسون كافاني']],
  ['footballers', ['Jude Bellingham', 'Pedri'], ['Jude Bellingham', 'Pedri'], ['جود بيلينغهام', 'بيدري']],
  ['footballers', ['Lamine Yamal', 'Arda Güler'], ['Lamine Yamal', 'Arda Güler'], ['لامين يامال', 'أردا جولر']],
  ['footballers', ['Achraf Hakimi', 'João Cancelo'], ['Achraf Hakimi', 'João Cancelo'], ['أشرف حكيمي', 'جواو كانسيلو']],
  ['footballers', ['Riyad Mahrez', 'Heung-Min Son'], ['Riyad Mahrez', 'Son Heung-min'], ['رياض محرز', 'سون هيونغ مين']],
  ['footballers', ['Bukayo Saka', 'Phil Foden'], ['Bukayo Saka', 'Phil Foden'], ['بوكايو ساكا', 'فيل فودين']],
  ['footballers', ['Rodri', 'Sergio Busquets'], ['Rodri', 'Sergio Busquets'], ['رودري', 'سيرجيو بوسكيتس']],
  ['footballers', ['Cole Palmer', 'Florian Wirtz'], ['Cole Palmer', 'Florian Wirtz'], ['كول بالمر', 'فلوريان فيرتز']],
  ['footballers', ['Jamal Musiala', 'Rafael Leão'], ['Jamal Musiala', 'Rafael Leão'], ['جمال موسيالا', 'رافائيل لياو']],
  ['footballers', ['Didier Drogba', 'Samuel Eto\'o'], ['Didier Drogba', 'Samuel Eto\'o'], ['ديدييه دروغبا', 'صامويل إيتو']],
  ['footballers', ['Paolo Maldini', 'Franco Baresi'], ['Paolo Maldini', 'Franco Baresi'], ['باولو مالديني', 'فرانكو باريزي']],

  // ───────────── 👔 HEAD COACHES (15) — EXISTING ─────────────
  ['headcoaches', ['Pep Guardiola', 'Jürgen Klopp'], ['Pep Guardiola', 'Jürgen Klopp'], ['بيب غوارديولا', 'يورغن كلوب']],
  ['headcoaches', ['Carlo Ancelotti', 'José Mourinho'], ['Carlo Ancelotti', 'José Mourinho'], ['كارلو أنشيلوتي', 'جوزيه مورينيو']],
  ['headcoaches', ['Sir Alex Ferguson', 'Arsène Wenger'], ['Sir Alex Ferguson', 'Arsène Wenger'], ['سير أليكس فيرغسون', 'أرسين فينغر']],
  ['headcoaches', ['Mikel Arteta', 'Xabi Alonso'], ['Mikel Arteta', 'Xabi Alonso'], ['ميكيل أرتيتا', 'تشابي ألونسو']],
  ['headcoaches', ['Walid Regragui', 'Djamel Belmadi'], ['Walid Regragui', 'Djamel Belmadi'], ['وليد الركراكي', 'جمال بلماضي']],
  ['headcoaches', ['Didier Deschamps', 'Lionel Scaloni'], ['Didier Deschamps', 'Lionel Scaloni'], ['ديدييه ديشان', 'ليونيل سكالوني']],
  ['headcoaches', ['Thomas Tuchel', 'Antonio Conte'], ['Thomas Tuchel', 'Antonio Conte'], ['توماس توخيل', 'أنطونيو كونتي']],
  ['headcoaches', ['Hansi Flick', 'Julian Nagelsmann'], ['Hansi Flick', 'Julian Nagelsmann'], ['هانز فليك', 'يوليان ناغلسمان']],
  ['headcoaches', ['Roberto De Zerbi', 'Arne Slot'], ['Roberto De Zerbi', 'Arne Slot'], ['روبرتو دي زيربي', 'أرني سلوت']],
  ['headcoaches', ['Simone Inzaghi', 'Thiago Motta'], ['Simone Inzaghi', 'Thiago Motta'], ['سيموني إنزاغي', 'تياغو موتا']],

  // ───────────── 🏟️ FOOTBALL CLUBS & STADIUMS (15) — EXISTING ─────────────
  ['football_clubs', ['Real Madrid', 'FC Barcelona'], ['Real Madrid', 'FC Barcelone'], ['ريال مدريد', 'برشلونة']],
  ['football_clubs', ['Manchester City', 'Liverpool FC'], ['Manchester City', 'Liverpool'], ['مانشستر سيتي', 'ليفربول']],
  ['football_clubs', ['Paris Saint-Germain', 'Olympique de Marseille'], ['Paris Saint-Germain', 'Olympique de Marseille'], ['باريس سان جيرمان', 'أولمبيك مارسيليا']],
  ['football_clubs', ['Bayern Munich', 'Borussia Dortmund'], ['Bayern Munich', 'Borussia Dortmund'], ['بايرن ميونخ', 'بوروسيا دورتموند']],
  ['football_clubs', ['Inter Milan', 'AC Milan'], ['Inter Milan', 'AC Milan'], ['إنتر ميلان', 'إيه سي ميلان']],
  ['football_clubs', ['Al Hilal', 'Al Nassr'], ['Al-Hilal', 'Al-Nassr'], ['الهلال السعودي', 'النصر السعودي']],
  ['football_clubs', ['Al Ahly', 'Zamalek'], ['Al Ahly', 'Zamalek'], ['الأهلي المصري', 'الزمالك']],
  ['football_clubs', ['Wydad Casablanca', 'Raja Casablanca'], ['Wydad Casablanca', 'Raja Casablanca'], ['الوداد البيضاوي', 'الرجاء البيضاوي']],
  ['football_clubs', ['Espérance de Tunis', 'Club Africain'], ['Espérance de Tunis', 'Club Africain'], ['الترجي التونسي', 'النادي الإفريقي']],
  ['football_clubs', ['Boca Juniors', 'River Plate'], ['Boca Juniors', 'River Plate'], ['بوكا جونيورز', 'ريفر بليت']],

  // ───────────── ⚡ ANIME & SUPERHEROES (15) — EXISTING ─────────────
  ['anime_heroes', ['Goku', 'Vegeta'], ['Goku', 'Vegeta'], ['غوكو', 'فيجيتا']],
  ['anime_heroes', ['Naruto Uzumaki', 'Sasuke Uchiha'], ['Naruto Uzumaki', 'Sasuke Uchiha'], ['ناروتو أوزوماكي', 'ساسكي أوتشيها']],
  ['anime_heroes', ['Monkey D. Luffy', 'Roronoa Zoro'], ['Monkey D. Luffy', 'Roronoa Zoro'], ['مونكي دي لوفي', 'رورونوا زورو']],
  ['anime_heroes', ['Eren Yeager', 'Levi Ackerman'], ['Eren Jäger', 'Livaï Ackerman'], ['إيرين ييغر', 'ليفاي أكرمان']],
  ['anime_heroes', ['Batman', 'Superman'], ['Batman', 'Superman'], ['باتمان', 'سوبرمان']],
  ['anime_heroes', ['Iron Man', 'Captain America'], ['Iron Man', 'Captain America'], ['آيرون مان', 'كابتن أمريكا']],
  ['anime_heroes', ['Spider-Man', 'Deadpool'], ['Spider-Man', 'Deadpool'], ['سبايدرمان', 'ديدبول']],
  ['anime_heroes', ['Harry Potter', 'Lord Voldemort'], ['Harry Potter', 'Lord Voldemort'], ['هاري بوتر', 'فولدمورت']],
  ['anime_heroes', ['Gojo Satoru', 'Ryomen Sukuna'], ['Satoru Gojo', 'Ryomen Sukuna'], ['ساتورو غوجو', 'ريومين سوكونا']],
  ['anime_heroes', ['Light Yagami', 'L (Death Note)'], ['Light Yagami', 'L Lawliet'], ['لايت ياغامي', 'إل (ديث نوت)']],

  // ───────────── 🌍 CITIES & COUNTRIES (15) — EXISTING ─────────────
  ['cities_countries', ['Paris', 'London'], ['Paris', 'Londres'], ['باريس', 'لندن']],
  ['cities_countries', ['Tokyo', 'Seoul'], ['Tokyo', 'Séoul'], ['طوكيو', 'سيول']],
  ['cities_countries', ['Dubai', 'Doha'], ['Dubaï', 'Doha'], ['دبي', 'الدوحة']],
  ['cities_countries', ['Riyadh', 'Cairo'], ['Riyad', 'Le Caire'], ['الرياض', 'القاهرة']],
  ['cities_countries', ['New York', 'Los Angeles'], ['New York', 'Los Angeles'], ['نيويورك', 'لوس أنجلوس']],
  ['cities_countries', ['Rome', 'Athens'], ['Rome', 'Athènes'], ['روما', 'أثينا']],
  ['cities_countries', ['Tunis', 'Casablanca'], ['Tunis', 'Casablanca'], ['تونس العاصمة', 'الدار البيضاء']],
  ['cities_countries', ['Istanbul', 'Beirut'], ['Istanbul', 'Beyrouth'], ['إسطنبول', 'بيروت']],
  ['cities_countries', ['Morocco', 'Algeria'], ['Maroc', 'Algérie'], ['المغرب', 'الجزائر']],
  ['cities_countries', ['Brazil', 'Argentina'], ['Brésil', 'Argentine'], ['البرازيل', 'الأرجنتين']],,

  // ───────────── ✨ EXPANDED WORDS FOR ALL CATEGORIES ─────────────
  ['fruits', ["Grapefruit", "Pomelo"], ["Pamplemousse", "Pomélo"], ["جريب فروت", "بوملي"]],
  ['fruits', ["Blackberry", "Blueberry"], ["Mûre", "Myrtille"], ["توت أسود", "توت أزرق"]],
  ['fruits', ["Apricot", "Plum"], ["Abricot", "Prune"], ["مشمش", "برقوق"]],
  ['fruits', ["Cantaloupe", "Honeydew"], ["Cantaloup", "Melon miel"], ["شمام كوز العسل", "شمام أصفر"]],
  ['fruits', ["Raspberry", "Blackberry"], ["Framboise", "Mûre"], ["توت العليق", "توت شوكي"]],
  ['vegetables', ["Sweet Potato", "Yam"], ["Patate douce", "Igname"], ["بطاطا حلوة", "يام"]],
  ['vegetables', ["Cauliflower", "Cabbage"], ["Chou-fleur", "Chou"], ["قرنبيط", "ملفوف"]],
  ['vegetables', ["Leek", "Green Onion"], ["Poireau", "Oignon vert"], ["كراث", "بصل أخضر"]],
  ['vegetables', ["Beetroot", "Radish"], ["Betterave", "Radis"], ["شمندر", "فجل"]],
  ['vegetables', ["Pumpkin", "Butternut Squash"], ["Citrouille", "Courge doubeurre"], ["يقطين", "قرع عسلي"]],
  ['cars', ["Maserati", "Alfa Romeo"], ["Maserati", "Alfa Romeo"], ["مازيراتي", "ألفا روميو"]],
  ['cars', ["Bentley", "Maybach"], ["Bentley", "Maybach"], ["بنتلي", "مايباخ"]],
  ['cars', ["Jeep", "Land Rover"], ["Jeep", "Land Rover"], ["جيب", "لاند روفر"]],
  ['cars', ["Subaru", "Mitsubishi"], ["Subaru", "Mitsubishi"], ["سوبارو", "ميتسوبيشي"]],
  ['cars', ["Volvo", "Saab"], ["Volvo", "Saab"], ["فولفو", "ساب"]],
  ['food', ["Hot Dog", "Corn Dog"], ["Hot-dog", "Beignet de saucisse"], ["هوت دوغ", "كورن دوغ"]],
  ['food', ["Burrito", "Quesadilla"], ["Burrito", "Quesadilla"], ["بوريتو", "كاساديا"]],
  ['food', ["Ramen", "Udon"], ["Ramen", "Udon"], ["رامن", "أودون"]],
  ['food', ["Shawarma", "Gyros"], ["Shawarma", "Gyros"], ["شاورما", "جيروس"]],
  ['food', ["Crepe", "Pancake"], ["Crêpe", "Pancake"], ["كريب", "بان كيك"]],
  ['drinks', ["Matcha", "Green Tea"], ["Matcha", "Thé vert"], ["ماتشا", "شاي أخضر"]],
  ['drinks', ["Lemonade", "Limeade"], ["Limonade", "Citronnade"], ["ليمونادة", "عصير ليمون أخضر"]],
  ['drinks', ["Apple Cider", "Apple Juice"], ["Cidre de pomme", "Jus de pomme"], ["عصير تفاح فوار", "عصير تفاح"]],
  ['drinks', ["Chai Latte", "Karak Tea"], ["Chaï latte", "Thé karak"], ["شاي لاتيه", "شاي كرك"]],
  ['drinks', ["Red Bull", "Monster"], ["Red Bull", "Monster"], ["ريد بول", "مونستر"]],
  ['desserts', ["Cheesecake", "Flan"], ["Cheesecake", "Flan"], ["تشيز كيك", "فلان"]],
  ['desserts', ["Churros", "Beignet"], ["Churros", "Beignet"], ["تشوروز", "بينيه"]],
  ['desserts', ["Eclair", "Profiterole"], ["Éclair", "Profiterole"], ["إكلير", "بروفيترول"]],
  ['desserts', ["Mousse", "Pudding"], ["Mousse", "Pudding"], ["موس شوكولاتة", "بودينغ"]],
  ['desserts', ["Gelato", "Frozen Yogurt"], ["Gelato", "Yaourt glacé"], ["جيلاتو", "زبادي مثلج"]],
  ['music', ["Saxophone", "Clarinet"], ["Saxophone", "Clarinette"], ["ساكسفون", "كلارينيت"]],
  ['music', ["Bass Guitar", "Double Bass"], ["Basse électrique", "Contrebasse"], ["غيتار باص", "كونترباص"]],
  ['music', ["Acoustic Guitar", "Electric Guitar"], ["Guitare acoustique", "Guitare électrique"], ["غيتار صوتي", "غيتار كهربائي"]],
  ['music', ["Techno", "House Music"], ["Techno", "House music"], ["تكنو", "هاوس"]],
  ['music', ["Opera", "Musical"], ["Opéra", "Comédie musicale"], ["أوبرا", "مسرحية موسيقية"]],
  ['clothing', ["Cardigan", "Sweater"], ["Cardigan", "Pull"], ["كارديجان", "كنزة"]],
  ['clothing', ["Loafers", "Moccasins"], ["Mocassins", "Chaussures bateau"], ["حذاء لوفر", "حذاء موكاسين"]],
  ['clothing', ["Vest", "Waistcoat"], ["Gilet", "Veston"], ["سترة بدون أكمام", "صدرية"]],
  ['clothing', ["Beanie", "Beret"], ["Bonnet", "Béret"], ["قبعة شتوية", "بيريه"]],
  ['clothing', ["Trench Coat", "Parka"], ["Trench-coat", "Parka"], ["ترنش كوت", "باركا"]],
  ['furniture', ["Bookcase", "Display Cabinet"], ["Bibliothèque", "Vitrine"], ["خزانة كتب", "فاترينة عرض"]],
  ['furniture', ["Coffee Table", "Nightstand"], ["Table basse", "Table de chevet"], ["طاولة قهوة", "كومودينو"]],
  ['furniture', ["Wardrobe", "Closet"], ["Penderie", "Placard"], ["خزانة ملابس", "دولاب"]],
  ['furniture', ["Ottoman", "Beanbag"], ["Pouf", "Fauteuil poire"], ["عثمانية (بوف)", "بين باج"]],
  ['furniture', ["Desk Lamp", "Floor Lamp"], ["Lampe de bureau", "Lampadaire"], ["مصباح مكتب", "مصباح أرضي"]],
  ['animals', ["Cheetah", "Leopard"], ["Guépard", "Léopard"], ["فهد صياد", "نمر مرقط"]],
  ['animals', ["Otter", "Beaver"], ["Loutre", "Castor"], ["قضاعة", "قندس"]],
  ['animals', ["Alpaca", "Llama"], ["Alpaga", "Lama"], ["ألبكة", "لاما"]],
  ['animals', ["Hedgehog", "Porcupine"], ["Hérisson", "Porc-épic"], ["قنفذ", "شيهم (نيص)"]],
  ['animals', ["Crow", "Raven"], ["Corneille", "Corbeau"], ["غراب", "غداف"]],
  ['technology', ["Smart TV", "Projector"], ["Smart TV", "Projecteur"], ["تلفزيون ذكي", "بروجكتور"]],
  ['technology', ["Power Bank", "Wireless Charger"], ["Batterie externe", "Chargeur sans fil"], ["باور بانك", "شاحن لاسلكي"]],
  ['technology', ["SSD", "USB Flash Drive"], ["Disque SSD", "Clé USB"], ["قرص إس إس دي", "فلاشة ميموري"]],
  ['technology', ["Smart Ring", "Smart Watch"], ["Bague connectée", "Montre connectée"], ["خاتم ذكي", "ساعة ذكية"]],
  ['technology', ["Mechanical Keyboard", "Membrane Keyboard"], ["Clavier mécanique", "Clavier à membrane"], ["كيبورد ميكانيكي", "كيبورد عادي"]],
  ['sports', ["Handball", "Water Polo"], ["Handball", "Water-polo"], ["كرة اليد", "كرة الماء"]],
  ['sports', ["Skateboarding", "Rollerblading"], ["Skateboard", "Roller"], ["لوح تزلج", "حذاء تزلج بعجلات"]],
  ['sports', ["Canoeing", "Rowing"], ["Canoë", "Aviron"], ["قارب كاياك", "تجديف"]],
  ['sports', ["Bowling", "Billiards"], ["Bowling", "Billard"], ["بولينغ", "بلياردو"]],
  ['sports', ["Triathlon", "Marathon"], ["Triathlon", "Marathon"], ["سباق ثلاثي (ترايثلون)", "ماراثون"]],
  ['professions', ["Plumber", "Carpenter"], ["Plombier", "Charpentier"], ["سباك", "نجار"]],
  ['professions', ["Veterinarian", "Zoologist"], ["Vétérinaire", "Zoologiste"], ["طبيب بيطري", "عالم حيوان"]],
  ['professions', ["Civil Engineer", "Architect"], ["Ingénieur civil", "Architecte"], ["مهندس مدني", "مهندس معماري"]],
  ['professions', ["Financial Analyst", "Economist"], ["Analyste financier", "Économiste"], ["محلل مالي", "خبير اقتصادي"]],
  ['professions', ["DJ", "Radio Host"], ["DJ", "Animateur radio"], ["دي جي", "مذيع راديو"]],
  ['nature', ["Fog", "Mist"], ["Brouillard", "Brume"], ["ضباب كثيف", "سديم خفيف"]],
  ['nature', ["Tornado", "Hurricane"], ["Tornade", "Ouragan"], ["إعصار قمعي", "إعصار استوائي"]],
  ['nature', ["Swamp", "Marsh"], ["Marécage", "Marais"], ["مستنقع مائي", "سبخة"]],
  ['nature', ["Breeze", "Gale"], ["Brise", "Coup de vent"], ["نسيم عليل", "رياح عاصفة"]],
  ['nature', ["Oasis", "Lagoon"], ["Oasis", "Lagon"], ["واحة صحراوية", "بحيرة شاطئية"]],
  ['movies', ["Gladiator", "Troy"], ["Gladiator", "Troie"], ["غلادياتور", "طروادة"]],
  ['movies', ["Pulp Fiction", "Reservoir Dogs"], ["Pulp Fiction", "Reservoir Dogs"], ["بلب فيكشن", "ريزرفوار دوغز"]],
  ['movies', ["Joker", "The Dark Knight"], ["Joker", "The Dark Knight"], ["الجوكر", "فارس الظلام"]],
  ['movies', ["Forrest Gump", "The Shawshank Redemption"], ["Forrest Gump", "Les Évadés"], ["فورست غامب", "الخلاص من شاوشانك"]],
  ['movies', ["Oppenheimer", "Dunkirk"], ["Oppenheimer", "Dunkerque"], ["أوبنهايمر", "دونكيرك"]],
  ['videogames', ["Dark Souls", "Elden Ring"], ["Dark Souls", "Elden Ring"], ["دارك سولز", "إلدن رينغ"]],
  ['videogames', ["The Witcher 3", "Skyrim"], ["The Witcher 3", "Skyrim"], ["ذا ويتشر 3", "سكايرم"]],
  ['videogames', ["Resident Evil", "Silent Hill"], ["Resident Evil", "Silent Hill"], ["ريزدنت إيفل", "سايلنت هيل"]],
  ['videogames', ["Animal Crossing", "Stardew Valley"], ["Animal Crossing", "Stardew Valley"], ["أنيمال كروسينغ", "ستاردو فالي"]],
  ['videogames', ["Cyberpunk 2077", "Deus Ex"], ["Cyberpunk 2077", "Deus Ex"], ["سايبربانك 2077", "ديوس إكس"]],
  ['school', ["Compass", "Protractor"], ["Compas", "Rapporteur"], ["فرجار هندسي", "منقلة هندسية"]],
  ['school', ["Highlighter", "Marker"], ["Surligneur", "Feutre"], ["قلم تظليل", "قلم فلوماستر"]],
  ['school', ["Blackboard", "Whiteboard"], ["Tableau noir", "Tableau blanc"], ["سبورة طباشير", "سبورة بيضاء"]],
  ['school', ["Diploma", "Certificate"], ["Diplôme", "Certificat"], ["شهادة دبلوم", "شهادة إتمام"]],
  ['school', ["Stapler", "Paperclip"], ["Agrafeuse", "Trombone"], ["دباسة", "مشبك ورق"]],
  ['art', ["Canvas", "Easel"], ["Toile", "Chevalet"], ["قماش رسم (كانفاس)", "حامل لوحات"]],
  ['art', ["Charcoal", "Graphite"], ["Fusain", "Graphite"], ["فحم رسم", "رصاص جرافيت"]],
  ['art', ["Mosaic", "Stained Glass"], ["Mosaïque", "Vitrail"], ["فسيفساء", "زجاج معشق ملون"]],
  ['art', ["Pottery", "Ceramics"], ["Poterie", "Céramique"], ["فخار يدوي", "سيراميك"]],
  ['art', ["Calligraphy", "Typography"], ["Calligraphie", "Typographie"], ["خط عربي", "طباعة حروف"]],
  ['landmarks', ["Louvre Museum", "Prado Museum"], ["Musée du Louvre", "Musée du Prado"], ["متحف اللوفر", "متحف البرادو"]],
  ['landmarks', ["Stonehenge", "Easter Island Moai"], ["Stonehenge", "Moaï de l'île de Pâques"], ["ستونهنج", "تماثيل جزيرة القيامة"]],
  ['landmarks', ["Burj Al Arab", "Atlantis The Palm"], ["Burj Al Arab", "Atlantis The Palm"], ["برج العرب", "أتلانتس النخلة"]],
  ['landmarks', ["Palace of Versailles", "Buckingham Palace"], ["Château de Versailles", "Palais de Buckingham"], ["قصر فرساي", "قصر باكنغهام"]],
  ['landmarks', ["Brooklyn Bridge", "Tower Bridge"], ["Pont de Brooklyn", "Tower Bridge"], ["جسر بروكلين", "جسر البرج في لندن"]],
  ['transport', ["Submarine", "Yacht"], ["Sous-marin", "Yacht"], ["غواصة بحرية", "يخت فاخر"]],
  ['transport', ["Monorail", "Cable Car"], ["Monorail", "Téléphérique"], ["قطار أحادي (مونوريل)", "تلفريك"]],
  ['transport', ["Container Ship", "Oil Tanker"], ["Porte-conteneurs", "Pétrolier"], ["سفينة حاويات", "ناقلة نفط"]],
  ['transport', ["Hoverboard", "Segway"], ["Hoverboard", "Gyropode"], ["لوح تزلج كهربائي", "سيجواي"]],
  ['transport', ["Paraglider", "Hot Air Balloon"], ["Parapente", "Montgolfière"], ["مظلة طيران شراعي", "منطاد هواء ساخن"]],
  ['social_media', ["Threads", "Bluesky"], ["Threads", "Bluesky"], ["ثريدز", "بلوسكاي"]],
  ['social_media', ["Twitch", "Kick"], ["Twitch", "Kick"], ["تويتش", "كيك"]],
  ['social_media', ["Tinder", "Bumble"], ["Tinder", "Bumble"], ["تندر", "بامبل"]],
  ['social_media', ["WeChat", "WhatsApp"], ["WeChat", "WhatsApp"], ["وي تشات", "واتساب"]],
  ['social_media', ["Spotify", "Apple Podcasts"], ["Spotify", "Apple Podcasts"], ["سبوتيفاي", "أبل بودكاست"]],
  ['accessories', ["Brooch", "Lapel Pin"], ["Broche", "Épingle de revers"], ["بروش", "دبوس طية صدر"]],
  ['accessories', ["Cufflinks", "Tie Clip"], ["Boutons de manchette", "Pince à cravate"], ["أزرار أكمام بدلة", "مشبك ربطة عنق"]],
  ['accessories', ["Scrunchie", "Headband"], ["Chouchou", "Serre-tête"], ["ربطة شعر مطاطية", "طوق شعر"]],
  ['accessories', ["Anklet", "Toe Ring"], ["Bracelet de cheville", "Bague d'orteil"], ["خلخال قدم", "خاتم إصبع القدم"]],
  ['accessories', ["Keyring", "Carabiner"], ["Porte-clés", "Mousqueton"], ["ميدالية مفاتيح", "حلقة تسلق معدنية"]],
  ['brands', ["Under Armour", "Reebok"], ["Under Armour", "Reebok"], ["أندر آرمر", "ريبوك"]],
  ['brands', ["Starbucks", "Costa Coffee"], ["Starbucks", "Costa Coffee"], ["ستاربكس", "كوستا كوفي"]],
  ['brands', ["Cartier", "Tiffany & Co."], ["Cartier", "Tiffany & Co."], ["كارتييه", "تيفاني آند كو"]],
  ['brands', ["Sephora", "Ulta Beauty"], ["Sephora", "Ulta Beauty"], ["سيفورا", "أولتا بيوتي"]],
  ['brands', ["Bentley", "Aston Martin"], ["Bentley", "Aston Martin"], ["بنتلي", "أستون مارتن"]],
  ['flags', ["Netherlands 🇳🇱", "Luxembourg 🇱🇺"], ["Pays-Bas 🇳🇱", "Luxembourg 🇱🇺"], ["هولندا 🇳🇱", "لوكسمبورغ 🇱🇺"]],
  ['flags', ["Sweden 🇸🇪", "Norway 🇳🇴"], ["Suède 🇸🇪", "Norvège 🇳🇴"], ["السويد 🇸🇪", "النرويج 🇳🇴"]],
  ['flags', ["Australia 🇦🇺", "New Zealand 🇳🇿"], ["Australie 🇦🇺", "Nouvelle-Zélande 🇳🇿"], ["أستراليا 🇦🇺", "نيوزيلندا 🇳🇿"]],
  ['flags', ["Poland 🇵🇱", "Indonesia 🇮🇩"], ["Pologne 🇵🇱", "Indonésie 🇮🇩"], ["بولندا 🇵🇱", "إندونيسيا 🇮🇩"]],
  ['flags', ["Switzerland 🇨🇭", "Denmark 🇩🇰"], ["Suisse 🇨🇭", "Danemark 🇩🇰"], ["سويسرا 🇨🇭", "الدنمارك 🇩🇰"]],
  ['footballers', ["Marco van Basten", "Ruud Gullit"], ["Marco van Basten", "Ruud Gullit"], ["ماركو فان باستن", "رود خوليت"]],
  ['footballers', ["Roberto Baggio", "Alessandro Del Piero"], ["Roberto Baggio", "Alessandro Del Piero"], ["روبرتو باجيو", "أليساندرو ديل بييرو"]],
  ['footballers', ["Cafu", "Roberto Carlos"], ["Cafu", "Roberto Carlos"], ["كافو", "روبرتو كارلوس"]],
  ['footballers', ["Carles Puyol", "Gerard Piqué"], ["Carles Puyol", "Gerard Piqué"], ["كارليس بويول", "جيرارد بيكيه"]],
  ['footballers', ["David Beckham", "Andrea Pirlo"], ["David Beckham", "Andrea Pirlo"], ["ديفيد بيكهام", "أندريا بيرلو"]],
  ['headcoaches', ["Diego Simeone", "José Mourinho"], ["Diego Simeone", "José Mourinho"], ["دييغو سيميوني", "جوزيه مورينيو"]],
  ['headcoaches', ["Luis Enrique", "Xavi Hernandez"], ["Luis Enrique", "Xavi Hernandez"], ["لويس إنريكي", "تشافي هيرنانديز"]],
  ['headcoaches', ["Unai Emery", "Julen Lopetegui"], ["Unai Emery", "Julen Lopetegui"], ["أوناي إيمري", "جولين لوبيتيغي"]],
  ['headcoaches', ["Marcelo Bielsa", "Jorge Sampaoli"], ["Marcelo Bielsa", "Jorge Sampaoli"], ["مارسيلو بيلسا", "خورخي سامباولي"]],
  ['headcoaches', ["Vincent Kompany", "Mikel Arteta"], ["Vincent Kompany", "Mikel Arteta"], ["فينسينت كومباني", "ميكيل أرتيتا"]],
  ['football_clubs', ["Chelsea FC", "Arsenal FC"], ["Chelsea", "Arsenal"], ["تشيلسي", "أرسنال"]],
  ['football_clubs', ["Atlético Madrid", "Sevilla FC"], ["Atlético de Madrid", "Séville FC"], ["أتلتيكو مدريد", "إشبيلية"]],
  ['football_clubs', ["Juventus", "Napoli"], ["Juventus", "Naples"], ["يوفنتوس", "نابولي"]],
  ['football_clubs', ["Tottenham Hotspur", "West Ham United"], ["Tottenham", "West Ham"], ["توتنهام هوتسبير", "وست هام"]],
  ['football_clubs', ["Celtic FC", "Rangers FC"], ["Celtic", "Rangers"], ["سلتيك غلاسكو", "رينجرز"]],
  ['anime_heroes', ["Tanjiro Kamado", "Zenitsu Agatsuma"], ["Tanjiro Kamado", "Zenitsu Agatsuma"], ["تانجيرو كامادو", "زينيتسو أغاتسوما"]],
  ['anime_heroes', ["Saitama (One Punch Man)", "Genos"], ["Saitama", "Genos"], ["سايتاما", "جينوس"]],
  ['anime_heroes', ["Ichigo Kurosaki", "Roronoa Zoro"], ["Ichigo Kurosaki", "Roronoa Zoro"], ["إيتشيغو كوروساكي", "رورونوا زورو"]],
  ['anime_heroes', ["Thor", "Loki"], ["Thor", "Loki"], ["ثور", "لوكي"]],
  ['anime_heroes', ["Wolverine", "Deadpool"], ["Wolverine", "Deadpool"], ["وولفرين", "ديدبول"]],
  ['cities_countries', ["Milan", "Madrid"], ["Milan", "Madrid"], ["ميلانو", "مدريد"]],
  ['cities_countries', ["Sydney", "Melbourne"], ["Sydney", "Melbourne"], ["سيدني", "ملبورن"]],
  ['cities_countries', ["Kyoto", "Osaka"], ["Kyoto", "Osaka"], ["كيوتو", "أوساكا"]],
  ['cities_countries', ["Toronto", "Vancouver"], ["Toronto", "Vancouver"], ["تورونتو", "فانكوفر"]],
  ['cities_countries', ["Barcelona", "Valencia"], ["Barcelone", "Valence"], ["برشلونة", "فالنسيا"]],
];

// ═══════════════════════════════════════════════════════════
// GENERATE SQL & CONSTANTS
// ═══════════════════════════════════════════════════════════

function escSQL(s) {
  return s.replace(/'/g, "''");
}

// Build SQL
let sql = `-- Mister White: Auto-generated massive word database
-- Total pairs: ${ALL_PAIRS.length}
-- Generated: ${new Date().toISOString()}

DELETE FROM word_pairs;

INSERT OR REPLACE INTO word_pairs (id, category, difficulty, word_en_civilian, word_en_undercover, word_fr_civilian, word_fr_undercover, word_ar_civilian, word_ar_undercover) VALUES\n`;

const sqlRows = ALL_PAIRS.map((p, i) => {
  const [cat, en, fr, ar] = p;
  return `  ('wp_${i + 1}', '${escSQL(cat)}', 'medium', '${escSQL(en[0])}', '${escSQL(en[1])}', '${escSQL(fr[0])}', '${escSQL(fr[1])}', '${escSQL(ar[0])}', '${escSQL(ar[1])}')`;
});

sql += sqlRows.join(',\n') + ';\n';

// Write SQL
const sqlPath = path.join(__dirname, '../apps/worker/populate_all.sql');
fs.writeFileSync(sqlPath, sql);
console.log(`✅ Generated SQL file with ${ALL_PAIRS.length} records → apps/worker/populate_all.sql`);

// ═══════════════════════════════════════════════════════════
// BUILD CONSTANTS.TS
// ═══════════════════════════════════════════════════════════

const byCategory = {};
ALL_PAIRS.forEach((p) => {
  const [cat] = p;
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(p);
});

let tsContent = `// Auto-generated Mister White word pairs database
// Total pairs: ${ALL_PAIRS.length}
// Generated: ${new Date().toISOString()}

import type { WordPair, GameSettings } from './types';

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

ALL_PAIRS.forEach((p, i) => {
  const [cat, en, fr, ar] = p;
  tsContent += `  {
    id: 'wp_${i + 1}',
    category: '${cat}',
    difficulty: 'medium',
    en: { civilian: ${JSON.stringify(en[0])}, undercover: ${JSON.stringify(en[1])} },
    fr: { civilian: ${JSON.stringify(fr[0])}, undercover: ${JSON.stringify(fr[1])} },
    ar: { civilian: ${JSON.stringify(ar[0])}, undercover: ${JSON.stringify(ar[1])} },
  },\n`;
});

tsContent += `];\n\n`;

// Add CATEGORIES constant
tsContent += `export const CATEGORIES = ${JSON.stringify(Object.keys(byCategory), null, 2)};\n\n`;

// Category counts
tsContent += `export const CATEGORY_COUNTS: Record<string, number> = {\n`;
Object.entries(byCategory).forEach(([cat, pairs]) => {
  tsContent += `  '${cat}': ${pairs.length},\n`;
});
tsContent += `};\n\n`;

tsContent += `export const INITIAL_WORDS: WordPair[] = WORD_PAIRS;\n`;

const constantsPath = path.join(__dirname, '../packages/shared/src/constants.ts');
fs.writeFileSync(constantsPath, tsContent);

// Also sync to worktree if present
const worktreeConstantsPath = path.join(__dirname, '../.claude/worktrees/phase1-complete/packages/shared/src/constants.ts');
if (fs.existsSync(path.dirname(worktreeConstantsPath))) {
  fs.writeFileSync(worktreeConstantsPath, tsContent);
}

console.log(`✅ Updated constants.ts with ${ALL_PAIRS.length} word pairs across ${Object.keys(byCategory).length} categories`);
console.log(`\n📊 Category breakdown:`);
Object.entries(byCategory).forEach(([cat, pairs]) => {
  console.log(`   ${cat}: ${pairs.length} pairs`);
});
console.log(`\n   TOTAL: ${ALL_PAIRS.length} word pairs`);
