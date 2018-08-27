var _ = require("lodash");

class salesDocument {
  constructor(model, data) {
    this._model = model;
    this._data = data;
    this._tag = "sDoc";
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'gi');
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
    this._regexTag = new RegExp(`<(${this._tag})>([\\s\\S]*?)</\\1>`, 'gi');
  }

  createPDFMakeDD() {
    if (!this._model) {
      return new Error("No model load");
    }
    if (!this._data) {
      return new Error("No data load");
    }
    this._recursiveFind(this.dd);
    return this.dd;
  }

  _recursiveFind(object) {
    if (Array.isArray(object)) {
      object.forEach((item) => {
        if (item instanceof Object) {
          this._recursiveFind(item);
        }
      });
    } else {
      for (var key in object) {
        if (typeof object[key] === "object") {
          if (key === "table") {
            if (object[key].forOrder) {
              this._formatTable(object[key]);
            } else {
              this._recursiveFind(object[key]);
            }
          } else {
            this._recursiveFind(object[key]);
          }
        } else if (key === "text") {
          if (object[key].indexOf(this._tag) != -1) {
            object[key] = this._replaceTag(object[key]);
          }
        }
      }
    }
  }

  _formatTable(object) {
    var lineType = {};
    object.forOrder.forEach((type, i) => {
      if (object.headerRows) {
        lineType[type] = _.cloneDeep(object.body[i+object.headerRows]);
      } else {
        lineType[type] = _.cloneDeep(object.body[i]);
      }
    });
    var dataName;
    if (object.headerRows) {
      dataName = this._recoverDataName(object.body[object.headerRows]);
    } else {
      dataName = this._recoverDataName(object.body[0]);
    }
    if (object.headerRows) {
      object.body = object.body.slice(0, object.headerRows);
    } else {
      object.body = [];
    }
    if (this._data[dataName]) {
      this._data[dataName].forEach((line, index) => {
        if (!line.type) {
          return;
        }
        var newLine = _.cloneDeep(lineType[line.type]);
        newLine.forEach((column) => {
          if (column.text) {
            if (column.text.indexOf(this._tag) != -1) {
              column.text = this._replaceTagLine(column.text, dataName, index);
            }
            if (column.rowSpan) {
              column.rowSpan = this._data[dataName].length;
            }
          }
        });
        object.body.push(newLine);
      });
    }
  }

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
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      var arr = insideTag.split(".");
      var value = self._data[arr[0]];
      for (var i = 1; i<arr.length; i++) {
        if (value[arr[i]]) {
          value = value[arr[i]];
        } else {
          value = "";
        }
      }
      if (typeof value === "object") {
        value = "";
      }
      if (value === void 0) {
        value = "";
      }
      return value;
    });
  }

  _replaceTagLine(text, dataName, index) {
    var self = this;
    return text.replace(this._regexTag, function(match, tag, insideTag) {
      var arr = insideTag.split(".");
      var value = self._data[dataName][index][arr[1]];
      if (arr.length >= 2) {
        for (var i = 2; i<arr.length; i++) {
          if (value[arr[i]]) {
            value = value[arr[i]];
          } else {
            value = "";
          }
        }
      }
      if (typeof value === "object") {
        value = "";
      }
      if (value === void 0) {
        value = "";
      }
      return value;
    });
  }
}

module.exports = salesDocument;
