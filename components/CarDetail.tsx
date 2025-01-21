"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRightIcon, CalendarIcon, CurrencyDollarIcon, KeyIcon, TagIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExclamationTriangleIcon, ChevronLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import Car from "@/interfaces/Car";

export default function CarDetail({ id }: { id: string }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car");
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError("Failed to load car details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days > 0) {
        setTotalPrice(days * car.dailyRate);
      } else {
        setTotalPrice(0);
      }
    }
  }, [car, startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !startDate || !endDate) return;

    setIsBooking(true);
    setBookingError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create booking");
      }

      setBookingSuccess(true);
      setCar({ ...car, available: false });
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Failed to create booking"
      );
    } finally {
      setIsBooking(false);
    }
  };

  const getCarImageUrl = (brand: string, model: string) => {
    const formattedBrand = brand.toLowerCase().replace(/\s+/g, "-");
    const formattedModel = model.toLowerCase().replace(/\s+/g, "-");
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${formattedBrand}&modelFamily=${formattedModel}&zoomType=fullscreen`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
          <div className="mt-8 space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="rounded-2xl bg-red-50 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Car Details</h3>
          <p className="text-red-700">{error || "Car not found"}</p>
          <Link href="/cars" className="mt-4 inline-flex items-center text-red-600 hover:text-red-800">
            <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  const carFeatures = [
    { icon: CalendarIcon, label: "Year", value: car.year },
    { icon: TagIcon, label: "Color", value: car.color },
    { icon: KeyIcon, label: "License", value: car.licensePlate },
    { icon: CurrencyDollarIcon, label: "Daily Rate", value: `$${car.dailyRate.toLocaleString()}` },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link href="/cars" className="hover:text-gray-700">Cars</Link></li>
          <li><ChevronRightIcon className="w-4 h-4" /></li>
          <li className="text-gray-900 font-medium">{car.brand} {car.model}</li>
        </ol>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Image Gallery Section */}
        <div className="relative h-[500px] group">
          <Image
            src={getCarImageUrl(car.brand, car.model)}
            alt={`${car.brand} ${car.model}`}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? "scale-100" : "scale-105 blur-sm"
            } group-hover:scale-110`}
            onLoadingComplete={() => setImageLoaded(true)}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-8 left-8 text-white"
          >
            <h1 className="text-5xl font-bold tracking-tight">
              {car.brand} {car.model}
            </h1>
            <p className="mt-3 text-xl opacity-90">
              {car.year} • {car.color}
            </p>
          </motion.div>
          <div className="absolute top-8 right-8">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                car.available
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {car.available ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Available Now
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                  Currently Rented
                </>
              )}
            </motion.span>
          </div>
        </div>

        <div className="p-8">
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {carFeatures.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                onMouseEnter={() => setHoveredFeature(feature.label)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  hoveredFeature === feature.label
                    ? "bg-blue-50 scale-105"
                    : "bg-gray-50 hover:bg-blue-50"
                }`}
              >
                <feature.icon className="w-6 h-6 text-blue-600 mb-2" />
                <dt className="text-sm font-medium text-gray-500">{feature.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{feature.value}</dd>
              </motion.div>
            ))}
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Rental Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        required
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        required
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {totalPrice > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-gray-50 p-6 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Daily Rate</span>
                      <span>${car.dailyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Number of Days</span>
                      <span>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium">Total Price</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {bookingError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
                  >
                    {bookingError}
                  </motion.div>
                )}

                {bookingSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg bg-green-50 p-6 text-center"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <CheckIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">Booking Successful!</h3>
                    <p className="text-green-700">We'll contact you shortly with further details.</p>
                  </motion.div>
                ) : (
                  <button
                    type="submit"
                    disabled={!car.available || isBooking || !startDate || !endDate}
                    className={`w-full py-4 px-6 rounded-lg text-white font-medium transition-all duration-300
                      ${
                        car.available && !isBooking && startDate && endDate
                          ? 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          : 'bg-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isBooking ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : (
                      'Book Now'
                    )}
                  </button>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Important Information</h2>
              <div className="bg-yellow-50 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-yellow-800">Rental Policy</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-2">
                  <li>Valid driver's license required</li>
                  <li>Minimum age requirement: 21 years</li>
                  <li>Security deposit required</li>
                  <li>Full insurance coverage included</li>
                  <li>24/7 roadside assistance</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
