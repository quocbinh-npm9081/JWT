const dotenv = require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser')
const cors = require('cors')
const db = require('./config/mongoDb');
const routers = require('./routers/index');
const AuthControllers = require('./controllers/AuthControllers');

app.use(cors())
app.use(cookieParser())
app.use(express.json())

db.connect();

routers(app);

//AUTHENTICATION

//AUTHORIZATION

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})