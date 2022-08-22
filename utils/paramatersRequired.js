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
  const params = Object.values(arguments).slice(1)
  if (params.length <= 0){
    return true;
  }
  if (req.method == "GET"){
    return requiredEngine(req.query, ...params)
  }
  else if (req.method == "POST"){
    return requiredEngine(req.body, ...params)
  }
}