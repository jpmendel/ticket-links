const express = require('express');
const app = express();
const port = 8000;

app.set('view engine', () => 'ejs');
app.set('views', () => `${__dirname}/templates`);

app.get('/home', (req, res) => {});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
