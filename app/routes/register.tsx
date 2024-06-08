import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button, Stack, Text, TextInput } from "@mantine/core";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { isErr, unwrapOk } from "option-t/plain_result";
import { z } from "zod";
import { db } from "~/db";
import { Users } from "~/db/repository/users";
import { createUserSession } from "~/sessions";

export const RegisterSchema = z.object({
  name: z
    .string({ required_error: "この項目は必須です" })
    .min(4, { message: "4文字以上で入力してください" })
    .max(16, { message: "16文字以下で入力してください" })
    .regex(/[0-9a-zA-Z]+/, { message: "英数字のみで入力してください" }),
  password: z
    .string({ required_error: "この項目は必須です" })
    .min(8, { message: "8文字以上で入力してください" }),
});

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: RegisterSchema });
  const users = Users(db(context));

  if (submission.status !== "success") {
    return json({
      success: false,
      message: "Input validation error",
      submission: submission.reply(),
    });
  }

  if (await users.findByName(submission.value.name)) {
    return json({
      success: false,
      message: "Name duplicate",
      submission: submission.reply({
        fieldErrors: {
          name: ["名前が重複しています"],
        },
      }),
    });
  }

  const userCreateRes = await users.create({ name: submission.value.name });

  if (isErr(userCreateRes)) {
    return json({
      success: false,
      message: "DB Error",
      submission: submission.reply({
        formErrors: [
          "ユーザ登録が出来ませんでした。時間を空けてもう一度やり直してください。",
        ],
      }),
    });
  }

  const user = unwrapOk(userCreateRes);

  return await createUserSession(context)(user.id, "/", user.name);
}

export default function Register() {
  const data = useActionData<typeof action>();
  const { state } = useNavigation();

  const [form, { name, password }] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RegisterSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Box mt="lg">
      <Text size="xl" fw="bold">
        新規登録
      </Text>
      <Form method="POST" {...getFormProps(form)}>
        <Stack>
          <TextInput
            withAsterisk
            disabled={state === "submitting"}
            label="ユーザー名"
            description="英数字のみ。4文字以上16文字以下で入力してください。"
            error={name.errors}
            {...getInputProps(name, { type: "text" })}
          />
          <TextInput
            withAsterisk
            disabled={state === "submitting"}
            label="パスワード"
            description="英数字・記号が使えます。8文字以上で入力してください。"
            error={password.errors}
            {...getInputProps(password, { type: "password" })}
          />
          <Button loading={state === "submitting"} color="teal.6" type="submit">
            登録
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
