const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts.routes');
require('dotenv').config();
const mongoose = require('mongoose');
const subscriptionRoute = require('./routes/subscription.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/posts', postsRoutes)
app.use('/subscription', subscriptionRoute);

app.listen(PORT, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
})

/* die folgende Verbindung brauchen wir gar nicht, wird jeweils bei Bedarf erzeugt (mongoose) */
//=> Meine Anwendung braucht das definitiv
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => console.log('connected to BD')
    ).catch(
    err => console.error(err, 'connection error')
)

const db = mongoose.connection;