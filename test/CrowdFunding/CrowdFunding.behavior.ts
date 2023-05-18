import { expect } from "chai";
import { utils } from "ethers";

export function shouldBehaveLikeCrowdFunding(): void {
  it("Should Allow only Owner to add project for fund raise", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684431789);

    const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);
  });
  it("Should revert with Only Owner Error", async function () {
    expect(
      this.crowdfunding
        .connect(this.signers.user1)
        .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684431789),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert with Deadline", async function () {
    expect(
      this.crowdfunding
        .connect(this.signers.admin)
        .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684410189),
    ).to.be.revertedWithCustomError(this.crowdfunding, "DeadlineEnded");
  });

  it("Should add funds to Project", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684515609);
    // const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);
    await this.crowdFundToken
      .connect(this.signers.user1)
      .approve(this.crowdfunding.address.toString(), utils.parseEther("10000"));
    await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", utils.parseEther("100"));

    // await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", utils.parseEther("1000"));
    await expect(
      this.crowdfunding.connect(this.signers.user1).addFundToProject("1", utils.parseEther("1000")),
    ).to.be.revertedWithCustomError(this.crowdfunding, "InvalidAmount");
    // const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);
  });
}
