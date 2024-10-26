import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// إضافة دعم PWA للتطبيق باستخدام Progressier
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://your-icon-url-here.png", // استبدل هذا بالرابط الفعلي للأيقونة
  name: "مساعد المكفوفين",
  shortName: "مساعد"
};
let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/your-progressier-app-id/script.js'); // استبدل هذا بالرقم التعريفي الفعلي للتطبيق في Progressier
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

render(() => <App />, document.getElementById('root'));