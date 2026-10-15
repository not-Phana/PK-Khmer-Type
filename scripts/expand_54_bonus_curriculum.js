const fs = require('fs');
const path = require('path');

// ----------------------------------------------------
// KHMER EXERCISES DATA (Levels 14 & 15: 12 lessons x 5 = 60 exercises)
// ----------------------------------------------------
const KHMER_L14_L15_EXERCISES = {
  // L14-01: Mangala Sutta
  "L14-01-E01": { type: "drill", content: "ការមិនសេពគប់នូវបុគ្គលពាលទាំងឡាយ", description: "Mangala Sutta: Avoiding the Foolish" },
  "L14-01-E02": { type: "drill", content: "ការសេពគប់នូវបុគ្គលជាបណ្ឌិតទាំងឡាយ និងការបូជាដល់បុគ្គលដែលគួរបូជា", description: "Mangala Sutta: Associating with the Wise" },
  "L14-01-E03": { type: "drill", content: "ការនៅក្នុងប្រទេសដ៏សមគួរ ភាពជាអ្នកបានធ្វើបុណ្យទុកមកហើយក្នុងកាលមុន និងការដំកល់ខ្លួនទុកដោយប្រពៃ", description: "Mangala Sutta: Living in a Fitting Land" },
  "L14-01-E04": { type: "drill", content: "សេចក្តីដឹងគុណដែលអ្នកដទៃធ្វើដល់ខ្លួន ការប្រព្រឹត្តធម៌ដ៏ប្រសើរ និងការជួយសង្គ្រោះដល់ញាតិទាំងឡាយ នេះជាមង្គលដ៏ឧត្តម", description: "Mangala Sutta: Gratitude and Noble Conduct" },
  "L14-01-E05": { type: "drill", content: "ចិត្តនៃបុគ្គលណា ដែលលោកធម៌ទាំងឡាយប៉ះពាល់ហើយ មិនរំភើបញាប់ញ័រ មិនមានសេចក្តីសោក មានធូលីគឺកិលេសទៅប្រាសហើយ ជាចិត្តក្សេមក្សាន្ត នេះជាមង្គលដ៏ឧត្តមក្នុងលោក", description: "Mangala Sutta: The Unshakeable Mind" },

  // L14-02: Karaniya Metta Sutta
  "L14-02-E01": { type: "drill", content: "សូមសត្វទាំងពួងបានសេចក្តីសុខក្សេមក្សាន្ត", description: "Metta Sutta: Universal Well-Being" },
  "L14-02-E02": { type: "drill", content: "សូមកុំឱ្យមានការបៀតបៀនគ្នាទៅវិញទៅមកក្នុងទីណាមួយឡើយ", description: "Metta Sutta: Non-Harm and Peace" },
  "L14-02-E03": { type: "drill", content: "មាតាថែរក្សាបុត្របង្កើតតែមួយដោយអាយុយ៉ាងណា បុគ្គលគប្បីចម្រើនមេត្តាចិត្តរក្សាសត្វទាំងពួងយ៉ាងនោះដែរ", description: "Metta Sutta: A Mother's Protection" },
  "L14-02-E04": { type: "drill", content: "បុគ្គលគប្បីផ្សាយមេត្តាចិត្តឥតមានប្រមាណ ទៅក្នុងសត្វលោកទាំងមូល ទាំងខាងលើ ទាំងខាងក្រោម ទាំងទិសទទឹង ឥតចង្អៀត ឥតពៀរ ឥតសត្រូវ", description: "Metta Sutta: Boundless Goodwill" },
  "L14-02-E05": { type: "drill", content: "ទោះឈរ ដើរ អង្គុយ ឬដេកក្តី បុគ្គលគួរតម្កល់នូវសតិនេះទុកឱ្យមាំមួន អ្នកប្រាជ្ញទាំងឡាយហៅការរស់នៅបែបនេះថា ជាព្រហ្មវិហារធម៌ដ៏ប្រសើរក្នុងលោកនេះ", description: "Metta Sutta: Constant Mindfulness of Metta" },

  // L14-03: Classical Smot Poetry
  "L14-03-E01": { type: "drill", content: "ឱព្រះគុណថ្លៃ ធ្ងន់លើសធរណី", description: "Smot Verse: Filial Reverence" },
  "L14-03-E02": { type: "drill", content: "ម្តាយបីថ្នាក់ថ្នម តាំងពីតូចស្មើ មិនឱ្យហ្មងសៅ ត្រជាក់ក្នុងឱរា", description: "Smot Verse: Maternal Tender Care" },
  "L14-03-E03": { type: "drill", content: "ទឹកដោះម្តាយថ្លៃ ស្រក់តក់បន្តក់ចិញ្ចឹមរូបកាយ ទោះបីនឿយហត់ខំទ្រាំពុះពារមិនគិតជីវិត", description: "Smot Verse: Unconditional Sacrifice" },
  "L14-03-E04": { type: "drill", content: "កូនសូមក្រាបថ្វាយបង្គំព្រះគុណ ទាំងយប់ទាំងថ្ងៃ សូមឱ្យមាតាបិតាបានក្តីសុខក្សេមក្សាន្តជានិរន្តរ៍តរៀងទៅ", description: "Smot Verse: Devotional Prayers" },
  "L14-03-E05": { type: "drill", content: "ចូរអ្នកទាំងឡាយកុំបីធ្វេសប្រហែសនឹងគុណអ្នកមានគុណ ត្រូវដឹងគុណតបគុណដោយចិត្តស្មោះត្រង់ ទើបជីវិតមានសិរីសួស្តីនិងសេចក្តីចម្រើនរុងរឿង", description: "Smot Verse: Living with Sincere Gratitude" },

  // L14-04: Four Sublime Abodes & Noble Truths
  "L14-04-E01": { type: "drill", content: "មេត្តា ករុណា មុទិតា និងឧបេក្ខា", description: "Brahmavihara: Four Cardinal Virtues" },
  "L14-04-E02": { type: "drill", content: "មេត្តាគឺបំណងឱ្យអ្នកដទៃបានសុខ ករុណាគឺជួយរំលត់ទុក្ខរបស់អ្នកដទៃ", description: "Brahmavihara: Goodwill and Compassion" },
  "L14-04-E03": { type: "drill", content: "មុទិតាគឺត្រេកអរចំពោះសេចក្តីសុខរបស់គេ ឧបេក្ខាគឺតម្កល់ចិត្តជាកណ្តាលមិនលម្អៀងដោយកម្លាំងសេចក្តីស្រឡាញ់ឬស្អប់", description: "Brahmavihara: Altruistic Joy and Equanimity" },
  "L14-04-E04": { type: "drill", content: "អរិយសច្ចទាំងបួនប្រការរួមមាន ទុក្ខសច្ច សមុទយសច្ច និរោធសច្ច និងមគ្គសច្ច ដែលជាផ្លូវឆ្ពោះទៅកាន់សេចក្តីស្ងប់រម្ងាប់", description: "Noble Truths: Path to Liberation" },
  "L14-04-E05": { type: "drill", content: "ការអប់រំចិត្តឱ្យស្អាតបរិសុទ្ធ ចាកផុតពីកិលេសគ្រឿងសៅហ្មង នាំមកនូវសេចក្តីសុខពិតប្រាកដក្នុងបច្ចុប្បន្ន និងអនាគតកាល", description: "Noble Truths: Inner Peace and Clarity" },

  // L14-05: High Pali-Sanskrit Compounds
  "L14-05-E01": { type: "drill", content: "វិចារណញាណ និងសាមគ្គីភាព", description: "High Lexicon: Discernment and Unity" },
  "L14-05-E02": { type: "drill", content: "ការអភិវឌ្ឍប្រកបដោយចីរភាព និងគុណធម៌សង្គម", description: "High Lexicon: Sustainable Progress" },
  "L14-05-E03": { type: "drill", content: "សច្ចធម៌ យុត្តិធម៌ និងសមភាព គឺជាគ្រឹះនៃសង្គមដ៏រុងរឿងនិងសុខដុមរមនា", description: "High Lexicon: Truth, Justice, and Harmony" },
  "L14-05-E04": { type: "drill", content: "ពុទ្ធសាសនានិងវប្បធម៌ខ្មែរ បានចាក់ឫសយ៉ាងជ្រៅក្នុងផ្នត់គំនិតនិងការរស់នៅរបស់ប្រជាជនតាំងពីបុរាណរហូតមកដល់បច្ចុប្បន្ន", description: "High Lexicon: Deep Roots of Khmer Heritage" },
  "L14-05-E05": { type: "drill", content: "បញ្ញាញាណដែលកើតចេញពីការស្តាប់ ការត្រិះរិះពិចារណា និងការអនុវត្តជាក់ស្តែង ជួយឱ្យមនុស្សយល់ដឹងពីការពិតនៃជីវិតនិងលោកិយ", description: "High Lexicon: Three Wisdom Foundations" },

  // L14-06: Monastic Scribe Marathon
  "L14-06-E01": { type: "drill", content: "នត្ថិ សន្តិ បរំ សុខំ សេចក្តីសុខដទៃក្រៅពីសេចក្តីស្ងប់មិនមានឡើយ", description: "Monastic Sprint: Supreme Stillness" },
  "L14-06-E02": { type: "drill", content: "ការឈ្នះខ្លួនឯងប្រសើរជាងការឈ្នះអ្នកដទៃរាប់ពាន់ដងក្នុងសង្គ្រាម", description: "Monastic Sprint: Conquering the Self" },
  "L14-06-E03": { type: "drill", content: "ពន្លឺព្រះអាទិត្យបំភ្លឺផែនដីនៅពេលថ្ងៃ ពន្លឺព្រះចន្ទបំភ្លឺផ្ទៃមេឃនៅពេលយប់ រីឯពន្លឺនៃបញ្ញាបរិសុទ្ធបំភ្លឺគ្រប់ពេលវេលា", description: "Monastic Sprint: The Inextinguishable Light of Wisdom" },
  "L14-06-E04": { type: "drill", content: "បុគ្គលប្រកបដោយសីលនិងបញ្ញា តែងរុងរឿងក្នុងចំណោមមនុស្សទាំងឡាយ ដូចផ្កាឈូកដែលរីកស្គុះស្គាយក្នុងទឹកថ្លាត្រជាក់", description: "Monastic Sprint: The Lotus Blooming" },
  "L14-06-E05": { type: "drill", content: "ការវាយអត្ថបទដ៏ស្ទាត់ជំនាញប្រៀបបាននឹងចិត្តដែលត្រូវបានបង្ហាត់យ៉ាងល្អ រមែងនាំមកនូវភាពត្រឹមត្រូវ រហ័សរហួន និងសេចក្តីស្ងប់ក្នុងគ្រប់ចង្វាក់នៃម្រាមដៃ", description: "Monastic Sprint: Scribe's Meditative Cadence" },

  // L15-01: Constitution of Cambodia
  "L15-01-E01": { type: "drill", content: "ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ", description: "Constitution: National Motto" },
  "L15-01-E02": { type: "drill", content: "ប្រទេសកម្ពុជាអនុវត្តនយោបាយប្រជាធិបតេយ្យសេរីពហុបក្ស", description: "Constitution: Pluralistic Democracy" },
  "L15-01-E03": { type: "drill", content: "ប្រជាពលរដ្ឋខ្មែរមានភាពស្មើគ្នាចំពោះមុខច្បាប់ ដោយគ្មានការរើសអើងពូជសាសន៍ ពណ៌សម្បុរ ឬភេទឡើយ", description: "Constitution: Equality Before the Law" },
  "L15-01-E04": { type: "drill", content: "អធិបតេយ្យភាពជាតិកើតចេញពីប្រជាជនខ្មែរគ្រប់រូប ហើយអំណាចទាំងអស់ក្នុងរដ្ឋត្រូវបានបែងចែកជានីតិបញ្ញត្តិ នីតិប្រតិបត្តិ និងតុលាការ", description: "Constitution: Separation of State Powers" },
  "L15-01-E05": { type: "drill", content: "រដ្ឋធម្មនុញ្ញគឺជាច្បាប់កំពូលនៃព្រះរាជាណាចក្រកម្ពុជា ច្បាប់និងសេចក្តីសម្រេចទាំងឡាយនៃស្ថាប័ននានាត្រូវតែស្របទៅតាមរដ្ឋធម្មនុញ្ញជាដាច់ខាត", description: "Constitution: Supremacy of the Constitution" },

  // L15-02: Tonle Sap & Environmental Heritage
  "L15-02-E01": { type: "drill", content: "បឹងទន្លេសាបជាដង្ហើមសេដ្ឋកិច្ចនិងធម្មជាតិខ្មែរ", description: "Environment: Great Tonle Sap Lake" },
  "L15-02-E02": { type: "drill", content: "ការការពារព្រៃលិចទឹកជួយរក្សាពូជត្រីនិងលំនឹងប្រព័ន្ធបរិស្ថានធម្មជាតិ", description: "Environment: Flooded Forest Conservation" },
  "L15-02-E03": { type: "drill", content: "ធនធានធម្មជាតិព្រៃឈើ សត្វព្រៃ និងប្រភពទឹកស្អាត គឺជាសម្បត្តិរួមដែលយើងទាំងអស់គ្នាត្រូវរួមគ្នាថែរក្សាការពារ", description: "Environment: Collective Natural Heritage" },
  "L15-02-E04": { type: "drill", content: "តំបន់ជីវមណ្ឌលបឹងទន្លេសាបត្រូវបានទទួលស្គាល់ដោយអង្គការយូណេស្កូ ជាទីតាំងធម្មជាតិដែលមានជីវចម្រុះដ៏សម្បូរបែបបំផុតមួយក្នុងពិភពលោក", description: "Environment: UNESCO Biosphere Reserve" },
  "L15-02-E05": { type: "drill", content: "ការអភិវឌ្ឍដោយចីរភាពតម្រូវឱ្យមានតុល្យភាពរវាងការរីកចម្រើនសេដ្ឋកិច្ចនិងការការពារបរិស្ថាន ដើម្បីធានាអនាគតបៃតងសម្រាប់កូនចៅជំនាន់ក្រោយ", description: "Environment: Green Future and Intergenerational Equity" },

  // L15-03: Cambodian Renaissance & Innovation
  "L15-03-E01": { type: "drill", content: "បច្ចេកវិទ្យាឌីជីថលនិងនវានុវត្តន៍សម្រាប់យុវជន", description: "Innovation: Digital Renaissance" },
  "L15-03-E02": { type: "drill", content: "ការបណ្តុះបណ្តាលជំនាញបច្ចេកទេសនិងចំណេះដឹងជួយពង្រឹងសេដ្ឋកិច្ចជាតិ", description: "Innovation: Technical Empowerment" },
  "L15-03-E03": { type: "drill", content: "ការប្រើប្រាស់ប្រព័ន្ធទូទាត់អេឡិចត្រូនិកទំនើប បានជួយសម្រួលដល់ការធ្វើពាណិជ្ជកម្មនិងបង្កើនប្រសិទ្ធភាពសេដ្ឋកិច្ចទូទាំងប្រទេស", description: "Innovation: Modern Electronic Payments" },
  "L15-03-E04": { type: "drill", content: "សហគ្រិនភាពនិងគំនិតច្នៃប្រឌិតថ្មីៗរបស់យុវជនកម្ពុជា កំពុងជំរុញប្រទេសជាតិឆ្ពោះទៅកាន់សេដ្ឋកិច្ចឌីជីថលប្រកបដោយថាមពលនិងភាពប្រកួតប្រជែង", description: "Innovation: Youth Entrepreneurship and Vigor" },
  "L15-03-E05": { type: "drill", content: "ការវិនិយោគលើវិស័យអប់រំ វិទ្យាសាស្ត្រ និងការស្រាវជ្រាវ គឺជាកាតាលីករដ៏សំខាន់បំផុតក្នុងការកសាងសង្គមជាតិមួយដែលមានចំណេះដឹងនិងវិបុលភាពយូរអង្វែង", description: "Innovation: Long-Term Knowledge Society" },

  // L15-04: Health & Scientific Literacy
  "L15-04-E01": { type: "drill", content: "សុខភាពល្អគឺជាទ្រព្យសម្បត្តិដ៏មានតម្លៃបំផុត", description: "Health: The Greatest Treasure" },
  "L15-04-E02": { type: "drill", content: "ការហូបស្អាត ផឹកស្អាត និងរស់នៅស្អាត ជួយការពាររាងកាយពីរោគាទាំងពួង", description: "Health: Clean Living and Hygiene" },
  "L15-04-E03": { type: "drill", content: "វេជ្ជសាស្ត្រទំនើបនិងឱសថបុរាណខ្មែរ បានសហការគ្នាយ៉ាងល្អក្នុងការថែទាំសុខុមាលភាពប្រជាពលរដ្ឋនៅគ្រប់តំបន់", description: "Health: Integrative Medical Practice" },
  "L15-04-E04": { type: "drill", content: "ការហាត់ប្រាណជាប្រចាំ ការបរិភោគអាហាររូបត្ថម្ភគ្រប់គ្រាន់ និងការសម្រាកឱ្យបានត្រឹមត្រូវ ជួយពង្រឹងកម្លាំងកាយមាំមួននិងសុខភាពផ្លូវចិត្ត", description: "Health: Resilience and Mental Balance" },
  "L15-04-E05": { type: "drill", content: "ការយល់ដឹងអំពីសុខភាពសហគមន៍និងការការពារជំងឺឆ្លង ជាកាតព្វកិច្ចរបស់ពលរដ្ឋគ្រប់រូប ដើម្បីរួមគ្នាថែរក្សាសហគមន៍ឱ្យមានសុវត្ថិភាពនិងសុភមង្គល", description: "Health: Community Health Consciousness" },

  // L15-05: Cultural Diplomacy & UNESCO Monuments
  "L15-05-E01": { type: "drill", content: "ប្រាសាទអង្គរវត្តជាដួងព្រលឹងនិងមោទនភាពជាតិខ្មែរ", description: "Monuments: Angkor Wat's Soul" },
  "L15-05-E02": { type: "drill", content: "របាំព្រះរាជទ្រព្យនិងល្ខោនខោល បានទទួលការចុះបញ្ជីបេតិកភណ្ឌអរូបីពិភពលោក", description: "Monuments: Royal Ballet and Lakhon Khol" },
  "L15-05-E03": { type: "drill", content: "ប្រាសាទព្រះវិហារ ប្រាសាទសម្បូរព្រៃគុហ៍ និងប្រាសាទកោះកេរ បង្ហាញពីភាពអស្ចារ្យនៃស្ថាបត្យកម្មខ្មែរក្នុងសម័យបុរាណ", description: "Monuments: Ancient Architectural Triumphs" },
  "L15-05-E04": { type: "drill", content: "វប្បធម៌ សិល្ប៍សាស្ត្រ និងប្រពៃណីទំនៀមទម្លាប់ខ្មែរ ជាស្ពានតភ្ជាប់ចំណងមិត្តភាពរវាងប្រជាជនកម្ពុជានិងបណ្តាប្រទេសនានាជុំវិញសកលលោក", description: "Monuments: Cultural Bridges to Humanity" },
  "L15-05-E05": { type: "drill", content: "ការថែរក្សាការពារបេតិកភណ្ឌដូនតា មិនត្រឹមតែជាកាតព្វកិច្ចចំពោះប្រវត្តិសាស្ត្រប៉ុណ្ណោះទេ ប៉ុន្តែជាមូលដ្ឋានគ្រឹះនៃអត្តសញ្ញាណជាតិដ៏រឹងមាំសម្រាប់មនុស្សជំនាន់ក្រោយ", description: "Monuments: Indestructible National Identity" },

  // L15-06: Supreme Grandmaster Scribe Ultramarathon
  "L15-06-E01": { type: "drill", content: "អក្សរខ្មែរគ្រប់តួ អក្សរសិល្ប៍គ្រប់ទម្រង់ រុងរឿងលើទឹកដីសុវណ្ណភូមិ", description: "Ultramarathon: Golden Homeland Splendor" },
  "L15-06-E02": { type: "drill", content: "ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ", description: "Ultramarathon: 33 Consonants Grand Review" },
  "L15-06-E03": { type: "drill", content: "ការរួមបញ្ចូលគ្នាតួអក្សរចម្រុះ ជើងអក្សរ និងវណ្ណយុត្តិទាំងអស់ បង្កើតបានជាភាសាមួយដ៏សម្បូរបែបនិងពិរោះរណ្តំ", description: "Ultramarathon: Complex Ligatures and Diacritics" },
  "L15-06-E04": { type: "drill", content: "អ្នកដែលបានឆ្លងកាត់ការហ្វឹកហាត់គ្រប់មេរៀនទាំងអស់ ឥឡូវនេះបានក្លាយជាស្មៀនកំពូលដែលមានសមត្ថភាពវាយអក្សរខ្មែរដោយឥតស្ទាក់ស្ទើរ", description: "Ultramarathon: The Master Scribe Reaches the Summit" },
  "L15-06-E05": { type: "drill", content: "សូមអបអរសាទរចំពោះជ័យជំនះដ៏អស្ចារ្យនេះ អ្នកបានបញ្ចប់ការហ្វឹកហាត់កម្រិតកំពូលទាំងស្រុង ហើយបានកាន់កាប់នូវភាពស្ទាត់ជំនាញវាយក្តារចុចខ្មែរយ៉ាងពេញលេញបរិបូរណ៍", description: "Ultramarathon: Grandmaster Scribe Coronation" }
};

