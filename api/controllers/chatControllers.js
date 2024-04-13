const { StreamingTextResponse, LangChainStream } = require('ai');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { HumanMessage } = require('langchain/schema');
const ChatServices = require('../services/chatServices');

exports.runtime = 'edge';

class ChatControllers {
    async sendQuestion(req, res, next) {
        try {
            const { question } = req.body;
            const { stream, handlers } = LangChainStream();

            const relatedData = await ChatServices.getRelatedData({ question });

            const TEMPLATE = `
                Context sections:
                ${JSON.stringify(relatedData)}

                Question: """
                ${question}
                """
            `;

            const llm = new ChatOpenAI({
                modelName: 'gpt-3.5-turbo',
                streaming: true,
                openAIApiKey: process.env.OPENAI_API_KEY
            });

            const messages = [new HumanMessage(TEMPLATE)];

            llm.call(messages, {}, [handlers]).catch(console.error);

            const response = new StreamingTextResponse(stream, {
                headers: {
                    'X-RATE-LIMIT': 'lol'
                }
            });

            res.writeHead(response.status, response.headers);

            const reader = response.body.getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                res.write(value);
                await res.flush();
            }

            res.end();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = new ChatControllers();
