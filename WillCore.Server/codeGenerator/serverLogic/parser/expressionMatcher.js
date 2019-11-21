class expressionMatcher {
    static matchExpression(expressionTree, matchingObject) {
        function matchObject(toBeMatched, matchingObject) {
            for (let key in matchingObject) {
                if (!(key in matchingObject)) {
                    return false;
                }
                if (matchingObject[key] === "*") {
                    return true;
                }
                if (typeof matchingObject[key] === "function") {
                    return matchingObject[key](toBeMatched[key]);
                }
                return matchingObject[key] === toBeMatched[key];
            }
        }
    }
}

module.exports = expressionMatcher;