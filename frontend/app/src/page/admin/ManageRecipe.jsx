import React, { useState, useEffect } from "react";
import axiosInstance from "../../utills/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ManageRecipes = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Item, setItem] = useState(null);
  const [formAction, setFormAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  // Fetch all recipes from the server
  const fetchRecipes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-recipe", {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      setTotalRecipes(response.data.total);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching Recipes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/get-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, [currentPage]);

  // Add new recipe
  const handleAddItem = async () => {
    try {
      await axiosInstance.post("/add-recipe", Item);
      fetchRecipes();
      setItem({ title: "", image: "", category: "", time: "", content: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding recipe:", error.response.data);
    }
  };

  // Delete a recipe
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/delete-recipe/${id}`);
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error.response.data);
    }
  };

  // Edit an existing recipe
  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/edit-recipe/${Item._id}`, Item);
      fetchRecipes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing recipe:", error.response.data);
    }
  };

  // Upload image to Cloudinary
  const handleUploadImage = async (file) => {
    setUploading(true); // Bật trạng thái upload
    const formData = new FormData();

    // Thêm dữ liệu vào formData
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Thay bằng preset bạn đã tạo
    formData.append("cloud_name", "dv3j4strx"); // Thay bằng cloud_name của bạn

    try {
      // Gửi yêu cầu tới Cloudinary API
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dv3j4strx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        // Nếu có lỗi HTTP
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cập nhật trạng thái ảnh
      if (data.secure_url) {
        setItem((prevItem) => ({ ...prevItem, image: data.secure_url }));
        console.log("Image uploaded successfully:", data.secure_url);
      } else {
        throw new Error("Failed to retrieve secure_url from response.");
      }
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false); // Tắt trạng thái upload
    }
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow break-all">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Meal list </h1>
        <button
          onClick={() => {
            setItem({
              title: "",
              image: "",
              category: "",
              time: "",
              content: "",
            });
            setFormAction("Add");
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm mới
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 w-[15%]">ID</th>
            <th className="border p-2 w-[25%]">Title</th>
            <th className="border p-2 w-[15%]">Image</th>
            <th className="border p-2 w-[10%]">Time</th>
            <th className="border p-2 ">Content</th>
            <th className="border w-[15%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td className="border p-2 text-center">{item._id}</td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">
                <img src={item.image} alt={item.title} className="" />
              </td>
              <td className="border p-2">{item.time}</td>
              <td className="border ">
                <div className=" ql-snow">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: item.content,
                    }}
                  ></div>
                </div>
              </td>
              {/* <p>{item.content}</p> */}

              <td className="border text-center">
                <button
                  onClick={() => {
                    setItem(item);
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
            className={`px-4 py-2 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } rounded mx-1`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2"
        >
          Next
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-scroll">
          <div className="bg-white p-6 rounded shadow w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {formAction === "Add" ? "Add New Recipe" : "Update Recipe"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={Item.title}
              onChange={(e) => setItem({ ...Item, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="file"
              onChange={(e) => handleUploadImage(e.target.files[0])}
              className="w-full p-2 mb-4 border rounded"
            />
            {uploading && <p>Uploading...</p>}
            {Item.image && (
              <img
                src={Item.image}
                alt="Preview"
                className="w-32 h-32 object-cover mb-4"
              />
            )}
            <select
              value={Item.category}
              onChange={(e) => setItem({ ...Item, category: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Time"
              value={Item.time}
              onChange={(e) => setItem({ ...Item, time: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <ReactQuill
              value={Item.content}
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'size': ['small', 'large', 'huge'] }],
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  ["link"],
                  [{ align: [] }],
                  ["image"],
                  ["blockquote", "code-block"],
                ],
              }}
              onChange={(value) => setItem({ ...Item, content: value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
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

export default ManageRecipes;
