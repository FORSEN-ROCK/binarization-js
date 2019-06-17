(function() {
    var screen = document.querySelector("#screen");
    var canvas = document.getElementById("test");
    var context = canvas.getContext('2d');
    var datas = [];
    navigator.getUserMedia(
    // Настройки
    {
        video: true
    },
    // Колбэк для успешной операции
    function(stream){

        // Создаём объект для видео потока и
        // запускаем его в HTLM элементе video.
        console.log(stream);
        //screen.src = window.URL.createObjectURL(stream);
        screen.srcObject = stream;
        var mediaRecord = new MediaRecorder(stream, {video: true, videoBitsPerSecond : 2500000});
        mediaRecord.start(10);

        console.log(mediaRecord);

        mediaRecord.ondataavailable = function(event) {
            context.drawImage(screen, 0, 0);
            datas.push(event.data);
        };

        // Воспроизводим видео.
        screen.play();
        //}
        //console.log(mediaRecord.requestData());
    },
    // Колбэк для не успешной операции
    function(err){

        // Наиболее частые ошибки — PermissionDenied и DevicesNotFound.
        console.error(err);

    });

    var button = document.getElementById("screen-btm");

    button.addEventListener("click", function(event){
    });

    canvas.onload = function(event) {
        console.log(event);
    };
     
}());