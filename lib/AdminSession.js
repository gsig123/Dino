var AdminSessionTable;
var AdminSessionValues;
var AdminSessionCondVal;
var AdminOfferType;
var AdminId;

module.exports.init = function init(){
  sessionTable = offers;
  sessionValues = *;
  type = null;
  sessionCondval = null;
  priseMax = 10000;
  priseMin = 500;
}

module.exports.ChangeSession = function ChangeSession(
  table, values, cond, condVal
){
  sessionTable = table;
  sessionValues = values.toString();
  sessionCond = cond;
  sessionCondVal = condVal;
}

module.exports.getSession = function getSesssion(){
  var SessionValues = [sessionTable,sessionValues,seesionCond,sessionCondVal];
}
