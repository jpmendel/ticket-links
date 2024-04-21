require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
  },
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    artifacts: './build/artifacts',
    cache: './build/cache',
  },
};
