// Simple API helper to create a user
// Usage: const { ok, message } = await createUser(nom, prenom, email, motDePasse)
(function(){
	if (typeof window === 'undefined') return;

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

	async function getUserProfile() {
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
				// Return id, nom and prenom
				const user = {
					nom: data.nom || '',
					prenom: data.prenom || ''
				};
				return { ok: true, user, message: 'Profile retrieved' };
			}

			const message = (data && data.message) ? data.message : 'Failed to retrieve profile';
			return { ok: false, message, user: null };
		} catch (err) {
			return { ok: false, message: 'Network error. Please try again.', user: null };
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

	window.loginUser = loginUser;
	window.getUserProfile = getUserProfile;
	window.getUserCreatedProjects = getUserCreatedProjects;
	window.getUserJoinedProjects = getUserJoinedProjects;
	window.getUserAssignedTasks = getUserAssignedTasks;
	window.joinProject = joinProject;
	window.createProject = createProject;
})();
