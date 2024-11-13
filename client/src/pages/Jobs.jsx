import { Button, Checkbox, Select, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Jobs() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({});

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSidebarData({ ...sidebarData, return: true });
    } else {
      setSidebarData({ ...sidebarData, return: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("vType", sidebarData.vType || "");
    urlParams.set("from", sidebarData.from || "");
    urlParams.set("to", sidebarData.to || "");
    urlParams.set("duration", sidebarData.duration || "");
    urlParams.set("return", sidebarData.return || "");
    urlParams.set("price", sidebarData.price || "");

    navigate(`/jobs?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const vType = urlParams.get("vType");
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    const duration = urlParams.get("duration");
    const isReturn = urlParams.get("return");
    const price = urlParams.get("price");

    if (vType || from || to || duration || price || isReturn) {
      setSidebarData({
        ...sidebarData,
        vType,
        from,
        return: isReturn === "true",
        to,
        duration,
        price,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/post/getjobs?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex justify-between  items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Vehicle Type:
            </label>
            <TextInput
              placeholder="Vehicle Type"
              id="vType"
              type="text"
              value={sidebarData.vType || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between  items-center gap-2">
            <label className="whitespace-nowrap font-semibold">From:</label>
            <TextInput
              placeholder="From"
              id="from"
              type="text"
              value={sidebarData.from || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex  justify-between items-center gap-2">
            <label className="whitespace-nowrap font-semibold">To:</label>
            <TextInput
              placeholder="To"
              id="to"
              type="text"
              value={sidebarData.to || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between  items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Duration:</label>
            <TextInput
              placeholder="Duration"
              id="duration"
              type="number"
              min={0}
              value={sidebarData.duration || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex  justify-between items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Amount:</label>
            <TextInput
              placeholder="Amount"
              id="price"
              type="number"
              min={0}
              value={sidebarData.price || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="whitespace-nowrap font-semibold">Return:</label>
            <Checkbox
              id="return"
              onChange={handleCheckboxChange}
              checked={sidebarData.return || false}
              defaultChecked={sidebarData.return}
            />
          </div>

          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="table-auto overflow-x-scroll md:w-full md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser && jobs.length > 0 ? (
          <>
            <Table hoverable className="shadow-md ">
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>From</Table.HeadCell>
                <Table.HeadCell>To</Table.HeadCell>
                <Table.HeadCell>Duration</Table.HeadCell>
                <Table.HeadCell>Vehicle Type</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
              </Table.Head>
              {jobs.map((job) => (
                <Table.Body key={job._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link to={`/vacancy/${job._id}`}>{job.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{job.from}</Table.Cell>

                    <Table.Cell>{job.to}</Table.Cell>
                    <Table.Cell>{job.duration}</Table.Cell>
                    <Table.Cell>{job.vType}</Table.Cell>
                    <Table.Cell>{job.price}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        ) : (
          <p>No jobs</p>
        )}
      </div>
    </div>
  );
}
