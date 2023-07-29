function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");

    attachEventListeners();
}

function attachEventListeners() {
    const buttons = document.querySelectorAll('.comprar');
    buttons.forEach(button => {
        button.removeEventListener('click', adicionarProduto);
        button.addEventListener('click', adicionarProduto);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    openTab(event, 'Lingerie');
    attachEventListeners();
});

let produtosCarrinho = [];

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

    atualizarCarrinho();
}

function atualizarCarrinho() {
    const carrinho = document.querySelector('.carrinho');
    const carrinhoVazio = document.querySelector('.carrinho-vazio');
    carrinho.innerHTML = '';

    if (produtosCarrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
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

    carrinhoVazio.style.display = 'none';
}

function removerProduto() {
    const nome = this.dataset.nome;
    const tamanho = this.dataset.tamanho;
    const cor = this.dataset.cor;

    produtosCarrinho = produtosCarrinho.filter(produto => !(produto.nome === nome && produto.tamanho === tamanho && produto.cor === cor));

    atualizarCarrinho();
}

function alterarQuantidade() {
    const nome = this.parentNode.parentNode.querySelector('span:first-child').textContent;
    const quantidade = parseInt(this.value);

    const produtoExistente = produtosCarrinho.find(produto => produto.nome === nome);
    produtoExistente.quantidade = quantidade;

    atualizarCarrinho();
}

document.addEventListener('click', event => {
    if (event.target.classList.contains('comprar')) {
        adicionarProduto.call(event.target);
    }
});

const carrinho = document.querySelector('.carrinho');
carrinho.addEventListener('click', event => {
    if (event.target.classList.contains('remover')) {
        removerProduto.call(event.target);
    }
});

carrinho.addEventListener('change', event => {
    if (event.target.tagName === 'INPUT') {
        alterarQuantidade.call(event.target);
    }
});

function enviarMensagemWhatsApp() {
    let mensagem = 'Olá, eu gostaria de comprar os seguintes itens:\n\n';

    produtosCarrinho.forEach(produto => {
        mensagem += `${produto.nome} - R$ ${produto.preco}\nQuantidade: ${produto.quantidade}\nTamanho: ${produto.tamanho}\nCor: ${produto.cor}\n\n`;
    });

    mensagem = encodeURIComponent(mensagem);
    window.open(`https://wa.me/556792279577?text=${mensagem}`);
}

carrinho.addEventListener('click', event => {
    if (event.target.classList.contains('comprarCarrinho')) {
        enviarMensagemWhatsApp();
    }
});
