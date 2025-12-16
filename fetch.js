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

	window.createUser = createUser;
	window.loginUser = loginUser;
})();
