import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "todoItems";

const ToDoList: React.FC = () => {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<
    Array<{
      name: string;
      dueDate: string;
      description: string;
      status: string;
    }>
  >(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dueDate) {
      alert("Please provide both a name and a due date for the to-do item.");
      return;
    }
    const newItem = {
      name,
      dueDate,
      description,
      status: "incomplete",
    };
    setItems([...items, newItem]);
    setName("");
    setDueDate("");
    setDescription("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mr-2">To Do</h1>
        <span className="text-2xl text-gray-400">{items.length}</span>
      </div>
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-4 items-start">
          {/* Left column: inputs (80%) */}
          <div className="flex flex-col flex-grow w-5/6 gap-4">
            <div className="flex flex-row gap-4">
              <input
                type="text"
                placeholder="Task Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Right column: button (20%) */}
          <div className="flex flex-col w-1/6 justify-start items-end">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full flex items-center justify-center gap-2"
              style={{ minWidth: "90px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Split Incomplete Tasks: Overdue & Outstanding */}
      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mr-2">Overdue</h2>
          <span className="text-xl text-gray-400">
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const overdue = items.filter(
                (item) =>
                  item.status === "incomplete" && new Date(item.dueDate) < today
              );
              return overdue.length;
            })()}
          </span>
        </div>
        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const overdue = items.filter(
            (item) =>
              item.status === "incomplete" && new Date(item.dueDate) < today
          );
          return overdue.length === 0 ? (
            <p className="text-gray-500">No overdue tasks.</p>
          ) : (
            <ul className="space-y-4">
              {overdue.map((item, idx) => (
                <li key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={false}
                        className="form-checkbox h-4 w-4 accent-purple-500"
                        onChange={() => {
                          const originalIdx = items.findIndex(
                            (i) =>
                              i.name === item.name &&
                              i.dueDate === item.dueDate &&
                              i.description === item.description &&
                              i.status === item.status
                          );
                          if (originalIdx !== -1) {
                            const updated = [...items];
                            updated[originalIdx] = {
                              ...item,
                              status: "complete",
                            };
                            setItems(updated);
                          }
                        }}
                      />
                      <div className="ml-1">
                        <span className="font-bold text-gray-800">
                          {item.name}
                        </span>
                        <div className="mb-2 text-gray-700">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-red-500">
                      {new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>

      <div className="mt-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mr-2">
            Outstanding
          </h2>
          <span className="text-xl text-gray-400">
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const outstanding = items.filter(
                (item) =>
                  item.status === "incomplete" &&
                  new Date(item.dueDate) >= today
              );
              return outstanding.length;
            })()}
          </span>
        </div>

        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const outstanding = items.filter(
            (item) =>
              item.status === "incomplete" && new Date(item.dueDate) >= today
          );
          return outstanding.length === 0 ? (
            <p className="text-gray-500">No outstanding tasks.</p>
          ) : (
            <ul className="space-y-4">
              {outstanding.map((item, idx) => (
                <li key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={false}
                        className="form-checkbox h-4 w-4 accent-purple-500"
                        onChange={() => {
                          const originalIdx = items.findIndex(
                            (i) =>
                              i.name === item.name &&
                              i.dueDate === item.dueDate &&
                              i.description === item.description &&
                              i.status === item.status
                          );
                          if (originalIdx !== -1) {
                            const updated = [...items];
                            updated[originalIdx] = {
                              ...item,
                              status: "complete",
                            };
                            setItems(updated);
                          }
                        }}
                      />
                      <div className="ml-1">
                        <span className="font-bold text-gray-800">
                          {item.name}
                        </span>
                        <div className="mb-2 text-gray-700">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>

      {/* Complete Section */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mr-2">Complete</h2>
          <span className="text-xl text-gray-400">
            {items.filter((item) => item.status === "complete").length}
          </span>
        </div>
        {items.filter((item) => item.status === "complete").length === 0 ? (
          <p className="text-gray-500">No completed items yet.</p>
        ) : (
          <ul className="space-y-4">
            {items
              .filter((item) => item.status === "complete")
              .map((item, idx) => (
                <li key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        className="form-checkbox h-4 w-4 accent-purple-500"
                        onChange={() => {
                          const originalIdx = items.findIndex(
                            (i) =>
                              i.name === item.name &&
                              i.dueDate === item.dueDate &&
                              i.description === item.description &&
                              i.status === item.status
                          );
                          if (originalIdx !== -1) {
                            const updated = [...items];
                            updated[originalIdx] = {
                              ...item,
                              status: "incomplete",
                            };
                            setItems(updated);
                          }
                        }}
                      />
                      <div className="ml-1">
                        <span className="font-bold text-gray-800">
                          {item.name}
                        </span>
                        <div className="mb-2 text-gray-700">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
