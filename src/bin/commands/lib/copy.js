import fs from 'fs';
import path from 'path';
const blueprint = path.join(__dirname, '..', '..', '..', '..', 'src', 'blueprint');
export default (from, to, fromBluePrint = true) => {
  if (fromBluePrint) from = path.join(blueprint, from); // eslint-disable-line
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
};
