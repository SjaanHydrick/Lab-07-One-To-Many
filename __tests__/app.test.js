const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Superhero = require('../lib/models/Superhero')
const Supervillain = require('../lib/models/Supervillain');
const pool = require('../lib/utils/pool');

describe('app endpoint', () => {
  beforeAll(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../setup.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end()
  });

  it('creates a new hero via POST', async() => {
    const res = await request(app)
      .post('/superheroes')
      .send({
        alias: 'Batman',
        name: 'Bruce Wayne',
        powers: 'Money',
        city: 'Gotham City'
      });

    expect(res.body).toEqual({
      id: '1',
      alias: 'Batman',
      name: 'Bruce Wayne',
      powers: 'Money',
      city: 'Gotham City'
    });
  });

  it('creates a new villain via POST', async() => {
    const res = await request(app)
      .post('/supervillains')
      .send({
        alias: 'Joker',
        name: 'Unknown',
        powers: 'Insanity',
        superheroId: '1'
      });

    expect(res.body).toEqual({
      id: '1',
      alias: 'Joker',
      name: 'Unknown',
      powers: 'Insanity',
      superheroId: '1'
    });
  });

  it('finds a superhero by id and associated supervillains via GET', async() => {
    const superman = await Superhero.insert({
      alias: 'Superman/Clark Kent',
      name: 'Kal-El',
      powers: 'Supereverything',
      city: 'Metropolis'
    });

    const villains = await Promise.all([
      { alias: 'N/A',
        name: 'Lex Luthor',
        powers: 'Money',
        superheroId: superman.id
      },
      { alias: 'Brainiac',
        name: 'Vril Dox',
        powers: 'Cybernetic',
        superheroId: superman.id
      },
      {
        alias: 'General Zod',
        name: 'Dru-Zod',
        powers: 'Rage',
        superheroId: superman.id
      }].map(villain => Supervillain.insert(villain)));

    const res = await request(app)
      .get(`/superheroes/${superman.id}`);

    expect(res.body).toEqual({
      ...superman,
      supervillains: expect.arrayContaining(villains)
    });
  });

});

