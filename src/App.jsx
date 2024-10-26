import { createSignal, onMount, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [audioUrl, setAudioUrl] = createSignal('');
  const [errorMessage, setErrorMessage] = createSignal('');
  const [textInput, setTextInput] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const recordAudio = () => {
    if (!navigator.mediaDevices.getUserMedia) {
      setErrorMessage('المتصفح لا يدعم تسجيل الصوت.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.start();

      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks);
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        try {
          const response = await fetch('/api/processAudio', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            setAudioUrl(data.audioUrl);
          } else {
            setErrorMessage('حدث خطأ أثناء معالجة الصوت.');
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          setErrorMessage('حدث خطأ أثناء معالجة الصوت.');
        } finally {
          setLoading(false);
        }
      });

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 5000); // Record for 5 seconds
    }).catch(error => {
      console.error('Error accessing microphone:', error);
      setErrorMessage('لم يتم الوصول إلى الميكروفون.');
      setLoading(false);
    });
  };

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

      // Convert the text response to speech
      const audioResult = await createEvent('text_to_speech', {
        text: result
      });

      setAudioUrl(audioResult);
      setTextInput('');
    } catch (error) {
      console.error('Error processing text:', error);
      setErrorMessage('حدث خطأ أثناء معالجة النص.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">تسجيل الدخول باستخدام ZAPT</h2>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline mb-6 block text-center"
            >
              تعرف على ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
              magicLink={true}
              view="magic_link"
              showLinks={false}
              authView="magic_link"
            />
          </div>
        }
      >
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 class="text-2xl font-bold mb-4 text-purple-600">مساعد الذكاء الاصطناعي للمكفوفين</h1>
          <p class="mb-6 text-gray-700">اختر طريقة التفاعل:</p>
          <div class="space-y-4">
            <button
              class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={recordAudio}
              disabled={loading()}
            >
              {loading() ? 'جارٍ التسجيل...' : 'ابدأ التسجيل'}
            </button>
            <div class="relative">
              <input
                type="text"
                placeholder="اكتب رسالتك هنا"
                value={textInput()}
                onInput={(e) => setTextInput(e.target.value)}
                class="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              />
              <button
                class={`absolute inset-y-0 left-0 px-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded-r-lg cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleTextSubmit}
                disabled={loading()}
              >
                إرسال
              </button>
            </div>
          </div>
          <Show when={audioUrl()}>
            <div class="mt-6">
              <h3 class="text-lg font-bold mb-2 text-purple-600">الرد الصوتي</h3>
              <audio controls src={audioUrl()} class="w-full" />
            </div>
          </Show>
          <Show when={errorMessage()}>
            <div class="mt-4 text-red-500">{errorMessage()}</div>
          </Show>
          <button
            class="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none transition duration-300 ease-in-out cursor-pointer"
            onClick={handleSignOut}
          >
            تسجيل الخروج
          </button>
        </div>
      </Show>
    </div>
  );
}

export default App;