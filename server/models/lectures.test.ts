import { LecturesDay, LecturesGrade, LecturesSemester } from "./lectures"

describe("LecturesGrade", () => {
  it("should return 1 when fromNumber is called with 1", () => {
    expect(LecturesGrade.fromNumber(1)).toBe(1)
  })
  it("should return 2 when fromNumber is called with 2", () => {
    expect(LecturesGrade.fromNumber(2)).toBe(2)
  })
  it("should return 3 when fromNumber is called with 3", () => {
    expect(LecturesGrade.fromNumber(3)).toBe(3)
  })
  it("should return 4 when fromNumber is called with 4", () => {
    expect(LecturesGrade.fromNumber(4)).toBe(4)
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(() => LecturesGrade.fromNumber(5)).toThrow("Invalid number")
  })
})

describe("LecturesSemester", () => {
  it("should return '前期' when fromNumber is called with 0", () => {
    expect(LecturesSemester.fromNumber(0)).toBe("前期")
  })
  it("should return '後期' when fromNumber is called with 1", () => {
    expect(LecturesSemester.fromNumber(1)).toBe("後期")
  })
  it("should return '通年' when fromNumber is called with 2", () => {
    expect(LecturesSemester.fromNumber(2)).toBe("通年")
  })
  it("should return '集中前期' when fromNumber is called with 3", () => {
    expect(LecturesSemester.fromNumber(3)).toBe("集中前期")
  })
  it("should return '集中後期' when fromNumber is called with 4", () => {
    expect(LecturesSemester.fromNumber(4)).toBe("集中後期")
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(() => LecturesSemester.fromNumber(5)).toThrow("Invalid number")
  })
})

describe("LecturesDay", () => {
  it("should return '月' when fromNumber is called with 0", () => {
    expect(LecturesDay.fromNumber(0)).toBe("月")
  })
  it("should return '火' when fromNumber is called with 1", () => {
    expect(LecturesDay.fromNumber(1)).toBe("火")
  })
  it("should return '水' when fromNumber is called with 2", () => {
    expect(LecturesDay.fromNumber(2)).toBe("水")
  })
  it("should return '木' when fromNumber is called with 3", () => {
    expect(LecturesDay.fromNumber(3)).toBe("木")
  })
  it("should return '金' when fromNumber is called with 4", () => {
    expect(LecturesDay.fromNumber(4)).toBe("金")
  })
  it("should return '土' when fromNumber is called with 5", () => {
    expect(LecturesDay.fromNumber(5)).toBe("土")
  })
  it("should return '日' when fromNumber is called with 6", () => {
    expect(LecturesDay.fromNumber(6)).toBe("日")
  })
  it("should throw an error when fromNumber is called with an invalid number", () => {
    expect(() => LecturesDay.fromNumber(7)).toThrow("Invalid number")
  })
})
