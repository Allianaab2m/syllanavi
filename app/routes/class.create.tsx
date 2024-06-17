import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Stack, TextInput, Title } from "@mantine/core";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { z } from "zod";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";

const ClassCreateSchema = z.object({
  name: z.string({ required_error: "この項目は必須です" }),
});

export async function action({ context, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ClassCreateSchema });
  const classes = Classes(db(context));

  if (submission.status !== "success") {
    return json({
      success: false,
      message: "Input validation error",
      submission: submission.reply(),
    });
  }

  const createClass = await classes.create({ name: submission.value.name });

  if (isErr(createClass)) {
    return json({
      success: false,
      message: "Database Error",
      submission: submission.reply({
        formErrors: ["一時的に登録が出来ません。時間を空けてお試しください。"],
      }),
    });
  }

  return redirect("/class");
}

export default function ClassCreate() {
  const data = useActionData<typeof action>();
  const { state } = useNavigation();
  const [form, { name }] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ClassCreateSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <Title>新規授業作成</Title>
      <Form method="POST" {...getFormProps(form)}>
        <Stack>
          <TextInput
            withAsterisk
            disabled={state === "submitting"}
            label="授業名"
            error={name.errors}
            {...getInputProps(name, { type: "text" })}
          />
          <Button type="submit">登録</Button>
        </Stack>
      </Form>
    </>
  );
}
