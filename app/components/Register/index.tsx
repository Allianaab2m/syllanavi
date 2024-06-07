import { Button, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useActionData, useSubmit } from "@remix-run/react";
import { z } from "zod";
import type { RegisterAction } from "~/routes/resources.register";

const schema = z.object({
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

export function Register() {
  const submit = useSubmit();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      password: "",
    },
    validate: zodResolver(schema),
  });
  const data = useActionData<RegisterAction>();

  if (data && !data.success) {
    form.setErrors({ name: data.error.message });
  }

  return (
    <form
      method="POST"
      onSubmit={form.onSubmit((values) => {
        submit(values, {
          action: "/resources/register",
          method: "post",
          navigate: false,
        });
      })}
    >
      <Stack>
        <TextInput
          withAsterisk
          label="ユーザー名"
          placeholder="英数字のみ 4~16文字"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="パスワード"
          placeholder="英数字・記号 8文字以上"
          type="password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Button type="submit">登録</Button>
      </Stack>
    </form>
  );
}
