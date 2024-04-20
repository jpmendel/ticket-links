// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ticket {
    address manager;
    uint256 _maxAmount;
    uint256 _idCounter;
    mapping(uint256 => address) _owners;
    mapping(uint256 => uint256) _prices;
    mapping(uint256 => bool) _isForSale;
    mapping(uint256 => mapping(address => bool)) _isApproved;
    mapping(uint256 => mapping(address => bool)) _buyers;
    mapping(uint256 => address[]) _buyerAddresses;

    constructor(address _manager, uint256 _max) {
        manager = _manager;
        _maxAmount = _max;
        _idCounter = 1;
    }

    modifier requireManager() {
        require(msg.sender == manager, "Must be ticket creator");
        _;
    }

    modifier requireOwner(uint256 _ticketId) {
        require(msg.sender == _owners[_ticketId], "Must be ticket owner");
        _;
    }

    modifier requireBuyer(uint256 _ticketId) {
        require(
            _buyers[_ticketId][msg.sender],
            "Must be a buyer of the ticket"
        );
        _;
    }

    modifier requireForSale(uint256 _ticketId) {
        require(_isForSale[_ticketId], "Must be for sale");
        _;
    }

    modifier requireApproval(uint256 _ticketId) {
        require(_isApproved[_ticketId][msg.sender], "Must be approved");
        _;
    }

    modifier requireHasBuyer(uint256 _ticketId, address _recipient) {
        require(_buyers[_ticketId][_recipient], "Must have a buyer");
        _;
    }

    function totalAmount() public view returns (uint256) {
        return _idCounter - 1;
    }

    function maxAmount() public view returns (uint256) {
        return _maxAmount;
    }

    function create(uint256 _price) public requireManager returns (uint256) {
        require(totalAmount() < maxAmount(), "No tickets remaining");
        uint256 _ticketId = _idCounter;
        _owners[_ticketId] = msg.sender;
        _prices[_ticketId] = _price;
        _idCounter++;
        return _ticketId;
    }

    function ownerOf(uint256 _ticketId) public view returns (address) {
        return _owners[_ticketId];
    }

    function priceOf(uint256 _ticketId) public view returns (uint256) {
        return _prices[_ticketId];
    }

    function isForSale(uint256 _ticketId) public view returns (bool) {
        return _isForSale[_ticketId];
    }

    function list(uint256 _ticketId) public requireOwner(_ticketId) {
        _isForSale[_ticketId] = true;
    }

    function cancelSale(uint256 _ticketId) public requireOwner(_ticketId) {
        _clearSaleInfo(_ticketId);
    }

    function bid(uint256 _ticketId) public requireForSale(_ticketId) {
        require(!_buyers[_ticketId][msg.sender], "Already a buyer");
        _buyers[_ticketId][msg.sender] = true;
        _buyerAddresses[_ticketId].push(msg.sender);
    }

    function buyersOf(
        uint256 _ticketId
    ) public view returns (address[] memory) {
        return _buyerAddresses[_ticketId];
    }

    function dismissBuyer(
        uint256 _ticketId,
        address _buyer
    ) public requireOwner(_ticketId) {
        _buyers[_ticketId][_buyer] = false;
        for (uint i = 0; i < _buyerAddresses[_ticketId].length; i++) {
            if (_buyerAddresses[_ticketId][i] == _buyer) {
                _buyerAddresses[_ticketId][i] = address(0);
            }
        }
    }

    function approve(
        uint256 _ticketId,
        address _recipient
    ) public requireOwner(_ticketId) requireHasBuyer(_ticketId, _recipient) {
        _isApproved[_ticketId][_recipient] = true;
    }

    function buy(
        uint256 _ticketId
    ) public payable requireBuyer(_ticketId) requireApproval(_ticketId) {
        require(msg.value == _prices[_ticketId], "Incorrect amount of money");
        address _owner = ownerOf(_ticketId);
        payable(_owner).transfer(msg.value);
        _owners[_ticketId] = msg.sender;
        _clearSaleInfo(_ticketId);
    }

    function increaseLimit(uint256 _max) public requireManager {
        _maxAmount = _max;
    }

    function _clearSaleInfo(uint256 _ticketId) private {
        for (uint i = 0; i < _buyerAddresses[_ticketId].length; i++) {
            _buyers[_ticketId][_buyerAddresses[_ticketId][i]] = false;
            _isApproved[_ticketId][_buyerAddresses[_ticketId][i]] = false;
        }
        delete _buyerAddresses[_ticketId];
        _isForSale[_ticketId] = false;
    }
}
