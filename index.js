const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const bcrypt = require('bcrypt')

const saltRounds = 10

const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/digitaldistributtionservice?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url, connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
    friends: [mongoose.Schema.Types.Map]
}, { collection : 'mygamers' })
    
const UserModel = mongoose.model('UserModel', UserSchema)

const FriendRequestSchema = new mongoose.Schema({
    user: String,
    friend: String
}, { collection : 'myfriendrequests' })
    
const FriendRequestModel = mongoose.model('FriendRequestModel', FriendRequestSchema)

const GameSchema = new mongoose.Schema({
    name: String,
    url: String,
    image: String
}, { collection : 'my_digital_distributtion_games' })
    
const GameModel = mongoose.model('GameModel', GameSchema)

app.get('/api/games/get', (req, res) => {
    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    
    let query = GameModel.find({  })
    
    query.exec((err, games) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ games: games, status: 'OK' })
        }
    })
    
})

app.get('/api/friends/requests/get', (req, res) => {
    
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); 
    
    let friendRequests = []
    
    let query = FriendRequestModel.find({  })
    query.exec((err, requests) => {
        if (err) {
            return res.json({ "status": "Error", 'requests': friendRequests })
        } else {
            let friendRequests = requests
            return res.json({ status: 'OK', 'requests': friendRequests })
        }
    })
})

app.get('/api/users/get', (req, res) => {
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query = UserModel.findOne({ _id: req.query.id })
    query.exec((err, user) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ user: user, status: 'OK' })
        }
    })
})

app.get('/api/users/all', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query = UserModel.find({  })
    query.exec((err, users) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ 'users': users, 'status': 'OK' })
        }
    })
})

app.get('/api/users/check', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let userId = '0'

    let query =  UserModel.findOne({'login': req.query.login}, function(err, user) {
        if (err || user == undefined || user == null) {
            return res.json({ "status": "Error", 'id': userId })
        } else {
            
            let passwordCheck = bcrypt.compareSync(req.query.password, user.password) && req.query.password !== ''

            if (req.query.login === user.login && passwordCheck) {
                userId = user._id
                return res.json({ "status": "OK", 'id': userId })
            } else {
                return res.json({ "status": "Error", 'id': userId })
            }
        }
    })

})

app.get('/api/games/create', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    const game = new GameModel({ name: req.query.name, url: req.query.url, image: req.query.image })
    game.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/users/create', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let userId = '0'

    let query = UserModel.find({  })
    query.exec((err, allUsers) => {
        if (err) {
            return res.json({ "status": "Error", 'id': userId })
        }
        
        let userExists = false

        allUsers.forEach(user => {
            if(user.login.includes(req.query.login)){
                userExists = true
            }
        })
        if (userExists) {
            return res.json({ status: 'Error', 'id': userId })
        } else {

            const isPasswordsMatches = req.query.password === req.query.confirmPassword
            if (isPasswordsMatches) {

                let encodedPassword = "#"
                const salt = bcrypt.genSalt(saltRounds)
                encodedPassword = bcrypt.hashSync(req.query.password, saltRounds)

                const user = new UserModel({ login: req.query.login, password: encodedPassword })
                user.save(function (err) {
                    if (err) {
                        return res.json({
                            status: 'Error',
                            'id': userId
                        })
                    } else {
                        userId = user._id
                        return res.json({
                            status: 'OK',
                            'id': userId
                        })
                    }
                })
            } else {
                return res.json({
                    'status': 'Error',
                    'id': userId
                })
            }
        }
    })

})

app.get('/api/friends/requests/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const friendRequest = new FriendRequestModel({ user: req.query.id, friend: req.query.friend })
    friendRequest.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/friends/requests/reject', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await FriendRequestModel.deleteOne({ _id: req.query.id })
    return res.json({ status: 'OK' })

})

app.get('/api/friends/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await FriendRequestModel.deleteOne({ _id: req.query.request })

    UserModel.updateOne({ _id: req.query.id },
    { $push: 
        {
            friends: [
                {
                    id: req.query.friend
                }
            ]
            
        }
    }, (err, user) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            UserModel.updateOne({ _id: req.query.friend },
            {
                $push: {
                    friends: [
                        {
                            id: req.query.id
                        }
                    ]
                    
                }
            }, (err, user) => {
                if (err) {
                    return res.json({ "status": "Error" })
                } else {
                    return res.json({ "status": "OK" })
                }
            })
        }
    })

})

app.get('/api/friends/delete', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    mongoose.connection.collection("mygamers").updateMany(
        { _id: req.query.id },
        { $pull: { 'friends': { id: req.query.friend } } }
    )

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/friends/remove', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log(`id: ${req.query.id}; friend: ${req.query.friend}`)

    mongoose.connection.collection("mygamers").updateOne(
        { _id: req.query.id },
        { $pull: { 'friends': { id: req.query.friend } } }
    )

    mongoose.connection.collection("mygamers").updateOne(
        { _id: req.query.friend },
        { $pull: { 'friends': { id: req.query.id } } }
    )

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/users/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await UserModel.deleteMany({  })
    return res.json({ status: 'OK' })

})

const port = 4000
// const port = process.env.PORT || 8080

app.listen(port)