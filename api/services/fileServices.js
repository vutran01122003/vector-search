const { MongoDBAtlasVectorSearch } = require('langchain/vectorstores/mongodb_atlas');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const instanceDB = require('../dbs/init.database').getInstance();

class FileServices {
    static async uploadFileToAtlas({ docs }) {
        try {
            const collection = instanceDB.getConnection().collection('embeddings');
            await MongoDBAtlasVectorSearch.fromDocuments(
                docs,
                new OpenAIEmbeddings({
                    apiKey: process.env.OPENAI_API_KEY
                }),
                {
                    collection,
                    indexName: 'default',
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

            return Response.json(retrieverOutput);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FileServices;
