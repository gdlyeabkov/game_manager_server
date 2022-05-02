const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()
const server = require('http').createServer(app)
const { Server } = require("socket.io");
const io = new Server(server)

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
    client.on('user_is_speak', (msg) => {
        console.log(`user is speak: ${msg}`)
        io.sockets.emit('friend_is_speak', msg)
    })
    client.on('user_send_msg_to_forum', (msg) => {
        console.log(`user send msg to forum: ${msg}`)
        io.sockets.emit('user_send_msg_to_my_topic', msg)
    })
    client.on('user_request_peer_id', (msg) => {
        console.log(`user request peer id: ${msg}`)
        // io.sockets.emit('user_transfer_peer_id', `${msg}|${lastPeerId}`)
    })
    client.on('user_send_group_request', (msg) => {
        console.log(`user send group request: ${msg}`)
        io.sockets.emit('user_receive_group_request', msg)
    })
    client.on('user_send_comment', (msg) => {
        console.log(`user send comment: ${msg}`)
        io.sockets.emit('user_receive_comment', msg)
    })
})

const bcrypt = require('bcrypt')
const mimeTypes = require('mime-types')

const saltRounds = 10

const fs = require('fs')

const multer  = require('multer')

// const { ExpressPeerServer } = require('peer')
// const peerServer = ExpressPeerServer(server, {
//     debug: true
// })
// var lastPeerId = '#'
// var peerIndex = -1
// peerServer.on('connection', function(client) {
//     lastPeerId = client.id
//     peerIndex += 1
//     console.log(`client с id: ${lastPeerId} был подключен под индексом ${peerIndex}`)
//     console.log(`server._clients: ${server._clients}`)
//     io.sockets.emit('user_transfer_peer_id', `${peerIndex}|${lastPeerId}`)
// })
// app.use('/peerjs', peerServer)

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

const msgsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const msgPath = `${pathToDir}uploads/msgs`
        const isMsgPathExists = fs.existsSync(msgPath)
        const isMsgPathNotExists = !isMsgPathExists
        if (isMsgPathNotExists) {
            fs.mkdirSync(msgPath)
        }
        cb(null, `uploads/msgs`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const msgId = req.query.id
        const msgPath = `${pathToDir}uploads/msgs`
        const isMsgPathExists = fs.existsSync(msgPath)
        const isMsgPathNotExists = !isMsgPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isMsgPathNotExists) {
            fs.mkdirSync(msgPath)
            cb(null, `${msgId}${ext}`)
        } else {
            cb(null, `${msgId}${ext}`)
        }
    }
})
const msgsUpload = multer({ storage: msgsStorage })

const manualsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const manualPath = `${pathToDir}uploads/manuals`
        const isManualPathExists = fs.existsSync(manualPath)
        const isManualPathNotExists = !isManualPathExists
        if (isManualPathNotExists) {
            fs.mkdirSync(manualPath)
        }
        cb(null, `uploads/manuals`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        // const manualId = req.query.id
        const manualId = 'hash'
        const manualPath = `${pathToDir}uploads/manuals`
        const isManualPathExists = fs.existsSync(manualPath)
        const isManualPathNotExists = !isManualPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isManualPathNotExists) {
            fs.mkdirSync(manualPath)
            cb(null, `${manualId}${ext}`)
        } else {
            cb(null, `${manualId}${ext}`)
        }
    }
})
const manualsUpload = multer({ storage: manualsStorage })

const illustrationsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const illustrationPath = `${pathToDir}uploads/illustrations`
        const isIllustrationPathExists = fs.existsSync(illustrationPath)
        const isIllustrationPathNotExists = !isIllustrationPathExists
        if (isIllustrationPathNotExists) {
            fs.mkdirSync(illustrationPath)
        }
        cb(null, `uploads/illustrations`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const illustrationId = 'hash'
        const illustrationPath = `${pathToDir}uploads/illustrations`
        const isIllustrationPathExists = fs.existsSync(illustrationPath)
        const isIllustrationPathNotExists = !isIllustrationPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isIllustrationPathNotExists) {
            fs.mkdirSync(illustrationPath)
            cb(null, `${illustrationId}${ext}`)
        } else {
            cb(null, `${illustrationId}${ext}`)
        }
    }
})
const illustrationsUpload = multer({ storage: illustrationsStorage })

const screenShotsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const screenShotPath = `${pathToDir}uploads/screenShots`
        const isScreenShotPathExists = fs.existsSync(screenShotPath)
        const isScreenShotPathNotExists = !isScreenShotPathExists
        if (isScreenShotPathNotExists) {
            fs.mkdirSync(screenShotPath)
        }
        cb(null, `uploads/screenShots`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const screenShotId = 'hash'
        const screenShotPath = `${pathToDir}uploads/screenShots`
        const isScreenShotPathExists = fs.existsSync(screenShotPath)
        const isScreenShotPathNotExists = !isScreenShotPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isScreenShotPathNotExists) {
            fs.mkdirSync(screenShotPath)
            cb(null, `${screenShotId}${ext}`)
        } else {
            cb(null, `${screenShotId}${ext}`)
        }
    }
})
const screenShotsUpload = multer({ storage: screenShotsStorage })

const experimentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const experimentPath = `${pathToDir}uploads/experiments`
        const isExperimentPathExists = fs.existsSync(experimentPath)
        const isExperimentPathNotExists = !isExperimentPathExists
        if (isExperimentPathNotExists) {
            fs.mkdirSync(experimentPath)
        }
        cb(null, `uploads/experiments`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const experimentId = 'hash'
        const experimentPath = `${pathToDir}uploads/experiments`
        const isExperimentPathExists = fs.existsSync(experimentPath)
        const isExperimentPathNotExists = !isExperimentPathExists
        const fileName = file.originalname
        // const ext = path.extname(fileName)
        const ext = mimeTypes.extension(req.query.ext)
        if (isExperimentPathNotExists) {
            fs.mkdirSync(experimentPath)
            // cb(null, `${experimentId}${ext}`)
            if (file.originalname.endsWith('.xps')) {
                cb(null, `hash1.xps`)
            } else {
                cb(null, `${experimentId}.${ext}`)
            }
        } else {
            // cb(null, `${experimentId}${ext}`)
            if (file.originalname.endsWith('.xps')) {
                cb(null, `hash1.xps`)
            } else {
                cb(null, `${experimentId}.${ext}`)
            }
        }
    }
})
const experimentsUpload = multer({ storage: experimentsStorage })

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
    },
    friendsListSettings: {
        type: String,
        default: 'public'
    },
    gamesSettings: {
        type: String,
        default: 'friends'
    },
    equipmentSettings: {
        type: String,
        default: 'friends'
    },
    commentsSettings: {
        type: String,
        default: 'friends'
    }
}, { collection : 'mygamers' })
    
const UserModel = mongoose.model('UserModel', UserSchema)

