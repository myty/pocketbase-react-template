import { useAuthStore } from "./pocketbase";
import { LoginForm } from "./LoginForm";
import "./App.css";

function App() {
  const { authStore, login, logout } = useAuthStore();

  return (
    <>
      {authStore.isValid ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <LoginForm onSubmit={login} />
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
