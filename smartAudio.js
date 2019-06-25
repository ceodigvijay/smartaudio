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
// link.href = './some.css';  
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
    '<select class="playspeed">'+
      '<option value="0.5">0.5x</option>'+
      '<option selected="selected" value="1">1x</option>'+
      '<option value="1.5">1.5x</option>'+
      '<option value="2">2x</option>'+
    '</select>'+
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
    '<a class="fab fa-facebook fb-logo share-logo" href="javascript:getFbLink()"></a>'+
     '<a class="fab fa-twitter twitter-logo share-logo" href="javascript:getTwitterLink()"></a>'+
     '<a class="fab fa-linkedin linkedin-logo share-logo" href="javascript:getLinkedinLink()"></a>'+
    "<a class='fas fa-envelope-open email-logo share-logo' onclick='javascript: shareEmail()'></a>"+
    '<a class="fas fa-link link-logo share-logo" onclick="javascript: copyLink()"></a>'+
      '</div>'+
    '</div>'
  );
}

function getFbLink(){
    window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false; 
}

function getTwitterLink(){
    window.open('https://twitter.com/share?url='+escape(window.location.href)+'&text='+document.title + '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false; 
}

function getLinkedinLink(){
    window.open("https://www.linkedin.com/shareArticle?mini=true&url="
    + escape(window.location.href)
    +"&title=",'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false;
}

function shareEmail(){
    window.open('mailto:?subject= Check Out this Link' + '&body=' + encodeURIComponent(document.URL))
}

function copyLink(){
    var text = window.location.href;
    navigator.clipboard.writeText(text).then(function() {
    console.log('Copying to clipboard was successful!');
    }, function(err) {
    console.error('Could not copy text: ', err);
    });
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
    elems[pos].getElementsByClassName("share-popup-text")[0].innerHTML = shareText+" <script src='https://cdn.jsdelivr.net/gh/ceodigvijay/smartaudio@master/smartAudio.js'></script>"
    elems[pos].getElementsByClassName("song-title")[0].innerHTML = "<strong>Listen To this : </strong>"+elems[pos].getAttribute("saAudioTitle")
    elems[pos].getElementsByClassName("pause")[0].style.display = "None"
    elems[pos].getElementsByClassName("share-popup")[0].style.display = "None"
    elems[pos].getElementsByClassName("button-share")[0].onclick = showShare.bind(this, event, pos)
    elems[pos].getElementsByClassName("myRange")[0].oninput = function(event){
        audios[pos].currentTime = event.target.value
    }
    elems[pos].getElementsByClassName("play")[0].onclick = play.bind(this, event, pos)
    elems[pos].getElementsByClassName("pause")[0].onclick = play.bind(this, event, pos)
    elems[pos].getElementsByClassName("forward")[0].onclick = () => audios[pos].currentTime+=15
    elems[pos].getElementsByClassName("backward")[0].onclick = () => audios[pos].currentTime-=15
    elems[pos].getElementsByClassName("playspeed")[0].onchange = onPlaybackChange.bind(this, event, pos)
    elems[pos].getElementsByClassName("endTime")[0].innerHTML = sectomin(audios[pos].duration)
    audios[pos].ontimeupdate = updateSlider.bind(this, event, pos)
    audios[pos].onended = end.bind(this, event, pos)
}

function onPlaybackChange(event, pos){
    var speed = elems[pos].getElementsByClassName("playspeed")[0].value
    audios[pos].playbackRate = speed
}

function sliderInput(event, pos){
    console.log(pos)
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
