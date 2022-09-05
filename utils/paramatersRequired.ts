import { RequestInterface } from "./RequestResponseInterfaces.js";

interface ParamsInterface {
  [key: string]: string
}
function requiredEngine(params: ParamsInterface, required_stuff: Array<string>) {
  for (let i = 1; i < required_stuff.length; i++){
    const m = required_stuff[i]
    if (!params[m]){
      return false;
    }
  }
  return true;
}

export function required(req: RequestInterface, params: Array<string>) {
  if (params[0] == "file" && !req.file){
    return false;
  }
  if (params[0] == "file"){
    params = Object.values(params).slice(2)
  }
  return requiredEngine(req.method == "GET" ? req.query : req.body, params)
}