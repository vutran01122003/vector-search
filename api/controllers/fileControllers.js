const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const FileServices = require('../services/fileServices');

class FileControllers {
    async uploadFile(req, res, next) {
        try {
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 50
            });

            for (let i = 0; i < req.files.length; i++) {
                const loader = new PDFLoader(new Blob([req.files[0].buffer]));
                const docs = await loader.load();

                const processedDocs = docs.map((doc) => ({
                    ...doc,
                    pageContent: doc.pageContent.replace(/\n|\s{3,}/g, '')
                }));

                const splitDocs = await textSplitter.splitDocuments(processedDocs);
                await FileServices.uploadFileToAtlas({ docs: splitDocs });
            }

            res.status(201).send({
                code: 201,
                message: 'File uploaded successfully',
                metadata: null
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = new FileControllers();
