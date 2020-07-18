/**
 * Module help to smart trim string to easy save in the database
 * @arg { String } str - entire blog body.
 * @arg { String } length - number of characters wanna trim out.
 * @arg { String } delimiter - add delimiter to the end. (Add space).
 * @arg { String } appendix - anything.
 */
exports.smartTrim = (str, length, delimiter, appendix) => {
  /** Keep string, if string in available limit of length */
  if(str.length <= length) return str;

  /** Grab new string from scratch to length, addition to delimiter length */
  var trimmedStr = str.substr(0, length + delimiter.length);
  /** Grab position of the last delimiter */
  var lastDelimiterIndex = trimmedStr.lastIndexOf(delimiter);

  /** Grab all string from scratch to last delimiter */
  if(lastDelimiterIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimiterIndex);

  /** Appendix anything to string if wanna */
  if(trimmedStr) trimmedStr += appendix;

  /** Return string */
  return trimmedStr;
}