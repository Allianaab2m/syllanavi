import { err, ok } from "neverthrow"
import {
  Lecture,
  LectureDay,
  LectureGrade,
  LectureModelParseError,
  LectureSemester,
} from "./lectures"

describe("LectureGrade", () => {
  it("should return 1 when fromNumber is called with 1", () => {
    expect(LectureGrade.fromNumber(1)).toEqual(ok(1))
  })
  it("should return 2 when fromNumber is called with 2", () => {
    expect(LectureGrade.fromNumber(2)).toEqual(ok(2))
  })
  it("should return 3 when fromNumber is called with 3", () => {
    expect(LectureGrade.fromNumber(3)).toEqual(ok(3))
  })
  it("should return 4 when fromNumber is called with 4", () => {
    expect(LectureGrade.fromNumber(4)).toEqual(ok(4))
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(LectureGrade.fromNumber(5)).toEqual(
      err(new LectureModelParseError("grade")),
    )
  })
})

describe("LectureSemester", () => {
  it("should return '前期' when fromNumber is called with 0", () => {
    expect(LectureSemester.fromNumber(0)).toEqual(ok("前期"))
  })
  it("should return '後期' when fromNumber is called with 1", () => {
    expect(LectureSemester.fromNumber(1)).toEqual(ok("後期"))
  })
  it("should return '通年' when fromNumber is called with 2", () => {
    expect(LectureSemester.fromNumber(2)).toEqual(ok("通年"))
  })
  it("should return '集中前期' when fromNumber is called with 3", () => {
    expect(LectureSemester.fromNumber(3)).toEqual(ok("集中前期"))
  })
  it("should return '集中後期' when fromNumber is called with 4", () => {
    expect(LectureSemester.fromNumber(4)).toEqual(ok("集中後期"))
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(LectureSemester.fromNumber(5)).toEqual(
      err(new LectureModelParseError("semester")),
    )
  })
})

describe("LectureDay", () => {
  it("should return '月' when fromNumber is called with 0", () => {
    expect(LectureDay.fromNumber(0)).toEqual(ok("月"))
  })
  it("should return '火' when fromNumber is called with 1", () => {
    expect(LectureDay.fromNumber(1)).toEqual(ok("火"))
  })
  it("should return '水' when fromNumber is called with 2", () => {
    expect(LectureDay.fromNumber(2)).toEqual(ok("水"))
  })
  it("should return '木' when fromNumber is called with 3", () => {
    expect(LectureDay.fromNumber(3)).toEqual(ok("木"))
  })
  it("should return '金' when fromNumber is called with 4", () => {
    expect(LectureDay.fromNumber(4)).toEqual(ok("金"))
  })
  it("should return '土' when fromNumber is called with 5", () => {
    expect(LectureDay.fromNumber(5)).toEqual(ok("土"))
  })
  it("should return '日' when fromNumber is called with 6", () => {
    expect(LectureDay.fromNumber(6)).toEqual(ok("日"))
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(LectureDay.fromNumber(7)).toEqual(
      err(new LectureModelParseError("day")),
    )
  })
})

describe("Lecture", () => {
  it("should return a lecture when fromRepository is called with a valid lecture", () => {
    const lecture = {
      id: "1",
      year: 2024,
      grade: 1,
      semester: 0,
      day: 0,
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    }
    const expectedLecture = {
      id: "1",
      year: 2024,
      grade: 1,
      semester: "前期",
      day: "月",
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    } satisfies Lecture

    expect(Lecture.fromRepository(lecture)).toEqual(ok(expectedLecture))
  })

  it("should throw an error when fromRepository is called with an invalid grade", () => {
    const lecture = {
      id: "1",
      year: 2024,
      grade: 5,
      semester: 0,
      day: 0,
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    }

    expect(Lecture.fromRepository(lecture)).toEqual(
      err([new LectureModelParseError("grade")]),
    )
  })

  it("should throw an error when fromRepository is called with an invalid semester", () => {
    const lecture = {
      id: "1",
      year: 2024,
      grade: 1,
      semester: 5,
      day: 0,
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    }

    expect(Lecture.fromRepository(lecture)).toEqual(
      err([new LectureModelParseError("semester")]),
    )
  })

  it("should throw an error when fromRepository is called with an invalid day", () => {
    const lecture = {
      id: "1",
      year: 2024,
      grade: 1,
      semester: 0,
      day: 7,
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    }

    expect(Lecture.fromRepository(lecture)).toEqual(
      err([new LectureModelParseError("day")]),
    )
  })

  it("should throw errors when fromRepository is called with multiple invalid fields", () => {
    const lecture = {
      id: "1",
      year: 2024,
      grade: 5,
      semester: 5,
      day: 7,
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    }

    expect(Lecture.fromRepository(lecture)).toEqual(
      err([
        new LectureModelParseError("grade"),
        new LectureModelParseError("semester"),
        new LectureModelParseError("day"),
      ]),
    )
  })
})
