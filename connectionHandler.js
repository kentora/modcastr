
let obsConnected = false;
let twitchConnected = false;

function handleConnections(obs, chat){
    obs.on('ConnectionClosed', () => {
        obsConnected = false;
        console.log("OBS DISCONNECTED");
    });

    obs.on('ConnectionOpened', () => {
        obsConnected = true;
        console.log("OBS CONNECTED");
    });

    chat.on('disconnected', () => {
        console.log("TWITCH DISCONNECTED");
        twitchConnected = false;
    });

    chat.on('connected', () => {
        console.log("TWITCH CONNECTED");
        twitchConnected = true;
    });

    setInterval(() => {
        if (!obsConnected) {
            obs.connect().catch(err => {
                console.debug("Could not connect to OBS", err);
            });
        }

        if (!twitchConnected) {
            chat.connect().catch(err => console.debug("Could not connect to twitch", err));
        }
    }, 1000);
}

module.exports.handleConnections = handleConnections;