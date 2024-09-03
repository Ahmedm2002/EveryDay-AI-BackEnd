const express = require('express');
const { createServer } = require('node:http')
const { Server } = require('socket.io');
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const genAI = new GoogleGenerativeAI(process.env.APIKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

app.use(cors(corsOptions));


const server = createServer(app)


const io = new Server(server, {
  cors:{
    origin: "*",
    optionsSuccessStatus: 200,
  }
})


io.on('connection', (socket) =>{

  socket.on('userMsg', async(message)=>{
    
    console.log(`UserMsg: ${message}`);
    

    try {
    
      const botResult = await model.generateContent(message);
    
      const result = botResult.response.text();
    
      console.log(`Result: ${result}`);
      

      io.emit("result", result);
    
    } catch (error) {
    
      console.log(`Error: ${error}`);


      io.emit("result", error.message)
    
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