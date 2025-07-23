const { BskyAgent } = require("@atproto/api");

const agent = new BskyAgent({ service: "https://bsky.social" });

async function login(handle, appPassword) {
  await agent.login({ identifier: handle, password: appPassword });
  return agent;
}

async function getMyPosts(agent, did = null) {
  const profile = await agent.getProfile({ actor: did || agent.session?.did });

  const feed = await agent.getAuthorFeed({
    actor: profile.data.did,
    limit: 100,
  });

  return feed.data.feed;
}

module.exports = { login, getMyPosts };
