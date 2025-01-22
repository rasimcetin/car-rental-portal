"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    car: {
      brand: string;
      model: string;
      licensePlate: string;
    };
  }
  
  interface TenantUser {
    id: string;
    role: string;
    tenant: {
      id: string;
      name: string;
    };
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenants: TenantUser[];
    bookings: Booking[];
    createdAt: string;
  }

export default  function UserDetail({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const { id } =  params;
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError("Failed to load user details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [id]);
  
    if (loading) {
      return (
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      );
    }
  
    if (error || !user) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">
              {error || "User not found"}
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
          <p className="mt-2 text-sm text-gray-700">
            Detailed information about {user.name}
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 text-sm text-gray-900">{user.name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 text-sm text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <div className="mt-1">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                    {user.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Member Since
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
  
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tenant Associations</h2>
            <div className="space-y-4">
              {user.tenants.map((tu) => (
                <div
                  key={tu.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {tu.tenant.name}
                  </span>
                  <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                    {tu.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
  
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Booking History</h2>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {user.bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                      {booking.car.brand} {booking.car.model}
                      <div className="text-gray-500">
                        {booking.car.licensePlate}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${booking.totalPrice}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }