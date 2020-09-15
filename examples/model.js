var model = {
  pageMargins: [40, 80, 40, 60],
  content: [

    // Title
    {
      text: 'Order confirmation',
      style: 'titre'
    },

    // Headers
    {
      columns: [
        // Array num, date and client
        {
          width: 250,
          style: "normal",
          table: {
            headerRows: 1,
            body: [
              [
                {
                  text: 'NUM',
                  style: 'tableHeader',
                  alignment: 'left'
                }, {
                  text: 'DATE',
                  style: 'tableHeader',
                  alignment: 'left'
                }, {
                  text: 'CLIENT',
                  style: 'tableHeader',
                  alignment: 'left'
                }
              ],
              [
                {
                  text: '<sDoc>document.numero</sDoc>',
                  style: 'tableHeader',
                  alignment: 'left'
                },
                {
                  text: '<sDoc>document.date</sDoc>',
                  style: 'tableHeader',
                  alignment: 'left'
                },
                {
                  text: '<sDoc>document.client</sDoc>',
                  style: 'tableHeader',
                  alignment: 'left'
                }
              ],
              [
                {
                  colSpan: 3,
                  text: 'Your reference : <sDoc>document.reference</sDoc>\n\n'
                },
                ''
              ]
            ]
          }
        },

        // Adress
        {
          width: 300,
          text: '<sDoc>document.adress</sDoc>'
        }
      ]
    },

    // Additional information
    {
      text: '\n'
    }, {
      text: 'Client phone : <sDoc>client.phone</sDoc> Client cellphone: <sDoc>client.cellphone</sDoc>'
    }, {
      text: 'interlocutor : <sDoc>client.interlocutor</sDoc> - Email : <sDoc>client.email</sDoc>'
    }, {
      text: 'Commercial contact  : <sDoc>client.commercialContact</sDoc>'
    }, {
      alignment: 'right',
      text: '<sDoc>agency</sDoc>'
    },

    //Tableau des lignes
    {
      widths: 400,
      style: 'small',
      layout: {
        fillColor: function(i, node) {
          return (i % 2 === 0)
            ? 'yellow'
            : null;
        },
        hLineWidth: function(i, node) {
          return (i === 0 || i === node.table.body.length || i === node.table.headerRows)
            ? 2
            : 1;
        },
        vLineWidth: function(i, node) {
          return (i === 0 || i === node.table.widths.length)
            ? 2
            : 0;
        },
        hLineColor: function(i, node) {
          return (i === 0 || i === node.table.body.length || i === node.table.headerRows)
            ? 'black'
            : 'grey';
        },
        vLineColor: function(i, node) {
          return (i === 0 || i === node.table.widths.length)
            ? 'black'
            : 'grey';
        }
      },
      table: {
        widths: ['*', 45, 15, 50, 50],
        headerRows: 1, // the first x lines are headers ( in our case 1 header line)
        keepWithHeaderRows: 1, //To replace the table headers on the following pages
        dontBreakRows: true, // So that a line is not cut between 2 pages
        forOrder: ["normal", "array", "composant", "commentaire"],
        body: [
          [
            {text: 'DESIGNATION', alignment: 'left',	style: 'smallbold', border: [true, true, true, true]},
            {text: 'QTY TO PREP', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
            {text: 'U', alignment: 'center',	style: 'smallbold', border: [true, true, true, true]},
            {text: 'LOCATION', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
            {text: 'REST', alignment: 'right',	style: 'smallbold', border: [true, true, true, true]},
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
            {
              table: {
                widths: [15, '*', 'auto'],
                body: [
                  [
                    {text: '>>', alignment: 'left',	style: 'StyleLigne', border: [false, false, false, false]},
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
    },
    // Table of different VAT and total.
    {
      style: 'small',
      layout: {
        hLineWidth: function(i, node) {
          return (i === 0 || i === node.table.body.length)
            ? 2
            : 1;
        },
        vLineWidth: function(i, node) {
          return (i === 0 || i === node.table.widths.length)
            ? 2
            : 1;
        },
        hLineColor: function(i, node) {
          return (i === 0 || i === node.table.body.length || i === node.table.headerRows)
            ? 'black'
            : 'gray';
        },
        vLineColor: function(i, node) {
          return (i === 0 || i === node.table.widths.length)
            ? 'black'
            : 'gray';
        }
      },
      table: {
        widths: [6,65,65,68,82,80,83],
        headerRows: 1,
        forOrder: ["normalTva", "testTva"],
        dataName: "vat",
        body: [
          [
            {
              border: [
                true, false, true, true
              ],
              text: 'T',
              style: 'tableHeader',
              alignment: 'left'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'VAT rate',
              style: 'tableHeader',
              alignment: 'right'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'VAT base',
              style: 'tableHeader',
              alignment: 'right'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'VAT amount',
              style: 'tableHeader',
              alignment: 'right'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'Total E.T.',
              style: 'tableHeaderTotal',
              alignment: 'center',
              fillColor: '<sDoc>rose</sDoc>'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'Total VAT',
              style: 'tableHeaderTotal',
              alignment: 'center',
              fillColor: '<sDoc>rose</sDoc>'
            }, {
              border: [
                true, false, true, true
              ],
              text: 'net payable',
              style: 'tableHeaderTotal',
              alignment: 'center',
              fillColor: '<sDoc>rose</sDoc>'
            }
          ],
          [
            {
              text: '<sDoc>vat.index</sDoc>',
              alignment: 'left'
            }, {
              text: '<sDoc>vat.rate</sDoc>',
              alignment: 'right'
            }, {
              text: '<sDoc>vat.baseVAT</sDoc>',
              alignment: 'right'
            }, {
              text: '<sDoc>vat.amountVAT</sDoc>',
              alignment: 'right'
            }, {
              text: '<sDoc>vat.billTotalET</sDoc>',
              rowSpan: 2,
              alignment: 'center',
              fillColor: '#F5F5F5',
              margin: [0, 8, 0, 0]
            }, {
              text: '<sDoc>vat.billTotalVAT</sDoc>',
              rowSpan: 2,
              alignment: 'center',
              fillColor: '#F5F5F5',
              margin: [0, 8, 0, 0]
            }, {
              text: '<sDoc>vat.billTotalNet</sDoc>',
              rowSpan: 2,
              alignment: 'center',
              fillColor: '<sDoc>vat.rose</sDoc>',
              margin: [0, 8, 0, 0]
            }
          ],
          [
            {
              table: {
                body: [
                  [
                    {text: '<sDoc>vat.index</sDoc>', fillColor: '<sDoc>rose</sDoc>'},
                    {text: '<sDoc>vat.rate</sDoc>'},
                    {text: '<sDoc>vat.baseVAT</sDoc>'}
                  ],
                  [
                    {
                      table: {
                        body: [
                          [{text: '<sDoc>vat.rose</sDoc>', fillColor: '<sDoc>rose</sDoc>'}, 'Col2', 'Col3'],
                          ['1', '2', '3'],
                          ['1', '2', '3']
                        ]
                      },
                    },
                    {text: '<sDoc>vat.rate</sDoc>'},
                    {text: '<sDoc>vat.baseVAT</sDoc>'}
                  ]
                ]
              },
              colSpan: 7
            }
          ]
        ]
      }
    },
    // Table of general information
    {
      table: {
        widths: [
          231, 265
        ],
        headerRows: 1,
        body: [
          [
            {
              border: [
                true, false, true, true
              ],
              colSpan: 2,
              text: 'Additional information',
              style: 'tableHeader',
              alignment: 'left'
            }, {
              border: [
                true, false, true, true
              ],
              text: '',
              style: 'tableHeader',
              alignment: 'left'
            }
          ],
          [
            {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: 'Delivery week <sDoc>info.week</sDoc>'
            }, {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: 'Weight : <sDoc>info.weight</sDoc>'
            }
          ],
          [
            {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: ''
            }, {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: 'Postage : <sDoc>info.postage</sDoc>'
            }
          ],
          [
            {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: ''
            }, {
              border: [
                true, false, true, false
              ],
              style: 'small',
              text: 'Payment : <sDoc>info.payment</sDoc>'
            }
          ],
          // Last line to close table
          [
            {
              border: [
                true, false, true, true
              ],
              height: 1,
              text: ''
            }, {
              border: [
                true, false, true, true
              ],
              height: 1,
              text: ''
            }
          ]
        ]
      }
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
  },
  styles: {
    StyleLigne: {
      italics: true
    },
    titre: {
      fontSize: 20,
      bold: true,
      color: '<sDoc>rose</sDoc>'
    },
    normal: {
      fontSize: 10
    },
    small: {
      fontSize: 8
    },
    smallbold: {
      fontSize: 8,
      bold: true
    },
    tableHeaderTotal: {
      fontsize: 8,
      bold: true
    }
  }
};

module.exports = model;
