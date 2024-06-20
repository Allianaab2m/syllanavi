import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { useEffect, useState } from "react";
import { z } from "zod";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";
import { findDepartmentByID, type Category } from "~/db/repository/departments";
// import { checkAdmin } from "~/sessions";
import departments from "~/departments.json";
import { Day, Term, serializeDay, serializeTerm } from "~/lib";

const ClassCreateSchema = z.object({
  name: z.string({ required_error: "この項目は必須です" }),
  department: z.number({ required_error: "この項目は必須です" }),
  category: z.number({ required_error: "この項目は必須です" }),
  academicYear: z
    .number({ required_error: "この項目は必須です" })
    .min(1)
    .max(4),
  term: z.enum(Term, { required_error: "この項目は必須です" }),
  day: z.enum(Day, { required_error: "この項目は必須です" }),
  unit: z.number({ required_error: "この項目は必須です" }).min(1),
  startAt: z.number({ required_error: "この項目は必須です" }).min(1),
  endAt: z.number().min(1).optional(),
});

const departmentsData = departments.map((d) => ({
  value: d.id.toString(),
  label: d.name,
}));

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

  const createClass = await classes.create({
    name: submission.value.name,
    departmentId: submission.value.department,
    categoryId: submission.value.category,
    academicYear: submission.value.academicYear,
    term: serializeTerm(submission.value.term),
    day: serializeDay(submission.value.day),
    unit: submission.value.unit,
    startAt: submission.value.startAt,
    endAt: submission.value.endAt,
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

  console.log({
    ...submission.value,
    term: serializeTerm(submission.value.term),
    day: serializeDay(submission.value.day),
  });

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

  const [
    form,
    {
      name,
      department,
      category,
      academicYear,
      term,
      day,
      unit,
      startAt,
      endAt,
    },
  ] = useForm({
    lastResult: data?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ClassCreateSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const selected = findDepartmentByID(Number(selectedDepartment));

    setSelectedCategories(selected ? selected.categories : []);
  }, [selectedDepartment]);

  return (
    <>
      <Title>新規授業作成</Title>
      <Form method="POST" {...getFormProps(form)}>
        <TextInput
          withAsterisk
          disabled={state === "submitting"}
          label="授業名"
          error={name.errors}
          {...getInputProps(name, { type: "text" })}
        />
        <Group grow>
          <Select
            withAsterisk
            searchable
            disabled={state === "submitting"}
            label="学科"
            data={departmentsData}
            error={department.errors}
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
            withAsterisk
            disabled={state === "submitting"}
            label="区分"
            placeholder="先に学科を選択してください"
            data={selectedCategories?.map((c) => ({
              value: c.id.toString(),
              label: c.name,
            }))}
            error={category.errors}
            {...getSelectProps(category)}
            defaultValue=""
          />
        </Group>
        <Group grow>
          <NumberInput
            withAsterisk
            disabled={state === "submitting"}
            key={academicYear.key}
            id={academicYear.id}
            name={academicYear.name}
            form={academicYear.formId}
            error={academicYear.errors}
            aria-invalid={!academicYear.valid || undefined}
            aria-describedby={
              !academicYear.valid ? academicYear.errorId : undefined
            }
            label="開講年次"
            min={1}
            max={4}
          />
          <Select
            withAsterisk
            disabled={state === "submitting"}
            label="学期"
            data={Term}
            error={term.errors}
            {...getSelectProps(term)}
            defaultValue=""
          />
          <Select
            withAsterisk
            disabled={state === "submitting"}
            label="曜日"
            data={Day}
            error={day.errors}
            {...getSelectProps(day)}
            defaultValue=""
          />
          <NumberInput
            withAsterisk
            disabled={state === "submitting"}
            key={startAt.key}
            id={startAt.id}
            name={startAt.name}
            form={startAt.formId}
            error={startAt.errors}
            aria-invalid={!startAt.valid || undefined}
            aria-describedby={!startAt.valid ? startAt.errorId : undefined}
            label="開始時間"
            min={1}
          />
          <NumberInput
            disabled={state === "submitting"}
            key={endAt.key}
            id={endAt.id}
            name={endAt.name}
            form={endAt.formId}
            error={endAt.errors}
            aria-invalid={!endAt.valid || undefined}
            aria-describedby={!endAt.valid ? endAt.errorId : undefined}
            label="終了時間"
            min={1}
          />
          <NumberInput
            withAsterisk
            disabled={state === "submitting"}
            key={unit.key}
            id={unit.id}
            name={unit.name}
            form={unit.formId}
            error={unit.errors}
            aria-invalid={!unit.valid || undefined}
            aria-describedby={!unit.valid ? unit.errorId : undefined}
            label="単位数"
            min={1}
          />
        </Group>
        <Button type="submit">登録</Button>
      </Form>
    </>
  );
}
