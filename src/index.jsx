import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// إضافة دعم PWA للتطبيق (سيضيف هذا عامل خدمة وملف manifest، لا تحتاج إلى فعل أي شيء آخر)
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://otebnzqfzytqyyjdfhzr.supabase.co/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512",
  name: "مساعد المكفوفين",
  shortName: "مساعد المكفوفين"
};
let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

render(() => <App />, document.getElementById('root'));