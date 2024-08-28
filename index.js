const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.APIKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


console.log(genAI);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`
    ==================
    = Server Running =
    ==================
    ==================
    === Port  3000 ===
    ==================
    `)
})

