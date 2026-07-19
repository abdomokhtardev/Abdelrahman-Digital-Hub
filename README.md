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

**رابط المعاينة الحية (Live Demo):** [.netlify.app](https://ahmedawad-tr.netlify.app)  
**رابط المعاينة الحية (Live Demo):** [https://.pages.dev](https://ahmedawad-tr.pages.dev)  

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4.
- **Backend & Database:** Firebase (Firestore, Authentication).
- **Security:** Firebase Security Rules.
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

### 3. إعداد قاعدة البيانات (Firebase Setup)
المشروع يعتمد بالكامل على Firebase كخلفية (Backend).
1. قم بإنشاء مشروع جديد على موقع [Firebase Console](https://console.firebase.google.com/).
2. قم بتفعيل **Authentication** و **Firestore Database**.
3. قم بإنشاء حساب لنفسك ليكون حساب الآدمن عبر لوحة التحكم.
4. اذهب إلى تبويب **Rules** في Firestore والصق القواعد الموجودة في ملف `firestore.rules` في المشروع واضغط Publish لحماية البيانات.
5. لرفع الصور، المشروع يحول الصور إلى نص (Base64) ويخزنها مباشرة في قاعدة البيانات مما يغني عن استخدام Firebase Storage.

### 4. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع، وأضف مفاتيح مشروعك في Firebase بالإضافة إلى الـ UID الخاص بحسابك كآدمن:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_UID=your_admin_user_id
```

### 5. تشغيل الخادم المحلي (Development Server)
```bash
npm run dev
```
افتح الرابط المعروض في الطرفية (غالباً `http://localhost:5173`) لرؤية المشروع.

## 🔒 الأمان (Security)
تم تأمين قاعدة البيانات بشكل كامل باستخدام **Firebase Security Rules**. القواعد المكتوبة تضمن أن "الآدمن فقط" (المصرح له بالدخول) هو من يمتلك صلاحيات الإضافة، التعديل، والحذف (Write Permissions). بينما يتمتع جميع الزوار بصلاحيات القراءة فقط (Read Permissions).

---
*«خطواتٌ فوق رمال الفكر ترسمُ أثراً لا يزول»* ✨
