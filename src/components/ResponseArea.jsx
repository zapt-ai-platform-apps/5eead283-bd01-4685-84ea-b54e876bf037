import { Show } from 'solid-js';

function ResponseArea(props) {
  const {
    responseText,
    isPlaying,
    handleCopyResponse,
    handleAudioControl,
    loading,
    fontSize,
    theme,
  } = props;

  return (
    <Show when={responseText()}>
      <div
        class={`mt-8 bg-gradient-to-r from-purple-200 to-blue-200 p-6 rounded-xl shadow-inner ${
          theme() === 'dark' ? 'bg-gray-700' : ''
        }`}
      >
        <h3 class="text-xl font-bold mb-2 text-purple-600 text-center">الرد:</h3>
        <p
          class={`text-gray-800 leading-relaxed whitespace-pre-wrap ${
            fontSize()
          } ${theme() === 'dark' ? 'text-white' : ''}`}
        >
          {responseText()}
        </p>
        <div class="flex space-x-2 mt-4">
          <button
            class="flex-1 py-2 px-6 bg-green-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            onClick={handleCopyResponse}
          >
            نسخ الرد
          </button>
          <button
            class={`flex-1 py-2 px-6 bg-blue-500 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              if (!loading()) {
                handleAudioControl();
              }
            }}
            disabled={loading()}
          >
            {isPlaying() ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          </button>
        </div>
      </div>
    </Show>
  );
}

export default ResponseArea;