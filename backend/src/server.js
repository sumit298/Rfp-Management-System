import express from 'express';
import {createServer} from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const server = createServer();


//Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const port = process.env.PORT || 5500

server.listen(port, ()=> console.log(`Server up and running on ${port}`));
