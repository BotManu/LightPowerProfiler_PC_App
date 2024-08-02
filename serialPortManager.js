// This module acts as a shared space for the port variable
let port;
module.exports.getPort = () => port;
module.exports.setPort = (newPort) => { port = newPort; };
module.exports.nullifyPort = () => { port = null; };