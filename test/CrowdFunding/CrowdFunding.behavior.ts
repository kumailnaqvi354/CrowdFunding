import { expect } from "chai";
import { utils } from "ethers";

export function shouldBehaveLikeCrowdFunding(): void {
  it("Should Allow only Owner to add project for fund raise", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684410189);

    const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    console.log("here response ==========", response);
  });
  it("Should revert with Only Owner Error", async function () {
    expect(
      this.crowdfunding
        .connect(this.signers.user1)
        .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684410189),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
}
