const xss = require('xss')
const Treeize = require('treeize')

const userFields = [
    'usr.id AS user:id',
    'usr.user_name AS user:user_name',
    'usr.full_name AS user:full_name',
    'usr.date_created AS user:date_created',
  ]

const QuestionsService = {
    getAllQuestions(db) {
        // return db.select('*').from('forum_questions')
        return db
            .from('forum_questions AS qs')
            .select(
                'qs.id',
                'qs.title',
                'qs.content',
                'qs.date_created',
                'qs.tags',
                ...userFields,
                db.raw(`count(DISTINCT ans) AS number_of_answers`)
            )
            .leftJoin(
                'forum_answers AS ans',
                'qs.id',
                'ans.question_id'
            )
            .leftJoin(
                'forum_users AS usr',
                'qs.user_id',
                'usr.id'
            )
            .groupBy('qs.id', 'usr.id')
    },

    getById(db, id){
        return QuestionsService
            .getAllQuestions(db)
            .where('qs.id', id)
            .first()
    },

    inserQuestion(db, newQuestion){
        return db
            .insert(newQuestion)
            .into('forum_questions')
            .returning('*')
            .then(([question]) => question)
            .then(question => QuestionsService.getById(db, question.id))
    },

    deleteQuestion(db, id){
        return db('forum_questions')
            .where({id})
            .delete()
    },

    getAnswersForQuestion(db, question_id){
        return db
            .from('forum_answers AS ans')
            .select(
                'ans.id',
                'ans.text',
                'ans.date_created',
                ...userFields
            )
            .where('ans.question_id', question_id)
            .leftJoin(
                'forum_users AS usr',
                'ans.user_id',
                'usr.id'
            )
            .groupBy('ans.id', 'usr.id')
    },

    serializeQuestions(questions) {
        return questions.map(this.serializeQuestion)
    },

    serializeQuestion(question) {
        const questionTree = new Treeize()
        const questionData = questionTree.grow([ question ]).getData()[0]
    
        return {
          id: questionData.id,
          title: xss(questionData.title),
          content: xss(questionData.content),
          tags: xss(questionData.tags),
          date_created: questionData.date_created,
          user: questionData.user || {},
          number_of_answers: Number(questionData.number_of_answers) || 0,
        }
      },

    serializeAnswers(answers){
        return answers.map(this.serializeAnswer)
    },

    serializeAnswer(answer){
        const ansTree = new Treeize()
        const ansData = ansTree.grow([answer]).getData()[0]
        return {
            id: ansData.id,
            question_id: ansData.question_id,
            text: xss(ansData.text),
            user: ansData.user || {},
            date_created: ansData.date_created
        }
    }
}



module.exports = QuestionsService