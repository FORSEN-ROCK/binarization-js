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

        for(var pixel = 0; pixel < resultImgData.data.length; pixel += 4) {

            // Translate image to grayscale
            // We can do it so, at first we calculate avg for r, g, b channel
            // And set channel value for result image 
            var avgBrightness = Math.ceil(
                            (sourceImgData.data[pixel] +
                             sourceImgData.data[pixel + 1] +
                             sourceImgData.data[pixel + 2]
                            ) / 3
            );

            resultImgData.data[pixel] = avgBrightness;
            resultImgData.data[pixel + 1] = avgBrightness;
            resultImgData.data[pixel + 2] = avgBrightness;
            resultImgData.data[pixel + 3] =  sourceImgData.data[pixel + 3];
        }

        //console.log(resultImgData);
        doBinarization(resultImgData.data, imgWidth, imgHeight, 8, 15);
       // doIntegralImage(resultImgData.data, imgWidth, imgHeight);
        rightContext.putImageData(resultImgData, 0, 0);
    }
};

function Pixel(red, green, blue, alpha) {
    /**
    *   This is constructor of class pixel
    *   @papam {number} red
    *   @param {number} green
    *   @param {number} blue
    *   @param {number} alpha
    *   @return {object}
    */

    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;

    this.getBrightness = function() {
        /**
        *   This method returns avg of red, green, blue
        *   @param {object} this
        *   @return {numbrt} avgRBG
        */

        return Math.ceil((this._red + this._blue + this._green) / 3);
    };
};


function doBinarization(source, width, height, segment, allowableError) {
    /**
    *   This function does binarization
    *   @param {array} source
    *   @param {number} segment
    *   @param {number} allowableError
    *   @return {nothing}
    */

    // Create integral image from source
    var integralImage = {};
    var pixels = [];

    for(var index = 0; index < source.length; index += 4) {
        pixels.push(new Pixel(source[index],
                              source[index + 1],
                              source[index + 2],
                              source[index + 3]));
    }

    for(var xIndex = 0; xIndex < width; xIndex++) {
        var sumBrightness = 0;

        for(var yIndex = 0; yIndex < height; yIndex++) {
            var index = yIndex * width + xIndex;

            sumBrightness += pixels[index].getBrightness();

            if(xIndex == 0)
                integralImage[index] = sumBrightness;
            else {
                integralImage[index] = (integralImage[index - 1] +
                                        sumBrightness);
            }
        }
    }

    var segmentLen = width / segment;

    for(var xIndex = 0; xIndex < width; xIndex++) {
        for(var yIndex = 0; yIndex < height; yIndex++) {
            var xLeft = xIndex - segmentLen;
            var yLeft = yIndex - segmentLen;
            var xRight = xIndex + segmentLen;
            var yRight = yIndex + segmentLen;

            if(xLeft < 0)
                xLeft = 0
            if(xRight >= width)
                xRight = width - 1;
            if(yLeft < 0)
                yLeft = 0;
            if(yRight >= height)
                yGight = height - 1;

            var countPoint = (xRight - xLeft) * (yRight - yLeft);

           brightness = integralImage[] 
        }
    }
    /*
    var pixelCount = imageData.length / 4;
    var pixelInSegm = pixelCount / segment;

    console.log("length -> " + imageData.length);
    // Loop on segments
    for(var segmIndex = 0; segmIndex < pixelCount; segmIndex += pixelInSegm) {
        var startIndex = segmIndex * 4;
        var endIndex = 4 * (segmIndex + pixelInSegm);
        var sumBrightness = 0;

        // Calculation sum of brightness
        for(var index = startIndex; index < endIndex; index++) {
            if(index % 3 != 0)
                sumBrightness += imageData[index];
        }

        var avgBrightness = sumBrightness / (endIndex - startIndex);
        //console.log(sumBrightness);
        console.log(startIndex + "|" + endIndex + "|" + avgBrightness * (1 - allowableError / 100));

        for(var index = startIndex; index < pixelInSegm; index += 4) {
            var pixelBrightness = (imageData[index] +
                                   imageData[index + 1] +
                                   imageData[index + 2]);

            if(pixelBrightness > avgBrightness * (1 - allowableError / 100)) {
                imageData[index] = 0;
                imageData[index + 1] = 0;
                imageData[index + 2] = 0;
            } else {
                imageData[index] = 255;
                imageData[index + 1] = 255;
                imageData[index + 2] = 255;
            }
        }
    }*/
};