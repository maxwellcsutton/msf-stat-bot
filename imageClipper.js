const Clipper = require('image-clipper');
const Canvas = require('canvas');
const clipper = Clipper();
 
clipper.injectNodeCanvas(Canvas);

const warImage = "./image1.png"

Clipper(warImage, function() {
    this.crop(20, 20, 100, 100)
    .resize(50, 50)
    .quality(80)
    .toDataURL(function() {
       console.log('saved!');
   });
});