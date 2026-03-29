import { describe, expect, it } from "vitest";
import {
  maskUserNameForLogs,
  redactCurrentUserText,
  redactCurrentUserValue,
} from "../log-redaction.js";

describe("log redaction", () => {
  it("redacts the active username inside home-directory paths", () => {
    const userName = "baaralyuser";
    const maskedUserName = maskUserNameForLogs(userName);
    const input = [
      `cwd=/Users/${userName}/baaraly`,
      `home=/home/${userName}/workspace`,
      `win=C:\\Users\\${userName}\\baaraly`,
    ].join("\n");

    const result = redactCurrentUserText(input, {
      userNames: [userName],
      homeDirs: [`/Users/${userName}`, `/home/${userName}`, `C:\\Users\\${userName}`],
    });

    expect(result).toContain(`cwd=/Users/${maskedUserName}/baaraly`);
    expect(result).toContain(`home=/home/${maskedUserName}/workspace`);
    expect(result).toContain(`win=C:\\Users\\${maskedUserName}\\baaraly`);
    expect(result).not.toContain(userName);
  });

  it("redacts standalone username mentions without mangling larger tokens", () => {
    const userName = "baaralyuser";
    const maskedUserName = maskUserNameForLogs(userName);
    const result = redactCurrentUserText(
      `user ${userName} said ${userName}/project should stay but abaaralyuserz should not change`,
      {
        userNames: [userName],
        homeDirs: [],
      },
    );

    expect(result).toBe(
      `user ${maskedUserName} said ${maskedUserName}/project should stay but abaaralyuserz should not change`,
    );
  });

  it("recursively redacts nested event payloads", () => {
    const userName = "baaralyuser";
    const maskedUserName = maskUserNameForLogs(userName);
    const result = redactCurrentUserValue({
      cwd: `/Users/${userName}/baaraly`,
      prompt: `open /Users/${userName}/baaraly/ui`,
      nested: {
        author: userName,
      },
      values: [userName, `/home/${userName}/project`],
    }, {
      userNames: [userName],
      homeDirs: [`/Users/${userName}`, `/home/${userName}`],
    });

    expect(result).toEqual({
      cwd: `/Users/${maskedUserName}/baaraly`,
      prompt: `open /Users/${maskedUserName}/baaraly/ui`,
      nested: {
        author: maskedUserName,
      },
      values: [maskedUserName, `/home/${maskedUserName}/project`],
    });
  });

  it("skips redaction when disabled", () => {
    const input = "cwd=/Users/baaralyuser/baaraly";
    expect(redactCurrentUserText(input, { enabled: false })).toBe(input);
  });
});
