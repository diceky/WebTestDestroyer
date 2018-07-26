
chrome.runtime.onMessage.addListener(listenerCallback);

function listenerCallback(request, sender, sendResponse) {
  chrome.runtime.onMessage.removeListener(listenerCallback);//remove listenerCallback
  if(request.tamatebako) var json_url = "data/tamatebako.json";
  else if(request.spi) var json_url = "data/spi.json";
  else if(request.tgweb) var json_url = "data/tg-web.json";
  else if (request.gab) var json_url = "data/gab.json";
  else{
    alert("WEB TESTの種類を選択してください");
    return;
  }
  console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "tamatebako:" + request.tamatebako + " spi:" + request.spi + " tgweb:" + request.tgweb + " gab:" + request.gab);
  fetchJson(String(json_url), destroyerCallback);
  alert("WEB TEST IS DESTROYED");
}

fetchJson = function(url, callback){ //read json file
  var xhr = new XMLHttpRequest;
  xhr.open("GET", chrome.runtime.getURL(url));
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      window.json_text = xhr.responseText;
      window.parsed_json = JSON.parse(xhr.responseText);
      console.log("json is read");
      callback(window.parsed_json);
    }
  };
  xhr.send();
}

function destroyerCallback(answers){

  var questions = document.getElementsByClassName('size14');
  var span_questions=[];
  for(var i=0;i<questions.length;i++){
    if(questions[i].tagName=="SPAN"&&questions[i].style.backgroundColor==""){
      //console.log("bgcolor:"+questions[i].style.backgroundColor);
      span_questions.push(questions[i]);
    }
  }

  for(var i=0;i<span_questions.length;i++){
      var choice_flag = 0;
      var keywords = String(span_questions[i].textContent).substring(0,29);
      console.log("Question"+(i+1)+":"+keywords);
      for(var j=0;j<answers.length;j++){
        if(answers[j]["text"]!=null || answers[j]["text"] != ""){
          var response = keywords.includes(answers[j]["text"]);
          if(response==true && answers[j]["answer"]!=null){//question text matches json!
            span_questions[i].style.backgroundColor = "red";
            console.log("Text is " + answers[j]["text"] +" Answer is " + answers[j]["answer"]);
            console.log("CHOICE"+i+"_"+answers[j]["answer"]);
            document.getElementById("CHOICE"+i+"_"+answers[j]["answer"]).checked = true;
            choice_flag=1;
            break;
          }
        }
      }
      if(choice_flag==0){//question did not match json, pick random answer
        var random = Math.floor((Math.random() * 5) + 1);
        document.getElementById("CHOICE"+i+"_"+random).checked = true;
        console.log("CHOICE RANDOM");
      }
  }
}
