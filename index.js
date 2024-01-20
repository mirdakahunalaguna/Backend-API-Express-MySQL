import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import UserRoute from "./routes/UserRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://192.168.1.6:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use(UserRoute);

app.listen(5000, () => console.log('Server up and running...'));
