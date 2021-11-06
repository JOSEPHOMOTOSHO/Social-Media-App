const createUser = async (user) => {
  try {
    let response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (signal) => {
  try {
    let response = await fetch("/api/users", {
      method: "GET",
      signal,
    });
    // console.log(await response.json(), "response from api call.");
    return await response.json();
  } catch (error) {
    console.log(error, "error");
  }
};

const getSingleUser = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + " " + credentials.t,
      },
    });
    // console.log("na me", await response.json());
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (params, credentials, user) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: user,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (params, credentials) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const follow = async (params, credentials, followId) => {
  try {
    let response = await fetch("/api/users/follow", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, followId: followId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (params, credentials, unfollowId) => {
  try {
    let response = await fetch("/api/users/unfollow", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const findpeople = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/findpeople/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  createUser,
  follow,
  unfollow,
  findpeople,
};
