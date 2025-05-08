import { Button, Checkbox, Rating, RatingStar, Select, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AllDrivers() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [showMore, setShowMore] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    vType: "",
    sort: "desc",
    isOnline: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("vType", sidebarData.vType);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("isOnline", sidebarData.isOnline);
    urlParams.set("search", sidebarData.search);
    const searchQuery = urlParams.toString();
    navigate(`/drivers?${searchQuery}`);
  };

  const handleChange = (e) => {
    if (e.target.id === "vType") {
      setSidebarData({ ...sidebarData, vType: e.target.value });
    }
    if (e.target.id === "search") {
      setSidebarData({ ...sidebarData, search: e.target.value });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSidebarData({ ...sidebarData, isOnline: true });
    } else {
      setSidebarData({ ...sidebarData, isOnline: false });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("vType");
    const sortFromUrl = urlParams.get("sort");
    const rateFormUrl = urlParams.get("rate");
    const searchFormUrl = urlParams.get("search");
    if (searchTermFromUrl || sortFromUrl || rateFormUrl || searchFormUrl) {
      setSidebarData({
        ...sidebarData,
        vType: searchTermFromUrl,
        sort: sortFromUrl,
        rate: rateFormUrl,
        search:searchFormUrl
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/user/getusers?${searchQuery}`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({location :currentUser.location})
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers);
        setLoading(false);
        if (data.drivers.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfPosts = drivers.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/user/getusers?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...drivers, ...data.users]);
      if (data.users.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  console.log(drivers);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Name or Email:
            </label>
            <TextInput
              placeholder="Vehicle Type"
              id="search"
              type="text"
              value={sidebarData.search}
              onChange={handleChange}
            />
          </div>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Vehicle Type:
            </label>
            <TextInput
              placeholder="Vehicle Type"
              id="vType"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort ?? ""}
              id="sort"
            >
              <option value="desc">Latest</option>
              <option value="distance">Distance</option>
              <option value="rate">Rating</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Online Drivers:</label>
            <Checkbox id="rate" onChange={handleCheckboxChange} />
          </div>

          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="table-auto overflow-x-scroll md:w-full md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser ? (
          <>
            <Table hoverable className="shadow-md ">
              <Table.Head>
                <Table.HeadCell>Date Join</Table.HeadCell>
                <Table.HeadCell>Driver Image</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Distance</Table.HeadCell>
                <Table.HeadCell>Rating</Table.HeadCell>
                <Table.HeadCell>Message</Table.HeadCell>
                <Table.HeadCell>Hire</Table.HeadCell>
              </Table.Head>
              {drivers.map((driver) => (
                <Table.Body key={driver._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/driver/${driver._id}`}>
                        <img
                          src={driver.profilePicture}
                          alt="driver"
                          className="w-16 h-16 object-cover rounded-full  bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>

                    <Table.Cell>{driver.fullName}</Table.Cell>
                    <Table.Cell>{(driver.distance/1000).toFixed(2)} Km</Table.Cell>
                    <Table.Cell>
                      <Rating>
                        <RatingStar />
                        <p className="ml-2  font-semibold  dark:text-white">{(driver.avgRate || 0).toFixed(2)}</p>
                      </Rating>
                      </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/message?id=${driver._id}`}
                      >
                        <span className="font-semibold">Message</span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="text-red-600 hover:underline" to={`/hire/${driver._id}`}>
                        <span className="font-semibold">Hire</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>No drivers</p>
        )}
      </div>
    </div>
  );
}
