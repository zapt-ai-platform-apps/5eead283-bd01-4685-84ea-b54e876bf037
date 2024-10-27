import { createSignal, Show, onMount } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [successMessage, setSuccessMessage] = createSignal('');
  const [textInput, setTextInput] = createSignal('');
  const [responseText, setResponseText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [audioObject, setAudioObject] = createSignal(null);
  const [isRecording, setIsRecording] = createSignal(false);
  const [soundEnabled, setSoundEnabled] = createSignal(false);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showInstructions, setShowInstructions] = createSignal(false);
  const [inputFromVoice, setInputFromVoice] = createSignal(false);
  let recognition;

  onMount(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        recognition.stop();
        setIsRecording(false);
        setInputFromVoice(true);
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
    setSuccessMessage('');
    setAudioUrl('');
    setResponseText('');
    try {
      const prompt = `يرجى الإجابة على السؤال التالي باللغة العربية الفصحى وبطريقة جذابة ومبسطة: ${textInput()}`;
      const aiResult = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });

      setResponseText(aiResult);
      setTextInput('');

      if ((inputFromVoice() && soundEnabled()) || (!soundEnabled())) {
        const audioResult = await createEvent('text_to_speech', {
          text: aiResult,
        });
        setAudioUrl(audioResult);

        if (inputFromVoice() && soundEnabled()) {
          const audio = new Audio(audioResult);
          setAudioObject(audio);
          setIsPlaying(true);

          audio.onended = () => {
            setIsPlaying(false);
            setAudioObject(null);

            if (soundEnabled()) {
              handleVoiceInput();
            }
          };

          audio.onerror = (e) => {
            console.error('Error playing audio:', e);
            setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
            setIsPlaying(false);
            setAudioObject(null);

            if (soundEnabled()) {
              handleVoiceInput();
            }
          };

          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
            setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
            setIsPlaying(false);
            setAudioObject(null);

            if (soundEnabled()) {
              handleVoiceInput();
            }
          });
        }
      } else {
        setInputFromVoice(false);
      }
    } catch (error) {
      console.error('Error processing text:', error);
      setErrorMessage('حدث خطأ أثناء معالجة النص.');
      setInputFromVoice(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(responseText());
      setSuccessMessage('تم نسخ الرد إلى الحافظة.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error copying text: ', err);
      setErrorMessage('حدث خطأ أثناء نسخ الرد.');
    }
  };

  const handleAudioControl = () => {
    if (audioObject()) {
      if (isPlaying()) {
        audioObject().pause();
        setIsPlaying(false);
      } else {
        audioObject().play();
        setIsPlaying(true);
      }
    } else if (audioUrl()) {
      const audio = new Audio(audioUrl());
      setAudioObject(audio);
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        setAudioObject(null);
      };

      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
        setIsPlaying(false);
        setAudioObject(null);
      };

      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
        setIsPlaying(false);
        setAudioObject(null);
      });
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions());
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 h-full">
        <div class="flex justify-between items-center mb-6">
          <div class="text-center">
            <h1 class="text-4xl font-extrabold mb-2 text-purple-700">
              Blind Assistant
            </h1>
            <p class="text-lg text-gray-600">
              تفاعل مع الذكاء الاصطناعي باللغة العربية بسهولة.
            </p>
          </div>
          <button
            class="text-purple-700 font-semibold cursor-pointer"
            onClick={toggleInstructions}
          >
            كيفية الاستخدام
          </button>
        </div>

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
                للتحكم في تشغيل الصوت عند الرد، قم بتفعيل خيار "تشغيل الصوت عند
                الرد".
              </li>
              <li>
                عند استخدام التسجيل الصوتي، يمكن تشغيل الرد الصوتي تلقائيًا إذا
                كان خيار "تشغيل الصوت عند الرد" مفعلاً.
              </li>
              <li>يمكنك نسخ الرد بالضغط على زر "نسخ الرد".</li>
              <li>
                للتحكم في الصوت أثناء الرد، استخدم زر "إيقاف الصوت" أو "تشغيل
                الصوت".
              </li>
              <li>
                إذا كان خيار "تشغيل الصوت عند الرد" غير مفعلاً، يمكنك الاستماع
                للرد باستخدام زر "استمع للرد".
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
                loading() || isRecording()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={handleTextSubmit}
              disabled={loading() || isRecording()}
            >
              {loading() && !isRecording() ? 'جارٍ المعالجة...' : 'إرسال'}
            </button>
            <button
              class={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                isRecording() || loading()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
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

        <Show when={successMessage()}>
          <div class="mt-4 text-green-500 text-center">{successMessage()}</div>
        </Show>

        <Show when={responseText()}>
          <div class="mt-8 bg-gradient-to-r from-purple-200 to-blue-200 p-6 rounded-xl shadow-inner">
            <h3 class="text-xl font-bold mb-2 text-purple-600 text-center">
              الرد:
            </h3>
            <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {responseText()}
            </p>
            <div class="flex space-x-2 mt-4">
              <button
                class="flex-1 py-2 px-6 bg-green-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                onClick={handleCopyResponse}
              >
                نسخ الرد
              </button>
              <Show when={!soundEnabled()}>
                <button
                  class={`flex-1 py-2 px-6 bg-blue-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                    loading() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleAudioControl}
                  disabled={loading()}
                >
                  {isPlaying() ? 'إيقاف الصوت' : 'استمع للرد'}
                </button>
              </Show>
            </div>
          </div>
        </Show>

        <Show when={audioObject() && soundEnabled()}>
          <div class="mt-4 flex justify-center">
            <button
              class="py-2 px-6 bg-blue-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onClick={handleAudioControl}
            >
              {isPlaying() ? 'إيقاف الصوت' : 'تشغيل الصوت'}
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;