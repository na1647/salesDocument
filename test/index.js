var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};
var model = require('../examples/model.js');
var data = require('../examples/data.js');
var PdfPrinter = require("pdfmake/src/printer");
var salesDocument = require('../index.js');
var printer = new PdfPrinter(fonts);
var fs = require("fs");
var assert = require('assert');

describe('salesDocument', function(){
	var dd_pdf;

  beforeEach(function(done) {
    var sDoc = new salesDocument();
    sDoc.setModel(model);
    sDoc.setData(data);
    sDoc.createPDFMakeDD((dd)=> {
      dd_pdf = dd;
      done();
    });
  });

  it('It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[3].text, 'Client phone : 0123456789 Client cellphone: 0612345789');
  });

  it('Array without property dataName: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[7].table.body[1][0].table.body[0][1].text, 'LASER PRINTER (REF)');
  });
  it('Change style color with value defined in the data', function(){
    assert.strictEqual(dd_pdf.styles.titre.color, '#ff80ff');
  });
  it('Array with property dataName and level 2 (array in array) : It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[3][0].table.body[0][0].text, '1');
  });
  it('Array with property dataName and level 3 (array in array) : It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[3][0].table.body[1][0].table.body[0][0].text, '#FF00FF');
  });
  it('Array with property dataName and level 2 (array in array) : It should display correct fill color', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[3][0].table.body[0][0].fillColor, '#ff80ff');
  });
  it('Array with property dataName and level 3 (array in array) : It should display correct fill color', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[3][0].table.body[1][0].table.body[0][0].fillColor, '#ff80ff');
  });
});
