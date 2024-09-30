const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const jobRoutes = require('./routes/jobRoutes');
const connectDB = require('./config/db')


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

// Routes
connectDB();
app.use('/jobs', jobRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
 