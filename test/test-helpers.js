const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

function makeUsersArray(){
    return [
        {
          id: 1,
          user_name: 'test-user-1',
          full_name: 'Test user 1',
          title: 'T1',
          location: 'L1',
          content: 'C1',
          password: 'password',
          date_created: '2029-01-22T16:28:32.615Z',
        },
        {
          id: 2,
          user_name: 'test-user-2',
          full_name: 'Test user 2',
          title: 'T2',
          location: 'L2',
          content: 'C2',
          password: 'password',
          date_created: '2029-01-22T16:28:32.615Z',
        },
        {
          id: 3,
          user_name: 'test-user-3',
          full_name: 'Test user 3',
          title: 'T3',
          location: 'L3',
          content: 'C3',
          password: 'password',
          date_created: '2029-01-22T16:28:32.615Z',
        },
        {
          id: 4,
          user_name: 'test-user-4',
          full_name: 'Test user 4',
          title: 'T4',
          location: 'L4',
          content: 'C4',
          password: 'password',
          date_created: '2029-01-22T16:28:32.615Z',
        },
      ]
}

function makeQuestionsArray(users) {
    return [
      {
        id: 1,
        title: 'First test question!',
        tags: ['react', 'node'],
        user_id: users[0].id,
        date_created: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 2,
        title: 'Second test question!',
        tags: ['react', 'node'],
        user_id: users[1].id,
        date_created: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 3,
        title: 'Third test question!',
        tags: ['react', 'node'],
        user_id: users[2].id,
        date_created: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 4,
        title: 'Fourth test question!',
        tags: ['react', 'node'],
        user_id: users[3].id,
        date_created: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
    ]
  }

function makeAnswersArray(users, questions) {
    return [
      {
        id: 1,
        text: 'First test answer!',
        question_id: questions[0].id,
        user_id: users[0].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        text: 'Second test answer!',
        question_id: questions[0].id,
        user_id: users[1].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        text: 'Third test answer!',
        question_id: questions[0].id,
        user_id: users[2].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        text: 'Fourth test answer!',
        question_id: questions[0].id,
        user_id: users[3].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 5,
        text: 'Fifth test answer!',
        question_id: questions[questions.length - 1].id,
        user_id: users[0].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 6,
        text: 'Sixth test answer!',
        question_id: questions[questions.length - 1].id,
        user_id: users[2].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 7,
        text: 'Seventh test answer!',
        question_id: questions[3].id,
        user_id: users[0].id,
        date_created: '2029-01-22T16:28:32.615Z',
      },
    ];
}

function makeExpectedQuestion(users, question, answers=[]) {
    const user = users
      .find(user => user.id === question.user_id)
  
    const questionAnswers = answers
      .filter(ans => ans.question_id === question.id)
  
    let number_of_answers = questionAnswers.length
    
    return {
            id: question.id,
            title: question.title,
            content: question.content,
            tags: question.tags.join(),
            date_created: question.date_created,
            user: {
                id: user.id,
                user_name: user.user_name,
                full_name: user.full_name,
                date_created: user.date_created
            },
            number_of_answers: number_of_answers
    }
  }

function makeExpectedQuestionAnswers(users, questionId, answers) {
    const expectedAnswers = answers
      .filter(ans => ans.question_id === questionId)
    
    return expectedAnswers.map(ans => {
        const ansUser = users.find(user => user.id === ans.user_id)
        return {
                    id: ans.id,
                    text: ans.text,
                    user: {
                        id: ansUser.id,
                        user_name: ansUser.user_name,
                        full_name: ansUser.full_name,
                        date_created: ansUser.date_created
                    },
                    date_created: ans.date_created
                }
    })
}

function makeQuestionsFixtures() {
    const testUsers = makeUsersArray()
    const testQuestions = makeQuestionsArray(testUsers)
    const testAnswers = makeAnswersArray(testUsers, testQuestions)
    return { testUsers, testQuestions, testAnswers }
  }

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
      forum_answers,
      forum_questions,
      forum_users
      RESTART IDENTITY CASCADE;`
    )
  }
  
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }));
  
    return db
      .into('forum_users')
      .insert(preppedUsers);
}
  
function seedQuestionsTables(db, users, questions, answers=[]) {
    return seedUsers(db, users)
      .then(() =>
        db
          .into('forum_questions')
          .insert(questions)
      )
      .then(() =>
        answers.length && db.into('forum_answers').insert(answers)
      )
}
  
function seedMaliciousQuestion(db, user, question) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('forum_questions')
          .insert([question])
      )
}
  
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const payload = {
        user_id: user.id,
        user_name: user.user_name,
        full_name: user.full_name
    }
    const token = jwt.sign(payload, secret, {
      subject: user.user_name,
      expiresIn: process.env.JWT_EXPIRY,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function makeMaliciousQuestion(user) {
    const maliciousQuestion = {
      id: 911,
      date_created: new Date().toISOString(),
      tags: ['very', 'naughty'],
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      user_id: user.id,
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }
    const expectedQuestion = {
      ...makeExpectedQuestion([user], maliciousQuestion),
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
      maliciousQuestion,
      expectedQuestion,
    }
  }

  module.exports = {
      makeUsersArray,
      makeQuestionsArray,
      makeAnswersArray,
      makeQuestionsFixtures,
      
      makeExpectedQuestion,
      makeExpectedQuestionAnswers,
      makeMaliciousQuestion,

      cleanTables,
      seedUsers,
      seedQuestionsTables,
      seedMaliciousQuestion,
      makeAuthHeader
  }