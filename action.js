document.getElementById('chooseTest').addEventListener('submit', function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      tamatebako:document.getElementById('tamatebako').checked,
      spi:document.getElementById('spi').checked,
      tgweb:document.getElementById('tgweb').checked,
      gab:document.getElementById('gab').checked
      });
  });
  chrome.tabs.executeScript({
    file: "./injector.js"
  });
});
