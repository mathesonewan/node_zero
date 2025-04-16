// fsTemplates.js
import filesystemTemplate from './filesystem.js';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const fsTemplates = {
  default: () => deepClone(filesystemTemplate)
};

export default fsTemplates;
