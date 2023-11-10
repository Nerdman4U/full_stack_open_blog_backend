//Returns true if the current element is the lowest in the current recursion cycle
function isFirstLevel(element){
  //console.log("isFirstLevel(" + element + ")");
  if(element.substring(0,1) != '-'){
    //console.log("-> true");
    return true;
  }
  else{
    //console.log("-> false");
    return false;
  }
}

//Returns true if there are no more sublevels after current level
function isLastLevel(arr){
  //console.log("isLastLevel(" + arr + ")");
  if(!arr){
    return true;
  }
  for(var i = 0; i < arr.length; i++){
    if(typeof arr[i] === 'number');
    else if(arr[i].substring(0,1) === '-'){
      //console.log("->false");
      return false;
    }
  }
  //console.log("-> true");
  return true;
}

function getSubLevels(arr){
  //console.log("getSubLevels(" + arr + ")");
  for(var i = 1; i < arr.length; i++){
    if(arr[i].substring(0,1) != '-'){
      //console.log("->" + arr.slice(1, i));
      if(arr.slice(1, i).length === 1){
        if(!isNaN(arr[1])){
          return parseInt(arr[i]);
        }
        return arr[1];
      }
      if(arr.slice(1, i).length === 0)
        return null;
      for(var j = 1; j < i; j++){
        if(!isNaN(arr[j])){
          arr[j] = parseInt(arr[j]);
        }
      }
      return arr.slice(1, i);
    }
    arr[i] = arr[i].substring(1,arr[i].length);
  }
  //console.log("->"+arr.slice(1,arr.length));
  if(arr.slice(1, i).length === 1){
    if(!isNaN(arr[1]) && arr[1].substring(0,1) != '-'){
      return parseInt(arr[1]);
    }
    return arr[1];
  }
  if(arr.slice(1, i).length === 0)
    return null;
  for(var j = 1; j < i; j++){
    if(!isNaN(arr[j]) && arr[j].substring(0,1) != '-' && isLastLevel(arr.slice(1,arr.length))){
      arr[j] = parseInt(arr[j]);
    }
  }
  return arr.slice(1,arr.length);
}

function getLevel(str){
  for(var i = 0; i <= str.length; i++){
    if(str.substring(i,i+1) != '-'){
      return i;
    }
  }
  return str.length;
}

function validateInput(arr){
  for(var i = 0; i < arr.length - 1; i++){
    if(getLevel(arr[i + 1]) - getLevel(arr[i]) > 1){
      arr.splice(i + 1, 1);
      return validateInput(arr);
    }
  }
  return arr;
}

function recurse(arr){
  //console.log("recurse(" + arr + ")");
  var obj = {};
  for(var i = 0; i < arr.length; i++){
    if(isFirstLevel(arr[i])){
      //If last level, then return values
      if(isLastLevel(getSubLevels(arr.slice(i,arr.length)))){
        obj[arr[i]] = getSubLevels(arr.slice(i,arr.length));
      }
      else{
        obj[arr[i]] = recurse(getSubLevels(arr.slice(i,arr.length)));
      }
    }
  }
  //console.log("->" + JSON.stringify(obj));
  return obj;
}

function getGetCommandLineArguments(params){
  if(!params){
    //console.log("null");
  }
  return recurse(params);
}

function getCommandLineArguments(params){
  if(typeof params === 'undefined')
    params = process.argv.slice(2,process.argv.length);
  params = validateInput(params);
  if(params.length === 0){
    return [];
  }
  //Check if there are multiple levels
  for(var i = 0; i < params.length; i++){
    if(params[i].substring(0,1) === '-')
      return recurse(params);
  }
  //If there is only 1 level, return it as array
  return params;
}

module.exports = {
  getCommandLineArguments: getCommandLineArguments
}
