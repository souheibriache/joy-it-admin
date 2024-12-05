import { resetAuth, signInSuccess } from "../redux/auth/auth-slice";
import { store } from "../redux/store";
import { resetUser } from "../redux/auth/user-slice";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const fetchWithAuth = async (url: string, options: any = {}) => {
  let { accessToken, refreshToken } = store.getState().auth;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = store.dispatch;

  const headers: any = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(baseUrl + url, fetchOptions);

  if (response.status === 401) {
    return await refreshAccessToken(refreshToken || "")
      .then(async (refreshResponse) => {
        console.log({ refreshResponse });
        // const accessTokenPayload: {} = jwtDecode(refreshResponse.accessToken);
        dispatch(
          signInSuccess({
            refreshToken: refreshResponse.refreshToken || refreshToken,
            accessToken: refreshResponse.accessToken,
          })
        );

        fetchOptions.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
        return await fetch(baseUrl + url, fetchOptions);
      })
      .catch(() => {
        dispatch(resetAuth());
        dispatch(resetUser());
        window.location.href = "/sign-in";
        return;
      });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Request failed: ${response.status}`, errorData);
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  const responseData = await response.json().catch(() => ({}));
  return responseData;
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