// ----------------------------------------------------
// ENGLISH EXERCISES DATA (Levels 15 & 16: 12 lessons x 5 = 60 exercises)
// ----------------------------------------------------
const ENGLISH_L15_L16_EXERCISES = {
  // L15-01: Plato's Cave & Republic
  "L15-01-E01": { type: "drill", content: "The truth is often hidden in shadows.", description: "Plato: Illusions of the Cave" },
  "L15-01-E02": { type: "drill", content: "Behold human beings living in an underground cave facing only reflections on the wall.", description: "Plato: The Captives' Perspective" },
  "L15-01-E03": { type: "drill", content: "When one is released and turns toward the bright sunlight, the initial glare is painful and bewildering.", description: "Plato: Turning Toward the Light" },
  "L15-01-E04": { type: "drill", content: "Gradually the eyes adjust to behold real trees, stars, and finally the sun itself, understanding the true cause of all visible things.", description: "Plato: Beholding the True Sun" },
  "L15-01-E05": { type: "drill", content: "Returning back down into the darkness requires patience, for those who have seen the light of wisdom must guide their fellow citizens toward justice and truth.", description: "Plato: The Philosopher's Duty" },

  // L15-02: Gettysburg Address
  "L15-02-E01": { type: "drill", content: "Four score and seven years ago our fathers brought forth.", description: "Lincoln: Conceived in Liberty" },
  "L15-02-E02": { type: "drill", content: "Conceived in liberty and dedicated to the proposition that all men are created equal.", description: "Lincoln: The Universal Proposition" },
  "L15-02-E03": { type: "drill", content: "Now we are engaged in a great civil war, testing whether that nation or any nation so conceived can long endure.", description: "Lincoln: The Great Test of Endurance" },
  "L15-02-E04": { type: "drill", content: "We have come to dedicate a portion of that field as a final resting place for those who gave their lives that that nation might live.", description: "Lincoln: Consecrating the Battlefield" },
  "L15-02-E05": { type: "drill", content: "It is rather for us to be here dedicated to the great task remaining before us, that government of the people, by the people, for the people, shall not perish from the earth.", description: "Lincoln: Government of the People" },

  // L15-03: MLK & Moral Universe
  "L15-03-E01": { type: "drill", content: "Injustice anywhere is a threat to justice everywhere.", description: "King: Interconnected Destinies" },
  "L15-03-E02": { type: "drill", content: "The arc of the moral universe is long, but it bends toward justice.", description: "King: The Moral Arc" },
  "L15-03-E03": { type: "drill", content: "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin.", description: "King: Content of Character" },
  "L15-03-E04": { type: "drill", content: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", description: "King: The Triumph of Light" },
  "L15-03-E05": { type: "drill", content: "With this faith, we will be able to hew out of the mountain of despair a stone of hope, transforming jangling discords into a beautiful symphony of brotherhood.", description: "King: Symphony of Brotherhood" },

  // L15-04: Seneca on Brevity of Life
  "L15-04-E01": { type: "drill", content: "Life is long if you know how to use it.", description: "Seneca: The Value of Time" },
  "L15-04-E02": { type: "drill", content: "We are not given a short life but we make it short, and we are not ill-supplied but wasteful of it.", description: "Seneca: Squandering Days" },
  "L15-04-E03": { type: "drill", content: "Putting things off is the biggest waste of life: it snatches away each day as it comes and denies us the present.", description: "Seneca: Procrastination's Toll" },
  "L15-04-E04": { type: "drill", content: "The whole future lies in uncertainty; live immediately. Dedicate your mind to virtue and the calm contemplation of nature.", description: "Seneca: Live Immediately" },
  "L15-04-E05": { type: "drill", content: "He who devotes every hour to his own needs, who organizes each day as if it were a complete lifetime, neither longs for nor fears tomorrow.", description: "Seneca: Serenity in the Present" },

  // L15-05: Voltaire & Enlightenment
  "L15-05-E01": { type: "drill", content: "Judge a man by his questions rather than his answers.", description: "Voltaire: The Inquiring Spirit" },
  "L15-05-E02": { type: "drill", content: "Appreciation is a wonderful thing: it makes what is excellent in others belong to us as well.", description: "Voltaire: Generous Appreciation" },
  "L15-05-E03": { type: "drill", content: "I may disagree with what you have to say, but I will defend to the death your right to say it.", description: "Voltaire: Freedom of Discourse" },
  "L15-05-E04": { type: "drill", content: "Doubt is not a pleasant condition, but certainty is an absurd one. Reason and toleration are the true guardians of humanity.", description: "Voltaire: Intellectual Humility" },
  "L15-05-E05": { type: "drill", content: "Let us read, and let us dance; these two amusements will never do any harm to the world. Above all, let us cultivate our own garden with diligence.", description: "Voltaire: Cultivating the Garden" },

  // L15-06: Socratic Method & The Apology
  "L15-06-E01": { type: "drill", content: "The unexamined life is not worth living.", description: "Socrates: The Examined Life" },
  "L15-06-E02": { type: "drill", content: "I know that I am intelligent, because I know that I know nothing.", description: "Socrates: The First Step to Wisdom" },
  "L15-06-E03": { type: "drill", content: "To find yourself, think for yourself. True wisdom comes to each of us when we realize how little we understand.", description: "Socrates: Independent Reflection" },
  "L15-06-E04": { type: "drill", content: "Employ your time in improving yourself by other men writings, so that you shall come easily by what others have labored hard for.", description: "Socrates: Learning from the Masters" },
  "L15-06-E05": { type: "drill", content: "Virtue does not come from wealth, but from virtue comes money and every other good of man, both public and private. The greatest good is to converse daily about goodness.", description: "Socrates: The True Source of Wealth" },

  // L16-01: Alan Turing on Computation
  "L16-01-E01": { type: "drill", content: "Can machines think? We begin with the imitation game.", description: "Turing: The Imitation Game" },
  "L16-01-E02": { type: "drill", content: "A computer can be called intelligent if it could deceive a human into believing that it was also human.", description: "Turing: Defining Mechanical Intelligence" },
  "L16-01-E03": { type: "drill", content: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", description: "Turing: The Horizon of Possibility" },
  "L16-01-E04": { type: "drill", content: "Mathematical reasoning may be regarded rather schematically as the exercise of a combination of two facilities: intuition and ingenuity.", description: "Turing: Intuition and Ingenuity" },
  "L16-01-E05": { type: "drill", content: "The idea behind digital computers may be explained by saying that these machines are intended to carry out any operations which could be done by a human computer following strict rules.", description: "Turing: Universal State Machines" },

  // L16-02: Ada Lovelace & Analytical Engine
  "L16-02-E01": { type: "drill", content: "The Analytical Engine weaves algebraical patterns.", description: "Lovelace: The Poetic Science" },
  "L16-02-E02": { type: "drill", content: "It operates on numbers, but could weave threads of any symbol or musical harmony.", description: "Lovelace: Symbolic Computation" },
  "L16-02-E03": { type: "drill", content: "In distributing and combining the truths of analysis, the engine creates a new, vast, and powerful language for future use.", description: "Lovelace: A New Symbolic Language" },
  "L16-02-E04": { type: "drill", content: "We may say most aptly that the Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.", description: "Lovelace: Jacquard Looms of Logic" },
  "L16-02-E05": { type: "drill", content: "The distinctive characteristic of the engine is the introduction of the principle of operational cycling, linking abstract science with tangible execution.", description: "Lovelace: Algorithmic Looping" },

  // L16-03: Unix Philosophy & Architecture
  "L16-03-E01": { type: "drill", content: "Write programs that do one thing and do it well.", description: "Unix: The Core Tenet" },
  "L16-03-E02": { type: "drill", content: "Write programs to work together. Write programs to handle text streams because that is a universal interface.", description: "Unix: Composable Streams" },
  "L16-03-E03": { type: "drill", content: "Simplicity is prerequisite for reliability. Complex systems that work inevitably evolve from simple systems that worked.", description: "Unix: Gall's Law of Systems" },
  "L16-03-E04": { type: "drill", content: "Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new features.", description: "Unix: Modular Renewal" },
  "L16-03-E05": { type: "drill", content: "Design for simplicity, tenacity, and composability. When components communicate via standard protocols, the entire operating ecosystem achieves boundless flexibility.", description: "Unix: Boundless Ecosystems" },

  // L16-04: Quantum Computation
  "L16-04-E01": { type: "drill", content: "Information is physical; computation is mechanical.", description: "Quantum: Landauer's Principle" },
  "L16-04-E02": { type: "drill", content: "In quantum systems, states exist in coherent superposition until irreversible observation occurs.", description: "Quantum: Superposition and Collapse" },
  "L16-04-E03": { type: "drill", content: "Entanglement binds quantum particles across arbitrary distance, demonstrating non-local correlated correlations beyond classical limits.", description: "Quantum: Spooky Correlation" },
  "L16-04-E04": { type: "drill", content: "Reversible logic gates conserve entropy, allowing quantum circuits to execute unitary transformations with vanishing thermodynamic dissipation.", description: "Quantum: Reversible Unitary Gates" },
  "L16-04-E05": { type: "drill", content: "By harnessing linear superpositions and constructive interference of phase amplitudes, quantum algorithms explore computational spaces exponentially faster than classical state machines.", description: "Quantum: Exponential Phase Speedup" },

  // L16-05: Information Theory & Shannon Entropy
  "L16-05-E01": { type: "drill", content: "Information is the reduction of uncertainty.", description: "Shannon: Defining Information" },
  "L16-05-E02": { type: "drill", content: "The fundamental problem of communication is reproducing at one point a message chosen at another point.", description: "Shannon: The Communication Problem" },
  "L16-05-E03": { type: "drill", content: "Entropy measures the average amount of information produced by a stochastic source of data.", description: "Shannon: Information Entropy" },
  "L16-05-E04": { type: "drill", content: "When transmission channels introduce noise, error-correcting codes ensure arbitrary fidelity whenever the source rate remains strictly below channel capacity.", description: "Shannon: Channel Capacity Theorem" },
  "L16-05-E05": { type: "drill", content: "Public key cryptography establishes symmetric secrets over insecure media through computational asymmetry, turning one-way mathematical functions into unbreakable shields of privacy.", description: "Shannon: Cryptographic Shields" },

  // L16-06: Supreme Grandmaster Polyglot Ultramarathon
  "L16-06-E01": { type: "drill", content: "Welcome to the highest summit of touch-typing mastery.", description: "Ultramarathon: The Final Summit" },
  "L16-06-E02": { type: "drill", content: "Speed, rhythm, and accuracy unite as fingers glide across rows without conscious effort or fatigue.", description: "Ultramarathon: Effortless Cadence" },
  "L16-06-E03": { type: "drill", content: "From the ancient epics of Homer to modern algorithms that map the stars, language is the bridge between human thought and eternity.", description: "Ultramarathon: The Cosmic Bridge of Thought" },
  "L16-06-E04": { type: "drill", content: "You have proven disciplined focus, mastering hundreds of exercises, thousands of sentences, and tens of thousands of flawless keystrokes.", description: "Ultramarathon: Proof of Absolute Focus" },
  "L16-06-E05": { type: "drill", content: "You are now officially a Grandmaster Scribe. The entire keyboard is your instrument, ready to express whatever ideas, stories, and innovations you choose to create!", description: "Ultramarathon: Scribe Coronation" }
};

// ----------------------------------------------------
// LEVEL DEFINITIONS
// ----------------------------------------------------
const KHMER_LEVEL_SPECS = [
  {
    lvlNum: 14,
    title: "Buddhist Wisdom, Pali Roots & Smot Poetry",
    titleKm: "គម្ពីរបុរាណ ពាក្យបាលី-សំស្ក្រឹត & កាព្យស្មូត",
    desc: "Sacred suttas, classical chanting meters, and high-register Dhammic terminology.",
    obj: "Master classical Dhammic literature and rhythmic poetry"
  },
  {
    lvlNum: 15,
    title: "Constitutional Codes, Heritage & Ultramarathon",
    titleKm: "រដ្ឋធម្មនុញ្ញ បេតិកភណ្ឌ & មហាសម្ភោធកំពូល",
    desc: "The ultimate touch-typing summit: formal legal articles, ecological prose, and scribe marathons.",
    obj: "Attain supreme Grandmaster status across all 33 consonants, vowels, and diacritics"
  }
];

const KHMER_LEVEL_LESSON_TITLES = {
  14: [
    { order: 1, title: "Mangala Sutta & Supreme Blessings", titleKm: "មង្គលសូត្រ ៣៨ ប្រការ — សេចក្តីចម្រើនដ៏ឧត្តម", desc: "Type classical Pali-Khmer verses from the Mangala Sutta on virtue and nobility.", obj: "Type classical blessing maxims with precision" },
    { order: 2, title: "Karaniya Metta Sutta: Universal Loving-Kindness", titleKm: "ករណីយមេត្តសូត្រ — មេត្តាធម៌ជាសកល", desc: "Type verses praising boundless goodwill, peace, and loving-kindness for all beings.", obj: "Type universal goodwill verses with rhythmic flow" },
    { order: 3, title: "Classical Smot Melody Verses", titleKm: "កាព្យស្មូតខ្មែរបុរាណ — ទំនុកបទបំពេរលំអាន", desc: "Type classical Khmer smot poetry honoring mother, father, and virtuous guides.", obj: "Master traditional Cambodian seven-syllable smot meters" },
    { order: 4, title: "Four Sublime Abodes & Noble Truths", titleKm: "ព្រហ្មវិហារធម៌ និងអរិយសច្ច — មេត្តា ករុណា", desc: "Type foundational Buddhist philosophical concepts on equanimity, joy, and truth.", obj: "Type deep philosophical reflections without hesitation" },
    { order: 5, title: "High Pali-Sanskrit Compound Roots", titleKm: "ពាក្យបាលី-សំស្ក្រឹតជាន់ខ្ពស់ — វិជ្ជា និងសីលធម៌", desc: "Practice advanced compound loanwords enriching the classical Khmer literary register.", obj: "Master high-register multisyllabic compound words" },
    { order: 6, title: "Grandmaster Monastic Scribe Marathon", titleKm: "មហាគាថាពុទ្ធសាសនាសម្ភោធ — ល្ប្បឿនកំពូល", desc: "An extended spiritual sprint exercising complex subscripts and diacritical balance.", obj: "Claim the Monastic Scribe mantle with speed and stamina" }
  ],
  15: [
    { order: 1, title: "The Constitution of the Kingdom of Cambodia", titleKm: "រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា — មាត្រាគ្រឹះ", desc: "Type foundational constitutional articles on national sovereignty, democracy, and human rights.", obj: "Master formal legal phrasing and governmental typography" },
    { order: 2, title: "Environmental Conservation & Tonle Sap Heritage", titleKm: "ការអភិរក្សបរិស្ថាន និងបឹងទន្លេសាប", desc: "Type ecological prose celebrating the Great Lake biosphere and wildlife sanctuaries.", obj: "Type ecological and environmental terminology fluently" },
    { order: 3, title: "Cambodian Renaissance & Economic Innovation", titleKm: "ការអភិវឌ្ឍសង្គម-សេដ្ឋកិច្ច និងនវានុវត្តន៍", desc: "Type contemporary literature on digital entrepreneurship, education, and social progress.", obj: "Type modern technological and economic vocabulary rapidly" },
    { order: 4, title: "Cambodian Science, Medicine & Health Literacy", titleKm: "សុខាភិបាល វិទ្យាសាស្ត្រ និងសុខុមាលភាព", desc: "Type health science and wellness prose on public health, medical care, and fitness.", obj: "Type scientific and public wellness prose with precision" },
    { order: 5, title: "Cultural Diplomacy & UNESCO World Heritage", titleKm: "ការទូតវប្បធម៌ និងបេតិកភណ្ឌពិភពលោក", desc: "Type prose honoring Angkor, Preah Vihear, Sambor Prei Kuk, and Koh Ker.", obj: "Celebrate Cambodian monuments through rapid, flawless typing" },
    { order: 6, title: "Supreme Grandmaster Scribe Ultramarathon", titleKm: "មហាសម្ភោធជ័យជំនះអក្សរខ្មែរគ្រប់ទម្រង់ — ដំណាក់កាលកំពូល", desc: "The definitive pinnacle drill of the entire course: all letters, all diacritics, and pure stamina.", obj: "Achieve ultimate mastery and eternal Grandmaster status" }
  ]
};

const ENGLISH_LEVEL_SPECS = [
  {
    lvlNum: 15,
    title: "World Philosophy & Master Speeches",
    titleKm: "ទស្សនវិជ្ជាសកល និងសុន្ទរកថាកំពូល",
    desc: "Platonic dialogues, Abraham Lincoln, MLK, Seneca, Voltaire, and the Socratic method.",
    obj: "Master eloquence, rhetorical rhythm, and philosophical prose"
  },
  {
    lvlNum: 16,
    title: "Computer Science, Logic & Tech Ultramarathon",
    titleKm: "វិទ្យាសាស្ត្រកុំព្យូទ័រ តក្កវិជ្ជា & មហាសម្ភោធកំពូល",
    desc: "Alan Turing, Ada Lovelace, Unix philosophy, quantum foundations, information theory, and polyglot marathon.",
    obj: "Conquer the absolute highest summit of English touch-typing"
  }
];

const ENGLISH_LEVEL_LESSON_TITLES = {
  15: [
    { order: 1, title: "Plato's Allegory of the Cave & The Republic", titleKm: "ទស្សនវិជ្ជាផ្លាតូ — Allegory of the Cave", desc: "Type passages from Plato on illumination, shadows, and the search for objective truth.", obj: "Type classical philosophical metaphors with poise" },
    { order: 2, title: "Abraham Lincoln & The Gettysburg Address", titleKm: "សុន្ទរកថាប្រវត្តិសាស្ត្រ — Abraham Lincoln", desc: "Type Lincoln's timeless 1863 dedication to human liberty and government of the people.", obj: "Master soaring political rhetoric and cadence" },
    { order: 3, title: "Martin Luther King Jr. & The Dream of Justice", titleKm: "សុន្ទរកថាសិទ្ធិសេរីភាព — Martin Luther King Jr.", desc: "Type landmark civil rights declarations on equality, love, and the moral universe.", obj: "Type inspiring civil rights prose with impassioned focus" },
    { order: 4, title: "Seneca on the Shortness of Life", titleKm: "ទស្សនវិជ្ជាស្តូអ៊ីក — Seneca on Life", desc: "Type Stoic wisdom on mastering time, avoiding procrastination, and serene living.", obj: "Type classical Roman Stoic philosophy fluently" },
    { order: 5, title: "Voltaire & Enlightenment Reason", titleKm: "ទស្សនវិជ្ជាសម័យពុទ្ធិ — Voltaire", desc: "Type Enlightenment aphorisms on tolerance, inquiry, and cultivating one's garden.", obj: "Master sharp satirical and enlightenment prose" },
    { order: 6, title: "The Socratic Method & The Apology", titleKm: "វិធីសាស្ត្រសូក្រាត — The Socratic Apology", desc: "Type Socrates' immortal defense of the examined life and intellectual humility.", obj: "Type Socratic dialogue with poise and clarity" }
  ],
  16: [
    { order: 1, title: "Alan Turing on Computing Machinery and Intelligence", titleKm: "វិទ្យាសាស្ត្រកុំព្យូទ័រ — Alan Turing", desc: "Type Turing's groundbreaking 1950 paper introducing the imitation game and machine learning.", obj: "Type foundational computer science prose at speed" },
    { order: 2, title: "Ada Lovelace & The Analytical Engine", titleKm: "ក្បួនកូដដំបូងគេបង្អស់ — Ada Lovelace", desc: "Type Lovelace's poetic visionary notes on universal symbolic programming.", obj: "Type nineteenth-century computational prose fluently" },
    { order: 3, title: "The Unix Philosophy & Software Architecture", titleKm: "ទស្សនវិជ្ជាប្រព័ន្ធយូនីក — Unix Philosophy", desc: "Type core principles of simplicity, composability, and clean streaming interfaces.", obj: "Type technical software architecture maxims with speed" },
    { order: 4, title: "Quantum Foundations & Physics of Computation", titleKm: "រូបវិទ្យាកង់ទិច — Quantum Computation", desc: "Type physics prose exploring superposition, unitary gates, and entanglement.", obj: "Type advanced quantum computing vocabulary accurately" },
    { order: 5, title: "Cryptography, Shannon Entropy & Information Theory", titleKm: "ទ្រឹស្តីព័ត៌មាន — Claude Shannon", desc: "Type mathematical reflections on bandwidth, entropy, and public-key cryptography.", obj: "Type information theory and cryptographic literature" },
    { order: 6, title: "Supreme Grandmaster Polyglot Ultramarathon", titleKm: "មហាអត្ថបទកំពូលភាសាអង់គ្លេស — The Final Summit", desc: "The crowning achievement: a tour-de-force drill spanning history, science, and literature.", obj: "Claim the ultimate title of Supreme Grandmaster Polyglot" }
  ]
};

// ----------------------------------------------------
// UPDATE RUNNER
// ----------------------------------------------------
function expandCurriculum(layoutId) {
  const dir = path.join(__dirname, `../data/curriculum/${layoutId}`);
  const levelsFile = path.join(dir, 'levels.json');
  const lessonsFile = path.join(dir, 'lessons.json');
  const exercisesFile = path.join(dir, 'exercises.json');

  const levelsData = JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
  const lessonsData = JSON.parse(fs.readFileSync(lessonsFile, 'utf8'));
  const exercisesData = JSON.parse(fs.readFileSync(exercisesFile, 'utf8'));

  const isKhmer = layoutId === 'standard' || layoutId === 'nida';
  const levelSpecs = isKhmer ? KHMER_LEVEL_SPECS : ENGLISH_LEVEL_SPECS;
  const levelTitlesMap = isKhmer ? KHMER_LEVEL_LESSON_TITLES : ENGLISH_LEVEL_LESSON_TITLES;
  const exDict = isKhmer ? KHMER_L14_L15_EXERCISES : ENGLISH_L15_L16_EXERCISES;

  let globalBonusIdx = 6; // L13 / L14 already have bonusIndex 0..5

  levelSpecs.forEach(ls => {
    const lvlNum = ls.lvlNum;
    const levelId = isKhmer ? `${layoutId}-L${lvlNum}` : `en-L${lvlNum}`;
    const prevLvlNum = lvlNum - 1;
    const prevLevelId = isKhmer ? `${layoutId}-L${prevLvlNum}` : `en-L${prevLvlNum}`;

    // 1. Add / Update level in levels.json
    const existingLvlIdx = levelsData.levels.findIndex(l => l.id === levelId);
    const lessonIdsForLevel = [];
    for (let o = 1; o <= 6; o++) {
      lessonIdsForLevel.push(`${levelId}-${String(o).padStart(2, '0')}`);
    }

    const levelObj = {
      id: levelId,
      levelNumber: lvlNum,
      isBonus: true,
      bonusTier: lvlNum - (isKhmer ? 12 : 13), // Tier 2 or Tier 3
      title: ls.title,
      titleKm: ls.titleKm,
      description: ls.desc,
      objective: ls.obj,
      lessons: lessonIdsForLevel,
      unlockRequirements: {
        previousLevel: prevLevelId,
        requiresAll222: false
      },
      completionRequirements: {
        allLessonsCompleted: true,
        minLevelAccuracy: 92
      }
    };

    if (existingLvlIdx !== -1) {
      levelsData.levels[existingLvlIdx] = levelObj;
    } else {
      levelsData.levels.push(levelObj);
    }

    // 2. Add exercises and lessons
    const titlesList = levelTitlesMap[lvlNum] || [];
    titlesList.forEach((lt, idx) => {
      const lessonOrder = lt.order;
      const lessonNum = String(lessonOrder).padStart(2, '0');
      const lessonId = `${levelId}-${lessonNum}`;

      // Calculate previous lesson ID for sequential unlock
      let prevLessonId;
      if (idx === 0) {
        // First lesson of this level depends on the last lesson of previous level!
        prevLessonId = `${prevLevelId}-06`;
      } else {
        prevLessonId = `${levelId}-${String(lessonOrder - 1).padStart(2, '0')}`;
      }

      // 5 Exercises
      const exRefs = [];
      for (let eIdx = 1; eIdx <= 5; eIdx++) {
        const exId = `${lessonId}-E0${eIdx}`;
        exRefs.push(exId);

        const dictKey = `L${lvlNum}-${lessonNum}-E0${eIdx}`;
        const exData = exDict[dictKey];
        if (exData) {
          exercisesData.exercises[exId] = {
            type: exData.type,
            content: exData.content,
            description: exData.description
          };
        } else {
          console.warn(`Missing exercise data for ${dictKey}`);
        }
      }

      const lessonObj = {
        id: lessonId,
        level: levelId,
        order: lessonOrder,
        isBonus: true,
        bonusIndex: globalBonusIdx++,
        title: lt.title,
        titleKm: lt.titleKm,
        description: lt.desc,
        objective: lt.obj,
        type: "drill",
        newKeys: [],
        requiredKeys: [],
        fingerFocus: [],
        difficulty: 10,
        accuracyTarget: 92,
        speedTarget: null,
        mistakeTolerance: 4,
        exerciseRefs: exRefs,
        unlockRequirements: {
          previousLesson: prevLessonId,
          requiresAll222: false
        },
        timeLimit: null
      };

      const existingLesIdx = lessonsData.lessons.findIndex(l => l.id === lessonId);
      if (existingLesIdx !== -1) {
        lessonsData.lessons[existingLesIdx] = lessonObj;
      } else {
        lessonsData.lessons.push(lessonObj);
      }
    });
  });

  // Write updated JSON files
  fs.writeFileSync(levelsFile, JSON.stringify(levelsData, null, 2), 'utf8');
  fs.writeFileSync(lessonsFile, JSON.stringify(lessonsData, null, 2), 'utf8');
  fs.writeFileSync(exercisesFile, JSON.stringify(exercisesData, null, 2), 'utf8');

  console.log(`[SUCCESS] Expanded ${layoutId.toUpperCase()} with 12 additional bonus lessons (Total: ${lessonsData.lessons.length} lessons, ${levelsData.levels.length} levels)`);
}

expandCurriculum('standard');
expandCurriculum('nida');
expandCurriculum('english');
console.log('\nAll 3 tracks expanded to 54 total bonus lessons.');
