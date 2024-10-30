import { Show } from 'solid-js';

function Instructions(props) {
  const { showInstructions, toggleInstructions } = props;

  return (
    <Show when={showInstructions()}>
      <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow-inner overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4 text-purple-600">
          كيفية الاستخدام
        </h2>
        <p class="text-gray-800 leading-relaxed mb-2">
          يمكنك التفاعل مع الذكاء الاصطناعي عن طريق كتابة استفسارك في مربع
          النص أو استخدام ميزة التسجيل الصوتي.
        </p>
        <ul class="list-disc list-inside text-gray-800 space-y-2">
          <li>
            للاستخدام الصوتي، اضغط على زر "تسجيل صوتي" وتحدث بوضوح.
          </li>
          <li>
            أثناء التسجيل، يمكنك إيقافه بالضغط على زر "إيقاف التسجيل".
          </li>
          <li>
            عند استخدام التسجيل الصوتي، يتم تشغيل الرد الصوتي تلقائيًا.
          </li>
          <li>
            بعد انتهاء الرد الصوتي، سيبدأ التطبيق تلقائيًا في تسجيل صوتك
            للاستفسار التالي.
          </li>
          <li>يمكنك نسخ الرد بالضغط على زر "نسخ الرد".</li>
          <li>
            للتحكم في الصوت أثناء الرد، استخدم زر "إيقاف الصوت" أو "تشغيل
            الصوت".
          </li>
        </ul>
        <button
          class="mt-4 py-2 px-6 bg-red-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          onClick={toggleInstructions}
        >
          إغلاق
        </button>
      </div>
    </Show>
  );
}

export default Instructions;