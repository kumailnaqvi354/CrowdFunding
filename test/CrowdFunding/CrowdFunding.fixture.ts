import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { CrowdFunding } from "../../types/contracts/CrowdFunding";
import type { CrowdFunding__factory } from "../../types/factories/contracts/CrowdFunding__factory";

export async function deployCrowdFundingFixture(): Promise<{ crowdfunding: CrowdFunding }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const greeting: string = "Hello, world!";
  const crowdfundingFactory: CrowdFunding__factory = <CrowdFunding__factory>(
    await ethers.getContractFactory("CrowdFunding")
  );
  const crowdfunding: CrowdFunding = <CrowdFunding>await crowdfundingFactory.connect(admin).deploy(greeting); //remove and add argument token address
  await crowdfunding.deployed();

  return { crowdfunding };
}
