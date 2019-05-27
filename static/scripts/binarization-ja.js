(function(){
    $("#file-fild").on("change", function(event) {
        var files = event.target.files;

        if(files.length > 0) {
            if(files[0].type == "image/png") {

                console.log(files[0]);
                var reader = new FileReader();
                reader.onload = function(event) {
                    var imageArr = event.target.result;
                    console.log(imageArr);
                    //var image = new ImageData(imageArr);
                    //console.log(image);
                };
                reader.readAsArrayBuffer(files[0]);
                //var image = new ImageData(
            }
        }
    });
}())