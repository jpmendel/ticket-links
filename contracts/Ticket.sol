// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Ticket {
    address public manager;
    uint256 private _maxAmount;
    uint256 private _idCounter;

    struct TicketInfo {
        uint256 id;
        address owner;
        uint256 price;
        bool isForSale;
        bool needsApproval;
    }

    struct BuyerInfo {
        address addr;
        bool isApproved;
    }

    mapping(uint256 => TicketInfo) private _tickets;
    mapping(uint256 => mapping(address => BuyerInfo)) private _buyers;
    mapping(uint256 => address[]) private _buyerAddresses;

    constructor(address _manager, uint256 _max) {
        manager = _manager;
        _maxAmount = _max;
        _idCounter = 1;
    }

    event TicketCreated(uint256 indexed ticketId);

    event TicketPurchased(
        uint256 indexed ticketId,
        address indexed sellerAddress,
        address indexed buyerAddress
    );

    modifier requireIsManager() {
        require(msg.sender == manager, "Must be ticket creator");
        _;
    }

    modifier requireIsOwner(uint256 _ticketId) {
        require(
            msg.sender == _tickets[_ticketId].owner,
            "Must be ticket owner"
        );
        _;
    }

    modifier requireIsBuyer(uint256 _ticketId) {
        require(
            !_tickets[_ticketId].needsApproval ||
                _buyers[_ticketId][msg.sender].addr == msg.sender,
            "Must be a buyer of the ticket"
        );
        _;
    }

    modifier requireForSale(uint256 _ticketId) {
        require(_tickets[_ticketId].isForSale, "Must be for sale");
        _;
    }

    modifier requireExactChange(uint256 _ticketId) {
        require(
            msg.value == _tickets[_ticketId].price,
            "Incorrect amount of money"
        );
        _;
    }

    modifier requireApproval(uint256 _ticketId) {
        require(
            !_tickets[_ticketId].needsApproval ||
                _buyers[_ticketId][msg.sender].isApproved,
            "Must be approved"
        );
        _;
    }

    modifier requireHasBuyer(uint256 _ticketId, address _recipient) {
        require(
            !_tickets[_ticketId].needsApproval ||
                _buyers[_ticketId][_recipient].addr == _recipient,
            "Must have a buyer"
        );
        _;
    }

    function totalAmount() public view returns (uint256) {
        return _idCounter - 1;
    }

    function maxAmount() public view returns (uint256) {
        return _maxAmount;
    }

    function create(uint256 _price) public requireIsManager {
        require(totalAmount() < maxAmount(), "Reached ticket limit");
        uint256 _ticketId = _idCounter;
        TicketInfo storage _ticket = _tickets[_ticketId];
        _ticket.id = _ticketId;
        _ticket.owner = msg.sender;
        _ticket.price = _price;
        _ticket.needsApproval = false;
        _idCounter++;
        emit TicketCreated(_ticketId);
    }

    function ownerOf(uint256 _ticketId) public view returns (address) {
        return _tickets[_ticketId].owner;
    }

    function ownedByMe() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint id = 1; id <= totalAmount(); id++) {
            if (ownerOf(id) == msg.sender) {
                _ticketIds[_count] = id;
                _count++;
            }
        }
        TicketInfo[] memory _myTickets = new TicketInfo[](_count);
        for (uint i = 0; i < _count; i++) {
            _myTickets[i] = _tickets[_ticketIds[i]];
        }
        return _myTickets;
    }

    function priceOf(uint256 _ticketId) public view returns (uint256) {
        return _tickets[_ticketId].price;
    }

    function isForSale(uint256 _ticketId) public view returns (bool) {
        return _tickets[_ticketId].isForSale;
    }

    function allForSale() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint id = 1; id <= totalAmount(); id++) {
            if (isForSale(id)) {
                _ticketIds[_count] = id;
                _count++;
            }
        }
        TicketInfo[] memory _forSaleTickets = new TicketInfo[](_count);
        for (uint i = 0; i < _count; i++) {
            _forSaleTickets[i] = _tickets[_ticketIds[i]];
        }
        return _forSaleTickets;
    }

    function buyersOf(
        uint256 _ticketId
    ) public view returns (BuyerInfo[] memory) {
        uint256 _count = _buyerAddresses[_ticketId].length;
        BuyerInfo[] memory _buyerList = new BuyerInfo[](_count);
        for (uint i = 0; i < _count; i++) {
            _buyerList[i] = _buyers[_ticketId][_buyerAddresses[_ticketId][i]];
        }
        return _buyerList;
    }

    function requestedByMe() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint id = 1; id <= totalAmount(); id++) {
            if (_buyers[id][msg.sender].addr == msg.sender) {
                _ticketIds[_count] = id;
                _count++;
            }
        }
        TicketInfo[] memory _requested = new TicketInfo[](_count);
        for (uint i = 0; i < _count; i++) {
            _requested[i] = _tickets[_ticketIds[i]];
        }
        return _requested;
    }

    function list(
        uint256 _ticketId,
        bool _needsApproval
    ) public requireIsOwner(_ticketId) {
        TicketInfo storage _ticket = _tickets[_ticketId];
        _ticket.isForSale = true;
        _ticket.needsApproval = _needsApproval;
    }

    function cancelSale(uint256 _ticketId) public requireIsOwner(_ticketId) {
        _clearSaleInfo(_ticketId);
    }

    function purchase(
        uint256 _ticketId
    ) public payable requireApproval(_ticketId) requireExactChange(_ticketId) {
        address _owner = ownerOf(_ticketId);
        payable(_owner).transfer(msg.value);
        _tickets[_ticketId].owner = msg.sender;
        _clearSaleInfo(_ticketId);
        emit TicketPurchased(_ticketId, _owner, msg.sender);
    }

    function purchaseFirstAvailable(address _seller) public payable {
        for (uint id = 1; id <= totalAmount(); id++) {
            if (
                ownerOf(id) == _seller &&
                isForSale(id) &&
                priceOf(id) == msg.value &&
                !_ticketNeedsApproval(id)
            ) {
                purchase(id);
                return;
            }
        }
        revert("No tickets found at that price");
    }

    function requestPurchase(
        uint256 _ticketId
    ) public requireForSale(_ticketId) {
        require(
            _buyers[_ticketId][msg.sender].addr != msg.sender,
            "Already a buyer"
        );
        BuyerInfo storage _buyer = _buyers[_ticketId][msg.sender];
        _buyer.addr = msg.sender;
        _buyer.isApproved = false;
        _buyerAddresses[_ticketId].push(msg.sender);
    }

    function isApproved(
        uint256 _ticketId
    ) public view requireIsBuyer(_ticketId) returns (bool) {
        return _buyers[_ticketId][msg.sender].isApproved;
    }

    function approve(
        uint256 _ticketId,
        address _recipient
    ) public requireIsOwner(_ticketId) requireHasBuyer(_ticketId, _recipient) {
        _buyers[_ticketId][_recipient].isApproved = true;
    }

    function dismiss(
        uint256 _ticketId,
        address _buyer
    ) public requireIsOwner(_ticketId) {
        delete _buyers[_ticketId][_buyer];
        for (uint i = 0; i < _buyerAddresses[_ticketId].length; i++) {
            if (_buyerAddresses[_ticketId][i] == _buyer) {
                _buyerAddresses[_ticketId][i] = address(0);
            }
        }
    }

    function increaseLimit(uint256 _max) public requireIsManager {
        _maxAmount = _max;
    }

    function _ticketNeedsApproval(
        uint256 _ticketId
    ) private view returns (bool) {
        return _tickets[_ticketId].needsApproval;
    }

    function _clearSaleInfo(uint256 _ticketId) private {
        TicketInfo storage _ticket = _tickets[_ticketId];
        for (uint i = 0; i < _buyerAddresses[_ticketId].length; i++) {
            delete _buyers[_ticketId][_buyerAddresses[_ticketId][i]];
        }
        delete _buyerAddresses[_ticketId];
        _ticket.isForSale = false;
    }
}
