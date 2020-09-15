# salesDocument

SalesDocument is a class that provide functions to create a sale document with a model using pdfmake and somes datas.

When the sale document is created, anyone can modify the model to modify the look and feel of the document without modifying any code line.

You modify the model and use SalesDocument to regenerate the sale document with the new properties.

You can put in the sale document all the poperties which are located in the datas witout modifying code line.

You can let your customers modify the model or generate their own models of their documents.

SalesDocument permit you to generate all the documents you have in head. For example you can generate follow up letters, order, order's picking, delivery, invoice, etc.

## Installation
Just do an npm install in your project folder :

```
npm install salesDocument
```

## Run example
You need to install pdfmake in the project :
```
npm install pdfmake
```
After that you need to go in example folders and use `node` commands :

```
node basics.js
```

That will create a pdf in pdfs folders. You can change model and data in corresponding files

## Usage
SalesDocument is a instantiable object.

The object take the pdfmake model and put the data into that.

For use SalesDocument we need to require or import the class :
```javascript
var salesDocument = require('salesDocument');
//or
import salesDocument from 'salesDocument'
```

Next we need to create the object :
```javascript
var myObject = new salesDocument(model, data)
```

To remove header in the first page , we can use removeHeaderFirstPage function :
```javascript
myObject.removeHeaderFirstPage();
```

We can change model or data after initialisation with setters :
```javascript
myObject.setModel(model);
myObject.setData(data);
```

The main function of class is `createPDFMakeDD`, that put data into model and create a pdfmake dd, then we can use pdfmake to create a pdf
Call the first time with the first document with its data
Modify all document ( header and footer ) with the data
Pagination by document
```javascript
myObject.createPDFMakeDD( function(dd) {
  // some code
});
```

Add new document folowing the pdf
From the second document we use this function
The data to modify in the new document is passed to it as a parameter
```javascript
myObject.addDocument(data, function(dd) {
  // some code
});
```
## Create the model
The model is a document definition of pdfmake so we can use any features available in pdfmake.

To create a model with dynamic data we just need to use a tag with data we want to be modify. Per default the tag is sDoc


Example :
```javascript
var dd = {
  content: [
    {
      text: '<sDoc>document.date</sDoc>'
    }
  ],
  header: [
    {
      style: 'tableMargin10',
      color: '#444',
      table: {
        widths: ['*', 100, 250],
        body: [
          [
            {// ligne du haut
              colSpan: 3,
              text: '',
              fillColor: "#2e99cd",
              border: [false, false, false, false],
              margin: [8, 0, 8, 0]
            },
            '',
            ''
          ]
        ]
      }
    },
    {
      style: 'tableMargin10',
      color: '#444',
      table: {
        widths: ['*', 1, 65],
        body: [
          [
            [
              'or a nested table',
							{
                table: {
                  body: [
                    [ {text: '<sDoc>client.phone</sDoc>'},  {text:'<sDoc>client.phone</sDoc>'},  {text:'<currentPage/>'}],
                    ['1pagecount', {text: 'pageeee count <pageCount/>'}, '3'],
                    ['1', '2', '3']
                  ]
                },
							}
						],
            {
              border: [false, false, false, false],
              text: ''
            },
            { // titre du pdf
              border: [false, false, false, false],
              fillColor: "#2e99cd",
              text: '<sDoc>document.date</sDoc>' + " <currentPage/>" + ' / ' + "<pageCount/>",
              color: '<sDoc>rose</sDoc>',
              margin: [5, 3, 0, 3],
              fontSize: 12,
              bold: true
            }
          ]
        ]
      }
    }
  ],
  footer: {
    text: '<sDoc>footer</sDoc>' + " <currentPage/>" + ' / ' + "<pageCount/>",
    alignment: 'right',
    margin: [10, 0, 12, 0]
  }
}

```
In the header or the footer we can use the tag `<currentPage/>` to display current page and the tag  `<pageCount/>` to display the total number of pages.

In your model you can create a loop (`for`) in your table. For that you just need to add `forOrder` attribute.

SalesDocument will loop all times is needed to fullfill the table with the datas. For every one line of datas, you determine the type of line model you want to be used by filling the "type" propertie in the data line and SalesDocument will used the correct linem model using the "forOrder" propertie which is in the model

That attribute is an array of string with in order the different type of line, like `orderline`, `commentline` ... It's important respecting order of type of line when you code the model.

WARNING : we can't use type line `lot` , it's a reserved type

