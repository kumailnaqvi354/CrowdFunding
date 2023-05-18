// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/ICrowdfunding.sol";

contract CrowdFunding is Ownable, ReentrancyGuard, Pausable, ICrowdFunding {
    
    address public immutable CROWDFUNDINGTOKEN;
    uint256 PROJECTID;

    mapping (uint256 => address[]) public projectFundsProvider;
    mapping (uint256 => ICrowdFunding.ProjectDetails) public projectDetails;
    
    
    constructor(address _crowdFundToken) {
        CROWDFUNDINGTOKEN = _crowdFundToken;
    }

    
}

