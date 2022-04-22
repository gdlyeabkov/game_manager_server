const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()
const server = require('http').createServer(app)
const { Server } = require("socket.io");
const io = new Server(server)
const bcrypt = require('bcrypt')
const mimeTypes = require('mime-types')

const saltRounds = 10

const fs = require('fs')

const multer  = require('multer')

const gameStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const gameName = req.query.name
        const gamePath = `${pathToDir}uploads/games/${gameName}`
        const isGamePathExists = fs.existsSync(gamePath)
        const isGamePathNotExists = !isGamePathExists
        if (isGamePathNotExists) {
            fs.mkdirSync(gamePath)
        }
        cb(null, `uploads/games/${gameName}`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const gameName = req.query.name
        const gamePath = `${pathToDir}uploads/games/${gameName}`
        const isGamePathExists = fs.existsSync(gamePath)
        const isGamePathNotExists = !isGamePathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isGamePathNotExists) {
            fs.mkdirSync(gamePath)
            cb(null, `${gameName}${ext}`)
        } else {
            cb(null, `${gameName}${ext}`)
        }
    }
})
const gameUpload = multer({ storage: gameStorage })

const usersStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.query.id
        const userPath = `${pathToDir}uploads/users/${userId}`
        const isUserPathExists = fs.existsSync(userPath)
        const isUserPathNotExists = !isUserPathExists
        if (isUserPathNotExists) {
            fs.mkdirSync(userPath)
        }
        cb(null, `uploads/users/${userId}`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const userId = req.query.id
        const userPath = `${pathToDir}uploads/users/${userId}`
        const isUserPathExists = fs.existsSync(userPath)
        const isUserPathNotExists = !isUserPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isUserPathNotExists) {
            fs.mkdirSync(userPath)
            cb(null, `${userId}${ext}`)
        } else {
            cb(null, `${userId}${ext}`)
        }
    }
})
const usersUpload = multer({ storage: usersStorage })

app.use('/', serveStatic(path.join(__dirname, '/client/dist/client')))

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
    name: String,
    country: String,
    about: String,
    status: {
        type: String,
        default: 'online'
    }
}, { collection : 'mygamers' })
    
const UserModel = mongoose.model('UserModel', UserSchema)

const FriendRequestSchema = new mongoose.Schema({
    user: String,
    friend: String
}, { collection : 'myfriendrequests' })
    
const FriendRequestModel = mongoose.model('FriendRequestModel', FriendRequestSchema)

const FriendSchema = new mongoose.Schema({
    user: String,
    friend: String
}, { collection : 'myfriends' })
    
const FriendModel = mongoose.model('FriendModel', FriendSchema)

const MsgSchema = new mongoose.Schema({
    user: String,
    friend: String,
    content: String,
    type: String
}, { collection : 'mymsgs' })
    
const MsgModel = mongoose.model('MsgModel', MsgSchema)

