const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/', (request, response) => {
    return response.sendFile(__dirname + '/public/index.html');
})

app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`));