SalesDocument need to know where it must search the datas for the table which must be fill up. To perform this, you need to fill the dataname propertie in the model. In the example below, the dataname is "OrderLines". You can name it with what you want. But the name must be the same in the model and in the datas.

The first description line of a table is the columns headers rows

Example :
```javascript
table : {
  width : ...,
  headerRows: 1,
  forOrder: ['orderline', 'commentline', 'other'],
  body : [
    // The first line is the header
    // headerRows define how many line we skip before model of line
    [
      {
        //headerRow
	...
      }
    ],
    //order line
    [...],
    //comment line
    [...],
    //other line
    [...]
  ]
}
```

If we want a column to take all rows we just need to put in line `rowSpan: x`, x is the number of model line and header line.

It will take automatically all the line.

For a component line , we must define a level. For each level with have a arrow in the first line.

Example :
```javascript
table: {
  widths: ['*', 45, 15, 50, 50],
  headerRows: 1, // the first x lines are headers ( in our case 1 header line)
  keepWithHeaderRows: 1, //To replace the table headers on the following pages
  dontBreakRows: true, // So that a line is not cut between 2 pages
  forOrder: ["orderline", "array", "component", "commentline"],
  dataname: "OrderLines",
  body: [
    [
      // Header row
      {text: 'DESIGNATION', alignment: 'left',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'QTE A PREP', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'U', alignment: 'center',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'EMPLAC.', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'RESTE', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
    ],
    [
      //orderline
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              {text: '<sDoc>ligne.code</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
              {text: 'Ref Frs : <sDoc>ligne.code</sDoc>', alignment: 'right',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
            [
              {colSpan: 2, text: '<sDoc>ligne.designation</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
            [
              {colSpan: 2, text: 'Stock : <sDoc>ligne.unity</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
          ]
        }

      },
      {	style: 'StyleLigne', text:'<sDoc>ligne.publicPrice</sDoc>', alignment: 'right'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.unity</sDoc>'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.netUnitPrice</sDoc>'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.totalExclTaxes</sDoc>'},
    ],
    [
     // array line
     {
        colSpan: 5,
        table: {
          widths: [150, 165, 35, 20, 35,35],
          body: [
            [
              {text: '<sDoc>line_array.code</sDoc>'},
              {text: '<sDoc>line_array.designation</sDoc>'},
              {text: '<sDoc>line_array.quantity</sDoc>',alignment: 'right'},
              {	style: 'StyleLigne', text:'<sDoc>ligne.unity</sDoc>'},

              {text: '<sDoc>line_array.T</sDoc>'},
              {text: '<sDoc>line_array.totalExclTaxes</sDoc>', alignment: 'right'}

            ]
          ]
        },
        layout: 'noBorders'
      },
      ''
    ],
    [
      // component line
      {
        table: {
          widths: [10, '*', 'auto'],
          body: [
            [
              {text: '->', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
              {text: '<sDoc>ligne.code</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
              {text: 'Ref Frs : <sDoc>ligne.code</sDoc>', alignment: 'right',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
            [
              {colSpan: 3, text: '<sDoc>ligne.designation</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
            [
              {colSpan: 3, text: 'Stock : <sDoc>ligne.unity</sDoc>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
            ],
          ]
        }

      },
      {	style: 'StyleLigne', text:'<sDoc>ligne.publicPrice</sDoc>', alignment: 'right'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.unity</sDoc>'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.netUnitPrice</sDoc>'},
      {	style: 'StyleLigne', text:'<sDoc>ligne.totalExclTaxes</sDoc>'},
    ],
    // commentline
    [{colSpan: 5, border: [true, false, true, false], text: '<sDoc>ligne.comment</sDoc>\n'}, '']
  ]
}
```

## Example of data

```javascript
var data = {
  document : {
    date: "01/01/2018",
    ref : "12345678"
  },
  OrderLines : [
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
      type: "orderline"
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
      type: "orderline"
    },
    {
      code:'12341',
      designation:'COMPUTER TOWER',
      quantity:'1.000',
      unity:'U',
      T:'1',
      level: 1,
      type: "component"
    },
    {
      code:'12342',
      designation:'SCREEN',
      quantity:'1.000',
      unity:'U',
      T:'1',
      type: "component",
      level: 3
    },
    {
      comment: 'Deferred delivery for the rest of the invoice',
      type: "commentline"
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
      type: "component",
      level: 2
    }
  ],
  info : {
    weight: "5kg",
    week : "10"
  }
}
```
