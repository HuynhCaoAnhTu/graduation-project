import React, { useEffect, useState } from "react";

import RecipeCard from "../../components/meals/Recipecard";
import { useMainContext } from "../../../context/UserContext";
import axiosInstance from "../../utills/axiosInstance";
import RecipeModal from "../../components/meals/RecipeModal";

export default function MyRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useMainContext();

  // Fetch recipes based on selected category
  const fetchMyRecipes = async () => {
    try {
      const response = await axiosInstance.get(`/pinned-recipes`, {
        params: {
          userId: userInfo._id,
        },
      });
      setRecipeList(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  useEffect(() => {
    fetchMyRecipes();
  }, [recipeList]);

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

      {/* Recipes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">My pined recipe</h2>
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
