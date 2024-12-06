import { useDispatch } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { signInSuccess } from "@/redux/auth/auth-slice";
import { toast } from "sonner";
import fetchWithAuth from "../fetchWrapper";
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
} from "@/redux/auth/user-slice";
import { AppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type LoginUserRequest = {
  login: string;
  password: string;
};

export const useLoginUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize navigate

  const loginUser = async (loginUserData: LoginUserRequest) => {
    const response = await fetch(`${API_BASE_URL}/accounts/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUserData),
    });
    if (!response) throw new Error("Unable to login User");
    return response.json();
  };

  const {
    error,
    mutateAsync: loginUserRequest,
    isLoading,
    reset,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      dispatch(
        signInSuccess({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
      );
      toast.success("Connecté");

      await dispatch(fetchCurrentUser()); // Ensure user is fetched before redirecting

      navigate("/home"); // Redirect to homepage
    },
  });

  if (error) {
    toast.error(error.toString());
    reset();
  }
  return { isLoading, loginUserRequest };
};

export const fetchCurrentUser = () => async (dispatch: AppDispatch) => {
  dispatch(fetchUserStart());
  try {
    const user = await fetchWithAuth("/accounts/profile", {
      method: "GET",
    });
    dispatch(fetchUserSuccess(user));
  } catch (error) {
    dispatch(fetchUserFailure(error));
    console.log({ error });
    toast.error("Échec de la récupération de l'utilisateur");
  }
};
