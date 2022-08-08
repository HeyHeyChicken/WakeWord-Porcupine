const LIBRARIES = {
  Skill: require("../../../Libraries/Skill")
};

class WakeWordPorcupine extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;

    // get_porcupine_key

    _main.ClientIO.on("connection", function(socket){
      const EVENT_NAME = "get_porcupine_key";
      socket.removeAllListeners(EVENT_NAME);
      socket.on(EVENT_NAME, function(_ID){
        _main.ClientIO.emit("set_porcupine_key", SELF.Settings.Key);
      });
    });
  }
}

module.exports = WakeWordPorcupine;
