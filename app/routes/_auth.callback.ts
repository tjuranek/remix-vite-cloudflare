import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Auth } from "~/services/auth/client";

export async function loader({ request }: ActionFunctionArgs) {
  return Auth.Authenticate(request);
}
