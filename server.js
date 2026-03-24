import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Front-end Build файлуудыг сервэр дээрээс дуудах (Render-д deploy хийхэд зориулав)
app.use(express.static(path.join(__dirname, 'dist')));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const DB_FILE = './flowchart-db.json';

// Өгөгдлийн сангаас (\`flowchart-db.json\`) ачааллах
let storedData = { nodes: null, edges: null };
if (fs.existsSync(DB_FILE)) {
  try {
    storedData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error("Өгөгдлийг уншихад алдаа гарлаа:", e);
  }
}

const saveToDb = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(storedData, null, 2));
};

io.on('connection', (socket) => {
  console.log('Хэрэглэгч холбогдлоо:', socket.id);

  // Шинээр холбогдсон хэрэглэгч рүү одоогийн датаг явуулах
  if (storedData.nodes && storedData.edges) {
    socket.emit('init', storedData);
  }

  // Нодын (алхмын) өөрчлөлтийг сонсох
  socket.on('updateNodes', (nodes) => {
    storedData.nodes = nodes;
    socket.broadcast.emit('updateNodes', nodes); // Бусад холбогдсон бүх хэрэглэгчид рүү дамжуулах
    saveToDb();
  });

  // Холбоосны өөрчлөлтийг сонсох
  socket.on('updateEdges', (edges) => {
    storedData.edges = edges;
    socket.broadcast.emit('updateEdges', edges); // Бусад холбогдсон бүх хэрэглэгчид рүү дамжуулах
    saveToDb();
  });

  socket.on('reset', () => {
    storedData = { nodes: null, edges: null };
    saveToDb();
    socket.broadcast.emit('reset');
  });

  socket.on('disconnect', () => {
    console.log('Хэрэглэгч саллаа:', socket.id);
  });
});

// React-Route ашиглаж байгаа бол хуудас шилжих үед 404 өгөхөөс сэргийлэх
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер ${PORT} порт дээр аслаа. (Асаалттай: UI болон WebSocket)`);
});
