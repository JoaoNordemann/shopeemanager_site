# Shopee Manager — Landing Page

Landing page estática de download do OfferPilot, aplicativo desktop de
curadoria e automação de ofertas para WhatsApp.

## Stack

- HTML5 semântico
- CSS puro (sem framework)
- TypeScript, compilado para JavaScript antes do deploy

## Estrutura

```
.
├── index.html   # Estrutura da página
├── style.css    # Estilos
├── main.ts      # Código-fonte TypeScript
└── main.js      # Gerado pela compilação (não editar direto)
```

## Como rodar localmente

1. Instale as dependências:
   ```
   npm install typescript
   ```
2. Compile o TypeScript:
   ```
   npx tsc main.ts --target ES2020
   ```
3. Sirva os arquivos:
   ```
   npx serve .
   ```
4. Abra o endereço mostrado no terminal (ex: `http://localhost:3000`).

Sempre que editar `main.ts`, repita o passo 2 para gerar um `main.js`
atualizado antes de publicar.

## Acesso restrito

A página tem duas camadas de proteção:

- **Cloudflare Access**, configurado por e-mail autorizado na frente do
  domínio — é a proteção real.
- Uma tela de usuário/senha no próprio `main.ts`, como reforço visual.
  Ela **não é segura sozinha**: como o site é estático, o hash da senha
  fica visível no código publicado. Veja os comentários em `main.ts`
  para trocar o usuário e gerar um novo hash de senha.

## Deploy

Publicado gratuitamente via GitHub Pages (Settings → Pages → branch
`main`, pasta `/root`). Basta enviar `index.html`, `style.css`, `main.ts`
e o `main.js` compilado para a branch principal.
