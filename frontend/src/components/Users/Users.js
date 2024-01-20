import React from "react";
import UserCard from "./UserTableCard";
const User = ({ users }) => {
  return (
    <div className="w-full mt-3 bg-primary-700 rounded-md">
      {users && users.length ? (
        <table className="w-full">
          <thead className="border-b-2 border-secondary-600">
            <tr>
              <th className="py-4">Photo</th>
              <th className="py-4">User Name</th>
              <th className="py-4">Email</th>
              <th className="py-4">Mobile</th>
              <th className="py-4">Status</th>
              <th className="py-4">Operations</th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user) => (
              <UserCard user={user} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="h-full p-10 flex item-center justify-center">
          <h3>No Users Found</h3>
        </div>
      )}
    </div>
  );
};

export default User;
