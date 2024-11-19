import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashVerify() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [drivers, setDrivers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const feachUsers = async () => {
      try {
        const res = await fetch("/api/user/alldrivers");
        const data = await res.json();

        if (res.ok) {
          setDrivers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser && currentUser.role === "admin") {
      feachUsers();
    }
  }, [currentUser._id]);

  const handleVerify = async () => {
    try {
      const res = await fetch(`/api/user/verifydriver/${updateUser.id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setDrivers((drivers) =>
          drivers.map((driver) =>
            driver._id === updateUser.id
              ? { ...driver, isVerify: true }
              : driver
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:w-full md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser && drivers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md ">
            <Table.Head>
              <Table.HeadCell>Profile</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>Licence Number</Table.HeadCell>

              <Table.HeadCell>Verify</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            {drivers.map((driver) => (
              <Table.Body key={driver._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      className="rounded-full object-cover w-10 h-10"
                      src={driver.profilePicture}
                    />
                  </Table.Cell>

                  <Table.Cell>{driver.email}</Table.Cell>
                  <Table.Cell>{driver.username}</Table.Cell>
                  <Table.Cell>{driver.licenceNumber}</Table.Cell>
                  <Table.Cell>
                    {driver.isVerify ? "Verified" : "Not Verified"}
                  </Table.Cell>

                  <Table.Cell>
                    <Button
                      disabled={driver.isVerify}
                      onClick={() => {
                        setUpdateUser({
                          id: driver._id,
                          image: driver.policeReport,
                        });
                        setOpenModal(true);
                      }}
                    >
                      Verify
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no Hires</p>
      )}
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Verify Driver({updateUser?.id})</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <img src={updateUser?.image} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpenModal(false);
              handleVerify();
            }}
          >
            I accept
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
