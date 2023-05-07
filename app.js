//app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const signupRouter = require('./routers/signupRouter');
const loginRouter = require('./routers/loginRouter');
const resendEmailRouter = require('./routers/resendEmailRouter')
const verifyEmailRouter = require('./routers/verifyEmailRouter')
const exchangeRouter = require('./routers/exchangeRouter');
const logoutRouter = require('./routers/logoutRouter');

const app = express();

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Static files and views
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// Routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/resend-email', resendEmailRouter);
app.use('/verify-email', verifyEmailRouter);
app.use('/exchange', exchangeRouter);
app.use('/logout', logoutRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});