# Blind assistant

تطبيق عربي لمساعدة المكفوفين باستخدام الذكاء الاصطناعي.

## وصف التطبيق

يتيح هذا التطبيق للمستخدمين التفاعل مع الذكاء الاصطناعي باللغة العربية من خلال واجهة مستخدم جذابة وسهلة الاستخدام. يحتوي التطبيق على ميزات مخصصة لمساعدة المكفوفين، مثل الإدخال الصوتي والاستماع للردود بشكل تلقائي.

## رحلات المستخدم

1. **الشاشة الرئيسية:**

   - عند فتح التطبيق، يظهر شعار التطبيق مع ترحيب بالمستخدم.
   - يتم توجيه المستخدم إلى واجهة تفاعلية.

2. **التفاعل مع الذكاء الاصطناعي:**

   - يمكن للمستخدم **كتابة استفساره** في مربع النص أو **استخدام ميزة التسجيل الصوتي** لتحويل كلامه إلى نص.
   - عند استخدام **التسجيل الصوتي**:
     - يبدأ التطبيق بتسجيل صوت المستخدم عند الضغط على زر "تسجيل صوتي".
     - بعد انتهاء التسجيل والتحويل التلقائي إلى نص، **يقوم التطبيق تلقائيًا بإرسال الاستفسار** إلى الذكاء الاصطناعي لمعالجته.
     - **لا يحتاج المستخدم للضغط على زر "إرسال" بعد التسجيل الصوتي.**
     - يظهر مؤشر تحميل لإعلام المستخدم بأن التطبيق يعالج الطلب.
   - عند استخدام **الاستفسار النصي**:
     - يكتب المستخدم استفساره في مربع النص.
     - يضغط على زر "إرسال" لإرسال الاستفسار إلى الذكاء الاصطناعي.
     - يظهر مؤشر تحميل لإعلام المستخدم بأن التطبيق يعالج الطلب.

3. **الاستماع للرد تلقائيًا:**

   - بعد الحصول على الرد النصي من الذكاء الاصطناعي، يقوم التطبيق تلقائيًا بتحويل الرد إلى كلام وتشغيله للمستخدم.
   - **لا يحتاج المستخدم للضغط على زر "استمع للرد"؛ يتم تشغيل الرد الصوتي تلقائيًا.**
   - **تم إخفاء زر إيقاف وتشغيل الصوت؛ لا يمكن للمستخدم إعادة تشغيل الرد الصوتي من خلال التطبيق.**

4. **عرض الرد:**

   - يتم عرض الرد النصي للمستخدم بخط واضح وقابل للتكبير.
   - يستطيع المستخدم قراءة الرد بسهولة.

## الخدمات الخارجية المستخدمة

- **ZAPT:** لإدارة الأحداث وإرسال طلبات الذكاء الاصطناعي وتحويل النص إلى كلام عبر وظيفة `createEvent`.

- **خدمات الذكاء الاصطناعي:** لمعالجة الإدخال النصي وتوليد الردود النصية والصوتية عبر `createEvent`.

- **Progressier:** لإضافة دعم التطبيق كتطبيق ويب تقدمي (PWA) ولإتاحة تثبيته على الأجهزة.

## ملاحظة

يستخدم التطبيق خدمات الذكاء الاصطناعي لمعالجة الإدخال النصي وتوليد الردود النصية والصوتية. التطبيق مجاني للاستخدام ويهدف إلى تقديم مساعدة فعّالة للمكفوفين من خلال ميزات مخصصة تلبي احتياجاتهم.