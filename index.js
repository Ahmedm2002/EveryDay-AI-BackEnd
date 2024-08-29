const express = require('express');
const { Server } = require("socket.io");
const app = express();
const {createServer} = require('node:http')
require('dotenv').config();

const server = createServer(app);

const io = new Server(server)

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.APIKey);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(express.json());

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('userMsg', async (msg)=>{
    console.log(`User Prompt: ${msg}`);

    try {
      const botResponse = await model.generateContent(msg);
      const result = botResponse.response.text();
      socket.emit(`Result: ${result}`)
    } catch (error) {
      socket.emit(`Error Occured: ${error.message}`)
    }
    
    socket.on('disconnect', () => {
      console.log(`User Disconnected`);
    })
  })
})


app.post('/' , async (req, res) => {

  const { userMsg } = req.body;
  
  if(!userMsg){    
    res.status(400).json({message : "No query present"})
  }

  try {
    const botResponse = await model.generateContent(userMsg);
    const result = botResponse.response.text();
    res.status(200).json({AiMsg : result})  
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

const port = 3000

app.listen(port, () => {
  console.log(`
    ==================
    ==================
    = Server Started =
    ==================
    ==================
    === Port  ${port} ===
    ==================
    ==================
  `);
});
