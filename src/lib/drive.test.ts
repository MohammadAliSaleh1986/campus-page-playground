import { describe, expect, it } from "vitest";
import { driveEmbedUrl, driveFileId } from "./drive";

describe("Google Drive links", () => {
  it("reads the file ID from a share link", () => {
    expect(driveFileId("https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing")).toBe("1AbCdEfGhIjKlMnOp");
  });
  it("reads the file ID from an open?id= link", () => {
    expect(driveFileId("https://drive.google.com/open?id=1AbCdEfGhIjKlMnOp")).toBe("1AbCdEfGhIjKlMnOp");
  });
  it("rejects links that are not Drive files", () => {
    expect(driveFileId("https://youtube.com/watch")).toBeNull();
  });
  it("builds the embeddable player address", () => {
    expect(driveEmbedUrl("abc123XYZ_-")).toBe("https://drive.google.com/file/d/abc123XYZ_-/preview");
  });
});
