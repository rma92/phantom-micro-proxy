console.log("1");
var fs = require('fs');
phantom.onError = function(msg, trace) {
  
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.log(msgStack.join('\n'));
  console.log("ERROR!");
  phantom.exit(1);
};

//end loading -- put work here.
var page = new WebPage();
var timeout = 5000;


var pageLoaded = function( )
{
    console.log("Timer hit!" );
    console.log("Loaded:  " + page.url);

    page.evaluate(function() 
      {      
        Array.prototype.forEach.call(document.querySelectorAll("script"), function(scr){
            scr.parentNode.removeChild(scr);
        });
        Array.prototype.forEach.call(document.querySelectorAll("base"), function(scr){
            scr.parentNode.removeChild(scr);
        });

        /*
        //do this after 
        Array.prototype.forEach.call( document.querySelectorAll("img"), 
          function(scr)
          {
            //scr.src = "https://i.ytimg.com/vi/mkqz2v8fOiw/maxresdefault.jpg";
            var img2 = new Image();
            img2.setAttribute('crossOrigin', 'anonymous');
            img2.src = scr.src;
            var canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 24;
            var ctx = canvas.getContext("2d");
            ctx.drawImage( img2, 0, 0, 32, 24 );
            scr.src = canvas.toDataURL("image/jpeg");
            //console.log( "img:" + scr + "\n");
            //scr.parentNode.removeChild( scr );

          }
        );
        */
     //return document.documentElement.outerHTML; // or whatever is appropriate
    });//page.evaluate
    //now s contains the page striped of javascript.
    //  page = s;
    //end
    console.log("saving outputs.");
    try
    {
      fs.write( 'out.html', page.content, 'w' );
    }
    catch( e )
    {
      console.log( e );
    }
    //page.render('out.png');
    
    console.log("done rendering. exiting.");
    phantom.exit();
};

var websiteAddress = 'http://drudgereport.com/';
page.viewportSize = {width: 800, height: 600};
console.log("time to open\n");

var trier = function()
{
  console.log("trier1\n");
  var timer = setTimeout( pageLoaded, timeout );
  page.open( websiteAddress, function( status )
  {
    console.log("status: " + status );
    if( status == 'fail')
    {
      console.log("failure...exiting");
      clearTimer( timer );
      phantom.exit( 1 );
    }
    if( status == 'success' )
    {
      console.log("the page loaded before the timeout, rendering");
      clearTimer( timer );
      pageLoaded();
    }
  });
  console.log("opened.\n");
};

trier();

//end of user script -- don't edit below.
console.log("end of script mainline");
//phantom.exit(0);
