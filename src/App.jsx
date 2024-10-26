import { createSignal, Show, onMount } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [textInput, setTextInput] = createSignal('');
  const [responseText, setResponseText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [isRecording, setIsRecording] = createSignal(false);
  const [soundEnabled, setSoundEnabled] = createSignal(false);
  let recognition;

  onMount(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        recognition.stop();
        setIsRecording(false);
        handleTextSubmit();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setErrorMessage('حدث خطأ أثناء التعرف على الصوت.');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
      setErrorMessage('التعرف على الصوت غير مدعوم في هذا المتصفح.');
    }
  });

  const handleVoiceInput = () => {
    if (recognition) {
      setIsRecording(true);
      setErrorMessage('');
      recognition.start();
    } else {
      setErrorMessage('التعرف على الصوت غير مدعوم في هذا المتصفح.');
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput().trim()) {
      setErrorMessage('يرجى إدخال نص.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setAudioUrl('');
    setResponseText('');
    try {
      const aiResult = await createEvent('chatgpt_request', {
        prompt: textInput(),
        response_type: 'text'
      });

      setResponseText(aiResult);
      setTextInput('');

      // تحويل الرد إلى كلام وتشغيله تلقائيًا إذا كان الصوت مفعلاً
      if (soundEnabled()) {
        const audioResult = await createEvent('text_to_speech', {
          text: aiResult
        });
        setAudioUrl(audioResult);

        // تشغيل الصوت تلقائيًا
        const audio = new Audio(audioResult);
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } catch (error) {
      console.error('Error processing text:', error);
      setErrorMessage('حدث خطأ أثناء معالجة النص.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 h-full">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-extrabold mb-2 text-purple-700">Blind assistant</h1>
          <p class="text-lg text-gray-600">تفاعل مع الذكاء الاصطناعي باللغة العربية بسهولة.</p>
        </div>
        <div class="space-y-4">
          <textarea
            placeholder="اكتب رسالتك هنا..."
            value={textInput()}
            onInput={(e) => setTextInput(e.target.value)}
            class="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border resize-none text-gray-800"
          ></textarea>
          <div class="flex space-x-2">
            <button
              class={`flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                loading() || isRecording() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleTextSubmit}
              disabled={loading() || isRecording()}
            >
              {loading() && !isRecording() ? 'جارٍ المعالجة...' : 'إرسال'}
            </button>
            <button
              class={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                isRecording() || loading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleVoiceInput}
              disabled={isRecording() || loading()}
            >
              {isRecording() ? 'جارٍ التسجيل...' : 'تسجيل صوتي'}
            </button>
          </div>
        </div>

        <div class="mt-4 flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled()}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              class="form-checkbox h-5 w-5 text-purple-600 cursor-pointer"
            />
            <span class="mr-2 text-gray-700">تشغيل الصوت عند الرد</span>
          </label>
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