const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

// const server = require('http').createServer(app)
const server = require('http').Server(app)

const { Server } = require("socket.io");

// const io = new Server(server)
// const io = require("socket.io")(server, {
//     serveClient: false,
//     origins: '*:*',
//     transports: ['polling'],
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     cookie: false
// })
const io = require("socket.io")(server)

const nodemailer = require("nodemailer")

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
        io.sockets.emit('friend_send_msg_notification', msg)
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
    client.on('user_update_talk', (msg) => {
        console.log(`user update talk: ${msg}`)
        io.sockets.emit('friend_update_talk', msg)
    })
    client.on('user_add_reaction', (msg) => {
        console.log(`user add reaction: ${msg}`)
        io.sockets.emit('friend_add_reaction', msg)
    })
})

const bcrypt = require('bcrypt')
const mimeTypes = require('mime-types')

const saltRounds = 10

const fs = require('fs')

const multer  = require('multer')

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    // auth: {
    //     user: process.env.MAIL_LOGIN,
    //     pass: process.env.MAIL_PASSWORD
    // }
    auth: {
        user: 'glebdyakov2000@gmail.com',
        pass: 'ttolpqpdzbigrkhz'
    }
})

// const { ExpressPeerServer } = require('peer')
// const peerServer = ExpressPeerServer(server, {
//     debug: true
// })
// var lastPeerId = '#'
// var peerIndex = -1
// var peerClients = []
// peerServer.on('connection', function(client) {
//     lastPeerId = client.id
//     peerClients.push(lastPeerId)
//     peerIndex += 1
//     let clientPeerId = '#'
//     if (peerIndex === 1) {
//         clientPeerId = peerClients[0]
//     }
//     clientPeerId
//     console.log(`client с id: ${lastPeerId} был подключен под индексом ${peerIndex} , а id другого клиента ${clientPeerId}`)
//     console.log(`server._clients: ${server._clients}`)
//     io.sockets.emit('user_transfer_peer_id', `${peerIndex}|${lastPeerId}|${clientPeerId}`)
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

const talksStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const talkId = req.query.id
        const talkPath = `${pathToDir}uploads/talks`
        const isTalkPathExists = fs.existsSync(talkPath)
        const isTalkPathNotExists = !isTalkPathExists
        if (isTalkPathNotExists) {
            fs.mkdirSync(talkPath)
        }
        cb(null, `uploads/talks`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const talkId = req.query.id
        const talkPath = `${pathToDir}uploads/talks`
        const isTalkPathExists = fs.existsSync(talkPath)
        const isTalkPathNotExists = !isTalkPathExists
        const fileName = file.originalname
        const ext = path.extname(fileName)
        if (isTalkPathNotExists) {
            fs.mkdirSync(talkPath)
            cb(null, `${talkId}${ext}`)
        } else {
            cb(null, `${talkId}${ext}`)
        }
    }
})

const talksUpload = multer({ storage: talksStorage })

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
        const ext = mimeTypes.extension(req.query.imgext)
        if (isExperimentPathNotExists) {
            fs.mkdirSync(experimentPath)
            const mime = mimeTypes.lookup(file.originalname) || ''
            console.log(`mime: ${mime}`)
            const isWord = mime.includes('application/msword') || mime.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || mime.includes('application/vnd.ms-word.document.macroEnabled')
            if (isWord)
            {
                const ext = path.extname(file.originalname)
                console.log(`ext: ${ext}`)
                cb(null, `hash1${ext}`)
            } else {
                cb(null, `${experimentId}.${ext}`)
            }
        } else {
            const mime = mimeTypes.lookup(file.originalname) || ''
            console.log(`mime: ${mime}`)
            const isWord = mime.includes('application/msword') || mime.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || mime.includes('application/vnd.ms-word.document.macroEnabled')
            if (isWord) {
                const ext = path.extname(file.originalname)
                console.log(`ext: ${ext}`)
                cb(null, `hash1${ext}`)
            } else {
                cb(null, `${experimentId}.${ext}`)
            }
        }
    }
})
const experimentsUpload = multer({ storage: experimentsStorage })

const iconsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const iconPath = `${pathToDir}uploads/icons`
        const isIconPathExists = fs.existsSync(iconPath)
        const isIconPathNotExists = !isIconPathExists
        if (isIconPathNotExists) {
            fs.mkdirSync(iconPath)
        }
        cb(null, `uploads/icons`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const iconId = 'hash'
        const iconPath = `${pathToDir}uploads/icons`
        const isIconPathExists = fs.existsSync(iconPath)
        const isIconPathNotExists = !isIconPathExists
        const ext = mimeTypes.extension(req.query.ext)
        if (isIconPathNotExists) {
            fs.mkdirSync(iconPath)
            cb(null, `${iconId}${ext}`)
        } else {
            console.log(`ext: ${ext}`)
            cb(null, `${iconId}.${ext}`)
        }
    }
})
const iconUpload = multer({ storage: iconsStorage })

const pointsStoreItemsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pointsStoreItemPath = `${pathToDir}uploads/items`
        const isPointsStoreItemPathExists = fs.existsSync(pointsStoreItemPath)
        const isPointsStoreItemPathNotExists = !isPointsStoreItemPathExists
        if (isPointsStoreItemPathNotExists) {
            fs.mkdirSync(pointsStoreItemPath)
        }
        cb(null, `uploads/items`)
    },
    filename: function (req, file, cb) {
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const pointsStoreItemId = 'hash'
        const pointsStoreItemPath = `${pathToDir}uploads/items`
        const isPointsStoreItemPathExists = fs.existsSync(pointsStoreItemPath)
        const isPointsStoreItemPathNotExists = !isPointsStoreItemPathExists
        const ext = mimeTypes.extension(req.query.ext)
        if (isPointsStoreItemPathNotExists) {
            fs.mkdirSync(pointsStoreItemPath)
            cb(null, `${pointsStoreItemId}${ext}`)
        } else {
            console.log(`ext: ${ext}`)
            cb(null, `${pointsStoreItemId}.${ext}`)
        }
    }
})
const pointsStoreItemUpload = multer({ storage: pointsStoreItemsStorage })

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
    },
    points: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    phone: {
        type: String,
        default: ''
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    statusDate: {
        type: Date,
        default: Date.now()
    },
    lastGame: {
        type: String,
        default: 'mockId'
    },
    role: String,
    isNotificationsStartYearlyDiscount: {
        type: Boolean,
        default: true
    }
}, { collection : 'mygamers' })
    
const UserModel = mongoose.model('UserModel', UserSchema)

const UserNickNameSchema = new mongoose.Schema({
    user: String,
    nick: String
})

const UserNickNameModel = mongoose.model('UserNickNameModel', UserNickNameSchema)

