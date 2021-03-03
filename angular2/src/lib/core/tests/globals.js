var getLineNumber = function() {
  const error = new Error();
  // tslint:disable-next-line: no-string-literal
  const stack = error['stack'];
  const stackLines = stack?.split('\n');
  const calleeLine = stackLines && stackLines[2];
  const lineNumber = calleeLine?.match(/\(.+:(\d+):\d+\)/);

  return lineNumber && lineNumber[1];
}
