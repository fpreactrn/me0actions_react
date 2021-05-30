const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const port = 4009;

console.log(process.env.dbUrl);

mongoose.connect(process.env.dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, function(err, res){
    if (err){
      console.log('DB connection failed:'+err);
    }
    else {
    //   console.log('DB successfully connected to: dbUrl');
      console.log('DB successfully connected to: '+process.env.dbUrl);
    }
  });
  
  const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  const User = mongoose.model('User', userSchema);
  
  const todosSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    todos: [
      {
        text: String,
        checked: Boolean,
        id: String,
        deleted: Boolean
      }
    ]
  });
  const Todos = mongoose.model('Todos', todosSchema);
  
  app.use(express.json());
  
  app.get('/', (req, res) => {
    res.send('Hello World');
  });
  
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
  
  app.post('/todos', async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [ username, password ] = token.split(":");
    const todosItems = req.body;
    const user = await User.findOne({ username }).exec();
  
    if (!user || user.password !== password){
      res.status(403);
      res.json({
        message: 'invalid access'
      });
      return;
    }
  
    const todos = await Todos.findOne({ userId: user._id}).exec();
    if (!todos) {
      await Todos.create({ 
        userId: user._id,
        todos: todosItems
      });
    } else {
      todos.todos = todosItems;
      await todos.save();
    }
  
    res.json(todosItems);
  });
  
  app.get('/todos', async (req, res) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const [ username, password ] = token.split(":");
    // const todosItems = req.body;
    const user = await User.findOne({ username }).exec();
  
    if (!user || user.password !== password){
      res.status(403);
      res.json({
        message: 'invalid access'
      });
      return;
    }
  
    const { todos } = await Todos.findOne({ userId: user._id}).exec();  
    res.json(todos)
  });

// app.listen(port, () => {
//   console.log(`Port is listening at: ${port}`);
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});