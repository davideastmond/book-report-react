export function validateGradesAPIRequest(query: URLSearchParams): void {
  if (!query.has("filter")) {
    throw new Error("Missing filter parameter");
  }
  if (!query.has("studentId")) {
    throw new Error("Missing studentId parameter");
  }
  if (!["courseSession", "allCourses"].includes(query.get("filter")!)) {
    throw new Error(`Invalid filter value: ${query.get("filter")}`);
  }
}
