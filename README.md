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
  ]
}
```

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

Example :
```javascript
table : {
  forOrder: ['normal', 'comment', 'array'],
  body : [
    [
      {
        text: '<sDoc>tva.index</sDoc>',
        alignment: 'left'
      }, {
        text: '<sDoc>tva.taux</sDoc>',
        alignment: 'right'
      }, {
        text: '<sDoc>tva.baseTVA</sDoc>',
        alignment: 'right'
      }, {
        text: '<sDoc>tva.montantTVA</sDoc>',
        alignment: 'right'
      }, {
        text: '<sDoc>tva.pieceTotalHT</sDoc>',
        rowSpan: 1,
        alignment: 'center',
        fillColor: '#F5F5F5',
        margin: [0, 8, 0, 0]
      }, {
        text: '<sDoc>tva.pieceTotalTva</sDoc>',
        rowSpan: 1,
        alignment: 'center',
        fillColor: '#F5F5F5',
        margin: [0, 8, 0, 0]
      }, {
        text: '<sDoc>tva.pieceTotalNet</sDoc>',
        rowSpan: 1,
        alignment: 'center',
        fillColor: '#F5F5F5',
        margin: [0, 8, 0, 0]
      }
    ]
  ],
  [
    {
      colSpan: 10,
      border: [
        true, false, true, false
      ],
      text: '<sDoc>ligne.comment</sDoc>'
    },
    ''
  ],
  [
    {
      colSpan: 10,
      table: {
        widths: [50,178,35,16,38,20,20,35,37,2],
        body: [
          [
            {text: '<sDoc>line_array.code</sDoc>'},
            {text: '<sDoc>line_array.designation</sDoc>'},
            {text: '<sDoc>line_array.quantity</sDoc>',alignment: 'right'},
            {text: '<sDoc>line_array.unity</sDoc>'},
            {text: '<sDoc>line_array.publicPrice</sDoc>', alignment: 'right'},
            {text: '<sDoc>line_array.R</sDoc>', alignment: 'right'},
            {text: '<sDoc>line_array.RC</sDoc>', alignment: 'right'},
            {text: '<sDoc>line_array.netUnitPrice</sDoc>', alignment: 'right'},
            {text: '<sDoc>line_array.totalExclTaxes</sDoc>', alignment: 'right'},
            {text: '<sDoc>line_array.T</sDoc>'}
          ]
        ]
      },
      layout: 'noBorders'
    },
    ''
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
  line : [
    {
      //firstLine
    },
    {
      line_array: []
      //secondLine array
    }
  ],
  info : {
    weight: "5kg",
    week : "10"
  }
}
```
