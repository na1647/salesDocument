# salesDocument

SalesDocument is a class that provide functions to create sales document with a model create with pdfmake and with data

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

We can change model or data after initialisation with setters :
```javascript
myObject.setModel(model);
myObject.setData(data);
```

The main function of class is `createPDFMakeDD`, that put data into model and create a pdfmake dd, then we can use pdfmake to create a pdf
```javascript
myObject.createPDFMakeDD( function(dd) {
  // some code
});
```

## Create the model
The model is a document definition of pdfmake so we can use any features available in pdfmake

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

In our model we can create a `for` in our table for that we just need to add `forOrder` attribute.

That attribute is an array of string with in order the different type of line, like `normal`, `comment` ...

Example :
```javascript
table : {
  width : ...,
  headerRows: 1,
  forOrder: ['normal', 'comment', 'other'],
  body : [
    // The first line is the header
    // headerRows define how many line we skip before model of line
    [
      {
        headerRow
      }
    ],
    //normal line
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
  forOrder: ["normal", "array", "composant", "commentaire"],
  body: [
    [
      {text: 'DESIGNATION', alignment: 'left',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'QTE A PREP', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'U', alignment: 'center',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'EMPLAC.', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
      {text: 'RESTE', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
    ],
    [
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
      //Zone de designation
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
    }
  ],
  info : {
    weight: "5kg",
    week : "10"
  }
}
```
