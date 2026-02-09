export default class Gethonis {
    constructor(token, elementId, baseUrl = '') {
        this.token = token;
        this.elementId = elementId;
        this.baseUrl = baseUrl;
    }

    async gethonis(type, dict, stream = false) {
        const models = [
            '/api/gethonis',
            '/api/openai',
            '/api/grok',
            '/api/deepseek'
        ];

        const payload = {
            headers: this.token,
            messages: dict,
            stream
        };

        const res = await fetch(this.baseUrl + models[type], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        this.parseContent(data);
    }

    parseContent(responseText) {
        if (typeof window !== 'undefined') {
            const el = document.getElementById(this.elementId);
            if (el) el.textContent = responseText;
        }
    }
}
