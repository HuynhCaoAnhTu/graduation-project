import React from "react";

const categories = [
  { name: "High Protein", image: "/path/to/high-protein.jpg" },
  { name: "Low Carb", image: "/path/to/low-carb.jpg" },
  { name: "Dairy Free", image: "/path/to/dairy-free.jpg" },
  { name: "Vegetarian", image: "/path/to/vegetarian.jpg" },
];

export default function CategoryList() {
  return (
    <section className="my-2">
      <div className="flex flex-row flex-wrap items-center mt-4 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="p-2 rounded-md shadow-xl bg-primary">
            <span className="text-white">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
