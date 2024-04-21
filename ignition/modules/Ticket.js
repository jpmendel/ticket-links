const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('TicketModule', (module) => {
  const manager = process.env.MANAGER_ADDRESS;
  if (!manager) {
    throw new Error('Missing manager address');
  }
  const ticket = module.contract('Ticket', [manager, 10]);
  return { ticket };
});
