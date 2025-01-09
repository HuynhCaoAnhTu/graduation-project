import React from "react";

export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null; // Không hiển thị gì nếu không có công thức

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[80vh] w-full md:w-[80%] lg:w-[60%] bg-white p-6 rounded-lg mx-4 text-black overflow-auto shadow-lg">
        {/* Tiêu đề và nút đóng */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{recipe.title}</h2>
          <button
            onClick={onClose}
            className="text-xl text-white bg-red-500 rounded-full px-2 hover:bg-red-600 transition duration-300"
          >
            &times;
          </button>
        </div>

        {/* Hình ảnh */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
        />

        {/* Thông tin thời gian nấu */}
        <p className="text-lg mb-4">
          <strong className="text-gray-700">Cooking Time:</strong> {recipe.time}
        </p>

        {/* Nội dung công thức */}
        <div className="ql-snow">
          <div
            className="p-0 ql-editor  text-gray-600"
            dangerouslySetInnerHTML={{
              __html: recipe.content,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
