import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

export function OAuth2Callback() {
  const navigate = useNavigate();

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
          } catch (err) {
            // fallback: try to let authService.oauthLogin (server-side) get profile
            try {
              await authService.oauthLogin();
            } catch (e) {
              // ignore
            }
          }
          navigate("/dashboard");
          return;
        }

        // If tokens not present in URL, call backend endpoint to finalize oauth login
        try {
          await authService.oauthLogin();
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