const ExperimentSchema = new mongoose.Schema({
    title: String,
    desc: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myexperiments' })
    
const ExperimentModel = mongoose.model('ExperimentModel', ExperimentSchema)

const ReviewSchema = new mongoose.Schema({
    game: String,
    user: String,
    desc: String,
    hours: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myreviews' })
    
const ReviewModel = mongoose.model('ReviewModel', ReviewSchema)

const ManualSchema = new mongoose.Schema({
    title: String,
    desc: String,
    user: String,
    lang: String,
    categories: String,
    isDrm: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'mymanuals' })
    
const ManualModel = mongoose.model('ManualModel', ManualSchema)

const IllustrationSchema = new mongoose.Schema({
    title: String,
    desc: String,
    user: String,
    isDrm: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myillustrations' })
    
const IllustrationModel = mongoose.model('IllustrationModel', IllustrationSchema)

const ScreenShotSchema = new mongoose.Schema({
    user: String,
    desc: String,
    spoiler: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myscreenshots' })
    
const ScreenShotModel = mongoose.model('ScreenShotModel', ScreenShotSchema)

const NewsSchema = new mongoose.Schema({
    title: String,
    content: String,
    game: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'mynews' })
    
const NewsModel = mongoose.model('NewsModel', NewsSchema)

const ForumSchema = new mongoose.Schema({
    title: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myforums' })
    
const ForumModel = mongoose.model('ForumModel', ForumSchema)

const ForumTopicSchema = new mongoose.Schema({
    forum: String,
    title: String,
    user: String
}, { collection : 'myforumtopics' })
    
const ForumTopicModel = mongoose.model('ForumTopicModel', ForumTopicSchema)

const ForumMsgSchema = new mongoose.Schema({
    topic: String,
    user: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myforummsgs' })
    
const ForumMsgModel = mongoose.model('ForumMsgModel', ForumMsgSchema)

const UserCommentSchema = new mongoose.Schema({
    user: String,
    msg: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myforummsgs' })
    
const UserCommentModel = mongoose.model('UserCommentModel', UserCommentSchema)

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
    type: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'mymsgs' })

const TalkSchema = new mongoose.Schema({
    title: String,
    owner: String
}, { collection : 'my_talks' })

const TalkModel = mongoose.model('TalkModel', TalkSchema)

const TalkRelationSchema = new mongoose.Schema({
    talk: String,
    user: String
}, { collection : 'my_talk_relations' })

const TalkRelationModel = mongoose.model('TalkRelationModel', TalkRelationSchema)

const BlackListRelationSchema = new mongoose.Schema({
    user: String,
    friend: String
}, { collection : 'my_blacklist_relations' })

const BlackListRelationModel = mongoose.model('BlackListRelationModel', BlackListRelationSchema)

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

const GroupSchema = new mongoose.Schema({
    name: String,
    owner: String,
    lang: String,
    country: String,
    fanPage: String,
    twitch: String,
    youtube: String,
    date: {
        type: Date,
        default: Date.now()
    }
}, { collection : 'my_groups' })

const GroupModel = mongoose.model('GroupModel', GroupSchema)

const GroupRelationSchema = new mongoose.Schema({
    group: String,
    user: String
}, { collection : 'my_group_relations' })

const GroupRelationModel = mongoose.model('GroupRelationModel', GroupRelationSchema)

const GroupRequestSchema = new mongoose.Schema({
    group: String,
    user: String
}, { collection : 'my_group_requests' })

const GroupRequestModel = mongoose.model('GroupRequestModel', GroupRequestSchema)

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

app.get('/api/experiment/photo', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/experiments/${req.query.id}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
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
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/experiments/${req.query.id}/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/experiment/document', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Content-disposition', 'attachment; filename='+ `${req.query.id}.xps`);

    console.log('отправляю документ')

    fs.readdir(`${__dirname}/uploads/experiments`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                console.log(`file: ${file}; mime: ${mime}`)
                const isXps = mime.includes('application/vnd.ms-xpsdocument') || mime.includes('application/oxps')
                if (isXps) {
                    ext = path.extname(file)
                    break
                }
            }
            const extLength = ext.length
            const isNotFound = extLength <= 0
            if (isNotFound) {
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/experiments/${req.query.id}/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/groups/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GroupModel.find({  })
    
    query.exec((err, groups) => {
        if (err) {
            return res.json({ groups: [], "status": "Error" })
        } else {
            return res.json({ groups: groups, status: 'OK' })
        }
    })
    
})

app.get('/api/reviews/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ReviewModel.find({  })
    
    query.exec((err, reviews) => {
        if (err) {
            return res.json({ reviews: [], "status": "Error" })
        } else {
            return res.json({ reviews: reviews, status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IllustrationModel.find({  })
    
    query.exec((err, illustrations) => {
        if (err) {
            return res.json({ illustrations: [], "status": "Error" })
        } else {
            return res.json({ illustrations: illustrations, status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ScreenShotModel.find({  })
    
    query.exec((err, screenShots) => {
        if (err) {
            return res.json({ screenShots: [], "status": "Error" })
        } else {
            return res.json({ screenShots: screenShots, status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IllustrationModel.find({  })
    
    query.exec((err, illustrations) => {
        if (err) {
            return res.json({ illustrations: [], "status": "Error" })
        } else {
            return res.json({ illustrations: illustrations, status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ManualModel.find({  })
    
    query.exec((err, manuals) => {
        if (err) {
            return res.json({ manuals: [], "status": "Error" })
        } else {
            return res.json({ manuals: manuals, status: 'OK' })
        }
    })
    
})

app.get('/api/experiments/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ExperimentModel.find({  })
    
    query.exec((err, experiments) => {
        if (err) {
            return res.json({ experiments: [], "status": "Error" })
        } else {
            return res.json({ experiments: experiments, status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ManualModel.findOne({ _id: req.query.id })
    
    query.exec((err, manual) => {
        if (err) {
            return res.json({ manual: null, "status": "Error" })
        } else {
            return res.json({ manual: manual, status: 'OK' })
        }
    })
    
})

app.get('/api/reviews/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ReviewModel.findOne({ _id: req.query.id })
    
    query.exec((err, review) => {
        if (err) {
            return res.json({ review: null, "status": "Error" })
        } else {
            return res.json({ review: review, status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IllustrationModel.findOne({ _id: req.query.id })
    
    query.exec((err, illustration) => {
        if (err) {
            return res.json({ illustration: null, "status": "Error" })
        } else {
            return res.json({ illustration: illustration, status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ScreenShotModel.findOne({ _id: req.query.id })
    
    query.exec((err, screenShot) => {
        if (err) {
            return res.json({ screenShot: null, "status": "Error" })
        } else {
            return res.json({ screenShot: screenShot, status: 'OK' })
        }
    })
    
})

app.get('/api/groups/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GroupModel.deleteMany((err, groups) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ManualModel.deleteMany((err, manuals) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/experiments/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ExperimentModel.deleteMany((err, experiments) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/reviews/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ReviewModel.deleteMany((err, reviews) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ScreenShotModel.deleteMany((err, screenShots) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IllustrationModel.deleteMany((err, illustrations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/groups/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GroupRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/blacklist/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = BlackListRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/groups/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GroupRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/blacklist/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await BlackListRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/groups/relations/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GroupRelationModel.deleteOne({ group: req.query.group, user: req.query.id }, (err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/blacklist/relations/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await BlackListRelationModel.deleteOne({ user: req.query.id, friend: req.query.friend }, (err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/groups/requests/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GroupRequestModel.find({  })
    
    query.exec((err, requests) => {
        if (err) {
            return res.json({ requests: [], "status": "Error" })
        } else {
            return res.json({ requests: requests, status: 'OK' })
        }
    })
    
})

app.get('/api/forums/all', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ForumModel.find({  })
    
    query.exec((err, forums) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ forums: forums, status: 'OK' })
        }
    })
    
})

app.get('/api/forums/get', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ForumModel.findOne({ _id: req.query.id })
    
    query.exec((err, forum) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ forum: forum, status: 'OK' })
        }
    })
    
})

app.get('/api/forums/topics/get', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ForumTopicModel.findOne({ _id: req.query.id })
    
    query.exec((err, topic) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ topic: topic, status: 'OK' })
        }
    })
    
})


app.get('/api/forum/topics/all', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ForumTopicModel.find({  })
    
    query.exec((err, topics) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ topics: topics, status: 'OK' })
        }
    })
    
})

app.get('/api/forum/topics/get', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ForumTopicModel.find({ forum: req.query.id })
    
    query.exec((err, topics) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ topics: topics, status: 'OK' })
        }
    })
    
})

app.get('/api/news/get', (req, res) => {
    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    
    let query = NewsModel.find({  })
    
    query.exec((err, news) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ news: news, status: 'OK' })
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
        const isUserNotFound = user === null
        const isError = isUserNotFound || err
        if (isError) {
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
                const user = new UserModel({ login: req.query.login, password: encodedPassword, name: req.query.login, country: 'Россия', about: 'Информация отсутствует.'  })
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

app.get('/api/groups/requests/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const groupRequest = new GroupRequestModel({ group: req.query.id, user: req.query.user })
    groupRequest.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/groups/relations/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // await GroupRequestModel.deleteOne({ _id: req.query.request })

    const groupRelation = new GroupRelationModel({ group: req.query.id, user: req.query.user })
    groupRelation.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            GroupRequestModel.deleteOne({ _id: req.query.request }, (err) => {
                if (err) {
                    return res.json({ "status": "Error" })
                } else {
                    return res.json({ "status": "OK" })
                }
            })
        }
    })

})

app.get('/api/blacklist/relations/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const blackListRelation = new BlackListRelationModel({ user: req.query.id, friend: req.query.friend })
    blackListRelation.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/groups/requests/reject', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await GroupRequestModel.deleteOne({ _id: req.query.id })
    return res.json({ status: 'OK' })

})

app.get('/api/groups/requests/delete', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await GroupRequestModel.deleteMany({  }, (err) => {
        if (err) {
            return res.json({ "status": "Error" })
        }
        return res.json({ "status": "OK" })

    })

})

app.get('/api/groups/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const group = new GroupModel({ name: req.query.name, owner: req.query.id, lang: req.query.lang, country: req.query.country, fanPage: req.query.fanpage, twitch: req.query.twitch, youtube: req.query.youtube })
    group.save(function (err, group) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const groupId = group._id
            const relation = new GroupRelationModel({ group: groupId, user: req.query.id })
            relation.save(function (err) {
                if (err) {
                    return res.json({ "status": "Error" })
                }
                else {
                    return res.json({ "status": "OK" })
                }   
            })
        }
    })

})

app.get('/api/user/comments/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserCommentModel.find({ user: req.query.id }, (err, comments) => {
        if (err) {
            return res.json({ comments: null, status: 'Error' })
        } else {
            return res.json({ comments: comments, status: 'OK' })
        }
    })

})

app.get('/api/groups/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    GroupModel.findOne({ _id: req.query.id }, (err, group) => {
        if (err) {
            return res.json({ group: null, status: 'Error' })
        } else {
            return res.json({ group: group, status: 'OK' })
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

app.post('/api/manuals/add', manualsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log(`id: ${req.query.id},title: ${req.query.title},lang: ${req.query.lang},categories: ${req.query.categories},isDrm: ${req.query.drm}`)

    const manual = new ManualModel({ user: req.query.id, desc: req.query.desc, title: req.query.title, lang: req.query.lang, categories: req.query.categories, isDrm: req.query.drm })
    manual.save(function (err, generatedManual) {
        if (err) {
            console.log('создаю мануал ошибка')
            // return res.json({ "status": "Error" })
        } else {
            console.log('создаю мануал успешно')
            // return res.json({ "status": "OK" })
        }

        const generatedId = generatedManual._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const manualPath = `${pathToDir}uploads/manuals/hash${req.query.ext}`
        const newManualPath = `${pathToDir}uploads/manuals/${generatedId}${req.query.ext}`
        fs.rename(manualPath, newManualPath, (err) => {
            
        })

        return res.redirect('/')
    })

})

app.get('/api/reviews/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const review = new ReviewModel({ desc: req.query.desc, game: req.query.game, hours: req.query.hours, user: req.query.id })
    review.save(function (err, generatedReview) {
        if (err) {
            console.log('создаю обзор ошибка')
            return res.json({ "status": "Error" })
        } else {
            console.log('создаю обзор успешно')
            return res.json({ "status": "OK" })
        }
    })

})

app.post('/api/illustrations/add', illustrationsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const illustration = new IllustrationModel({ user: req.query.id, desc: req.query.desc, title: req.query.title, isDrm: req.query.drm })
    illustration.save(function (err, generatedIllustration) {
        if (err) {
            console.log('создаю иллюстрацию ошибка')
        } else {
            console.log('создаю иллюстрацию успешно')
        }

        const generatedId = generatedIllustration._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const illustrationPath = `${pathToDir}uploads/illustrations/hash${req.query.ext}`
        const newIllustrationPath = `${pathToDir}uploads/illustrations/${generatedId}${req.query.ext}`
        fs.rename(illustrationPath, newIllustrationPath, (err) => {
            
        })

        return res.redirect('/')
    })

})

app.post('/api/screenshots/add', screenShotsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const illustration = new ScreenShotModel({ user: req.query.id, desc: req.query.desc, isSpoiler: req.query.spoiler })
    illustration.save(function (err, generatedScreenShot) {
        if (err) {
            console.log('создаю скриншот ошибка')
        } else {
            console.log('создаю скриншот успешно')
        }

        const generatedId = generatedScreenShot._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const screenShotPath = `${pathToDir}uploads/screenShots/hash${req.query.ext}`
        console.log(`screenShotPath: ${screenShotPath}`)
        const newScreenShotPath = `${pathToDir}uploads/screenShots/${generatedId}${req.query.ext}`
        fs.rename(screenShotPath, newScreenShotPath, (err) => {
            
        })

        return res.redirect('/')
    })

})

app.get('/api/user/comments/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const comment = new UserCommentModel({ user: req.query.id, msg: req.query.msg })
    comment.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.post('/api/msgs/add', msgsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const msg = new MsgModel({ user: req.query.user, friend: req.query.friend, content: req.query.content, type: req.query.type })
    msg.save(function (err, newMsg) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const generatedId = newMsg._id
            const mime = req.query.ext
            console.log(`generatedId: ${generatedId}`)
            MsgModel.updateOne({ _id: generatedId },
            {
                content: mime
            }, (err, msg) => {
                if (err) {
                    return res.json({ status: 'Error' })        
                }
                const pathSeparator = path.sep
                const pathToDir = `${__dirname}${pathSeparator}`
                const msgPath = `${pathToDir}uploads/msgs/hash${req.query.ext}`
                const newMsgPath = `${pathToDir}uploads/msgs/${generatedId}${req.query.ext}`
                fs.rename(msgPath, newMsgPath, (err) => {
                    if (err) {
                        return res.json({ status: 'Error', id: generatedId, content: req.query.ext })
                    }
                    return res.json({ status: 'OK', id: generatedId, content: req.query.ext })
                })
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

app.get('/api/news/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await NewsModel.deleteMany({  })

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/user/avatar', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю аватар')

    fs.readdir(`${__dirname}/uploads/users/${req.query.id}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_avatar.png`)
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
                // return 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male-128.png'
                return res.sendFile(`${__dirname}/uploads/defaults/default_avatar.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/users/${req.query.id}/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/game/thumbnail', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю миниатюру')

    fs.readdir(`${__dirname}/uploads/games/${req.query.name}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
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
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/games/${req.query.name}/${req.query.name}${ext}`)
            }
        }
    })

})

app.get('/api/manual/photo', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/manuals`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
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
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/manuals/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/illustration/photo', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/illustrations`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
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
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/illustrations/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/screenshot/photo', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/screenShots`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
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
                return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
            } else {
                return res.sendFile(`${__dirname}/uploads/screenShots/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/msgs/thumbnail', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю миниатюру сообщения')

    return res.sendFile(`${__dirname}/uploads/msgs/${req.query.id}${req.query.content}`)

})

app.get('/api/game/distributive', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('Content-disposition', 'attachment; filename='+ `${req.query.name}.exe`);
    
    console.log(`отправляю дистрибутив ${__dirname}/uploads/games/${req.query.name}/${req.query.name}.exe ${req.query.name}.exe`)

    res.writeHead(200, {"Content-Type": "application/x-msdownload"})
    let file = fs.createReadStream(__dirname + `/uploads/games/${req.query.name}/${req.query.name}.exe`)
    file.pipe(res)

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
        friendsListSettings: req.query.friends,
        gamesSettings: req.query.games,
        equipmentSettings: req.query.equipment,
        commentsSettings: req.query.comments,
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

app.get('/api/forums/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await ForumModel.deleteMany({  })
    return res.json({ status: 'OK' })

})

app.get('/api/forums/topics/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await ForumTopicModel.deleteMany({  })
    return res.json({ status: 'OK' })

})

app.get('/api/forums/topics/msgs/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await ForumMsgModel.deleteMany({  })
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

app.get('/api/user/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      
    await UserModel.deleteOne({ _id: req.query.id }, (err, data) => {
        if (err) {
            return res.json({ status: 'Error' })
        }
        return res.json({ status: 'OK' })
    })

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


app.post('/api/games/create', gameUpload.fields([{name: 'gameDistributive', maxCount: 1}, {name: 'gameThumbnail', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю игру')

    const game = new GameModel({ name: req.query.name, url: req.query.url, image: req.query.image })
    game.save(function (err) {

    })
    return await res.redirect('/')

})

app.post('/api/experiments/create', experimentsUpload.fields([{name: 'experimentPhoto', maxCount: 1}, {name: 'experimentDocument', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log(`создаю эксперимент: ${req.query.ext}`)

    const experiment = new ExperimentModel({ title: req.query.title, desc: req.query.desc })
    experiment.save(function (err, generatedExperiment) {
        const generatedId = generatedExperiment._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        
        const experimentFolderPath = `${pathToDir}uploads/experiments/${generatedId}`
        fs.mkdirSync(experimentFolderPath)
        
        let experimentPath = `${pathToDir}uploads/experiments/hash.${mimeTypes.extension(req.query.ext)}`
        // const newExperimentPath = `${pathToDir}uploads/experiments/${generatedId}.${mimeTypes.extension(req.query.ext)}`
        let newExperimentPath = `${experimentFolderPath}/${generatedId}.${mimeTypes.extension(req.query.ext)}`
        // const experimentPath = `${pathToDir}uploads/experiments/hash${'.png'}`
        // const newExperimentPath = `${pathToDir}uploads/experiments/${generatedId}${'.png'}`
        fs.rename(experimentPath, newExperimentPath, (err) => {
            experimentPath = `${pathToDir}uploads/experiments/hash1.xps`
            newExperimentPath = `${experimentFolderPath}/${generatedId}.xps`
            fs.rename(experimentPath, newExperimentPath, (err) => {
                
            })  
        })
    })

    return await res.redirect('/')

})

app.get('/debug', (req, res) => {
    console.log(`mime: ${mimeTypes.extension('image/jpeg')}`)
})

app.get('/api/forums/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю форум')

    const forum = new ForumModel({ title: req.query.title })
    forum.save(function (err) {
        if (err) {
            return res.json({
                status: 'Error'
            })
        }
        return res.json({
            status: 'OK'
        })
    })

})

app.get('/api/forums/topics/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю обсуждение')

    const topic = new ForumTopicModel({ forum: req.query.forum, title: req.query.title, user: req.query.user })
    topic.save(function (err) {
        if (err) {
            return res.json({
                status: 'Error'
            })
        }
        return res.json({
            status: 'OK'
        })
    })

})

app.get('/api/forums/topics/msgs/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю сообщение')

    const msg = new ForumMsgModel({ user: req.query.user, topic: req.query.topic, content: req.query.content })
    msg.save(function (err) {
        if (err) {
            return res.json({
                status: 'Error'
            })
        }
        return res.json({
            status: 'OK'
        })
    })

})

app.get('/api/forum/topic/msgs/get', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = ForumMsgModel.find({ topic: req.query.topic })
    
    query.exec((err, msgs) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ msgs: msgs, status: 'OK' })
        }
    })

})

app.get('/api/forums/topics/msgs/all', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = ForumMsgModel.find({  })
    
    query.exec((err, msgs) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ msgs: msgs, status: 'OK' })
        }
    })

})

app.get('/api/news/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю новость')

    const news = new NewsModel({ title: req.query.title, content: req.query.content, game: req.query.game })
    news.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('**', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('возвращаю домашнюю страницу')

    res.redirect('/')

})

const port = 4000
// const port = process.env.PORT || 8080

var clients = []

const pathSeparator = path.sep
const pathToDir = `${__dirname}${pathSeparator}`
const statsFilePath = `${pathToDir}stats.txt`
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

server.listen(port, () => {
    
})