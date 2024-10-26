import { createSignal, Show } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [textInput, setTextInput] = createSignal('');
  const [responseText, setResponseText] = createSignal('');

  const handleTextSubmit = async () => {
    if (!textInput().trim()) {
      setErrorMessage('يرجى إدخال نص.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: textInput(),
        response_type: 'text'
      });

      setResponseText(result);
      setTextInput('');
    } catch (error) {
      console.error('Error processing text:', error);
      setErrorMessage('حدث خطأ أثناء معالجة النص.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full bg-gray-100 p-4 flex items-center justify-center">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 class="text-3xl font-bold mb-4 text-purple-600">مرحبًا بك في مساعد المكفوفين</h1>
        <p class="mb-6 text-lg text-gray-700">يتيح لك هذا التطبيق التفاعل مع الذكاء الاصطناعي باللغة العربية.</p>
        <div class="space-y-4">
          <div class="relative">
            <input
              type="text"
              placeholder="اكتب رسالتك هنا"
              value={textInput()}
              onInput={(e) => setTextInput(e.target.value)}
              class="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
            <button
              class={`absolute inset-y-0 left-0 px-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded-r-lg ${
                loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={handleTextSubmit}
              disabled={loading()}
            >
              {loading() ? 'جارٍ الإرسال...' : 'إرسال'}
            </button>
          </div>
        </div>

        <Show when={responseText()}>
          <div class="mt-6 text-left">
            <h3 class="text-lg font-bold mb-2 text-purple-600">الرد:</h3>
            <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{responseText()}</p>
          </div>
        </Show>
        <Show when={errorMessage()}>
          <div class="mt-4 text-red-500">{errorMessage()}</div>
        </Show>
      </div>
    </div>
  );
}

export default App;