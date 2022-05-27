const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').rtmp_server;
const StreamModel = require('./index').StreamModel
 
nms = new NodeMediaServer(config);
 
nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        
    // let session = nms.getSession(id);
    // session.reject();
    //helpers.generateStreamThumbnail(stream_key)
    // const stream = new StreamModel({ stream: stream_key })
    
    // stream.save(function (err) {
    // })
        
});

nms.on('donePlay', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    await StreamModel.deleteOne({ stream: stream_key }, (err, stream) => {
        
    })
})
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};
 
module.exports = nms;