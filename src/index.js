class Bracket {
    constructor(config) {
        this.open = new Term(config[0]);
        this.close = new Term(config[1]);
    }

    isEquals(open, close) {
        return this.open.value === open.value && this.close.value === close.value;
    }
}

class Term {
    constructor(value) {
        this.value = value
    }
}

/**
 * @param {Array<Array<string>>} bracketsConfig
 * @return {Array<Bracket>}
 */
function init(bracketsConfig) {
    let res = [];
    for (let bracketConfig of bracketsConfig) {
        res.push(new Bracket(bracketConfig));
    }
    return res;
}

/**
 * @param {string} str
 * @param {Array<Term>} uniqueTerms
 * @returns {Array<Term>}
 */
function buildTerms(str, uniqueTerms) {
    let result = []
    let characters = str.split('');
    let nextCharacter = characters.shift();
    let termCandidate = "";
    while (nextCharacter) {
        termCandidate += nextCharacter;

        for (let term of uniqueTerms) {
            if (term.value === termCandidate) {
                result.push(term);
                termCandidate = '';
                break;
            }
        }
        nextCharacter = characters.shift();
    }
    if (termCandidate !== '') {
        throw new Error(`Unexpected term: ${termCandidate}`)
    }
    return result
}

module.exports = function check(str, bracketsConfig) {
    /** @type {Array<Bracket>} */
    const brackets = init(bracketsConfig);

    /** @type {Array<Term>} */
    const uniqueTerms = brackets.reduce((arr, bracket) => {
        arr.push(bracket.open, bracket.close)
        return arr
    }, [])

    /** @type {Array<Term>} */
    const termsArray = buildTerms(str, uniqueTerms);

    /** @type {Array<Term>} */
    const stack = []

    /** @type {Term} */
    let nextTerm = termsArray.shift()

    while (nextTerm) {
        let isClose = brackets.some(bracket => bracket.close.value === nextTerm.value);
        let isOpen = brackets.some(bracket => bracket.open.value === nextTerm.value);
        if (isOpen && isClose) {
            if (stack.length > 0 && stack[stack.length - 1].value === nextTerm.value) {
                stack.pop();
            } else {
                stack.push(nextTerm);
            }
        } else if (isOpen) {
            stack.push(nextTerm);
        } else if (isClose) {
            const openTerm = stack.pop();
            if (!openTerm) {
                return false
            }
            let isCorrectBracket = brackets.some(bracket => bracket.isEquals(openTerm, nextTerm));
            if (!isCorrectBracket) {
                return false;
            }

        }

        nextTerm = termsArray.shift()
    }
    return stack.length === 0;
}
