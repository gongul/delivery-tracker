const unicode16ToStr = (str) => {
  const result = str.replace(/&#x+([A-Z]|\d)+;/gim,(s) => {
  	const str_ = s.length < 7 ? "00A0" :s.substr(3,4);
  	return "%u"+str_;
  });
  
  return unescape(result);
}


exports.unicode16ToStr = unicode16ToStr;