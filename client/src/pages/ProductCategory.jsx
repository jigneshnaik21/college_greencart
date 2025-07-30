import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  // Safety check to ensure products is an array
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => product.category.toLowerCase() === category)
    : [];

  return (
    <div className="mt-10">
      <p className="text-2xl md:text-3xl font-medium capitalize">{category}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
