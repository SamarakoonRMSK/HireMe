import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";


export default function DashboardComp() {
    const { currentUser } = useSelector((state) => state.userSlice);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [comments, setComments] = useState([]);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [totalComments, setTotalComments] = useState(0);



    useEffect(() => {
        const fetchUsers = async () => {
            try {
              const res = await fetch("/api/user/getusers?limit=5");
              const data = await res.json();
              if (res.ok) {
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setLastMonthUsers(data.lastMonthUsers);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
          const fetchPosts = async () => {
            try {
              const res = await fetch("/api/post/getpostsbyadmin?limit=5");
              const data = await res.json();
              if (res.ok) {
                setPosts(data.posts);
                setTotalPosts(data.totalPosts);
                setLastMonthPosts(data.lastMonthPosts);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
          const fetchComments = async () => {
            try {
              const res = await fetch("/api/user/getcustomers?limit=5");
              const data = await res.json();
              if (res.ok) {
                setComments(data.users);
                setTotalComments(data.totalUsers);
                setLastMonthComments(data.lastMonthUsers);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
        
        fetchUsers();
        fetchPosts();
        fetchComments();



    },[currentUser])

    
  return (
    <div className="p-3 w-full">
      <div className=" flex gap-4 justify-center w-full flex-col lg:flex-row">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full lg:flex-1 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Drivers</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full lg:flex-1 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Customers
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full lg:flex-1 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 py-3 w-full ">
        <div className="flex flex-col w-full shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.address}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full  shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent customers</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                      <img
                        src={comment.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{comment.username}</Table.Cell>
                    <Table.Cell>{comment.email}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
      <div className="flex flex-col w-full  shadow-md p-2 rounded-md dark:bg-gray-800">
        <div className="flex justify-between  p-3 text-sm font-semibold">
          <h1 className="text-center p-2">Recent posts</h1>
          <Button outline gradientDuoTone="purpleToPink">
            <Link to={"/dashboard?tab=posts"}>See all</Link>
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>From</Table.HeadCell>
            <Table.HeadCell>To</Table.HeadCell>

            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Vehicle</Table.HeadCell>
          </Table.Head>
          {posts &&
            posts.map((post) => (
              <Table.Body key={post._id} className="divide-y ">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {post.userId}
                  </Table.Cell>
                  <Table.Cell className="">{post.from}</Table.Cell>
                  <Table.Cell className="">{post.to}</Table.Cell>
                  <Table.Cell className="">{post.title}</Table.Cell>
                  <Table.Cell className="">{post.price}</Table.Cell>
                  <Table.Cell className="">{post.vType}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
        </Table>
      </div>
    </div>
  )
}
