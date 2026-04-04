export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    let response = await fetch(input, init);
  
    if (response.status === 401) {
      const refreshRes = await fetch("/api/auth/me");
      if (refreshRes.ok) {

        response = await fetch(input, init);
      } else {
        
        return response;
      }
    }
  
    return response;
  }