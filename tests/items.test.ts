import supertest from 'supertest';
import {prisma} from '../src/database';
import app from '../src/app';
import itemFactory from './factories/itemFactory';


beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item novo no formato correto', async () => {

    const body = await itemFactory();

    const result = await supertest(app).post('/items').send(body);
    const status = result.status;

    expect(status).toBe(201);
  });
  
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {

    const body = await itemFactory();

    const firstInsertion = await supertest(app).post('/items').send(body);
    const secondInsertion = await supertest(app).post('/items').send(body);
    const status = secondInsertion.status;

    expect(status).toEqual(409);
  });

});


describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get('/items');
    const status = result.status;
    const body = result.body;
    expect(status).toEqual(200);
    expect(body).toBeInstanceOf(Array);
  });

});


describe('Testa GET /items/:id ', () => {

  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {

    const body = await itemFactory();

    const createItem = await supertest(app).post('/items').send(body);
    const newItem = createItem.body;

    const result = await supertest(app).get(`/items/${newItem.id}`);

    expect(result.status).toEqual(200);
    expect(result.body).toMatchObject(newItem);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get('/items/99999');
    const status = result.status;

    expect(status).toBe(404);
  });
});
