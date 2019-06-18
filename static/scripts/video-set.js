(function() {
    var screen = document.querySelector("#screen");
    var canvas = document.getElementById("test");
    var datas = [];

    //screen.hidden = true;

    navigator.getUserMedia(
        // Set options
        {
            video: true
        },
        // Function for success call
        function(stream){

            // Create video stream object and play in html
            screen.srcObject = stream;
            var mediaRecord = new MediaRecorder(stream, {video: true, videoBitsPerSecond : 2500000});
            mediaRecord.start(10);

            //console.log(mediaRecord);

            mediaRecord.ondataavailable = function(event) {
                
                var sourceWidth = $("#screen").width();
                var sourceHeight = $("#screen").height();

                canvas.height = sourceHeight;
                canvas.width = sourceWidth;

                var context = canvas.getContext('2d');

                context.drawImage(screen, 0, 0);

                var imgData = context.getImageData(0, 0, sourceWidth, sourceHeight);

                for(var item = 0; item < imgData.data.length; item += 4) {
                    /*var avg = (imgData.data[item] + imgData.data[item + 1] + imgData.data[item + 2]) / 3;

                    imgData.data[item] = avg;//imgData.data[item];
                    imgData.data[item + 1] = avg;//imgData.data[item + 1];
                    imgData.data[item + 2] = avg;//imgData.data[item + 2];*/

                    if(item - 4 >= 0) {
                        var currentPixel = (imgData.data[item] +
                                            imgData.data[item + 1] +
                                            imgData.data[item + 2]);

                        var beforePixel = (imgData.data[item - 4] +
                                           imgData.data[item - 3] +
                                           imgData.data[item - 2]);

                        if(Math.abs(currentPixel - beforePixel) >= 320) {
                            imgData.data[item] = 255;
                            imgData.data[item + 1] = 255;
                            imgData.data[item + 2] = 255;
                        } else {
                            imgData.data[item] = 0;
                            imgData.data[item + 1] = 0;
                            imgData.data[item + 2] = 0;
                        }
                    }
                }

                context.putImageData(imgData, 0, 0);
            };

            // Play the video
            screen.play();
        },
        // Function for fail call
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