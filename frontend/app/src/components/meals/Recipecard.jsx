import React from "react";
import { TbPinned } from "react-icons/tb";
import { TbPinnedFilled } from "react-icons/tb";

export default function RecipeCard({ recipe, togglePin, openModal }) {
  // Hàm xử lý sự kiện click vào nút pin
  const handlePinClick = (e) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền để không gọi openModal
    togglePin(); // Thực hiện toggle pin
  };

  return (
    <div
      className="h-44 border rounded shadow p-4 bg-gray-100 break-all mx-3"
      style={{
        backgroundImage: `url(${recipe.image})`,
        backgroundSize: "fit",
        backgroundPosition: "center",
      }}
      onClick={openModal} // Mở modal khi nhấp vào toàn bộ card
    >
      <div className="flex gap-4 justify-between h-full bg-black w-full bg-opacity-60 p-4 rounded text-white">
        <div>
          <h3 className="text-lg font-bold mt-2">{recipe.title}</h3>
          <p className="text-sm">{recipe.time}</p>
        </div>
        {/* Nút pin */}
        {recipe.isPinned ? (
          <TbPinnedFilled
            className="text-yellow-50 text-3xl"
            onClick={handlePinClick} // Xử lý click vào nút pin
          />
        ) : (
          <TbPinned
            className="text-yellow-50 text-3xl"
            onClick={handlePinClick} // Xử lý click vào nút pin
          />
        )}
      </div>
    </div>
  );
}
