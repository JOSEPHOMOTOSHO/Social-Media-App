const listNewsFeed = async (params, credentials, signal) => {
  try {
    const response = fetch("/api/posts/feed/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });

    return await response;
  } catch (err) {
    console.log(err);
  }
};

const postsByUser = async (params, credentials) => {
  try {
    const response = fetch("/api/posts/by/" + params.userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });

    return await response;
  } catch (err) {
    console.log(err);
  }
};

export { listNewsFeed, postsByUser };
