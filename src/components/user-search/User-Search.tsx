"use client";
import { UserClient } from "@/clients/user-client";
import { EnrolledStudent } from "@/lib/types/db/course-session-info";
import { useEffect, useState } from "react";
import { StudentList } from "../student-list/Student-list";

type UserSearchProps = {
  onUserSelect?: (userId: string) => void;
  alreadyEnrolledStudents?: EnrolledStudent[];
  disabled?: boolean;
};

export function UserSearch({
  onUserSelect,
  alreadyEnrolledStudents = [],
  disabled = false,
}: UserSearchProps) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [filteredResults, setFilteredResults] = useState<EnrolledStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentListVisible, setStudentListVisible] = useState(true);
  useEffect(() => {
    getAllStudents();
  }, []);

  async function getAllStudents() {
    const res = await UserClient.getAllStudentsAdmin();
    setStudents(res);
  }

  const handleStudentSelected = (studentId: string) => {
    if (onUserSelect) {
      onUserSelect(studentId);
      setStudentListVisible(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Search by last name, first name, or email or id
    if (!query) return;
    if (query.length < 2) {
      setFilteredResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = students.filter((student) => {
      return (
        student.studentLastName.toLowerCase().includes(lowerQuery) ||
        student.studentFirstName.toLowerCase().includes(lowerQuery) ||
        (student.studentEmail!.toLowerCase().includes(lowerQuery) &&
          !alreadyEnrolledStudents.some(
            (enrolled) => enrolled.studentId === student.studentId
          ))
      );
    });
    if (results.length === 0) {
      setStudentListVisible(false);
    } else {
      setStudentListVisible(true);
    }
    setFilteredResults(results);
  };

  return (
    <div className="mt-6" data-testid="user-search-component">
      <div>
        <h4 className="text-lg">Search Results</h4>
      </div>
      <form>
        <label htmlFor="studentSearch">Enter student name or email</label>
        <input
          type="text"
          placeholder="Search for students..."
          className="border rounded p-2 mb-4 w-full"
          value={searchQuery}
          name="studentSearch"
          id="studentSearch"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          disabled={disabled}
        />
      </form>
      {studentListVisible && (
        <StudentList
          students={filteredResults}
          onStudentClick={handleStudentSelected}
          linkable
        />
      )}
    </div>
  );
}
