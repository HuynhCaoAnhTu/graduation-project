import React, { useState, useEffect } from "react";
import axiosInstance from "../../utills/axiosInstance";

const ManageUsers = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Item, setItem] = useState(null);
  const [formAction, setFormAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  // Lấy danh sách người dùng từ backend
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/get-all-user", {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      setTotalUsers(response.data.total);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Thêm mới người dùng
  const handleAddItem = async () => {
    try {
      await axiosInstance.post("/add-user", Item);
      fetchUsers(); // Refresh danh sách người dùng
      setItem({ fullName: "", email: "", password: "", type: 0 });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error.response.data);
    }
  };

  // Xóa người dùng
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/delete-user/${id}`);
      fetchUsers(); // Refresh danh sách người dùng
    } catch (error) {
      console.error("Error deleting user:", error.response.data);
    }
  };

  // Sửa thông tin người dùng
  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/edit-user/${Item._id}`, Item);
      fetchUsers(); // Refresh danh sách người dùng
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Error editing user:", error.response.data);
    }
  };

  const handleTypeChange = (e) => {
    setItem({ ...Item, type: e.target.value });
  };

  // Lọc dữ liệu người dùng
  const filteredData = data.filter((item) =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Userlist</h1>
        <button
          onClick={() => {
            setItem({ fullName: "", email: "", password: "", type: 0 });
            setIsModalOpen(true);
            setFormAction("Add");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
         Add new
        </button>
      </div>

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Full name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td className="border p-2 text-center">{item._id}</td>
              <td className="border p-2">{item.fullName}</td>
              <td className="border p-2">{item.email}</td>
              <td className="border p-2">
                {item.type == 0 ? "Admin" : "Client"}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => {
                    setItem({
                      _id: item._id,
                      fullName: item.fullName,
                      email: item.email,
                      password: item.password,
                      type: item.type,
                    });
                    setFormAction("Edit");
                    setIsModalOpen(true);
                  }}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                >
                 Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                 Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded mx-1`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-1/3">
            <h2 className="text-lg font-bold mb-4">Thêm người dùng mới</h2>
            <input
              type="text"
              placeholder="Full name"
              value={Item.fullName}
              onChange={(e) => setItem({ ...Item, fullName: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={Item.email}
              onChange={(e) => setItem({ ...Item, email: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={Item.password}
              onChange={(e) => setItem({ ...Item, password: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />

            <select
              className="w-full p-2 mb-4 border rounded"
              value={Item.type}
              onChange={handleTypeChange}
            >
              <option value="0">Client</option>
              <option value="1">Admin</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
               Canncel
              </button>

              {formAction === "Add" ? (
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
