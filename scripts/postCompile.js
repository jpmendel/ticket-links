const fs = require('fs');
const path = require('path');

const CONTRACTS = ['Ticket'];

const main = async () => {
  try {
    for (const contract of CONTRACTS) {
      const infoPath = path.join(
        __dirname,
        `../build/artifacts/contracts/${contract}.sol/${contract}.json`,
      );
      const abiPath = path.join(__dirname, `../app/data/abi/${contract}.json`);
      const content = fs.readFileSync(infoPath, { encoding: 'utf-8' });
      const info = JSON.parse(content);
      fs.writeFileSync(abiPath, JSON.stringify(info.abi, null, 2));
      console.log(`Copied ${contract} ABI file`);
    }
  } catch (error) {
    console.error('Post compile failed:', error);
    process.exit(1);
  }
};

main();
