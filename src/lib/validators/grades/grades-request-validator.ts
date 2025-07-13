export function validateGradesAPIRequest(query: URLSearchParams): void {
  if (!query.has("filter")) {
    throw Error("Missing filter parameter");
  }

  if (!query.has("startDate")) {
    throw Error("Missing startDate parameter");
  }
  if (!query.has("studentId")) {
    throw Error("Missing studentId parameter");
  }
  if (!["courseSession", "allCourses"].includes(query.get("filter")!)) {
    throw Error(`Invalid filter value: ${query.get("filter")}`);
  }
}
