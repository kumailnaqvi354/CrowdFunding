
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrowdFundToken is ERC20 {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(msg.sender, 100000 *10 **18);
        _mint(0xa6bBF340C995eC3eb6D7c528F70BB8306F87F38e, 100000 *10 **18);
        _mint(0xCEf9Ba1d37CE49df5Adff63CDeBfab4b4d465a09, 100000 *10 **18);
    }
}