import React from "react";

interface LoginFormProps {
  onSubmit(provider: "google"): void;
  onSubmit(provider: "email", email: string, password: string): void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    onSubmit("email", email, password);
  };

  const handleGoogleLogin = () => {
    onSubmit("google");
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1>Login</h1>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button type="submit">Login</button>
      <button type="button" onClick={handleGoogleLogin}>
        Login w/ Google
      </button>
    </form>
  );
};
