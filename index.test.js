const got = require("got");
const mockFn = jest.fn();

jest.mock("got", () => jest.fn());
jest.mock("fs", () => ({
  writeFileSync: mockFn,
}));

const playlistResponse = {
  kind: "youtube#playlistItemListResponse",
  etag: "j_vi1magwP-y1JYqkUBEKNSQRjs",
  items: [
    {
      kind: "youtube#playlistItem",
      etag: "R-TYKGWRAf60oP9rndsGQU8vJ9I",
      id: "UEwwY0tSUjlHVmdwZkpGYXJ0YkNlNW5NYVZxWmVlckRTSy41NkI0NEY2RDEwNTU3Q0M2",
      snippet: {
        resourceId: {
          videoId: "3KfX8xm5QgQ",
        },
      },
    },
    {
      kind: "youtube#playlistItem",
      etag: "GMNF1aSiN1wyJ-Pzig6oXv8k8ds",
      id: "UEwwY0tSUjlHVmdwZkpGYXJ0YkNlNW5NYVZxWmVlckRTSy4yODlGNEE0NkRGMEEzMEQy",
      snippet: {
        resourceId: {
          videoId: "UHdKOtTChjY",
        },
      },
    },
  ],
};

const mobilePlaylistResponse = playlistResponse;
const webPlaylistResponse = playlistResponse;

const detailedVideoResponse = {
  kind: "youtube#videoListResponse",
  etag: "qf7kp9SqMO0sisaTyw5iznRG56w",
  items: [
    {
      kind: "youtube#video",
      etag: "1J5ad0uE1OEFfgqwSw5J4NDlo3s",
      id: "3KfX8xm5QgQ",
      snippet: [Object],
      statistics: [Object],
    },
    {
      kind: "youtube#video",
      etag: "cVWuvBX5eI-lsmxaZrRam74HMcs",
      id: "UHdKOtTChjY",
      snippet: [Object],
      statistics: [Object],
    },
  ],
};

const mobileDetailedVideoResponse = detailedVideoResponse;
const webDetailedVideoResponse = detailedVideoResponse;

const expectedResponse = {
  videos: [
    {
      kind: "youtube#video",
      etag: "1J5ad0uE1OEFfgqwSw5J4NDlo3s",
      id: "3KfX8xm5QgQ",
      snippet: [null],
      statistics: [null],
    },
    {
      kind: "youtube#video",
      etag: "cVWuvBX5eI-lsmxaZrRam74HMcs",
      id: "UHdKOtTChjY",
      snippet: [null],
      statistics: [null],
    },
  ],
};

const mobileExpectedResponse = expectedResponse;
const webExpectedResponse = expectedResponse;

test("parse youtube API response", (done) => {
  got
    .mockReturnValueOnce(
      Promise.resolve({ body: JSON.stringify(mobilePlaylistResponse) })
    )
    .mockReturnValueOnce(
      Promise.resolve({ body: JSON.stringify(webPlaylistResponse) })
    )
    .mockReturnValueOnce(
      Promise.resolve({ body: JSON.stringify(mobileDetailedVideoResponse) })
    )
    .mockReturnValueOnce(
      Promise.resolve({ body: JSON.stringify(webDetailedVideoResponse) })
    );
  require("./index");
  setTimeout(() => {
    expect(mockFn).toHaveBeenCalledWith(
      "mobile-videos.json",
      JSON.stringify(mobileExpectedResponse)
    );
    expect(mockFn).toHaveBeenCalledWith(
      "web-videos.json",
      JSON.stringify(webExpectedResponse)
    );
    done();
  }, 0);
});
