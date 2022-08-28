function requiredEngine() {
  const params = arguments[0]
  for (let i = 1; i < arguments.length; i++){
    const m = arguments[i]
    if (!params[m]){
      return false;
    }
  }
  return true;
}

export function required() {
  const req = arguments['0']
  let params = Object.values(arguments).slice(1)
  if (params.length <= 0){
    return true;
  }
  if (params[0] == "file" && !req.file){
    return false;
  }
  if (params[0] == "file"){
    params = Object.values(arguments).slice(2)
  }
  return requiredEngine(req.method == "GET" ? req.query : req.body, ...params)
}