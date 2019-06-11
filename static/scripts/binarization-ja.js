(function(){
    $("#file-fild").on("change", function(event) {
        var files = event.target.files;

        console.log(files[0].type);
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

            /*
            resultImgData.data[pixel] = avgBrightness;
            resultImgData.data[pixel + 1] = avgBrightness;
            resultImgData.data[pixel + 2] = avgBrightness;
            resultImgData.data[pixel + 3] =  sourceImgData.data[pixel + 3];
            */
            resultImgData.data[pixel] = sourceImgData.data[pixel];
            resultImgData.data[pixel + 1] = sourceImgData.data[pixel + 1];
            resultImgData.data[pixel + 2] = sourceImgData.data[pixel + 2];
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

        //return Math.ceil((this._red + this._blue + this._green) / 3);
        return 0.2125 * this._red + 0.7154 * this._green + 0.0721 * this._blue;
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
    var integralImage = [];
    var pixels = [];

    for(var index = 0; index < source.length; index += 4) {
        pixels.push(new Pixel(source[index],
                              source[index + 1],
                              source[index + 2],
                              source[index + 3]));
    }

    for(var xOfset = 0; xOfset < width; xOfset++) {
        var column = [];
        var brightness = 0;

        for(var yOfset = 0; yOfset < height; yOfset++) {
            var index = yOfset * width + xOfset;

            brightness += pixels[index].getBrightness();

            if(xOfset == 0)
                column.push(brightness);
            else
                column.push(brightness + integralImage[xOfset - 1][yOfset]);
        }

        integralImage.push(column);
    }

    //console.table(integralImage);
    //console.log(integralImage[0][0] + integralImage[19][19] - (integralImage[19][0] + integralImage[0][19]));

    // Do binarization
    var segmentLen = Math.floor(width / segment);

    // Define defaulte value of segmentBrightness
    var segmentBrightness = (integralImage[0][0] + 
                             integralImage[width - 1][height - 1] -
                             integralImage[0][height - 1] - 
                             integralImage[width - 1][0]);

    var segmentSize = width * height;
    var heightOfset = 0;
    var widthOfset = 0;

    var widthStart = 0
    var heightStart = 0;
    var widthLimit = 0;
    var heightLimit = 0;//segmentLen;

    // Main loop
    for(var ofset = 0; ofset < source.length; ofset += 4) {
        //var pixelBrightness = (source[ofset] + source[ofset + 1] +
        //                       source[ofset + 2]);

        var pixelBrightness = (0.2125 * source[ofset] + 0.7154 * source[ofset + 1] +
                               0.0721 * source[ofset + 2]);

        if(segmentLen > 10) {
            if((widthOfset % segmentLen == 0) &&
                widthOfset < width) {
                    widthStart = widthOfset;
                    widthLimit = widthOfset + segmentLen;
            }

            if((heightOfset % segmentLen == 0) &&
                heightOfset < height) {
                    heightStart = heightOfset;
                    heightLimit = heightOfset + segmentLen;
            }

            if(widthLimit >= width)
                    widthLimit = width - 1;

            if(heightLimit >= height)
                    heightLimit = height - 1;

            if((widthOfset % segmentLen == 0 ||
               heightOfset % segmentLen == 0) &&
               (widthLimit - widthStart > 0) &&
               (heightLimit - heightStart > 0)) {

                    segmentBrightness = (
                          integralImage[widthStart][heightStart] +
                          integralImage[widthLimit][heightLimit] -
                          integralImage[widthStart][heightLimit] -
                          integralImage[widthLimit][heightStart]
                    );

                    segmentSize = ((widthLimit - widthStart) *
                                   (heightLimit - heightStart));
            }
        }

        // Main condition for binarization
        if(segmentSize * pixelBrightness < 
           segmentBrightness * (1 - allowableError / 100)) {
                source[ofset] = 0;
                source[ofset + 1] = 0;
                source[ofset + 2] = 0;
        } else {
                source[ofset] = 255;
                source[ofset + 1] = 255;
                source[ofset + 2] = 255;
        }

        if(ofset % (4 * width) == 0) {
            heightOfset++;
            widthOfset = 0;
            widthLimit = 0;
        }

        if(ofset % (4 * width) != 0)
            widthOfset++; //?
    }
};