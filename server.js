import express from "express";

const app = express();
const port = 3000;

// Healthcheck
app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});