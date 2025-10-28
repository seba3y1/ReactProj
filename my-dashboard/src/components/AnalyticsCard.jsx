import { useQuery } from "@tanstack/react-query";

async function fetchData() {
  const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
  const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts");
  const todosRes = await fetch("https://jsonplaceholder.typicode.com/todos");

  const users = await usersRes.json();
  const posts = await postsRes.json();
  const todos = await todosRes.json();

  return { users, posts, todos };
}

function groupBy(array, key) {
  return array.reduce((acc, obj) => {
    const value = obj[key];
    acc[value] = acc[value] || [];
    acc[value].push(obj);
    return acc;
  }, {});
}

export default function AnalyticsCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchData,
  });

  if (isLoading)
    return (
      <div className="bg-white p-5 rounded-xl shadow-md">Loading analytics...</div>
    );

  if (error)
    return (
      <div className="bg-white p-5 rounded-xl shadow-md text-red-500">
        Failed to load analytics.
      </div>
    );

  const { users, posts, todos } = data;

  const postCount = groupBy(posts, "userId");
  const todoCount = groupBy(todos, "userId");

  const mostPostsUser = users.reduce((a, b) =>
    (postCount[a.id]?.length || 0) > (postCount[b.id]?.length || 0) ? a : b
  );
  const fewestPostsUser = users.reduce((a, b) =>
    (postCount[a.id]?.length || 0) < (postCount[b.id]?.length || 0) ? a : b
  );

  const mostCompletedTodosUser = users.reduce((a, b) =>
    (todoCount[a.id]?.filter((t) => t.completed).length || 0) >
    (todoCount[b.id]?.filter((t) => t.completed).length || 0)
      ? a
      : b
  );
  const fewestCompletedTodosUser = users.reduce((a, b) =>
    (todoCount[a.id]?.filter((t) => t.completed).length || 0) <
    (todoCount[b.id]?.filter((t) => t.completed).length || 0)
      ? a
      : b
  );

 return (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
       Simple Analytics
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center hover:shadow-sm transition">
        <p className="text-sm text-gray-600 font-medium">Total Users</p>
        <p className="text-2xl font-bold text-blue-600">{users.length}</p>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center hover:shadow-sm transition">
        <p className="text-sm text-gray-600 font-medium">Most Posts</p>
        <p className="text-lg font-semibold text-gray-800">
          {mostPostsUser.name}
        </p>
        <p className="text-green-600 text-sm">
          {postCount[mostPostsUser.id]?.length} posts
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center hover:shadow-sm transition">
        <p className="text-sm text-gray-600 font-medium">Fewest Posts</p>
        <p className="text-lg font-semibold text-gray-800">
          {fewestPostsUser.name}
        </p>
        <p className="text-amber-600 text-sm">
          {postCount[fewestPostsUser.id]?.length} posts
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center hover:shadow-sm transition">
        <p className="text-sm text-gray-600 font-medium">
          Most Completed Todos
        </p>
        <p className="text-lg font-semibold text-gray-800">
          {mostCompletedTodosUser.name}
        </p>
        <p className="text-emerald-600 text-sm">
          {
            todoCount[mostCompletedTodosUser.id]?.filter((t) => t.completed)
              .length
          }{" "}
          done
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center hover:shadow-sm transition">
        <p className="text-sm text-gray-600 font-medium">
          Fewest Completed Todos
        </p>
        <p className="text-lg font-semibold text-gray-800">
          {fewestCompletedTodosUser.name}
        </p>
        <p className="text-rose-600 text-sm">
          {
            todoCount[fewestCompletedTodosUser.id]?.filter((t) => t.completed)
              .length
          }{" "}
          done
        </p>
      </div>
    </div>
  </div>
);
}