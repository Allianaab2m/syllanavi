import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Stack, TextInput } from "@mantine/core";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { z } from "zod";
import { db } from "~/db";
import { Users } from "~/db/repository/users";

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

  const existUser = await users.findByName(submission.value.name);

  if (existUser) {
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
  if (userCreateRes.err) {
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

  return json({
    success: true,
    message: "success",
    submission: submission.reply(),
  });
}

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(4, { message: "4文字以上で入力してください" })
    .max(16, { message: "16文字以下で入力してください" })
    .regex(/[0-9a-zA-Z]+/, { message: "英数字のみで入力してください" }),
  password: z
    .string()
    .min(8, { message: "8文字以上入力してください" })
    .regex(/[0-9]+/, { message: "数字を1文字以上使用してください" })
    .regex(/[a-z]+/, { message: "英小文字を1文字以上使用してください" })
    .regex(/[A-Z]+/, { message: "英大文字を1文字以上使用してください" }),
});

export default function Register() {
  const data = useActionData<typeof action>();
  const [form, { name, password }] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RegisterSchema });
    },
    shouldValidate: "onBlur",
  });

  useEffect(() => {
    if (!data) return;
    console.log(data);
  }, [data]);

  return (
    <Form navigate={false} method="POST" {...getFormProps(form)}>
      <Stack>
        <TextInput
          withAsterisk
          label="ユーザー名"
          placeholder="英数字のみ 4~16文字"
          error={name.errors?.toString()}
          {...getInputProps(name, { type: "text" })}
        />
        <TextInput
          withAsterisk
          label="パスワード"
          placeholder="英数字・記号 8文字以上"
          {...getInputProps(password, { type: "password" })}
        />
        <Button type="submit">登録</Button>
      </Stack>
    </Form>
  );
}
