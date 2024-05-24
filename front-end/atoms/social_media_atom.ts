import { atom } from "recoil";

export const feedState = atom({
  key: "feed",
  default: [],
});

export const hatefulPostsState = atom({
  key: "hatefulPostsState",
  default: [],
});

export const usersState = atom({
  key: "users",
  default: [],
});

export const followResultsState = atom({
  key: "followResults",
  default: [],
});
