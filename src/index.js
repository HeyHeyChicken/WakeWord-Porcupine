const LIBRARIES = {
  Skill: require("../../../Libraries/Skill")
};

class WakeWordPorcupine extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;

    // get_porcupine_key

    _main.ClientIO.on("connection", function(socket){
      socket.on("get_porcupine_key", function(_ID){
        _main.ClientIO.emit("set_porcupine_key", SELF.Settings.Key);
      });
    });
  }
}

module.exports = WakeWordPorcupine;