const GameSchema = new mongoose.Schema({
    name: String,
    url: String,
    image: String,
    users: {
        type: Number,
        default: 0
    },
    maxUsers: {
        type: Number,
        default: 0
    }
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

app.get('/api/msgs/get', (req, res) => {
    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    
    let query = MsgModel.find({  })
    
    query.exec((err, msgs) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ msgs: msgs, status: 'OK' })
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

app.get('/api/friends/get', (req, res) => {
    
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); 
    
    let friends = []
    
    let query = FriendModel.find({  })
    query.exec((err, users) => {
        if (err) {
            return res.json({ "status": "Error", 'friends': friends })
        } else {
            let friends = users
            return res.json({ status: 'OK', 'friends': friends })
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

// app.get('/api/games/create', (req, res) => {
        
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

//     const game = new GameModel({ name: req.query.name, url: req.query.url, image: req.query.image })
//     game.save(function (err) {
//         if (err) {
//             return res.json({ "status": "Error" })
//         } else {
//             return res.json({ "status": "OK" })
//         }
//     })

// })

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

                const user = new UserModel({ login: req.query.login, password: encodedPassword, name: req.query.login, country: 'Россия', about: 'Юный геймер' })
                user.save(function (err) {
                    if (err) {
                        return res.json({
                            status: 'Error',
                            'id': userId
                        })
                    } else {
                        userId = user._id
                        
                        const pathToDir = `${__dirname}${pathSeparator}`
                        const userPath = `${pathToDir}uploads/users/${userId}`
                        fs.mkdirSync(userPath)
                        
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

    const friend = new FriendModel({ user: req.query.id, friend: req.query.friend })
    friend.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const friend = new FriendModel({ user: req.query.friend, friend: req.query.id })
            friend.save(function (err) {
                if (err) {
                    return res.json({ "status": "Error" })
                } else {
                    return res.json({ "status": "OK" })
                }
            })
        }
    })

})

app.get('/api/msgs/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const msg = new MsgModel({ user: req.query.user, friend: req.query.friend, content: req.query.content, type: req.query.type })
    msg.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/friends/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await FriendModel.deleteMany({  })

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/msgs/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await MsgModel.deleteMany({  })

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/games/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await GameModel.deleteMany({  })

    return res.json({
        'status': 'OK'
    })

})

// app.get('/api/user/edit', (req, res) => {
    
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
//     UserModel.updateOne({ _id: req.query.id },
//     {
//         name: req.query.name,
//         about: req.query.about,
//         country: req.query.country,
//     }, (err, user) => {
//         if (err) {
//             return res.json({ status: 'Error' })        
//         }
//         return res.json({ status: 'OK' })
//     })
// })

app.get('/api/user/avatar', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю аватар')

    fs.readdir(`${__dirname}/uploads/users/${req.query.id}`, (err, data) => {
        if (err) {
            return
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                console.log(`file: ${file}; mime: ${mime}`)
                const isImg = mime.includes('image')
                if (isImg) {
                    ext = path.extname(file)
                    break
                }
            }
            const extLength = ext.length
            const isNotFound = extLength <= 0
            if (isNotFound) {
                return
            } else {
                return res.sendFile(`${__dirname}/uploads/users/${req.query.id}/${req.query.id}${ext}`)
            }
        }
    })
    
    // return res.sendFile(__dirname + `/uploads/users/${req.query.id}/${req.query.id}.png`)

})

app.get('/api/game/thumbnail', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю миниатюру')

    fs.readdir(`${__dirname}/uploads/games/${req.query.name}`, (err, data) => {
        if (err) {
            return
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                console.log(`file: ${file}; mime: ${mime}`)
                const isImg = mime.includes('image')
                if (isImg) {
                    ext = path.extname(file)
                    break
                }
            }
            const extLength = ext.length
            const isNotFound = extLength <= 0
            if (isNotFound) {
                return
            } else {
                return res.sendFile(`${__dirname}/uploads/games/${req.query.name}/${req.query.name}${ext}`)
            }
        }
    })

    // return res.sendFile(__dirname + `/uploads/games/${req.query.name}/${req.query.name}.png`)

})

app.get('/api/game/distributive', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю дистрибутив')

    return res.sendFile(__dirname + `/uploads/games/${req.query.name}/${req.query.name}.exe`)

})

app.post('/api/user/edit', usersUpload.any(), (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.updateOne({ _id: req.query.id },
    {
        name: req.query.name,
        about: req.query.about,
        country: req.query.country,
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
})

app.get('/api/user/status/set', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.updateOne({ _id: req.query.id },
    {
        status: req.query.status
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
})

app.get('/api/friends/remove', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await FriendModel.deleteOne({ user: req.query.id, friend: req.query.friend })

    await FriendModel.deleteOne({ user: req.query.friend, friend: req.query.id })

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/friends/requests/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await FriendRequestModel.deleteMany({  })
    return res.json({ status: 'OK' })

})

app.get('/api/users/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await UserModel.deleteMany({  })
    return res.json({ status: 'OK' })

})

app.get('/api/games/stats/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = GameModel.findOne({'_id': req.query.id }, function(err, game) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            const users = game.users
            const maxUsers = game.maxUsers
            let updatedUsers = users + 1
            let updatedMaxUsers = maxUsers
            const isUpdateMaxUsers = updatedUsers > maxUsers
            if (isUpdateMaxUsers) {
                updatedMaxUsers = updatedUsers
            }
            GameModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "users": 1 },
                "$set": { "maxUsers": updatedMaxUsers }
            }, (err, game) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/games/stats/decrease', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    GameModel.findOne({'_id': req.query.id }, function(err, game) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            const users = game.users
            GameModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "users": -1 }
            }, (err, game) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/users/stats/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readFile(statsFilePath, (err, data) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            const rawStatsData = data.toString()
            const statsData = JSON.parse(rawStatsData)
            const statsDataUsers = statsData.users
            const statsDataMaxUsers = statsData.maxUsers
            const updatedUsersCount = statsDataUsers + 1
            let updatedMaxUsersCount = statsDataMaxUsers
            const isUpdateMaxUsersCount = updatedUsersCount > statsDataMaxUsers
            if (isUpdateMaxUsersCount) {
                updatedMaxUsersCount = updatedUsersCount
            }
            const updatedStatsData = {
                users: updatedUsersCount,
                maxUsers: updatedMaxUsersCount
            }
            const updatedRawStatsData = JSON.stringify(updatedStatsData)
            fs.writeFile(statsFilePath, updatedRawStatsData, (err, data) => {
                if (err) {
                    return res.json({ status: 'Error' })
                } else {
                    return res.json({ status: 'OK' })
                }
            })
        } 
    })

})

