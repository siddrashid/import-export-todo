const express = require("express");
const app = express();
const path = require("path");

// create views directory and set view engine = ejs
app.set('view engine', 'ejs');
// get views directory path
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/download', (req, res) => {
    const fileName = 'Resume.pdf';
    const filePath = __dirname + '/public/' + fileName;
    res.download(filePath);
})

// listening port for app
app.listen(3000, () => {
    console.log("[upload-download-files] Listening on port 3000...");
})