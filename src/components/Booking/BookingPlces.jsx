import React, { useEffect, useState } from "react";
import AccountNav from "../Account/AccountNav";
import * as api from "../../api/requester";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import French locale
import { BsCalendarDate } from "react-icons/bs";
import { AiOutlineCreditCard } from "react-icons/ai";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const URL_TO_UPLOADS =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/uploads/"
    : "https://spanode.onrender.com/uploads/";

function BookingPlaces() {
  // State Management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.getBookings();
        setBookings(response);
        setFilteredBookings(response); // Initialize filteredBookings with all bookings
        console.log("response",response);
        
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false); // Always stop loading spinner
      }
    };

    fetchBookings();
  }, []);

  // Handle search input
  const handleSearchInputChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchInput(searchTerm); // Update search input state
  
    const searchTerms = searchTerm.split(" ").filter(Boolean); // Split by space and remove empty terms
  
    // Filter bookings based on search input
    const filtered = bookings.filter((booking) =>
      searchTerms.every((term) =>
        booking.name.toLowerCase().includes(term) || 
        booking.familyName.toLowerCase().includes(term)
      )
    );
  
    setFilteredBookings(filtered);
  };
  
  

  // Remove booking by ID
  const removeBooking = async (id) => {
    try {
      await api.deleteBooking(id);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      setFilteredBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error("Error removing booking:", error);
    }
  };

  // Loading spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <ClipLoader className="mb-4" />
        <span>Loading...</span>
      </div>
    );
  }

  // No bookings message
  if (bookings.length === 0) {
    return (
      <div>
        <AccountNav />
        <div className="flex justify-center">
          <h1 className="text-2xl font-semibold mt-12">
            There are no bookings yet.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-global mx-auto">
      <AccountNav />
      {/* Search bar */}
      <div className="wrapper mt-4">
        <div className="search-input">
          <input
            className="search-input-placeholder"
            type="text"
            placeholder="Type to search..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Booking cards */}
      <div className="mt-12 mb-12 relative">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((place) => (
            <Link
              to={
                place.place === null
                  ? "/account/bookings"
                  : `/account/BookingDetails/${place._id}`
              }
              key={place._id}
              className="flex flex-col items-center md:flex-row gap-4 mt-4 bg-gray-100 rounded-2xl hover:shadow-md shadow-black transition duration-300 ease-in-out"
            >
              {/* Image */}
              {place.idPhotos ? (
                <div className="flex max-w-full h-46 md:max-w-[320px] md:h-44 bg-gray-300 shrink-0 rounded-tr-2xl rounded-tl-2xl md:rounded-tr-2xl md:rounded-tl-2xl md:rounded-2xl">
                  <img
                    className="rounded-tl-2xl md:aspect-square md:w-[240px] lg:w-[280px] rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl md:rounded-tl-2xl"
                    src={URL_TO_UPLOADS + place.idPhotos?.[0]}
                    alt={`${place.name}`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center mx-auto py-8 px-4">
                  <h2 className="text-xl font-semibold mb-1">
                    Something went wrong.
                  </h2>
                  <p className="text-center text-gray-500">
                    The owner might have deleted this place. Try again later or
                    contact us.
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-4 px-4 pb-6 mt-3 text-sm md:text-base ">
                <h1 className="text-xl font-semibold">
                  {place.name} {place.familyName}
                </h1>
                <div className="flex flex-row items-center text-gray-500">
                  <p className="mr-3">{place.place.title}</p>
             
                  <BsCalendarDate className="mr-1" />
                  <p className="mr-2">
                    {format(new Date(place.checkIn), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                  <p className="mr-3">{place.option}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <AiOutlineCreditCard size={26} />
                  <p className="font-semibold text-lg">
                  Prix Total: {place.total} €
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex justify-center">
            <h1 className="text-2xl font-semibold mt-12">No results found.</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPlaces;
