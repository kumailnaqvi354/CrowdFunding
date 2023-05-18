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

    function addProjectForFundRaising(string memory _name,string memory _description, uint256 _amountToRaise, uint256 _deadline) external onlyOwner {
        if(_amountToRaise <= 0 && _deadline <= block.timestamp){
           revert InvalidArguments();
        }
        unchecked {
            PROJECTID++;
        }
        ICrowdFunding.ProjectDetails memory cache = ICrowdFunding.ProjectDetails ({
            name : _name,
            projectDescription : _description,
            amountToRaise : _amountToRaise,
            amountRaised : 0,
            deadline : _deadline
        });
        projectDetails[PROJECTID] = cache;
       emit ICrowdFunding.ProjectAddedToFundRaise(PROJECTID, _name,_description, _amountToRaise, _deadline);
    }

    function addFundToProject(uint256 _projecId, uint256 _amount) external {
        // check amount 
        // check project 
        // update struct and mapping
        // add user to fundprovider list 
        // transferFrom Token from sender to contract
        // emit event
    }
    
    function getProjectDetails(uint256 _projectId)external view{
    // check project ID
    // check is available details 
    }
    
    function withdrawFundsFromProject(uint256 _projectID)external{
        // check is project deadline past
        // check is fund raised completed to required amount
        // check is user a fund provider 
        // get amount given as funds
        // update struct and mapping 
        // transfer amount to user

    }



}