app.get('/api/users/stats/decrease', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readFile(statsFilePath, (err, data) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            const rawStatsData = data.toString()
            const statsData = JSON.parse(rawStatsData)
            const statsDataUsers = statsData.users
            const statsDataMaxUsers = statsData.maxUsers
            const updatedUsersCount = statsDataUsers - 1
            const updatedStatsData = {
                users: updatedUsersCount,
                maxUsers: statsDataMaxUsers
            }
            const updatedRawStatsData = JSON.stringify(updatedStatsData)
            fs.writeFile(statsFilePath, updatedRawStatsData, (err, data) => {
                if (err) {
                    return res.json({ status: 'Error' })
                } else {
                    return res.json({ status: 'OK' })
                }
            })
        } 
    })

})

app.get('/api/users/stats/get', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readFile(statsFilePath, (err, data) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            const rawStatsData = data.toString()
            const statsData = JSON.parse(rawStatsData)
            const usersCount = statsData.users
            const maxUsersCount = statsData.maxUsers
            return res.json({
                status: 'OK',
                users: usersCount,
                maxUsers: maxUsersCount
            })
        } 
    })

})

// app.get('/api/games/distributive', (req, res)=>{
        
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
//     res.sendFile(__dirname + `/uploads/distributtives/${req.query.id}.exe`)

// })

app.post('/api/games/create', gameUpload.fields([{name: 'gameDistributive', maxCount: 1}, {name: 'gameThumbnail', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю игру')

    const game = new GameModel({ name: req.query.name, url: req.query.url, image: req.query.image })
    game.save(function (err) {
        if (err) {
            // return res.json({ "status": "Error" })
        } else {
            // return res.json({ "status": "OK" })
        }
    })
    return await res.redirect('/')

})


// const port = 4000
const port = process.env.PORT || 8080

var clients = []

const pathSeparator = path.sep
const pathToDir = `${__dirname}${pathSeparator}`
const statsFilePath = `${pathToDir}stats.txt`
// const isStatsExists = fs.existsSync(statsFilePath)
// const isStatsNotExists = !isStatsExists
// if (isStatsNotExists) {
    const statsData = {
        users: 0,
        maxUsers: 0
    }
    const rawStatsData = JSON.stringify(statsData)
    fs.writeFile(statsFilePath, rawStatsData, (err, data) => {
        if (err) {
            console.log('не могу создать статистику')
        } else {
            console.log('статистика создана')
        }
    })
// }

server.listen(port, () => {
    io.on('connection', client => {
        clients.push(client)
        console.log('connection')
        client.on('user_is_online', (msg) => {
            console.log(`user is online: ${msg}`)
            io.sockets.emit('friend_is_online', msg)
            io.sockets.emit('friend_is_toggle_status', 'online')
        })
        client.on('user_is_played', (msg) => {
            console.log(`user is played: ${msg}`)
            io.sockets.emit('friend_is_played', msg)
            io.sockets.emit('friend_is_toggle_status', 'played')
        })
        client.on('user_send_msg', (msg) => {
            console.log(`user send msg: ${msg}`)
            io.sockets.emit('friend_send_msg', msg)
        })
        client.on('user_is_toggle_status', (msg) => {
            console.log(`user is toggle status: ${msg}`)
            io.sockets.emit('friend_is_toggle_status', msg)
        })
        client.on('user_write_msg', (msg) => {
            console.log(`user write msg: ${msg}`)
            io.sockets.emit('friend_write_msg', msg)
        })
        client.on('user_send_friend_request', (msg) => {
            console.log(`user send friend request: ${msg}`)
            io.sockets.emit('user_receive_friend_request', msg)
        })
    })
})