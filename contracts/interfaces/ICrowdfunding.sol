// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

interface ICrowdFunding {

    error InvalidArguments();
    error DeadlineEnded();
    error FundRaiseCompleted();
    error FundRaiseNotCompleted();
    error NoFundsInProjects();
    error InvalidAmount();
    error InvalidProject();
    error DeadlineNotEnded();
    error NotFundedBySender();
    error NotOwnerOfProject();

    struct Project {
        address owner;
        string name;
        string projectDescription;
        uint256 amountToRaise;
        uint256 amountRaised;
        uint256 deadline;

    }
    
    event ProjectAddedToFundRaise(uint256 _projectId,string _name,string _description, uint256 _amountToRaised, uint256 _deadline);
    event FundsRaised(uint256 _projecId, uint256 _amount, address _sender);
    event WithdrawFunds(uint256 _projecId, uint256 _amount, address _withdrawer);
    event fundsClaimed(uint256 _projecId, uint256 _amount, address _withdrawer);

    function addProjectForFundRaising(string memory _name,string memory _description, uint256 _amountToRaise, uint256 _deadline) external;
    function addFundToProject(uint256 _projecId, uint256 _amount) external;
    function withdrawFundsFromProject(uint256 _projectId)external;
     function claimFunds(uint256 _projectId) external;

}