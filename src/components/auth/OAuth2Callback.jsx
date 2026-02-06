import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";

export function OAuth2Callback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const syncUserFromStorage = useAuthStore(
    (state) => state.syncUserFromStorage,
  );

  useEffect(() => {
    const handle = async () => {
      // Try to read tokens from query params first
      const params = new URLSearchParams(window.location.search);
      const accessToken =
        params.get("accessToken") || params.get("access_token");
      const refreshToken =
        params.get("refreshToken") || params.get("refresh_token");

      try {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          try {
            const profile = await userService.getCurrentUserProfile();
            localStorage.setItem("user", JSON.stringify(profile));
            setUser(profile);
          } catch (err) {
            // fallback: try to let authService.oauthLogin (server-side) get profile
            try {
              const result = await authService.oauthLogin();
              if (result?.user) {
                setUser(result.user);
              } else {
                syncUserFromStorage();
              }
            } catch (e) {
              syncUserFromStorage();
            }
          }
          navigate("/dashboard");
          return;
        }

        // If tokens not present in URL, call backend endpoint to finalize oauth login
        try {
          const result = await authService.oauthLogin();
          if (result?.user) {
            setUser(result.user);
          } else {
            syncUserFromStorage();
          }
          navigate("/dashboard");
        } catch (err) {
          console.error("OAuth2 login failed", err);
          navigate("/login");
        }
      } catch (e) {
        console.error(e);
        navigate("/login");
      }
    };

    handle();
  }, [navigate]);

  return null;
}

export default OAuth2Callback;
