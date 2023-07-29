import tkinter as tk
from tkinter import simpledialog, messagebox
import re

HTML_CONTENT = """<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Minha Loja Virtual</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="stars"></div>
        <h1>
            <img src="wklogo.png" alt="W.K SHOP Logo">
        </h1>
        <h2>Encontre os melhores produtos aqui!</h2>
        <div class="busca">
            <input type="text" placeholder="Digite um produto...">
            <button type="submit">Buscar</button>
        </div>
        <div class="carrinho">
            <p>Carrinho:</p>
            <ul></ul>
        </div>
    </header>
    <main>
        <div class="produtos">
            <div class="produto">
                <img src="produto1.jpg" alt="Calcinha rendada">
                <h2>Calcinha rendada</h2>
                <p class="preco">R$ 25.00</p>
                <div class="size-selection">
                    <label>Tamanho:</label>
                    <select>
                        <option value="pp">PP</option>
                        <option value="p">P</option>
                        <option value="m">M</option>
                        <option value="g">G</option>
                        <option value="gg">GG</option>
                        <option value="xg">XG</option>
                        <option value="xgg">XGG</option>
                        <option value="eg">EG</option>
                        <option value="egg">EGG</option>
                    </select>
                </div>
                <div class="color-selection">
                    <label>Cores:</label>
                    <select>
                        <option value="vermelho">Vermelho</option>
                        <option value="bege">Bege</option>
                        <option value="preto">Preto</option>
                    </select>
                </div>
                <button class="comprar" data-nome="Calcinha rendada" data-preco="25.00">Adicionar</button>
                <div class="avaliacao">
                    <h3>Avaliações</h3>
                    <p>5 estrelas</p>
                    <span class="favorito">★</span>
                </div>
            </div>
        </div>
        <!-- end of produtos -->
    </main>
    <footer>
        <p>&copy; 2023 W.K SHOP. Todos os direitos reservados.</p>
    </footer>
    <a href="https://wa.me/556792279577" id="whatsapp-button" target="_blank">
        <img src="whatslogo.png" alt="WhatsApp Logo">
    </a>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
    <script src="script.js"></script>
</body>
</html>"""

def add_product_to_html(html_content, product_details):
    product_template = f'''
<div class="produto">
    <img src="{product_details["image_src"]}" alt="{product_details["name"]}">
    <h2>{product_details["name"]}</h2>
    <p class="preco">R$ {product_details["price"]:.2f}</p>
    <div class="size-selection">
        <label>Tamanho:</label>
        <select>
            {"".join([f'<option value="{size.lower()}">{size.upper()}</option>' for size in product_details["sizes"]])}
        </select>
    </div>
    <div class="color-selection">
        <label>Cores:</label>
        <select>
            {"".join([f'<option value="{color.lower()}">{color.capitalize()}</option>' for color in product_details["colors"]])}
        </select>
    </div>
    <button class="comprar" data-nome="{product_details["name"]}" data-preco="{product_details["price"]:.2f}">Adicionar</button>
    <div class="avaliacao">
        <h3>Avaliações</h3>
        <p>5 estrelas</p>
        <span class="favorito">★</span>
    </div>
</div>
    '''
    return re.sub(r'(<!-- end of produtos -->)', product_template + r'\1', html_content)

# Restante do código segue inalterado...


def add_product():
    name = simpledialog.askstring("Entrada", "Nome do Produto:")
    if not name:  # If the user cancels the dialog
        return None
    
    price = simpledialog.askfloat("Entrada", "Preço do Produto (em R$):")
    image_src = simpledialog.askstring("Entrada", "Nome da Imagem (exemplo: produto1.jpg):")
    sizes = simpledialog.askstring("Entrada", "Tamanhos (separados por vírgula, exemplo: pp,p,m):").split(',')
    colors = simpledialog.askstring("Entrada", "Cores (separados por vírgula, exemplo: vermelho,bege,preto):").split(',')
    
    with open("index.html", "r", encoding="utf-8") as file:
        content = file.read()
        
    updated_content = add_product_to_html(content, {
        "name": name,
        "price": price,
        "image_src": image_src,
        "sizes": sizes,
        "colors": colors
    })
    
    with open("index.html", "w", encoding="utf-8") as file:
        file.write(updated_content)
    
    return True

root = tk.Tk()
root.withdraw()

messagebox.showinfo("Adicionar Produto", "Vamos adicionar novos produtos ao seu site!")

continue_adding = True

while continue_adding:
    success = add_product()
    if success:
        continue_adding = messagebox.askyesno("Continuar", "Produto adicionado com sucesso! Deseja adicionar outro produto?")
    else:
        continue_adding = False
