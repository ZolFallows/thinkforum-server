'use strict';

const knex = require('knex')
const app  = require('../src/app')
const helpers  = require('./test-helpers')
const jwt = require('jsonwebtoken')



describe('Auth endpoints', () => {
    let db
  
    const { testUsers } = helpers.makeQuestionsFixtures()
    const testUser = testUsers[0]
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      });
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('POST /api/auth/signin', () => {
        beforeEach('insert users', () => {
          return helpers.seedUsers(db, testUsers);
        })
    
        const fields = ['user_name', 'password'];
    
        fields.forEach(field => {
          const signinAttemptBody ={
            user_name: testUser.user_name,
            password: testUser.password
          }
    
          it(`responds 400 with required error when '${field}' is missing`, () => {
            delete signinAttemptBody[field];
    
            return supertest(app)
              .post('/api/auth/signin')
              .send(signinAttemptBody)
              .expect(400, {
                error: `Missing ${field} in request body`,
              })
          })
        })


        it('responds 400 with invalid user_name or password when bad user_name', () => {
          const invalidUsername = { user_name: 'badname', password: 'exist'}
    
          return supertest(app)
            .post('/api/auth/signin')
            .send(invalidUsername)
            .expect(400, {
              error: 'Incorrect user_name or password',
            })
        })
    
        it('responds 400 \'invalid user_name or password\' when bad password', () => {
          const invalidPassword = {user_name: testUser.user_name, password: 'incorrect'};
    
          return supertest(app)
            .post('/api/auth/signin')
            .send(invalidPassword)
            .expect(400, {
              error: 'Incorrect user_name or password'
            });
        })
    
        it('responds 200 and JWT auth token using secret when valid credentials', () => {
          const userValid = {
            user_name: testUser.user_name,
            password: testUser.password
          }

          const payload = {
            user_id: testUser.id,
            user_name: testUser.user_name,
            full_name: testUser.full_name
          }
          const expectedToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {
              subject: testUser.user_name, 
              expiresIn: process.env.JWT_EXPIRY,
              algorithm: 'HS256'}
            )
          
          return supertest(app)
            .post('/api/auth/signin')
            .send(userValid)
            .expect(200, {authToken: expectedToken});        
        })
    })

    describe(`POST /api/auth/refresh`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
  
       it(`responds 200 and JWT auth token using secret`, () => {
        const payload = {
          user_id: testUser.id,
          user_name: testUser.user_name,
          full_name: testUser.full_name
        }
        const expectedToken = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256',
          }
        )
        return supertest(app)
          .post('/api/auth/refresh')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, { authToken: expectedToken })
      })
    })
})