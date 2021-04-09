var _ = require("lodash");
var asynk = require("asynk");

class salesDocument {
  constructor(model, data) {
    if (model) {
      this.setModel(model);
    }
    if (data) {
      this.setData(data);
    }
    // Define default tag for replace data
    this._tag = "sDoc";
    this._tagImage = "sDocImage";
    this._tagCurrentPage = "<currentPage/>";
    this._tagPageCount = "<pageCount/>";
    // Select the tag in first group and is content in second group.
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'g');
    this._regexTagImage = new RegExp(`<(${this._tagImage})>([\\s\\S]*?)</\\1>`, 'g');
    this.num_page_rupture_header = 0;
    this.current_page_header = 1;
    this.page_count_header = 1;
    this.next_index_header = 0;

    this.num_page_rupture_footer = 0;
    this.current_page_footer = 0;
    this.page_count_footer = 1;
    this.next_index_footer = 0;
  }

  setModel(model) {
    var self = this;
    this._model = model;
    // Clone the model in dd to avoid to replace model.
    this.dd = _.cloneDeep(this._model);
    this.dd.content = [];
    this._model.parse = function(text) {
      return self._replaceTag(text);
    };
  }

  setData(data) {
    this._data = data;
  }

  // add new document folowing the pdf
  // from the second document we use this function
  addDocument(data, cb) {
    this.setData(data);
    this.content = _.cloneDeep(this._model.content);
    this._recursiveFindObject(this.content, () => {
      if (this.dd.content.length > 0) {
        this.content.unshift({ text: ' ', style: 'normal', pageBreak: 'before' });
      }
      this.content.push({ text: "new_document", fontSize: 0 });
      this.dd.content = this.dd.content.concat(this.content);
      cb(this.dd);
    });
  }

  setTag(tag) {
    this._tag = tag;
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'g');
  }

  // Call the first time with the first document with its data
  // modify all document ( header and footer ) with the data
  // pagination by document
  // Main function, create the document definition for pdfmake
  // Take a callback in parameters that send dd
  createPDFMakeDD(cb) {
    if (!this._model) {
      return new Error("No model load");
    }
    if (!this._data) {
      return new Error("No data load");
    }

    this._recursiveFindObject(this.dd, () => {
      this.addDocument(this._data, () => {
        cb(this.dd);
      });
    });
  }

  // Check every key in object.
  // If the key is 'table' look if a forOrder is define :
  //  if true : call back _formatTable
  //  else : call back itself
  // If it's an object call back itself.
  // If it's an array call _recursiveFindArray
  // If the key is 'text' look if we need to replace a tag and call back _replaceTag if true
  // else we do nothing
  _recursiveFindObject(object, cb) {
    var self = this;
    asynk.each(_.keys(object), (key, cb) => {
      if (typeof object[key] === 'string' || object[key] instanceof String) {
        // verify if the tag is present, if true replace tag with data
        if (object[key].indexOf(this._tag) != -1) {
          object[key] = this._replaceTag(object[key]);
        }
      }

      if (typeof object[key] === "object" && key !== "footer" && key !== "header") {
        if (Array.isArray(object[key])) {
          this._recursiveFindArray(object[key], cb);
        } else if (key === "table") {
          if (object[key].forOrder) {
            this._formatTable(object[key], cb);
          } else if (object[key].totals) {
            this._formatTotals(object[key], cb);
          } else {
            this._recursiveFindObject(object[key], cb);
          }
        } else {
          this._recursiveFindObject(object[key], cb);
        }
      } else if (key === "text") {
        // verify if the tag is present, if true replace tag with data
        if (object[key].indexOf(this._tag) != -1) {
          object[key] = this._replaceTag(object[key]);
        }
        cb();
      } else if (key === 'footer') {
        var footer = _.cloneDeep(object[key]);
        object[key] = function(currentPage, pageCount){ return self._executeFooter(footer, currentPage, pageCount.toString());};
        cb();
      } else if (key === 'header') {
        var header = _.cloneDeep(object[key]);
        object[key] = function(currentPage, pageCount){
            // Recovery of all breaks
          var pages_rupture = _.filter(self.dd.content, function(p) { return p.text === "new_document"; });
          // sort breaks by page number
          var ruptures_sort_by_num_page = _.sortBy(pages_rupture, [function(p) {
            if (p.positions && p.positions[0] && p.positions[0].pageNumber) {
              return p.positions[0].pageNumber;
            }
          }]);
          // current page is a breaking page ?
          var current_page_rupture = _.find( ruptures_sort_by_num_page , function(p) {
            if (p.positions && p.positions[0] && p.positions[0].pageNumber) {
              return currentPage === p.positions[0].pageNumber + 1;
            }
          });
          // if broken page and or if the first page => we assign the pagecount
          if (current_page_rupture && _.has(current_page_rupture, 'positions[0].pageNumber') || currentPage === 1) {
            if (ruptures_sort_by_num_page && ruptures_sort_by_num_page[self.next_index_header] && _.has(ruptures_sort_by_num_page[self.next_index_header], 'positions[0].pageNumber')) {
              // get page count
              self.page_count_header = ruptures_sort_by_num_page[self.next_index_header].positions[0].pageNumber - self.num_page_rupture_header;
              self.num_page_rupture_header = ruptures_sort_by_num_page[self.next_index_header].positions[0].pageNumber;
            }
            // case current page is the last page but page count not equal to 1
            if (currentPage === self.dd.content[self.dd.content.length -1].positions[0].pageNumber && self.page_count_header !== 1) {
              self.current_page_header++;
            } else {
              self.current_page_header = 1;
            }
            self.next_index_header++;
          } else {
            self.current_page_header++;
          }
          if ((self.remove_header_first_page && self.current_page_header != 1) || (!self.remove_header_first_page) ) {
            return self._executeHeader(header, self.current_page_header, self.page_count_header);
          }
        };
        cb();
      } else if (key === 'image') {
        if (object[key].indexOf(self._tagImage) != -1) {
          object[key] = self._replaceTagImage(object[key]);
        }
        cb();
      } else {
        cb();
      }
    }).serie().done(function() {
      cb();
    }).fail(cb);
  }

  removeHeaderFirstPage() {
    this.remove_header_first_page = true;
  }

  _executeHeader(model, currentpage, pageCount) {
    var model_header_or_footer = _.cloneDeep(model);
    return this._recursiveFindObjectSynchrone(model_header_or_footer, currentpage, pageCount);
  }

  _executeFooter(model, currentpage) {
    var self = this;
    var model_header_or_footer = _.cloneDeep(model);

    // Recovery of all breaks
    var pages_rupture = _.filter(self.dd.content, function(p) { return p.text === "new_document"; });
    // sort breaks by page number
    var ruptures_sort_by_num_page = _.sortBy(pages_rupture, [function(p) {
      if (p.positions && p.positions[0] && p.positions[0].pageNumber) {
        return p.positions[0].pageNumber;
      }
    }]);
    // current page is a breaking page ?
    var current_page_rupture = _.find(ruptures_sort_by_num_page, function(p) {
      if (p.positions && p.positions[0] && p.positions[0].pageNumber) {
        return currentpage === p.positions[0].pageNumber + 1;
      }
    });
    // if broken page and or if the first page => we assign the pagecount
    if (current_page_rupture && _.has(current_page_rupture, 'positions[0].pageNumber') || currentpage === 1) {
      if (ruptures_sort_by_num_page && ruptures_sort_by_num_page[self.next_index_footer] && _.has(ruptures_sort_by_num_page[self.next_index_footer], 'positions[0].pageNumber')) {
        // get page count
        self.page_count_footer = ruptures_sort_by_num_page[self.next_index_footer].positions[0].pageNumber - self.num_page_rupture_footer;
        self.num_page_rupture_footer = ruptures_sort_by_num_page[self.next_index_footer].positions[0].pageNumber;
      }
      // case current page is the last page but page count not equal to 1
      if (currentpage === self.dd.content[self.dd.content.length - 1].positions[0].pageNumber && self.page_count_footer !== 1) {
        self.current_page_footer++;
      } else {
        self.current_page_footer = 1;
      }
      self.next_index_footer++;
    } else {
      self.current_page_footer++;
    }
    return this._recursiveFindObjectSynchrone(model_header_or_footer, self.current_page_footer, self.page_count_footer);
  }
  _recursiveFindObjectSynchrone(object, currentpage, pagecount) {
    _.each(object, (value, key) => {
      if (typeof object[key] === 'string' || object[key] instanceof String) {
        // verify if the tag is present, if true replace tag with data
        if (object[key].indexOf(this._tag) != -1) {
          object[key] = this._replaceTag(object[key]);
        }
        if (object[key].indexOf(this._tagCurrentPage) != -1) {
          object[key] = this._replaceTagByValue(object[key], this._tagCurrentPage, currentpage);
        }
        if (object[key].indexOf(this._tagPageCount) != -1) {
          object[key] = this._replaceTagByValue(object[key], this._tagPageCount, pagecount);
        }
      }

      if (typeof object[key] === "object") {
        if (Array.isArray(object[key])) {
          this._recursiveFindArraySynchrone(object[key], currentpage, pagecount);
        } else if (key === "table") {

          this._formatTableSynchrone(object[key], currentpage, pagecount);
        } else {
          this._recursiveFindObjectSynchrone(object[key], currentpage, pagecount);
        }
      } else if (key === "text") {
        // verify if the tag is present, if true replace tag with data
        if (object[key].indexOf(this._tag) != -1) {
          object[key] = this._replaceTag(object[key]);
        }
        if (object[key].indexOf(this._tagCurrentPage) != -1) {
          object[key] = this._replaceTagByValue(object[key], this._tagCurrentPage, currentpage);
        }
        if (object[key].indexOf(this._tagPageCount) != -1) {
          object[key] = this._replaceTagByValue(object[key], this._tagPageCount, pagecount);
        }
      } else if (key === "image") {
        if (object[key].indexOf(this._tagImage) != -1) {
          object[key] = this._replaceTagImage(object[key]);
        }
      }
    });
    this.firstPage = false;
    return object;
  }

  // Check every index in array
  // If it's a array, call back itself
  // If it's a object, call back _recursiveFindObject
  // else do nothing
  _recursiveFindArray(array, cb) {
    asynk.each(array, (item, cb) => {
      if (Array.isArray(item)) {
        this._recursiveFindArray(item, cb);
      } else if (item instanceof Object) {
        this._recursiveFindObject(item, cb);
      } else {
        cb();
      }
    }).serie().asCallback(cb);
  }

  _recursiveFindArraySynchrone(array, currentPage, pageCount) {
    var self = this;
    array.forEach(function(item) {
      if (Array.isArray(item)) {
        self._recursiveFindArraySynchrone(item, currentPage, pageCount);
      } else if (item instanceof Object) {
        self._recursiveFindObjectSynchrone(item, currentPage, pageCount);
      }
    });
  }

  //
  _recursiveTagHeadersColumnsSynchrone(object) {
    var self = this;

    for (var i = 0; i < object.body.length; i++) {
      object.body[i].forEach(function(colonne) {
        if (colonne.table) {
          self._recursiveTagHeadersColumnsSynchrone(colonne.table);
        } else {
          if (colonne.text) {
            colonne.text = self._replaceTag(colonne.text);
          }
          if (colonne.image) {
            colonne.image = self._replaceTagImage(colonne.image);
          }
          // With a variable from data file and a sDoc tag,
          // you can change the configuration of a cell in the normal table header (fillColor, color, style)
          if (colonne.fillColor) {
            colonne.fillColor = self._replaceTag(colonne.fillColor);
          }
          if (colonne.color) {
            colonne.color = self._replaceTag(colonne.color);
          }
          if (colonne.style) {
            colonne.style = self._replaceTag(colonne.style);
          }
        }
      });
    }
  }

  // If a table have forOrder attribute, this function will take all type of line
  // and create a object with all type of line
  // Next it will take the data name we need to replace tag
  // For each line in data we create a new line in table and replace all tag with the correct data
  _formatTable(object, cb) {

    var self = this;
    var lineType = {};
    // Create object with all line model
    object.forOrder.forEach((type, i) => {
      // If an header rows is define we take line after that header rows
      if (object.headerRows) {
        lineType[type] = _.cloneDeep(object.body[i + object.headerRows]);
      } else {
        lineType[type] = _.cloneDeep(object.body[i]);
      }
    });

    if (!object.dataName) {
      if (object.headerRows) {
        object.dataName = this._recoverDataName(object.body[object.headerRows]);
      } else {
        object.dataName = this._recoverDataName(object.body[0]);
      }
    }

    // translate columns headers
    for (var i = 0; i < object.headerRows; i++) {
      object.body[i].forEach(function(colonne) {

        if (colonne.table) {
          self._recursiveTagHeadersColumnsSynchrone(colonne.table);
        } else {
          if (colonne.text) {
            colonne.text = self._replaceTag(colonne.text);
          }
          if (colonne.image) {
            colonne.image = self.replaceTagImage(colonne.image);
          }
          if (colonne.fillColor) {
            colonne.fillColor = self._replaceTag(colonne.fillColor);
          }
          if (colonne.color) {
            colonne.color = self._replaceTag(colonne.color);
          }
          if (colonne.style) {
            colonne.style = self._replaceTag(colonne.style);
          }
        }
      });
    }

    // Remove all model line from dd
    if (object.headerRows) {
      object.body = object.body.slice(0, object.headerRows);
    } else {
      object.body = [];
    }

    if (object.dataName) {
      var count = 0;
      // For each line in data we create a new line with correct model and replace all tag with data
      asynk.each(this._data[object.dataName], (line, cb) => {
        if (!line.type) {
          return cb();
        }

        if (!lineType[line.type]) {
          return cb();
        }

        var newLine = _.cloneDeep(lineType[line.type]);

        asynk.each(newLine, (column, cb) => {
          if (_.has(column, 'table.body') && column.table.body[0]) {
            var nameObjetLigneArray = this._recoverDataName(column.table.body[0]);

            // when line is array of data
            if (line[nameObjetLigneArray]) {
              if (line[nameObjetLigneArray] && line[nameObjetLigneArray][0]) {
                for (var prop in line[nameObjetLigneArray][0]) {
                  self._tag_search = '<' + self._tag + '>' + nameObjetLigneArray + "." + prop + '</' + self._tag + '>';
                  break;
                }
              }
              // add each array line in the template with the data
              line[nameObjetLigneArray].forEach(function(ligneArray) {
                self._addArrayLigneWithData(column.table.body, ligneArray, self._tag_search);
              });
              // delete the first ligne in the array
              column.table.body = _.filter(column.table.body, function(ligneArray) {
                return !_.map(ligneArray, 'text').includes(self._tag_search);
              });
            } else if (line) { // when line is array
              // case of nomenclature line
              if (line.type === 'composant') {
                if (!line.level) {
                  return new Error("No nomenclature level for the line " + JSON.stringify(line));
                }
                //self._addWithds(column.table.widths, line.level);
                self._addArrows(column.table.body, line.level);
              }
              self._addArrayWithData(column.table.body, count);
            }
          }
          // cas when line is a text
          if (column.text) {
            // verify if tag is present, if true replace tag with data
            if (column.text.indexOf(this._tag) != -1) {
              column.text = this._replaceTagLine(column.text, count);
            }
            if (column.rowSpan) {
              column.rowSpan = this._data[object.dataName].length;
            }
          }

          if (column.image) {
            if (column.image.indexOf(this._tagImage) != -1) {
              column.image = this._replaceTagImage(column.image);
            }
          }

          if (column.fillColor) {
            if (typeof column.fillColor === 'string' || column.fillColor instanceof String) {
              if (column.fillColor.indexOf(this._tag) != -1) {
                column.fillColor = this._replaceTagLine(column.fillColor, count);
              }
            }
          }
          cb();
        }).serie().done(() => {
          object.body.push(newLine);

          if (line.type_ligne === "lot" && lineType["lot"]) {
            var dataNameLot = lineType["lot"][0].table.dataName;

            line[dataNameLot].forEach(function(ligne) {
              var newLineLot = lineType["lot"];
              newLineLot.forEach(function(column) {
                if (_.has(column, 'table.body') && column.table.body[0]) {
                  self._addArrayWithData(column.table.body, count);
                }

                // cas when line is a text
                if (column.text) {
                  // verify if tag is present, if true replace tag with data
                  if (column.text.indexOf(this._tagImage) != -1) {
                    column.text = self._replaceTagLine(column.text, count);
                  }
                }
                if (column.image) {
                  if (column.image.indexOf(this._tag) != -1) {
                    column.image = self._replaceTagImage(column.image);
                  }
                }
              });

              object.body.push(newLineLot);
            });
          }

          count++;
          cb();
        });
      }).serie().asCallback(cb);
    }
  }
  _process_column(column, currentpage, pagecount) {
    if (column.text) {
      column.text = this._replaceTag(column.text);
      if (column.text.indexOf(this._tagCurrentPage) != -1) {
        column.text = this._replaceTagByValue(column.text, this._tagCurrentPage, currentpage);
      }
      if (column.text.indexOf(this._tagPageCount) != -1) {
        column.text = this._replaceTagByValue(column.text, this._tagPageCount, pagecount);
      }
    }

    if (column.image) {
      if (column.image.indexOf(this._tagImage) != -1) {
        column.image = this._replaceTagImage(column.image);
      }
    }

    if (column.fillColor) {
      column.fillColor = this._replaceTag(column.fillColor);
    }

    if (column.color) {
      column.color = this._replaceTag(column.color);
    }
  }

  _formatTableSynchrone(object, currentpage, pagecount) {
    var self = this;
    // on parcours chaque ligne du tableau
    for (var i = 0; i < object.body.length; i++) {
      // on parcours chaque colonne de la ligne
      object.body[i].forEach(function(column) {
        if (Array.isArray(column.stack)) {
          column.stack.forEach(function(col) {
            self._process_column(col, currentpage, pagecount);
            if (col.table) {
              self._formatTableSynchrone(col.table, currentpage, pagecount);
            }
          });
        }
        self._process_column(column, currentpage, pagecount);
        if (Array.isArray(column)) {
          column.forEach(function(col) {
            self._process_column(col, currentpage, pagecount);
            if (col.table) {
              self._formatTableSynchrone(col.table, currentpage, pagecount);
            }
          });
        }
        if (column.table) {
          self._formatTableSynchrone(column.table, currentpage, pagecount);
        }
      });
    }
  }

  // Find the correct data name for dynamic table with model line
  _recoverDataName(array) {
    var dataName = "";
    var i = 0;
    while (i < array.length && dataName === "") {
      if (array[i].text) {
        if (array[i].text.indexOf(this._tag) != -1) {
          array[i].text.replace(this._regexTag, function(match, tag, insideTag) {
            var arr = insideTag.split(".");
            dataName = arr[0];
          });
        }
      }
      i++;
    }
    return dataName;
  }

  _replaceTag(text) {
    var self = this;
    // Replace the tag by the data
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      // we only need the second group, that's why we use insideTag
      var arr = insideTag.split(".");
      var value = self._data[arr[0]];
      // for every sub object we look if the data is available, else we put blank value
      for (var i = 1; i < arr.length; i++) {
        if (value[arr[i]]) {
          value = value[arr[i]];
        } else {
          value = "";
        }
      }
      // if the value is an object we put blank value
      if (typeof value === "object") {
        value = "";
      }
      // the value is undefined we put blank value
      if (value === void 0) {
        value = "";
      }
      return value;
    });
  }

  _replaceTagImage(image_with_tag) {
    var self = this;
    var value = "";
    // Replace the tag by the data
    return image_with_tag.replace(this._regexTagImage, function(match, tag, insideTag) {
      if (_.isBuffer(self._data[insideTag])) {
        var image_buffer = self._data[insideTag];
        if (image_buffer[0] === 0xff && image_buffer[1] === 0xd8) {
          value = 'data:image/jpeg;base64,' + image_buffer.toString('base64');
        } else if (image_buffer[0] === 0x89 && image_buffer.toString('ascii', 1, 4) === 'PNG') {
          value = 'data:image/png;base64,' + image_buffer.toString('base64');
        }
      }
      return value;
    });
  }

  _replaceTagByValue(text, tag, value) {
    return text.replace(tag, value);
  }

  _replaceTagLine(text, index) {
    var self = this;

    // Replace the tag by the data
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      // we only need the second group, that's why we use insideTag
      var arr = insideTag.split(".");

      // First we take the value with correct data name and with index we want
      var value = "";
      if (self._data[arr[0]][index])
        value = self._data[arr[0]][index][arr[1]];
      else
        value = self._data[arr[0]][arr[1]];

      if (value === null)
        return "";

      // for every sub object we look if the data is available, else we put blank value
      if (arr.length > 2) {
        for (var i = 2; i < arr.length; i++) {
          // On descend dans l'objet
          if (value && value[0] && value[0] instanceof Object)
            value = value[0];
          if (value[arr[i]]) {
            value = value[arr[i]];
          } else {
            value = "";
          }
        }
      }
      // if the value is an object we put blank value
      if (typeof value === "object") {
        value = "";
      }
      // the value is undefined we put blank value
      if (value === void 0) {
        value = "";
      }
      return value;
    });
  }

  // add arrows in the first line when line has nomenclature type
  _addArrows(body, level) {
    if (body[0]) {
      // Necessary to go down until we reach the text zone
      if (body[0][0] && body[0][0].table) {
        while (body[0][0] && body[0][0].table) {
          body = body[0][0].table.body;
        }
      }

      // by default is a arrow
      var symbol = '->';
      if (body[0][0] && body[0][0].text) {
        symbol = body[0][0].text;
      }

      // delete arrow in the model
      body[0].shift();
      var cursymbol = symbol;
      for (let i = 1; i < level; i++) {
        cursymbol += " " + symbol;
      }

      body[0].unshift({ text: cursymbol, noWrap: true, alignment: 'left', style: 'StyleLigne', border: [false, false, false, false] });
    }
  }

  // add 10 for each level of nomenclature
  _addWithds(tableWidths, level) {
    var size = 10;
    if (tableWidths[0]) {
      size = tableWidths[0];
    }
    //delete first index of the widths array
    tableWidths.shift();
    for (let i = 0; i < level; i++) {
      tableWidths.unshift(size);
    }
  }

  // add data in the line when line is a array
  _addArrayWithData(tableBody, count) {
    var self = this;

    tableBody.forEach(function(arrayLine) {
      arrayLine.forEach(function(column) {

        if (column.text) {
          column.text = self._replaceTagLine(column.text, count);
        } else if (column.image){
          column.image = self._replaceTagImage(column.image);
        } else {
          if (column.table) {
            self._addArrayWithData(column.table.body, count);
          }
        }
        // With a variable in data file and a sDoc tag,
        // you can change the configuration of a cell of a row in the totals table (fillColor, color, style)
        if (column.fillColor) {
          if (typeof column.fillColor === 'string' || column.fillColor instanceof String) {
            if (column.fillColor.indexOf(self._tag) != -1) {
              column.fillColor = self._replaceTag(column.fillColor);
            }
          }
        }
        if (column.color) {
          if (typeof column.color === 'string' || column.color instanceof String) {
            if (column.color.indexOf(self._tag) != -1) {
              column.color = self._replaceTag(column.color);
            }
          }
        }
        if (column.style) {
          if (typeof column.style === 'string' || column.style instanceof String) {
            if (column.style.indexOf(self._tag) != -1) {
              column.style = self._replaceTag(column.style);
            }
          }
        }
      });
    });
  }

  // add data in the line when line is a array of data
  _addArrayLigneWithData(tableBody, ligneArray, tag_search) {
    var self = this;
    tableBody.forEach(function(arrayLine) {
      // we clone the template line each time
      var ligneToClone = _.find(arrayLine, function(l) { return l.text && _.includes(l.text, tag_search); });
      if (ligneToClone) {
        var arrayLineToClone = _.cloneDeep(arrayLine);
        arrayLineToClone.forEach(function(column) {

          if (column.text) {
            column.text.replace(self._regexTag, function(match, tag, insideTag) {
              var propertyLine = insideTag.split(".");
              if (propertyLine && propertyLine[1]) {
                if (ligneArray[propertyLine[1]]) {

                  column.text = ligneArray[propertyLine[1]];
                } else {
                  // if the property doesn't not exist on the line object => we display a empy text on the pdf
                  column.text = '';
                }
              }
            });
          } else if (column.image) {
            column.image = self._replaceTagImage(column.image);
          }
        });
        // add cloned line to the template array
        tableBody.push(arrayLineToClone);
      }
    });
  }

  // Replace tag in object passed in parameter
  _replaceTagObject(text, dataobject) {
    // Replace the tag by the data
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      // we only need the second group, that's why we use insideTag
      var arr = insideTag.split(".");

      // First we take the value with correct data name and with index we want
      var value = "";
      value = dataobject[arr[0]];

      // for every sub object we look if the data is available, else we put blank value
      if (arr.length > 1) {
        for (var i = 1; i < arr.length; i++) {
          // On descend dans l'objet
          if (value[arr[i]]) {
            value = value[arr[i]];
          } else {
            value = "";
          }
        }
      }

      // if the value is an object we put blank value
      if (typeof value === "object") {
        value = "";
      }
      // the value is undefined we put blank value
      if (value === void 0) {
        value = "";
      }
      return value;
    });
  }

  // Case
  // and create a object with all type of line
  // Next it will take the data name we need to replace tag
  // For each line in data we create a new line in table and replace all tag with the correct data
  _formatTotals(object, cb) {
    var self = this;
    var modelLine = {};
    var i = 0;

    // If an header rows is define we take line after that header rows
    if (object.headerRows) {
      modelLine = _.cloneDeep(object.body[i + object.headerRows]);
    } else {
      modelLine = _.cloneDeep(object.body[i]);
    }

    // translate columns headers
    for (var i = 0; i < object.headerRows; i++) {
      object.body[i].forEach(function(colonne) {
        if (colonne.table) {
          self._recursiveTagHeadersColumnsSynchrone(colonne.table);
        } else {
          if (colonne.text) {
            colonne.text = self._replaceTag(colonne.text);
          }
          if (colonne.image) {
            colonne.image = self._replaceTagImage(colonne.image);
          }
          // With a variable in data file and a sDoc tag,
          // you can change the configuration of a cell in the totals table header (fillColor, color, style) 
          if (colonne.fillColor) {
            colonne.fillColor = self._replaceTag(colonne.fillColor);
          }
          if (colonne.color) {
            colonne.color = self._replaceTag(colonne.color);
          }
          if (colonne.style) {
            colonne.style = self._replaceTag(colonne.style);
          }
        }
      });
    }

    // Remove all model line from dd
    if (object.headerRows) {
      object.body = object.body.slice(0, object.headerRows);
    } else {
      object.body = [];
    }

    if (object.dataName) {
      var nbelement = 0;
      var data = self._data;

      var tabdata = object.dataName.split(".");

      // for every sub object we need to go down inside the object
      for (var i = 0; i < tabdata.length; i++) {
        if (data[tabdata[i]]) {
          data = data[tabdata[i]];
        } else {
          data = "";
        }
      }

      // Count the number of the element
      for (var element in data) {
        if (data.hasOwnProperty(element))
          nbelement++;
      }

      for (var key in data) {
        if (!data.hasOwnProperty(key)) {
          return cb();
        }

        var newLine = _.cloneDeep(modelLine);

        newLine.forEach(function(column) {
          if (column.text) {
            if (column.margin) {
              column.text = self._replaceTagObject(column.text, self._data);
              var margintop = 8;
              margintop = margintop * (nbelement - 1);
              column.margin = [0, margintop, 0, 0];
            } else {
              column.text = self._replaceTagObject(column.text, data[key]);
            }

            if (column.rowSpan) {
              column.rowSpan = nbelement;
            }
          }

          // With a variable from data file and a sDoc tag,
          // you can change the configuration of a cell of a row in the totals table (fillColor, color, style)
          if (column.fillColor) {
            column.fillColor = self._replaceTagObject(column.fillColor, self._data);
          }
          if (column.color) {
              column.color = self._replaceTagObject(column.color, self._data);
          }
          if (column.style) {
            column.style = self._replaceTagObject(column.style, self._data);
          }
        });

        //fs.appendFileSync("/tmp/test", "ligne : " + JSON.stringify(newLine));
        object.body.push(newLine);
      }

      cb();
    }
  }
}

module.exports = salesDocument;
