var data = {
  libelles_traduits: {
    dontlot: "whose"
  },
  footer: "un footer",
  rose: "#ff80ff",
  document : {
    numero: 1234,
    date: '01/01/1995',
    client: "2ALPE",
    reference: 5678,
    adress: "6th Ave"
  },
  client: {
    phone: "0123456789",
    cellphone: "0612345789",
    interlocutor: "Mr. Smith",
    email: "DUPONT@contact.fr",
    commercialContact: "Mr. Smith"
  },
  image_test : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyM'+
  'jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAApACEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRol'+
  'JicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAt'+
  'REAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1'+
  'dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC/8Lfhb4N8R/DjSdW1bRvtF9P53mS/apk3bZnUcK4A4AHArsP+FJfDz/oXv/J24/8AjlHwS/5JDoX/AG8f+lElegUAef8A/Ckvh5/0L3/k7cf/AByuP+KXwt8G+HPhxq2raTo32e+g8ny5ftUz7d0yKeGcg8EjkV7h'+
  'Xn/xt/5JDrv/AG7/APpRHQB6BRRRQB5/8Ev+SQ6F/wBvH/pRJXoFef8AwS/5JDoX/bx/6USV6BQAV5/8bf8AkkOu/wDbv/6UR16BXn/xt/5JDrv/AG7/APpRHQB6BRRRQB4f8Lfil4N8OfDjSdJ1bWfs99B53mRfZZn27pnYcqhB4IPBrsP+F2/Dz/oYf/JK4/8AjdegUUAef/8AC7fh5/0MP/klcf8AxuuP+KXxS8G+I/hxq2k6TrP2i+n8ny4vssybtsyMeWQAcAnk17hRQAUUUUAf/9k=',
  ligne : [
    {
      line_array: [
        {
          code:'1206008034',
          designation:'LASER PRINTER (REF)',
          quantity:'1.000',
          unity:'U',
          publicPrice:'',
          R:'',
          RC:'',
          netUnitPrice:'353.31',
          totalExclTaxes:'353.31',
          T:'1'
        }, {
          designation:'- Ecotax',
          totalExclTaxes:'2.50',
        }
      ],
      type: "array"
    },
    {
      code:'1206008034',
      designation:'WOODEN DESK ',
      quantity:'1.000',
      unity:'U',
      publicPrice:'20',
      R:'',
      RC:'',
      netUnitPrice:'256.99',
      totalExclTaxes:'256.99',
      T:'1',
      type: "normal"
    },
    {
      lots: [ { type: 'lot', qte: '1.000', libelle: 'not attributed' } ],
      type: "lot"
    },
    {
      code:'1234',
      designation:'COMPUTER',
      quantity:'1.000',
      unity:'U',
      publicPrice:'',
      R:'',
      RC:'',
      netUnitPrice:'1000.00',
      totalExclTaxes:'1000.00',
      T:'1',
      type: "normal"
    },
    {
      code:'12341',
      designation:'COMPUTER TOWER',
      quantity:'1.000',
      unity:'U',
      T:'1',
      level: 1,
      type: "composant"
    },
    {
      code:'12342',
      designation:'SCREEN',
      quantity:'1.000',
      unity:'U',
      T:'1',
      type: "composant",
      level: 3
    },
    {
      comment: 'Deferred delivery for the rest of the invoice',
      type: "commentaire"
    },
    {
      code:'1206008034',
      designation:'OFFICE CHAIRS',
      quantity:'2.000',
      unity:'U',
      publicPrice:'',
      R:'',
      RC:'',
      netUnitPrice:'160.99',
      totalExclTaxes:'160.99',
      T:'1',
      type: "composant",
      level: 2
    },
    {
      code:'1206008034',
      designation:'OFFICE CHAIRS',
      quantity:'2.000',
      unity:'U',
      publicPrice:'',
      R:'',
      RC:'',
      netUnitPrice:'160.99',
      totalExclTaxes:'160.99',
      T:'1',
      type: "undefined",
      level: 2
    }
  ],
  info : {
    week: "12",
    weight: "5kg",
    postage: "advanced port",
    payment: "Transfer 30 days from the end of the month"
  },
  vat: [
    {
      index: "1",
      rate: "10",
      baseVAT: "100",
      amountVAT: "10",
      billTotalET: "100",
      billTotalVAT: "15.5",
      billTotalNet: "115.5",
      type: "normalTva",
      rose: "#FF00FF"
    },
    {
      index: "2",
      rate: "5.5",
      baseVAT: "100.00",
      amountVAT: "5.5",
      type: "normalTva"
    },
    {
      index: "1",
      rate: "10",
      baseVAT: "100",
      amountVAT: "10",
      billTotalET: "100",
      billTotalVAT: "15.5",
      billTotalNet: "115.5",
      type: "testTva",
      rose: "#FF00FF"
    }
  ],
  agency: "N.Y."
};

module.exports = data;
