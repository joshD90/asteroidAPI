// const mongoose = require('mongoose');
// //Authentication plugins
//
// const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');
// const session = require('express-session');
//
// mongoose.connect('mongodb://localhost:27017/asteroidUsers');
//
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String
// });
//
// userSchema.plugin(passportLocalMongoose);
//
// const User = new mongoose.model('User', userSchema);
//
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//
//
// const doAuthenticate = passport.authenticate('local', {
//   failureRedirect: '/login'
// })
//
// function myAuthenticate() {
//   console.log("authentication triggered");
//   passport.authenticate('local', {
//     failureRedirect: '/'
//   })
// }
// // async function addUser(userObj) {
// //   try {
// //     await mongoose.connect('mongodb://localhost:27017/asteroidUsers');
// //     await User.create(userObj);
// //   } catch (e) {
// //     console.log(e);
// //   } finally {
// //     mongoose.disconnect();
// //   }
// // }
//
// async function findUser(typeSearch, searchParam) {
//   try {
//     searchObj = `{"${typeSearch}":"${searchParam}"}`
//     await mongoose.connect('mongodb://localhost:27017/asteroidUsers');
//     const result = await User.find(JSON.parse(searchObj));
//     return result;
//   } catch (e) {
//     console.log(e);
//   } finally {
//     mongoose.disconnect();
//   }
// }
//
// function doMaths(a, b) {
//   const result = a + b;
//   return result;
// }
//
// module.exports = {
//   User,
//   doMaths,
//   doAuthenticate
// };
//
//
//
//
//
// //