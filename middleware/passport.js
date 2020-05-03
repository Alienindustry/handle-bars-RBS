const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require(' ../models/User');

module.exports = (passport) =>{
    passport.use(
        new LocalStrategy((username, password, done) =>{
            User.findone({ username})
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'user does not exist'});

                }
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else{
                        return done(null, false, { message: 'Incorrect Passage'});   
                    }
                    
                })
            })
            

       })
    );

passport.serializeUser((user, done)=>{
    done(null, user.id)
});

    passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) => {
        done(err, user);
    })


})

}