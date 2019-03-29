const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Questions Endpoints', () => {
  let db
  const {testUsers, testQuestions, testAnswers} = helpers.makeQuestionsFixtures()

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

  describe('GET /api/questions', () => {
    context('Given no questions', () => {
      it('responds with 200 and empty list', () => {
        return supertest(app)
          .get('/api/questions')
          .expect(200, [])
      })
    })

    context('Given there are questions in the database', () => {
      beforeEach('insert questions', () =>
        helpers.seedQuestionsTables(
          db,
          testUsers,
          testQuestions,
          testAnswers,
        )
      )

      it('responds with 200 and all of the questions', () => {
        const expectedQuestions = testQuestions.map(question =>
          helpers.makeExpectedQuestion(
            testUsers,
            question,
            testAnswers,
          )
        )
        return supertest(app)
          .get('/api/questions')
          .expect(200, expectedQuestions)
      })
    })

    context(`Given an XSS attack question`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousQuestion,
        expectedQuestion,
      } = helpers.makeMaliciousQuestion(testUser)

      beforeEach('insert malicious question', () => {
        return helpers.seedMaliciousQuestion(
          db,
          testUser,
          maliciousQuestion,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/questions`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedQuestion.title)
            expect(res.body[0].content).to.eql(expectedQuestion.content)
          })
      })
    })
  })

  describe(`GET /api/questions/:question_id`, () => {
    context(`Given no questions`, () => {
      beforeEach('insert users',() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const questionId = 123456
        return supertest(app)
          .get(`/api/questions/${questionId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Question doesn't exist` })
      })
    })

    context('Given there are questions in the database', () => {
      beforeEach('insert questions', () =>
        helpers.seedQuestionsTables(
          db,
          testUsers,
          testQuestions,
          testAnswers,
        )
      )

      it('responds with 200 and the specified question', () => {
        const questionId = 2
        const expectedQuestion = helpers.makeExpectedQuestion(
          testUsers,
          testQuestions[questionId - 1],
          testAnswers,
        )

        return supertest(app)
          .get(`/api/questions/${questionId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedQuestion)
      })
    })

    context(`Given an XSS attack question`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousQuestion,
        expectedQuestion,
      } = helpers.makeMaliciousQuestion(testUser)

      beforeEach('insert malicious question', () => {
        return helpers.seedMaliciousQuestion(
          db,
          testUser,
          maliciousQuestion,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/questions/${maliciousQuestion.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedQuestion.title)
            expect(res.body.content).to.eql(expectedQuestion.content)
          })
      })
    })
  })
})