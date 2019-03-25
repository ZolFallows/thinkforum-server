const express = require('express')
const path = require('path');
const AnswersService = require('./answers-service')
const { requireAuth } = require('../middleware/jwt-auth')

const answersRouter = express.Router()
const bodyParser = express.json()

answersRouter
    .route('/')
    .post(requireAuth, bodyParser, (req, res, next) => {
        const { question_id, text } = req.body
        const newAnswer = { question_id, text }
        for(const [key, value] of Object.entries(newAnswer)){
            if(value == null){
            return `Missing ${key} in request body`
            }
        }

        newAnswer.user_id = req.user.id

        AnswersService
            .insertAnswer(req.app.get('db'), newAnswer)
            .then(answer => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${answer.id}`))
                    .json(AnswersService.serializeAnswer(answer))
            })
            .catch(next)
    })

    module.exports = answersRouter