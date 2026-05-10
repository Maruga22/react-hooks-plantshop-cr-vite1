import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch plants on component mount
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error("Error fetching plants:", error));
  }, []);

  // Handle adding a new plant
  const handleAddPlant = (newPlant) => {
    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((res) => res.json())
      .then((data) => setPlants([...plants, data]))
      .catch((error) => console.error("Error adding plant:", error));
  };

  // Handle marking plant as sold out
  const handleToggleSoldOut = (id) => {
    const plant = plants.find((p) => p.id === id);
    if (plant) {
      fetch(`http://localhost:6001/plants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ soldOut: !plant.soldOut }),
      })
        .then((res) => res.json())
        .then((updatedPlant) => {
          setPlants(
            plants.map((p) => (p.id === id ? updatedPlant : p))
          );
        })
        .catch((error) => console.error("Error updating plant:", error));
    }
  };

  // Filter plants based on search query
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search onSearch={setSearchQuery} />
      <PlantList
        plants={filteredPlants}
        onToggleSoldOut={handleToggleSoldOut}
      />
    </main>
  );
}

export default PlantPage;
