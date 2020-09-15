var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

var salesDocument = require('../index.js');
var model = require('./model.js');
var data = require('./data.js');
var PdfPrinter = require("pdfmake/src/printer");
var printer = new PdfPrinter(fonts);
var fs = require("fs");

var sDoc = new salesDocument();
sDoc.removeHeaderFirstPage();
sDoc.setModel(model);
sDoc.setData(data);
sDoc.createPDFMakeDD((dd)=> {
  sDoc.addDocument(data, (dd2)=> {
    sDoc.addDocument(data, (dd3)=> {
      sDoc.addDocument(data, (dd4)=> {
        var pdfDoc = printer.createPdfKitDocument(dd4);
        pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
        pdfDoc.end();
      });
    });
  });
});
