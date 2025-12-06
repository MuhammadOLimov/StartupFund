"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Language = "uz" | "ru" | "en"

const translations = {
  uz: {
    // Navigation
    "nav.features": "Imkoniyatlar",
    "nav.howItWorks": "Qanday ishlaydi",
    "nav.login": "Kirish",
    "nav.getStarted": "Boshlash",
    "nav.marketplace": "Bozor",
    "nav.portfolio": "Portfolio",
    "nav.settings": "Sozlamalar",
    "nav.logout": "Chiqish",

    // Hero
    "hero.badge": "500+ startap va 2,000+ investor ishonadi",
    "hero.title.1": "Innovatsion",
    "hero.title.2": "Tadbirkorlar",
    "hero.title.3": "Strategik",
    "hero.title.4": "Investorlar",
    "hero.title.meets": "bilan",
    "hero.title.where": "uchrashadigan joy",
    "hero.description":
      "StartupFund innovatsion startaplarni katta imkoniyatlarni qidirayotgan investorlar bilan bog'laydi. Bizning platforma moliyalashtirishni shaffof, bosqichma-bosqich funding bilan soddalashtiradi.",
    "hero.entrepreneur": "Men Tadbirkorman",
    "hero.investor": "Men Investorman",

    // Stats
    "stats.totalRaised": "Jami yig'ilgan",
    "stats.activeStartups": "Faol startaplar",
    "stats.investors": "Investorlar",
    "stats.successRate": "Muvaffaqiyat darajasi",

    // Features
    "features.title": "Muvaffaqiyat uchun kerak bo'lgan hamma narsa",
    "features.description":
      "Sarmoya yig'ayotgan bo'lsangiz yoki investitsiya qilmoqchi bo'lsangiz, platformamiz sizga kerakli vositalarni taqdim etadi.",
    "features.milestone.title": "Bosqichli moliyalashtirish",
    "features.milestone.desc":
      "Startaplar asosiy bosqichlarni bajarganida mablag'larni chiqaring, xavfni kamaytiring va javobgarlikni ta'minlang.",
    "features.matching.title": "Aqlli moslashtirish",
    "features.matching.desc":
      "Sun'iy intellektimiz investorlarni sanoat afzalliklari va investitsiya mezonlari asosida startaplar bilan moslashtiradi.",
    "features.security.title": "Xavfsiz tranzaksiyalar",
    "features.security.desc":
      "Barcha investitsiya tranzaksiyalari uchun eskrow himoyasi bilan bank darajasidagi xavfsizlik.",
    "features.analytics.title": "Real vaqt tahlili",
    "features.analytics.desc":
      "Portfolio samaradorligini, moliyalashtirish jarayonini va investor faolligini real vaqtda kuzating.",
    "features.roi.title": "Moslashuvchan ROI variantlari",
    "features.roi.desc": "Equity, Convertible Notes, Revenue Share yoki SAFE shartnomalari orasidan tanlang.",
    "features.dueDiligence.title": "Tekshiruv vositalari",
    "features.dueDiligence.desc": "Startap profillari, jamoa ma'lumotlari va moliyaviy prognozlarga kirish.",

    // How it Works
    "howItWorks.title": "Qanday ishlaydi",
    "howItWorks.description":
      "Bir necha daqiqada boshlang, sarmoya yig'ayotgan bo'lsangiz ham, investitsiya qilayotgan bo'lsangiz ham.",
    "howItWorks.forEntrepreneurs": "Tadbirkorlar uchun",
    "howItWorks.forInvestors": "Investorlar uchun",
    "howItWorks.e.step1.title": "Profil yarating",
    "howItWorks.e.step1.desc": "Startapingizni bizning yo'naltiruvchi sehrgarimiz bilan namoyish eting",
    "howItWorks.e.step2.title": "Bosqichlarni belgilang",
    "howItWorks.e.step2.desc": "Yutuqlarga bog'langan moliyalashtirish transhlarini aniqlang",
    "howItWorks.e.step3.title": "Topiling",
    "howItWorks.e.step3.desc": "Moslashtirish algoritmimiz sizni investorlar bilan bog'laydi",
    "howItWorks.e.step4.title": "Mablag' oling",
    "howItWorks.e.step4.desc": "Bosqichlarni bajarganingizda mablag' oling",
    "howItWorks.i.step1.title": "Afzalliklarni belgilang",
    "howItWorks.i.step1.desc": "Investitsiya mezonlari va qiziqishlaringizni aniqlang",
    "howItWorks.i.step2.title": "Imkoniyatlarni ko'ring",
    "howItWorks.i.step2.desc": "Profilingizga mos startaplarni o'rganing",
    "howItWorks.i.step3.title": "Tekshiruv",
    "howItWorks.i.step3.desc": "Jamoa ma'lumotlari, moliya va hujjatlarga kirish",
    "howItWorks.i.step4.title": "Investitsiya va kuzatuv",
    "howItWorks.i.step4.desc": "Investitsiya qiling va portfolio o'sishini kuzating",

    // CTA
    "cta.title": "Boshlashga tayyormisiz?",
    "cta.description": "Kelajakni qurayotgan minglab tadbirkor va investorlarga qo'shiling.",
    "cta.button": "Bepul hisob yarating",

    // Footer
    "footer.rights": "Barcha huquqlar himoyalangan.",

    // Auth
    "auth.login.title": "Hisobingizga kiring",
    "auth.login.description": "Davom etish uchun elektron pochta va parolingizni kiriting",
    "auth.register.title": "Hisob yarating",
    "auth.register.description": "Boshlash uchun ma'lumotlaringizni kiriting",
    "auth.email": "Elektron pochta",
    "auth.password": "Parol",
    "auth.confirmPassword": "Parolni tasdiqlang",
    "auth.name": "To'liq ism",
    "auth.loginButton": "Kirish",
    "auth.registerButton": "Ro'yxatdan o'tish",
    "auth.noAccount": "Hisobingiz yo'qmi?",
    "auth.hasAccount": "Hisobingiz bormi?",
    "auth.signUp": "Ro'yxatdan o'ting",
    "auth.signIn": "Kiring",
    "auth.selectRole": "Rolni tanlang",
    "auth.entrepreneur": "Tadbirkor",
    "auth.investor": "Investor",
    "auth.entrepreneurDesc": "Men startapim uchun sarmoya yig'moqchiman",
    "auth.investorDesc": "Men startaplarga investitsiya qilmoqchiman",
    "auth.projectName": "Loyiha nomi",
    "auth.investmentInterests": "Investitsiya qiziqishlari",

    // Dashboard - Investor
    "dashboard.investor.title": "Investor paneli",
    "dashboard.investor.welcome": "Xush kelibsiz",
    "dashboard.investor.portfolio": "Portfolio qiymati",
    "dashboard.investor.totalInvested": "Jami investitsiya",
    "dashboard.investor.activeDeals": "Faol bitimlar",
    "dashboard.investor.returns": "Daromadlar",
    "dashboard.investor.topMatches": "Eng yaxshi mosliklar",
    "dashboard.investor.recentActivity": "So'nggi faollik",
    "dashboard.investor.viewAll": "Hammasini ko'rish",

    // Dashboard - Entrepreneur
    "dashboard.entrepreneur.title": "Tadbirkor paneli",
    "dashboard.entrepreneur.fundingProgress": "Moliyalashtirish jarayoni",
    "dashboard.entrepreneur.profileViews": "Profil ko'rishlari",
    "dashboard.entrepreneur.investorInterest": "Investor qiziqishi",
    "dashboard.entrepreneur.milestones": "Bosqichlar",
    "dashboard.entrepreneur.recentViewers": "So'nggi ko'ruvchilar",
    "dashboard.entrepreneur.manageStartup": "Startapni boshqarish",
    "dashboard.entrepreneur.editProfile": "Profilni tahrirlash",
    "dashboard.entrepreneur.addMilestone": "Bosqich qo'shish",

    // Marketplace
    "marketplace.title": "Startap bozori",
    "marketplace.search": "Startaplarni qidirish...",
    "marketplace.filters": "Filtrlar",
    "marketplace.industry": "Sanoat",
    "marketplace.stage": "Bosqich",
    "marketplace.sort": "Saralash",
    "marketplace.allIndustries": "Barcha sanoatlar",
    "marketplace.allStages": "Barcha bosqichlar",
    "marketplace.sortMatch": "Moslik bo'yicha",
    "marketplace.sortFunding": "Moliyalashtirish bo'yicha",
    "marketplace.sortRecent": "So'nggilari",
    "marketplace.viewDetails": "Batafsil",
    "marketplace.invest": "Investitsiya qilish",
    "marketplace.match": "moslik",
    "marketplace.raised": "yig'ilgan",
    "marketplace.goal": "maqsad",

    // Startup Profile
    "startup.overview": "Umumiy",
    "startup.team": "Jamoa",
    "startup.financials": "Moliya",
    "startup.documents": "Hujjatlar",
    "startup.roadmap": "Yo'l xaritasi",
    "startup.about": "Haqida",
    "startup.problem": "Muammo",
    "startup.solution": "Yechim",
    "startup.market": "Bozor imkoniyati",
    "startup.tam": "Jami manzillanuvchi bozor",
    "startup.sam": "Xizmat ko'rsatiladigan bozor",
    "startup.som": "Egallash mumkin bo'lgan bozor",
    "startup.teamMembers": "Jamoa a'zolari",
    "startup.investNow": "Hozir investitsiya qiling",
    "startup.valuation": "Baholash",
    "startup.equity": "Equity",
    "startup.minInvestment": "Min. investitsiya",
    "startup.investors": "investorlar",
    "startup.obligations": "Majburiyatlar",
    "startup.links": "Havolalar",
    "startup.pitch": "Pitch taqdimot",
    "startup.businessPlan": "Biznes reja",
    "startup.financialModel": "Moliyaviy model",

    // Investment Modal
    "invest.title": "Investitsiya qilish",
    "invest.amount": "Investitsiya miqdori",
    "invest.strategy": "ROI strategiyasi",
    "invest.equity": "Equity",
    "invest.equityDesc": "Kompaniyada ulush olish",
    "invest.convertible": "Convertible Note",
    "invest.convertibleDesc": "Keyingi raundda aktsiyaga aylanadigan qarz",
    "invest.revenue": "Revenue Share",
    "invest.revenueDesc": "Daromadning bir foizini olish",
    "invest.safe": "SAFE",
    "invest.safeDesc": "Kelajakdagi kapital uchun oddiy kelishuv",
    "invest.summary": "Tranzaksiya xulosasi",
    "invest.platformFee": "Platforma to'lovi (5%)",
    "invest.total": "Jami",
    "invest.confirm": "Investitsiyani tasdiqlash",
    "invest.cancel": "Bekor qilish",
    "invest.success": "Investitsiya muvaffaqiyatli!",
    "invest.successDesc": "Investitsiyangiz tasdiqlandi.",

    // Common
    "common.loading": "Yuklanmoqda...",
    "common.error": "Xatolik yuz berdi",
    "common.save": "Saqlash",
    "common.cancel": "Bekor qilish",
    "common.edit": "Tahrirlash",
    "common.delete": "O'chirish",
    "common.view": "Ko'rish",
    "common.download": "Yuklab olish",
    "common.upload": "Yuklash",
    "common.add": "Qo'shish",
    "common.remove": "Olib tashlash",
    "common.search": "Qidirish",
    "common.filter": "Filtrlash",
    "common.sort": "Saralash",
    "common.all": "Barchasi",
    "common.none": "Hech biri",
    "common.yes": "Ha",
    "common.no": "Yo'q",
    "common.completed": "Bajarildi",
    "common.pending": "Kutilmoqda",
    "common.inProgress": "Jarayonda",
    "common.notStarted": "Boshlanmagan",

    // Theme
    "theme.light": "Kunduzgi",
    "theme.dark": "Tungi",
    "theme.system": "Tizim",

    // Language
    "language.uz": "O'zbekcha",
    "language.ru": "Русский",
    "language.en": "English",
  },
  ru: {
    // Navigation
    "nav.features": "Возможности",
    "nav.howItWorks": "Как это работает",
    "nav.login": "Вход",
    "nav.getStarted": "Начать",
    "nav.marketplace": "Маркетплейс",
    "nav.portfolio": "Портфолио",
    "nav.settings": "Настройки",
    "nav.logout": "Выход",

    // Hero
    "hero.badge": "Доверяют 500+ стартапов и 2,000+ инвесторов",
    "hero.title.1": "Инновационные",
    "hero.title.2": "Предприниматели",
    "hero.title.3": "Стратегические",
    "hero.title.4": "Инвесторы",
    "hero.title.meets": "встречаются со",
    "hero.title.where": "Место где",
    "hero.description":
      "StartupFund связывает инновационные стартапы с инвесторами, ищущими большие возможности. Наша платформа упрощает сбор средств с прозрачным поэтапным финансированием.",
    "hero.entrepreneur": "Я Предприниматель",
    "hero.investor": "Я Инвестор",

    // Stats
    "stats.totalRaised": "Всего собрано",
    "stats.activeStartups": "Активных стартапов",
    "stats.investors": "Инвесторов",
    "stats.successRate": "Успешность",

    // Features
    "features.title": "Всё необходимое для успеха",
    "features.description": "Привлекаете капитал или инвестируете - наша платформа предоставляет нужные инструменты.",
    "features.milestone.title": "Поэтапное финансирование",
    "features.milestone.desc": "Выделяйте средства по мере достижения ключевых этапов, снижая риски.",
    "features.matching.title": "Умный подбор",
    "features.matching.desc": "ИИ подбирает инвесторов к стартапам на основе предпочтений и критериев.",
    "features.security.title": "Безопасные транзакции",
    "features.security.desc": "Банковский уровень безопасности с эскроу-защитой всех инвестиций.",
    "features.analytics.title": "Аналитика в реальном времени",
    "features.analytics.desc": "Отслеживайте эффективность портфеля и активность инвесторов.",
    "features.roi.title": "Гибкие варианты ROI",
    "features.roi.desc": "Выбирайте из Equity, Convertible Notes, Revenue Share или SAFE.",
    "features.dueDiligence.title": "Инструменты проверки",
    "features.dueDiligence.desc": "Доступ к профилям стартапов, информации о команде и финансам.",

    // How it Works
    "howItWorks.title": "Как это работает",
    "howItWorks.description": "Начните за несколько минут.",
    "howItWorks.forEntrepreneurs": "Для предпринимателей",
    "howItWorks.forInvestors": "Для инвесторов",
    "howItWorks.e.step1.title": "Создайте профиль",
    "howItWorks.e.step1.desc": "Представьте свой стартап с помощью нашего мастера",
    "howItWorks.e.step2.title": "Установите этапы",
    "howItWorks.e.step2.desc": "Определите транши финансирования, привязанные к достижениям",
    "howItWorks.e.step3.title": "Будьте найдены",
    "howItWorks.e.step3.desc": "Алгоритм подбора свяжет вас с инвесторами",
    "howItWorks.e.step4.title": "Получите финансирование",
    "howItWorks.e.step4.desc": "Получайте средства по мере достижения этапов",
    "howItWorks.i.step1.title": "Задайте предпочтения",
    "howItWorks.i.step1.desc": "Определите критерии и интересы инвестирования",
    "howItWorks.i.step2.title": "Просмотрите возможности",
    "howItWorks.i.step2.desc": "Изучите стартапы, подходящие вашему профилю",
    "howItWorks.i.step3.title": "Проверка",
    "howItWorks.i.step3.desc": "Доступ к команде, финансам и документам",
    "howItWorks.i.step4.title": "Инвестируйте и отслеживайте",
    "howItWorks.i.step4.desc": "Инвестируйте и следите за ростом портфеля",

    // CTA
    "cta.title": "Готовы начать?",
    "cta.description": "Присоединяйтесь к тысячам предпринимателей и инвесторов.",
    "cta.button": "Создать бесплатный аккаунт",

    // Footer
    "footer.rights": "Все права защищены.",

    // Auth
    "auth.login.title": "Войдите в аккаунт",
    "auth.login.description": "Введите email и пароль для продолжения",
    "auth.register.title": "Создать аккаунт",
    "auth.register.description": "Введите данные для начала",
    "auth.email": "Электронная почта",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Подтвердите пароль",
    "auth.name": "Полное имя",
    "auth.loginButton": "Войти",
    "auth.registerButton": "Зарегистрироваться",
    "auth.noAccount": "Нет аккаунта?",
    "auth.hasAccount": "Уже есть аккаунт?",
    "auth.signUp": "Зарегистрируйтесь",
    "auth.signIn": "Войдите",
    "auth.selectRole": "Выберите роль",
    "auth.entrepreneur": "Предприниматель",
    "auth.investor": "Инвестор",
    "auth.entrepreneurDesc": "Я хочу привлечь инвестиции для стартапа",
    "auth.investorDesc": "Я хочу инвестировать в стартапы",
    "auth.projectName": "Название проекта",
    "auth.investmentInterests": "Интересы инвестирования",

    // Dashboard - Investor
    "dashboard.investor.title": "Панель инвестора",
    "dashboard.investor.welcome": "Добро пожаловать",
    "dashboard.investor.portfolio": "Стоимость портфеля",
    "dashboard.investor.totalInvested": "Всего инвестировано",
    "dashboard.investor.activeDeals": "Активные сделки",
    "dashboard.investor.returns": "Доходность",
    "dashboard.investor.topMatches": "Лучшие совпадения",
    "dashboard.investor.recentActivity": "Недавняя активность",
    "dashboard.investor.viewAll": "Смотреть все",

    // Dashboard - Entrepreneur
    "dashboard.entrepreneur.title": "Панель предпринимателя",
    "dashboard.entrepreneur.fundingProgress": "Прогресс финансирования",
    "dashboard.entrepreneur.profileViews": "Просмотры профиля",
    "dashboard.entrepreneur.investorInterest": "Интерес инвесторов",
    "dashboard.entrepreneur.milestones": "Этапы",
    "dashboard.entrepreneur.recentViewers": "Недавние просмотры",
    "dashboard.entrepreneur.manageStartup": "Управление стартапом",
    "dashboard.entrepreneur.editProfile": "Редактировать профиль",
    "dashboard.entrepreneur.addMilestone": "Добавить этап",

    // Marketplace
    "marketplace.title": "Маркетплейс стартапов",
    "marketplace.search": "Поиск стартапов...",
    "marketplace.filters": "Фильтры",
    "marketplace.industry": "Отрасль",
    "marketplace.stage": "Стадия",
    "marketplace.sort": "Сортировка",
    "marketplace.allIndustries": "Все отрасли",
    "marketplace.allStages": "Все стадии",
    "marketplace.sortMatch": "По совпадению",
    "marketplace.sortFunding": "По финансированию",
    "marketplace.sortRecent": "Недавние",
    "marketplace.viewDetails": "Подробнее",
    "marketplace.invest": "Инвестировать",
    "marketplace.match": "совпадение",
    "marketplace.raised": "собрано",
    "marketplace.goal": "цель",

    // Startup Profile
    "startup.overview": "Обзор",
    "startup.team": "Команда",
    "startup.financials": "Финансы",
    "startup.documents": "Документы",
    "startup.roadmap": "Дорожная карта",
    "startup.about": "О проекте",
    "startup.problem": "Проблема",
    "startup.solution": "Решение",
    "startup.market": "Рыночная возможность",
    "startup.tam": "Общий адресуемый рынок",
    "startup.sam": "Обслуживаемый рынок",
    "startup.som": "Достижимый рынок",
    "startup.teamMembers": "Члены команды",
    "startup.investNow": "Инвестировать сейчас",
    "startup.valuation": "Оценка",
    "startup.equity": "Доля",
    "startup.minInvestment": "Мин. инвестиция",
    "startup.investors": "инвесторов",
    "startup.obligations": "Обязательства",
    "startup.links": "Ссылки",
    "startup.pitch": "Pitch презентация",
    "startup.businessPlan": "Бизнес план",
    "startup.financialModel": "Финансовая модель",

    // Investment Modal
    "invest.title": "Инвестировать",
    "invest.amount": "Сумма инвестиции",
    "invest.strategy": "Стратегия ROI",
    "invest.equity": "Equity",
    "invest.equityDesc": "Получить долю в компании",
    "invest.convertible": "Convertible Note",
    "invest.convertibleDesc": "Долг, конвертируемый в акции",
    "invest.revenue": "Revenue Share",
    "invest.revenueDesc": "Получать процент от выручки",
    "invest.safe": "SAFE",
    "invest.safeDesc": "Простое соглашение на будущий капитал",
    "invest.summary": "Итоги транзакции",
    "invest.platformFee": "Комиссия платформы (5%)",
    "invest.total": "Итого",
    "invest.confirm": "Подтвердить инвестицию",
    "invest.cancel": "Отмена",
    "invest.success": "Инвестиция успешна!",
    "invest.successDesc": "Ваша инвестиция подтверждена.",

    // Common
    "common.loading": "Загрузка...",
    "common.error": "Произошла ошибка",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.edit": "Редактировать",
    "common.delete": "Удалить",
    "common.view": "Просмотр",
    "common.download": "Скачать",
    "common.upload": "Загрузить",
    "common.add": "Добавить",
    "common.remove": "Удалить",
    "common.search": "Поиск",
    "common.filter": "Фильтр",
    "common.sort": "Сортировка",
    "common.all": "Все",
    "common.none": "Нет",
    "common.yes": "Да",
    "common.no": "Нет",
    "common.completed": "Завершено",
    "common.pending": "Ожидание",
    "common.inProgress": "В процессе",
    "common.notStarted": "Не начато",

    // Theme
    "theme.light": "Светлая",
    "theme.dark": "Тёмная",
    "theme.system": "Системная",

    // Language
    "language.uz": "O'zbekcha",
    "language.ru": "Русский",
    "language.en": "English",
  },
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.howItWorks": "How it Works",
    "nav.login": "Login",
    "nav.getStarted": "Get Started",
    "nav.marketplace": "Marketplace",
    "nav.portfolio": "Portfolio",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Hero
    "hero.badge": "Trusted by 500+ startups and 2,000+ investors",
    "hero.title.1": "Visionary",
    "hero.title.2": "Entrepreneurs",
    "hero.title.3": "Strategic",
    "hero.title.4": "Investors",
    "hero.title.meets": "Meet",
    "hero.title.where": "Where",
    "hero.description":
      "StartupFund connects innovative startups with investors looking for the next big opportunity. Our platform simplifies fundraising with transparent, milestone-based funding.",
    "hero.entrepreneur": "I'm an Entrepreneur",
    "hero.investor": "I'm an Investor",

    // Stats
    "stats.totalRaised": "Total Raised",
    "stats.activeStartups": "Active Startups",
    "stats.investors": "Investors",
    "stats.successRate": "Success Rate",

    // Features
    "features.title": "Everything You Need to Succeed",
    "features.description": "Whether you're raising capital or investing, our platform provides the tools you need.",
    "features.milestone.title": "Milestone-Based Funding",
    "features.milestone.desc":
      "Release funds as startups hit key milestones, reducing risk and ensuring accountability.",
    "features.matching.title": "Smart Matching",
    "features.matching.desc": "Our AI matches investors with startups based on industry preferences and criteria.",
    "features.security.title": "Secure Transactions",
    "features.security.desc": "Bank-grade security with escrow protection for all investment transactions.",
    "features.analytics.title": "Real-time Analytics",
    "features.analytics.desc": "Track portfolio performance, funding progress, and investor engagement in real-time.",
    "features.roi.title": "Flexible ROI Options",
    "features.roi.desc": "Choose from Equity, Convertible Notes, Revenue Share, or SAFE agreements.",
    "features.dueDiligence.title": "Due Diligence Tools",
    "features.dueDiligence.desc": "Access comprehensive startup profiles, team backgrounds, and financial projections.",

    // How it Works
    "howItWorks.title": "How It Works",
    "howItWorks.description": "Get started in minutes, whether you're raising or investing.",
    "howItWorks.forEntrepreneurs": "For Entrepreneurs",
    "howItWorks.forInvestors": "For Investors",
    "howItWorks.e.step1.title": "Create Your Profile",
    "howItWorks.e.step1.desc": "Showcase your startup with our guided wizard",
    "howItWorks.e.step2.title": "Set Milestones",
    "howItWorks.e.step2.desc": "Define funding tranches tied to achievements",
    "howItWorks.e.step3.title": "Get Discovered",
    "howItWorks.e.step3.desc": "Our matching algorithm connects you with investors",
    "howItWorks.e.step4.title": "Receive Funding",
    "howItWorks.e.step4.desc": "Get funds released as you hit milestones",
    "howItWorks.i.step1.title": "Set Preferences",
    "howItWorks.i.step1.desc": "Define your investment criteria and interests",
    "howItWorks.i.step2.title": "Browse Opportunities",
    "howItWorks.i.step2.desc": "Explore startups matched to your profile",
    "howItWorks.i.step3.title": "Due Diligence",
    "howItWorks.i.step3.desc": "Access team info, financials, and documents",
    "howItWorks.i.step4.title": "Invest & Track",
    "howItWorks.i.step4.desc": "Make investments and monitor portfolio growth",

    // CTA
    "cta.title": "Ready to Get Started?",
    "cta.description": "Join thousands of entrepreneurs and investors building the future.",
    "cta.button": "Create Free Account",

    // Footer
    "footer.rights": "All rights reserved.",

    // Auth
    "auth.login.title": "Sign in to your account",
    "auth.login.description": "Enter your email and password to continue",
    "auth.register.title": "Create an account",
    "auth.register.description": "Enter your details to get started",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Full Name",
    "auth.loginButton": "Sign In",
    "auth.registerButton": "Sign Up",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signUp": "Sign up",
    "auth.signIn": "Sign in",
    "auth.selectRole": "Select your role",
    "auth.entrepreneur": "Entrepreneur",
    "auth.investor": "Investor",
    "auth.entrepreneurDesc": "I want to raise funding for my startup",
    "auth.investorDesc": "I want to invest in startups",
    "auth.projectName": "Project Name",
    "auth.investmentInterests": "Investment Interests",

    // Dashboard - Investor
    "dashboard.investor.title": "Investor Dashboard",
    "dashboard.investor.welcome": "Welcome back",
    "dashboard.investor.portfolio": "Portfolio Value",
    "dashboard.investor.totalInvested": "Total Invested",
    "dashboard.investor.activeDeals": "Active Deals",
    "dashboard.investor.returns": "Returns",
    "dashboard.investor.topMatches": "Top Matches",
    "dashboard.investor.recentActivity": "Recent Activity",
    "dashboard.investor.viewAll": "View All",

    // Dashboard - Entrepreneur
    "dashboard.entrepreneur.title": "Entrepreneur Dashboard",
    "dashboard.entrepreneur.fundingProgress": "Funding Progress",
    "dashboard.entrepreneur.profileViews": "Profile Views",
    "dashboard.entrepreneur.investorInterest": "Investor Interest",
    "dashboard.entrepreneur.milestones": "Milestones",
    "dashboard.entrepreneur.recentViewers": "Recent Viewers",
    "dashboard.entrepreneur.manageStartup": "Manage Startup",
    "dashboard.entrepreneur.editProfile": "Edit Profile",
    "dashboard.entrepreneur.addMilestone": "Add Milestone",

    // Marketplace
    "marketplace.title": "Startup Marketplace",
    "marketplace.search": "Search startups...",
    "marketplace.filters": "Filters",
    "marketplace.industry": "Industry",
    "marketplace.stage": "Stage",
    "marketplace.sort": "Sort",
    "marketplace.allIndustries": "All Industries",
    "marketplace.allStages": "All Stages",
    "marketplace.sortMatch": "By Match",
    "marketplace.sortFunding": "By Funding",
    "marketplace.sortRecent": "Recent",
    "marketplace.viewDetails": "View Details",
    "marketplace.invest": "Invest",
    "marketplace.match": "match",
    "marketplace.raised": "raised",
    "marketplace.goal": "goal",

    // Startup Profile
    "startup.overview": "Overview",
    "startup.team": "Team",
    "startup.financials": "Financials",
    "startup.documents": "Documents",
    "startup.roadmap": "Roadmap",
    "startup.about": "About",
    "startup.problem": "Problem",
    "startup.solution": "Solution",
    "startup.market": "Market Opportunity",
    "startup.tam": "Total Addressable Market",
    "startup.sam": "Serviceable Addressable Market",
    "startup.som": "Serviceable Obtainable Market",
    "startup.teamMembers": "Team Members",
    "startup.investNow": "Invest Now",
    "startup.valuation": "Valuation",
    "startup.equity": "Equity",
    "startup.minInvestment": "Min. Investment",
    "startup.investors": "investors",
    "startup.obligations": "Obligations",
    "startup.links": "Links",
    "startup.pitch": "Pitch Deck",
    "startup.businessPlan": "Business Plan",
    "startup.financialModel": "Financial Model",

    // Investment Modal
    "invest.title": "Make Investment",
    "invest.amount": "Investment Amount",
    "invest.strategy": "ROI Strategy",
    "invest.equity": "Equity",
    "invest.equityDesc": "Get ownership stake in the company",
    "invest.convertible": "Convertible Note",
    "invest.convertibleDesc": "Debt that converts to equity in next round",
    "invest.revenue": "Revenue Share",
    "invest.revenueDesc": "Receive a percentage of revenue",
    "invest.safe": "SAFE",
    "invest.safeDesc": "Simple Agreement for Future Equity",
    "invest.summary": "Transaction Summary",
    "invest.platformFee": "Platform Fee (5%)",
    "invest.total": "Total",
    "invest.confirm": "Confirm Investment",
    "invest.cancel": "Cancel",
    "invest.success": "Investment Successful!",
    "invest.successDesc": "Your investment has been confirmed.",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.download": "Download",
    "common.upload": "Upload",
    "common.add": "Add",
    "common.remove": "Remove",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.none": "None",
    "common.yes": "Yes",
    "common.no": "No",
    "common.completed": "Completed",
    "common.pending": "Pending",
    "common.inProgress": "In Progress",
    "common.notStarted": "Not Started",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Language
    "language.uz": "O'zbekcha",
    "language.ru": "Русский",
    "language.en": "English",
  },
} as const

type TranslationKey = keyof typeof translations.en

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz")

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || translations.en[key] || key
    },
    [language],
  )

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export { translations }
export type { TranslationKey }
