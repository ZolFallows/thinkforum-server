const path = require('path')
const express = require('express')
const UsersService = require('./users-service')

const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter
    .post('/', bodyParser, (req, res, next) => {
        const { full_name, user_name, password } = req.body
        const fields = ['full_name', 'user_name','password']

        for (const field of fields){
            if(!req.body[field]){
                return res.status(400).json({ error: `Missing ${field} in request body`})
            }
        }

        if(UsersService.validatePassword(password)){
            return res.status(400).json({ error: UsersService.validatePassword(password)})
        }

        UsersService
            .hasUsername(req.app.get('db'), user_name)
            .then(usernameTaken => {
                if(usernameTaken){
                    return res.status(400).json({ error: `Username already taken` })
                }
                return UsersService
                    .hashPassword(password)
                    .then(hashedPassword => {
                        return UsersService.insertUser(req.app.get('db'), {
                                                full_name,
                                                user_name,
                                                password: hashedPassword,
                                                date_created: 'now()',
                                            })
                                            .then(user => {
                                                res.status(201)
                                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                                    .json(UsersService.serializeUser(user))
                                            })

                    })
            })
            .catch(next)
    })

usersRouter
    .route('/:user_id')
    .all(requireAuth)
    .all(isUserExist)
    .get((req, res) => {
        res.json(UsersService.serializeUser(res.user))
    })

usersRouter
    .route('/:user_id')
    .patch(requireAuth, bodyParser, (req, res, next) => {
        const { full_name, title, location, content } = req.body
        const updateUser = { full_name, title, location, content }
        const user_id = req.params.user_id
        UsersService.updateUser(
            req.app.get('db'),
            updateUser,
            user_id
        )
        .then(user => {
            res.status(201)
                .json(UsersService.serializeUser(user))
        })
        .catch(next)
    })

async function isUserExist(req, res, next){
    try{
        const user = await UsersService
            .getById(
                req.app.get('db'), 
                req.params.user_id
            )
        if(!user) return res.status(404).json({ error: "User doesn't exist" })
        res.user = user
        next()
    } catch (error) {
        next(error)
    }
}
    

    module.exports = usersRouter