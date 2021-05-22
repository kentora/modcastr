const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const tmi = require('tmi.js');
const configure = require('./config');
const connectionHandler = require('./connectionHandler');

const config = configure.loadOrCreateConfig();

const chat = new tmi.client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [config.channel]
})

connectionHandler.handleConnections(obs, chat);

chat.on('message', (channel, user, message, self) => {
    if (self) return; // ignore echo, but should not happen

    if (isModOrHigher(user, channel) && commandIs(message, config.command_on)) {
        if (isAfterTimeout('on')) {
            setVisible(true);
        }
    }

    if(isModOrHigher(user, channel) && commandIs(message, config.command_off)){
        if(isAfterTimeout('off')) {
            setVisible(false);
        }
    }

    if(isModOrHigher(user, channel) && commandIs(message, config.command_flush)){
        if(isAfterTimeout('flush')) {
            setVisible(false)
            setTimeout(() => setVisible(true), 100);
        }
    }
});

let commandsUsedAt = {
    on: 0,
    off: 0,
    flush: 0
};

function setVisible(visible){
    obs.send('SetSceneItemProperties', { item: { name: config.item_name }, visible: visible }).then(() => {
        console.log("Item is now " + (visible ? 'visible' : 'hidden'));
    }).catch(e => {
        console.error("Could not flush", e);
    });
}

function isModOrHigher(user, channel) {
    let isMod = user.mod || user['user-type'] === 'mod';
    let isBroad = channel.slice(1) === user.username
    return isMod || isBroad;
}

function commandIs(message, cmd){
    return message.toUpperCase() == config.base_command.toUpperCase() + " " + cmd.toUpperCase();
}

function isAfterTimeout(command) {
    let lastFlush = command == 'on' ? commandsUsedAt.on : command == 'off' ? commandsUsedAt.off : commandsUsedAt.flush;
    return (Date.now() - lastFlush) > parseInt(config.timeout);
}