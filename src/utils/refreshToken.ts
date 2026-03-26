async function refreshAccessToken() {
    const res = await fetch("/api/refresh");
    const result = await res.json();
  
    if (result.success) {
     // setAccessToken(result.accessToken); // update memory
      return true;
    } else {
      // refresh token expired -> log out
      //logout();
      return false;
    }
  }