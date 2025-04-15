// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library MilestoneManagement {
    struct Milestone {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        MilestoneStatus status;
    }

    enum MilestoneStatus { NotStarted, InProgress, Completed, Disputed }

    function validateMilestones(
        Milestone[] storage _milestones,
        uint256 _totalPayment
    ) internal view {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestones.length; i++) {
            require(bytes(_milestones[i].title).length > 0, "Milestone details incomplete");
            totalAmount += _milestones[i].amount;
        }
        require(totalAmount == _totalPayment, "Total milestone amounts != total payment");
    }

    function getMilestoneData(
        Milestone[] storage _milestones
    ) internal view returns (
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory amounts,
        uint256[] memory deadlines,
        uint8[] memory statuses
    ) {
        uint256 length = _milestones.length;
        titles = new string[](length);
        descriptions = new string[](length);
        amounts = new uint256[](length);
        deadlines = new uint256[](length);
        statuses = new uint8[](length);
        
        for (uint256 i = 0; i < length; i++) {
            titles[i] = _milestones[i].title;
            descriptions[i] = _milestones[i].description;
            amounts[i] = _milestones[i].amount;
            deadlines[i] = _milestones[i].deadline;
            statuses[i] = uint8(_milestones[i].status);
        }
    }
}