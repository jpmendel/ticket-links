const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'templates/'));
app.use('/static', express.static(path.join(__dirname, 'static/')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
