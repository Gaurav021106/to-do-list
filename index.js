const express = require('express');
const app = express();
const port = 3000 ;
const path = require('path');

const fs = require('fs');

app.set('view engine' ,'ejs')
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  fs.readdir('./files', (err, fileNames) => {
    if (err) return res.status(500).send('Unable to scan directory');

    const files = fileNames.map(name => ({
      filename: name,
      content: fs.readFileSync(path.join(__dirname, 'files', name), 'utf-8')
    }));

    res.render('index', { files });
  });
});

app.post('/create' ,(req,res)=>{
    const { Task , Details} = req.body;
    const filename = Task.replace(/\s+/g, '_').toLowerCase() + '.txt';
    const content = `Task: ${Task}\nDetails: ${Details}`;
    fs.writeFile(path.join(__dirname,'files', filename), content, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('File created successfully');
        res.redirect('/');
    });
})
app.listen(port,()=>{
    console.log(`server is running at the port ${port}`);
})