# Abdelrahman | Digital Hub 🚀

مدونتي الشخصية ومحفظة أعمالي الرقمية (Personal Portfolio & Blog)، مبنية باستخدام أحدث تقنيات الويب لتقديم تجربة مستخدم سريعة، تفاعلية، وبتصميم عصري جذاب يدعم الوضعين الليلي والنهاري.

## 🌟 المميزات (Features)

- **لوحة تحكم كاملة (Admin Dashboard):** لإدارة المقالات، المشاريع، المهارات، والمحتوى المختار بكل سهولة وأمان.
- **عرض المشاريع (Projects Showcase):** لعرض الأعمال البرمجية بطريقة منظمة مع إمكانية إضافة "المشكلة والحل" لكل مشروع بشكل مستقل.
- **نظام تدوين (Blog):** لنشر التدوينات والمقالات التقنية ومشاركتها مع الزوار.
- **إدارة المهارات (Skills Management):** نظام مرن لإضافة المهارات وتصنيفاتها، مع دعم السحب والإفلات (Drag & Drop) لترتيبها بكل سهولة.
- **المحتوى المختار (Curated Content):** قسم لمشاركة الفيديوهات والمقالات المفيدة والمؤثرة.
- **الوضع الليلي والنهاري (Dark/Light Mode):** مدمج بسلاسة مع تصميم يعتمد على لوحة ألوان دافئة ومريحة للعين (رمال الصحراء، الذهبي، الأزرق المخضر).
- **تأثيرات بصرية (Animations):** استخدام تأثيرات انتقال حركية ناعمة (مثل تأثير هبوب الرياح الرملية) لتجربة مستخدم لا تُنسى.

**رابط المعاينة الحية (Live Demo):** [https://abdomokhtardev.pages.dev](https://abdomokhtardev.pages.dev)  

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4.
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Storage).
- **Security:** Strict Row Level Security (RLS) policies.
- **Icons & UI:** React Icons, Custom CSS Animations.

## 🚀 كيفية تشغيل المشروع محلياً (Local Setup)

### 1. المتطلبات الأساسية
تأكد من تثبيت [Node.js](https://nodejs.org/) على جهازك.

### 2. تثبيت المشروع
```bash
git clone https://github.com/your-username/your-repo-name.git
cd "your-repo-name"
npm install
```

### 3. إعداد قاعدة البيانات (Supabase Setup)
المشروع يعتمد بالكامل على Supabase كخلفية (Backend).
1. قم بإنشاء مشروع جديد على موقع [Supabase](https://supabase.com/).
2. اذهب إلى قسم **Authentication** وأنشئ مستخدماً جديداً (هذا سيكون حساب الآدمن الخاص بك)، ثم انسخ الـ **User UID** الخاص به.
3. افتح ملف `supabase/schema.sql` الموجود في المشروع، وابحث عن الـ ID الافتراضي واستبدله بالـ ID الخاص بك.
4. اذهب إلى قسم **SQL Editor** في لوحة تحكم Supabase، الصق الكود بعد التعديل، واضغط **Run**. (سيقوم هذا بتأسيس جميع الجداول، السياسات، والتخزين).

### 4. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع، وأضف مفاتيح مشروعك في Supabase:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. تشغيل الخادم المحلي (Development Server)
```bash
npm run dev
```
افتح الرابط المعروض في الطرفية (غالباً `http://localhost:5173`) لرؤية المشروع.

## 🔒 الأمان (Security)
تم تأمين قاعدة البيانات بشكل كامل باستخدام **Row Level Security (RLS)**. السياسات المكتوبة تضمن أن "الآدمن فقط" (صاحب الـ UID المطابق) هو من يمتلك صلاحيات الإضافة، التعديل، الحذف، ورفع الصور (Write Permissions). بينما يتمتع جميع الزوار بصلاحيات القراءة فقط (Read Permissions).

---
*«خطواتٌ فوق رمال الفكر ترسمُ أثراً لا يزول»* ✨
