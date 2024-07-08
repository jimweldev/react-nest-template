import { privateInstance } from "@/axios/interceptor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const AdminPage = () => {
  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery({
    queryKey: ["users/paginate"],
    queryFn: () =>
      privateInstance.get("/api/users/paginate").then((res) => res.data),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (errorUsers) return <p>Error</p>;

  return (
    <div>
      <h1>Admin Page</h1>
      {!isLoadingUsers &&
        dataUsers.records.map((user: any) => {
          return <p key={user.id}>{user.username}</p>;
        })}
    </div>
  );
};

export default AdminPage;
