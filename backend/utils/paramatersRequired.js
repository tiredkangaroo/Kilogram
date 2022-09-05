function requiredEngine(params, required_stuff) {
    for (let i = 1; i < required_stuff.length; i++) {
        const m = required_stuff[i];
        if (!params[m]) {
            return false;
        }
    }
    return true;
}
export function required(req, params) {
    if (params[0] == "file" && !req.file) {
        return false;
    }
    if (params[0] == "file") {
        params = Object.values(params).slice(2);
    }
    return requiredEngine(req.method == "GET" ? req.query : req.body, params);
}
