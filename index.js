var _ = require("lodash");
var asynk = require("asynk");

class salesDocument {
  constructor(model, data) {
    this._model = model;
    this._data = data;
    // Define default tag for replace data
    this._tag = "sDoc";
    // Select the tag in first group and is content in second group.
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'g');
    // Clone the model in dd to avoid to replace model.
    this.dd = _.cloneDeep(this._model);
  }

  setModel(model) {
    this._model = model;
    this.dd = _.cloneDeep(this._model);
  }

  setData(data) {
    this._data = data;
  }

  setTag(tag) {
    this._tag = tag;
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'g');
  }

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
      cb(this.dd);
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
    asynk.each(_.keys(object), (key, cb) => {
      if (typeof object[key] === "object") {
        if (Array.isArray(object[key])) {
          this._recursiveFindArray(object[key], cb);
        } else if (key === "table") {
          if (object[key].forOrder) {
            this._formatTable(object[key], cb);
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
      } else {
        cb();
      }
    }).serie().asCallback(cb);
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

  // If a table have forOrder attribute, this function will take all type of line
  // and create a object with all type of line
  // Next it will take the data name we need to replace tag
  // For each line in data we create a new line in table and replace all tag with the correct data
  _formatTable(object, cb) {
    var lineType = {};
    // Create object with all line model
    object.forOrder.forEach((type, i) => {
      // If an header rows is define we take line after that header rows
      if (object.headerRows) {
        lineType[type] = _.cloneDeep(object.body[i+object.headerRows]);
      } else {
        lineType[type] = _.cloneDeep(object.body[i]);
      }
    });
    var dataName;
    // Take the data name we need, if headerRows define we take the first model line
    if (object.headerRows) {
      dataName = this._recoverDataName(object.body[object.headerRows]);
    } else {
      dataName = this._recoverDataName(object.body[0]);
    }
    // Remove all model line from dd
    if (object.headerRows) {
      object.body = object.body.slice(0, object.headerRows);
    } else {
      object.body = [];
    }
    if (this._data[dataName]) {
      var count = 0;
      // For each line in data we create a new line with correct model and replace all tag with data
      asynk.each(this._data[dataName], (line, cb) => {
        if (!line.type) {
          return cb();
        }
        if (!lineType[line.type]) {
          return cb();
        }
        var newLine = _.cloneDeep(lineType[line.type]);
        asynk.each(newLine, (column, cb) => {
          if (column.text) {
            // verify if tag is present, if true replace tag with data
            if (column.text.indexOf(this._tag) != -1) {
              column.text = this._replaceTagLine(column.text, dataName, count);
            }
            if (column.rowSpan) {
              column.rowSpan = this._data[dataName].length;
            }
          }
          cb();
        }).serie().done(()=> {
          object.body.push(newLine);
          count++;
          cb();
        });
      }).serie().asCallback(cb);
    }
  }

  // Find the correct data name for dynamic table with model line
  _recoverDataName(array) {
    var dataName = "";
    var i = 0;
    while (i < array.length && dataName === "") {
      if (array[i].text.indexOf(this._tag) != -1) {
        array[i].text.replace(this._regexTag, function(match, tag, insideTag) {
          var arr = insideTag.split(".");
          dataName = arr[0];
        });
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
      for (var i = 1; i<arr.length; i++) {
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

  _replaceTagLine(text, dataName, index) {
    var self = this;
    // Replace the tag by the data
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      // we only need the second group, that's why we use insideTag
      var arr = insideTag.split(".");
      // First we take the value with correct data name and with index we want
      var value = self._data[dataName][index][arr[1]];
      // for every sub object we look if the data is available, else we put blank value
      if (arr.length >= 2) {
        for (var i = 2; i<arr.length; i++) {
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
}

module.exports = salesDocument;
