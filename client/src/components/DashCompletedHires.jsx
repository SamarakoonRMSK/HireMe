import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashCompletedHires() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [userHires, setUserHires] = useState([]);

  const getDurationText = (days, hours) => {
    const dayText = days ? `${days} day${days > 1 ? 's' : ''}` : '';
    const hourText = hours ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    return [dayText, hourText].filter(Boolean).join(' and ');
  };

  useEffect(() => {
    const fetchHires = async () => {
      try {
        const res = await fetch(
          `/api/hire/get-complete-hires/${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserHires(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser && currentUser.role === "customer") {
      fetchHires();
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:w-full md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser && userHires.length > 0 ? (
        <>
          <Table hoverable className="shadow-md ">
            <Table.Head>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>From</Table.HeadCell>
              <Table.HeadCell>To</Table.HeadCell>
              <Table.HeadCell>Duration</Table.HeadCell>
              <Table.HeadCell>Vehicle Type</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Rate</Table.HeadCell>
            </Table.Head>
            {userHires.map((hire) => (
              <Table.Body key={hire._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{hire.status}</Table.Cell>

                  <Table.Cell>{hire.from}</Table.Cell>
                  <Table.Cell>{hire.to}</Table.Cell>
                  <Table.Cell>{getDurationText(hire.hiringDays, hire.hiringHours)}</Table.Cell>
                  <Table.Cell>{hire.vType}</Table.Cell>
                  <Table.Cell>Rs. {hire.price.toLocaleString()}</Table.Cell>
                  <Table.Cell>{hire.rate}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no hires</p>
      )}
    </div>
  );
}
