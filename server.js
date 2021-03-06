const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Actions = require('./models/Action');
const port = process.env.PORT || 4009;

mongoose.connect(process.env.dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, function(err, res){
    if (err){
      console.log('DB connection failed:'+err);
    }
    else {
      console.log('DB successfully connected to: dbUrl');
      console.log('DB successfully connected to: '+process.env.dbUrl);
    }
  }
);
  
app.use(express.json());
  
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });
  
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username }).exec();
    if (user){
      res.status(403);
      res.json({
        message: 'user already exist'
      });
      return
    }
  
    await User.create({ username, password });
    res.json({
      username,
      password
    })
});
  
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username }).exec();
  
    if (!user || password !== user.password){
      res.status(500);
      res.json({
        message: 'invalid login'
      });
      return
    }
  
    res.json({
      message: 'logged in'
    })
});
  
app.post('/actions', async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [ username, password ] = token.split(":");
    const actionsItems = req.body;
    const user = await User.findOne({ username }).exec();
  
    if (!user || user.password !== password){
      res.status(403);
      res.json({
        message: 'invalid access'
      });
      return;
    }
  
    const actions = await Actions.findOne({ userId: user._id}).exec();
    if (!actions) {
      await Actions.create({ 
        userId: user._id,
        actions: actionsItems
      });
    } else {
      actions.actions = actionsItems;
      await actions.save();
    }
  
    res.json(actionsItems);
});
  
app.get('/actions', async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [ username, password ] = token.split(":");
    const user = await User.findOne({ username }).exec();
  
    if (!user || user.password !== password){
      res.status(403);
      res.json({
        message: 'invalid access'
      });
      return;
    }
  
    const { actions } = await Actions.findOne({ userId: user._id}).exec();  
    res.json(actions)
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get(""*"", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
};

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});