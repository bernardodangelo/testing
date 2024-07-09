const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Substitua pelo URL do MongoDB Atlas com a senha fornecida
const mongoURI = 'mongodb+srv://bernardodangelo8:eygT8jfIc4UocBIo@bernardodangelo.loralai.mongodb.net/?retryWrites=true&w=majority&appName=bernardodangelo';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const VoteSchema = new mongoose.Schema({
    name: String,
    email: String,
    restaurant: String,
    ip: String,
    timestamp: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', VoteSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname));

app.post('/submit', async (req, res) => {
    const { name, email, restaurant } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const cookieName = 'voteSubmitted';

    if (!name || !email || !restaurant) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    if (req.cookies[cookieName]) {
        return res.status(400).send('Você já enviou um voto.');
    }

    const existingVote = await Vote.findOne({ ip: ip });
    if (existingVote) {
        return res.status(400).send('Este IP já enviou um voto.');
    }

    const newVote = new Vote({ name, email, restaurant, ip });
    await newVote.save();

    res.cookie(cookieName, 'true', { maxAge: 86400000 }); // 24 horas

    res.status(200).send('Dados recebidos com sucesso.');
});

app.get('/ranking', async (req, res) => {
    const votes = await Vote.find();

    let voteCounts = {};

    votes.forEach(vote => {
        if (voteCounts[vote.restaurant]) {
            voteCounts[vote.restaurant]++;
        } else {
            voteCounts[vote.restaurant] = 1;
        }
    });

    let ranking = Object.keys(voteCounts).map(restaurant => {
        return { restaurant: restaurant, votes: voteCounts[restaurant] };
    });

    ranking.sort((a, b) => b.votes - a.votes);

    res.status(200).json(ranking);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
