const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/


const UsersService = {
    getById(db, id){
        return db('forum_users')
            .select('*')
            .where({id})
            .first()
    },

    hasUsername(db, user_name){
        return db('forum_users')
            .where({user_name})
            .first()
            .then(user => !!user)
    },

    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('forum_users')
            .returning('*')
            .then(([user]) => user)
    },

    updateUser(db, updateUser, id){
        return db('forum_users')
            .where({id})
            .update(updateUser)
            .debug()
            .returning('*')
            .then(([user]) => user)

    },

    validatePassword(password){
        if(password.length < 8){
            return 'Password be 8 characters or more'
        }
        if(password.length > 72){
            return 'Password be 72 characters or less'
        }
        if(password.startsWith(' ') || password.endsWith(' ')){
            return `Password must not start or end with empty spaces`
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return `Password must contain 1 upper case, lower case, number and special character`
        }
        return null
    },

    hashPassword(password){
        return bcrypt.hash(password, 12)
    },

    serializeUser(user){
        return {
            id: user.id,
            user_name: xss(user.user_name),
            full_name: xss(user.full_name),
            title: xss(user.title),
            location: xss(user.location),
            content: xss(user.content),
            date_created: user.date_created,
        }
    },
}

module.exports = UsersService