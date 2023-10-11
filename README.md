# jspdfexample
In this example project the JavaScript Runtime App Srevice is used to create a PDF file by utilizing a JavaScript PDF library pdf-lib https://pdf-lib.js.org/.

To be able to use the library in the JavaScript Runtime following preparations are required:
* enable access to global object from any context (https://wiki.duktape.org/howtoglobalobjectreference) - this is done by including global.js
* add Promise polyfill - this is done by including polyfill.js
* add compatibility shims for ECMAScript 6 https://www.npmjs.com/package/es6-shim and ECMAScript 7 https://www.npmjs.com/package/es7-shim (dist version from npm) - this is done by including es6-shim.js/es7-shim.js

The [App](jspdfexample/httpfiles/innovaphone-jspdfexample.js) sends a JSON API message to the App Service after the successfull AppWebsocket connsction to the App Service:
```json
{"api":"PDFApi","mt":"GetPDF","name":"Atlantis"}
```

The [App Service](jspdfexample/innovaphone-jspdfexampleservice.js) creates a PDF, saves it as a Base64 encoded Data URL and sends it back as a JSON API response:
```json
{"api":"PDFApi","mt":"GetPDFResult","data":"data:application/pdf;base64,JVBE...JUVPRg=="}
```

The PDF is created on the App Service (innovaphone-jspdfexampleservice.js) with the following usage of the PDFLib library:
```javascript
    var PDFDocument = PDFLib.PDFDocument;
    var PageSizes = PDFLib.PageSizes;
    var doc = PDFDocument.create();
    doc.then(function (pdfDoc) {
        var page = pdfDoc.addPage(PageSizes.A7);
        page.drawText("Hello, " + name + "!", { x: 24, y: 180, size: 12 });
        pdfDoc.saveAsBase64({ dataUri: true }).then(function (pdfDataUri) {
            callback(pdfDataUri); // send data via a callback to the JSON API handler
        });
    });
```
