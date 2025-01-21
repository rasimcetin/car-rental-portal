import Car from "@/interfaces/Car";
import Image from "next/image";
import { useState } from "react";

export default function CarCard({ car }: { car: Car }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const getCarImageUrl = (brand: string, model: string) => {
    const formattedBrand = brand.toLowerCase().replace(/\s+/g, "-");
    const formattedModel = model.toLowerCase().replace(/\s+/g, "-");
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${formattedBrand}&modelFamily=${formattedModel}&zoomType=fullscreen`;
  };

  const handleCardClick = () => {
    window.location.href = `/dashboard/cars/${car.id}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative h-52">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={getCarImageUrl(car.brand, car.model)}
          alt={`${car.brand} ${car.model}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoadingComplete={() => setIsImageLoading(false)}
        />
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              car.available
                ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                : "bg-red-100 text-red-800 group-hover:bg-red-200"
            }`}
          >
            {car.available ? "Available" : "Not Available"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span>{car.year}</span>
              <span>•</span>
              <span className="inline-flex items-center">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: car.color.toLowerCase() }}></span>
                {car.color}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ${car.dailyRate.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">License Plate</p>
            <p className="font-medium text-gray-900">{car.licensePlate}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Tenant</p>
            <p className="font-medium text-gray-900 truncate" title={car.tenant.name}>
              {car.tenant.name}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
