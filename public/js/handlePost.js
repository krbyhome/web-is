document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const userList = document.getElementById('user-list');

    async function fetchUsers() {
        preloader.style.display = 'block';
        userList.innerHTML = '';

        const randomFilter = Math.random() < 0.5 ? '&id_lte=5' : '&id_gte=6';

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users?${randomFilter}`);
            if (!response.ok) {
                throw new Error('Network error');
            }
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            renderError('⚠ Что-то пошло не так');
        } finally {
            preloader.style.display = 'none';
        }
    }

    function renderUsers(users) {
        if (users.length === 0) {
            userList.innerHTML = '<p>Нет данных</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <p><strong>Имя:</strong> ${user.username}</p>
                <p><strong>Почта:</strong> ${user.email}</p>
                <p><strong>Компания:</strong> ${user.company.name}</p>
            `;
            userList.appendChild(userCard);
        });
    }

    function renderError(message) {
        userList.innerHTML = `<div class="error">${message}</div>`;
    }

    fetchUsers();
});