/* eslint-disable max-len */
const http = require('http');
const { convertToCase } = require('./convertToCase');

const ERRORS = {
  MISSING_CASE:
    '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
  MISSING_TEXT:
    'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
  INVALID_CASE:
    'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
};

const CASES = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  const server = http.createServer((req, res) => {
    const [path, queryString] = req.url.split('?');

    const text = path.slice(1);
    const toCase = new URLSearchParams(queryString).get('toCase');
    const errors = [];

    if (!text) {
      errors.push({
        message: ERRORS.MISSING_TEXT,
      });
    }

    if (!toCase) {
      errors.push({
        message: ERRORS.MISSING_CASE,
      });
    }

    if (toCase && !CASES.includes(toCase)) {
      errors.push({
        message: ERRORS.INVALID_CASE,
      });
    }

    if (errors.length > 0) {
      res.writeHead(400, 'Bad Request', { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ errors }));

      return;
    }

    const result = convertToCase(text, toCase);
    const response = {
      originalCase: result.originalCase,
      targetCase: toCase,
      originalText: text,
      convertedText: result.convertedText,
    };

    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  });

  return server;
}

module.exports = { createServer };
