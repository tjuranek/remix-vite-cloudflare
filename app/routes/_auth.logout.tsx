import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Auth } from "~/services/auth/client";

export async function loader({ request }: LoaderFunctionArgs) {
  return Auth.Logout(request);
}
