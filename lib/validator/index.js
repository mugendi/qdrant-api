// Copyright 2021 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const _ = require("lodash"),
  Validator = require("fastest-validator"),
  v = new Validator(),
  fs = require("fs"),
  path = require("path");

class ValidatorClass {
  constructor(schemaDir) {
    // ensure schemaDir
    if (!schemaDir) throw new Error(`The directory containing your schema must be passed!`);

    if (fs.existsSync(schemaDir) === false)
      throw new Error(`The directory '${schemaDir}' does not exist!`);

    let results = walk(schemaDir);

    this.files = results.map((file) => {
      let rel = path.relative(schemaDir, file);
      return {
        file,
        rel,
        name: rel.replace(path.extname(rel), ""),
      };
    });
  }

  validate(name, data) {
    
    if(!is_object(data)) throw new Error('You must pass an object for validation.');


    // console.log(this.files, name);
    let schemaFile = _.find(this.files, { name });

    if (!schemaFile) {
      throw new Error(`${name} validation schema does not exist!`);
    }

    let thisSchema = require(schemaFile.file);

    let check = v.compile(thisSchema),
      isValid = check(data);

    if (isValid === true) return true;

    console.log(thisSchema, data);
    console.log( isValid);

    let errors = isValid.map((o) => o.message);

    throw new Error(`Validation Error: \n\t` + errors.join("\n\t"));
  }
}


function is_object(value) {
  return value.toString() === '[object Object]';
}


function walk(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + "/" + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

module.exports  = new ValidatorClass(path.join(__dirname, 'schema'));


