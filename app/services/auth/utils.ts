import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Organization, User } from "@workos-inc/node";
import { Auth } from "./client";

type DataFunctionArgs = ActionFunctionArgs | LoaderFunctionArgs;
type AuthenticatedDataFunctionArgs = DataFunctionArgs & {
  organization: Organization;
  user: User;
};
type AuthenticatedDataFunction<T> = (args: AuthenticatedDataFunctionArgs) => T;

export function withAuth<T>(dataFunction: AuthenticatedDataFunction<T>) {
  return async function loader(args: DataFunctionArgs) {
    const organization = await Auth.Guards.RequireOrganization(args.request);
    const user = await Auth.Guards.RequireUser(args.request);

    return dataFunction({ ...args, organization, user });
  };
}
