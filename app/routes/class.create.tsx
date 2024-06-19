import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Select, Stack, TextInput, Title } from "@mantine/core";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { z } from "zod";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";
// import { checkAdmin } from "~/sessions";
import departments from "~/departments.json";
import { useEffect, useState } from "react";
import {
  findCategoryByName,
  findDepartmentByName,
  type Category,
} from "~/db/repository/departments";

const ClassCreateSchema = z.object({
  name: z.string({ required_error: "この項目は必須です" }),
  department: z.string({ required_error: "この項目は必須です" }),
  category: z.string({ required_error: "この項目は必須です" }),
});

const departmentsData = departments.map((d) => d.name);

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

  const department = findDepartmentByName(submission.value.department);

  if (!department) {
    return json({
      success: false,
      message: "Department not found",
      submission: submission.reply({
        fieldErrors: {
          department: ["存在しない学科です"],
        },
      }),
    });
  }

  const category = findCategoryByName(department, submission.value.category);

  if (!category) {
    return json({
      success: false,
      message: "Category not found",
      submission: submission.reply({
        fieldErrors: {
          category: ["存在しない区分です"],
        },
      }),
    });
  }

  const createClass = await classes.create({
    name: submission.value.name,
    departmentId: department.id,
    categoryId: category.id,
  });

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

export async function loader({ context, request }: LoaderFunctionArgs) {
  // const isAdmin = await checkAdmin(context, request);
  // if (isAdmin) {
  return null;
  // }
  // return redirect("/class");
}

export default function ClassCreate() {
  const data = useActionData<typeof action>();
  const { state } = useNavigation();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Category[] | null
  >(null);
  const [form, { name, department, category }] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ClassCreateSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const selected = findDepartmentByName(selectedDepartment ?? "");

    setSelectedCategories(selected ? selected.categories : []);
  }, [selectedDepartment]);

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
          <Select
            label="学科"
            data={departmentsData}
            {...getSelectProps(department)}
            defaultValue=""
            onChange={(e) => {
              setSelectedDepartment(e);
              form.update({
                name: category.name,
                value: "",
              });
            }}
          />
          <Select
            label="区分"
            data={selectedCategories?.map((c) => c.name)}
            {...getSelectProps(category)}
            defaultValue=""
          />
          <Button type="submit">登録</Button>
        </Stack>
      </Form>
    </>
  );
}
