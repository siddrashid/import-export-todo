const xlsx = require('xlsx');

const filePath = './files/ImportTemplate1.xlsx';

const file = xlsx.readFile(filePath);

const sheets = file.SheetNames;
const data = xlsx.utils.sheet_to_json(file.Sheets[sheets[0]]);
// console.log(sheets);
console.log(data);