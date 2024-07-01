var downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', function() {
    var filename = window.prompt("Please enter the file name: ", "filename.txt");
    var content = document.getElementById("notepad").value;
    var element = document.createElement('a');
    var blob = new Blob([content], {type: 'text/plain'});
    var fileUrl = URL.createObjectURL(blob);
  
    var isTxt = filename.endsWith(".txt");
    if (!isTxt) {
      filename = filename + ".txt";
    }
  
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});