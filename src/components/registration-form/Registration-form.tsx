"use client";
export function RegistrationForm() {
  return (
    <div className="p-4">
      <h1 className="text-2xl text-center mb-4">Register New User</h1>
      <form>
        <div>
          <label htmlFor="email">E-mail address:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            maxLength={50}
            name="firstName"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
          <label htmlFor="firstName">Last Name:</label>
          <input
            type="text"
            maxLength={50}
            id="lastName"
            name="lastName"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="w-full p-2"
            autoComplete="off"
            data-lpignore="true"
            onKeyDown={() => false}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password1"
            name="password1"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
