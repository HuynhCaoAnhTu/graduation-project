import React, { useEffect, useState } from "react";
import CategoryList from "../components/meals/Categorylist";
import RecipeCard from "../components/meals/Recipecard";
import { useMainContext } from "../../context/UserContext";
import axiosInstance from "../utills/axiosInstance";
import RecipeModal from "../components/meals/RecipeModal";

export default function Meals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("0"); // State for selected category
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useMainContext();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/get-categories`);
      setCategories(response.data); // Assuming response contains the categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchRecipesById = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/get-recipe-byId`, {
        params: { category: categoryId, userId: userInfo._id },
      });
      setRecipeList(response.data); // Set recipes based on selected category
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  // Fetch recipes based on selected category
  const fetchRecipes = async () => {
    try {
      const response = await axiosInstance.get(`/user-recipes`, {
        params: {
          userId: userInfo._id,
          categoryId: selectedCategory, // Filter recipes by selected category
        },
      });
      setRecipeList(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Toggle pin status
  const togglePin = async (recipeId, currentStatus) => {
    try {
      await axiosInstance.post(`/pin-recipe`, {
        userId: userInfo._id,
        recipeId: recipeId,
        isPinned: !currentStatus,
      });

      const updatedRecipes = recipeList.map((recipe) =>
        recipe._id === recipeId
          ? { ...recipe, isPinned: !currentStatus }
          : recipe
      );
      console.log(updatedRecipes);
      setRecipeList(updatedRecipes);
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };

  // Handle category selection and highlight
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // Update selected category
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe
    setIsModalOpen(true); // Open the modal
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="container mx-auto mt-[56px] text-primary p-4">
      {/* Search Box */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 rounded bg-gray-200 text-black"
        />
      </div>

      {/* Recipe Categories */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        <div className="flex gap-4">
          <button
            key="0"
            onClick={() => {
              handleCategorySelect("0");
              fetchRecipes();
            }}
            className={`px-4 py-2 rounded-full text-white ${
              selectedCategory === "0" ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                setSelectedCategory(category._id);
                fetchRecipesById(category._id);
              }}
              className={`px-4 py-2 rounded-full text-white ${
                selectedCategory === category._id
                  ? "bg-blue-500"
                  : "bg-gray-400"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Recipes</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recipeList
            .filter((recipe) => recipe.title.toLowerCase().includes(searchTerm))
            .map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                togglePin={() => togglePin(recipe._id, recipe.isPinned)}
                openModal={() => openModal(recipe)}
              />
            ))}
        </div>
      </section>
      <RecipeModal recipe={selectedRecipe} onClose={closeModal} />
    </div>
  );
}
