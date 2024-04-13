const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { MongoDBAtlasVectorSearch } = require('langchain/vectorstores/mongodb_atlas');
const instanceDB = require('../dbs/init.database').getInstance();

class ChatServices {
    static async getRelatedData({ question }) {
        try {
            const collection = instanceDB.getConnection().collection('embeddings');
            const vectorStore = new MongoDBAtlasVectorSearch(
                new OpenAIEmbeddings({
                    modelName: 'text-embedding-ada-002',
                    stripNewLines: true,
                    openAIApiKey: process.env.OPENAI_API_KEY
                }),
                {
                    collection,
                    indexName: 'vector_index',
                    textKey: 'text',
                    embeddingKey: 'embedding'
                }
            );

            const retriever = vectorStore.asRetriever({
                searchType: 'mmr',
                searchKwargs: {
                    fetchK: 20,
                    lambda: 0.1
                }
            });

            const retrieverOutput = await retriever.getRelevantDocuments(question);

            return retrieverOutput;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ChatServices;
