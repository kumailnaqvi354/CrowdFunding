import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { CrowdFundToken } from "../../types/contracts/";
import type { CrowdFunding } from "../../types/contracts/CrowdFunding";
import type { CrowdFundToken__factory } from "../../types/factories/contracts/CrowdFundToken__factory";
import type { CrowdFunding__factory } from "../../types/factories/contracts/CrowdFunding__factory";

export async function deployCrowdFundingFixture(): Promise<{
  crowdfunding: CrowdFunding;
  crowdfundToken: CrowdFundToken;
}> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const crowdfundingFactory: CrowdFunding__factory = <CrowdFunding__factory>(
    await ethers.getContractFactory("CrowdFunding")
  );

  const crowdfundingTokenFactory: CrowdFundToken__factory = <CrowdFundToken__factory>(
    await ethers.getContractFactory("CrowdFundToken")
  );

  const crowdfundToken: CrowdFundToken = <CrowdFundToken>(
    await crowdfundingTokenFactory.connect(admin).deploy("CrowdFundToken", "CFT")
  ); //remove and add argument token address
  await crowdfundToken.deployed();

  const crowdfunding: CrowdFunding = <CrowdFunding>(
    await crowdfundingFactory.connect(admin).deploy(crowdfundToken.address)
  ); //remove and add argument token address
  await crowdfunding.deployed();

  return { crowdfunding, crowdfundToken };
}
