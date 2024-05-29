const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const tesseract = require('tesseract.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());

app.post('/api/solve', (req, res) => {
    const problem = req.body.problem;
    exec(`python -c "from sympy import *; print(simplify('${problem}'))"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        res.json({ solution: stdout });
    });
});

app.post('/api/solve-image', upload.single('image'), (req, res) => {
    const imagePath = path.join(__dirname, req.file.path);
    tesseract.recognize(imagePath, 'eng')
        .then(({ data: { text } }) => {
            exec(`python -c "from sympy import *; print(simplify('${text}'))"`, (error, stdout, stderr) => {
                if (error) {
                    return res.status(500).send(stderr);
                }
                res.json({ solution: stdout });
                fs.unlink(imagePath, () => {});
            });
        })
        .catch(err => {
            res.status(500).send(err.toString());
            fs.unlink(imagePath, () => {});
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
