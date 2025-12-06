🚀 StartupFund - Kelajak Unicornlariga Sarmoya Kiriting
StartupFund — bu tadbirkorlar va investorlarni bog'laydigan zamonaviy investitsiya platformasi. Bu loyiha startaplar uchun shaffof, bosqichma-bosqich (milestone-based) moliyalashtirish tizimini va investorlar uchun xavfsiz, tahliliy vositalarni taqdim etadi.

📋 Mundarija
Loyiha haqida

Asosiy Xususiyatlar

Texnologiyalar

Loyiha Tuzilmasi

O'rnatish va Ishga Tushirish

API Hujjatlari

Hissalar (Contribution)

💡 Loyiha haqida
StartupFund an'anaviy venchur kapitali va kraudfanding o'rtasidagi bo'shliqni to'ldiradi. Bizning platformamiz orqali:

Tadbirkorlar: O'z g'oyalarini namoyish etadilar, jamoa tuzadilar va bosqichma-bosqich moliyalashtirish oladilar.

Investorlar: Sun'iy intellekt yordamida o'zlariga mos startaplarni topadilar, due diligence (tekshiruv) o'tkazadilar va portfelini boshqaradilar.

✨ Asosiy Xususiyatlar
🏢 Tadbirkorlar uchun (Entrepreneur Portal)
Startup Wizard: Loyihani bosqichma-bosqich yaratish (Ma'lumotlar, Moliya, Jamoa, Yo'l xaritasi).

Funding Progress: Mablag' yig'ish jarayonini real vaqtda vizual kuzatish.

Milestone Management: Moliyalashtirishni bosqichlarga bo'lib olish va hisobot berish.

Investor Analytics: Profilingizni kimlar ko'rgani va qiziqish bildirganligini kuzatish.

💼 Investorlar uchun (Investor Portal)
Smart Marketplace: Sanoat va bosqich bo'yicha startaplarni qidirish va filtrlash.

Diverse ROI Strategies: Turli investitsiya turlari:

Equity (Ulush)

Convertible Note (Qarz)

Revenue Share (Daromad ulushi)

SAFE (Kelajakdagi kapital)

Portfolio Dashboard: Investitsiyalar o'sishi va daromadlarni grafiklarda tahlil qilish.

Due Diligence: Startap hujjatlari va moliyaviy prognozlari bilan tanishish.

🌐 Umumiy Platforma
Multi-language Support: O'zbek, Rus va Ingliz tillarida to'liq interfeys (i18n).

Dark/Light Mode: Foydalanuvchi xohishiga ko'ra mavzuni o'zgartirish.

Role-Based Access: Tadbirkor va Investor uchun alohida himoyalangan kabinetlar.

🛠 Texnologiyalar
Ushbu loyiha zamonaviy va barqaror texnologiyalar asosida qurilgan:

Frontend (Mijoz tomoni)
Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS, Shadcn UI (Radix UI asosida)

Charts: Recharts (Portfolio va statistika uchun)

Animations: Tailwind Animate

Forms: React Hook Form + Zod (Validatsiya)

Icons: Lucide React

Backend (Server tomoni)
Framework: Django & Django REST Framework (DRF)

Database: PostgreSQL

Auth: JWT (Simple JWT)

Documentation: DRF Spectacular (Swagger/OpenAPI)

📂 Loyiha Tuzilmasi
Bash

startup-fund-backend/
├── app/                    # Next.js App Router sahifalari
│   ├── (auth)/             # Login/Register sahifalari
│   ├── (dashboard)/        # Asosiy panel
│   ├── dashboard/          # Investor va Tadbirkor uchun maxsus panellar
│   └── startup/[id]/       # Startap detalli ko'rinishi
├── components/             # Qayta ishlatiluvchi UI komponentlar
│   ├── ui/                 # Shadcn UI elementlari (Button, Card, Input...)
│   └── ...                 # Maxsus komponentlar (StartupCard, InvestModal...)
├── lib/                    # Yordamchi funksiyalar (utils, i18n, mock-data)
├── hooks/                  # Custom React hooks (use-toast, use-auth)
├── public/                 # Statik fayllar (rasmlar, ikonkalr)
├── scripts/                # Backend (Django) kodi
│   └── startupfund/        # Asosiy Django app
│       ├── models.py       # Ma'lumotlar bazasi modellari
│       ├── views.py        # API kontrollerlari
│       ├── serializers.py  # Ma'lumotlarni o'zgartirish
│       └── urls.py         # API marshrutlari
└── styles/                 # Global CSS fayllar
🚀 O'rnatish va Ishga Tushirish
Loyihani lokal kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

1. Oldindan talablar
Node.js 18+

Python 3.10+

PostgreSQL

2. Repozitoriyni yuklab olish
Bash

git clone https://github.com/username/startup-fund.git
cd startup-fund
3. Frontendni o'rnatish
Kutubxonalarni o'rnatish va loyihani ishga tushirish:

Bash

# Paketlarni o'rnatish (pnpm tavsiya etiladi)
# Frontendni ishga tushirish
pnpm dev
Brauzerda http://localhost:3000 manzilini oching.

4. Backendni sozlash (Django)
Yangi terminal oynasida:

Bash

cd scripts

# Virtual muhit yaratish
python -m venv venv
source venv/bin/activate  # Windows uchun: venv\Scripts\activate

# Kerakli paketlarni o'rnatish
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary drf-spectacular

# Migratsiyalarni amalga oshirish
python manage.py migrate

# Serverni ishga tushirish
python manage.py runserver
API http://localhost:8000 manzilida ishlaydi.

📡 API Hujjatlari
Backend ishga tushgandan so'ng, to'liq API hujjatlarini ko'rishingiz mumkin (Swagger UI):

Auth: /api/v1/auth/ (Login, Register, Token)

Portal (Tadbirkor): /api/v1/portal/ (Startap yaratish, jamoa, takliflar)

Invest (Investor): /api/v1/invest/ (Marketplace, taklif yuborish, portfel)

Misol Endpoints: | Metod | Endpoint | Tavsif | |-------|----------|--------| | POST | /api/v1/auth/token/ | JWT token olish | | GET | /api/v1/invest/startups/ | Barcha startaplar ro'yxati | | POST | /api/v1/invest/offers/ | Investitsiya taklifini yuborish |

🤝 Hissalar (Contributing)
Loyihani rivojlantirishga hissa qo'shmoqchi bo'lsangiz:

Ushbu repozitoriyni "Fork" qiling.

Yangi branch yarating (git checkout -b feature/YangiXususiyat).

O'zgarishlarni commit qiling (git commit -m 'Yangi xususiyat qo'shildi').

Branchingizni push qiling (git push origin feature/YangiXususiyat).

Pull Request yuboring.

📄 Litsenziya
Bu loyiha MIT License ostida tarqatilmoqda.

2025 © StartupFund - O'zbekistonning innovatsion kelajagini birgalikda quramiz.
pnpm install
# yoki
npm install
