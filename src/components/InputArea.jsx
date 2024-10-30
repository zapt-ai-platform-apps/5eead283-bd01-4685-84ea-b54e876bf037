import { Show } from 'solid-js';

function InputArea(props) {
  const {
    textInput,
    setTextInput,
    isRecording,
    loading,
    handleTextSubmit,
    handleVoiceInput,
    handleStopRecording,
    setIsVoiceInput,
    fontSize,
    theme
  } = props;

  return (
    <div class="space-y-4">
      <textarea
        placeholder="اكتب رسالتك هنا..."
        value={textInput()}
        onInput={(e) => setTextInput(e.target.value)}
        class={`w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border resize-none text-gray-800 ${
          fontSize()
        } ${theme() === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}
      ></textarea>
      <div class="flex space-x-2">
        <button
          class={`flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => {
            if (!loading()) {
              setIsVoiceInput(false);
              handleTextSubmit();
            }
          }}
          disabled={loading()}
        >
          {loading() && !isRecording() ? 'جارٍ المعالجة...' : 'إرسال'}
        </button>
        <button
          class={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => {
            if (!loading()) {
              isRecording() ? handleStopRecording() : handleVoiceInput();
            }
          }}
          disabled={loading()}
        >
          {isRecording() ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
        </button>
      </div>
    </div>
  );
}

export default InputArea;