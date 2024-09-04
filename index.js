const express = require('express');
const { createServer } = require('node:http')
const { Server } = require('socket.io');
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.APIKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));


const server = createServer(app)


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})


io.on('connection', (socket) =>{

  socket.on('userMsg', async(message)=>{
    

    try {
    
      const botResult = await model.generateContent(message);
      const result = botResult.response.text();
      socket.emit("result", result);
    
    } catch (error) {
      socket.emit("result", error.message)
    }
  })
})

const port = 3000;
server.listen(port , () => {

  console.log(`
    =====================
    == Server Started  ==
    =====================
    ==== Port ${port}  =====
    =====================
    =====================
    `);
})