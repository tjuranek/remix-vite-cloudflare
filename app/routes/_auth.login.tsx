import { Auth } from "~/services/auth/client";

export function loader() {
  return Auth.Login();
}
