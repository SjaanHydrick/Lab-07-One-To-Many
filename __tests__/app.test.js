const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Superhero = require('../lib/models/Superhero');
const Supervillain = require('../lib/models/Supervillain');
const pool = require('../lib/utils/pool');

describe('app endpoint', () => {
  beforeAll(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../setup.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
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
      { 
        alias: 'N/A',
        name: 'Lex Luthor',
        powers: 'Money',
        superheroId: superman.id
      },
      { 
        alias: 'Brainiac',
        name: 'Vril Dox',
        powers: 'Cybernetic',
        superheroId: superman.id
      }].map(villain => Supervillain.insert(villain)));

    const res = await request(app)
      .get(`/superheroes/${superman.id}`);

    expect(res.body).toEqual({
      ...superman,
      supervillains: expect.arrayContaining(villains)
    });
  });

  it('finds a supervillain by id', async() => {
    const data = await request(app)
      .get('/supervillains/1');

    expect(data.body).toEqual({
      id: '1',
      alias: 'Joker',
      name: 'Unknown',
      powers: 'Insanity',
      superheroId: '1'
    });
  });

  it('finds all superheroes via GET', async() => {
    const heroes = await Promise.all([
      {
        alias: 'Wonder Woman',
        name: 'Diana Prince',
        powers: 'Truth',
        city: 'Themyscira'
      },
      {
        alias: 'Aquaman',
        name: 'Arthur Curry',
        powers: 'Fishy prowess',
        city: 'Atlantis'
      }
    ].map(hero => Superhero.insert(hero)));

    const res = await request(app)
      .get('/superheroes');

    expect(res.body).toEqual([
      {
        id: '1',
        alias: 'Batman',
        name: 'Bruce Wayne',
        powers: 'Money',
        city: 'Gotham City'
      },
      {
        id: '2',
        alias: 'Superman/Clark Kent',
        name: 'Kal-El',
        powers: 'Supereverything',
        city: 'Metropolis'
      },
      ...heroes]);
    expect(res.body).toHaveLength(4);
  });

  it('finds all supervillains via GET', async() => {
    const res = await request(app)
      .get('/supervillains');

    expect(res.body).toEqual([
      {
        id: '1',
        alias: 'Joker',
        name: 'Unknown',
        powers: 'Insanity',
        superheroId: '1'
      },
      {
        id: '2',
        alias: 'N/A',
        name: 'Lex Luthor',
        powers: 'Money',
        superheroId: '2'
      },
      {
        id: '3',
        alias: 'Brainiac',
        name: 'Vril Dox',
        powers: 'Cybernetic',
        superheroId: '2'
      }
    ]);
  });

  it('updates a superhero via PUT', async() => {
    const flash = await Superhero.insert({
      alias: 'Flash',
      name: 'Jay Garrick',
      powers: 'Zoomy',
      city: 'Keystone City'
    });

    const res = await request(app)
      .put(`/superheroes/${flash.id}`)
      .send({
        alias: 'Flash',
        name: 'Barry Allen',
        powers: 'Zoomy',
        city: 'Central City'
      });

    expect(res.body).toEqual({
      id: flash.id,
      alias: 'Flash',
      name: 'Barry Allen',
      powers: 'Zoomy',
      city: 'Central City'
    });
  });

  it('updates a supervillain via PUT', async() => {
    const firefly = await Supervillain.insert({
      alias: 'Firefly',
      name: 'Ted Carson',
      powers: 'Burny',
      superheroId: '1'
    });
  
    const res = await request(app)
      .put(`/supervillains/${firefly.id}`)
      .send({
        alias: 'Firefly',
        name: 'Garfield Lynns',
        powers: 'Burny',
        superheroId: '1'
      });
  
    expect(res.body).toEqual({
      id: '1',
      alias: 'Firefly',
      name: 'Garfield Lynns',
      powers: 'Burny',
      superheroId: '1'
    });
  });

  it('deletes a superhero via DELETE', async() => {
    const cyborg = await Superhero.insert({
      alias: 'Cyborg',
      name: 'Victor Stone',
      powers: 'Is A Cyborg',
      city: 'Many'
    });

    const res = await request(app)
      .delete(`/superheroes/${cyborg.id}`);

    expect(res.body).toEqual(cyborg);
  });

  it('deletes a supervillain via DELETE', async() => {
    const scarecrow = await Supervillain.insert({
      alias: 'Scarecrow',
      name: 'Dr. Jonathan Crane',
      powers: 'Spooks',
      superheroId: '1'
    });

    const res = await request(app)
      .delete(`/supervillains/${scarecrow.id}`);

    expect(res.body).toEqual(scarecrow);
  });

});
