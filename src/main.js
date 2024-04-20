const express = require('express');

const app = express();
const port = 8000;

app.set('views', () => `${__dirname}/templates`);

app.get('/', (req, res) => {
  res.render('home_page.html');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
