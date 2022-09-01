class Client {
  constructor(_main) {
    const SELF = this;

    this.Main = _main;

    // Sockets from client
    this.Main.IOServer.on("connection", function(socket){
      socket.on("get_porcupine_settings", function(){
        SELF.Main.IOClient.emit("get_porcupine_settings");
      });
    });

    // Sockets from server
    this.Main.IOClient.on("set_porcupine_settings", function(_key){
      SELF.Main.IOServer.sockets.emit("set_porcupine_settings", _key);
    });
  }
}

module.exports = Client;
