const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()
const server = require('http').createServer(app)
const { Server } = require("socket.io");
const io = new Server(server)
const bcrypt = require('bcrypt')
const { ClientRequest } = require('http')

const saltRounds = 10

const fs = require('fs')

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
    name: String,
    country: String,
    about: String
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

                const user = new UserModel({ login: req.query.login, password: encodedPassword, name: req.query.login, country: 'Россия', about: 'Юный геймер' })
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

app.get('/api/user/edit', (req, res) => {
    
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

const port = 4000
// const port = process.env.PORT || 8080

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
            // let query = FriendModel.find({  })
            // query.exec((err, users) => {
            //     if (err) {
            //         return
            //     } else {
            //         for (let client of clients) {
            //             client.emit('friend_is_online', msg)
            //         }
            //     }
            // })
            io.sockets.emit('friend_is_online', msg)
        })
        client.on('user_is_played', (msg) => {
            console.log(`user is played: ${msg}`)
            // for (let client of clients) {
            //     client.emit('friend_is_played', msg)
            // }
            io.sockets.emit('friend_is_played', msg)
        })
        client.on('user_send_msg', (msg) => {
            console.log(`user send msg: ${msg}`)
            // for (let client of clients) {
            //     client.emit('friend_send_msg', msg)
            // }
            io.sockets.emit('friend_send_msg', msg)
        })
    })
})