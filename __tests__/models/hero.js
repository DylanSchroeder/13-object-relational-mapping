'use strict';
import Hero from '../../src/models/hero';
const mongoConnect = require('../../src/util/mongo-connect');
const MONGODB_URI = process.env.MONGODB_URI ||'mongodb://localhost/401-2018-notes';

describe('hero model', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });

  it('can save a hero', () => {
    let hero = new Hero({
      name: 'Blue Beetle',
      universe: 'DC',
      power: 'scarab',
    });

    return hero.save()
      .then(saved => {
        expect(saved.name).toBe('Blue Beetle');
        expect(saved.universe).toBe('DC');
        expect(saved.power).toBe('scarab');
      });
  });

  it('fails if no name is provided', () => {
    let hero = new Hero({
    });

    return expect(hero.save())
      .rejects.toBeDefined();
  });
});