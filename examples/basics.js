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
sDoc.setModel(model);
sDoc.setData(data);
sDoc.createPDFMakeDD((dd)=> {
  var pdfDoc = printer.createPdfKitDocument(dd);
  pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
  pdfDoc.end();
});
