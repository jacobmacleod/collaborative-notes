'use client';

import Image from "next/image";
import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";


export default function Home() {

  function downloadFile() {
    var filename = window.prompt("Please enter the file name: ", "filename.txt");
    var content = (document.getElementById("notepad") as HTMLInputElement)?.value;
    var element = document.createElement('a');
    var blob = new Blob([content], {type: 'text/plain'});
    var fileUrl = URL.createObjectURL(blob);
    
    if (filename != null) {
      var isTxt = filename?.endsWith(".txt");
      if (!isTxt) {
        filename = filename + ".txt";
      }
    
      element.setAttribute('href', fileUrl);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  return (
    <html>
      <head>
      </head>
      <body>
        <button id="download" onClick={downloadFile}>Download file</button>
        <Room>
          <CollaborativeApp />
        </Room>
        <script type="text/javascript">
        </script>
      </body>
    </html>
  );
}
