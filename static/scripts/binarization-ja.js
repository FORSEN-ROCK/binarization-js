(function(){
    $("#file-fild").on("change", function(event) {
        var files = event.target.files;

        if(files.length > 0) {
            if(files[0].type == "image/png") {

                var reader = new FileReader();
                reader.onload = function(event) {
                    var buffArrey = event.target.result;
                    var imageArr = new Uint8ClampedArray(buffArrey);

                    console.log(buffArrey);
                    console.log(imageArr);
                    var image = new ImageData(imageArr, 170);
                    console.log(image);
                };
                reader.readAsArrayBuffer(files[0]);

                // Show image in left box
                var loader = new FileReader();
                loader.onload = function(event) {
                    var dataUri = event.target.result
                    var image = $("<img />", {
                                  src: dataUri
                    });
                    image.appendTo("#left .free-box");
                }
                loader.readAsDataURL(files[0]);
            }
        }
    });
}())