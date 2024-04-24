const fs = require('fs');
const path = require('path');

const main = async () => {
  try {
    const ticketInfoPath = path.join(
      __dirname,
      '../build/artifacts/contracts/Ticket.sol/Ticket.json',
    );
    const ticketAbiPath = path.join(__dirname, '../app/data/abi/Ticket.json');

    const fileContent = fs.readFileSync(ticketInfoPath, {
      encoding: 'utf-8',
    });
    const ticketInfo = JSON.parse(fileContent);
    const ticketAbi = ticketInfo.abi;
    fs.writeFileSync(ticketAbiPath, JSON.stringify(ticketAbi, null, 2));

    console.log('Copied ABI files');
  } catch (error) {
    console.error('Post compile failed:', error);
    process.exit(1);
  }
};

main();
