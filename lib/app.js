const express = require('express');
const Superhero = require('./models/Superhero');
const Supervillain = require('./models/Supervillain');
const app = express();

app.use(express.json());

app.post('/superheroes', (req, res, next) => {
  Superhero
    .insert(req.body)
    .then(hero => res.send(hero))
    .catch(next);
});

app.post('/supervillains', (req, res, next) => {
  Supervillain
    .insert(req.body)
    .then(villain => res.send(villain))
    .catch(next);
});

app.get('/superheroes/:id', (req, res, next) => {
  Superhero
    .findById(req.params.id)
    .then(hero => res.send(hero))
    .catch(next);
});

app.get('/supervillains/:id', (req, res, next) => {
  Supervillain
    .findById(req.params.id)
    .then(villain => res.send(villain))
    .catch(next);
});

app.get('/superheroes', (req, res, next) => {
  Superhero
    .find()
    .then(hero => res.send(hero))
    .catch(next);
});

app.get('/supervillains', (req, res, next) => {
  Supervillain
    .find()
    .then(villain => res.send(villain))
    .catch(next);
});

app.put('/superheroes/:id', (req, res, next) => {
  Superhero
    .update(req.params.id, req.body)
    .then(hero => res.send(hero))
    .catch(next);
});

app.put('/supervillains/:id', (req, res, next) => {
  Supervillain
    .update(req.params.id, req.body)
    .then(villain => res.send(villain))
    .catch(next);
});

app.delete('/superheroes/:id', (req, res, next) => {
  Superhero
    .delete(req.params.id)
    .then(hero => res.send(hero))
    .catch(next);
});

app.delete('/supervillains/:id', (req, res, next) => {
  Supervillain
    .delete(req.params.id)
    .then(villain => res.send(villain))
    .catch(next);
});

module.exports = app;
