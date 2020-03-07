var DAZN = require("../DAZN/server");
console.log(DAZN.abdi());

describe("abdi", () => {
  it("Should return true", () => {
    expect(DAZN.abdi()).toBeTruthy();
  });
});
