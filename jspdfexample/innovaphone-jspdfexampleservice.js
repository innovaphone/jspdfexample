var createPdfWithName = function (name, callback) {
    var PDFDocument = PDFLib.PDFDocument;
    var PageSizes = PDFLib.PageSizes;
    var doc = PDFDocument.create();
    doc.then(function (pdfDoc) {
        var page = pdfDoc.addPage(PageSizes.A7);
        page.drawText("Hello, " + name + "!", { x: 24, y: 180, size: 12 });
        pdfDoc.saveAsBase64({ dataUri: true }).then(function (pdfDataUri) {
            callback(pdfDataUri);  // send data via a callback to the JSON API handler
        });
    });
};


new JsonApi("PDFApi").onconnected(function (conn) {
    if (conn.app === "innovaphone-jspdfexample") {
        conn.onmessage(function (msg) {
            var obj = JSON.parse(msg);
            if (obj.mt === "GetPDF" && "name" in obj && obj.name !== "") {
                var callback = function (data) {
                    conn.send(JSON.stringify({ api: "PDFApi", mt: "GetPDFResult", data: data, src: obj.src }));
                };
                createPdfWithName(obj.name, callback);
            }
        });
    }
});





/*

const pdfDoc = await PDFDocument.create()
const page = pdfDoc.addPage()
page.drawText('You can create PDFs!')
const pdfBytes = await pdfDoc.save()

*/