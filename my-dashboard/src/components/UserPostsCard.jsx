import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function fetchPosts(userId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function fetchTodos(userId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
  );
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export default function UserPostsCard() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [localTodos, setLocalTodos] = useState({}); 

  const {
    data: posts,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useQuery({
    queryKey: ["posts", selectedUser?.id],
    queryFn: () => fetchPosts(selectedUser.id),
    enabled: !!selectedUser,
  });

  const {
    data: todos,
    isLoading: todosLoading,
    isFetching: todosFetching,
  } = useQuery({
    queryKey: ["todos", selectedUser?.id],
    queryFn: () => fetchTodos(selectedUser.id),
    enabled: !!selectedUser,
  });

  const toggleTodo = (id) => {
    setLocalTodos((prev) => {
      const userId = selectedUser.id;
      const userTodos = prev[userId] || {};
      return {
        ...prev,
        [userId]: {
          ...userTodos,
          [id]: !userTodos[id],
        },
      };
    });
  };

  if (isLoading)
    return (
      <div className="bg-white p-5 rounded-xl shadow-md">
        <p>Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-5 rounded-xl shadow-md text-red-500">
        Failed to load users.
      </div>
    );

  return (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
      User & Posts Manager
    </h2>

    {!selectedUser ? (
      <ul className="space-y-2">
        {users?.map((u) => (
          <li
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className="cursor-pointer bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-all p-2 rounded-lg text-sm font-medium border border-transparent hover:border-blue-200"
          >
            {u.name}
          </li>
        ))}
      </ul>
    ) : (
      <div>
        <button
          className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
          onClick={() => setSelectedUser(null)}
        >
          ← Back to users
        </button>

        <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
          <h3 className="text-md font-semibold text-gray-800">{selectedUser.name}</h3>
          <p className="text-sm text-gray-600">{selectedUser.email}</p>
        </div>

        <h4 className="font-semibold text-gray-700 mt-4 mb-2">📜 Posts</h4>
        {postsLoading || postsFetching ? (
          <p className="text-sm text-gray-500">Loading posts...</p>
        ) : (
          <ul className="text-sm list-disc ml-5 space-y-1 text-gray-700">
            {posts?.slice(0, 5).map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ul>
        )}

        <h4 className="font-semibold text-gray-700 mt-5 mb-2">✅ Todos</h4>
        {todosLoading || todosFetching ? (
          <p className="text-sm text-gray-500">Loading todos...</p>
        ) : (
          <ul className="text-sm space-y-1">
            {todos?.map((t) => {
              const userOverrides = localTodos[selectedUser.id] || {};
              const completed = userOverrides[t.id] ?? t.completed;

              return (
                <li
                  key={t.id}
                  onClick={() => toggleTodo(t.id)}
                  className={`cursor-pointer transition-all p-1.5 rounded ${
                    completed
                      ? "text-green-600 line-through bg-green-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {t.title}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    )}
  </div>
);
}
