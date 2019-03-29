
const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter
    .post('/signin', bodyParser, (req, res, next) => {
        const { user_name, password } = req.body
        const signinUser = { user_name, password }

        for(const [key, value] of Object.entries(signinUser)){
            if(value == null){
                return res.status(400).json({ error: `Missing ${key} in request body` });
            }
        }

        AuthService
            .getUserByUsername(req.app.get('db'), signinUser.user_name)
            .then(user => {
                if(!user){
                    return res.status(400).json({ error: 'Incorrect user_name or password' });
                }

                return AuthService
                    .comparePasswords(signinUser.password, user.password)
                    .then(compareUser => {
                        if(!compareUser){
                            return res.status(400).json({ error: 'Incorrect user_name or password' });
                        }

                        const sub = user.user_name
                        const payload = { 
                                            user_id: user.id,
                                            user_name: user.user_name,
                                            full_name: user.full_name
                                        }
                        res.send({
                            authToken: AuthService.createJwt(sub, payload)
                        })
                    })
            })
            .catch(next)
    })

authRouter.post('/refresh', requireAuth, (req, res, next) => {
        const sub = req.user.user_name
        const payload = { 
                            user_id: req.user.id,
                            user_name: req.user.user_name,
                            full_name: req.user.full_name
                        }
        
        res.send({
            authToken: AuthService.createJwt(sub, payload),
            })
            
        next()
    })


module.exports = authRouter