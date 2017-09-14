import { removeSync, copySync } from 'fs-extra';

const destinationDir = './build/static';
const prebuiltClientDir = './build/client';

removeSync(destinationDir);
copySync(prebuiltClientDir, destinationDir);
