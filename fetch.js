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

	window.createUser = createUser;
	window.loginUser = loginUser;
	window.getProject = getProject;
	window.getProjectTasks = getProjectTasks;
	window.getProjectMembers = getProjectMembers;
	window.getChatMessages = getChatMessages;
	window.kickMember = kickMember;
	window.sendMessage = sendMessage;
	window.updateProject = updateProject;
	window.updateTaskState = updateTaskState;
})();
