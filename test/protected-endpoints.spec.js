'use strict';
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function(){
  let db

  const { testUsers, testQuestions, testAnswers } = helpers.makeQuestionsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert things', () => 
    helpers.seedQuestionsTables(db, testUsers, testQuestions, testAnswers)
  )

  const protectedEndpoints = [
    {
        name: 'GET /api/questions/:question_id',
        path: '/api/questions/:question_id',
        method: supertest(app).get,
    },    
    {
        name:' GET /api/user/:user_id',
        path: '/api/user/:user_id',
        method: supertest(app).get,
    },
    {
        name:' Patch /api/user/:user_id',
        path: '/api/user/:user_id',
        method: supertest(app).patch,
    },
    {
        name: 'POST /api/answers',
        path: '/api/answers',
        method: supertest(app).post,
    },
    {
        name: 'POST /api/auth/refresh',
        path: '/api/auth/refresh',
        method: supertest(app).post,
    }
  ]

  

  protectedEndpoints.forEach(endpoint => {
    describe.only(endpoint.name, () => {

      it('responds 401 Missing bearer token when no bearer token', () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: 'Missing bearer token' });
      })
  
      it('responds 401 Unauthorized request when invalid JWT secret', () => {
        const validUser = testUsers[0];
        const invalidSecret = 'badSecret';
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: 'Unauthorized request' });
      })
  
      it('responds 401 Unauthorized request when invalid sub in payload', () => {
        const invalidUser = { user_name: 'notUser', id: 1, full_name: 'not user' };
        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' });
      })
    })
  })
})