const FriendAliasSchema = new mongoose.Schema({
    user: String,
    alias: String,
    friend: String
})

const FriendAliasModel = mongoose.model('FriendAliasModel', FriendAliasSchema)

const ExperimentSchema = new mongoose.Schema({
    title: String,
    desc: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'myexperiments' })
    
const ExperimentModel = mongoose.model('ExperimentModel', ExperimentSchema)

const PointsStoreItemSchema = new mongoose.Schema({
    title: String,
    desc: String,
    type: String,
    price: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_points_store_items' })
    
const PointsStoreItemModel = mongoose.model('PointsStoreItemModel', PointsStoreItemSchema)

const PointsStoreItemRelationSchema = new mongoose.Schema({
    item: String,
    user: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_points_store_item_relations' })
    
const PointsStoreItemRelationModel = mongoose.model('PointsStoreItemRelationModel', PointsStoreItemRelationSchema)

const ReviewSchema = new mongoose.Schema({
    game: String,
    user: String,
    desc: String,
    hours: Number,
    date: {
        type: Date,
        default: Date.now
    },
    advices: {
        type: Number,
        default: 0
    },
    funs: {
        type: Number,
        default: 0
    },
    isCommentsEnabled: Boolean,
    visibility: String,
    isFreeProduct: Boolean
}, { collection : 'myreviews' })
    
const ReviewModel = mongoose.model('ReviewModel', ReviewSchema)

const ReviewCommentSchema = new mongoose.Schema({
    user: String,
    review: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_review_comments' })
    
const ReviewCommentModel = mongoose.model('ReviewCommentModel', ReviewCommentSchema)

const ManualCommentSchema = new mongoose.Schema({
    user: String,
    manual: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_manual_comments' })
    
const ManualCommentModel = mongoose.model('ManualCommentModel', ManualCommentSchema)

const ActivitySchema = new mongoose.Schema({
    user: String,
    content: String,
    data: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_activities' })
    
const ActivityModel = mongoose.model('ActivityModel', ActivitySchema)

const IllustrationCommentSchema = new mongoose.Schema({
    user: String,
    illustration: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_illustration_comments' })
    
const IllustrationCommentModel = mongoose.model('IllustrationCommentModel', IllustrationCommentSchema)

const ScreenShotCommentSchema = new mongoose.Schema({
    user: String,
    screenShot: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_screenshot_comments' })
    
const ScreenShotCommentModel = mongoose.model('ScreenShotCommentModel', ScreenShotCommentSchema)

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
    },
    game: String,
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    favorites: {
        type: Number,
        default: 0
    }
}, { collection : 'mymanuals' })
    
const ManualModel = mongoose.model('ManualModel', ManualSchema)

const ManualVisitSchema = new mongoose.Schema({
    manual: String,
    user: String
}, { collection : 'my_manual_visits' })

const ManualVisitModel = mongoose.model('ManualVisitModel', ManualVisitSchema)

const ManualFavoriteRelationSchema = new mongoose.Schema({
    manual: String,
    user: String
}, { collection : 'my_manual_favorite_relations' })

const ManualFavoriteRelationModel = mongoose.model('ManualFavoriteRelationModel', ManualFavoriteRelationSchema)

const ScreenShotFavoriteRelationSchema = new mongoose.Schema({
    screenShot: String,
    user: String
}, { collection : 'my_screenshot_favorite_relations' })

const ScreenShotFavoriteRelationModel = mongoose.model('ScreenShotFavoriteRelationModel', ScreenShotFavoriteRelationSchema)

const IllustrationFavoriteRelationSchema = new mongoose.Schema({
    illustration: String,
    user: String
}, { collection : 'my_illustration_favorite_relations' })

const IllustrationFavoriteRelationModel = mongoose.model('IllustrationFavoriteRelationModel', IllustrationFavoriteRelationSchema)

const IllustrationSchema = new mongoose.Schema({
    title: String,
    desc: String,
    user: String,
    isDrm: Boolean,
    date: {
        type: Date,
        default: Date.now
    },
    game: String,
    likes: {
        type: Number,
        default: 0
    },
    visibility: String
}, { collection : 'myillustrations' })
    
const IllustrationModel = mongoose.model('IllustrationModel', IllustrationSchema)

const ScreenShotSchema = new mongoose.Schema({
    user: String,
    desc: String,
    spoiler: Boolean,
    date: {
        type: Date,
        default: Date.now
    },
    game: String,
    likes: {
        type: Number,
        default: 0
    },
    visibility: {
        type: String,
        default: 'Показывать всем'
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
    friend: String,
    alias: {
        type: String,
        default: ''
    }
}, { collection : 'myfriends' })
    
const FriendModel = mongoose.model('FriendModel', FriendSchema)

const MsgSchema = new mongoose.Schema({
    user: String,
    friend: String,
    content: String,
    type: String,
    channel: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'mymsgs' })

const MsgModel = mongoose.model('MsgModel', MsgSchema)

const MsgReactionSchema = new mongoose.Schema({
    msg: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection : 'my_msg_reactions' })

const MsgReactionModel = mongoose.model('MsgReactionModel', MsgReactionSchema)

const TalkSchema = new mongoose.Schema({
    title: String,
    owner: String,
    slogan: {
        type: String,
        default: ''
    }
}, { collection : 'my_talks' })

const TalkModel = mongoose.model('TalkModel', TalkSchema)

const TalkChannelSchema = new mongoose.Schema({
    title: String,
    talk: String
}, { collection : 'my_talk_channels' })

const TalkChannelModel = mongoose.model('TalkChannelModel', TalkChannelSchema)

const TalkRelationSchema = new mongoose.Schema({
    talk: String,
    user: String,
    isBlocked: {
        type: Boolean,
        default: false
    }
}, { collection : 'my_talk_relations' })

const TalkRelationModel = mongoose.model('TalkRelationModel', TalkRelationSchema)

const IconSchema = new mongoose.Schema({
    title: String,
    desc: String
}, { collection : 'my_icons' })

const IconModel = mongoose.model('IconModel', IconSchema)

const IconRelationSchema = new mongoose.Schema({
    icon: String,
    user: String,
    date: {
        type: Date,
        default: Date.now()
    },
}, { collection : 'my_icon_relations' })

const IconRelationModel = mongoose.model('IconRelationModel', IconRelationSchema)

const BlackListRelationSchema = new mongoose.Schema({
    user: String,
    friend: String
}, { collection : 'my_blacklist_relations' })

const BlackListRelationModel = mongoose.model('BlackListRelationModel', BlackListRelationSchema)

const GameSchema = new mongoose.Schema({
    name: String,
    platform: String,
    price: Number,
    users: {
        type: Number,
        default: 0
    },
    maxUsers: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    type: String,
    genre: String,
    date: {
        type: Date,
        default: Date.now()
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

const GameRelationSchema = new mongoose.Schema({
    game: String,
    user: String,
    hours: {
        type: Number,
        default: 0
    },
    lastGame: {
        type: Date,
        default: Date.now()
    }
}, { collection : 'my_game_relations' })

const GameRelationModel = mongoose.model('GameRelationModel', GameRelationSchema)

const GameSessionSchema = new mongoose.Schema({
    game: String,
    user: String,
    date: {
        type: Date,
        default: Date.now()
    }
}, { collection : 'my_game_sessions' })

const GameSessionModel = mongoose.model('GameSessionModel', GameSessionSchema)

const GroupRequestSchema = new mongoose.Schema({
    group: String,
    user: String
}, { collection : 'my_group_requests' })

const GroupRequestModel = mongoose.model('GroupRequestModel', GroupRequestSchema)

const TalkRoleSchema = new mongoose.Schema({
    talk: String,
    title: String,
    sendMsgs: Boolean,
    notifyAllUsers: Boolean,
    bindAndUnbindStreams: Boolean,
    kick: Boolean,
    block: Boolean,
    invite: Boolean,
    updateRoles: Boolean,
    assignRoles: Boolean,
    updateTalkTitleSloganAndAvatar: Boolean,
    createAndUpdateChannels: Boolean,
    isCustom: Boolean
}, { collection : 'my_talk_roles' })

const TalkRoleModel = mongoose.model('TalkRoleModel', TalkRoleSchema)

const TalkRoleRelationSchema = new mongoose.Schema({
    role: String,
    user: String,
    talk: String
}, { collection : 'my_talk_role_relations' })

const TalkRoleRelationModel = mongoose.model('TalkRoleRelationModel', TalkRoleRelationSchema)

const GameTagSchema = new mongoose.Schema({
    title: String
}, { collection : 'my_game_tags' })
    
const GameTagModel = mongoose.model('GameTagModel', GameTagSchema)

const GameTagRelationSchema = new mongoose.Schema({
    game: String,
    tag: String
}, { collection : 'my_game_tag_relations' })
    
const GameTagRelationModel = mongoose.model('GameTagRelationModel', GameTagRelationSchema)

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
    
    // console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/experiments/${req.query.id}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
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

app.get('/api/talk/photo', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/talks`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
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
                return res.sendFile(`${__dirname}/uploads/talks/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/icon/photo', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readdir(`${__dirname}/uploads/manuals`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
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
                return res.sendFile(`${__dirname}/uploads/icons/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/points/item/photo', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readdir(`${__dirname}/uploads/items`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
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
                return res.sendFile(`${__dirname}/uploads/items/${req.query.id}${ext}`)
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

    // console.log('отправляю документ')

        fs.readdir(`${__dirname}/uploads/experiments/${req.query.id}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_experiment_document.doc`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
                // const isWord = mime.includes('application/msword')
                const isWord = mime.includes('application/msword') || mime.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || mime.includes('application/vnd.ms-word.document.macroEnabled')
                if (isWord) {
                    ext = path.extname(file)
                    break
                }
            }
            const extLength = ext.length
            const isNotFound = extLength <= 0
            if (isNotFound) {
                return res.sendFile(`${__dirname}/uploads/defaults/default_experiment_document.doc`)
            } else {
                return res.sendFile(`${__dirname}/uploads/experiments/${req.query.id}/${req.query.id}${ext}`)
            }
        }
    })

})

app.get('/api/activities/all', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ActivityModel.find({  })
    
    query.exec((err, activities) => {
        if (err) {
            return res.json({ activities: [], "status": "Error" })
        } else {
            return res.json({ activities: activities, status: 'OK' })
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

app.get('/api/manuals/favorites/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ManualFavoriteRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/favorites/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ScreenShotFavoriteRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/favorites/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IllustrationFavoriteRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/games/tags/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GameTagModel.find({  })
    
    query.exec((err, tags) => {
        if (err) {
            return res.json({ tags: [], "status": "Error" })
        } else {
            return res.json({ tags: tags, status: 'OK' })
        }
    })
    
})

app.get('/api/games/tags/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GameTagRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/users/nicks/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = UserNickNameModel.find({  })
    
    query.exec((err, nicks) => {
        if (err) {
            return res.json({ nicks: [], "status": "Error" })
        } else {
            return res.json({ nicks: nicks, status: 'OK' })
        }
    })
    
})

app.get('/api/friends/aliases/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = FriendAliasModel.find({  })
    
    query.exec((err, aliases) => {
        if (err) {
            return res.json({ aliases: [], "status": "Error" })
        } else {
            return res.json({ aliases: aliases, status: 'OK' })
        }
    })
    
})

app.get('/api/talks/roles/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkRoleModel.find({  })
    
    query.exec((err, roles) => {
        if (err) {
            return res.json({ roles: [], "status": "Error" })
        } else {
            return res.json({ roles: roles, status: 'OK' })
        }
    })
    
})

app.get('/api/talks/roles/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkRoleRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/talks/channels/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkChannelModel.find({  })
    
    query.exec((err, channels) => {
        if (err) {
            return res.json({ channels: [], "status": "Error" })
        } else {
            return res.json({ channels: channels, status: 'OK' })
        }
    })
    
})

app.get('/api/talks/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkModel.find({  })
    
    query.exec((err, talks) => {
        if (err) {
            return res.json({ talks: [], "status": "Error" })
        } else {
            return res.json({ talks: talks, status: 'OK' })
        }
    })
    
})

app.get('/api/points/items/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = PointsStoreItemModel.find({  })
    
    query.exec((err, items) => {
        if (err) {
            return res.json({ items: [], "status": "Error" })
        } else {
            return res.json({ items: items, status: 'OK' })
        }
    })
    
})

app.get('/api/points/items/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = PointsStoreItemModel.findOne({ _id: req.query.id })
    
    query.exec((err, item) => {
        if (err) {
            return res.json({ item: null, "status": "Error" })
        } else {
            return res.json({ item: item, status: 'OK' })
        }
    })
    
})

app.get('/api/points/items/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await PointsStoreItemModel.deleteMany((err, items) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/favorites/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ManualFavoriteRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/favorites/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IllustrationFavoriteRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/games/tags/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GameTagModel.deleteMany((err, tags) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/games/tags/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GameTagRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            return res.json({ status: 'OK' })
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

app.get('/api/reviews/comments/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ReviewCommentModel.find({  })
    
    query.exec((err, comments) => {
        if (err) {
            return res.json({ comments: [], "status": "Error" })
        } else {
            return res.json({ comments: comments, status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/comments/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ManualCommentModel.find({  })
    
    query.exec((err, comments) => {
        if (err) {
            return res.json({ comments: [], "status": "Error" })
        } else {
            return res.json({ comments: comments, status: 'OK' })
        }
    })
    
})

app.get('/api/illustrations/comments/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IllustrationCommentModel.find({  })
    
    query.exec((err, comments) => {
        if (err) {
            return res.json({ comments: [], "status": "Error" })
        } else {
            return res.json({ comments: comments, status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/comments/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ScreenShotCommentModel.find({  })
    
    query.exec((err, comments) => {
        if (err) {
            return res.json({ comments: [], "status": "Error" })
        } else {
            return res.json({ comments: comments, status: 'OK' })
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

app.get('/api/manuals/visits/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = ManualVisitModel.find({  })
    
    query.exec((err, visits) => {
        if (err) {
            return res.json({ visits: [], "status": "Error" })
        } else {
            return res.json({ visits: visits, status: 'OK' })
        }
    })
    
})

app.get('/api/icons/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IconModel.find({  })
    
    query.exec((err, icons) => {
        if (err) {
            return res.json({ icons: [], "status": "Error" })
        } else {
            return res.json({ icons: icons, status: 'OK' })
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

app.get('/api/talks/get', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkModel.findOne({ _id: req.query.id })
    
    query.exec((err, talk) => {
        if (err) {
            return res.json({ talk: null, "status": "Error" })
        } else {
            return res.json({ talk: talk, status: 'OK' })
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

app.get('/api/activities/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ActivityModel.deleteMany((err, groups) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/channels/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkChannelModel.deleteMany((err, talks) => {
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

app.get('/api/manuals/visits/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ManualVisitModel.deleteMany((err, visits) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/icons/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IconModel.deleteMany((err, icons) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/icons/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IconRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkRelationModel.deleteOne({ talk: req.query.id, user: req.query.user }, (err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/channels/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkChannelModel.deleteOne({ _id: req.query.id }, (err, channel) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/favorites/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ManualFavoriteRelationModel.deleteOne({ manual: req.query.manual, user: req.query.user }, (err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            ManualModel.updateOne({ _id: req.query.manual }, 
            { 
                "$inc": { "favorites": -1 }
            }, (err, manual) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }
                return res.json({ status: 'OK' })
            })
        }
    })
    
})

app.get('/api/illustrations/favorites/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IllustrationFavoriteRelationModel.deleteOne({ illustration: req.query.illustration, user: req.query.user }, (err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/favorites/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ScreenShotFavoriteRelationModel.deleteOne({ screenShot: req.query.screenshot, user: req.query.user }, (err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/relations/clear', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkModel.deleteMany((err, talks) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/roles/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkRoleModel.deleteMany((err, talks) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/roles/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkRoleRelationModel.deleteMany((err, talks) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/games/relations/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GameRelationModel.deleteOne({ user: req.query.user, game: req.query.game }, (err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/games/relations/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GameRelationModel.deleteMany((err, relations) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/games/sessions/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await GameSessionModel.deleteMany((err, sessions) => {
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

app.get('/api/illustrations/comments/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await IllustrationCommentModel.deleteMany((err, comments) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/screenshots/comments/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ScreenShotCommentModel.deleteMany((err, comments) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/reviews/comments/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ReviewCommentModel.deleteMany((err, comments) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/manuals/comments/delete', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await ManualCommentModel.deleteMany((err, comments) => {
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

app.get('/api/points/items/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = PointsStoreItemRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/games/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GameRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/games/sessions/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = GameSessionModel.find({  })
    
    query.exec((err, sessions) => {
        if (err) {
            return res.json({ sessions: [], "status": "Error" })
        } else {
            return res.json({ sessions: sessions, status: 'OK' })
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

app.get('/api/icons/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = IconRelationModel.find({  })
    
    query.exec((err, relations) => {
        if (err) {
            return res.json({ relations: [], "status": "Error" })
        } else {
            return res.json({ relations: relations, status: 'OK' })
        }
    })
    
})

app.get('/api/talks/relations/all', (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    let query = TalkRelationModel.find({  })
    
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

app.get('/api/msgs/reactions/get', (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    
    let query = MsgReactionModel.find({  })
    
    query.exec((err, reactions) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ reactions: reactions, status: 'OK' })
        }
    })
    
})

app.get('/api/msgs/remove', async (req, res) => {  
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    
    await MsgModel.deleteOne({ _id: req.query.id }, async (err, msg) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
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
                const user = new UserModel({ login: req.query.login, password: encodedPassword, name: req.query.login, country: 'Россия', about: 'Информация отсутствует.', role: req.query.role  })
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
    
    let query = FriendRequestModel.find({ user: req.query.id, friend: req.query.friend })
    query.exec((err, requests) => {
        if (err) {
            return res.json({ "status": "Error", 'requests': friendRequests })
        } else {
            let countRequests = requests.length
            const isNotHaveRequests = countRequests <= 0
            if (isNotHaveRequests) {
                const friendRequest = new FriendRequestModel({ user: req.query.id, friend: req.query.friend })
                friendRequest.save(function (err) {
                    if (err) {
                        return res.json({ "status": "Error" })
                    } else {
                        return res.json({ "status": "OK" })
                    }
                })
            } else {
                return res.json({ "status": "Error" })
            }
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

app.get('/api/points/items/relations/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const relation = new PointsStoreItemRelationModel({ item: req.query.id, user: req.query.user })
    relation.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const price = req.query.price
            UserModel.updateOne({ _id: req.query.user }, 
            { 
                "$inc": { "amount": -price }
            }, (err, user) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/friend/alias/set', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    FriendModel.updateOne({ _id: req.query.id }, 
    { 
        alias: req.query.alias
    }, (err, friend) => {
        if (err) {
            return res.json({ "status": "Error" })
        }  
        return res.json({ "status": "OK" })
    })

})

app.get('/api/user/games/last/set', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.updateOne({ _id: req.query.id }, 
    { 
        lastGame: req.query.game
    }, (err, user) => {
        if (err) {
            return res.json({ "status": "Error" })
        }  
        return res.json({ "status": "OK" })
    })

})

app.get('/api/games/relations/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const gameRelation = new GameRelationModel({ game: req.query.id, user: req.query.user })
    gameRelation.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const price = req.query.price
            UserModel.updateOne({ _id: req.query.user }, 
            { 
                "$inc": { "amount": -price }
            }, (err, user) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/games/sessions/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const gameSession = new GameSessionModel({ game: req.query.id, user: req.query.user })
    gameSession.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/icons/relations/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const iconRelation = new IconRelationModel({ icon: req.query.id, user: req.query.user })
    iconRelation.save(function (err) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
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
                    return res.json({ "status": "OK", id: groupId })
                }   
            })
        }
    })

})

app.get('/api/activities/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const activity = new ActivityModel({ user: req.query.id, content: req.query.content, data: req.query.data })
    activity.save(function (err, activity) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/friend/aliases/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const alias = new FriendAliasModel({ user: req.query.id, alias: req.query.alias, friend: req.query.friend })
    alias.save(function (err, alias) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/user/nicks/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const nickName = new UserNickNameModel({ user: req.query.id, nick: req.query.nick })
    nickName.save(function (err, nick) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/talks/roles/create', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const role = new TalkRoleModel({
        title: req.query.title,
        talk: req.query.id,
        sendMsgs: false,
        notifyAllUsers: false,
        bindAndUnbindStreams: false,
        kick: false,
        block: false,
        invite: false,
        updateRoles: false,
        assignRoles: false,
        updateTalkTitleSloganAndAvatar: false,
        createAndUpdateChannels: false,
        isCustom: true
    })
    role.save(function (err, role) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/talks/roles/edit', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    TalkRoleModel.updateOne({ _id: req.query.id },
    {
        sendMsgs: req.query.sendMsgs,
        notifyAllUsers: req.query.notifyAllUsers,
        bindAndUnbindStreams: req.query.bindAndUnbindStreams,
        kick: req.query.kick,
        block: req.query.block,
        invite: req.query.invite,
        updateRoles: req.query.updateRoles,
        assignRoles: req.query.assignRoles,
        updateTalkTitleSloganAndAvatar: req.query.updateTalkTitleSloganAndAvatar,
        createAndUpdateChannels: req.query.createAndUpdateChannels
    }, (err, role) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })

})

app.get('/api/talks/roles/relations/create', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const relation = new TalkRoleRelationModel({
        role: req.query.id,
        user: req.query.user,
        talk: req.query.talk
    })
    relation.save(function (err, role) {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ "status": "OK" })
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

app.get('/api/talks/roles/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    TalkRoleModel.findOne({ _id: req.query.id }, (err, role) => {
        if (err) {
            return res.json({ role: null, status: 'Error' })
        } else {
            return res.json({ role: role, status: 'OK' })
        }
    })

})

app.get('/api/icons/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    IconModel.findOne({ _id: req.query.id }, (err, icon) => {
        if (err) {
            return res.json({ icon: null, status: 'Error' })
        } else {
            return res.json({ icon: icon, status: 'OK' })
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

app.get('/api/talks/roles/relations/remove', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = TalkRoleRelationModel.findOne({ _id: req.query.id })
    query.exec((err, relation) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            const relationUserId = relation.user
            const relationRoleId = relation.role
            let query = TalkRoleModel.findOne({ _id: relationRoleId })
            query.exec(async (err, role) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }
                const roleTitle = role.title
                const isAllUsersRole = roleTitle === 'Все участники'
                if (isAllUsersRole) {
                    const roleTalkId = role.talk
                    await TalkRelationModel.deleteOne({ talk: roleTalkId, user: relationUserId }, async (err, relation) => {
                        if (err) {
                            return res.json({ "status": "Error" })
                        } else {
                            await TalkRoleRelationModel.deleteMany({ user: relationUserId, talk: roleTalkId })
                            return res.json({ status: 'OK' })
                        }
                    })
                } else {
                    await TalkRoleRelationModel.deleteOne({ _id: req.query.id })
                    return res.json({ status: 'OK' })    
                }
            })
        }
    })

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
    
    const msg = new MsgModel({ user: req.query.user, friend: req.query.friend, content: req.query.content, type: req.query.type, channel: req.query.channel })
    msg.save(function (err, msg) {
        if (err) {
            console.log(`Ошибка отправки сообщения`)
            return res.json({ "status": "Error", id: '', content: '' })
        } else {
            const msgId = msg.id
            console.log(`сообщение отправлено`)
            return res.json({ "status": "OK", id: msgId, content: '' })
        }
    })

})

app.get('/api/msgs/reactions/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const reaction = new MsgReactionModel({ msg: req.query.id, content: req.query.content })
    reaction.save(function (err, reaction) {
        if (err) {
            console.log(`Ошибка сохранения реакции`)
            return res.json({ "status": "Error" })
        } else {
            console.log(`реакция сохранена`)
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/manuals/visits/add', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const visit = new ManualVisitModel({ manual: req.query.id, user: req.query.user })
    visit.save(function (err, generatedVisit) {
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

app.post('/api/manuals/add', manualsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    console.log(`id: ${req.query.id},title: ${req.query.title},lang: ${req.query.lang},categories: ${req.query.categories},isDrm: ${req.query.drm}`)

    const manual = new ManualModel({ user: req.query.id, desc: req.query.desc, title: req.query.title, lang: req.query.lang, categories: req.query.categories, isDrm: req.query.drm, game: req.query.game })
    manual.save(function (err, generatedManual) {
        
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
    
    const review = new ReviewModel({ desc: req.query.desc, game: req.query.game, hours: req.query.hours, user: req.query.id, isCommentsEnabled: req.query.comments, visibility: req.query.visibility, isFreeProduct: req.query.free })
    review.save(function (err, generatedReview) {
        if (err) {
            console.log('создаю обзор ошибка')
            return res.json({ "status": "Error" })
        } else {
            console.log('создаю обзор успешно')
            const generatedReviewId = generatedReview._id
            return res.json({ "status": "OK", 'id': generatedReviewId })
        }
    })

})

app.get('/api/illustrations/comments/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const comment = new IllustrationCommentModel({ content: req.query.content, illustration: req.query.id, user: req.query.user })
    comment.save(function (err, generatedComment) {
        if (err) {
            console.log('создаю комментарий ошибка')
            return res.json({ "status": "Error" })
        } else {
            console.log('создаю комментарий успешно')
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/screenshots/comments/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const comment = new ScreenShotCommentModel({ content: req.query.content, screenShot: req.query.id, user: req.query.user })
    comment.save(function (err, generatedComment) {
        if (err) {
            console.log('создаю комментарий ошибка')
            return res.json({ "status": "Error" })
        } else {
            console.log('создаю комментарий успешно')
            return res.json({ "status": "OK" })
        }
    })

})

app.get('/api/reviews/comments/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const review = new ReviewCommentModel({ content: req.query.content, review: req.query.id, user: req.query.user })
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

app.get('/api/manuals/comments/add', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const review = new ManualCommentModel({ content: req.query.content, manual: req.query.id, user: req.query.user })
    review.save(function (err, generatedComment) {
        if (err) {
            console.log('создаю комментарий ошибка')
            return res.json({ "status": "Error" })
        } else {
            console.log('создаю комментарий успешно')
            return res.json({ "status": "OK" })
        }
    })

})

app.post('/api/illustrations/add', illustrationsUpload.any(), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const illustration = new IllustrationModel({ user: req.query.id, desc: req.query.desc, title: req.query.title, isDrm: req.query.drm, game: req.query.game, visibility: req.query.visibility })
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
    
    const screenshot = new ScreenShotModel({ user: req.query.id, desc: req.query.desc, isSpoiler: req.query.spoiler, game: req.query.game })
    screenshot.save(function (err, generatedScreenShot) {
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

        // return res.redirect('/')
        return res.json({
            status: 'OK',
            id: generatedId
        })

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
            return res.json({ "status": "Error", id: '', content: '' })
        } else {
            const generatedId = newMsg._id
            const mime = req.query.ext
            console.log(`generatedId: ${generatedId}`)
            MsgModel.updateOne({ _id: generatedId },
            {
                content: mime
            }, (err, msg) => {
                if (err) {
                    return res.json({ status: 'Error', id: '', content: '' })        
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

app.get('/api/friends/aliases/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await FriendAliasModel.deleteMany({  })

    return res.json({
        'status': 'OK'
    })

})

app.get('/api/users/nicks/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await UserNickNameModel.deleteMany({  })

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

app.get('/api/msgs/reactions/delete', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    await MsgReactionModel.deleteMany({  })

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
    
    // console.log('отправляю аватар')

    fs.readdir(`${__dirname}/uploads/users/${req.query.id}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_avatar.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
                const isImg = mime.includes('image')
                if (isImg) {
                    ext = path.extname(file)
                    break
                }
            }
            const extLength = ext.length
            const isNotFound = extLength <= 0
            if (isNotFound) {
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
    
    // console.log('отправляю миниатюру')

    fs.readdir(`${__dirname}/uploads/games/${req.query.name}`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
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
    
    // console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/manuals`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
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
    
    // console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/illustrations`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
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
    
    // console.log('отправляю фото')

    fs.readdir(`${__dirname}/uploads/screenShots`, (err, data) => {
        if (err) {
            return res.sendFile(`${__dirname}/uploads/defaults/default_thumbnail.png`)
        } else {
            let ext = ''
            for (let file of data) {
                const mime = mimeTypes.lookup(file) || ''
                // console.log(`file: ${file}; mime: ${mime}`)
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
    
    // console.log('отправляю миниатюру сообщения')

    return res.sendFile(`${__dirname}/uploads/msgs/${req.query.id}${req.query.content}`)

})

app.get('/api/game/distributive', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('Content-disposition', 'attachment; filename='+ `${req.query.name}.exe`);
    
    // console.log(`отправляю дистрибутив ${__dirname}/uploads/games/${req.query.name}/${req.query.name}.exe ${req.query.name}.exe`)

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

app.get('/api/user/name/set', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.updateOne({ _id: req.query.id },
    {
        name: req.query.name
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })

})

app.get('/api/screenshot/visibility/set', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    ScreenShotModel.updateOne({ _id: req.query.id },
    {
        visibility: req.query.visibility
    }, (err, screenShot) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })

})

app.post('/api/talk/edit', talksUpload.any(), (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    TalkModel.updateOne({ _id: req.query.id },
    {
        title: req.query.title,
        slogan: req.query.slogan
    }, (err, talk) => {
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
        status: req.query.status,
        statusDate: Date.now()
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
})

app.get('/api/users/email/confirm', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.updateOne({ _id: req.query.id },
    {
        isEmailConfirmed: true
    }, (err, user) => {
        const headers = {
            'Location': 'https://google.com'
        }
        res.writeHead(302, headers)
        res.end()
        return res
    })
})

app.get('/api/talks/relations/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    const relation = new TalkRelationModel({ talk: req.query.id, user: req.query.user })
    relation.save(async function (err) {
        const msgId = req.query.msg
        const isMsgId = msgId !== 'mockMsgId' 
        if (isMsgId) {
            await MsgModel.deleteOne({ _id: req.query.msg }, (err) => {
                const headers = {
                    'Location': 'https://google.com'
                }
                res.writeHead(302, headers)
                res.end()
                return res
            })   
        } else {
            let query = TalkRoleModel.findOne({ title: 'Все участники', talk: req.query.id })
            query.exec((err, role) => {
                const roleId = role._id
                const roleRelation = new TalkRoleRelationModel({
                    role: roleId,
                    user: req.query.user,
                    talk: req.query.id,
                })
                roleRelation.save(function (err, role) {
                    const headers = {
                        'Location': 'https://google.com'
                    }
                    res.writeHead(302, headers)
                    res.end()
                    return res
                })
            })
        }
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
    
    await UserModel.deleteOne({ _id: req.query.id }, async (err, data) => {
        if (err) {
            return res.json({ status: 'Error' })
        }
        await FriendModel.deleteMany({ $or: [{ user: req.query.id }, { friend: req.query.id }] }, (err, relations) => {
            if (err) {
                return res.json({ status: 'Error' })
            } else {
                return res.json({ status: 'OK' })
            }
        })
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

app.get('/api/users/amount/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = UserModel.findOne({'_id': req.query.id }, function(err, user) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            UserModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "amount": req.query.amount }
            }, (err, user) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/reviews/advices/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ReviewModel.findOne({'_id': req.query.id }, function(err, review) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ReviewModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "advices": 1 }
            }, (err, review) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/reviews/funs/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ReviewModel.findOne({'_id': req.query.id }, function(err, review) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ReviewModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "funs": 1 }
            }, (err, review) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/manuals/likes/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ManualModel.findOne({'_id': req.query.id }, function(err, manual) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ManualModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "likes": 1 }
            }, (err, manual) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/illustrations/likes/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = IllustrationModel.findOne({'_id': req.query.id }, function(err, illustration) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            IllustrationModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "likes": 1 }
            }, (err, illustration) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/screenshots/likes/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ScreenShotModel.findOne({'_id': req.query.id }, function(err, screenShot) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ScreenShotModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "likes": 1 }
            }, (err, screenShot) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/manuals/dislikes/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ManualModel.findOne({'_id': req.query.id }, function(err, manual) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ManualModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "dislikes": 1 }
            }, (err, manual) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/manuals/favorites/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ManualModel.findOne({'_id': req.query.id }, function(err, manual) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            ManualModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "favorites": 1 }
            }, (err, manual) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }
                const relation = new ManualFavoriteRelationModel({ manual: req.query.id, user: req.query.user })
                relation.save(function (err, relation) {
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
        }
    })

})

app.get('/api/screenshots/favorites/add', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = ScreenShotModel.findOne({'_id': req.query.id }, function(err, screnShot) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            const relation = new ScreenShotFavoriteRelationModel({ screenShot: req.query.id, user: req.query.user })
            relation.save(function (err, relation) {
                if (err) {
                    return res.json({
                        status: 'Error'
                    })
                }
                return res.json({
                    status: 'OK'
                })
            })
        }
    })

})

app.get('/api/illustrations/favorites/add', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = IllustrationModel.findOne({'_id': req.query.id }, function(err, illustration) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            const relation = new IllustrationFavoriteRelationModel({ illustration: req.query.id, user: req.query.user })
            relation.save(function (err, relation) {
                if (err) {
                    return res.json({
                        status: 'Error'
                    })
                }
                return res.json({
                    status: 'OK'
                })
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

app.get('/api/games/likes/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    GameModel.findOne({'_id': req.query.id }, function(err, game) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            GameModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "likes": 1 }
            }, (err, game) => {
                if (err) {
                    return res.json({ "status": "Error" })
                }  
                return res.json({ "status": "OK" })
            })
        }
    })

})

app.get('/api/users/points/increase', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    UserModel.findOne({'_id': req.query.id }, function(err, user) {
        if (err) {
            res.json({ "status": "Error" })
        } else {
            UserModel.updateOne({ _id: req.query.id }, 
            { 
                "$inc": { "points": 1 }
            }, (err, user) => {
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
            const statsDataYearlyDiscount = statsData.yearlyDiscount
            const updatedUsersCount = statsDataUsers + 1
            let updatedMaxUsersCount = statsDataMaxUsers
            const isUpdateMaxUsersCount = updatedUsersCount > statsDataMaxUsers
            if (isUpdateMaxUsersCount) {
                updatedMaxUsersCount = updatedUsersCount
            }
            const updatedStatsData = {
                users: updatedUsersCount,
                maxUsers: updatedMaxUsersCount,
                yearlyDiscount: statsDataYearlyDiscount
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
            const statsDataYearlyDiscount = statsData.yearlyDiscount
            const updatedUsersCount = statsDataUsers - 1
            const updatedStatsData = {
                users: updatedUsersCount,
                maxUsers: statsDataMaxUsers,
                yearlyDiscount: statsDataYearlyDiscount
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
            const yearlyDiscount = statsData.yearlyDiscount
            return res.json({
                status: 'OK',
                users: usersCount,
                maxUsers: maxUsersCount,
                yearlyDiscount: yearlyDiscount
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

    const game = new GameModel({ name: req.query.name, platform: req.query.platform, price: req.query.price, type: req.query.type, genre: req.query.genre })
    game.save(function (err, generatedGame) {
        const generatedGameId = generatedGame._id
        const rawTagRelations = req.query.tags
        const tagRelations = rawTagRelations.split(',')
        let query = GameTagModel.find({  })
        query.exec((err, tags) => {
            let tagCursor = -1
            for (let tagRelation of tagRelations) {
                tagCursor++
                const isAddRelation = tagRelation === 'true'
                if (isAddRelation) {
                    const currentTag = tags[tagCursor];
                    const currentTagId = currentTag._id
                    const tagRelation = new GameTagRelationModel({ tag: currentTagId, game: generatedGameId })
                    tagRelation.save(function (err) {
                        
                    })
                }
            }
        })
    })
    return await res.redirect('/')

})

app.post('/api/icons/create', iconUpload.fields([{name: 'icon', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю значок')

    const icon = new IconModel({ title: req.query.title, desc: req.query.desc })
    icon.save(function (err, generatedIcon) {
        const generatedId = generatedIcon._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const iconPath = `${pathToDir}uploads/icons/hash.${mimeTypes.extension(req.query.ext)}`
        const newIconPath = `${pathToDir}uploads/icons/${generatedId}.${mimeTypes.extension(req.query.ext)}`
        fs.rename(iconPath, newIconPath, (err) => {
            
        })
    })
    
    return await res.redirect('/')

})

app.post('/api/points/items/create', pointsStoreItemUpload.fields([{name: 'preview', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю элемент магазина очков')

    const icon = new PointsStoreItemModel({ title: req.query.title, desc: req.query.desc, type: req.query.type, price: req.query.price })
    icon.save(function (err, generatedItem) {
        const generatedId = generatedItem._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        const pointsStoreItemPath = `${pathToDir}uploads/items/hash.${mimeTypes.extension(req.query.ext)}`
        const newPointsStoreItemPath = `${pathToDir}uploads/items/${generatedId}.${mimeTypes.extension(req.query.ext)}`
        fs.rename(pointsStoreItemPath, newPointsStoreItemPath, (err) => {
            
        })
    })
    
    return await res.redirect('/')

})

app.post('/api/experiments/create', experimentsUpload.fields([{name: 'experimentPhoto', maxCount: 1}, {name: 'experimentDocument', maxCount: 1}]), async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log(`создаю эксперимент: ${req.query.imgext}`)

    const experiment = new ExperimentModel({ title: req.query.title, desc: req.query.desc })
    experiment.save(function (err, generatedExperiment) {
        const generatedId = generatedExperiment._id
        const pathSeparator = path.sep
        const pathToDir = `${__dirname}${pathSeparator}`
        
        const experimentFolderPath = `${pathToDir}uploads/experiments/${generatedId}`
        fs.mkdirSync(experimentFolderPath)
        
        let experimentPath = `${pathToDir}uploads/experiments/hash.${mimeTypes.extension(req.query.imgext)}`
        let newExperimentPath = `${experimentFolderPath}/${generatedId}.${mimeTypes.extension(req.query.imgext)}`
        fs.rename(experimentPath, newExperimentPath, (err) => {
            console.log(`req.query.imgext: ${req.query.imgext} req.query.docext: ${req.query.docext}`)
            // experimentPath = `${pathToDir}uploads/experiments/hash1.doc`
            experimentPath = `${pathToDir}uploads/experiments/hash1.${mimeTypes.extension(req.query.docext)}`
          
            fs.readdir(`${pathToDir}uploads/experiments`, async (err, data) => {
                if (err) {
                    
                } else {
                    for (let file of data) {
                        const mime = mimeTypes.lookup(file) || ''
                        const isWord = mime.includes('application/msword') || mime.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || mime.includes('application/vnd.ms-word.document.macroEnabled')
                        console.log(`mime isword: ${mime} isword: ${isWord}`)
                        if (isWord) {
                            
                            experimentPath = `${pathToDir}uploads/experiments/hash1.${mimeTypes.extension(mime)}`

                            newExperimentPath = `${experimentFolderPath}/${generatedId}.${mimeTypes.extension(mime)}`
                            break
                        }
                    }
                    await fs.rename(experimentPath, newExperimentPath, (err) => {
                
                    })
                }
            })

            // newExperimentPath = `${experimentFolderPath}/${generatedId}.${mimeTypes.extension(req.query.docext)}`
            // fs.rename(experimentPath, newExperimentPath, (err) => {
                
            // })

        })
    })

    return await res.redirect('/')

})

app.get('/api/users/notify', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = UserModel.find({ })
    query.exec((err, users) => {
        if(err){
            return res.json({ "status": "Error" })
        }
        users.map((user) => {
            const isCanNotify = user.isNotificationsStartYearlyDiscount
            if (isCanNotify) {
                let mailOptions = {
                    from: `"${'gdlyeabkov'}" <${"gdlyeabkov"}>`,
                    to: `${user.login}`,
                    subject: `Ежегодняя акция в Office ware game manager`,
                    html: `<h3>Здравствуйте, начинается ежегодняя акция!</h3><p>Спешите приобрести товары с ${req.query.start} по ${req.query.end}.</p>`,
                }
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        return res.json({ status: 'Error', error: err })
                    }
                })
            }
        })
    })
    
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
                maxUsers: updatedMaxUsersCount,
                yearlyDiscount: {
                    start: req.query.start,
                    end: req.query.end
                }
            }
            const updatedRawStatsData = JSON.stringify(updatedStatsData)
            fs.writeFile(statsFilePath, updatedRawStatsData, (err, data) => {
                if (err) {
                    return res.json({ status: 'Error', error: err })
                } else {
                    return res.json({ status: 'OK', error: null })
                }
            })
        } 
    })

})

app.get('/debug', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    return res.json({ status: 'OK', error: null })

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

app.get('/api/games/tags/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю тег')

    const tag = new GameTagModel({ title: req.query.title })
    tag.save(function (err) {
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

app.get('/api/talks/channels/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю канал')

    const channel = new TalkChannelModel({ talk: req.query.id, title: req.query.title, })
    channel.save(function (err) {
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

app.get('/api/talks/roles/remove', async (req, res) => {    
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
       
    await TalkRoleModel.deleteOne({ _id: req.query.id }, (err, role) => {
        if (err) {
            return res.json({ "status": "Error" })
        } else {
            return res.json({ status: 'OK' })
        }
    })
    
})

app.get('/api/talks/create', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log('создаю беседу')

    const talk = new TalkModel({ title: req.query.title, owner: req.query.owner })
    talk.save(function (err, talk) {
        if (err) {
            return res.json({
                id: 'mockId',
                status: 'Error'
            })
        }
        const talkId = talk._id
        const relation = new TalkRelationModel({ talk: talkId, user: req.query.owner })
        relation.save(function (err) {
            if (err) {
                return res.json({
                    id: talkId,
                    "status": "Error"
                })
            }
            else {
                const channel = new TalkChannelModel({ talk: talkId, title: 'Основной' })
                channel.save(function (err) {
                    if (err) {
                        return res.json({
                            id: talkId,
                            status: 'Error'
                        })
                    }
                    const role = new TalkRoleModel({
                        title: 'Все участники',
                        talk: talkId,
                        sendMsgs: true,
                        notifyAllUsers: true,
                        bindAndUnbindStreams: true,
                        kick: false,
                        block: false,
                        invite: true,
                        updateRoles: false,
                        assignRoles: false,
                        updateTalkTitleSloganAndAvatar: true,
                        createAndUpdateChannels: true,
                        isCustom: false
                    })
                    role.save(function (err, role) {
                        if (err) {
                            return res.json({
                                id: talkId,
                                "status": "Error"
                            })
                        } else {
                            
                            const roleId = role._id
                            const roleRelation = new TalkRoleRelationModel({
                                role: roleId,
                                user: req.query.owner,
                                talk: talkId,
                            })
                            roleRelation.save(function (err, roleRelation) {
                                if (err) {
                                    return res.json({
                                        id: talkId,
                                        "status": "Error"
                                    })
                                } else {
                                    return res.json({
                                        id: talkId,
                                        status: 'OK'
                                    })
                                }  
                            })

                        }
                    })
                })
            }   
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

app.get('/api/forum/topic/msgs/all', async (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = ForumMsgModel.find({  })
    
    query.exec((err, msgs) => {
        if (err) {
            return res.json({ msgs: [], "status": "Error" })
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

app.get('/api/users/email/set', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    UserModel.updateOne({ _id: req.query.id },
    {
        login: req.query.email,
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
    
})

app.get('/api/user/discount/set', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    UserModel.updateOne({ _id: req.query.id },
    {
        isNotificationsStartYearlyDiscount: req.query.value,
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
    
})

app.get('/api/talks/relations/block/toggle', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    TalkRelationModel.findOne({ _id: req.query.id }, (err, relation) => {
        if (err) {
            return res.json({ status: 'Error' })
        } else {
            const isBlocked = relation.isBlocked
            const toggledValue = !isBlocked
            TalkRelationModel.updateOne({ _id: req.query.id },
            {
                isBlocked: toggledValue
            }, (err, relation) => {
                if (err) {
                    return res.json({ status: 'Error' })        
                }
                return res.json({ status: 'OK' })
            })
        }
    })
    
})

app.get('/api/users/phone/set', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    UserModel.updateOne({ _id: req.query.id },
    {
        phone: req.query.phone,
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
    
})

app.get('/api/users/email/set/accept', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let mailOptions = {
        from: `"${'gdlyeabkov'}" <${"gdlyeabkov"}>`,
        to: `${req.query.to}`,
        subject: `Подтверждение аккаунта Office ware game manager`,
        html: `<h3>Здравствуйте, ${req.query.to}!</h3><p>${req.query.code}</p><p>Код для смены E-mail вашего аккаунта Office ware game manager</p>`,
    }
    transporter.sendMail(mailOptions, function (err, info) {
        // if (err) {
        //     return res.json({ status: 'Error' })
        // } else {
        //     return res.json({ status: 'OK' })
        // }
    })

    console.log(`отправил письмо на ${req.query.to} для обновления почты код: ${req.query.code}`)

    return res.json({ status: 'OK' })
    
})

app.get('/api/users/password/set', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let encodedPassword = "#"
    const salt = bcrypt.genSalt(saltRounds)
    encodedPassword = bcrypt.hashSync(req.query.password, saltRounds)

    UserModel.updateOne({ _id: req.query.id },
    {
        password: encodedPassword,
    }, (err, user) => {
        if (err) {
            return res.json({ status: 'Error' })        
        }
        return res.json({ status: 'OK' })
    })
    
})

app.get('/api/users/password/set/accept', (req, res) => {
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let mailOptions = {
        from: `"${'gdlyeabkov'}" <${"gdlyeabkov"}>`,
        to: `${req.query.to}`,
        subject: `Подтверждение аккаунта Office ware game manager`,
        html: `<h3>Здравствуйте, ${req.query.to}!</h3><p>${req.query.code}</p><p>Код для смены пароля вашего аккаунта Office ware game manager</p>`,
    }
    transporter.sendMail(mailOptions, function (err, info) {
        
    })

    console.log(`отправил письмо на ${req.query.to} для обновления пароля код: ${req.query.code}`)

    return res.json({ status: 'OK' })
    
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
    maxUsers: 0,
    yearlyDiscount: {
        start: null,
        end: null
    }
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