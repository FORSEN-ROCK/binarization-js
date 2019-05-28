(function(){
    $("#file-fild").on("change", function(event) {
        var files = event.target.files;

        if(files.length > 0) {
            if(files[0].type == "image/png") {
                /*
                var reader = new FileReader();
                reader.onload = function(event) {
                    var buffArrey = event.target.result;
                    var imageArr = new Uint8ClampedArray(buffArrey);
                    var size = Math.ceil($(".in-file").width());
                    console.log(size);
                    var newImageArr = new Uint8ClampedArray(size * size * 4);
                    var canvas = document.getElementById('canvas');
                    canvas.width = $(".in-file").width();
                    canvas.height = $(".in-file").height();
                    var ctx = canvas.getContext("2d");
                    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    console.log(image.data);

                    for(var index = 0; index < image.data.length; index += 4) {
                        //if(index % 3 == 0 || index == 0 || index % 2 != 0)
                        //image.data[index] = imageArr[index];
                        image.data[index + 0] = 11;    // R value
                        image.data[index + 1] = 163;  // G value
                        image.data[index + 2] = 63;    // B value
                        image.data[index + 3] = 255;
                        /*if(index % 2 != 0 && index != 0) 
                            newImageArr[index] = 90;

                        if(index % 3 == 0 && index != 0)
                            newImageArr[index] = 1; 
                    }

                    console.log(buffArrey.length);
                    console.log(imageArr);
                    console.log(newImageArr);
                    //var image = new ImageData(imageArr, 4 * 512);
                    //var image = new ImageData(newImageArr, size);
                    console.log(image);
                    //console.log($("convas"));
                    
                    console.log(canvas);

                    //ctx.fillRect(10,10,50,50)
                    ctx.putImageData(image, 1, 1, 0, 0, size, size);
                    //ctx.drawImage(image, 0, 0);
                    //var ctx = canvas.getContext('2d');
                    //ctx.drawImage(image, 0, 0);
                    $("<img />", {
                        src: canvas.toDataURL("image/png"),
                    }).appendTo("#right .free-box");
                };
                
                */
                // Show image in left box
                var loader = new FileReader();
                loader.onload = function(event) {
                    var dataUri = event.target.result
                    var image = $("<img />", {
                                  src: dataUri,
                                  class: "in-file",
                                  on: {
                                      load: function() {
                                          var canvas = document.getElementById("das");
                                          console.log(canvas);
                                          var ctx = canvas.getContext('2d');
                                          ctx.drawImage(this, 0, 0);
                                          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                          console.log(imageData);
                                          canvas.hudden;
                                      }
                                  }
                    });
                    image.appendTo("#left .free-box");
                    
                }
                loader.readAsDataURL(files[0]);
            }
        }
    });
}());
/*
function () {
        var canvas = document.getElementById("das");
                                          console.log(canvas);
                                          var ctx = canvas.getContext('2d');
                                          ctx.drawImage(this, 0, 0);
                                          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                          console.log(imageData);
                                          canvas.hudden;*/