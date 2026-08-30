/**
 * main.ts
 *
 * Comportamento estático da landing page: link de download, ano do
 * rodapé e revelação suave dos cartões de recursos ao rolar a página.
 *
 * Compile para JavaScript antes do deploy, por exemplo:
 *   npx tsc main.ts --target ES2020 --module ES2020 --outFile main.js
 * ou use um bundler como Vite/esbuild. O index.html referencia "main.js".
 */

const DOWNLOAD_URL = "https://github.com/SEU_USUARIO/SEU_REPOSITORIO/releases/latest/download/ShopeeManager-Setup.exe";

/**
 * Gate de acesso (usuário + senha)
 *
 * AVISO IMPORTANTE: isto é uma camada de conveniência, não uma proteção
 * de verdade. Como o site é estático, qualquer pessoa com conhecimento
 * técnico pode ver o HTML completo pelo "Exibir código-fonte" mesmo com
 * o gate ativo, e o hash da senha fica visível no main.js. Use isto
 * apenas como uma segunda camada por cima do Cloudflare Access — nunca
 * como a única proteção para algo sensível.
 *
 * Troque GATE_USERNAME e GATE_PASSWORD_HASH abaixo antes de publicar.
 * Para gerar o hash da sua senha real, abra o console do navegador
 * (F12) em qualquer página e rode:
 *
 * crypto.subtle.digest("SHA-256", new TextEncoder().encode("Bugboo<3"))
 * .then(buf => console.log(Array.from(new Uint8Array(buf))
 * .map(b => b.toString(16).padStart(2, "0")).join("")));
 *
 * Copie o texto que aparecer no console e cole em GATE_PASSWORD_HASH.
 */
const GATE_USERNAME = "mostgirlsneed@gmail.com";
const GATE_PASSWORD_HASH = "5958db9f7ded73e356841a9357b2c18bd266f899fd88ef787b8f8fc528bf3e33";
const GATE_SESSION_KEY = "shopeemanager_acesso_liberado";

async function calcularHashSha256(texto: string): Promise<string> {
  const dados = new TextEncoder().encode(texto);
  const bufferHash = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(bufferHash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function configurarGateDeAcesso(): void {
  const form = document.querySelector<HTMLFormElement>("#gate-form");
  const campoUsuario = document.querySelector<HTMLInputElement>("#gate-user");
  const campoSenha = document.querySelector<HTMLInputElement>("#gate-pass");
  const mensagemErro = document.querySelector<HTMLParagraphElement>("#gate-error");

  if (!form || !campoUsuario || !campoSenha || !mensagemErro) return;

  if (sessionStorage.getItem(GATE_SESSION_KEY) === "sim") {
    document.body.classList.remove("is-locked");
    return;
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagemErro.textContent = "";

    const usuarioDigitado = campoUsuario.value.trim().toLowerCase();
    const hashDigitado = await calcularHashSha256(campoSenha.value);

    const usuarioCorreto = usuarioDigitado === GATE_USERNAME.toLowerCase();
    const senhaCorreta = hashDigitado === GATE_PASSWORD_HASH;

    if (usuarioCorreto && senhaCorreta) {
      sessionStorage.setItem(GATE_SESSION_KEY, "sim");
      document.body.classList.remove("is-locked");
    } else {
      mensagemErro.textContent = "Usuário ou senha incorretos.";
      campoSenha.value = "";
      campoSenha.focus();
    }
  });
}

function configurarBotoesDeDownload(): void {
  const botoes = document.querySelectorAll<HTMLAnchorElement>("[data-download-btn]");
  botoes.forEach((botao) => {
    botao.setAttribute("href", DOWNLOAD_URL);
    botao.addEventListener("click", () => {
      console.info("Download iniciado a partir de:", botao.textContent?.trim());
    });
  });
}

function atualizarAnoRodape(): void {
  const alvo = document.querySelector<HTMLSpanElement>("[data-year]");
  if (!alvo) return;
  alvo.textContent = String(new Date().getFullYear());
}

function revelarCartoesAoRolar(): void {
  const cartoes = document.querySelectorAll<HTMLElement>(".feature-card");
  if (cartoes.length === 0) return;

  const prefereMenosMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefereMenosMovimento || !("IntersectionObserver" in window)) {
    cartoes.forEach((cartao) => cartao.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  cartoes.forEach((cartao) => observer.observe(cartao));
}

function iniciar(): void {
  configurarGateDeAcesso();
  configurarBotoesDeDownload();
  atualizarAnoRodape();
  revelarCartoesAoRolar();
}

document.addEventListener("DOMContentLoaded", iniciar);
