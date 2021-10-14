const signIn = async (user) => {
  try {
    const response = await fetch("/auth/sigin", {
      method: "POST",
      headers: {
        Accept: "Application/json",
        "Content-Type": "Application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response;
  } catch (error) {
    console.log(error);
  }
};

const signOut = async () => {
  try {
    const response = await fetch("/auth/signout", {
      method: "GET",
    });
    
    return await response;
  } catch (error) {
    console.log(error);
  }
};

export { signIn, signOut };
