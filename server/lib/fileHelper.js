const fs = require("fs");

const getFileNames = (dir,files_) => {
  const files = fs.readdirSync(dir);
  files_ = files_ || [];

  for (const i of files){
    const name = dir + '/' + i;
    if (fs.statSync(name).isDirectory()){
        getFileNames(name, files_);
    } else {
        files_.push(name);
    }
  }
  return files_;
}

exports.getFileNames = getFileNames;


