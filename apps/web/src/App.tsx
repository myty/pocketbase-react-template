import pb, { useAuthStore } from "./pocketbase";
import { LoginForm } from "./LoginForm";
import "./App.css";

function App() {
  const { authStore, login, loginWithProvider, logout, status } =
    useAuthStore();

  const url = pb.files.getUrl(
    authStore.model as Record<string, unknown>,
    authStore.model?.avatar
  );

  const handleLogin = (
    provider: "google" | "email",
    email?: string,
    password?: string
  ) => {
    if (provider !== "email") {
      loginWithProvider(provider);
      return;
    }

    if (email && password) {
      login(email, password);
    }
  };

  return (
    <>
      <h1>{status}</h1>
      {status === "authenticated" && <img src={url} alt="avatar" />}
      {authStore.isValid ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
      {authStore.isValid && (
        <>
          <h1>Welcome, {authStore.model?.name}!</h1>
          <p>{authStore.isAdmin ? "Admin" : ""}</p>
        </>
      )}
    </>
  );
}

export default App;
