const rlSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

function loadOrCreateConfig(){
    var config;

    try {
        config = require('./conf.json')
    } catch (e) { }


    if (config === undefined) {
        config = config ? config : {};
        config.timeout = config && config.timeout ? config.timeout : rlSync.question("Timeout: ");
        config.base_command = config && config.base_command ? config.base_command : rlSync.question("Base Command: ");

        config.command_on = config && config.command_IRL ? config.command_IRL : rlSync.question("On Command: ");
        config.command_off = config && config.command_off ? config.command_off : rlSync.question("Off Command: ");
        config.command_flush = config && config.command_flush ? config.command_flush : rlSync.question("Flush Command: ");
        config.channel = config && config.channel ? config.channel : rlSync.question("Twitch Channel: ");
        config.item_name = config && config.item_name ? config.item_name : rlSync.question("Modcast item name in OBS: ");

        fs.writeFileSync(path.join(__dirname, "conf.json"), JSON.stringify(config));
    }

    return config;
}

module.exports.loadOrCreateConfig = loadOrCreateConfig;