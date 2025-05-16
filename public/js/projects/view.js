document.addEventListener('DOMContentLoaded', () => {
  const deleteForms = document.querySelectorAll('.delete-comment-form');

  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Вы уверены, что хотите удалить комментарий?')) {
        e.preventDefault();
      }
    });
  });

  const commentForm = document.querySelector('.comment-form');

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      const textarea = commentForm.querySelector('textarea');

      if (textarea.value.trim().length < 5) {
        e.preventDefault();
        alert('Комментарий должен содержать не менее 5 символов');
        textarea.focus();
      }
    });
  }
});