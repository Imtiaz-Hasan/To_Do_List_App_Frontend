"use client";

import { useState, useEffect } from "react";
import CreateButton from "@/components/buttons/CreateButton";
import EditButton from "@/components/buttons/EditButton";
import DeleteButton from "@/components/buttons/DeleteButton";
import CompleteButton from "@/components/buttons/CompleteButton";
import UploadProfilePictureDialog from "@/components/dialogs/UploadProfilePictureDialog";
import CreateTaskDialog from "@/components/dialogs/CreateTaskDialog";
import EditTaskDialog from "@/components/dialogs/EditTaskDialog";
import { IconUser } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	// State management for tasks, UI controls, and user profile
	// Controls loading state during data fetching
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState([]);
	const [currentTab, setCurrentTab] = useState("current");
	const [showDropdown, setShowDropdown] = useState(false);
	const [showUploadDialog, setShowUploadDialog] = useState(false);
	const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
	const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [profileName, setProfileName] = useState("User");
	const [profileImageUrl, setProfileImageUrl] = useState(null);

	const router = useRouter();

	// Fetch tasks from the API and format the response data
	// Retrieves task list from backend and formats dates for display
	const fetchTasks = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("No token found");
				return;
			}

			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}

			const data = await response.json();

			const formatted = data.map((task) => ({
				id: task.id,
				name: task.name,
				createdDate: new Date(task.created_date).toLocaleDateString(),
				completionDate: task.completion_date ? new Date(task.completion_date).toLocaleDateString() : "",
				is_completed: task.is_completed,
			}));

			setTasks(formatted);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	// Fetch user profile information from the API
	// Retrieves user name and profile picture URL
	const fetchProfileInfo = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/profile", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
        handleLogout();
				throw new Error("Failed to fetch profile info");
			}

			const data = await response.json();
			setProfileName(data.name);
			setProfileImageUrl(data.image);
		} catch (error) {
			console.error("Error fetching profile info:", error);
		}
	};

	// Initialize data and check authentication on component mount
	// Verifies token and loads initial data
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
		} else {
      fetchTasks();
			fetchProfileInfo();
      setIsLoading(false);
		}
	}, []);

	// Handle profile picture upload and update UI
	// Uploads image file and updates profile picture URL
	const handleUploadProfilePicture = async (file) => {
		try {
			const token = localStorage.getItem("token");
			const formData = new FormData();
			formData.append("image", file);

			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/upload-profile-picture", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload profile picture");
			}

			const data = await response.json();
			setProfileImageUrl(`${data.image_url}`);

			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: data.status === "success" ? "success" : "error",
				title: data.message,
			});
		} catch (error) {
			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: "error",
				title: error.message || "Upload failed",
			});
		}
	};

	// Mark a task as complete and update the task list
	// Sends completion request to backend and refreshes task list
	const handleComplete = async (taskId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				const Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				});
				Toast.fire({
					icon: "error",
					title: "Not authenticated!",
				});
				return;
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/complete`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to mark task as complete");
			}

			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: "success",
				title: "Task marked as complete!",
			});

			// Refresh task list
			fetchTasks();
		} catch (err) {
			console.error("Error marking task complete:", err);
			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: "error",
				title: err.message || "Error marking task complete",
			});
		}
	};

	// Open edit dialog with selected task data
	// Prepares task data for editing in dialog
	const handleEdit = (taskId) => {
		const task = tasks.find((t) => t.id === taskId);
		if (task) {
			setSelectedTask(task);
			setShowEditTaskDialog(true);
		}
	};

	// Delete a task and update the task list
	// Removes task from backend and refreshes task list
	const handleDelete = async (taskId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				const Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				});
				Toast.fire({
					icon: "error",
					title: "Not authenticated!",
				});
				return;
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to delete task");
			}

			fetchTasks();

			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: "success",
				title: "Task deleted successfully!",
			});
		} catch (err) {
			console.error("Error deleting task:", err);
			const Toast = Swal.mixin({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			Toast.fire({
				icon: "error",
				title: err.message || "Failed to delete task",
			});
		}
	};

	// Clear authentication and redirect to login page
	// Removes token and navigates to login
	const handleLogout = () => {
		localStorage.removeItem("token"); // Clear token or any other stored auth data
		router.push("/login"); // Redirect to login page
	};

	// Render dashboard UI with conditional loading state
	// Shows loading state or main dashboard interface
	return (
		<>
			{isLoading ? (
				<div></div>
			) : (
				<div className="min-h-screen bg-gray-50 p-4">
					<div className="max-w-6xl mx-auto">
						{/* Header */}
						<div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
							<h1 className="text-xl font-semibold">Hi, {profileName}</h1>
							<div className="relative">
								<button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setShowDropdown(!showDropdown)}>
									{profileImageUrl ? <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <IconUser stroke={2} />}
								</button>

								{showDropdown && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
										<button
											className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
											onClick={() => {
												setShowUploadDialog(true);
												setShowDropdown(false);
											}}>
											<i className="ti ti-upload mr-2" />
											Upload Profile Picture
										</button>
										<button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center" onClick={handleLogout}>
											<i className="ti ti-logout mr-2" />
											Logout
										</button>
									</div>
								)}
							</div>
						</div>
						<UploadProfilePictureDialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} onUpload={handleUploadProfilePicture} />

						<CreateTaskDialog
							open={showCreateTaskDialog}
							onClose={() => setShowCreateTaskDialog(false)}
							onSubmit={async (taskName, creationDate, completionDate) => {
								try {
									const token = localStorage.getItem("token");
									if (!token) {
										const Toast = Swal.mixin({
											toast: true,
											position: "top-end",
											showConfirmButton: false,
											timer: 3000,
											timerProgressBar: true,
										});
										Toast.fire({
											icon: "error",
											title: "Not authenticated!",
										});
										return;
									}

									const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify({
											name: taskName,
											created_date: creationDate.toISOString(),
											completion_date: completionDate.toISOString(),
										}),
									});

									if (!response.ok) {
										const err = await response.json();
										throw new Error(err.message || "Failed to create task");
									}

									// 👇 Automatically reload tasks
									fetchTasks();
								} catch (err) {
									console.error("Error creating task:", err);
									alert(err.message || "Task creation failed.");
								}
							}}
						/>

						<EditTaskDialog
							open={showEditTaskDialog}
							onClose={() => {
								setShowEditTaskDialog(false);
								setSelectedTask(null);
							}}
							onSubmit={async (taskName, creationDate, completionDate) => {
								if (!selectedTask) return;

								try {
									const token = localStorage.getItem("token");

									const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${selectedTask.id}`, {
										method: "PUT",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify({
											name: taskName,
											created_date: creationDate.toISOString(),
											completion_date: completionDate.toISOString(),
										}),
									});

									if (!response.ok) {
										const errorData = await response.json();
										throw new Error(errorData.message || "Failed to update task");
									}

									// Reload task list
									fetchTasks();

									setShowEditTaskDialog(false);
									setSelectedTask(null);
								} catch (error) {
									console.error("Error updating task:", error);
									alert(error.message || "Error updating task");
								}
							}}
							task={
								selectedTask
									? {
											name: selectedTask.name,
											creationDate: new Date(selectedTask.createdDate),
											completionDate: new Date(selectedTask.completionDate),
									  }
									: undefined
							}
						/>

						{/* Task Tabs */}
						<div className="bg-white rounded-lg shadow mb-6">
							<div className="border-b border-gray-200">
								<nav className="flex justify-between items-center px-4" aria-label="Tabs">
									<div className="flex space-x-4">
										<button className={`px-3 py-2 text-sm font-medium border-b-2 ${currentTab === "current" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setCurrentTab("current")}>
											Current Tasks
										</button>
										<button className={`px-3 py-2 text-sm font-medium border-b-2 ${currentTab === "completed" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`} onClick={() => setCurrentTab("completed")}>
											Completed Tasks
										</button>
									</div>
									<CreateButton title="Create Task" onClick={() => setShowCreateTaskDialog(true)} />
								</nav>
							</div>

							{/* Task List */}
							<div className="p-4">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
											<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{tasks.filter((task) => task.is_completed === (currentTab === "completed")).length === 0 ? (
											<tr>
												<td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
													No tasks available
												</td>
											</tr>
										) : (
											tasks
												.filter((task) => task.is_completed === (currentTab === "completed"))
												.map((task) => (
													<tr key={task.id}>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.createdDate}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.completionDate}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															<div className="flex space-x-2 justify-center">
																{!task.is_completed && <CompleteButton onClick={() => handleComplete(task.id)} />}
																{!task.is_completed && <EditButton onClick={() => handleEdit(task.id)} />}
																<DeleteButton onClick={() => handleDelete(task.id)} disabled={task.is_completed} />
															</div>
														</td>
													</tr>
												))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
