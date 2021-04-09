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
var salesDocument = require('../index.js');
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

  it('It should return correct image base 64 in sDocImage tag', function(){
    assert.strictEqual(dd_pdf.content[2].image, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyM'+
    'jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAApACEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRol'+
    'JicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAt'+
    'REAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1'+
    'dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC/8Lfhb4N8R/DjSdW1bRvtF9P53mS/apk3bZnUcK4A4AHArsP+FJfDz/oXv/J24/8AjlHwS/5JDoX/AG8f+lElegUAef8A/Ckvh5/0L3/k7cf/AByuP+KXwt8G+HPhxq2raTo32e+g8ny5ftUz7d0yKeGcg8EjkV7h'+
    'Xn/xt/5JDrv/AG7/APpRHQB6BRRRQB5/8Ev+SQ6F/wBvH/pRJXoFef8AwS/5JDoX/bx/6USV6BQAV5/8bf8AkkOu/wDbv/6UR16BXn/xt/5JDrv/AG7/APpRHQB6BRRRQB4f8Lfil4N8OfDjSdJ1bWfs99B53mRfZZn27pnYcqhB4IPBrsP+F2/Dz/oYf/JK4/8AjdegUUAef/8AC7fh5/0MP/klcf8AxuuP+KXxS8G+I/hxq2k6TrP2i+n8ny4vssybtsyMeWQAcAnk17hRQAUUUUAf/9k=');
  });

  it('It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[4].text, 'Client phone : 0123456789 Client cellphone: 0612345789');
  });

  it('Array without property dataName: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[1][0].table.body[0][1].text, 'LASER PRINTER (REF)');
  });
  it('Change style color with value defined in the data', function(){
    assert.strictEqual(dd_pdf.styles.titre.color, '#ff80ff');
  });
  it('Array with property dataName and level 2 (array in array) : It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[0][0].text, '1');
  });
  it('Array with property dataName and level 3 (array in array) : It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[1][0].table.body[0][0].text, '#FF00FF');
  });
  it('Array with property dataName and level 2 (array in array) : It should display correct fill color', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[0][0].fillColor, '#ff80ff');
  });
  it('Array with property dataName and level 3 (array in array) : It should display correct fill color', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[1][0].table.body[0][0].fillColor, '#ff80ff');
  });
  it('Array with property dataName and level 2 (array in array) : It should return correct image base 64 in sDocImage tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[1][6].image, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyM'+
    'jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAApACEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRol'+
    'JicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAt'+
    'REAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1'+
    'dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC/8Lfhb4N8R/DjSdW1bRvtF9P53mS/apk3bZnUcK4A4AHArsP+FJfDz/oXv/J24/8AjlHwS/5JDoX/AG8f+lElegUAef8A/Ckvh5/0L3/k7cf/AByuP+KXwt8G+HPhxq2raTo32e+g8ny5ftUz7d0yKeGcg8EjkV7h'+
    'Xn/xt/5JDrv/AG7/APpRHQB6BRRRQB5/8Ev+SQ6F/wBvH/pRJXoFef8AwS/5JDoX/bx/6USV6BQAV5/8bf8AkkOu/wDbv/6UR16BXn/xt/5JDrv/AG7/APpRHQB6BRRRQB4f8Lfil4N8OfDjSdJ1bWfs99B53mRfZZn27pnYcqhB4IPBrsP+F2/Dz/oYf/JK4/8AjdegUUAef/8AC7fh5/0MP/klcf8AxuuP+KXxS8G+I/hxq2k6TrP2i+n8ny4vssybtsyMeWQAcAnk17hRQAUUUUAf/9k=');
  });
  it('Array with property dataName and level 3 (array in array) : It should return correct image base 64 in sDocImage tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[1][0].table.body[0][2].image, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyM'+
    'jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAApACEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRol'+
    'JicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAt'+
    'REAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1'+
    'dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC/8Lfhb4N8R/DjSdW1bRvtF9P53mS/apk3bZnUcK4A4AHArsP+FJfDz/oXv/J24/8AjlHwS/5JDoX/AG8f+lElegUAef8A/Ckvh5/0L3/k7cf/AByuP+KXwt8G+HPhxq2raTo32e+g8ny5ftUz7d0yKeGcg8EjkV7h'+
    'Xn/xt/5JDrv/AG7/APpRHQB6BRRRQB5/8Ev+SQ6F/wBvH/pRJXoFef8AwS/5JDoX/bx/6USV6BQAV5/8bf8AkkOu/wDbv/6UR16BXn/xt/5JDrv/AG7/APpRHQB6BRRRQB4f8Lfil4N8OfDjSdJ1bWfs99B53mRfZZn27pnYcqhB4IPBrsP+F2/Dz/oYf/JK4/8AjdegUUAef/8AC7fh5/0MP/klcf8AxuuP+KXxS8G+I/hxq2k6TrP2i+n8ny4vssybtsyMeWQAcAnk17hRQAUUUUAf/9k=');
  });
  it('Lot type line : It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[8].table.body[3][0].text, 'whose not attributed');
  });
  it('Normal table header cell: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[0][4].style, 'mediumbold');
  });
  it('Normal table row cell: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[9].table.body[3][0].table.body[0][0].color, '#e3e3e3');
  });
  it('Totals table header cell: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[10].table.body[0][0].style, 'mediumbold');
  });
  it('Totals table row cell: It should return correct value in sDoc tag', function(){
    assert.strictEqual(dd_pdf.content[10].table.body[1][0].color, '#e3e3e3');
  });
});
