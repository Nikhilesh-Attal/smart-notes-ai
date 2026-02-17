import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import storeDocumentRouter from './routers/storeDocumentRoutes';
import queryDocumentRouter from './routers/queryDocumentRoutes';
const app = express();

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use('/store-document', storeDocumentRouter);
app.use('/query-document', queryDocumentRouter);

export default app;