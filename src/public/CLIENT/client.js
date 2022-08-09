class Client {
  constructor(_main) {
    const SELF = this;

    this.Main = _main;

    // Sockets from client
    this.Main.IOServer.on("connection", function(socket){
      socket.on("get_porcupine_key", function(){
        SELF.Main.IOClient.emit("get_porcupine_key");
      });
    });

    // Sockets from server
    this.Main.IOClient.on("set_porcupine_key", function(_key){
      console.log("set_porcupine_key");
      SELF.Main.IOServer.sockets.emit("set_porcupine_key", _key);
    });
  }
}

module.exports = Client;
