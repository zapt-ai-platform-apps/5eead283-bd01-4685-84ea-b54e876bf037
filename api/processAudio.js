import { createEvent } from '../src/supabaseClient';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة الملف.' });
      return;
    }

    try {
      const file = files.file;

      if (!file) {
        return res.status(400).json({ error: 'لم يتم تقديم ملف الصوت.' });
      }

      const fs = await import('fs');
      const audioData = fs.readFileSync(file.filepath, { encoding: 'base64' });

      const result = await createEvent('process_audio', {
        audioData
      });

      res.status(200).json({ audioUrl: result });
    } catch (error) {
      console.error('Error processing audio:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة الصوت.' });
    }
  });
}