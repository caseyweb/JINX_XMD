const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const path = require('path');

const SESSION_FILE = path.join(__dirname, '../../src/gemini.json');

const loadSession = () => {
    if (!fs.existsSync(SESSION_FILE)) {
        fs.writeFileSync(SESSION_FILE, JSON.stringify({}), 'utf-8')
    }
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
};
const saveSession = (data) => {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    command: ['gemini'],
    operate: async ({ reply, m, text, mime }) => {
        if (!text) return reply('Please ask a question');
        
        try {
            const geminiData = loadSession();
            const userId = m.sender;

            if (!geminiData[userId]) {
                geminiData[userId] = [];
            }
            
            text += ' (Reply in English)';

            const formData = new FormData();

            if (m.quoted && m.quoted.mimetype && /image|video|audio|application\/pdf/.test(m.quoted.mimetype)) {
                let media = await m.quoted.download();
                const { ext } = await fromBuffer(media);
                const filename = `./tmp/file_${Date.now()}.${ext}`;
                fs.writeFileSync(filename, media);

                formData.append('content', text);
                formData.append('model', 'gemini-1.5-flash');
                formData.append('userId', userId);
                formData.append('file', fs.createReadStream(filename));

                const { data } = await axios.post('https://hydrooo.web.id/', formData, {
                    headers: { ...formData.getHeaders() }
                });

                fs.unlinkSync(filename);
                reply(data.result);
            } else {
                formData.append('content', text);
                formData.append('model', 'gemini-1.5-flash');
                formData.append('userId', userId);

                const { data } = await axios.post('https://hydrooo.web.id/', formData, {
                    headers: { ...formData.getHeaders() }
                });

                geminiData[userId].push({ query: text, response: data.result });
                saveSession(geminiData);

                reply(data.result);
            }
        } catch (err) {
            console.error(err);
            reply('An error occurred!');
        }
    }
};