https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
 // Create new link Element 
var link = document.createElement('link');  
link.rel = 'stylesheet';  
link.type = 'text/css'; 
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css';  
document.getElementsByTagName('HEAD')[0].appendChild(link);  

var link = document.createElement('link');  
link.rel = 'stylesheet';  
link.type = 'text/css'; 
link.href = 'https://cdn.jsdelivr.net/gh/ceodigvijay/smartaudio@master/some.css';  
document.getElementsByTagName('HEAD')[0].appendChild(link);  


function guiCode(min, max) {
    console.log(min, max)
  return (
      '<div class="smartAudioContainer">'+
    '<div class="controls center-item">' +
    '<i class="fas fa-redo backward"></i>' +
    '<i class="fas fa-play play"></i>' +
    '<i class="fas fa-pause pause"></i>' +
    '<i class="fas fa-redo forward"></i>' +
    "</div>" +
    '<div class="song-title center-item">'+
    'Some Title Here'+
    '</div>'+
    '<div class="slidecontainer center-item">' +
    '<span class="currTime">0.00</span>'+
    '<input type="range" min=' +
    min +
    " max=" +
    max +
    ' value="0" class="myRange slider" />' +
    '<span class="endTime"></span>'+
    "</div>"+
    '<div class="share center-item">'+
    '<button class="button-share">Share</button>'+
    '</div>'+
    '</div>'+
    '<div class="share-popup">'+
    '<textarea class="share-popup-text">Some Text</textarea>'+
    '<div class="social-share">'+
    '<i class="fab fa-facebook fb-logo share-logo"></i>'+
     '<i class="fab fa-twitter twitter-logo share-logo"></i>'+
      '</div>'+
    '</div>'
  );
}
var audios = []
var elems = document.getElementsByClassName("smartAudio");
for (var i = 0; i < elems.length; i++) {
  var song = elems[i].getAttribute("saAudioSrc")
  audios[i] =  new Audio(song);
  audios[i].setAttribute("preload", "metadata")
  audios[i].onloadedmetadata = metaLoaded.bind(this, event, i)  
}

function sectomin(timeinsec){
    return (Math.floor(timeinsec/60)+" : "+parseInt(timeinsec%60, 10))
}


function metaLoaded(event, pos){
    console.log("Duration" +audios[pos].duration)
    var shareText = elems[pos].cloneNode().outerHTML
    elems[pos].innerHTML = guiCode(0, audios[pos].duration);
    elems[pos].getElementsByClassName("share-popup-text")[0].innerHTML = shareText
    elems[pos].getElementsByClassName("song-title")[0].innerHTML = elems[pos].getAttribute("saAudioTitle")
    elems[pos].getElementsByClassName("pause")[0].style.display = "None"
    elems[pos].getElementsByClassName("share-popup")[0].style.display = "None"
    elems[pos].getElementsByClassName("button-share")[0].onclick = showShare.bind(this, event, pos)
    elems[pos].getElementsByClassName("play")[0].onclick = play.bind(this, event, pos)
    elems[pos].getElementsByClassName("pause")[0].onclick = play.bind(this, event, pos)
    elems[pos].getElementsByClassName("forward")[0].onclick = () => audios[pos].currentTime+=15
    elems[pos].getElementsByClassName("backward")[0].onclick = () => audios[pos].currentTime-=15
    elems[pos].getElementsByClassName("endTime")[0].innerHTML = sectomin(audios[pos].duration)
    audios[pos].ontimeupdate = updateSlider.bind(this, event, pos)
    audios[pos].onended = end.bind(this, event, pos)

}

function showShare(event, pos){
    shareElem = elems[pos].getElementsByClassName("share-popup")[0]
     if(shareElem.style.display == "grid"){
         shareElem.style.display = "None"
     }else{
         shareElem.style.display = "grid"
     }
}

function updateSlider(event, pos){
    console.log("Changed")
    curtime = parseInt(audios[pos].currentTime, 10);
    elems[pos].getElementsByClassName("myRange")[0].setAttribute("value", curtime)
    elems[pos].getElementsByClassName("myRange")[0].value = curtime
    elems[pos].getElementsByClassName("currTime")[0].innerHTML = sectomin(curtime)
}

function play(event, pos){
    console.log(audios[pos].duration)
    if(audios[pos].paused){
        console.log("paused")
        audios[pos].play()
        elems[pos].getElementsByClassName("pause")[0].style.display = "inline"
        elems[pos].getElementsByClassName("play")[0].style.display = "None"
        console.log("Played")
    }else{
        console.log("Playing")
        audios[pos].pause()
        elems[pos].getElementsByClassName("pause")[0].style.display = "None"
        elems[pos].getElementsByClassName("play")[0].style.display = "inline"
        console.log("Paused")
    }
    
}

function end(event, pos){
    elems[pos].getElementsByClassName("pause")[0].style.display = "None"
    elems[pos].getElementsByClassName("play")[0].style.display = "inline"
}
