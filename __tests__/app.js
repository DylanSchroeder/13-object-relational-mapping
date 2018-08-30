'use strict';

const request = require('supertest');
import app from '../src/app';
import Hero from '../src/models/hero';

const mongoConnect = require('../src/util/mongo-connect');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/401-2018-notes';


describe('app', () => {
  beforeAll(()=> {
    return mongoConnect(MONGODB_URI);
  });

  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
  it('responds with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
  it('responds with HTML for /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response => {
        expect(response.text[0]).toBe('<');
      });
  });

  it('responds with HTML for /cowsay?text={message}', ()=>{
    return request(app)
      .get('/cowsay?text=test')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text).toBeDefined();
        expect(response.text).toMatch('<html>');
        expect(response.text).toMatch(' test ');
        expect(response.text).toMatch('</html>');
      });
  });

  it('responds with JSON for /api/cowsay?text={message}', ()=>{
    return request(app)
      .get('/api/cowsay?text=this is a test, ok')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(response =>{
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch(' this is a test, ok ');
      });
  });

  describe('api routes', ()=> {
    it('can get /api/heroes', ()=> {
      var heroes = [
        new Hero({ name: 'Batman', universe: 'DC', power: 'rich'}),
        new Hero({ name: 'Thor', universe: 'Marvel', power: 'lightning'}),
      ];

      return Promise.all(
        heroes.map(hero => hero.save())
      ).then(savedHeroes => {
        return request(app)
          .get('/api/heroes')
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(({ body }) => {
            expect(body.length).toBeGreaterThanOrEqual(savedHeroes.length);

            savedHeroes.forEach(savedHero => {
              expect(body.find(hero => hero._id === savedHero._id.toString())).toBeDefined();
            });
          });
      });
    });
    // it('can get /api/heroes/:id', ()=> {
    //   var hero = new Hero({ name: 'hero', universe: 'with', power: 'an id'});

    //   return hero.save()
    //     .then(saved => {
    //       return request(app)
    //         .get(`/api/heroes/${saved.id}`)
    //         .expect(200)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         .expect(saved);
    //     });
    // });

    it('can POST /api/heroes to create hero', () => {
      return request(app)
        .post('/api/heroes')
        .send({ name: 'Batman', universe: 'DC', power: 'rich' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body._id).toBeDefined();
          expect(response.body.name).toBe('Batman');
          expect(response.body.universe).toBe('DC');
          expect(response.body.power).toBe('rich');
        });
    });
  });

});