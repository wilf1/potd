
var text = 'no api call made';
console.log(text.substring(0, 10));
var date_iso = toISOStringLocal(new Date());

$.ajax({
        url: 'https://commons.wikimedia.org/w/api.php?action=parse&text={{potd}}&origin=*&format=json',
        type: 'get',
        success: function (data){
            text = data;
            processapi();
            //console.log(orders);
            },
        failure: function (data){
	    text='failed';
            }
        });

function toISOStringLocal(d) {
  function z(n){return (n<10?'0':'') + n}
  return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
         z(d.getDate());
          
}

function findIndex (text, matchString)
{
    var i = 0;
    var matchLength = matchString.length;
    while (i < text.length && text.substring(i, i + matchLength) != matchString)
    {
        i++;
    }
    return i;
}

function getCaption (fileName)
{
	//var url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + fileName + '&prop=imageinfo&origin=*&format=json';
/*$.ajax({
        url: url,
        type: 'get',
        success: function (data){
            console.log(data);
            },
        failure: function (data){
	    text='failed';
            }
});*/
    var html = text['parse']['text']['*'];
    //console.log('html: ', html);
    var position = findIndex(html, 'description en');
    //console.log(position);
    //console.log(html.substring(position, position + 100));
    var description = html.substring(position);
    var descriptionCleaner = description.substring(findIndex(description, '>')+ 1);
    //console.log(descriptionCleaner);
    var descriptionComplete = descriptionCleaner.substring(0, findIndex(descriptionCleaner, '</div>'));
    //console.log(descriptionComplete);
    return descriptionComplete;
    //console.log(html.substring(20,5));
}


var data;
var width = window.innerWidth;
var height = window.innerHeight;
var realWidth;
var realHeight;
function processapi ()
{
   //console.log(text);
	//console.log(text.substring(0, 10));
	//data = JSON.parse(text);
   //console.log(text['parse']['images'][0]);
   var imageName = text['parse']['images'][0];
   var imageUrl = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + 
   imageName + '?width=' + width;
	$('#image-box').append('<img id="potd" src="' + imageUrl + '">');
     photo = $('#potd');
        $("<img>").attr("src", photo.attr("src")).on('load', function(){
	  setTimeout(() => {$('#caption-box').fadeIn(2000);}, 3000);
          realWidth = this.width;
          realHeight = this.height;

	window.requestAnimationFrame(step);
        });

console.log('width: ', photo.naturalWidth);
console.log('height: ', photo.naturalHeight);
   var caption = getCaption(imageName);
   $('#image-box').css('height',height+'px');
   $('#caption-box').append(caption);
   
   
   
}

//setTimeout(() => {$('#caption-box').fadeIn("slow");}, 5000);

/*var x = new Date();
console.log(x.getTime());

window.addEventListener('mousemove', e => {
x = new Date();
$('#caption-box').fadeIn("slow");
});

setInterval(() => {
today = new Date();
console.log('today:', today.getTime());
console.log('then:', x.getTime());
if (today.getTime() - x.getTime() > 3000)
{
   $('#caption-box').fadeOut("slow");
}
}, 1000);*/




var scroll = 0;
var photo;
var sigmoid;
window.addEventListener('wheel', e => {console.log('scroll changed by', e.deltaY);
scroll += e.deltaY * 6;
$('#potd').css('margin-top', (-1 * scroll) + 'px');});
let start;

function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;
  //sigmoid = Math.pow(elapsed, 0.3) * -10;
  //sigmoid = Math.pow(elapsed + 50, 0.5) * -3 +21.21;
  sigmoid = elapsed * -0.01;
  // `Math.min()` is used here to make sure that the element stops at exactly 200px.
  //photo.css('margin-top', sigmoid + 'px');
   photo.css('transform', 'translateY(' + sigmoid + 'px)'); 
   //photo.css('display', 'none'); 
//photo.css('display', 'none');
  //console.log(elapsed);
  //console.log('sigmoid: ',sigmoid);
//console.log('realheight: ', realHeight);
//console.log('height: ', height);
  if (sigmoid * -1 < realHeight - height) { // Stop the animation after 2 seconds
    window.requestAnimationFrame(step);
  }
}


