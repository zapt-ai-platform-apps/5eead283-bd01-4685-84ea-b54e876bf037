import { createSignal, Show, onMount } from 'solid-js';
import { createEvent } from './supabaseClient';
import Instructions from './components/Instructions';
import InputArea from './components/InputArea';
import ResponseArea from './components/ResponseArea';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [successMessage, setSuccessMessage] = createSignal('');
  const [textInput, setTextInput] = createSignal('');
  const [responseText, setResponseText] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [audioObject, setAudioObject] = createSignal(null);
  const [isRecording, setIsRecording] = createSignal(false);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showInstructions, setShowInstructions] = createSignal(false);
  const [isVoiceInput, setIsVoiceInput] = createSignal(false);
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
        setIsVoiceInput(true);
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

  const handleStopRecording = () => {
    if (recognition && isRecording()) {
      recognition.stop();
      setIsRecording(false);
      setErrorMessage('تم إيقاف التسجيل الصوتي.');
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

      if (isVoiceInput()) {
        const audioResult = await createEvent('text_to_speech', {
          text: aiResult,
        });
        setAudioUrl(audioResult);

        const audio = new Audio(audioResult);
        setAudioObject(audio);
        setIsPlaying(true);

        audio.onended = () => {
          setIsPlaying(false);
          setAudioObject(null);
          handleVoiceInput();
        };

        audio.onerror = (e) => {
          console.error('Error playing audio:', e);
          setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
          setIsPlaying(false);
          setAudioObject(null);
          handleVoiceInput();
        };

        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
          setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
          setIsPlaying(false);
          setAudioObject(null);
          handleVoiceInput();
        });
      } else {
        // لا تقم بالرد الصوتي إذا كان الإدخال نصيًا
        setIsPlaying(false);
        setAudioObject(null);
      }
    } catch (error) {
      console.error('Error processing text:', error);
      setErrorMessage('حدث خطأ أثناء معالجة النص.');
    } finally {
      setLoading(false);
      setIsVoiceInput(false);
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
        handleVoiceInput();
      };

      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
        setIsPlaying(false);
        setAudioObject(null);
        handleVoiceInput();
      };

      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setErrorMessage('حدث خطأ أثناء تشغيل الصوت.');
        setIsPlaying(false);
        setAudioObject(null);
        handleVoiceInput();
      });
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions());
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 h-full">
        <div class="flex justify-between items-center mb-6 relative">
          <div class="text-center w-full">
            <h1 class="text-4xl font-extrabold mb-2 text-purple-700">
              Blind Assistant
            </h1>
            <p class="text-lg text-gray-600">
              تفاعل مع الذكاء الاصطناعي باللغة العربية بسهولة.
            </p>
          </div>
          <button
            class="text-purple-700 font-semibold cursor-pointer absolute top-4 right-4"
            onClick={toggleInstructions}
          >
            كيفية الاستخدام
          </button>
        </div>

        <Instructions
          showInstructions={showInstructions}
          toggleInstructions={toggleInstructions}
        />

        <InputArea
          textInput={textInput}
          setTextInput={setTextInput}
          isRecording={isRecording}
          loading={loading}
          handleTextSubmit={handleTextSubmit}
          handleVoiceInput={handleVoiceInput}
          handleStopRecording={handleStopRecording}
          setIsVoiceInput={setIsVoiceInput}
        />

        <Show when={errorMessage()}>
          <div class="mt-4 text-red-500 text-center">{errorMessage()}</div>
        </Show>

        <Show when={successMessage()}>
          <div class="mt-4 text-green-500 text-center">{successMessage()}</div>
        </Show>

        <ResponseArea
          responseText={responseText}
          isPlaying={isPlaying}
          handleCopyResponse={handleCopyResponse}
          handleAudioControl={handleAudioControl}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;