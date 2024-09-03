const express = require('express');
const { createServer } = require('node:http')
const  path  = require('node:path')
const { Server } = require('socket.io');

const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI('AIzaSyCWD8R-irLSB8wFkiLR8d5NkA3xqZVYdQg');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

app.use(express.static('public'))

const server = createServer(app)

const io = new Server(server);

io.on('connection', (socket) =>{

  socket.on('userMsg', async(message)=>{
    try {
      const botResult = await model.generateContent(message);
      const result = botResult.response.text();
      io.emit("result", result);
    } catch (error) {
      io.emit("result", error.message)
    }
  })
})



app.get('/', async(req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));  
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});



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