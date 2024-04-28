// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Ticket {
    address public manager;
    uint256 public maxAmount;
    uint256 private idCounter;

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

    mapping(uint256 => TicketInfo) private tickets;
    mapping(uint256 => mapping(address => BuyerInfo)) private buyers;
    mapping(uint256 => address[]) private buyerAddresses;

    constructor(address _manager, uint256 _maxAmount) {
        manager = _manager;
        maxAmount = _maxAmount;
        idCounter = 1;
    }

    // Events

    event TicketCreated(uint256 indexed ticketId);

    event TicketPurchased(
        uint256 indexed ticketId,
        address indexed sellerAddress,
        address indexed buyerAddress
    );

    // Modifiers

    modifier requireIsManager() {
        require(msg.sender == manager, "Must be ticket creator");
        _;
    }

    modifier requireIsOwner(uint256 _ticketId) {
        require(msg.sender == tickets[_ticketId].owner, "Must be ticket owner");
        _;
    }

    modifier requireIsBuyer(uint256 _ticketId) {
        require(
            !tickets[_ticketId].needsApproval ||
                buyers[_ticketId][msg.sender].addr == msg.sender,
            "Must be a buyer of the ticket"
        );
        _;
    }

    modifier requireForSale(uint256 _ticketId) {
        require(tickets[_ticketId].isForSale, "Must be for sale");
        _;
    }

    modifier requireExactChange(uint256 _ticketId) {
        require(
            msg.value == tickets[_ticketId].price,
            "Incorrect amount of money"
        );
        _;
    }

    modifier requireApproval(uint256 _ticketId) {
        require(
            !tickets[_ticketId].needsApproval ||
                buyers[_ticketId][msg.sender].isApproved,
            "Must be approved to purchase ticket"
        );
        _;
    }

    modifier requireHasBuyer(uint256 _ticketId, address _recipient) {
        require(
            !tickets[_ticketId].needsApproval ||
                buyers[_ticketId][_recipient].addr == _recipient,
            "Recipient must be a buyer of ticket"
        );
        _;
    }

    // Ticket Management

    function totalAmount() public view returns (uint256) {
        return idCounter - 1;
    }

    function increaseLimit(uint256 _maxAmount) public requireIsManager {
        require(
            _maxAmount > maxAmount,
            "New amount must be greater than current max"
        );
        maxAmount = _maxAmount;
    }

    function create(uint256 _price) public requireIsManager {
        require(totalAmount() < maxAmount, "Reached ticket limit");
        uint256 _ticketId = idCounter;
        tickets[_ticketId] = TicketInfo(
            _ticketId,
            msg.sender,
            _price,
            false,
            false
        );
        idCounter++;
        emit TicketCreated(_ticketId);
    }

    function ownerOf(uint256 _ticketId) public view returns (address) {
        return tickets[_ticketId].owner;
    }

    function ownedByMe() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint _id = 1; _id <= totalAmount(); _id++) {
            if (ownerOf(_id) == msg.sender) {
                _ticketIds[_count] = _id;
                _count++;
            }
        }
        TicketInfo[] memory _myTickets = new TicketInfo[](_count);
        for (uint _i = 0; _i < _count; _i++) {
            _myTickets[_i] = tickets[_ticketIds[_i]];
        }
        return _myTickets;
    }

    // Sell Ticket

    function priceOf(uint256 _ticketId) public view returns (uint256) {
        return tickets[_ticketId].price;
    }

    function isForSale(uint256 _ticketId) public view returns (bool) {
        return tickets[_ticketId].isForSale;
    }

    function allForSale() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint _id = 1; _id <= totalAmount(); _id++) {
            if (isForSale(_id)) {
                _ticketIds[_count] = _id;
                _count++;
            }
        }
        TicketInfo[] memory _forSaleTickets = new TicketInfo[](_count);
        for (uint _i = 0; _i < _count; _i++) {
            _forSaleTickets[_i] = tickets[_ticketIds[_i]];
        }
        return _forSaleTickets;
    }

    function list(
        uint256 _ticketId,
        bool _needsApproval
    ) public requireIsOwner(_ticketId) {
        TicketInfo storage _ticket = tickets[_ticketId];
        _ticket.isForSale = true;
        _ticket.needsApproval = _needsApproval;
    }

    function cancelSale(uint256 _ticketId) public requireIsOwner(_ticketId) {
        _clearSaleInfo(_ticketId);
    }

    function _clearSaleInfo(uint256 _ticketId) private {
        TicketInfo storage _ticket = tickets[_ticketId];
        _ticket.isForSale = false;
        address[] storage _addrs = buyerAddresses[_ticketId];
        for (uint _i = _addrs.length; _i > 0; _i--) {
            delete buyers[_ticketId][_addrs[_i - 1]];
            _addrs.pop();
        }
    }

    // Purchase Ticket

    function purchase(
        uint256 _ticketId
    ) public payable requireApproval(_ticketId) requireExactChange(_ticketId) {
        address _owner = ownerOf(_ticketId);
        payable(_owner).transfer(msg.value);
        tickets[_ticketId].owner = msg.sender;
        _clearSaleInfo(_ticketId);
        emit TicketPurchased(_ticketId, _owner, msg.sender);
    }

    function purchaseFirstAvailable(address _seller) public payable {
        for (uint _id = 1; _id <= totalAmount(); _id++) {
            if (
                ownerOf(_id) == _seller &&
                isForSale(_id) &&
                priceOf(_id) == msg.value &&
                !tickets[_id].needsApproval
            ) {
                purchase(_id);
                return;
            }
        }
        revert("No tickets found at that price");
    }

    // Purchase Requests

    function requestPurchase(
        uint256 _ticketId
    ) public requireForSale(_ticketId) {
        require(
            buyers[_ticketId][msg.sender].addr != msg.sender,
            "Already a buyer"
        );
        buyers[_ticketId][msg.sender] = BuyerInfo(msg.sender, false);
        buyerAddresses[_ticketId].push(msg.sender);
    }

    function buyersOf(
        uint256 _ticketId
    ) public view returns (BuyerInfo[] memory) {
        uint256 _count = buyerAddresses[_ticketId].length;
        BuyerInfo[] memory _buyerList = new BuyerInfo[](_count);
        for (uint _i = 0; _i < _count; _i++) {
            _buyerList[_i] = buyers[_ticketId][buyerAddresses[_ticketId][_i]];
        }
        return _buyerList;
    }

    function requestedByMe() public view returns (TicketInfo[] memory) {
        uint256[] memory _ticketIds = new uint256[](totalAmount());
        uint256 _count;
        for (uint _id = 1; _id <= totalAmount(); _id++) {
            if (buyers[_id][msg.sender].addr == msg.sender) {
                _ticketIds[_count] = _id;
                _count++;
            }
        }
        TicketInfo[] memory _requested = new TicketInfo[](_count);
        for (uint _i = 0; _i < _count; _i++) {
            _requested[_i] = tickets[_ticketIds[_i]];
        }
        return _requested;
    }

    function isApproved(
        uint256 _ticketId
    ) public view requireIsBuyer(_ticketId) returns (bool) {
        return buyers[_ticketId][msg.sender].isApproved;
    }

    function approve(
        uint256 _ticketId,
        address _recipient
    ) public requireIsOwner(_ticketId) requireHasBuyer(_ticketId, _recipient) {
        buyers[_ticketId][_recipient].isApproved = true;
    }

    function dismiss(
        uint256 _ticketId,
        address _buyer
    ) public requireIsOwner(_ticketId) requireHasBuyer(_ticketId, _buyer) {
        delete buyers[_ticketId][_buyer];
        address[] storage _addrs = buyerAddresses[_ticketId];
        if (_addrs[_addrs.length - 1] == _buyer) {
            _addrs.pop();
            return;
        }
        bool _foundAddress = false;
        for (uint _i = 0; _i < _addrs.length - 1; _i++) {
            if (_addrs[_i] == _buyer) {
                _foundAddress = true;
            }
            if (_foundAddress) {
                _addrs[_i] = _addrs[_i + 1];
            }
        }
        if (_foundAddress) {
            _addrs.pop();
        }
    }
}
