import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { env } from "~/utils/env";
import { WorkOS, User, Organization } from "@workos-inc/node";
import { Routes } from "~/constants/routes";
import { getQueryParam } from "~/utils/request";

const workos = new WorkOS(env.WORKOS_API_KEY);

const sessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: "__session",
    sameSite: "lax",
    secure: true,
    secrets: [env.COOKIE_SECRET],
  },
});

export class Auth {
  public static async Authenticate(request: Request) {
    const { user } = await workos.userManagement.authenticateWithCode({
      code: getQueryParam(request, "code"),
      clientId: env.WORKOS_CLIENT_ID,
    });

    const organizationMemberships = (
      await workos.userManagement.listOrganizationMemberships({
        userId: user.id,
      })
    ).data;

    const organization = organizationMemberships[0]
      ? await workos.organizations.getOrganization(
          organizationMemberships[0].organizationId
        )
      : undefined;

    return await Auth.Session.Commit(request, user, organization);
  }

  public static Login() {
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: env.WORKOS_CLIENT_ID,
      provider: "authkit",
      redirectUri: env.WORKOS_REDIRECT_URI,
    });

    return redirect(authorizationUrl);
  }

  public static async Logout(request: Request) {
    const session = await this.Session.Get(request);

    return redirect(Routes.Login, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  public static Guards = {
    RequireOrganization: async (request: Request) => {
      const session = await this.Session.Get(request);
      const organization = session.get("__organization");

      if (!organization) {
        throw redirect(Routes.Login);
      }

      return organization as Organization;
    },
    RequireUser: async (request: Request) => {
      const session = await this.Session.Get(request);
      const user = session.get("__user");

      if (!user) {
        throw redirect(Routes.Login);
      }

      return user as User;
    },
  };

  public static Organization = {
    Create: async (userId: string, name: string, domain: string) => {
      const organization = await workos.organizations.createOrganization({
        name,
        domains: [domain],
      });

      await workos.userManagement.createOrganizationMembership({
        organizationId: organization.id,
        userId,
      });
    },
  };

  private static Session = {
    Commit: async (
      request: Request,
      user: User,
      organization: Organization | undefined
    ) => {
      const session = await this.Session.Get(request);
      session.set("__user", user);

      if (organization) {
        session.set("__organization", organization);
      }

      return redirect(organization ? Routes.Dashboard : Routes.Welcome, {
        headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
      });
    },
    Get: async (request: Request) => {
      return await sessionStorage.getSession(request.headers.get("Cookie"));
    },
  };
}
