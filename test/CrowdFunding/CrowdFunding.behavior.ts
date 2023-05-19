import { expect } from "chai";
import { utils } from "ethers";

export function shouldBehaveLikeCrowdFunding(): void {
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  it("Should Allow only Owner to add project for fund raise", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960);

    const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);
  });

  it("Should revert with Deadline", async function () {
    expect(
      this.crowdfunding
        .connect(this.signers.admin)
        .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960),
    ).to.be.revertedWithCustomError(this.crowdfunding, "DeadlineEnded");
  });

  it("Should add funds to Project", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960);
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

  it("should allow Fund provider to withdraw if fund is not successfully raised", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960);
    // const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);

    await this.crowdFundToken
      .connect(this.signers.user1)
      .approve(this.crowdfunding.address.toString(), utils.parseEther("10000"));

    await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", "100000000000000000000");
    await delay(30000);

    await this.crowdfunding.connect(this.signers.user1).withdrawFundsFromProject("1");
    console.log(
      "here===========================",
      await this.crowdfunding.connect(this.signers.user1).projectFundsProvider("1", this.signers.user1.address),
    );
  });

  it("Should revert with error NotFundedBySender", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960);
    // const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);

    await this.crowdFundToken
      .connect(this.signers.user1)
      .approve(this.crowdfunding.address.toString(), utils.parseEther("10000"));

    await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", "100000000000000000000");
    await delay(30000);

    await this.crowdfunding.connect(this.signers.user1).withdrawFundsFromProject("1");
    console.log(
      "here===========================",
      await this.crowdfunding.connect(this.signers.user1).projectFundsProvider("1", this.signers.user1.address),
    );

    // const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response ==========", response);
    await expect(
      this.crowdfunding.connect(this.signers.user1).withdrawFundsFromProject("1"),
    ).to.be.revertedWithCustomError(this.crowdfunding, "NotFundedBySender");
    // const response1 = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    // console.log("here response1 ==========", response1);
  });

  it("should allow project Owner to claim funds", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684563960);
    const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    console.log("here response ==========", response);

    await this.crowdFundToken
      .connect(this.signers.user1)
      .approve(this.crowdfunding.address.toString(), utils.parseEther("10000"));

    await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", "100000000000000000000");
    await delay(30000);
    expect(await this.crowdfunding.connect(this.signers.admin).claimFunds(1)).to.be.revertedWithCustomError(
      this.crowdfunding,
      "DeadlineNotEnded",
    );
  });

  it("should allow project Owner to claim funds", async function () {
    await this.crowdfunding
      .connect(this.signers.admin)
      .addProjectForFundRaising("Project 1", "Project Description 1", utils.parseUnits("1000", "ether"), 1684478880);
    const response = await this.crowdfunding.connect(this.signers.admin).projectDetails("1");
    console.log("here response ==========", response);

    await this.crowdFundToken
      .connect(this.signers.user1)
      .approve(this.crowdfunding.address.toString(), utils.parseEther("10000"));

    await this.crowdfunding.connect(this.signers.user1).addFundToProject("1", "1000000000000000000000");
    await delay(30000);

    await this.crowdfunding.connect(this.signers.admin).claimFunds(1);
  });
}
