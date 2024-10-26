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
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div class="max-w-lg w-full bg-white rounded-3xl shadow-lg p-8">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-extrabold mb-2 text-purple-700">مساعد المكفوفين</h1>
          <p class="text-lg text-gray-600">تفاعل مع الذكاء الاصطناعي باللغة العربية بسهولة.</p>
        </div>
        <div class="space-y-4">
          <textarea
            placeholder="اكتب رسالتك هنا..."
            value={textInput()}
            onInput={(e) => setTextInput(e.target.value)}
            class="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border resize-none text-gray-800"
          ></textarea>
          <button
            class={`w-full py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={handleTextSubmit}
            disabled={loading()}
          >
            {loading() ? 'جارٍ المعالجة...' : 'إرسال'}
          </button>
        </div>

        <Show when={errorMessage()}>
          <div class="mt-4 text-red-500 text-center">{errorMessage()}</div>
        </Show>

        <Show when={responseText()}>
          <div class="mt-8 bg-gray-100 p-6 rounded-xl shadow-inner">
            <h3 class="text-xl font-bold mb-2 text-purple-600 text-center">الرد:</h3>
            <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{responseText()}</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;