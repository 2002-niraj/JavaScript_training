const express = require('express');
const app = express();

const Routes = require('./routes/event-routes'); 

app.use('/profile', express.static('uploads'));

app.use(express.json());
 
app.use(Routes)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });


