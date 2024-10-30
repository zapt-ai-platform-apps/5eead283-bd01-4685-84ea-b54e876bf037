import { Show, createSignal } from 'solid-js';

function SettingsModal(props) {
  const {
    showSettings,
    toggleSettings,
    autoPlayVoice,
    fontSize,
    voiceSpeed,
    theme,
    saveSettings,
  } = props;

  const [localAutoPlayVoice, setLocalAutoPlayVoice] = createSignal(autoPlayVoice());
  const [localFontSize, setLocalFontSize] = createSignal(fontSize());
  const [localVoiceSpeed, setLocalVoiceSpeed] = createSignal(voiceSpeed());
  const [localTheme, setLocalTheme] = createSignal(theme());

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings({
      autoPlayVoice: localAutoPlayVoice(),
      fontSize: localFontSize(),
      voiceSpeed: localVoiceSpeed(),
      theme: localTheme(),
    });
  };

  return (
    <Show when={showSettings()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md p-6">
          <h2 class="text-2xl font-bold mb-4 text-center text-purple-600">
            الإعدادات
          </h2>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localAutoPlayVoice()}
                  onInput={(e) => setLocalAutoPlayVoice(e.target.checked)}
                  class="cursor-pointer"
                />
                <span>تشغيل الرد الصوتي تلقائيًا</span>
              </label>
            </div>
            <div>
              <label class="block mb-1">حجم الخط:</label>
              <select
                value={localFontSize()}
                onInput={(e) => setLocalFontSize(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded box-border"
              >
                <option value="text-sm">صغير</option>
                <option value="text-base">متوسط</option>
                <option value="text-lg">كبير</option>
                <option value="text-xl">كبير جدًا</option>
              </select>
            </div>
            <div>
              <label class="block mb-1">سرعة الصوت:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={localVoiceSpeed()}
                onInput={(e) => setLocalVoiceSpeed(e.target.value)}
                class="w-full cursor-pointer"
              />
              <div class="text-center">{localVoiceSpeed()}x</div>
            </div>
            <div>
              <label class="block mb-1">الوضع :</label>
              <select
                value={localTheme()}
                onInput={(e) => setLocalTheme(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded box-border"
              >
                <option value="light">فاتح</option>
                <option value="dark">داكن</option>
              </select>
            </div>
            <div class="flex space-x-2 mt-4">
              <button
                type="submit"
                class="flex-1 py-2 px-4 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 cursor-pointer"
              >
                حفظ
              </button>
              <button
                type="button"
                class="flex-1 py-2 px-4 bg-red-500 text-white rounded font-semibold hover:bg-red-600 cursor-pointer"
                onClick={toggleSettings}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  );
}

export default SettingsModal;