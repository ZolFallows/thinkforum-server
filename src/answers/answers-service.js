const xss = require('xss')

const AnswersService = {
    getById(db, id) {
        return db
          .from('forum_answers AS ans')
          .select(
            'ans.id',
            'ans.text',
            'ans.date_created',
            'ans.question_id',
            db.raw(
              `row_to_json(
                (SELECT tmp FROM (
                  SELECT
                    usr.id,
                    usr.user_name,
                    usr.full_name,
                    usr.date_created
                ) tmp)
              ) AS "user"`
            )
          )
          .leftJoin(
            'forum_users AS usr',
            'ans.user_id',
            'usr.id'
          )
          .where('ans.id', id)
          .first()
      },

      insertAnswer(db, newAnswer) {
        return db
          .insert(newAnswer)
          .into('forum_answers')
          .returning('*')
          .then(([answer]) => answer)
          .then(answer => {
             return AnswersService.getById(db, answer.id)
          }
            
          )
      },
    
      serializeAnswer(answer) {
        return {
          id: answer.id,
          text: xss(answer.text),
          question_id: answer.question_id,
          date_created: answer.date_created,
          user: answer.user || {},
        }
      }
}

module.exports = AnswersService