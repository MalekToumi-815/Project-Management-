// Simple API helper to create a user
// Usage: const { ok, message } = await createUser(nom, prenom, email, motDePasse)
(function(){
	if (typeof window === 'undefined') return;

	function getAuthToken() {
		try {
			return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
		} catch (_) {
			return null;
		}
	}

	function withAuth(headers = {}) {
		const token = getAuthToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
		return headers;
	}

	async function createUser(nom, prenom, email, motDePasse) {
		const url = 'http://localhost:9090/users/signin';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nom, prenom, email, motDePasse })
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = {}; }

			const message = (data && data.message) ? data.message : (res.ok ? 'Success' : 'Request failed');
			return { ok: res.ok, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function loginUser(email, motDePasse) {
		const url = 'http://localhost:9090/auth/login';
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, mot_de_passe: motDePasse })
			});

			const text = await res.text();
			if (res.ok) {
				const token = (text || '').trim();
				return { ok: true, token };
			}

			// Try to extract error message from JSON, fallback to plain text
			let message = 'Login failed';
			try { const data = JSON.parse(text); message = data.message || message; } catch (_) { message = text || message; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// GET /projets/{id} — fetch project details
	async function getProject(id) {
		const url = `http://localhost:9090/projets/${encodeURIComponent(id)}`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Request failed';
			try { const err = text ? JSON.parse(text) : null; if (err && err.message) message = err.message; } catch (_) { if (text) message = text; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// GET /projets/{projetId}/taches — list tasks for a project
	async function getProjectTasks(projetId) {
		const url = `http://localhost:9090/projets/${encodeURIComponent(projetId)}/taches`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});
			const text = await res.text();
			if (res.ok) {
				let data = [];
				try { data = text ? JSON.parse(text) : []; } catch (_) { data = []; }
				return { ok: true, data };
			}
			let message = 'Request failed';
			try { const err = text ? JSON.parse(text) : null; if (err && err.message) message = err.message; } catch (_) { if (text) message = text; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// GET /projets/{id}/membres — list project members
	async function getProjectMembers(id) {
		const url = `http://localhost:9090/projets/${encodeURIComponent(id)}/membres`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});
			const text = await res.text();
			if (res.ok) {
				let data = [];
				try { data = text ? JSON.parse(text) : []; } catch (_) { data = []; }
				return { ok: true, data };
			}
			let message = 'Request failed';
			try { const err = text ? JSON.parse(text) : null; if (err && err.message) message = err.message; } catch (_) { if (text) message = text; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// GET /messages/{chatId} — list chat messages
	async function getChatMessages(chatId) {
		const url = `http://localhost:9090/messages/${encodeURIComponent(chatId)}`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});
			const text = await res.text();
			if (res.ok) {
				let data = [];
				try { data = text ? JSON.parse(text) : []; } catch (_) { data = []; }
				return { ok: true, data };
			}
			let message = 'Request failed';
			try { const err = text ? JSON.parse(text) : null; if (err && err.message) message = err.message; } catch (_) { if (text) message = text; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// DELETE /projets/{id}/membres/{userId} — retirer un membre (créateur)
	async function kickMember(projectId, userId) {
		const url = `http://localhost:9090/projets/${encodeURIComponent(projectId)}/membres/${encodeURIComponent(userId)}`;
		try {
			const res = await fetch(url, {
				method: 'DELETE',
				headers: withAuth({ 'Content-Type': 'application/json' })
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Member removed successfully' };
			}

			let message = 'Request failed';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// POST /messages/{chatId} — envoyer un message
	async function sendMessage(chatId, contenu) {
		const url = `http://localhost:9090/messages/${encodeURIComponent(chatId)}`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify({ contenu })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Failed to send message';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// PATCH /projets/{id} — mettre à jour (créateur uniquement)
	async function updateProject(id, updateData) {
		const url = `http://localhost:9090/projets/${encodeURIComponent(id)}`;
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify(updateData)
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Failed to update project';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// PATCH /taches/{id}/etat — changer l’état (créateur seul pour "terminee")
	async function updateTaskState(taskId, newState) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(taskId)}/etat`;
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify({ etat: newState })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Failed to update task state';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// PATCH /taches/{id} — mettre à jour une tâche
	async function updateTask(taskId, updateData) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(taskId)}`;
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify(updateData)
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Failed to update task';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// POST /taches/{projetId} — créer une tâche
	async function createTask(projetId, titre, description, deadline, priorite) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(projetId)}`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify({ titre, description, deadline, priorite })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data, message: 'Task created successfully' };
			}

			let message = 'Failed to create task';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}


	// GET /taches/{id} — obtenir les détails d'une tâche
	async function getTask(taskId) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(taskId)}`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Failed to get task';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// DELETE /taches/{id} — supprimer une tâche
	async function deleteTask(taskId) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(taskId)}`;
		try {
			const res = await fetch(url, {
				method: 'DELETE',
				headers: withAuth({ 'Content-Type': 'application/json' })
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Task deleted successfully' };
			}

			let message = 'Failed to delete task';
			try {
				const err = text ? JSON.parse(text) : null;
				if (err && err.message) message = err.message;
				else if (text) message = text;
			} catch (_) {
				if (text) message = text;
			}
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// GET /users/profile — profil utilisateur (auth)
	async function getUserProfileproject() {
		const url = `http://localhost:9090/users/profile`;
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: withAuth({ 'Accept': 'application/json' })
			});

			const text = await res.text();
			if (res.ok) {
				let data = null;
				try { data = text ? JSON.parse(text) : null; } catch (_) { data = null; }
				return { ok: true, data };
			}

			let message = 'Request failed';
			try { const err = text ? JSON.parse(text) : null; if (err && err.message) message = err.message; } catch (_) { if (text) message = text; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function getUserProfilehome() {
		const url = 'http://localhost:9090/users/profile';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found', user: null };
		}

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = {}; }

			if (res.ok) {
				// Return nom, prenom, and email
				const user = {
					nom: data.nom || '',
					prenom: data.prenom || '',
					email: data.email || ''
				};
				return { ok: true, user, message: 'Profile retrieved' };
			}

			const message = (data && data.message) ? data.message : 'Failed to retrieve profile';
			return { ok: false, message, user: null };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.', user: null };
		}
	}

	async function updateProfile(nom, prenom) {
		const url = 'http://localhost:9090/users/profile';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ nom, prenom })
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = {}; }

			if (res.ok) {
				const message = (data && data.message) ? data.message : 'Profile updated successfully';
				return { ok: true, message, user: data };
			}

			const message = (data && data.message) ? data.message : 'Failed to update profile';
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function updatePassword(oldPassword, newPassword) {
		const url = 'http://localhost:9090/users/password';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ oldPassword, newPassword })
			});

			let data = null;
			let text = null;
			try { 
				text = await res.text();
				data = text.length > 0 ? JSON.parse(text) : {};
			} catch (_) { 
				data = { message: text || 'Password updated' };
			}

			if (res.ok) {
				const message = (data && data.message) ? data.message : 'Password updated successfully';
				return { ok: true, message };
			}

			const message = (data && data.message) ? data.message : 'Failed to update password';
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function getUserCreatedProjects() {
		const url = 'http://localhost:9090/users/projets-created';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found', projects: [] };
		}

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = []; }

			if (res.ok) {
				return { ok: true, projects: data || [], message: 'Projects retrieved' };
			}

			const message = (data && data.message) ? data.message : 'Failed to retrieve projects';
			return { ok: false, message, projects: [] };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.', projects: [] };
		}
	}

	async function getUserJoinedProjects() {
		const url = 'http://localhost:9090/users/projets-joined';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found', projects: [] };
		}

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = []; }

			if (res.ok) {
				return { ok: true, projects: data || [], message: 'Projects retrieved' };
			}

			const message = (data && data.message) ? data.message : 'Failed to retrieve projects';
			return { ok: false, message, projects: [] };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.', projects: [] };
		}
	}

	async function getUserAssignedTasks() {
		const url = 'http://localhost:9090/users/taches-assignees';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found', tasks: [] };
		}

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = []; }

			if (res.ok) {
				return { ok: true, tasks: data || [], message: 'Tasks retrieved' };
			}

			const message = (data && data.message) ? data.message : 'Failed to retrieve tasks';
			return { ok: false, message, tasks: [] };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.', tasks: [] };
		}
	}

	async function joinProject(projectId) {
		const url = `http://localhost:9090/projets/${projectId}/join`;
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Successfully joined project' };
			}

			// Try to extract error message from JSON, fallback to plain text
			let message = 'Failed to join project';
			try { const data = JSON.parse(text); message = data.message || message; } catch (_) { message = text || message; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function createProject(nom, description) {
		const url = 'http://localhost:9090/projets';
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ nom, description })
			});

			let data = null;
			try { data = await res.json(); } catch (_) { data = {}; }

			if (res.ok) {
				const message = (data && data.message) ? data.message : 'Project created successfully';
				return { ok: true, message, project: data };
			}

			const message = (data && data.message) ? data.message : 'Failed to create project';
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function deleteProject(projectId) {
		const url = `http://localhost:9090/projets/${projectId}`;
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Project deleted successfully' };
			}

			// Try to extract error message from JSON, fallback to plain text
			let message = 'Failed to delete project';
			try { const data = JSON.parse(text); message = data.message || message; } catch (_) { message = text || message; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	async function leaveProject(projectId) {
		const url = `http://localhost:9090/projets/${projectId}/leave`;
		const token = localStorage.getItem('authToken');
		
		if (!token) {
			return { ok: false, message: 'No authentication token found' };
		}

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Successfully left project' };
			}

			// Try to extract error message from JSON, fallback to plain text
			let message = 'Failed to leave project';
			try { const data = JSON.parse(text); message = data.message || message; } catch (_) { message = text || message; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	// POST /taches/{id}/assigner — assign multiple members to a task
	async function assignTaskMembers(taskId, userIds) {
		const url = `http://localhost:9090/taches/${encodeURIComponent(taskId)}/assigner`;
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: withAuth({ 'Content-Type': 'application/json' }),
				body: JSON.stringify({ userIds })
			});

			const text = await res.text();
			if (res.ok) {
				return { ok: true, message: text || 'Members assigned successfully' };
			}

			let message = 'Failed to assign members';
			try { const data = JSON.parse(text); message = data.message || message; } catch (_) { message = text || message; }
			return { ok: false, message };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.' };
		}
	}

	window.loginUser = loginUser;
	window.getUserProfileproject = getUserProfileproject;
	window.getUserProfilehome = getUserProfilehome;
	window.updateProfile = updateProfile;
	window.updatePassword = updatePassword;
	window.getUserCreatedProjects = getUserCreatedProjects;
	window.getUserJoinedProjects = getUserJoinedProjects;
	window.getUserAssignedTasks = getUserAssignedTasks;
	window.joinProject = joinProject;
	window.createProject = createProject;
	window.deleteProject = deleteProject;
	window.leaveProject = leaveProject;
	window.getProject = getProject;
	window.getProjectTasks = getProjectTasks;
	window.getProjectMembers = getProjectMembers;
	window.getChatMessages = getChatMessages;
	window.kickMember = kickMember;
	window.sendMessage = sendMessage;
	window.updateProject = updateProject;
	window.updateTaskState = updateTaskState;
	window.updateTask = updateTask;
	window.createTask = createTask;
	window.getTask = getTask;
	window.deleteTask = deleteTask;
	window.assignTaskMembers = assignTaskMembers;
	window.createUser = createUser;
})();
