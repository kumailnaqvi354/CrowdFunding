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

    function addFundToProject(uint256 _projectId, uint256 _amount) external {
        ICrowdFunding.Project memory cache = projectDetails[_projectId];
        uint256 userProvidedfunds =  projectFundsProvider[_projectId][msg.sender];
        if (cache.amountToRaise < 0 || _projectId <= 0) {
            revert InvalidProject();
        }
        if(cache.deadline < block.timestamp){
            revert DeadlineEnded();
        }
        if (cache.amountRaised >= cache.amountToRaise) {
            revert FundRaiseCompleted();
        }
        if(_amount < 0 || _amount + cache.amountRaised > cache.amountToRaise){
            revert InvalidAmount();
        }
        cache.amountRaised += _amount;
        projectFundsProvider[_projectId][msg.sender] += _amount;
        projectDetails[_projectId] = cache;
        IERC20(CROWDFUNDINGTOKEN).transferFrom(msg.sender, address(this), _amount);
        emit ICrowdFunding.FundsRaised(_projectId, _amount, msg.sender);
    }
    
    function withdrawFundsFromProject(uint256 _projectId)external nonReentrant{
        ICrowdFunding.Project memory cache = projectDetails[_projectId];
        uint256 userProvidedfunds =  projectFundsProvider[_projectId][msg.sender];
       if (cache.amountToRaise < 0 || _projectId <= 0) {
            revert InvalidProject();
        }
        if(cache.deadline > block.timestamp){
            revert DeadlineNotEnded();
        }
        if (cache.amountRaised > cache.amountToRaise) {
            revert FundRaiseCompleted();
        }
        if (userProvidedfunds <= 0) {
            revert NotFundedBySender();
        }
         
        cache.amountRaised -= userProvidedfunds;
        projectDetails[_projectId] = cache;
        
        delete projectFundsProvider[_projectId][msg.sender];
        IERC20(CROWDFUNDINGTOKEN).transfer(msg.sender, userProvidedfunds);
        emit ICrowdFunding.WithdrawFunds(_projectId, userProvidedfunds, msg.sender);

    }



}

