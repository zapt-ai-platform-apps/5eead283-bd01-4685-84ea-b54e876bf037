# Blind assistant

تطبيق عربي لمساعدة المكفوفين باستخدام الذكاء الاصطناعي.

## وصف التطبيق

يتيح هذا التطبيق للمستخدمين التفاعل مع الذكاء الاصطناعي باللغة العربية من خلال واجهة مستخدم جذابة وسهلة الاستخدام. يحتوي التطبيق على ميزات مخصصة لمساعدة المكفوفين، مثل الإدخال الصوتي والاستماع للردود، مع إمكانية تفعيل أو تعطيل الصوت أثناء الردود.

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

3. **التحكم في الصوت أثناء الردود:**

   - يقدم التطبيق خيارًا للمستخدم **لتفعيل أو تعطيل الصوت** أثناء الردود.
   - **افتراضيًا، يكون الصوت معطلاً**، ويمكن للمستخدم تفعيله إذا رغب في ذلك.
   - يمكن للمستخدم **تفعيل الصوت** لسماع الردود بشكل تلقائي.
   - يمكن للمستخدم **تعطيل الصوت** إذا كان يفضل قراءة الردود دون الاستماع إليها.

4. **الاستماع للرد والبدء بتسجيل جديد تلقائيًا:**

   - بعد الحصول على الرد النصي من الذكاء الاصطناعي، إذا كان الصوت **مفعلاً**:
     - يقوم التطبيق تلقائيًا بتحويل الرد إلى كلام وتشغيله للمستخدم.
     - **بعد انتهاء تشغيل الصوت، يبدأ التطبيق تلقائيًا بتسجيل صوت المستخدم للاستفسار التالي.**
     - **لا يحتاج المستخدم للضغط على أي زر لبدء التسجيل؛ يتم ذلك تلقائيًا.**
   - إذا كان الصوت **معطلاً**:
     - يتم عرض الرد النصي للمستخدم دون تشغيل الصوت.
     - **لا يبدأ التطبيق بتسجيل صوتي تلقائيًا بعد الرد.**

5. **عرض الرد ونسخه:**

   - يتم عرض الرد النصي للمستخدم بخط واضح وسهل القراءة.
   - يستطيع المستخدم قراءة الرد بسهولة.
   - تتوفر للمستخدم **خيار نسخ الرد** إلى الحافظة:
     - يمكن للمستخدم الضغط على زر "نسخ الرد" لنسخ النص إلى الحافظة.
     - تظهر رسالة تأكيد بأن الرد تم نسخه بنجاح.

## الخدمات الخارجية المستخدمة

- **ZAPT:** لإدارة الأحداث وإرسال طلبات الذكاء الاصطناعي وتحويل النص إلى كلام عبر وظيفة `createEvent`.

- **خدمات الذكاء الاصطناعي:** لمعالجة الإدخال النصي وتوليد الردود النصية والصوتية عبر `createEvent`.

- **Progressier:** لإضافة دعم التطبيق كتطبيق ويب تقدمي (PWA) ولإتاحة تثبيته على الأجهزة.

## ملاحظة

يستخدم التطبيق خدمات الذكاء الاصطناعي لمعالجة الإدخال النصي وتوليد الردود النصية والصوتية. التطبيق مجاني للاستخدام ويهدف إلى تقديم مساعدة فعّالة للمكفوفين من خلال ميزات مخصصة تلبي احتياجاتهم.