const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
// const jwt = require('jsonwebtoken')

describe('Answers Endpoints', function() {
  let db

  const { testUsers, testQuestions } = helpers.makeQuestionsFixtures()

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

  describe(`POST /api/answers`, () => {
    beforeEach('insert questions', () => 
        helpers.seedQuestionsTables(
            db,
            testUsers,
            testQuestions
        )
    )

    it(`creates answer and responds with 201 and the new answer`, function() {
      this.retries(3)
      const testQuestion = testQuestions[0]
      const testUser = testUsers[0]
      const newAnswer = {
        text: 'new answer',
        question_id: testQuestion.id,
        user_id: testUser.id,
      }

      return supertest(app)
        .post('/api/answers')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newAnswer)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newAnswer.text)
          expect(res.body.question_id).to.eql(newAnswer.question_id)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/answers/${res.body.id}`)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('forum_answers')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newAnswer.text)
              expect(row.question_id).to.eql(newAnswer.question_id)
              expect(row.user_id).to.eql(newAnswer.user_id)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const fields = ['question_id', 'text']
    fields.forEach(field => {
        const testQuestion = testQuestions[0]
        const testUser = testUsers[0]
        const newAnswer = {
            'text': 'new answer',
            'user_id': testUser.id,
            'question_id': testQuestion.id,
        }

        it(`responds 400 with an error message when '${field}' is missing`, () => {
            delete newAnswer[field]
            return supertest(app)
              .post('/api/answers')
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .send(newAnswer)
              .expect(400, { error: `Missing ${field} in request body` })
        })
    })
  })
})
