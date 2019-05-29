(function(){
    $("#file-fild").on("change", function(event) {
        var files = event.target.files;

        if(files.length > 0) {
            if(files[0].type == "image/png") {

                // Show image in left box
                var loader = new FileReader();
                loader.onload = function(event) {
                    var dataUrl = event.target.result
                    var img = new Image();

                    // Set src for load image
                    img.src = dataUrl;

                    img.onload = imageTreatment(img);
                    img.style.display = 'none';
                }
                loader.readAsDataURL(files[0]);
            }
        }
    });
}());

function imageTreatment(img) {
    /**
    *   This function is listener for event of load img
    *   This prepares image for bimarization
    *   And after that runs binarization
    *
    *   @param {object} img
    *   @return {nothing}
    */

    if(img != '' || img != null) {

        // Query left canvas with standart dom method
        // Because if we use jquery it does not give use
        // Special method for canvas
        var leftCanvas = document.getElementById("left-canvas");
        var rightCanvas = document.getElementById("right-canvas");

        var imgWidth = img.width;
        var imgHeight = img.height;

        // Change size of boxes with jquery
        $(".box").width(imgWidth + "px");
        $(".box").height(imgHeight + "px");

        leftCanvas.width = imgWidth;
        leftCanvas.height = imgHeight;
        rightCanvas.width = imgWidth;
        rightCanvas.height = imgHeight;

        var leftContext = leftCanvas.getContext('2d');
        var rightContext = rightCanvas.getContext('2d');

        leftContext.drawImage(img, 0, 0);

        var sourceImgData = leftContext.getImageData(0, 0, imgWidth, imgHeight);
        var resultImgData = rightContext.getImageData(0, 0, imgWidth, imgHeight);
        //console.log(sourceImgData);

        for(var pixel = 0; pixel < resultImgData.data.length; pixel += 4) {

            // Translate image to grayscale
            //resultImgData.data[pixel + 3] = (
            resultImgData.data[pixel] = 0.2125 * sourceImgData.data[pixel];
            resultImgData.data[pixel + 1] = 0.0721 * sourceImgData.data[pixel + 1];
            resultImgData.data[pixel + 2] = 0.7154 * sourceImgData.data[pixel + 2];
            resultImgData.data[pixel + 3] =  sourceImgData.data[pixel + 3];
            //);
        }

        //console.log(resultImgData);
        binarization(resultImgData.data, 8, 15);
        rightContext.putImageData(resultImgData, 0, 0);
    }
};

function binarization(imageData, segment, allowableError) {
    /**
    *   This function does binarization
    *   @param {array} imageData
    *   @param {number} segment
    *   @param {number} allowableError
    *   @return {nothing}
    */

    var pixelCount = imageData.length / 4;
    var pixelInSegm = pixelCount / segment;

    // Loop on segments
    for(var segmIndex = 0; segmIndex < pixelCount; segmIndex += pixelInSegm) {
        var startIndex = segmIndex * 4;
        var endIndex = 4 * (segmIndex + pixelInSegm);
        var sumBrightness = 0;

        // Calculation sum of brightness
        for(var index = startIndex; index < pixelInSegm; index++) {
            sumBrightness += imageData[index + 3];
        }

        var avgBrightness = sumBrightness / pixelInSegm;
        //console.log(sumBrightness);
        console.log(avgBrightness * (1 - allowableError / 100));

        for(var index = startIndex; index < pixelInSegm; index += 4) {
            var pixelBrightness = (imageData[index] +
                                   imageData[index + 1] +
                                   imageData[index + 2]);

            if(imageData[index + 3] < avgBrightness * (1 - allowableError / 100)) {
                imageData[index + 3] = 0;
            } else {
                imageData[index + 3] = 255;
            }
        }
    }
};