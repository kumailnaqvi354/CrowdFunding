// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/ICrowdfunding.sol";

contract CrowdFunding is Ownable, ReentrancyGuard, Pausable, ICrowdFunding {
    
    address public immutable CROWDFUNDINGTOKEN;
    uint256 public PROJECTID;

    mapping (uint256 => mapping (address => uint256)) public projectFundsProvider;
    mapping (uint256 => ICrowdFunding.Project) public projectDetails;
    
    
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
        ICrowdFunding.Project memory cache = ICrowdFunding.Project ({
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
        ICrowdFunding.Project memory cache = projectDetails[_projecId];
        uint256 userProvidedfunds =  projectFundsProvider[_projecId][msg.sender];
        if(_amount < 0){
            revert InvalidAmount();
        }
        if (cache.amountToRaise < 0) {
                revert InvalidProject();
        }
        if (cache.amountRaised > cache.amountToRaise) {
            revert FundRaiseCompleted();
        }
        cache.amountRaised += _amount;
        userProvidedfunds += _amount;
        projectDetails[_projecId] = cache;
        IERC20(CROWDFUNDINGTOKEN).transferFrom(msg.sender, address(this), _amount);
        emit ICrowdFunding.FundsRaised(_projecId, _amount, msg.sender);
    }
    
    function getProjectDetails(uint256 _projectId)public view{
    // check project ID
    // check is available details 
    }
    
    function withdrawFundsFromProject(uint256 _projectID)external nonReentrant{
        // check is project deadline past
        // check is fund raised completed to required amount
        // check is user a fund provider 
        // get amount given as funds
        // update struct and mapping 
        // transfer amount to user

    }



}

