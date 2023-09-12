import {Server} from 'socket.io';
import Connection from './database/db.js';
import { getDocument,updateDocument } from './controller/document-controller.js';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const PORT = process.env.PORT || 9000;
const URL = process.env.MONGODB_URI || `mongodb+srv://${username}:${password}@cluster0.wcw4efg.mongodb.net/?retryWrites=true&w=majority`;

Connection(URL);

const app = express();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/dist'));
}

const httpServer = createServer(app);
httpServer.listen(PORT);

const io = new Server(httpServer);


io.on('connection',socket=>{
    
    socket.on('get-document',async (documentId) => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document',document.data);

        socket.on('send-changes',delta=>{
            socket.broadcast.to(documentId).emit('receive-changes',delta);
        });

        socket.on('save-document',async data=>{
            await updateDocument(documentId,data);
        })
    })
});