const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
	console.log("DB connected");
});
var Schema = mongoose.Schema;
var User = new Schema({
	id: String,
	password: String,
	name: String,
	date: Date
});
var userModel = mongoose.model('User', User);

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use('local-signup', new LocalStrategy({ // local-signup이라는 전략을짭니다.
    usernameField: 'signupID', // 필드를 정해주는 것 입니다.
    passwordField: 'signupPW',
    passReqToCallback: true  // request객체에 user의 데이터를 포함시킬지에 대한 여부를 결정
  }, function (req, id, password, done) {
    userModel.findOne({'id': id}, function (err, user) { // 넘겨받은 email을 통해 검색합니다.
      if (err) return done(null);
      // flash를 통해서 메세지를 넘겨줍니다.   
      if (user){
 
        return done(null, false, { message: '중복된 아이디' });
      } 
 
      userModel.findOne({'name': req.body.signupName}, function (err, user) { // 넘겨받은 email을 통해 검색합니다.
        if (err) return done(null);
        // flash를 통해서 메세지를 넘겨줍니다.   
        if (user){
   
          return done(null, false, { message: '중복된 이름' });
        } else{
            const newUser = new userModel();
            newUser.id = id; // 넘겨받은 정보들을 세팅합니다.
            newUser.password = password; // generateHash을 통해 비밀번호를 hash화 합니다.
            newUser.name = req.body.signupName;
            newUser.date = Date.now();
            newUser.save(function (err) { // 저장합니다.
              if (err) throw err;
              return done(null, newUser); // serializeUser에 값을 넘겨줍니다.
            });
        }

      })
     
    })
  }));

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pw',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
  }, (id, password, done) => {
    console.log(id, password);
    userModel.findOne({ id: id }, (findError, user) => {
        console.log(user)
      if (findError) return done(findError); // 서버 에러 처리
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
    //   return user.comparePassword(password, (passError, isMatch) => {
    //     if (isMatch) {
    //       return done(null, user); // 검증 성공
    //     }
    //     return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
    //   });
    
    if (password == user.password) {
        console.log("hooray")
        return done(null, user); // 검증 성공
    }
    return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리

    });
  }));
};