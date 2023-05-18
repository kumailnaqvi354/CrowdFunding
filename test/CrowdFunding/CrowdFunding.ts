import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeCrowdFunding } from "./CrowdFunding.behavior";
import { deployCrowdFundingFixture } from "./CrowdFunding.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("CrowdFunding", function () {
    beforeEach(async function () {
      const { crowdfunding } = await this.loadFixture(deployCrowdFundingFixture);
      this.crowdfunding = crowdfunding;
    });

    shouldBehaveLikeCrowdFunding();
  });
});
