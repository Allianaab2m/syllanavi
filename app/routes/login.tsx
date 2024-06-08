import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button, Stack, Text, TextInput } from "@mantine/core";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { checkPassword } from "~/auth.server";
import { db } from "~/db";
import { Users } from "~/db/repository/users";
import { createUserSession, getUserSession } from "~/sessions";

const LoginSchema = z.object({
  name: z.string({ required_error: "この項目は必須です" }),
  password: z.string({ required_error: "この項目は必須です" }),
});

export async function action({ context, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: LoginSchema });
  const users = Users(db(context));

  if (submission.status !== "success") {
    return json({
      success: false,
      message: "Input validation error",
      submission: submission.reply(),
    });
  }

  const user = await users.findByName(submission.value.name, true);

  if (!user) {
    return json({
      success: false,
      message: "User not found",
      submission: submission.reply({
        fieldErrors: {
          name: ["ユーザーが見つかりませんでした"],
        },
      }),
    });
  }

  if (
    user.password &&
    (await checkPassword(submission.value.password, user.password))
  ) {
    return await createUserSession(context)(user.id, "/", user.name);
  }

  return json({
    success: false,
    message: "Password unmatched",
    submission: submission.reply({
      fieldErrors: {
        password: ["パスワードが一致しません"],
      },
    }),
  });
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const session = await getUserSession(context)(request);
  if (session.userId) {
    return redirect("/");
  }
  return null;
}

export default function Login() {
  const data = useActionData<typeof action>();
  const { state } = useNavigation();

  const [form, { name, password }] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Box mx="xl" mt="lg">
      <Text size="xl" fw="bold">
        ログイン
      </Text>
      <Form method="POST" {...getFormProps(form)}>
        <Stack>
          <TextInput
            withAsterisk
            disabled={state === "submitting"}
            label="ユーザー名"
            error={name.errors}
            {...getInputProps(name, { type: "text" })}
          />
          <TextInput
            withAsterisk
            disabled={state === "submitting"}
            label="パスワード"
            error={password.errors}
            {...getInputProps(password, { type: "password" })}
          />
          <Button loading={state === "submitting"} color="teal.6" type="submit">
            ログイン
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
