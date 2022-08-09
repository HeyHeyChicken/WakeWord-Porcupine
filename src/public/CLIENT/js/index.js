async function startPorcupine(accessKey) {
    if(typeof PorcupineWebFrWorker == "undefined" ||
       typeof WebVoiceProcessor == "undefined"){
        setTimeout(function(){
            startPorcupine(accessKey);
        }, 100);
    }
    else{

        let ppnFr = null;
        let ppnEn = null;
        let ppnDe = null;
        let ppnEs = null;


        const keywordDetection = (msg) => {
          MAIN.App.startSTTClick();
        };

        function porcupineErrorCallback(error) {
          console.error(error);
        }

        switch(MAIN.App._data.language){
            case "fr-FR":
                ppnFr = await PorcupineWebFrWorker.PorcupineWorkerFactory.create(
                  accessKey,
                  [
                    {
                      custom: "Ok Nova",
                      sensitivity: 0.7,
                      base64:
                        "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",
                    },
                  ],
                  keywordDetection,
                  porcupineErrorCallback
                );
                break;
            default:
                console.log("Your language is not supported by Porcupine.");
                break;
        }

        try {
            let webVp = await window.WebVoiceProcessor.WebVoiceProcessor.init({
                engines: [/* ppnEn, ppnEs, */ ppnFr /* , ppnDe */],
            });
        } catch (e) {
            console.log("WebVoiceProcessor failed to initialize: " + e);
        }
    }
}


MAIN.Socket.on("set_porcupine_key", function(key) {
  if(key != null){
    startPorcupine(key);
  }
  else{
    console.error("You have not set a key in the \"WakeWord-Porcupine\" skill settings. You can generate a key here: https://console.picovoice.ai/profile");
  }
});

MAIN.Socket.emit("get_porcupine_key");
