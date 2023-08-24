document.addEventListener('DOMContentLoaded', (event) => {
    loadFromLocalStorage();
    openTab('Lingerie');
    attachEventListeners();
});

let produtosCarrinho = [];

function openTab(tabName) {
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

function attachEventListeners() {
    const comprarButtons = document.querySelectorAll('.comprar');
    comprarButtons.forEach(button => {
        button.addEventListener('click', adicionarProduto);
    });

    const carrinho = document.querySelector('.carrinho');
    carrinho.addEventListener('click', event => {
        if (event.target.classList.contains('remover')) {
            removerProduto.call(event.target);
        } else if (event.target.classList.contains('comprarCarrinho')) {
            enviarMensagemWhatsApp();
        }
    });

    carrinho.addEventListener('change', event => {
        if (event.target.tagName === 'INPUT') {
            alterarQuantidade.call(event.target);
        }
    });
}

function adicionarProduto() {
    const nome = this.dataset.nome;
    const preco = this.dataset.preco;
    const produtoElement = this.closest('.produto');
    const tamanho = produtoElement.querySelector('.size-selection select').value;
    const cor = produtoElement.querySelector('.color-selection select').value;

    const produtoExistente = produtosCarrinho.find(produto => produto.nome === nome && produto.tamanho === tamanho && produto.cor === cor);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        produtosCarrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1,
            tamanho: tamanho,
            cor: cor
        });
    }
    saveToLocalStorage();
    atualizarCarrinho();
}

function removerProduto() {
    const nome = this.dataset.nome;
    const tamanho = this.dataset.tamanho;
    const cor = this.dataset.cor;
    produtosCarrinho = produtosCarrinho.filter(produto => !(produto.nome === nome && produto.tamanho === tamanho && produto.cor === cor));

    saveToLocalStorage();
    atualizarCarrinho();
}

function alterarQuantidade() {
    const nome = this.parentNode.parentNode.querySelector('span:first-child').textContent;
    const quantidade = parseInt(this.value);
    const produtoExistente = produtosCarrinho.find(produto => produto.nome === nome);
    produtoExistente.quantidade = quantidade;

    saveToLocalStorage();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const carrinho = document.querySelector('.carrinho ul');
    carrinho.innerHTML = '';

    if (produtosCarrinho.length === 0) {
        carrinho.innerHTML = '<li>O carrinho está vazio.</li>';
        return;
    }

    produtosCarrinho.forEach(produto => {
        const item = document.createElement('li');
        item.innerHTML = `
            <span>${produto.nome}</span>
            <span>R$ ${produto.preco}</span>
            <span class="quantidade">
                <input type="number" value="${produto.quantidade}" min="1">
                <button class="remover" data-nome="${produto.nome}" data-tamanho="${produto.tamanho}" data-cor="${produto.cor}">Remover</button>
            </span>
        `;
        carrinho.appendChild(item);
    });

    if (!document.querySelector('.comprarCarrinho')) {
        const botaoComprarCarrinho = document.createElement('button');
        botaoComprarCarrinho.textContent = 'Comprar Itens Selecionados';
        botaoComprarCarrinho.classList.add('comprarCarrinho');
        carrinho.appendChild(botaoComprarCarrinho);
    }
}

function enviarMensagemWhatsApp() {
    let mensagem = 'Olá, eu gostaria de comprar os seguintes itens:\n\n';
    produtosCarrinho.forEach(produto => {
        mensagem += `${produto.nome} - R$ ${produto.preco}\nQuantidade: ${produto.quantidade}\nTamanho: ${produto.tamanho}\nCor: ${produto.cor}\n\n`;
    });

    mensagem = encodeURIComponent(mensagem);
    window.open(`https://wa.me/556791910977?text=${mensagem}`);
}

function saveToLocalStorage() {
    localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
}

function loadFromLocalStorage() {
    if (localStorage.getItem('carrinho')) {
        produtosCarrinho = JSON.parse(localStorage.getItem('carrinho'));
        atualizarCarrinho();
    }
}
