import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate, setToken } =
    useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Mobile detection - enhanced for better accuracy
  React.useEffect(() => {
    const mobileCheck =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    setIsMobile(mobileCheck);
    console.log(
      "📱 MOBILE DEBUG: Login component - Mobile detected:",
      mobileCheck,
      "User Agent:",
      navigator.userAgent,
      "Screen width:",
      window.innerWidth
    );
  }, []);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      console.log("📱 MOBILE DEBUG: Login form submitted");

      setIsSubmitting(true);

      // Mobile-specific login handling
      if (isMobile) {
        console.log("📱 MOBILE DEBUG: Using mobile-optimized login");
        console.log(
          "📱 MOBILE DEBUG: Current backend URL:",
          axios.defaults.baseURL
        );

        // Use the current backend URL from AppContext (no need to override)
        console.log(
          "📱 MOBILE DEBUG: Current axios baseURL:",
          axios.defaults.baseURL
        );
        console.log(
          "📱 MOBILE DEBUG: Using current backend URL for mobile login"
        );

        // Skip health checks for mobile - proceed directly to login
        console.log("📱 MOBILE DEBUG: Proceeding with mobile login (skipping health checks)");
      }

      const { data } = await axios.post(
        `/api/user/${state}`,
        {
          name,
          email,
          password,
        },
        {
          timeout: isMobile ? 30000 : 10000, // 30 seconds for mobile, 10 for desktop
        }
      );

      console.log("📱 MOBILE DEBUG: Login response:", data);

      if (data.success) {
        console.log("📱 MOBILE DEBUG: Login successful, user data:", data.user);
        // Store the token
        setToken(data.token);
        setUser(data.user);

        // Show success message and navigate
        toast.success(
          state === "login"
            ? "Login successful!"
            : "Account created successfully!"
        );
        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("📱 MOBILE DEBUG: Login/Register error:", error);
      console.error("📱 MOBILE DEBUG: Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      // Enhanced error handling for both mobile and desktop
      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        toast.error("Login timeout. Please check your connection and try again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        const errorMessage = error.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col gap-4 m-auto items-start p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white ${
          isMobile ? "w-[90%] max-w-sm mx-4" : "w-80 sm:w-[352px]"
        }`}
      >
        <div className="w-full text-center">
          <p className="text-2xl font-medium">
            <span className="text-primary">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {state === "login"
              ? "Login to add items to your cart and place orders"
              : "Create an account to start shopping"}
          </p>
        </div>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className={`border border-gray-200 rounded w-full mt-1 outline-primary ${
                isMobile ? "p-3 text-base" : "p-2"
              }`}
              type="text"
              required
              style={{
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className={`border border-gray-200 rounded w-full mt-1 outline-primary ${
              isMobile ? "p-3 text-base" : "p-2"
            }`}
            type="email"
            required
            style={{
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className={`border border-gray-200 rounded w-full mt-1 outline-primary ${
              isMobile ? "p-3 text-base" : "p-2"
            }`}
            type="password"
            required
            style={{
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          />
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-3 rounded-md cursor-pointer ${
            isMobile ? "text-lg font-medium touch-manipulation" : ""
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          {isSubmitting
            ? "Processing..."
            : state === "register"
            ? "Create Account"
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
