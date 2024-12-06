import { resetAuth, signInSuccess } from "../redux/auth/auth-slice";
import { store } from "../redux/store";
import { resetUser } from "../redux/auth/user-slice";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchWithAuth = async (
  url: string,
  options: any = { headers: {} }
) => {
  const { accessToken, refreshToken } = store.getState().auth;
  const dispatch = store.dispatch;
  const headers: any = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      options && options?.headers
        ? options?.headers["Content-Type"]
        : "application/json";
  }

  let fetchOptions = { ...options, headers };

  let response = await fetch(baseUrl + url, fetchOptions);

  if (response.status === 401) {
    try {
      const refreshResponse = await refreshAccessToken(refreshToken || "");
      dispatch(
        signInSuccess({
          accessToken: refreshResponse.accessToken,
          refreshToken: refreshResponse.refreshToken || refreshToken,
        })
      );

      fetchOptions.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
      response = await fetch(baseUrl + url, fetchOptions);
    } catch (error) {
      dispatch(resetAuth());
      dispatch(resetUser());
      window.location.href = "/sign-in";
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }

  return response.json();
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await fetch(baseUrl + "/api/refreshToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const jsonData = await res.json();
    return jsonData;
  } catch (err) {
    console.log(err);
  }
};

export default fetchWithAuth;
