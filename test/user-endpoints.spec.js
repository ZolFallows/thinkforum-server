const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Questions Endpoints', () => {
  let db
  const { testUsers } = helpers.makeQuestionsFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))


  describe(`POST /api/user`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers)
      )

      const requiredFields = ['user_name', 'password', 'full_name']

        requiredFields.forEach(field => {
            const registerAttemptBody = {
            user_name: 'test user_name',
            password: 'test password',
            full_name: 'test full_name'
            }

            it(`responds with 400 required error when ${field} is missing`, () => {
            delete registerAttemptBody[field]

            return supertest(app)
                .post('/api/user')
                .send(registerAttemptBody)
                .expect(400, { error: `Missing ${field} in request body` })
            })
        })

        it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
          const userShortPassword = {
            user_name: 'test user_name',
            password: '1234567',
            full_name: 'test full_name',
          }
          return supertest(app)
            .post('/api/user')
            .send(userShortPassword)
            .expect(400, { error: `Password be 8 characters or more` })
        })

        it(`responds 400 'Password be less than 72 characters' when long password`, () => {
            const userLongPassword = {
                user_name: 'test user_name',
                password: '*'.repeat(73),
                full_name: 'test full_name',
            }

            return supertest(app)
                .post('/api/user')
                .send(userLongPassword)
                .expect(400, { error: `Password be 72 characters or less` })
        })

        it(`responds 400 error when password starts wuth spaces`, () => {
            const userPasswordStartsSpaces = {
                user_name: 'test user_name',
                password: ' 1Aa!2Bb@',
                full_name: 'test user_name',
            }

            return supertest(app)
                .post('/api/user')
                .send(userPasswordStartsSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password ends wuth spaces`, () => {
            const userPasswordEndsSpaces = {
                user_name: 'test user_name',
                password: '1Aa!2Bb@ ',
                full_name: 'test user_name',
            }

            return supertest(app)
                .post('/api/user')
                .send(userPasswordEndsSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password is not complex enough`, () => {
            const passwordNotComplex = {
                user_name: 'test user_name',
                password: '11SjgdfsgfWn',
                full_name: 'test user_name',
            }

            return supertest(app)
                .post('/api/user')
                .send(passwordNotComplex)
                .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
        })

        it(`responds 400 'User_name already taken' when user_name is not unique`, () => {
            const duplicatedUser = {
                user_name: testUser.user_name,
                password: '11SjHdSW$n',
                full_name: 'test user_name',
            }

            return supertest(app)
                .post('/api/user')
                .send(duplicatedUser)
                .expect(400, { error: `Username already taken` })
        })
    })
  })

  describe('GET /api/user/:user_id', () => {
    beforeEach('Insert users', () => helpers.seedUsers(db, testUsers))
      context('Given no user', () => {

        it('reponds with 404', () => {
            const userId = 12345
            return supertest(app)
                .get(`/api/user/${userId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, { error: "User doesn't exist" })
        })
      })

      context('Given there are users in database', () => {
         it('responds with 200 and the specified user', () => {
             const userId = 4
             const expectedUser = testUsers[userId - 1]
             delete expectedUser['password']
             return supertest(app)
                .get(`/api/user/${userId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedUser)
         })
      })

  })
})