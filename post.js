// Função para postar foto
function postarFoto() {
    const entradaFoto = document.getElementById('entradaFoto');
    const containerPosts = document.getElementById('containerPosts');

    if (entradaFoto.files && entradaFoto.files[0]) {
        const leitor = new FileReader();
        leitor.onload = function (e) {
            const postagem = criarPostagem(e.target.result);
            containerPosts.appendChild(postagem);

            // Salva o post no local storage
            salvarPostNoLocalStorage(e.target.result);
        };
        leitor.readAsDataURL(entradaFoto.files[0]);

        // Limpa a entrada de dados
        entradaFoto.value = '';
    } else {
        alert('Por favor, selecione uma foto.');
    }
}

// Função para criar a postagem
function criarPostagem(imagemSrc) {
    const postagem = document.createElement('div');
    postagem.classList.add('post');

    const img = document.createElement('img');
    img.src = imagemSrc;

    postagem.appendChild(img);

    const secaoComentario = document.createElement('div');
    secaoComentario.classList.add('secao-comentario');

    const novoInputComentario = document.createElement('input');
    novoInputComentario.type = 'text';
    novoInputComentario.placeholder = 'Adicione um comentário';
    novoInputComentario.classList.add('novo-input-comentario');

    const botaoComentar = document.createElement('button');
    botaoComentar.textContent = 'Comentar';
    botaoComentar.onclick = function() {
        adicionarComentario(secaoComentario, novoInputComentario);
        salvarComentariosNoLocalStorage();
    };

    secaoComentario.appendChild(novoInputComentario);
    secaoComentario.appendChild(botaoComentar);

    postagem.appendChild(secaoComentario);

    return postagem;
}

// Função para adicionar comentário
function adicionarComentario(secaoComentario, inputComentario) {
    if (inputComentario.value) {
        const novoComentario = document.createElement('div');
        novoComentario.textContent = inputComentario.value;
        novoComentario.classList.add('comentario');

        secaoComentario.appendChild(novoComentario);
        inputComentario.value = '';

        // Salva os comentários no local storage
        salvarComentariosNoLocalStorage();
    } else {
        alert('Por favor, adicione um comentário.');
    }
}

// Função para salvar posts no local storage
function salvarPostNoLocalStorage(imagemSrc) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ imagemSrc, comentarios: [] });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Função para salvar comentários no local storage
function salvarComentariosNoLocalStorage() {
    const containerPosts = document.getElementById('containerPosts');
    const posts = [];

    containerPosts.childNodes.forEach(postagem => {
        const img = postagem.querySelector('img').src;
        const comentarios = [];

        postagem.querySelectorAll('.comentario').forEach(comentario => {
            comentarios.push(comentario.textContent);
        });

        posts.push({ imagemSrc: img, comentarios });
    });

    localStorage.setItem('posts', JSON.stringify(posts));
}

// Função para carregar posts do local storage
function carregarPostsDoLocalStorage() {
    const containerPosts = document.getElementById('containerPosts');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.forEach(post => {
        const postagem = criarPostagem(post.imagemSrc);

        post.comentarios.forEach(comentarioTexto => {
            const novoComentario = document.createElement('div');
            novoComentario.textContent = comentarioTexto;
            novoComentario.classList.add('comentario');

            postagem.querySelector('.secao-comentario').appendChild(novoComentario);
        });

        containerPosts.appendChild(postagem);
    });
}

// Carregar posts quando a página é carregada
window.onload = carregarPostsDoLocalStorage;
