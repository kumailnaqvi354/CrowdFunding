import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { CrowdFundToken } from "../types/contracts/CrowdFundToken";
import type { CrowdFunding } from "../types/contracts/CrowdFunding";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    crowdFundToken: CrowdFundToken;
    crowdfunding: CrowdFunding;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
}
