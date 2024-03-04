import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { Routes } from "~/constants/routes";
import { Auth } from "~/services/auth/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await Auth.Guards.RequireUser(request);

  return json({ user });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await Auth.Guards.RequireUser(request);
  const { data, error } = await validator.validate(await request.formData());

  if (error) {
    return validationError(error);
  }

  await Auth.Organization.Create(user.id, data.name, data.domain);

  // TODO: add current user to organization

  return redirect(Routes.Dashboard);
};

export default function Welcome() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-md w-full">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold leading-6 tracking-wide">
              Hey {user.firstName}! 👋
            </h2>

            <p className="text-gray-600">Let's get your gym onboarded.</p>
          </div>

          <ValidatedForm
            className="mt-6 space-y-4"
            method="post"
            validator={validator}
          >
            <Input
              label="Gym Name"
              name="name"
              placeholder="Competition CrossFit"
            />

            <Input
              label="Domain"
              name="domain"
              placeholder="competitioncrossfit.com"
            />

            <Button label="Get Started" type="submit" />
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}

const validator = withZod(
  z.object({
    name: z.string().min(1, { message: "Please enter a name." }),
    domain: z.string().min(1, {
      message:
        "Please enter a domain. Enter a desired domain if you do not own one yet.",
    }),
  })
);
