const express = require('express')
const path = require('path');
const QuestionsService = require('./questions-service')
const {requireAuth} = require('../middleware/jwt-auth')

const questionsRouter = express.Router()
const bodyParser = express.json()

questionsRouter
    .route('/')
    .get((req, res, next) => {
        QuestionsService.getAllQuestions(req.app.get('db'))
            .then(questions => {
                res.json(QuestionsService.serializeQuestions(questions))
            })
            .catch(next)
    })
    .post(requireAuth, bodyParser, (req, res, next) => {
        const { title, content, tags } = req.body
        const newQuestion = { title, content, tags }
        for(const [key, value] of Object.entries(newQuestion)){
            if(value == null){
            return `Missing ${key} in request body`
            }
        }

        newQuestion.user_id = req.user.id

        QuestionsService
        .inserQuestion(req.app.get('db'), newQuestion)
        .then(question =>{
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${question.id}`))
                .json(QuestionsService.serializeQuestion(question))
        })
        .catch(next)
    })

questionsRouter
    .route('/:question_id')
    .all(requireAuth)
    .all(isQuestionExist)
    .get((req, res) => {
        res.json(QuestionsService.serializeQuestion(res.question))
    })
    .delete((req, res, next) => {
        QuestionsService
            .deleteQuestion(req.app.get('db'), req.params.question_id)
            .then(numsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

questionsRouter
    .route('/:question_id/answers')
    .all(requireAuth)
    .all(isQuestionExist)
    .get((req, res, next) => {
        QuestionsService
            .getAnswersForQuestion(
                req.app.get('db'),
                req.params.question_id
            )
            .then(answers => {
                res.json(QuestionsService.serializeAnswers(answers))
            })
            .catch(next)
    })


async function isQuestionExist(req, res, next){
    try{
        const question = await QuestionsService
            .getById(
                req.app.get('db'), 
                req.params.question_id
            )
        if(!question) return res.status(404).json({ error: "Question doesn't exist" })
        res.question = question
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = questionsRouter