
export interface LegalArticle {
    id: string;
    title: string;
    content: string;
    title_am?: string;
    content_am?: string;
    tags: string[];
}

export interface LegalDocument {
    id: string;
    title: string;
    title_am?: string;
    type: 'Constitution' | 'Proclamation' | 'Regulation';
    year: string;
    description: string;
    articles: LegalArticle[];
}

export const ETHIOPIAN_LEGAL_FRAMEWORK: LegalDocument[] = [
    {
        id: 'CONST-1995',
        title: 'Constitution of the Federal Democratic Republic of Ethiopia',
        title_am: 'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ ሕገ መንግሥት',
        type: 'Constitution',
        year: '1995',
        description: 'The supreme law of the land establishing the sovereignty and defense principles.',
        articles: [
            {
                id: 'Art-87',
                title: 'Principles for National Defence',
                title_am: 'የመከላከያ መርሆዎች',
                content: '1. The composition of the national armed forces shall reflect the equitable representation of the Nations, Nationalities and Peoples of Ethiopia.\n2. The Minister of Defence shall be a civilian.\n3. The armed forces shall protect the sovereignty of the country...\n4. The armed forces shall at all times obey and respect the Constitution.',
                content_am: '1. የብሔራዊ መከላከያ ሠራዊት ስብጥር የኢትዮጵያን ብሔሮች፣ ብሔረሰቦችና ሕዝቦች ሚዛናዊ ተዋጽኦ ያካተተ ይሆናል፡፡\n2. የመከላከያ ሚኒስትሩ ሲቪል ይሆናል፡፡\n3. መከላከያ ሠራዊቱ የአገሪቱን ሉዓላዊነት ይጠብቃል... \n4. መከላከያ ሠራዊቱ በማንኛውም ጊዜ ሕገ መንግሥቱን ያከብራል፤ ያስከብራል፡፡',
                tags: ['sovereignty', 'civilian-control', 'neutrality', 'representation']
            },
            {
                id: 'Art-93',
                title: 'Declaration of State of Emergency',
                title_am: 'ስለ አስቸኳይ ጊዜ አዋጅ',
                content: '1(a). The Council of Ministers of the Federal Government shall have the power to decree a state of emergency should an external invasion, a break down of law and order which endangers the constitutional order... natural disaster, or an epidemic occur.',
                content_am: '1(ሀ) የውጭ ወረራ ሲያጋጥም ወይም ሕገ መንግሥታዊ ሥርዓቱን አደጋ ላይ የሚጥል ሁኔታ ሲከሰት... የተፈጥሮ አደጋ ሲያጋጥም ወይም የህዝብን ጤንነት አደጋ ላይ የሚጥል በሽታ ሲከሰት የፌዴራሉ መንግሥት የሚኒስትሮች ምክር ቤት የአስቸኳይ ጊዜ አዋጅ የማወጅ ሥልጣን አለው፡፡',
                tags: ['emergency', 'decree', 'council-of-ministers']
            }
        ]
    },
    {
        id: 'PROC-1100/2019',
        title: 'Defense Forces Proclamation No. 1100/2019',
        title_am: 'የመከላከያ ሠራዊት አዋጅ ቁጥር 1100/2011',
        type: 'Proclamation',
        year: '2019',
        description: 'Re-establishment, structure, and governance of the National Defense Forces.',
        articles: [
            {
                id: 'Art-4',
                title: 'Organization of the Defense Forces',
                title_am: 'ስለ መከላከያ ሠራዊት አደረጃጀት',
                content: '1. The Defense Force of the Federal Democratic Republic of Ethiopia shall consist of Ground Force, Air Force, Naval Force and Special Operations Force, and may include, as necessary, Space and Cyber Forces.',
                content_am: '1. የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ መከላከያ ሠራዊት በምድር ኃይል፣ በአየር ኃይል፣ በባህር ኃይል እና በልዩ ዘመቻዎች ኃይል የሚደራጅ ሆኖ እንደአስፈላጊነቱም የስፔስና የሳይበር ኃይሎችን ሊያካትት ይችላል፡፡',
                tags: ['structure', 'organization', 'space', 'cyber', 'navy']
            },
            {
                id: 'Art-9',
                title: 'Duties of Members',
                title_am: 'የሠራዊት አባላት ግዴታ',
                content: 'Every member shall: 1) Protect and defend sovereignty. 2) Obey the Constitution. 3) Observe laws/directives. 4) Remain in service beyond term if standby order is given during national security danger. 5) Accept assignments inside/outside country.',
                content_am: 'ማንኛውም የሰራዊት አባለ:- 1. የአገሪቱን ሉዓላዊነት እና ዳር ድንበር የመጠበቅና የመከላከል ግዴታ አለበት፡፡ 2. ሕገ-መንግስቱን እና ህገመንግስታዊ ስርዓቱን የማክበር እና የማስከበር ግዴታ አለበት፡፡',
                tags: ['duties', 'obligations', 'standby']
            },
            {
                id: 'Art-10',
                title: 'Term of Service and Age',
                title_am: 'የአገልግሎት ዘመን እና እድሜ',
                content: '1. Minimum term of service: 7 years.\n4. Retirement Ages (Officers):\n- 2nd Lt to Captain: 48 years\n- Major to Colonel: 52 years\n- General Officers: 55 years\n5. Ground Force NCOs/Air Force Techs: 48 years.',
                content_am: '1. ማንኛውም የሠራዊት አባለ ለውትድርና አገልግሎት የሚቀጠረው ቢያንስ ለ7 ዓመታት ይሆናል፡፡\n4. ከምክትል መቶ አለቃ እስከ ሻምበል 48 ዓመት፤ ከሻለቃ እስከ ኮሎኔል 52 ዓመት፤ ጀነራል መኮንኖች 55 ዓመት፡፡',
                tags: ['retirement', 'service-term', 'age-limits', 'officers']
            },
            {
                id: 'Art-28',
                title: 'Military Justice Organs',
                title_am: 'ስለወታደራዊ ፍትህ አካላት',
                content: 'Establishment of: 1) Military Police 2) Military Prosecutor 3) Military Courts 4) Military Defense Counsel.',
                content_am: 'በመከላከያ ሠራዊት ውስጥ የወታደራዊ ፍትህ ሥራን የሚያከናውኑ... ወታደራዊ ፖሊስ፣ ወታደራዊ ዓቃቢ ህግ፣ ወታደራዊ ፍርድ ቤቶች እና ወታደራዊ ተከራካሪ ጠበቃ ተቋቁመዋል፡፡',
                tags: ['justice', 'court', 'police', 'legal']
            }
        ]
    },
    {
        id: 'REG-460/2019',
        title: 'Defense Forces Administration Regulation No. 460/2019',
        title_am: 'የሚኒስትሮች ምክር ቤት ደንብ ቁጥር 460/2012',
        type: 'Regulation',
        year: '2020',
        description: 'Detailed administration rules regarding discipline, benefits, and ranks.',
        articles: [
            {
                id: 'Art-6',
                title: 'Core Values',
                title_am: 'ቁልፍ እሴቶች',
                content: 'a) Giving priority to the interest of people and country before oneself.\nb) All-round personality at all times.\nc) Uncompromised democratic thought.\nd) Highest achievement in any task or activity.',
                content_am: '1. የመከላከያ ሠራዊት ቁልፍ እሴቶች... ሀ. ከራስ በፊት ለህዝብና ለሀገር ጥቅም ቅድሚያ መስጠት፤ ለ. ምን ጊዜም የተሟላ ስብዕና፤ ሐ. ያልተሸራረፈ ዴሞክራሲያዊ አስተሳሰብ፤ መ. በማንኛውም ግዳጅ ወይም ተግባር የላቀ ውጤት፡፡',
                tags: ['ethics', 'values', 'doctrine']
            },
            {
                id: 'Art-18',
                title: 'Rank Structure',
                title_am: 'የማዕረግ ደረጃዎች',
                content: 'Ground Force Ranks: Lance-Corporal, Corporal, Sergeant, Master Sergeant, First Sergeant, Staff Sergeant Major, Command Sergeant Major, Junior Warrant Officer, Senior Warrant Officer, Master Warrant Officer.\nOfficer Ranks include: Second-Lieutenant to General.',
                content_am: 'በምድር ኃይል ውስጥ የሚኖሩት የማዕረግ ደረጃዎች... ምክትል አስር አለቃ፣ አስር አለቃ፣ ሃምሳ አለቃ... እስከ ጀነራል፡፡',
                tags: ['ranks', 'promotion', 'nco', 'officer']
            },
            {
                id: 'Art-34',
                title: 'Annual Leave',
                title_am: 'የዓመት እረፍት ፈቃድ',
                content: '1. Any member of the defense force is entitled to 38 consecutive days of annual leave with pay.\n2. Must serve at least one year to be entitled.',
                content_am: 'ማንኛውም የሠራዊት አባል በዓመት 38 ተከታታይ ቀናት የዓመት ፈቃድ ከደመወዝ ጋር ይሰጠዋል፡፡',
                tags: ['leave', 'benefits', 'time-off', 'vacation']
            },
            {
                id: 'Art-36',
                title: 'Maternity Leave',
                title_am: 'የወሊድ ፈቃድ',
                content: '1. A female member is entitled to consecutive four months full day and additional two months half day maternity leave.\n2. Paternity leave: 10 days.',
                content_am: 'ሴት የሠራዊት አባል ለተከታታይ አራት ወራት ሙሉ ቀን እና ለተጨማሪ ሁለት ወራት ግማሽ ቀን የወሊድ ፈቃድ ታገኛለች፡፡',
                tags: ['women', 'maternity', 'leave', 'rights']
            },
            {
                id: 'Art-53',
                title: 'Incentives (Duty Free)',
                title_am: 'ማበረታቻዎች (ከቀረጥ ነፃ)',
                content: '1. Members with critical/scarce skills (>10 years service).\n2. Colonels and General Officers (>25 years service).\nEntitled to buy one personal automobile free of duties.',
                content_am: 'ከአስር ዓመት በላይ ያገለገለ በቀላሉ የማይተካ ልዩ ክህሎት ያለው... 25 ዓመት እና ከዚያ በላይ ያገለገለ ኮሎኔል/ጀነራል አንድ የቤት መኪና ከቀረጥ ነፃ መግዛት ይችላል፡፡',
                tags: ['benefits', 'vehicles', 'incentives', 'duty-free']
            }
        ]
    }
];

export const getLegalContextString = (): string => {
    let context = "OFFICIAL ETHIOPIAN LEGAL FRAMEWORK CONTEXT (ENDF):\n";
    ETHIOPIAN_LEGAL_FRAMEWORK.forEach(doc => {
        context += `\n=== ${doc.title} (${doc.id}) ===\n`;
        doc.articles.forEach(art => {
            context += `[${art.id} ${art.title}]: ${art.content}\n`;
        });
    });
    return context;
};
